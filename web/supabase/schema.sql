-- HR Portal Database Schema
-- This file contains all the tables needed for the HR management system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET row_security = on;

-- ==========================================
-- CORE TABLES
-- ==========================================

-- Users/Employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  position VARCHAR(255),
  department VARCHAR(255),
  manager_id UUID REFERENCES employees(id),
  phone VARCHAR(20),
  address TEXT,
  date_of_birth DATE,
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
  salary DECIMAL(12,2),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
  avatar_url TEXT,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee roles junction table
CREATE TABLE IF NOT EXISTS employee_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID REFERENCES employees(id),
  UNIQUE(employee_id, role_id)
);

-- ==========================================
-- LEAVE MANAGEMENT
-- ==========================================

-- Leave types
CREATE TABLE IF NOT EXISTS leave_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  max_days_per_year INTEGER DEFAULT 30,
  requires_approval BOOLEAN DEFAULT true,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leave requests
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  employee_name VARCHAR(255) NOT NULL,
  leave_type_id UUID REFERENCES leave_types(id),
  type VARCHAR(100) NOT NULL, -- For backward compatibility
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INTEGER NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  approved_by UUID REFERENCES employees(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- TRAINING & LEARNING
-- ==========================================

-- Training categories
CREATE TABLE IF NOT EXISTS training_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training courses
CREATE TABLE IF NOT EXISTS training_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES training_categories(id),
  category VARCHAR(100), -- For backward compatibility
  duration INTEGER, -- in minutes
  instructor VARCHAR(255),
  max_participants INTEGER,
  location VARCHAR(255),
  is_online BOOLEAN DEFAULT false,
  meeting_link TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed', 'cancelled')),
  materials_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training enrollments
CREATE TABLE IF NOT EXISTS training_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES training_courses(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped')),
  feedback TEXT,
  UNIQUE(course_id, employee_id)
);

-- ==========================================
-- RECRUITMENT
-- ==========================================

-- Job postings
CREATE TABLE IF NOT EXISTS job_postings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  location VARCHAR(255),
  employment_type VARCHAR(50) CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'intern')),
  salary_min DECIMAL(12,2),
  salary_max DECIMAL(12,2),
  description TEXT,
  requirements TEXT,
  benefits TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'paused', 'closed')),
  posted_by UUID REFERENCES employees(id),
  posted_at TIMESTAMP WITH TIME ZONE,
  application_deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job applications
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
  applicant_name VARCHAR(255) NOT NULL,
  applicant_email VARCHAR(255) NOT NULL,
  applicant_phone VARCHAR(20),
  resume_url TEXT,
  cover_letter TEXT,
  linkedin_profile TEXT,
  status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'screening', 'interview', 'offer', 'rejected', 'hired')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interviews
CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
  interviewer_id UUID REFERENCES employees(id),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER DEFAULT 60, -- in minutes
  location VARCHAR(255),
  meeting_link TEXT,
  type VARCHAR(50) CHECK (type IN ('phone', 'video', 'in_person', 'technical')),
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- EXPENSES
-- ==========================================

-- Expense categories
CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  max_amount DECIMAL(10,2),
  requires_receipt BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expense reports
CREATE TABLE IF NOT EXISTS expense_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  total_amount DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'paid')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES employees(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual expense items
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID REFERENCES expense_reports(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  category_id UUID REFERENCES expense_categories(id),
  category VARCHAR(100), -- For backward compatibility
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  receipt_url TEXT,
  vendor VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- FACILITIES & RESOURCES
-- ==========================================

-- Meeting rooms
CREATE TABLE IF NOT EXISTS meeting_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  capacity INTEGER NOT NULL,
  equipment JSONB DEFAULT '[]',
  amenities JSONB DEFAULT '[]',
  hourly_rate DECIMAL(8,2),
  is_bookable BOOLEAN DEFAULT true,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Room bookings
CREATE TABLE IF NOT EXISTS room_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES meeting_rooms(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  attendees INTEGER DEFAULT 1,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  recurring BOOLEAN DEFAULT false,
  recurrence_pattern JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- DOCUMENTS & FILES
-- ==========================================

-- Document categories
CREATE TABLE IF NOT EXISTS document_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES document_categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES document_categories(id),
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(50),
  uploaded_by UUID REFERENCES employees(id),
  access_level VARCHAR(20) DEFAULT 'internal' CHECK (access_level IN ('public', 'internal', 'confidential', 'restricted')),
  tags JSONB DEFAULT '[]',
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- NOTIFICATIONS & LOGS
-- ==========================================

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  category VARCHAR(50),
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES employees(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- COMPANY SETTINGS
-- ==========================================

-- Company settings
CREATE TABLE IF NOT EXISTS company_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'general',
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES employees(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

-- Employee indexes
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON employees(employee_id);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_manager_id ON employees(manager_id);

-- Leave request indexes
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_dates ON leave_requests(start_date, end_date);

-- Training indexes
CREATE INDEX IF NOT EXISTS idx_training_courses_category ON training_courses(category);
CREATE INDEX IF NOT EXISTS idx_training_courses_status ON training_courses(status);
CREATE INDEX IF NOT EXISTS idx_training_enrollments_employee_id ON training_enrollments(employee_id);
CREATE INDEX IF NOT EXISTS idx_training_enrollments_course_id ON training_enrollments(course_id);

-- Job application indexes
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications(applicant_email);

-- Expense indexes
CREATE INDEX IF NOT EXISTS idx_expenses_employee_id ON expenses(employee_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);

-- Booking indexes
CREATE INDEX IF NOT EXISTS idx_room_bookings_room_id ON room_bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_room_bookings_employee_id ON room_bookings(employee_id);
CREATE INDEX IF NOT EXISTS idx_room_bookings_times ON room_bookings(start_time, end_time);

-- Document indexes
CREATE INDEX IF NOT EXISTS idx_documents_category_id ON documents(category_id);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_access_level ON documents(access_level);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- ==========================================
-- TRIGGERS FOR UPDATED_AT
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON leave_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_training_courses_updated_at BEFORE UPDATE ON training_courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON job_postings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expense_reports_updated_at BEFORE UPDATE ON expense_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meeting_rooms_updated_at BEFORE UPDATE ON meeting_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_room_bookings_updated_at BEFORE UPDATE ON room_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- SAMPLE DATA
-- ==========================================

-- Insert default leave types
INSERT INTO leave_types (name, description, max_days_per_year, color) VALUES
('Annual Leave', 'Standard vacation days', 25, '#3B82F6'),
('Sick Leave', 'Medical leave', 10, '#EF4444'),
('Personal Leave', 'Personal time off', 5, '#F59E0B'),
('Maternity Leave', 'Maternity/Paternity leave', 90, '#EC4899'),
('Emergency Leave', 'Emergency situations', 3, '#DC2626')
ON CONFLICT DO NOTHING;

-- Insert default training categories
INSERT INTO training_categories (name, description, color) VALUES
('Leadership', 'Leadership and management training', '#3B82F6'),
('Technical', 'Technical skills development', '#10B981'),
('Safety', 'Workplace safety training', '#EF4444'),
('Compliance', 'Regulatory compliance training', '#F59E0B'),
('HR', 'Human resources training', '#8B5CF6'),
('Soft Skills', 'Communication and interpersonal skills', '#EC4899')
ON CONFLICT DO NOTHING;

-- Insert default expense categories
INSERT INTO expense_categories (name, description, max_amount, requires_receipt) VALUES
('Travel', 'Business travel expenses', 5000.00, true),
('Meals', 'Business meals and entertainment', 100.00, true),
('Office Supplies', 'Office supplies and equipment', 500.00, true),
('Software', 'Software licenses and subscriptions', 1000.00, true),
('Training', 'Professional development and training', 2000.00, true),
('Equipment', 'Computer and office equipment', 3000.00, true)
ON CONFLICT DO NOTHING;

-- Insert default document categories
INSERT INTO document_categories (name, description) VALUES
('Policies', 'Company policies and procedures'),
('Forms', 'HR forms and documents'),
('Handbooks', 'Employee handbooks and guides'),
('Training Materials', 'Training and educational content'),
('Legal', 'Legal documents and contracts'),
('Templates', 'Document templates')
ON CONFLICT DO NOTHING;

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
('Admin', 'System administrator with full access', '["all"]'),
('HR Director', 'HR department head', '["hr_all", "reports", "settings"]'),
('HR Manager', 'HR manager with operational access', '["hr_manage", "reports"]'),
('Manager', 'Department manager', '["team_manage", "approvals"]'),
('Employee', 'Standard employee access', '["self_service"]'),
('Recruiter', 'Recruitment specialist', '["recruitment_manage"]')
ON CONFLICT DO NOTHING;

-- Insert default company settings
INSERT INTO company_settings (key, value, description, category, is_public) VALUES
('company_name', '"Your Company Name"', 'Company name', 'general', true),
('company_address', '"123 Business St, City, State 12345"', 'Company address', 'general', true),
('work_hours_start', '"09:00"', 'Standard work start time', 'work_schedule', false),
('work_hours_end', '"17:00"', 'Standard work end time', 'work_schedule', false),
('work_days', '["monday", "tuesday", "wednesday", "thursday", "friday"]', 'Standard work days', 'work_schedule', false),
('annual_leave_days', '25', 'Default annual leave days', 'leave_policy', false),
('sick_leave_days', '10', 'Default sick leave days', 'leave_policy', false),
('timezone', '"UTC"', 'Company timezone', 'localization', false),
('currency', '"USD"', 'Company currency', 'localization', false),
('date_format', '"YYYY-MM-DD"', 'Date display format', 'localization', false)
ON CONFLICT DO NOTHING; 