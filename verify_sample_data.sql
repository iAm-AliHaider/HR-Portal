-- Sample Data Verification Script
-- Run this in your Supabase SQL Editor to verify test data was created

-- Check the test job postings
SELECT 
  title,
  department,
  location,
  type,
  salary_range,
  status,
  created_at
FROM public.jobs
ORDER BY created_at DESC;

-- Check the sample applications
SELECT 
  candidate_name,
  candidate_email,
  j.title as job_title,
  a.status,
  a.experience_years,
  a.applied_at
FROM public.applications a
JOIN public.jobs j ON a.job_id = j.id
ORDER BY a.applied_at DESC;

-- Check current users/profiles (should be empty until you create test accounts)
SELECT 
  email,
  role,
  first_name,
  last_name,
  department,
  position,
  created_at
FROM public.profiles
ORDER BY created_at DESC;

-- Check RLS policies are active
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('jobs', 'applications', 'profiles')
ORDER BY tablename, policyname;

-- Verify table sizes and row counts
SELECT 
  'jobs' as table_name, 
  count(*) as row_count 
FROM public.jobs
UNION ALL
SELECT 
  'applications' as table_name, 
  count(*) as row_count 
FROM public.applications
UNION ALL
SELECT 
  'profiles' as table_name, 
  count(*) as row_count 
FROM public.profiles;

-- Check if triggers are working (for automatic profile creation)
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  trigger_schema,
  action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
  AND event_object_table IN ('profiles')
  OR (trigger_schema = 'auth' AND event_object_table = 'users');

SELECT 'Sample data verification complete!' as status; 