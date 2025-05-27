-- Fix missing roles in profiles table and improve user creation
-- Run this migration to fix role assignment issues

-- 1. Set default role for any profiles missing a role
UPDATE profiles 
SET role = 'employee'::user_role,
    updated_at = NOW()
WHERE role IS NULL;

-- 2. Update any profiles that might have admin accounts but wrong role
UPDATE profiles 
SET role = 'admin'::user_role,
    updated_at = NOW()
WHERE email LIKE '%admin%' AND role != 'admin';

-- 3. Fix the handle_new_user function to better handle role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  user_role TEXT;
  first_name_val TEXT;
  last_name_val TEXT;
BEGIN
  -- Extract role from user metadata with better fallback logic
  user_role := COALESCE(
    NEW.raw_user_meta_data->>'role',
    NEW.raw_app_meta_data->>'role',
    'employee'
  );

  -- Extract name information
  first_name_val := COALESCE(
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );
  
  last_name_val := COALESCE(
    NEW.raw_user_meta_data->>'last_name',
    ''
  );

  -- Insert into profiles with comprehensive error handling
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    email, 
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    first_name_val,
    last_name_val,
    NEW.email,
    user_role::user_role,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    updated_at = NOW();
    
  RETURN NEW;
EXCEPTION
  WHEN invalid_text_representation THEN
    -- Handle invalid role enum, default to employee
    INSERT INTO public.profiles (
      id, first_name, last_name, email, role, created_at, updated_at
    )
    VALUES (
      NEW.id, first_name_val, last_name_val, NEW.email, 'employee'::user_role, NOW(), NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      role = 'employee'::user_role,
      updated_at = NOW();
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't prevent user creation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- 4. Ensure trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- 5. Update any existing users who might have metadata but missing profiles
DO $$
DECLARE
    user_record RECORD;
    user_role TEXT;
    first_name_val TEXT;
    last_name_val TEXT;
BEGIN
    FOR user_record IN 
        SELECT id, email, raw_user_meta_data, raw_app_meta_data
        FROM auth.users 
    LOOP
        -- Check if profile exists and update role if needed
        user_role := COALESCE(
            user_record.raw_user_meta_data->>'role',
            user_record.raw_app_meta_data->>'role',
            'employee'
        );
        
        first_name_val := COALESCE(
            user_record.raw_user_meta_data->>'first_name',
            user_record.raw_user_meta_data->>'full_name',
            split_part(user_record.email, '@', 1)
        );
        
        last_name_val := COALESCE(
            user_record.raw_user_meta_data->>'last_name',
            ''
        );

        -- Insert or update profile
        INSERT INTO public.profiles (
            id, first_name, last_name, email, role, created_at, updated_at
        )
        VALUES (
            user_record.id, first_name_val, last_name_val, user_record.email, 
            user_role::user_role, NOW(), NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            role = EXCLUDED.role,
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            updated_at = NOW()
        WHERE profiles.role IS NULL OR profiles.role != EXCLUDED.role;
        
    END LOOP;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error updating user profiles: %', SQLERRM;
END;
$$;

-- 6. Add helpful indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Verify the fix
SELECT id, email, role, first_name, last_name 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 5; 