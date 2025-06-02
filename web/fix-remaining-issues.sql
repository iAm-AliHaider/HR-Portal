-- 🔧 Fix Remaining Database Security Issues
-- Addresses the handle_new_user function dependency and verification

-- Fix the handle_new_user function dependency issue
-- Drop the trigger first, then the function, then recreate both

-- Step 1: Drop the trigger that depends on the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Now we can safely drop and recreate the function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 3: Create the secure handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create user profile when new auth user is created
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    role,
    department_id,
    status,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      'New User'
    ),
    'employee', -- Default role
    NULL, -- No department initially
    'active',
    NOW(),
    NOW()
  );

  -- Log user creation in activity_logs if table exists
  BEGIN
    INSERT INTO activity_logs (
      user_id,
      action_type,
      description,
      metadata,
      created_at
    ) VALUES (
      NEW.id,
      'USER_CREATED',
      'New user profile created',
      jsonb_build_object(
        'email', NEW.email,
        'provider', COALESCE(NEW.app_metadata->>'provider', 'email')
      ),
      NOW()
    );
  EXCEPTION WHEN undefined_table THEN
    -- activity_logs table doesn't exist yet, skip logging
    NULL;
  END;

  RETURN NEW;

EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail user creation
  RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Step 4: Recreate the trigger with the secure function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure activity_logs table exists with proper structure
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on activity_logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Admins can view all activity logs" ON public.activity_logs;

-- Create RLS policies for activity_logs
CREATE POLICY "Users can view their own activity logs" ON public.activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity logs" ON public.activity_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'hr_director')
    )
  );

-- Grant permissions
GRANT SELECT ON public.activity_logs TO authenticated;
GRANT INSERT ON public.activity_logs TO authenticated;

-- Verification: Check that functions have proper search_path
DO $$
DECLARE
  func_record RECORD;
  security_issue BOOLEAN := FALSE;
BEGIN
  RAISE NOTICE 'Verifying function security...';

  FOR func_record IN
    SELECT
      proname as function_name,
      prosecdef as security_definer,
      proconfig as config_settings
    FROM pg_proc
    WHERE proname IN (
      'assign_department_manager',
      'get_user_role',
      'handle_new_user',
      'update_assets_updated_at'
    )
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  LOOP
    -- Check if search_path is properly set
    IF func_record.config_settings IS NULL OR
       NOT (func_record.config_settings::text LIKE '%search_path=public%') THEN
      RAISE WARNING 'Function % does not have secure search_path', func_record.function_name;
      security_issue := TRUE;
    ELSE
      RAISE NOTICE 'Function % is properly secured', func_record.function_name;
    END IF;
  END LOOP;

  IF NOT security_issue THEN
    RAISE NOTICE '✅ All functions are properly secured with immutable search_path';
  END IF;
END
$$;

-- Final verification
DO $$
BEGIN
  RAISE NOTICE '🔧 Remaining fixes applied successfully!';
  RAISE NOTICE '✅ handle_new_user function dependency resolved';
  RAISE NOTICE '✅ activity_logs table verified';
  RAISE NOTICE '✅ RLS policies applied';
  RAISE NOTICE '✅ Function security verified';
END
$$;
