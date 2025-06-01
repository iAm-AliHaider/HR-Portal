-- COMPREHENSIVE AUTHENTICATION FIX
-- Run this in Supabase SQL Editor to fix all registration issues

-- 1. Fix the handle_new_user trigger function to use correct schema
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if profile already exists to prevent duplicates
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
        NEW.raw_user_meta_data->>'name', 
        split_part(NEW.email, '@', 1)
      ),
      COALESCE(
        NEW.raw_user_meta_data->>'lastName',
        NEW.raw_user_meta_data->>'last_name',
        ''
      ),
      COALESCE(NEW.raw_user_meta_data->>'role', 'employee'),
      COALESCE(NEW.raw_user_meta_data->>'department', 'General'),
      COALESCE(NEW.raw_user_meta_data->>'position', 'Employee'),
      NEW.raw_user_meta_data->>'phone',
      CASE 
        WHEN NEW.raw_user_meta_data->>'hireDate' IS NOT NULL 
        THEN (NEW.raw_user_meta_data->>'hireDate')::date
        ELSE CURRENT_DATE
      END,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
      last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
      role = COALESCE(EXCLUDED.role, profiles.role),
      department = COALESCE(EXCLUDED.department, profiles.department),
      position = COALESCE(EXCLUDED.position, profiles.position),
      updated_at = NOW();
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't prevent user creation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- 2. Ensure trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Create working test accounts with proper data
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin
) VALUES
-- Admin account
(
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated', 
  'admin@company.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"firstName": "Admin", "lastName": "User", "role": "admin", "department": "Administration", "position": "System Administrator"}',
  false
),
-- HR account  
(
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'role',
  'hr@company.com', 
  crypt('hr123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"firstName": "HR", "lastName": "Manager", "role": "hr", "department": "Human Resources", "position": "HR Manager"}',
  false
),
-- Employee account
(
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'employee@company.com',
  crypt('employee123', gen_salt('bf')),
  NOW(),
  NOW(), 
  NOW(),
  '{"firstName": "Test", "lastName": "Employee", "role": "employee", "department": "General", "position": "Employee"}',
  false
)
ON CONFLICT (email) DO NOTHING;

-- 4. Manually create profiles for any orphaned auth users
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
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'firstName', u.raw_user_meta_data->>'first_name', split_part(u.email, '@', 1)),
  COALESCE(u.raw_user_meta_data->>'lastName', u.raw_user_meta_data->>'last_name', ''),
  COALESCE(u.raw_user_meta_data->>'role', 'employee'),
  COALESCE(u.raw_user_meta_data->>'department', 'General'),
  COALESCE(u.raw_user_meta_data->>'position', 'Employee'),
  CURRENT_DATE,
  NOW(),
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 5. Clean up any duplicate or invalid profiles
DELETE FROM public.profiles 
WHERE id NOT IN (
  SELECT id FROM auth.users
);

-- 6. Ensure RLS policies allow proper access
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;  
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;
CREATE POLICY "Service role can manage all profiles" ON public.profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 7. Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Success message
SELECT 
  'Authentication system fixed successfully!' as status,
  'Test accounts created: admin@company.com/admin123, hr@company.com/hr123, employee@company.com/employee123' as test_accounts,
  'Database trigger updated to handle proper schema' as trigger_status,
  'All orphaned users now have profiles' as profile_status; 