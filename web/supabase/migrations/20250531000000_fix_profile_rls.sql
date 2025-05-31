-- Fix Profile RLS Policies and Request Form Schema
-- This migration fixes the infinite recursion issue in profile policies
-- and updates request_types to ensure form_schema is properly set

-- 1. Fix Profile RLS Policies
-------------------------------------------------------------------------------

-- Drop existing policies that might cause recursion
DROP POLICY IF EXISTS "Admin and HR can view all data" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create new non-recursive policies
-- Everyone can read basic profile data (no recursion)
CREATE POLICY "Profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

-- Users can update their own profiles
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);

-- Admin and HR roles have full access without recursive checks
CREATE POLICY "Admin and HR full access" 
  ON public.profiles FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND (
        raw_user_meta_data->>'role' = 'admin' OR
        raw_user_meta_data->>'role' = 'hr'
      )
    )
  );
  
-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 2. Fix Request Types Form Schema
-------------------------------------------------------------------------------

-- Update request types to ensure they have form_schema
UPDATE public.request_types
SET form_schema = '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}'::jsonb
WHERE form_schema IS NULL;

-- Update specific request types with appropriate form schemas
UPDATE public.request_types
SET form_schema = '{
  "fields": [
    {"name": "startDate", "type": "date", "label": "Start Date", "required": true},
    {"name": "endDate", "type": "date", "label": "End Date", "required": true},
    {"name": "reason", "type": "textarea", "label": "Reason", "required": true}
  ]
}'::jsonb
WHERE name IN ('Vacation Request', 'Sick Leave', 'Work From Home Request', 'Compensatory Off Request');

-- Update loan application form schema
UPDATE public.request_types
SET form_schema = '{
  "fields": [
    {"name": "loanAmount", "type": "number", "label": "Loan Amount", "required": true},
    {"name": "loanPurpose", "type": "textarea", "label": "Purpose", "required": true},
    {"name": "repaymentMonths", "type": "number", "label": "Repayment Term (months)", "required": true}
  ]
}'::jsonb
WHERE name = 'Loan Application';

-- Update equipment request form schema
UPDATE public.request_types
SET form_schema = '{
  "fields": [
    {"name": "equipmentType", "type": "select", "label": "Equipment Type", "required": true, 
     "options": ["Laptop", "Monitor", "Keyboard", "Mouse", "Headset", "Other"]},
    {"name": "otherEquipment", "type": "text", "label": "If Other, please specify", "required": false},
    {"name": "reason", "type": "textarea", "label": "Reason", "required": true}
  ]
}'::jsonb
WHERE name = 'Equipment Request';

-- Update room booking form schema
UPDATE public.request_types
SET form_schema = '{
  "fields": [
    {"name": "roomId", "type": "select", "label": "Meeting Room", "required": true, 
     "options": ["Executive Suite", "Boardroom", "Huddle Room 1", "Huddle Room 2", "Conference Room A", "Conference Room B", "Training Room"]},
    {"name": "startTime", "type": "datetime", "label": "Start Time", "required": true},
    {"name": "endTime", "type": "datetime", "label": "End Time", "required": true},
    {"name": "attendees", "type": "textarea", "label": "Attendees", "required": true},
    {"name": "purpose", "type": "text", "label": "Meeting Purpose", "required": true}
  ]
}'::jsonb
WHERE name = 'Room Booking';

-- Add RLS policies for request_types and requests tables
ALTER TABLE public.request_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Everyone can read request types
CREATE POLICY "Request types are viewable by everyone" 
  ON public.request_types FOR SELECT 
  USING (true);

-- Admin and HR can manage request types
CREATE POLICY "Admin and HR can manage request types" 
  ON public.request_types FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND (
        raw_user_meta_data->>'role' = 'admin' OR
        raw_user_meta_data->>'role' = 'hr'
      )
    )
  );

-- Everyone can read their own requests
CREATE POLICY "Users can view their own requests" 
  ON public.requests FOR SELECT 
  USING (auth.uid() = employee_id);

-- Users can insert their own requests
CREATE POLICY "Users can insert their own requests" 
  ON public.requests FOR INSERT 
  WITH CHECK (auth.uid() = employee_id);

-- Admin, HR, and managers can view all requests
CREATE POLICY "Admin, HR, and managers can view all requests" 
  ON public.requests FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND (
        raw_user_meta_data->>'role' = 'admin' OR
        raw_user_meta_data->>'role' = 'hr' OR
        raw_user_meta_data->>'role' = 'manager'
      )
    )
  );

-- Admin, HR, and managers can update requests
CREATE POLICY "Admin, HR, and managers can update requests" 
  ON public.requests FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND (
        raw_user_meta_data->>'role' = 'admin' OR
        raw_user_meta_data->>'role' = 'hr' OR
        raw_user_meta_data->>'role' = 'manager'
      )
    )
  );

-- This will resolve the "type required" error in the request forms
-- by properly configuring the RLS policies and form schema 