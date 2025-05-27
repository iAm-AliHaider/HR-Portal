// Comprehensive mock data for HR application
// This provides rich, realistic data for development and testing

export const mockEmployees = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    department: 'Engineering',
    position: 'Senior Developer',
    status: 'active',
    avatar: '/avatars/john.jpg',
    hire_date: '2022-03-15',
    salary: 85000,
    manager_id: '2',
    phone: '+1 (555) 123-4567',
    location: 'New York'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    department: 'HR',
    position: 'HR Manager',
    status: 'active',
    avatar: '/avatars/sarah.jpg',
    hire_date: '2021-01-10',
    salary: 75000,
    manager_id: null,
    phone: '+1 (555) 234-5678',
    location: 'San Francisco'
  },
  {
    id: '3',
    name: 'Alex Chen',
    email: 'alex.chen@company.com',
    department: 'Marketing',
    position: 'Marketing Specialist',
    status: 'active',
    avatar: '/avatars/alex.jpg',
    hire_date: '2023-06-01',
    salary: 65000,
    manager_id: '4',
    phone: '+1 (555) 345-6789',
    location: 'Remote'
  },
  {
    id: '4',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@company.com',
    department: 'Marketing',
    position: 'Marketing Director',
    status: 'active',
    avatar: '/avatars/michael.jpg',
    hire_date: '2020-09-15',
    salary: 95000,
    manager_id: null,
    phone: '+1 (555) 456-7890',
    location: 'Los Angeles'
  },
  {
    id: '5',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    department: 'Finance',
    position: 'Financial Analyst',
    status: 'active',
    avatar: '/avatars/emily.jpg',
    hire_date: '2022-11-01',
    salary: 70000,
    manager_id: '6',
    phone: '+1 (555) 567-8901',
    location: 'Chicago'
  },
  {
    id: '6',
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    department: 'Finance',
    position: 'Finance Director',
    status: 'active',
    avatar: '/avatars/david.jpg',
    hire_date: '2019-04-20',
    salary: 110000,
    manager_id: null,
    phone: '+1 (555) 678-9012',
    location: 'New York'
  }
];

export const mockLeaveRequests = [
  {
    id: '1',
    employee_id: '1',
    employee_name: 'John Smith',
    employee_email: 'john.smith@company.com',
    type: 'Annual Leave',
    start_date: '2024-06-15',
    end_date: '2024-06-20',
    days: 5,
    status: 'pending',
    reason: 'Family vacation to Europe',
    created_at: '2024-06-01T10:00:00Z',
    manager_email: 'sarah.johnson@company.com'
  },
  {
    id: '2',
    employee_id: '2',
    employee_name: 'Sarah Johnson',
    employee_email: 'sarah.johnson@company.com',
    type: 'Sick Leave',
    start_date: '2024-06-10',
    end_date: '2024-06-11',
    days: 2,
    status: 'approved',
    reason: 'Medical appointment and recovery',
    created_at: '2024-06-05T14:30:00Z',
    approved_at: '2024-06-06T09:15:00Z',
    manager_email: 'david.wilson@company.com'
  },
  {
    id: '3',
    employee_id: '3',
    employee_name: 'Alex Chen',
    employee_email: 'alex.chen@company.com',
    type: 'Personal Leave',
    start_date: '2024-07-01',
    end_date: '2024-07-03',
    days: 3,
    status: 'pending',
    reason: 'Moving to new apartment',
    created_at: '2024-06-10T16:45:00Z',
    manager_email: 'michael.rodriguez@company.com'
  },
  {
    id: '4',
    employee_id: '4',
    employee_name: 'Michael Rodriguez',
    employee_email: 'michael.rodriguez@company.com',
    type: 'Annual Leave',
    start_date: '2024-08-15',
    end_date: '2024-08-25',
    days: 10,
    status: 'approved',
    reason: 'Summer vacation with family',
    created_at: '2024-05-20T11:20:00Z',
    approved_at: '2024-05-21T10:00:00Z',
    manager_email: 'sarah.johnson@company.com'
  },
  {
    id: '5',
    employee_id: '5',
    employee_name: 'Emily Davis',
    employee_email: 'emily.davis@company.com',
    type: 'Maternity Leave',
    start_date: '2024-09-01',
    end_date: '2024-12-01',
    days: 90,
    status: 'approved',
    reason: 'Maternity leave for new baby',
    created_at: '2024-06-01T09:00:00Z',
    approved_at: '2024-06-02T08:30:00Z',
    manager_email: 'david.wilson@company.com'
  }
];

export const mockJobs = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    status: 'open',
    applications_count: 15,
    created_at: '2024-01-15',
    salary_range: '$80k - $120k',
    description: 'We are looking for a senior software engineer to join our growing team.',
    requirements: 'Bachelor\'s degree, 5+ years experience, React, Node.js',
    posted_by: 'Sarah Johnson',
    closing_date: '2024-07-15'
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    location: 'New York',
    type: 'Full-time',
    status: 'open',
    applications_count: 8,
    created_at: '2024-01-10',
    salary_range: '$90k - $130k',
    description: 'Lead product strategy and development for our flagship products.',
    requirements: 'MBA preferred, 3+ years product management experience',
    posted_by: 'Michael Rodriguez',
    closing_date: '2024-06-30'
  },
  {
    id: '3',
    title: 'UX Designer',
    department: 'Design',
    location: 'San Francisco',
    type: 'Full-time',
    status: 'open',
    applications_count: 12,
    created_at: '2024-02-01',
    salary_range: '$70k - $100k',
    description: 'Create amazing user experiences for our web and mobile applications.',
    requirements: 'Design degree, portfolio, Figma, user research experience',
    posted_by: 'Sarah Johnson',
    closing_date: '2024-07-01'
  },
  {
    id: '4',
    title: 'Data Analyst',
    department: 'Analytics',
    location: 'Chicago',
    type: 'Full-time',
    status: 'closed',
    applications_count: 25,
    created_at: '2024-01-05',
    salary_range: '$60k - $85k',
    description: 'Analyze business data to drive strategic decisions.',
    requirements: 'Statistics background, SQL, Python/R, 2+ years experience',
    posted_by: 'David Wilson',
    closing_date: '2024-05-15'
  }
];

export const mockTrainingCourses = [
  {
    id: '1',
    title: 'Leadership Fundamentals',
    category: 'leadership',
    duration: '16 hours',
    instructor: 'Sarah Johnson',
    enrolled: 18,
    capacity: 20,
    status: 'active',
    description: 'Essential leadership skills for managers and team leads',
    start_date: '2024-07-01',
    end_date: '2024-07-15',
    price: 299,
    location: 'Online'
  },
  {
    id: '2',
    title: 'Workplace Safety Training',
    category: 'safety',
    duration: '8 hours',
    instructor: 'Mike Wilson',
    enrolled: 25,
    capacity: 30,
    status: 'active',
    description: 'Comprehensive workplace safety and emergency procedures',
    start_date: '2024-06-20',
    end_date: '2024-06-25',
    price: 149,
    location: 'New York Office'
  },
  {
    id: '3',
    title: 'Advanced Excel Skills',
    category: 'technical',
    duration: '12 hours',
    instructor: 'Emily Davis',
    enrolled: 15,
    capacity: 25,
    status: 'active',
    description: 'Master advanced Excel functions, pivot tables, and data analysis',
    start_date: '2024-07-10',
    end_date: '2024-07-20',
    price: 199,
    location: 'Online'
  },
  {
    id: '4',
    title: 'Communication Skills',
    category: 'soft-skills',
    duration: '6 hours',
    instructor: 'Alex Chen',
    enrolled: 22,
    capacity: 25,
    status: 'completed',
    description: 'Improve verbal and written communication in the workplace',
    start_date: '2024-05-01',
    end_date: '2024-05-05',
    price: 129,
    location: 'San Francisco Office'
  }
];

export const mockComplianceRequirements = [
  {
    id: '1',
    name: 'Data Privacy (GDPR)',
    category: 'Privacy',
    status: 'compliant',
    last_review: '2024-01-15',
    next_review: '2024-07-15',
    description: 'Ensure all data processing complies with GDPR regulations',
    responsible_person: 'Sarah Johnson',
    priority: 'high'
  },
  {
    id: '2',
    name: 'Workplace Safety Standards',
    category: 'Safety',
    status: 'needs_attention',
    last_review: '2024-02-01',
    next_review: '2024-06-01',
    description: 'Regular safety inspections and employee training',
    responsible_person: 'Mike Wilson',
    priority: 'critical'
  },
  {
    id: '3',
    name: 'Financial Reporting',
    category: 'Finance',
    status: 'compliant',
    last_review: '2024-03-01',
    next_review: '2024-09-01',
    description: 'Quarterly financial reporting and audits',
    responsible_person: 'David Wilson',
    priority: 'medium'
  },
  {
    id: '4',
    name: 'Employee Background Checks',
    category: 'HR',
    status: 'partially_compliant',
    last_review: '2024-02-15',
    next_review: '2024-08-15',
    description: 'Background verification for all new hires',
    responsible_person: 'Sarah Johnson',
    priority: 'high'
  }
];

export const mockWorkflows = [
  {
    id: '1',
    name: 'Leave Approval Workflow',
    description: 'Standard leave request approval process',
    status: 'active',
    steps: 3,
    created_at: '2024-01-01',
    created_by: 'Sarah Johnson',
    last_modified: '2024-05-15',
    trigger: 'leave_request_submitted'
  },
  {
    id: '2',
    name: 'Onboarding Workflow',
    description: 'New employee onboarding process',
    status: 'active',
    steps: 5,
    created_at: '2024-01-05',
    created_by: 'Sarah Johnson',
    last_modified: '2024-04-20',
    trigger: 'employee_hired'
  },
  {
    id: '3',
    name: 'Performance Review Workflow',
    description: 'Annual performance review process',
    status: 'active',
    steps: 4,
    created_at: '2024-02-01',
    created_by: 'Michael Rodriguez',
    last_modified: '2024-03-10',
    trigger: 'review_period_start'
  },
  {
    id: '4',
    name: 'Expense Approval Workflow',
    description: 'Employee expense reimbursement approval',
    status: 'draft',
    steps: 2,
    created_at: '2024-05-01',
    created_by: 'David Wilson',
    last_modified: '2024-05-20',
    trigger: 'expense_submitted'
  }
];

export const mockPerformanceReviews = [
  {
    id: '1',
    employee_id: '1',
    employee_name: 'John Smith',
    reviewer_id: '2',
    reviewer_name: 'Sarah Johnson',
    period: '2024 Q1',
    status: 'completed',
    overall_rating: 4.5,
    goals_met: 85,
    created_at: '2024-04-01',
    completed_at: '2024-04-15',
    next_review: '2024-07-01'
  },
  {
    id: '2',
    employee_id: '3',
    employee_name: 'Alex Chen',
    reviewer_id: '4',
    reviewer_name: 'Michael Rodriguez',
    period: '2024 Q1',
    status: 'in_progress',
    overall_rating: null,
    goals_met: null,
    created_at: '2024-04-01',
    completed_at: null,
    next_review: '2024-07-01'
  }
];

export const mockApplications = [
  {
    id: '1',
    job_id: '1',
    job_title: 'Senior Software Engineer',
    candidate_name: 'Jennifer Liu',
    candidate_email: 'jennifer.liu@email.com',
    status: 'under_review',
    applied_at: '2024-05-15',
    resume_url: '/documents/jennifer_liu_resume.pdf',
    cover_letter: 'I am excited to apply for the Senior Software Engineer position...',
    experience_years: 6,
    current_company: 'Tech Solutions Inc.'
  },
  {
    id: '2',
    job_id: '1',
    job_title: 'Senior Software Engineer',
    candidate_name: 'Robert Kim',
    candidate_email: 'robert.kim@email.com',
    status: 'interview_scheduled',
    applied_at: '2024-05-10',
    resume_url: '/documents/robert_kim_resume.pdf',
    cover_letter: 'With 8 years of experience in full-stack development...',
    experience_years: 8,
    current_company: 'StartupXYZ'
  },
  {
    id: '3',
    job_id: '2',
    job_title: 'Product Manager',
    candidate_name: 'Lisa Thompson',
    candidate_email: 'lisa.thompson@email.com',
    status: 'offer_extended',
    applied_at: '2024-05-05',
    resume_url: '/documents/lisa_thompson_resume.pdf',
    cover_letter: 'As a product manager with 5 years of experience...',
    experience_years: 5,
    current_company: 'Product Corp'
  }
];

export const mockExpenses = [
  {
    id: '1',
    employee_id: '1',
    employee_name: 'John Smith',
    category: 'Travel',
    amount: 450.75,
    currency: 'USD',
    description: 'Flight tickets for client meeting',
    date: '2024-05-20',
    status: 'pending',
    receipt_url: '/receipts/flight_receipt.pdf',
    submitted_at: '2024-05-21'
  },
  {
    id: '2',
    employee_id: '3',
    employee_name: 'Alex Chen',
    category: 'Meals',
    amount: 85.50,
    currency: 'USD',
    description: 'Client lunch meeting',
    date: '2024-05-18',
    status: 'approved',
    receipt_url: '/receipts/lunch_receipt.pdf',
    submitted_at: '2024-05-19',
    approved_at: '2024-05-20'
  }
];

// Mock Interview Data
export const mockInterviews = [
  {
    id: 'int-001',
    application_id: 'app-001',
    candidate_name: 'John Doe',
    candidate_email: 'john.doe@example.com',
    position: 'Senior Frontend Developer',
    job_id: 'job-001',
    interviewer_id: 'emp-004',
    interviewer_name: 'Sarah Johnson',
    interviewer_email: 'sarah.johnson@company.com',
    stage: 'technical',
    type: 'technical-discussion',
    scheduled_at: '2023-09-15T14:00:00Z',
    duration: 60,
    location: 'video-zoom',
    notes: 'Focus on React performance optimization and state management',
    status: 'completed',
    feedback: {
      technical_skills: 4.5,
      communication: 4.0,
      problem_solving: 4.2,
      cultural_fit: 4.5,
      overall: 4.3,
      strengths: 'Strong React knowledge, excellent system design skills',
      areas_for_improvement: 'Could improve on testing methodologies',
      recommendation: 'Advance to next round'
    },
    created_at: '2023-09-10T09:00:00Z',
    updated_at: '2023-09-15T16:30:00Z'
  },
  {
    id: 'int-002',
    application_id: 'app-002',
    candidate_name: 'Jane Smith',
    candidate_email: 'jane.smith@example.com',
    position: 'Product Manager',
    job_id: 'job-003',
    interviewer_id: 'emp-007',
    interviewer_name: 'Michael Brown',
    interviewer_email: 'michael.brown@company.com',
    stage: 'initial',
    type: 'video',
    scheduled_at: '2023-09-18T10:00:00Z',
    duration: 45,
    location: 'video-teams',
    notes: 'Assess product thinking and user-centric approach',
    status: 'scheduled',
    created_at: '2023-09-12T11:30:00Z',
    updated_at: '2023-09-12T11:30:00Z'
  },
  {
    id: 'int-003',
    application_id: 'app-003',
    candidate_name: 'Robert Wilson',
    candidate_email: 'robert.wilson@example.com',
    position: 'DevOps Engineer',
    job_id: 'job-005',
    interviewer_id: 'emp-010',
    interviewer_name: 'Lisa Wang',
    interviewer_email: 'lisa.wang@company.com',
    stage: 'technical',
    type: 'coding',
    scheduled_at: '2023-09-16T13:00:00Z',
    duration: 90,
    location: 'video-zoom',
    notes: 'Focus on CI/CD pipeline setup and Kubernetes knowledge',
    status: 'completed',
    feedback: {
      technical_skills: 3.8,
      communication: 4.2,
      problem_solving: 3.5,
      cultural_fit: 4.0,
      overall: 3.9,
      strengths: 'Strong Docker and AWS knowledge',
      areas_for_improvement: 'Could improve Kubernetes expertise',
      recommendation: 'Consider for next round with reservations'
    },
    created_at: '2023-09-10T15:45:00Z',
    updated_at: '2023-09-16T15:00:00Z'
  },
  {
    id: 'int-004',
    application_id: 'app-004',
    candidate_name: 'Emily Johnson',
    candidate_email: 'emily.johnson@example.com',
    position: 'UX Designer',
    job_id: 'job-006',
    interviewer_id: 'emp-012',
    interviewer_name: 'David Miller',
    interviewer_email: 'david.miller@company.com',
    stage: 'final',
    type: 'team',
    scheduled_at: '2023-09-20T11:00:00Z',
    duration: 120,
    location: 'onsite-conference',
    notes: 'Final panel interview with design team',
    status: 'scheduled',
    created_at: '2023-09-13T10:20:00Z',
    updated_at: '2023-09-13T10:20:00Z'
  },
  {
    id: 'int-005',
    application_id: 'app-005',
    candidate_name: 'Carlos Rodriguez',
    candidate_email: 'carlos.rodriguez@example.com',
    position: 'Backend Developer',
    job_id: 'job-002',
    interviewer_id: 'emp-006',
    interviewer_name: 'Anna Thompson',
    interviewer_email: 'anna.thompson@company.com',
    stage: 'technical',
    type: 'system-design',
    scheduled_at: '2023-09-19T15:30:00Z',
    duration: 60,
    location: 'video-zoom',
    notes: 'Focus on database design and API architecture',
    status: 'canceled',
    created_at: '2023-09-14T09:10:00Z',
    updated_at: '2023-09-17T14:20:00Z'
  }
];

// Mock Offer Data
export const mockOffers = [
  {
    id: 'offer-001',
    application_id: 'app-001',
    candidate_name: 'John Doe',
    candidate_email: 'john.doe@example.com',
    position: 'Senior Frontend Developer',
    department: 'Engineering',
    job_id: 'job-001',
    salary: 120000,
    equity: '0.1%',
    bonus: 10000,
    start_date: '2023-10-15',
    expiration_date: '2023-09-25',
    status: 'accepted',
    benefits: [
      { id: 'health', name: 'Health Insurance', description: 'Comprehensive health coverage' },
      { id: 'dental', name: 'Dental Insurance', description: 'Dental coverage for preventive care' },
      { id: 'vision', name: 'Vision Insurance', description: 'Vision coverage for eye care' },
      { id: '401k', name: '401(k) Plan', description: 'Retirement savings plan with company match' },
      { id: 'pto', name: 'Paid Time Off', description: '15 days of vacation + holidays' }
    ],
    contract_type: 'full-time',
    notes: 'Candidate accepted offer and signed contract. Starting on October 15th.',
    created_at: '2023-09-16T10:00:00Z',
    updated_at: '2023-09-20T14:30:00Z',
    accepted_at: '2023-09-20T14:30:00Z'
  },
  {
    id: 'offer-002',
    application_id: 'app-003',
    candidate_name: 'Robert Wilson',
    candidate_email: 'robert.wilson@example.com',
    position: 'DevOps Engineer',
    department: 'Engineering',
    job_id: 'job-005',
    salary: 110000,
    equity: '0.05%',
    bonus: 8000,
    start_date: '2023-10-01',
    expiration_date: '2023-09-23',
    status: 'sent',
    benefits: [
      { id: 'health', name: 'Health Insurance', description: 'Comprehensive health coverage' },
      { id: 'dental', name: 'Dental Insurance', description: 'Dental coverage for preventive care' },
      { id: 'vision', name: 'Vision Insurance', description: 'Vision coverage for eye care' },
      { id: '401k', name: '401(k) Plan', description: 'Retirement savings plan with company match' },
      { id: 'pto', name: 'Paid Time Off', description: '15 days of vacation + holidays' }
    ],
    contract_type: 'full-time',
    notes: 'Offer sent, awaiting response from candidate.',
    created_at: '2023-09-17T11:20:00Z',
    updated_at: '2023-09-17T15:45:00Z'
  },
  {
    id: 'offer-003',
    application_id: 'app-006',
    candidate_name: 'Maria Garcia',
    candidate_email: 'maria.garcia@example.com',
    position: 'Marketing Manager',
    department: 'Marketing',
    job_id: 'job-008',
    salary: 95000,
    equity: '0%',
    bonus: 7500,
    start_date: '2023-10-10',
    expiration_date: '2023-09-20',
    status: 'rejected',
    benefits: [
      { id: 'health', name: 'Health Insurance', description: 'Comprehensive health coverage' },
      { id: 'dental', name: 'Dental Insurance', description: 'Dental coverage for preventive care' },
      { id: 'vision', name: 'Vision Insurance', description: 'Vision coverage for eye care' },
      { id: '401k', name: '401(k) Plan', description: 'Retirement savings plan with company match' },
      { id: 'pto', name: 'Paid Time Off', description: '15 days of vacation + holidays' }
    ],
    contract_type: 'full-time',
    notes: 'Candidate rejected offer due to compensation. Accepted a competitive offer.',
    created_at: '2023-09-10T09:30:00Z',
    updated_at: '2023-09-18T16:20:00Z',
    rejected_at: '2023-09-18T16:20:00Z',
    rejection_reason: 'Accepted another offer with higher compensation'
  },
  {
    id: 'offer-004',
    application_id: 'app-007',
    candidate_name: 'Alex Thompson',
    candidate_email: 'alex.thompson@example.com',
    position: 'Data Scientist',
    department: 'Data',
    job_id: 'job-010',
    salary: 115000,
    equity: '0.05%',
    bonus: 8000,
    start_date: '2023-10-30',
    expiration_date: '2023-09-30',
    status: 'negotiating',
    benefits: [
      { id: 'health', name: 'Health Insurance', description: 'Comprehensive health coverage' },
      { id: 'dental', name: 'Dental Insurance', description: 'Dental coverage for preventive care' },
      { id: 'vision', name: 'Vision Insurance', description: 'Vision coverage for eye care' },
      { id: '401k', name: '401(k) Plan', description: 'Retirement savings plan with company match' },
      { id: 'pto', name: 'Paid Time Off', description: '15 days of vacation + holidays' },
      { id: 'remote', name: 'Remote Work', description: 'Flexible work from home options' }
    ],
    contract_type: 'full-time',
    notes: 'Candidate requested salary adjustment and additional equity. HR is considering the request.',
    created_at: '2023-09-18T13:40:00Z',
    updated_at: '2023-09-19T10:15:00Z'
  },
  {
    id: 'offer-005',
    application_id: 'app-008',
    candidate_name: 'Sarah Davis',
    candidate_email: 'sarah.davis@example.com',
    position: 'Technical Writer',
    department: 'Documentation',
    job_id: 'job-012',
    salary: 80000,
    equity: '0%',
    bonus: 4000,
    start_date: '2023-10-15',
    expiration_date: '2023-09-28',
    status: 'draft',
    benefits: [
      { id: 'health', name: 'Health Insurance', description: 'Comprehensive health coverage' },
      { id: 'dental', name: 'Dental Insurance', description: 'Dental coverage for preventive care' },
      { id: 'vision', name: 'Vision Insurance', description: 'Vision coverage for eye care' },
      { id: '401k', name: '401(k) Plan', description: 'Retirement savings plan with company match' },
      { id: 'pto', name: 'Paid Time Off', description: '15 days of vacation + holidays' },
      { id: 'education', name: 'Education Stipend', description: '$1,000 annual education budget' }
    ],
    contract_type: 'full-time',
    notes: 'Offer being prepared. Pending approval from hiring manager.',
    created_at: '2023-09-19T09:00:00Z',
    updated_at: '2023-09-19T09:00:00Z'
  }
];

// Export all mock data with realistic relationships and comprehensive coverage
export const mockData = {
  employees: mockEmployees,
  leaveRequests: mockLeaveRequests,
  jobs: mockJobs,
  trainingCourses: mockTrainingCourses,
  complianceRequirements: mockComplianceRequirements,
  workflows: mockWorkflows,
  performanceReviews: mockPerformanceReviews,
  applications: mockApplications,
  expenses: mockExpenses,
  interviews: mockInterviews,
  offers: mockOffers
}; 