-- Database fixes for HR Portal
-- Run this to fix authentication and database issues

-- First, ensure all necessary extensions are enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fix any potential issues with the profiles table structure
-- Ensure the table exists and has the correct structure
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS position TEXT,
  ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS hire_date DATE;

-- Ensure email column is properly set
UPDATE profiles SET email = (
  SELECT email FROM auth.users WHERE id = profiles.id
) WHERE email IS NULL OR email = '';

-- Drop and recreate RLS policies to ensure they work correctly
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

-- Create comprehensive RLS policies for profiles
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_view_authenticated" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Fix the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert into profiles with proper error handling
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
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'employee'::user_role),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
    
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't prevent user creation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Create profiles for any existing auth users that don't have profiles
INSERT INTO public.profiles (
  id, 
  first_name, 
  last_name, 
  email, 
  role,
  created_at,
  updated_at
)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'first_name', split_part(au.email, '@', 1)),
  COALESCE(au.raw_user_meta_data->>'last_name', ''),
  au.email,
  COALESCE((au.raw_user_meta_data->>'role')::user_role, 'employee'::user_role),
  NOW(),
  NOW()
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- Fix other table RLS policies that might be causing issues

-- Jobs table policies
DROP POLICY IF EXISTS "jobs_select_all" ON jobs;
CREATE POLICY "jobs_select_all" ON jobs
  FOR SELECT USING (true); -- Jobs should be viewable by everyone for public careers page

DROP POLICY IF EXISTS "jobs_insert_authenticated" ON jobs;
CREATE POLICY "jobs_insert_authenticated" ON jobs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "jobs_update_authenticated" ON jobs;
CREATE POLICY "jobs_update_authenticated" ON jobs
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Applications table policies
DROP POLICY IF EXISTS "applications_select_own" ON applications;
CREATE POLICY "applications_select_own" ON applications
  FOR SELECT USING (
    auth.role() = 'authenticated' OR 
    candidate_email = auth.email()
  );

DROP POLICY IF EXISTS "applications_insert_all" ON applications;
CREATE POLICY "applications_insert_all" ON applications
  FOR INSERT WITH CHECK (true); -- Allow anyone to apply

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.jobs TO anon;
GRANT INSERT ON public.applications TO anon;
GRANT SELECT ON public.profiles TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_email ON applications(candidate_email);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);

-- Update statistics
ANALYZE profiles;
ANALYZE jobs;
ANALYZE applications;

-- Log completion
SELECT 'Database fixes completed successfully' AS status; 