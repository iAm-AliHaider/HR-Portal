-- 🔒 HR Portal Database Security Fixes
-- Addresses Supabase linter security warnings
-- Fixes function search_path vulnerabilities

-- Begin transaction for atomic updates
BEGIN;

-- ========================================
-- Fix 1: assign_department_manager function
-- ========================================
DROP FUNCTION IF EXISTS public.assign_department_manager(UUID, UUID);

CREATE OR REPLACE FUNCTION public.assign_department_manager(
  user_id UUID,
  department_id UUID
)
RETURNS VOID
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Validate inputs
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;

  IF department_id IS NULL THEN
    RAISE EXCEPTION 'Department ID cannot be null';
  END IF;

  -- Update user profile with department assignment
  UPDATE user_profiles
  SET
    department_id = assign_department_manager.department_id,
    updated_at = NOW()
  WHERE id = assign_department_manager.user_id;

  -- Check if user was found and updated
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found: %', user_id;
  END IF;

  -- Log the assignment for audit trail
  INSERT INTO activity_logs (
    user_id,
    action_type,
    description,
    metadata,
    created_at
  ) VALUES (
    assign_department_manager.user_id,
    'DEPARTMENT_ASSIGNMENT',
    'User assigned to department',
    jsonb_build_object(
      'department_id', assign_department_manager.department_id,
      'assigned_by', auth.uid()
    ),
    NOW()
  );

END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.assign_department_manager(UUID, UUID) TO authenticated;

-- ========================================
-- Fix 2: get_user_role function
-- ========================================
DROP FUNCTION IF EXISTS public.get_user_role(UUID);

CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Validate input
  IF user_id IS NULL THEN
    RETURN 'employee'; -- Default fallback
  END IF;

  -- Get user role from profiles table
  SELECT role INTO user_role
  FROM user_profiles
  WHERE id = get_user_role.user_id
  AND deleted_at IS NULL; -- Exclude soft-deleted users

  -- Return role or default to 'employee'
  RETURN COALESCE(user_role, 'employee');

EXCEPTION WHEN OTHERS THEN
  -- Log error and return safe default
  RAISE WARNING 'Error getting user role for %: %', user_id, SQLERRM;
  RETURN 'employee';
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;

-- ========================================
-- Fix 3: handle_new_user function (trigger)
-- ========================================
DROP FUNCTION IF EXISTS public.handle_new_user();

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

  -- Log user creation
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

  RETURN NEW;

EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail user creation
  RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Recreate trigger with secure function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- Fix 4: update_assets_updated_at function
-- ========================================
DROP FUNCTION IF EXISTS public.update_assets_updated_at();

CREATE OR REPLACE FUNCTION public.update_assets_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update the updated_at timestamp
  NEW.updated_at = NOW();

  -- Log the update for audit trail
  INSERT INTO activity_logs (
    user_id,
    action_type,
    description,
    metadata,
    created_at
  ) VALUES (
    COALESCE(NEW.updated_by, auth.uid()),
    'ASSET_UPDATED',
    'Asset information updated',
    jsonb_build_object(
      'asset_id', NEW.id,
      'asset_name', NEW.name,
      'changes', jsonb_build_object(
        'old_values', to_jsonb(OLD),
        'new_values', to_jsonb(NEW)
      )
    ),
    NOW()
  );

  RETURN NEW;

EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the update
  RAISE WARNING 'Error in update_assets_updated_at for asset %: %', NEW.id, SQLERRM;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply trigger to assets table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'assets') THEN
    DROP TRIGGER IF EXISTS update_assets_updated_at ON assets;
    CREATE TRIGGER update_assets_updated_at
      BEFORE UPDATE ON assets
      FOR EACH ROW EXECUTE FUNCTION public.update_assets_updated_at();
  END IF;
END
$$;

-- ========================================
-- Additional Security Enhancements
-- ========================================

-- Create activity_logs table if it doesn't exist
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

-- Create RLS policy for activity_logs
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

-- ========================================
-- Verification Queries
-- ========================================

-- Check that all functions have immutable search_path
DO $$
DECLARE
  func_record RECORD;
  security_issue BOOLEAN := FALSE;
BEGIN
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

  IF security_issue THEN
    RAISE EXCEPTION 'Security issues found in functions. Please review.';
  ELSE
    RAISE NOTICE 'All functions are properly secured with immutable search_path';
  END IF;
END
$$;

-- Commit all changes
COMMIT;

-- Final success message
DO $$
BEGIN
  RAISE NOTICE '🔒 Database security fixes applied successfully!';
  RAISE NOTICE '✅ All functions now have immutable search_path';
  RAISE NOTICE '✅ Enhanced error handling and logging added';
  RAISE NOTICE '✅ Activity logging table created';
  RAISE NOTICE '✅ Row Level Security policies applied';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Configure Auth OTP expiry in Supabase Dashboard';
  RAISE NOTICE '2. Enable leaked password protection';
  RAISE NOTICE '3. Run security verification tests';
END
$$;
