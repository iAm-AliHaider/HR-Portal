-- Create Super User Account for Testing
-- This creates test data for workflows testing

-- Create test users using profiles table directly
-- Since direct auth.users manipulation is complex, we'll create profiles and let users sign up normally

-- First, let's create some test job postings and sample data for testing
INSERT INTO public.jobs (
    title,
    department,
    location,
    type,
    description,
    requirements,
    benefits,
    salary_range,
    status,
    created_at,
    updated_at
) VALUES 
(
    'Senior Software Developer',
    'Engineering',
    'Remote',
    'full-time',
    'We are looking for a Senior Software Developer to join our growing team. You will be responsible for developing and maintaining our web applications using modern technologies.',
    '• 5+ years of experience in software development
• Proficiency in React, Node.js, and TypeScript
• Experience with database design and management
• Strong problem-solving skills
• Excellent communication abilities',
    '• Competitive salary
• Health insurance
• Flexible working hours
• Professional development opportunities
• Remote work options',
    '$80,000 - $120,000',
    'open',
    NOW(),
    NOW()
),
(
    'HR Manager',
    'Human Resources',
    'New York, NY',
    'full-time',
    'Join our HR team as an HR Manager to help build and maintain our company culture. You will oversee recruitment, employee relations, and HR policies.',
    '• Bachelor''s degree in HR or related field
• 3+ years of HR management experience
• Knowledge of employment law
• Strong interpersonal skills
• Experience with HRIS systems',
    '• Competitive salary
• Health and dental insurance
• 401(k) matching
• Paid time off
• Professional development budget',
    '$65,000 - $85,000',
    'open',
    NOW(),
    NOW()
),
(
    'Marketing Specialist',
    'Marketing',
    'San Francisco, CA',
    'full-time',
    'We''re seeking a creative Marketing Specialist to develop and execute marketing campaigns that drive brand awareness and customer engagement.',
    '• Bachelor''s degree in Marketing or related field
• 2+ years of marketing experience
• Experience with digital marketing tools
• Creative thinking and analytical skills
• Excellent written communication',
    '• Competitive salary
• Health insurance
• Stock options
• Unlimited PTO
• Modern office environment',
    '$55,000 - $75,000',
    'open',
    NOW(),
    NOW()
)
ON CONFLICT DO NOTHING;

-- Create some sample applications for testing
INSERT INTO public.applications (
    job_id,
    candidate_email,
    candidate_name,
    resume_url,
    cover_letter,
    status,
    experience_years,
    applied_at,
    updated_at
) VALUES 
(
    (SELECT id FROM public.jobs WHERE title = 'Senior Software Developer' LIMIT 1),
    'candidate1@example.com',
    'John Doe',
    'https://example.com/resume1.pdf',
    'I am very excited about this opportunity to join your engineering team. With over 6 years of experience in full-stack development, I believe I would be a great fit for this role.',
    'pending',
    6,
    NOW(),
    NOW()
),
(
    (SELECT id FROM public.jobs WHERE title = 'HR Manager' LIMIT 1),
    'candidate2@example.com',
    'Jane Smith',
    'https://example.com/resume2.pdf',
    'As an experienced HR professional with a passion for people and culture, I am thrilled to apply for the HR Manager position at your company.',
    'pending',
    4,
    NOW(),
    NOW()
)
ON CONFLICT DO NOTHING;

-- Log completion
SELECT 'Test data and sample jobs created successfully. Please use the signup flow to create test accounts.' AS status; 