-- HR Portal Seed Data for Supabase (Local/Dev Friendly)

-- This ensures that the auth.profiles_id_fkey constraint won't block profile creation
-- This would have been applied with the 20240607_drop_profiles_id_fkey.sql migration
DO $$
BEGIN
  -- Attempt to drop the constraint if it exists (ignoring errors if it doesn't)
  BEGIN
    ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
  EXCEPTION WHEN OTHERS THEN
    -- Do nothing if there's an error
  END;
END $$;

-- Insert profiles (use explicit UUIDs)
INSERT INTO public.profiles (id, first_name, last_name, email, role, department, position, hire_date)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Admin', 'User', 'admin@hrportal.com', 'admin', 'Administration', 'System Administrator', '2020-01-01'),
  ('00000000-0000-0000-0000-000000000002', 'HR', 'Manager', 'hr@hrportal.com', 'hr', 'Human Resources', 'HR Director', '2020-02-01'),
  ('00000000-0000-0000-0000-000000000003', 'Engineering', 'Manager', 'manager@hrportal.com', 'manager', 'Engineering', 'Engineering Manager', '2020-03-01'),
  ('00000000-0000-0000-0000-000000000004', 'Regular', 'Employee', 'employee@hrportal.com', 'employee', 'Engineering', 'Software Developer', '2021-01-15'),
  ('00000000-0000-0000-0000-000000000005', 'Talent', 'Recruiter', 'recruiter@hrportal.com', 'recruiter', 'Human Resources', 'Talent Acquisition Specialist', '2021-02-15')
ON CONFLICT DO NOTHING;

-- Insert employees
INSERT INTO public.employees (id, profile_id, employee_id, status, salary, location, start_date, employment_type)
VALUES
  (uuid_generate_v4(), '00000000-0000-0000-0000-000000000001', 'EMP001', 'active', 120000, 'New York', '2020-01-01', 'Full-time'),
  (uuid_generate_v4(), '00000000-0000-0000-0000-000000000002', 'EMP002', 'active', 110000, 'New York', '2020-02-01', 'Full-time'),
  (uuid_generate_v4(), '00000000-0000-0000-0000-000000000003', 'EMP003', 'active', 115000, 'Remote', '2020-03-01', 'Full-time'),
  (uuid_generate_v4(), '00000000-0000-0000-0000-000000000004', 'EMP004', 'active', 95000, 'Remote', '2021-01-15', 'Full-time'),
  (uuid_generate_v4(), '00000000-0000-0000-0000-000000000005', 'EMP005', 'active', 85000, 'New York', '2021-02-15', 'Full-time')
ON CONFLICT DO NOTHING;

-- Insert jobs
INSERT INTO public.jobs (id, title, department, location, type, status, description, requirements, salary_range, posted_by, closing_date)
VALUES
  (uuid_generate_v4(), 'Senior Software Engineer', 'Engineering', 'Remote', 'Full-time', 'open', 'We are looking for a Senior Software Engineer to join our team...', 'At least 5 years of experience with modern JavaScript frameworks...', '$120k - $150k', '00000000-0000-0000-0000-000000000005', CURRENT_DATE + INTERVAL '30 days'),
  (uuid_generate_v4(), 'Product Designer', 'Design', 'New York', 'Full-time', 'open', 'Join our design team to create beautiful user experiences...', 'Portfolio showing UX/UI work and proficiency with design tools...', '$90k - $120k', '00000000-0000-0000-0000-000000000005', CURRENT_DATE + INTERVAL '30 days'),
  (uuid_generate_v4(), 'DevOps Engineer', 'Engineering', 'Remote', 'Full-time', 'open', 'Help us build and maintain our cloud infrastructure...', 'Experience with AWS, Docker, Kubernetes, and CI/CD pipelines...', '$110k - $140k', '00000000-0000-0000-0000-000000000005', CURRENT_DATE + INTERVAL '30 days'),
  (uuid_generate_v4(), 'HR Specialist', 'Human Resources', 'New York', 'Full-time', 'open', 'Join our HR team to help with recruitment and employee relations...', 'Previous HR experience and knowledge of labor laws...', '$70k - $90k', '00000000-0000-0000-0000-000000000002', CURRENT_DATE + INTERVAL '30 days'),
  (uuid_generate_v4(), 'Marketing Manager', 'Marketing', 'Hybrid', 'Full-time', 'open', 'Lead our marketing efforts to drive growth...', 'Experience with digital marketing, SEO, and content strategy...', '$90k - $110k', '00000000-0000-0000-0000-000000000005', CURRENT_DATE + INTERVAL '30 days');

-- Insert applications
INSERT INTO public.applications (id, job_id, candidate_name, candidate_email, resume_url, status, experience_years, applied_at)
SELECT 
  uuid_generate_v4(), 
  id, 
  'John Doe', 
  'john.doe@example.com', 
  'https://example.com/resumes/johndoe.pdf', 
  'under_review', 
  7, 
  CURRENT_TIMESTAMP - INTERVAL '5 days'
FROM public.jobs 
WHERE title = 'Senior Software Engineer' 
LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.applications (id, job_id, candidate_name, candidate_email, resume_url, status, experience_years, applied_at)
SELECT 
  uuid_generate_v4(), 
  id, 
  'Jane Smith', 
  'jane.smith@example.com', 
  'https://example.com/resumes/janesmith.pdf', 
  'interview_scheduled', 
  6, 
  CURRENT_TIMESTAMP - INTERVAL '6 days'
FROM public.jobs 
WHERE title = 'Senior Software Engineer' 
LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.applications (id, job_id, candidate_name, candidate_email, resume_url, status, experience_years, applied_at)
SELECT 
  uuid_generate_v4(), 
  id, 
  'Mike Johnson', 
  'mike.johnson@example.com', 
  'https://example.com/resumes/mikejohnson.pdf', 
  'under_review', 
  4, 
  CURRENT_TIMESTAMP - INTERVAL '3 days'
FROM public.jobs 
WHERE title = 'Product Designer' 
LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.applications (id, job_id, candidate_name, candidate_email, resume_url, status, experience_years, applied_at)
SELECT 
  uuid_generate_v4(), 
  id, 
  'Sarah Williams', 
  'sarah.williams@example.com', 
  'https://example.com/resumes/sarahwilliams.pdf', 
  'pending', 
  5, 
  CURRENT_TIMESTAMP - INTERVAL '1 day'
FROM public.jobs 
WHERE title = 'DevOps Engineer' 
LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.applications (id, job_id, candidate_name, candidate_email, resume_url, status, experience_years, applied_at)
SELECT 
  uuid_generate_v4(), 
  id, 
  'David Brown', 
  'david.brown@example.com', 
  'https://example.com/resumes/davidbrown.pdf', 
  'under_review', 
  3, 
  CURRENT_TIMESTAMP - INTERVAL '4 days'
FROM public.jobs 
WHERE title = 'HR Specialist' 
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- Insert interviews
DO $$
DECLARE
  app_id UUID;
  job_id UUID;
BEGIN
  SELECT id INTO app_id FROM public.applications WHERE candidate_email = 'jane.smith@example.com' LIMIT 1;
  SELECT id INTO job_id FROM public.jobs WHERE title = 'Senior Software Engineer' LIMIT 1;
  IF app_id IS NOT NULL AND job_id IS NOT NULL THEN
    INSERT INTO public.interviews (
      id, application_id, interviewer_id, candidate_name, candidate_email, position, job_id, 
      stage, type, scheduled_at, duration, location, status
    )
    VALUES (
      uuid_generate_v4(), 
      app_id, 
      '00000000-0000-0000-0000-000000000003', 
      'Jane Smith', 
      'jane.smith@example.com', 
      'Senior Software Engineer', 
      job_id, 
      'technical', 
      'video', 
      CURRENT_TIMESTAMP + INTERVAL '2 days', 
      60, 
      'video-zoom', 
      'scheduled'
    );
  END IF;
END $$;

-- Insert leave requests
DO $$
DECLARE
  emp_id UUID;
BEGIN
  SELECT id INTO emp_id FROM public.employees WHERE employee_id = 'EMP004' LIMIT 1;
  IF emp_id IS NOT NULL THEN
    INSERT INTO public.leave_requests (
      id, employee_id, type, start_date, end_date, days, status, reason, manager_id
    )
    VALUES (
      uuid_generate_v4(), 
      emp_id, 
      'Annual Leave', 
      CURRENT_DATE + INTERVAL '14 days', 
      CURRENT_DATE + INTERVAL '21 days', 
      5, 
      'pending', 
      'Family vacation',
      '00000000-0000-0000-0000-000000000003'
    );
  END IF;
  SELECT id INTO emp_id FROM public.employees WHERE employee_id = 'EMP005' LIMIT 1;
  IF emp_id IS NOT NULL THEN
    INSERT INTO public.leave_requests (
      id, employee_id, type, start_date, end_date, days, status, reason, manager_id
    )
    VALUES (
      uuid_generate_v4(), 
      emp_id, 
      'Sick Leave', 
      CURRENT_DATE - INTERVAL '5 days', 
      CURRENT_DATE - INTERVAL '3 days', 
      3, 
      'approved', 
      'Flu',
      '00000000-0000-0000-0000-000000000002'
    );
  END IF;
END $$;

-- Insert training courses
INSERT INTO public.training_courses (id, title, category, description, duration, instructor, capacity, status, start_date, end_date, created_by)
VALUES
  (uuid_generate_v4(), 
   'Leadership Skills', 
   'Professional Development', 
   'Learn essential leadership skills for the modern workplace', 
   '2 days', 
   'Jennifer Lee', 
   20, 
   'active', 
   CURRENT_DATE + INTERVAL '30 days', 
   CURRENT_DATE + INTERVAL '32 days',
   '00000000-0000-0000-0000-000000000002'),
  (uuid_generate_v4(), 
   'Advanced JavaScript', 
   'Technical', 
   'Deep dive into modern JavaScript features and frameworks', 
   '4 weeks', 
   'Michael Chen', 
   15, 
   'active', 
   CURRENT_DATE + INTERVAL '14 days', 
   CURRENT_DATE + INTERVAL '42 days',
   '00000000-0000-0000-0000-000000000003'),
  (uuid_generate_v4(), 
   'Workplace Safety', 
   'Compliance', 
   'Essential safety training for all employees', 
   '1 day', 
   'Robert Johnson', 
   30, 
   'active', 
   CURRENT_DATE + INTERVAL '7 days', 
   CURRENT_DATE + INTERVAL '8 days',
   '00000000-0000-0000-0000-000000000002');

-- Insert course enrollments
DO $$
DECLARE
  v_course_id UUID;
  v_emp_id UUID;
BEGIN
  SELECT id INTO v_course_id FROM public.training_courses WHERE title = 'Advanced JavaScript' LIMIT 1;
  SELECT id INTO v_emp_id FROM public.employees WHERE employee_id = 'EMP004' LIMIT 1;
  IF v_course_id IS NOT NULL AND v_emp_id IS NOT NULL THEN
    INSERT INTO public.course_enrollments (
      id, course_id, employee_id, status, enrolled_at
    )
    VALUES (
      uuid_generate_v4(), 
      v_course_id, 
      v_emp_id, 
      'enrolled', 
      CURRENT_TIMESTAMP - INTERVAL '2 days'
    )
    ON CONFLICT (course_id, employee_id) DO NOTHING;
  END IF;
  SELECT id INTO v_course_id FROM public.training_courses WHERE title = 'Leadership Skills' LIMIT 1;
  SELECT id INTO v_emp_id FROM public.employees WHERE employee_id = 'EMP003' LIMIT 1;
  IF v_course_id IS NOT NULL AND v_emp_id IS NOT NULL THEN
    INSERT INTO public.course_enrollments (
      id, course_id, employee_id, status, enrolled_at
    )
    VALUES (
      uuid_generate_v4(), 
      v_course_id, 
      v_emp_id, 
      'enrolled', 
      CURRENT_TIMESTAMP - INTERVAL '3 days'
    )
    ON CONFLICT (course_id, employee_id) DO NOTHING;
  END IF;
END $$;

-- Insert compliance requirements
INSERT INTO public.compliance_requirements (id, name, category, description, status, responsible_person, priority, next_review)
VALUES
  (uuid_generate_v4(), 
   'Data Protection Policy', 
   'Privacy', 
   'Ensure compliance with data protection regulations', 
   'compliant', 
   'HR Manager', 
   'high', 
   CURRENT_DATE + INTERVAL '90 days'),
  (uuid_generate_v4(), 
   'Workplace Safety Audit', 
   'Safety', 
   'Regular safety audit of office premises', 
   'pending', 
   'Safety Officer', 
   'medium', 
   CURRENT_DATE + INTERVAL '30 days'),
  (uuid_generate_v4(), 
   'Equal Employment Opportunity', 
   'Legal', 
   'Review hiring practices for EEO compliance', 
   'needs_attention', 
   'HR Director', 
   'high', 
   CURRENT_DATE + INTERVAL '60 days');

-- Insert performance reviews
DO $$
DECLARE
  emp_id UUID;
BEGIN
  SELECT id INTO emp_id FROM public.employees WHERE employee_id = 'EMP004' LIMIT 1;
  IF emp_id IS NOT NULL THEN
    INSERT INTO public.performance_reviews (
      id, employee_id, reviewer_id, period, status, overall_rating, next_review
    )
    VALUES (
      uuid_generate_v4(), 
      emp_id, 
      '00000000-0000-0000-0000-000000000003', 
      '2023 Q2', 
      'completed', 
      4.2, 
      CURRENT_DATE + INTERVAL '6 months'
    );
  END IF;
  SELECT id INTO emp_id FROM public.employees WHERE employee_id = 'EMP005' LIMIT 1;
  IF emp_id IS NOT NULL THEN
    INSERT INTO public.performance_reviews (
      id, employee_id, reviewer_id, period, status, overall_rating, next_review
    )
    VALUES (
      uuid_generate_v4(), 
      emp_id, 
      '00000000-0000-0000-0000-000000000002', 
      '2023 Q2', 
      'completed', 
      3.8, 
      CURRENT_DATE + INTERVAL '6 months'
    );
  END IF;
END $$;

-- Insert expenses
DO $$
DECLARE
  emp_id UUID;
BEGIN
  SELECT id INTO emp_id FROM public.employees WHERE employee_id = 'EMP003' LIMIT 1;
  IF emp_id IS NOT NULL THEN
    INSERT INTO public.expenses (
      id, employee_id, category, amount, description, date, status, receipt_url, approver_id
    )
    VALUES (
      uuid_generate_v4(), 
      emp_id, 
      'Travel', 
      450.75, 
      'Client meeting in Boston', 
      CURRENT_DATE - INTERVAL '10 days', 
      'approved', 
      'https://example.com/receipts/travel-boston.pdf',
      '00000000-0000-0000-0000-000000000002'
    );
  END IF;
  SELECT id INTO emp_id FROM public.employees WHERE employee_id = 'EMP004' LIMIT 1;
  IF emp_id IS NOT NULL THEN
    INSERT INTO public.expenses (
      id, employee_id, category, amount, description, date, status, receipt_url
    )
    VALUES (
      uuid_generate_v4(), 
      emp_id, 
      'Equipment', 
      899.99, 
      'New laptop for development work', 
      CURRENT_DATE - INTERVAL '5 days', 
      'pending', 
      'https://example.com/receipts/laptop-purchase.pdf'
    );
  END IF;
END $$;

-- Insert safety incidents
INSERT INTO public.safety_incidents (id, title, description, date, location, reported_by, severity, status, type)
VALUES
  (uuid_generate_v4(), 
   'Office Slip', 
   'Employee slipped on wet floor in break room', 
   CURRENT_TIMESTAMP - INTERVAL '15 days', 
   'New York Office - Break Room', 
   'Jane Smith', 
   'Medium', 
   'Resolved', 
   'Slip and Fall');

-- Insert safety checks
INSERT INTO public.safety_checks (id, title, due_date, status, assigned_to, location, frequency, priority)
VALUES
  (uuid_generate_v4(), 
   'Fire Extinguisher Inspection', 
   CURRENT_DATE + INTERVAL '14 days', 
   'Scheduled', 
   'Facilities Manager', 
   'All Offices', 
   'Monthly', 
   'High');

-- Insert notifications
INSERT INTO public.notifications (id, user_id, title, message, type)
VALUES
  (uuid_generate_v4(), 
   '00000000-0000-0000-0000-000000000004', 
   'Performance Review Scheduled', 
   'Your performance review for Q3 has been scheduled for next week', 
   'info'),
  (uuid_generate_v4(), 
   '00000000-0000-0000-0000-000000000003', 
   'New Leave Request', 
   'You have a new leave request to approve', 
   'warning');

-- Update applications count on jobs
UPDATE public.jobs 
SET applications_count = (
    SELECT COUNT(*) 
    FROM public.applications 
    WHERE applications.job_id = jobs.id
);

-- Update enrolled count on training courses
UPDATE public.training_courses
SET enrolled = (
    SELECT COUNT(*) 
    FROM public.course_enrollments 
    WHERE course_enrollments.course_id = training_courses.id
);

-- Close jobs whose closing_date has passed (no trigger)
UPDATE public.jobs
SET status = 'closed', closed_at = NOW()
WHERE status = 'open' AND closing_date < CURRENT_DATE;

-- OPTIONAL: Create auth.users entries that match profiles (if you want to use auth)
-- Uncomment and run this in production environments where auth is required
/*
DO $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN SELECT id, email, role FROM profiles LOOP
    BEGIN
      INSERT INTO auth.users (id, email, email_confirmed_at, raw_user_meta_data)
      VALUES (profile_record.id, profile_record.email, now(), json_build_object('role', profile_record.role))
      ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
      -- Ignore errors (likely because auth schema isn't accessible)
      RAISE NOTICE 'Could not create auth.users record for %', profile_record.email;
    END;
  END LOOP;
END $$;
*/

-- Verify tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- View table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'employees';

SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles';

-- Check foreign key relationships
SELECT
  tc.table_schema, 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_schema AS foreign_table_schema,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='profiles'; 