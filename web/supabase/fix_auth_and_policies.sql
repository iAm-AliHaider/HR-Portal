-- Comprehensive Fix for Authentication and RLS Policies
-- This fixes the infinite recursion issue and ensures proper user-profile linking

-- First, drop all existing problematic policies to prevent conflicts
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Drop all existing policies on profiles table
    FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.schemaname || '.' || r.tablename;
    END LOOP;
END $$;

-- Drop the trigger temporarily to recreate it properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the user profile creation function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if profile already exists to prevent duplicates
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    INSERT INTO public.profiles (
      id, 
      email, 
      name, 
      role,
      created_at, 
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(
        NEW.raw_user_meta_data->>'name', 
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1)
      ),
      COALESCE(NEW.raw_user_meta_data->>'role', 'employee'),
      NOW(),
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create simple, non-recursive RLS policies for profiles
-- Policy 1: Allow users to read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 3: Allow authenticated users to view basic profile info of others (for directory purposes)
CREATE POLICY "Authenticated users can view basic profiles"
  ON public.profiles
  FOR SELECT
  USING (
    auth.role() = 'authenticated' 
    AND (
      id = auth.uid() 
      OR current_setting('request.jwt.claims', true)::json->>'role' IN ('admin', 'hr', 'manager')
    )
  );

-- Policy 4: Allow profile creation during signup
CREATE POLICY "Allow profile creation"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = id
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- Create safe policies for other tables without recursive profile lookups
-- Departments - simple policies
DROP POLICY IF EXISTS "Admin and HR can view all data" ON public.departments;
CREATE POLICY "Departments viewable by authenticated users"
  ON public.departments
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Departments manageable by admin and hr"
  ON public.departments
  FOR ALL
  USING (
    current_setting('request.jwt.claims', true)::json->>'role' IN ('admin', 'hr')
  );

-- Leave requests - employee can view/create own, managers can view team
DROP POLICY IF EXISTS "Admin and HR can view all data" ON public.leave_requests;
CREATE POLICY "Employee leave requests"
  ON public.leave_requests
  FOR SELECT
  USING (
    employee_id = auth.uid()
    OR current_setting('request.jwt.claims', true)::json->>'role' IN ('admin', 'hr', 'manager')
  );

CREATE POLICY "Employee can create leave requests"
  ON public.leave_requests
  FOR INSERT
  WITH CHECK (employee_id = auth.uid());

CREATE POLICY "Employee can update own leave requests"
  ON public.leave_requests
  FOR UPDATE
  USING (
    employee_id = auth.uid()
    OR current_setting('request.jwt.claims', true)::json->>'role' IN ('admin', 'hr', 'manager')
  );

-- Loan applications - similar pattern
DROP POLICY IF EXISTS "Admin and HR can view all data" ON public.loan_applications;
CREATE POLICY "Employee loan applications"
  ON public.loan_applications
  FOR SELECT
  USING (
    employee_id = auth.uid()
    OR current_setting('request.jwt.claims', true)::json->>'role' IN ('admin', 'hr', 'finance')
  );

CREATE POLICY "Employee can create loan applications"
  ON public.loan_applications
  FOR INSERT
  WITH CHECK (employee_id = auth.uid());

-- Training enrollments
DROP POLICY IF EXISTS "Admin and HR can view all data" ON public.course_enrollments;
CREATE POLICY "Employee course enrollments"
  ON public.course_enrollments
  FOR SELECT
  USING (
    employee_id = auth.uid()
    OR current_setting('request.jwt.claims', true)::json->>'role' IN ('admin', 'hr')
  );

CREATE POLICY "Employee can enroll in courses"
  ON public.course_enrollments
  FOR INSERT
  WITH CHECK (employee_id = auth.uid());

-- Requests table
DROP POLICY IF EXISTS "Admin and HR can view all data" ON public.requests;
CREATE POLICY "Employee requests"
  ON public.requests
  FOR SELECT
  USING (
    requester_id = auth.uid()
    OR current_setting('request.jwt.claims', true)::json->>'role' IN ('admin', 'hr', 'manager')
  );

CREATE POLICY "Employee can create requests"
  ON public.requests
  FOR INSERT
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Employee can update own requests"
  ON public.requests
  FOR UPDATE
  USING (
    requester_id = auth.uid()
    OR current_setting('request.jwt.claims', true)::json->>'role' IN ('admin', 'hr', 'manager')
  );

-- Make sure basic lookup tables are readable by all authenticated users
CREATE POLICY "Authenticated users can view leave types"
  ON public.leave_types
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view request categories"
  ON public.request_categories
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view request types"
  ON public.request_types
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view loan programs"
  ON public.loan_programs
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view training courses"
  ON public.training_courses
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view departments"
  ON public.departments
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create some test users with proper profiles
-- Admin user
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
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin-user-id-12345',
  'authenticated',
  'authenticated', 
  'admin@company.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"role": "admin", "name": "System Administrator"}'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Insert admin profile
INSERT INTO public.profiles (
  id,
  email,
  name,
  role,
  department,
  position,
  created_at,
  updated_at
) VALUES (
  'admin-user-id-12345',
  'admin@company.com',
  'System Administrator',
  'admin',
  'IT',
  'System Administrator',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  name = 'System Administrator',
  department = 'IT',
  position = 'System Administrator',
  updated_at = NOW();

-- HR user
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
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'hr-user-id-12345',
  'authenticated',
  'authenticated',
  'hr@company.com',
  crypt('hr123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"role": "hr", "name": "HR Manager"}'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Insert HR profile
INSERT INTO public.profiles (
  id,
  email,
  name,
  role,
  department,
  position,
  created_at,
  updated_at
) VALUES (
  'hr-user-id-12345',
  'hr@company.com',
  'HR Manager',
  'hr',
  'Human Resources',
  'HR Manager',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'hr',
  name = 'HR Manager',
  department = 'Human Resources',
  position = 'HR Manager',
  updated_at = NOW();

-- Employee user
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
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'employee-user-id-12345',
  'authenticated',
  'authenticated',
  'employee@company.com',
  crypt('employee123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"role": "employee", "name": "John Employee"}'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Insert employee profile
INSERT INTO public.profiles (
  id,
  email,
  name,
  role,
  department,
  position,
  created_at,
  updated_at
) VALUES (
  'employee-user-id-12345',
  'employee@company.com',
  'John Employee',
  'employee',
  'Engineering',
  'Software Developer',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'employee',
  name = 'John Employee',
  department = 'Engineering',
  position = 'Software Developer',
  updated_at = NOW();

-- Update existing profiles that might have NULL roles
UPDATE public.profiles 
SET role = 'employee' 
WHERE role IS NULL OR role = '';

-- Create a function to safely get user role without recursion
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role 
  FROM public.profiles 
  WHERE id = user_id;
  
  RETURN COALESCE(user_role, 'employee');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee ON public.leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON public.requests(requester_id);

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema'; 