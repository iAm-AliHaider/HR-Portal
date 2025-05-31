-- Complete Supabase Requirements Migration
-- This migration implements all the requirements for the HR Portal
-- Execute this in your Supabase SQL Editor

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_graphql";

-- Set up database schema

-- 1. Core User/Profile Management
-------------------------------------------------------------------------------
-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'employee',
  department TEXT,
  position TEXT,
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  date_of_birth DATE,
  hire_date DATE,
  employee_id TEXT,
  manager_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create profile when user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'employee',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace trigger for auth users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Employee Management
-------------------------------------------------------------------------------
-- Departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  manager_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee skills junction table
CREATE TABLE IF NOT EXISTS public.employee_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, skill_id)
);

-- 3. Leave Management
-------------------------------------------------------------------------------
-- Leave types
CREATE TABLE IF NOT EXISTS public.leave_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  default_days INTEGER DEFAULT 0,
  requires_approval BOOLEAN DEFAULT TRUE,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leave balances
CREATE TABLE IF NOT EXISTS public.leave_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  leave_type_id UUID REFERENCES public.leave_types(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  allocated_days NUMERIC(5,1) NOT NULL,
  used_days NUMERIC(5,1) DEFAULT 0,
  pending_days NUMERIC(5,1) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, leave_type_id, year)
);

-- Leave requests
CREATE TABLE IF NOT EXISTS public.leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  leave_type_id UUID REFERENCES public.leave_types(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days NUMERIC(5,1) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  reason TEXT,
  rejection_reason TEXT,
  approver_id UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Training & Development
-------------------------------------------------------------------------------
-- Training courses
CREATE TABLE IF NOT EXISTS public.training_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  duration INTEGER, -- hours
  instructor TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  max_participants INTEGER,
  location TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course enrollments
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.training_courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'failed', 'withdrawn')),
  completion_date TIMESTAMPTZ,
  score INTEGER,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, course_id)
);

-- 5. Recruitment & Hiring
-------------------------------------------------------------------------------
-- Job postings
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  description TEXT,
  requirements TEXT,
  salary_range TEXT,
  employment_type TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed', 'filled')),
  posting_date TIMESTAMPTZ,
  closing_date TIMESTAMPTZ,
  hiring_manager_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT,
  cover_letter_url TEXT,
  status TEXT DEFAULT 'received' CHECK (status IN ('received', 'reviewing', 'interview', 'offer', 'hired', 'rejected')),
  source TEXT,
  recruiter_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interviews
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  interviewer_id UUID REFERENCES public.profiles(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration INTEGER, -- minutes
  location TEXT,
  interview_type TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  feedback TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Loan Management
-------------------------------------------------------------------------------
-- Loan programs
CREATE TABLE IF NOT EXISTS public.loan_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  max_amount NUMERIC(10,2) NOT NULL,
  interest_rate NUMERIC(5,2) NOT NULL,
  max_term_months INTEGER NOT NULL,
  minimum_service_months INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loan applications
CREATE TABLE IF NOT EXISTS public.loan_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.loan_programs(id),
  amount NUMERIC(10,2) NOT NULL,
  term_months INTEGER NOT NULL,
  purpose TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'disbursed', 'completed', 'cancelled')),
  approval_date TIMESTAMPTZ,
  approver_id UUID REFERENCES public.profiles(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loan repayments
CREATE TABLE IF NOT EXISTS public.loan_repayments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'waived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Facilities Management
-------------------------------------------------------------------------------
-- Meeting rooms
CREATE TABLE IF NOT EXISTS public.meeting_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  location TEXT,
  capacity INTEGER NOT NULL,
  features TEXT[], -- Array of features
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'unavailable', 'maintenance')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Room bookings
CREATE TABLE IF NOT EXISTS public.room_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES public.meeting_rooms(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  attendees TEXT[],
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment inventory
CREATE TABLE IF NOT EXISTS public.equipment_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  serial_number TEXT,
  purchase_date DATE,
  condition TEXT DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  location TEXT,
  assigned_to UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in-use', 'maintenance', 'retired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment bookings
CREATE TABLE IF NOT EXISTS public.equipment_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID REFERENCES public.equipment_inventory(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.profiles(id),
  purpose TEXT,
  checkout_time TIMESTAMPTZ NOT NULL,
  expected_return_time TIMESTAMPTZ NOT NULL,
  actual_return_time TIMESTAMPTZ,
  status TEXT DEFAULT 'booked' CHECK (status IN ('booked', 'checked-out', 'returned', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Request Panel System
-------------------------------------------------------------------------------
-- Request categories
CREATE TABLE IF NOT EXISTS public.request_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Request types
CREATE TABLE IF NOT EXISTS public.request_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.request_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  form_schema JSONB, -- JSON schema for dynamic forms
  requires_approval BOOLEAN DEFAULT TRUE,
  approver_role TEXT[], -- Array of roles that can approve
  sla_hours INTEGER, -- Service Level Agreement in hours
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee requests
CREATE TABLE IF NOT EXISTS public.requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_type_id UUID REFERENCES public.request_types(id),
  employee_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  form_data JSONB, -- Form data submitted by employee
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'approved', 'rejected', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assignee_id UUID REFERENCES public.profiles(id),
  approver_id UUID REFERENCES public.profiles(id),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Compliance & Safety
-------------------------------------------------------------------------------
-- Safety incidents
CREATE TABLE IF NOT EXISTS public.safety_incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES public.profiles(id),
  incident_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  description TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('minor', 'moderate', 'major', 'critical')),
  witnesses TEXT[],
  status TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'investigating', 'resolved', 'closed')),
  resolution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safety equipment checks
CREATE TABLE IF NOT EXISTS public.safety_equipment_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_name TEXT NOT NULL,
  location TEXT,
  inspector_id UUID REFERENCES public.profiles(id),
  check_date TIMESTAMPTZ NOT NULL,
  status TEXT CHECK (status IN ('passed', 'failed', 'maintenance-required')),
  notes TEXT,
  next_check_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Row Level Security (RLS) Policies
-------------------------------------------------------------------------------
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_repayments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_equipment_checks ENABLE ROW LEVEL SECURITY;

-- Basic policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policies for HR/Admin roles
CREATE POLICY "Admin and HR can view all data"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'hr')
    )
  );

-- Initial seed data for Request Categories and Types
INSERT INTO public.request_categories (name, description, icon, sort_order)
VALUES
  ('Time & Leave', 'Time off and schedule-related requests', 'calendar', 1),
  ('Finance & Benefits', 'Salary, benefits and finance-related requests', 'dollar-sign', 2),
  ('Equipment & Resources', 'Office supplies and resources', 'briefcase', 3),
  ('Career & Development', 'Career growth and learning opportunities', 'award', 4),
  ('Administrative', 'General administrative requests', 'file-text', 5),
  ('Health & Wellness', 'Health and wellness related requests', 'heart', 6);

-- Insert sample request types
INSERT INTO public.request_types (category_id, name, description, requires_approval, approver_role, sla_hours)
VALUES
  -- Time & Leave
  ((SELECT id FROM public.request_categories WHERE name = 'Time & Leave'), 'Vacation Request', 'Request for vacation days', true, ARRAY['manager', 'hr'], 24),
  ((SELECT id FROM public.request_categories WHERE name = 'Time & Leave'), 'Sick Leave', 'Request for sick days', true, ARRAY['manager', 'hr'], 4),
  ((SELECT id FROM public.request_categories WHERE name = 'Time & Leave'), 'Work From Home Request', 'Request to work remotely', true, ARRAY['manager'], 8),
  ((SELECT id FROM public.request_categories WHERE name = 'Time & Leave'), 'Compensatory Off Request', 'Request time off for overtime worked', true, ARRAY['manager'], 24),
  
  -- Finance & Benefits
  ((SELECT id FROM public.request_categories WHERE name = 'Finance & Benefits'), 'Loan Application', 'Apply for a company loan', true, ARRAY['hr', 'finance'], 72),
  ((SELECT id FROM public.request_categories WHERE name = 'Finance & Benefits'), 'Payslip Request', 'Request for payslip document', false, ARRAY['hr'], 24),
  ((SELECT id FROM public.request_categories WHERE name = 'Finance & Benefits'), 'Salary Revision Request', 'Request for salary review', true, ARRAY['manager', 'hr'], 120),
  ((SELECT id FROM public.request_categories WHERE name = 'Finance & Benefits'), 'Bonus/Incentive Request', 'Request for performance bonus', true, ARRAY['manager', 'hr'], 72),
  
  -- Equipment & Resources
  ((SELECT id FROM public.request_categories WHERE name = 'Equipment & Resources'), 'Equipment Request', 'Request for new equipment', true, ARRAY['manager', 'it'], 48),
  ((SELECT id FROM public.request_categories WHERE name = 'Equipment & Resources'), 'Room Booking', 'Book a meeting room', false, NULL, 2),
  ((SELECT id FROM public.request_categories WHERE name = 'Equipment & Resources'), 'Parking Spot Request', 'Request for parking spot', true, ARRAY['admin'], 48),
  ((SELECT id FROM public.request_categories WHERE name = 'Equipment & Resources'), 'ID Card Request', 'Request for new ID card', true, ARRAY['hr', 'admin'], 48),
  ((SELECT id FROM public.request_categories WHERE name = 'Equipment & Resources'), 'Stationary Request', 'Request for office supplies', false, ARRAY['admin'], 24),
  
  -- Career & Development
  ((SELECT id FROM public.request_categories WHERE name = 'Career & Development'), 'Training Request', 'Request for professional training', true, ARRAY['manager', 'hr'], 72),
  ((SELECT id FROM public.request_categories WHERE name = 'Career & Development'), 'Certification Request', 'Request for certification program', true, ARRAY['manager', 'hr'], 72),
  ((SELECT id FROM public.request_categories WHERE name = 'Career & Development'), 'Promotion Request', 'Request for role promotion', true, ARRAY['manager', 'hr'], 168),
  ((SELECT id FROM public.request_categories WHERE name = 'Career & Development'), 'Department Transfer Request', 'Request for department change', true, ARRAY['manager', 'hr'], 168),
  
  -- Administrative
  ((SELECT id FROM public.request_categories WHERE name = 'Administrative'), 'Document Request', 'Request for official documents', true, ARRAY['hr'], 48),
  ((SELECT id FROM public.request_categories WHERE name = 'Administrative'), 'Grievance/Complaint', 'File a workplace complaint', true, ARRAY['hr'], 48),
  ((SELECT id FROM public.request_categories WHERE name = 'Administrative'), 'Reference Letter Request', 'Request for reference letter', true, ARRAY['manager', 'hr'], 72),
  ((SELECT id FROM public.request_categories WHERE name = 'Administrative'), 'Employment Verification Request', 'Request for employment verification', false, ARRAY['hr'], 48),
  ((SELECT id FROM public.request_categories WHERE name = 'Administrative'), 'Resignation Request', 'Submit resignation notice', true, ARRAY['manager', 'hr'], 24),
  
  -- Health & Wellness
  ((SELECT id FROM public.request_categories WHERE name = 'Health & Wellness'), 'Medical Leave Request', 'Request for extended medical leave', true, ARRAY['manager', 'hr'], 24),
  ((SELECT id FROM public.request_categories WHERE name = 'Health & Wellness'), 'Medical Reimbursement', 'Request for medical expense reimbursement', true, ARRAY['hr', 'finance'], 72),
  ((SELECT id FROM public.request_categories WHERE name = 'Health & Wellness'), 'Insurance Claim', 'Submit health insurance claim', true, ARRAY['hr'], 72),
  ((SELECT id FROM public.request_categories WHERE name = 'Health & Wellness'), 'Wellness Program Enrollment', 'Enroll in company wellness program', false, ARRAY['hr'], 48),
  ((SELECT id FROM public.request_categories WHERE name = 'Health & Wellness'), 'Gym Membership Request', 'Request for gym membership subsidy', true, ARRAY['hr'], 72);

-- Create a function to generate a random HR manager for each department
CREATE OR REPLACE FUNCTION public.assign_department_manager()
RETURNS TRIGGER AS $$
BEGIN
  -- Find a random HR person to be the manager
  UPDATE public.departments
  SET manager_id = (
    SELECT id FROM public.profiles
    WHERE role = 'hr'
    ORDER BY RANDOM()
    LIMIT 1
  )
  WHERE id = NEW.id AND NEW.manager_id IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to assign manager when department is created
CREATE TRIGGER tr_assign_department_manager
  AFTER INSERT ON public.departments
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_department_manager();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- Insert sample departments
INSERT INTO public.departments (name, description)
VALUES
  ('Human Resources', 'HR department responsible for personnel management'),
  ('Finance', 'Finance and accounting department'),
  ('Engineering', 'Software engineering and development'),
  ('Marketing', 'Marketing and communications'),
  ('Sales', 'Sales and business development'),
  ('Operations', 'Business operations'),
  ('Customer Support', 'Customer service and support'),
  ('Research & Development', 'Product innovation and research');

-- Insert sample leave types
INSERT INTO public.leave_types (name, description, default_days, color)
VALUES
  ('Annual Leave', 'Regular vacation days', 20, '#4CAF50'),
  ('Sick Leave', 'Leave due to illness', 10, '#F44336'),
  ('Personal Leave', 'Leave for personal matters', 5, '#2196F3'),
  ('Maternity Leave', 'Leave for childbirth and care', 90, '#9C27B0'),
  ('Paternity Leave', 'Leave for fathers after childbirth', 14, '#673AB7'),
  ('Bereavement Leave', 'Leave due to death of family member', 5, '#607D8B'),
  ('Study Leave', 'Leave for educational purposes', 10, '#FF9800');

-- Insert sample loan programs
INSERT INTO public.loan_programs (name, description, max_amount, interest_rate, max_term_months, minimum_service_months, status)
VALUES
  ('Personal Loan', 'General purpose personal loan', 10000.00, 5.00, 24, 6, 'active'),
  ('Education Loan', 'Loan for higher education', 25000.00, 3.50, 36, 12, 'active'),
  ('Home Loan', 'Loan for home purchase or renovation', 50000.00, 4.00, 60, 24, 'active'),
  ('Emergency Loan', 'Loan for urgent financial needs', 5000.00, 2.00, 12, 3, 'active'),
  ('Vehicle Loan', 'Loan for vehicle purchase', 15000.00, 4.50, 36, 12, 'active');

-- Insert sample meeting rooms
INSERT INTO public.meeting_rooms (name, location, capacity, features, status)
VALUES
  ('Executive Suite', 'Floor 5', 20, ARRAY['Projector', 'Video Conference', 'Whiteboard', 'Catering'], 'available'),
  ('Boardroom', 'Floor 4', 12, ARRAY['Projector', 'Video Conference', 'Whiteboard'], 'available'),
  ('Huddle Room 1', 'Floor 3', 6, ARRAY['Video Conference', 'Whiteboard'], 'available'),
  ('Huddle Room 2', 'Floor 3', 6, ARRAY['Video Conference', 'Whiteboard'], 'available'),
  ('Conference Room A', 'Floor 2', 15, ARRAY['Projector', 'Video Conference', 'Whiteboard'], 'available'),
  ('Conference Room B', 'Floor 2', 15, ARRAY['Projector', 'Video Conference', 'Whiteboard'], 'available'),
  ('Training Room', 'Floor 1', 30, ARRAY['Projector', 'Video Conference', 'Whiteboard', 'Computer Stations'], 'available'); 