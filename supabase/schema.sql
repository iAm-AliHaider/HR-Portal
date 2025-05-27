-- HR Portal Database Schema for Supabase
-- This schema defines all tables needed for the HR application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Define custom types with safety checks
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'hr', 'manager', 'employee', 'recruiter');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_status') THEN
        CREATE TYPE job_status AS ENUM ('open', 'closed', 'draft', 'archived');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
        CREATE TYPE application_status AS ENUM ('pending', 'under_review', 'interview_scheduled', 'rejected', 'offer_extended', 'hired');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'leave_status') THEN
        CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'interview_status') THEN
        CREATE TYPE interview_status AS ENUM ('scheduled', 'completed', 'cancelled', 'rescheduled');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'offer_status') THEN
        CREATE TYPE offer_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'negotiating', 'expired');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'expense_status') THEN
        CREATE TYPE expense_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
END
$$;

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  avatar_url TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'employee',
  department TEXT,
  position TEXT,
  manager_id UUID REFERENCES profiles(id),
  hire_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id),
  employee_id TEXT UNIQUE NOT NULL, -- HR identifier
  status TEXT NOT NULL DEFAULT 'active', -- active, inactive, on_leave, terminated
  salary NUMERIC,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  employment_type TEXT NOT NULL, -- full-time, part-time, contract, intern
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on employees
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL, -- full-time, part-time, contract, intern
  status job_status NOT NULL DEFAULT 'draft',
  description TEXT NOT NULL,
  requirements TEXT,
  salary_range TEXT,
  benefits TEXT,
  applications_count INTEGER DEFAULT 0,
  posted_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closing_date DATE,
  closed_at TIMESTAMPTZ
);

-- Enable RLS on jobs
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  resume_url TEXT,
  cover_letter TEXT,
  status application_status NOT NULL DEFAULT 'pending',
  experience_years INTEGER,
  current_company TEXT,
  notes TEXT,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_by UUID REFERENCES profiles(id)
);

-- Enable RLS on applications
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  interviewer_id UUID REFERENCES profiles(id),
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  position TEXT NOT NULL,
  job_id UUID REFERENCES jobs(id),
  stage TEXT NOT NULL, -- initial, technical, final
  type TEXT NOT NULL, -- video, phone, onsite, technical
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  location TEXT NOT NULL, -- video-zoom, video-teams, onsite-office, etc.
  notes TEXT,
  status interview_status NOT NULL DEFAULT 'scheduled',
  feedback JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on interviews
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- Offers table
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  job_id UUID REFERENCES jobs(id),
  salary NUMERIC NOT NULL,
  equity TEXT,
  bonus NUMERIC,
  benefits JSONB,
  start_date DATE NOT NULL,
  expiration_date DATE NOT NULL,
  status offer_status NOT NULL DEFAULT 'draft',
  contract_type TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_by UUID REFERENCES profiles(id)
);

-- Enable RLS on offers
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Leave requests table
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- Annual Leave, Sick Leave, Personal Leave, etc.
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INTEGER NOT NULL,
  status leave_status NOT NULL DEFAULT 'pending',
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  manager_id UUID REFERENCES profiles(id)
);

-- Enable RLS on leave_requests
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- Training courses table
CREATE TABLE IF NOT EXISTS training_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL, -- in hours/days
  instructor TEXT,
  capacity INTEGER,
  enrolled INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  price NUMERIC,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Enable RLS on training_courses
ALTER TABLE training_courses ENABLE ROW LEVEL SECURITY;

-- Course enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES training_courses(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'enrolled', -- enrolled, completed, withdrawn
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  completion_score NUMERIC,
  feedback TEXT,
  UNIQUE(course_id, employee_id)
);

-- Enable RLS on course_enrollments
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

-- Compliance requirements table
CREATE TABLE IF NOT EXISTS compliance_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- compliant, non_compliant, needs_attention, pending
  responsible_person TEXT,
  priority TEXT NOT NULL, -- low, medium, high, critical
  last_review TIMESTAMPTZ,
  next_review TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on compliance_requirements
ALTER TABLE compliance_requirements ENABLE ROW LEVEL SECURITY;

-- Audits table
CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requirement_id UUID REFERENCES compliance_requirements(id) ON DELETE CASCADE,
  auditor TEXT NOT NULL,
  status TEXT NOT NULL, -- in_progress, completed, failed
  findings TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on audits
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, active, inactive
  steps INTEGER NOT NULL,
  trigger TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on workflows
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

-- Workflow instances table
CREATE TABLE IF NOT EXISTS workflow_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'running', -- running, completed, cancelled
  context_data JSONB,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on workflow_instances
ALTER TABLE workflow_instances ENABLE ROW LEVEL SECURITY;

-- Performance reviews table
CREATE TABLE IF NOT EXISTS performance_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id),
  period TEXT NOT NULL, -- 2023 Q1, 2023 Q2, etc.
  status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, completed
  overall_rating NUMERIC,
  goals_met NUMERIC,
  strengths TEXT,
  areas_for_improvement TEXT,
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  next_review DATE
);

-- Enable RLS on performance_reviews
ALTER TABLE performance_reviews ENABLE ROW LEVEL SECURITY;

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  description TEXT NOT NULL,
  date DATE NOT NULL,
  status expense_status NOT NULL DEFAULT 'pending',
  receipt_url TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  approver_id UUID REFERENCES profiles(id)
);

-- Enable RLS on expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Safety incidents table
CREATE TABLE IF NOT EXISTS safety_incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  reported_by TEXT NOT NULL,
  severity TEXT NOT NULL, -- Low, Medium, High
  status TEXT NOT NULL DEFAULT 'Reported', -- Reported, Under Investigation, Resolved
  type TEXT NOT NULL, -- Slip and Fall, Equipment Failure, etc.
  injury_type TEXT,
  medical_attention TEXT,
  witnesses TEXT[],
  follow_up_actions TEXT,
  resolution_date DATE,
  attachments TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on safety_incidents
ALTER TABLE safety_incidents ENABLE ROW LEVEL SECURITY;

-- Safety checks table
CREATE TABLE IF NOT EXISTS safety_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Scheduled', -- Scheduled, In Progress, Completed
  assigned_to TEXT NOT NULL,
  location TEXT NOT NULL,
  frequency TEXT NOT NULL, -- Daily, Weekly, Monthly, Quarterly, Annual
  last_completed DATE,
  notes TEXT,
  priority TEXT NOT NULL, -- Low, Medium, High
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on safety_checks
ALTER TABLE safety_checks ENABLE ROW LEVEL SECURITY;

-- Safety check items table
CREATE TABLE IF NOT EXISTS safety_check_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  check_id UUID REFERENCES safety_checks(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending', -- Pending, In Progress, Completed
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on safety_check_items
ALTER TABLE safety_check_items ENABLE ROW LEVEL SECURITY;

-- Equipment inspections table
CREATE TABLE IF NOT EXISTS equipment_inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_name TEXT NOT NULL,
  inspection_type TEXT NOT NULL,
  last_inspection DATE NOT NULL,
  next_due_date DATE NOT NULL,
  status TEXT NOT NULL, -- Passed, Failed, Passed with Concerns
  assigned_to TEXT NOT NULL,
  location TEXT NOT NULL,
  notes TEXT,
  attachments TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on equipment_inspections
ALTER TABLE equipment_inspections ENABLE ROW LEVEL SECURITY;

-- Company settings table
CREATE TABLE IF NOT EXISTS company_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT,
  size TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  description TEXT,
  logo_url TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  currency TEXT NOT NULL DEFAULT 'USD',
  date_format TEXT NOT NULL DEFAULT 'MM/DD/YYYY',
  working_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  working_hours_start TEXT DEFAULT '09:00',
  working_hours_end TEXT DEFAULT '17:00',
  leave_policy JSONB,
  probation_period_months INTEGER DEFAULT 3,
  notice_period_days INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on company_settings
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- Dashboard analytics table
CREATE TABLE IF NOT EXISTS dashboard_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  total_employees INTEGER,
  active_leave_requests INTEGER,
  training_completion INTEGER,
  open_positions INTEGER,
  department_distribution JSONB,
  monthly_recruitment JSONB,
  leave_analytics JSONB,
  performance_analytics JSONB,
  training_analytics JSONB,
  retention_analytics JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on dashboard_analytics
ALTER TABLE dashboard_analytics ENABLE ROW LEVEL SECURITY;

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- info, success, warning, error
  read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Define RLS policies (example for profiles table)
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to update timestamp columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables with updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Function to increment applications_count when a new application is created
CREATE OR REPLACE FUNCTION increment_applications_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE jobs
  SET applications_count = applications_count + 1
  WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS increment_job_applications_count ON applications;
CREATE TRIGGER increment_job_applications_count
  AFTER INSERT ON applications
  FOR EACH ROW
  EXECUTE PROCEDURE increment_applications_count();

-- Insert initial admin user (disabled for local development)
-- INSERT INTO auth.users (id, email, email_confirmed_at, role)
-- VALUES (
--   uuid_generate_v4(),
--   'admin@hrportal.com',
--   now(),
--   'admin'
-- ) ON CONFLICT DO NOTHING;

-- Seed company settings
INSERT INTO company_settings (
  name,
  industry,
  size,
  address,
  phone,
  email,
  website,
  description,
  logo_url,
  timezone,
  currency,
  date_format
) VALUES (
  'Acme Corporation',
  'Technology',
  '101-500',
  '123 Business Street, Tech City, TC 12345',
  '+1 (555) 123-4567',
  'contact@acme.com',
  'https://acme.com',
  'Leading technology company providing innovative solutions for modern businesses.',
  'https://via.placeholder.com/200x60/2563eb/ffffff?text=ACME',
  'America/New_York',
  'USD',
  'MM/DD/YYYY'
) ON CONFLICT DO NOTHING;

-- Additional functions and triggers specific to your application can be added here 