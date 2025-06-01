-- QUICK AUTHENTICATION FIX - Handles existing policies gracefully
-- Run this in Supabase SQL Editor

-- 1. Fix the trigger function only
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    INSERT INTO public.profiles (
      id, 
      email, 
      first_name,
      last_name, 
      role,
      department,
      position,
      phone,
      hire_date,
      created_at, 
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(
        NEW.raw_user_meta_data->>'firstName',
        NEW.raw_user_meta_data->>'first_name',
        split_part(NEW.email, '@', 1)
      ),
      COALESCE(
        NEW.raw_user_meta_data->>'lastName',
        NEW.raw_user_meta_data->>'last_name',
        ''
      ),
      COALESCE(NEW.raw_user_meta_data->>'role', 'employee')::user_role,
      COALESCE(NEW.raw_user_meta_data->>'department', 'General'),
      COALESCE(NEW.raw_user_meta_data->>'position', 'Employee'),
      NEW.raw_user_meta_data->>'phone',
      COALESCE((NEW.raw_user_meta_data->>'hireDate')::date, CURRENT_DATE),
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
      last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
      updated_at = NOW();
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Profile creation error for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- 2. Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Clean up duplicate email issues first
DO $$
DECLARE
  duplicate_email TEXT;
  profile_to_keep RECORD;
BEGIN
  -- Find and handle duplicate emails
  FOR duplicate_email IN 
    SELECT email 
    FROM public.profiles 
    GROUP BY email 
    HAVING COUNT(*) > 1
  LOOP
    -- Keep the most recent profile for each duplicate email
    SELECT INTO profile_to_keep *
    FROM public.profiles 
    WHERE email = duplicate_email 
    ORDER BY created_at DESC 
    LIMIT 1;
    
    -- Delete older duplicates
    DELETE FROM public.profiles 
    WHERE email = duplicate_email 
    AND id != profile_to_keep.id;
    
    RAISE NOTICE 'Cleaned up duplicate email: %', duplicate_email;
  END LOOP;
END $$;

-- 4. Fix orphaned users by creating profiles (with better conflict handling)
DO $$
DECLARE
  auth_user RECORD;
BEGIN
  -- Loop through auth users without profiles
  FOR auth_user IN 
    SELECT u.*
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE p.id IS NULL
      AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = u.email)
  LOOP
    BEGIN
      INSERT INTO public.profiles (
        id,
        email,
        first_name, 
        last_name,
        role,
        department,
        position,
        hire_date,
        created_at,
        updated_at
      )
      VALUES (
        auth_user.id,
        auth_user.email,
        COALESCE(auth_user.raw_user_meta_data->>'firstName', auth_user.raw_user_meta_data->>'first_name', split_part(auth_user.email, '@', 1)),
        COALESCE(auth_user.raw_user_meta_data->>'lastName', auth_user.raw_user_meta_data->>'last_name', ''),
        COALESCE(auth_user.raw_user_meta_data->>'role', 'employee')::user_role,
        COALESCE(auth_user.raw_user_meta_data->>'department', 'General'),
        COALESCE(auth_user.raw_user_meta_data->>'position', 'Employee'),
        CURRENT_DATE,
        NOW(),
        NOW()
      );
      
      RAISE NOTICE 'Created profile for user: %', auth_user.email;
    EXCEPTION
      WHEN unique_violation THEN
        RAISE NOTICE 'Skipped duplicate for user: %', auth_user.email;
    END;
  END LOOP;
END $$;

-- Success message
SELECT 
  'Trigger function fixed and orphaned users handled!' as status,
  'Registration should now work properly' as result; 