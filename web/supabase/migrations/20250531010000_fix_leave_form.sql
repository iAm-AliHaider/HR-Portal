-- Fix Leave/Time-off Request Form Structure
-- This migration specifically fixes the issues with the Leave/Time-off request form

-- 1. Update the form schema for leave-related request types
-------------------------------------------------------------------------------

-- First let's check if the request type exists for "Annual Leave Request"
UPDATE public.request_types
SET form_schema = '{
  "fields": [
    {"name": "leaveType", "type": "select", "label": "Leave Type", "required": true, 
     "options": ["Annual Leave", "Sick Leave", "Personal Leave", "Bereavement Leave", "Study Leave", "Maternity Leave", "Paternity Leave"]},
    {"name": "startDate", "type": "date", "label": "Start Date", "required": true},
    {"name": "endDate", "type": "date", "label": "End Date", "required": true},
    {"name": "totalDays", "type": "number", "label": "Total Days", "required": true},
    {"name": "reason", "type": "textarea", "label": "Reason", "required": true},
    {"name": "handoverNotes", "type": "textarea", "label": "Handover Notes", "required": false}
  ]
}'::jsonb
WHERE name IN ('Vacation Request', 'Annual Leave Request', 'Leave Request');

-- Specifically update 'Sick Leave' request type
UPDATE public.request_types
SET form_schema = '{
  "fields": [
    {"name": "startDate", "type": "date", "label": "Start Date", "required": true},
    {"name": "endDate", "type": "date", "label": "End Date", "required": true},
    {"name": "totalDays", "type": "number", "label": "Total Days", "required": true},
    {"name": "reason", "type": "textarea", "label": "Reason", "required": true},
    {"name": "medicalCertificate", "type": "boolean", "label": "Medical Certificate Attached", "required": false}
  ]
}'::jsonb
WHERE name = 'Sick Leave';

-- Create a new generic "Leave/Time-off Request" type if it doesn't exist
INSERT INTO public.request_types (name, description, category_id, requires_approval, approver_role, sla_hours, form_schema)
SELECT 
  'Leave/Time-off Request', 
  'Request for any type of leave or time off', 
  id, 
  true, 
  ARRAY['manager', 'hr']::text[], 
  24,
  '{
    "fields": [
      {"name": "leaveType", "type": "select", "label": "Leave Type", "required": true, 
       "options": ["Annual Leave", "Sick Leave", "Personal Leave", "Bereavement Leave", "Study Leave", "Maternity Leave", "Paternity Leave"]},
      {"name": "startDate", "type": "date", "label": "Start Date", "required": true},
      {"name": "endDate", "type": "date", "label": "End Date", "required": true},
      {"name": "totalDays", "type": "number", "label": "Total Days", "required": true},
      {"name": "reason", "type": "textarea", "label": "Reason", "required": true},
      {"name": "handoverNotes", "type": "textarea", "label": "Handover Notes", "required": false}
    ]
  }'::jsonb
FROM public.request_categories 
WHERE name = 'Time & Leave'
AND NOT EXISTS (
  SELECT 1 FROM public.request_types WHERE name = 'Leave/Time-off Request'
);

-- 2. Create any missing leave types in the leave_types table
-------------------------------------------------------------------------------

-- Insert standard leave types if they don't exist
INSERT INTO public.leave_types (name, description, default_days, color)
VALUES 
  ('Annual Leave', 'Regular vacation days', 20, '#4CAF50')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.leave_types (name, description, default_days, color)
VALUES 
  ('Sick Leave', 'Leave due to illness', 10, '#F44336')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.leave_types (name, description, default_days, color)
VALUES 
  ('Personal Leave', 'Leave for personal matters', 5, '#2196F3')
ON CONFLICT (name) DO NOTHING;

-- 3. Fix any potential HTML/React rendering issues
-------------------------------------------------------------------------------

-- Update all leave-related request types to ensure they have proper form structure
UPDATE public.request_types
SET form_schema = jsonb_strip_nulls(form_schema)
WHERE category_id IN (SELECT id FROM public.request_categories WHERE name = 'Time & Leave');

-- Ensure the leaveType field is properly formatted in all form schemas
UPDATE public.request_types
SET form_schema = jsonb_set(
  form_schema,
  '{fields}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN field->>'name' = 'leaveType' AND field->>'type' = 'select' THEN
          jsonb_set(
            field, 
            '{options}', 
            '["Annual Leave", "Sick Leave", "Personal Leave", "Bereavement Leave", "Study Leave", "Maternity Leave", "Paternity Leave"]'::jsonb
          )
        ELSE field
      END
    )
    FROM jsonb_array_elements(form_schema->'fields') AS field
  )
)
WHERE form_schema->'fields' @> '[{"name": "leaveType"}]'::jsonb; 