import { 
  TrainingCourse, 
  TrainingSession, 
  TrainingEnrollment, 
  Trainer, 
  TrainingCategory,
  TrainingAssessment,
  TrainingCertificate,
  TrainingPathway,
  TrainingFeedback,
  Document
} from '../../packages/types/hr';

// Mock delay to simulate API calls
const mockDelay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Check if environment variables are configured for real database
const isSupabaseConfigured = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return supabaseUrl && supabaseKey && 
         supabaseUrl !== 'your-supabase-url' && 
         supabaseKey !== 'your-supabase-anon-key';
};

// Mock Training Categories
const mockCategories: TrainingCategory[] = [
  {
    id: 'cat1',
    org_id: 'org1',
    name: 'Technical Skills',
    description: 'Programming, software development, and technical training',
    color: '#3B82F6',
    icon: 'code',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat2',
    org_id: 'org1',
    name: 'Leadership & Management',
    description: 'Leadership development and management skills',
    color: '#8B5CF6',
    icon: 'users',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat3',
    org_id: 'org1',
    name: 'Compliance & Safety',
    description: 'Mandatory compliance and safety training',
    color: '#EF4444',
    icon: 'shield',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat4',
    org_id: 'org1',
    name: 'Soft Skills',
    description: 'Communication, teamwork, and interpersonal skills',
    color: '#10B981',
    icon: 'heart',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat5',
    org_id: 'org1',
    name: 'Onboarding',
    description: 'New employee orientation and onboarding programs',
    color: '#F59E0B',
    icon: 'user-plus',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Trainers
const mockTrainers: Trainer[] = [
  {
    id: 'trainer1',
    org_id: 'org1',
    user_id: 'user1',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1-555-0101',
    type: 'internal',
    bio: 'Senior Software Engineer with 10+ years of experience in full-stack development and team leadership.',
    expertise_areas: ['JavaScript', 'React', 'Node.js', 'Team Leadership', 'Agile Methodologies'],
    certifications: [
      {
        name: 'Certified Scrum Master',
        issuing_body: 'Scrum Alliance',
        issue_date: '2022-03-15',
        expiry_date: '2024-03-15',
        credential_id: 'CSM-123456'
      }
    ],
    experience_years: 10,
    hourly_rate: 150,
    languages: ['English', 'Spanish'],
    rating: 4.8,
    total_sessions: 45,
    profile_image_url: '/avatars/sarah-johnson.jpg',
    linkedin_url: 'https://linkedin.com/in/sarahjohnson',
    specializations: ['Frontend Development', 'Team Management', 'Code Reviews'],
    training_style: 'Interactive and hands-on with real-world examples',
    status: 'active',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'trainer2',
    org_id: 'org1',
    first_name: 'Dr. Michael',
    last_name: 'Chen',
    email: 'michael.chen@trainingcorp.com',
    phone: '+1-555-0102',
    type: 'external',
    bio: 'Leadership development expert and organizational psychologist with extensive corporate training experience.',
    expertise_areas: ['Leadership Development', 'Change Management', 'Team Dynamics', 'Executive Coaching'],
    certifications: [
      {
        name: 'Certified Executive Coach',
        issuing_body: 'International Coach Federation',
        issue_date: '2020-06-10',
        expiry_date: '2025-06-10',
        credential_id: 'ICF-789012'
      },
      {
        name: 'Organizational Psychology PhD',
        issuing_body: 'Stanford University',
        issue_date: '2015-05-20'
      }
    ],
    experience_years: 15,
    hourly_rate: 250,
    daily_rate: 2000,
    languages: ['English', 'Mandarin'],
    rating: 4.9,
    total_sessions: 120,
    profile_image_url: '/avatars/michael-chen.jpg',
    linkedin_url: 'https://linkedin.com/in/drmichaelchen',
    website_url: 'https://michaelchenleadership.com',
    specializations: ['Executive Leadership', 'Organizational Change', 'Performance Management'],
    training_style: 'Strategic thinking with practical application and peer learning',
    travel_willingness: {
      local: true,
      national: true,
      international: true,
      max_travel_distance_km: 5000
    },
    status: 'active',
    created_at: '2024-01-10T00:00:00Z'
  },
  {
    id: 'trainer3',
    org_id: 'org1',
    user_id: 'user3',
    first_name: 'Jennifer',
    last_name: 'Martinez',
    email: 'jennifer.martinez@company.com',
    phone: '+1-555-0103',
    type: 'internal',
    bio: 'HR specialist focusing on compliance training, workplace safety, and regulatory requirements.',
    expertise_areas: ['Compliance Training', 'Workplace Safety', 'HR Policies', 'Data Privacy'],
    certifications: [
      {
        name: 'Certified Safety Professional',
        issuing_body: 'Board of Certified Safety Professionals',
        issue_date: '2021-09-01',
        expiry_date: '2024-09-01',
        credential_id: 'CSP-345678'
      }
    ],
    experience_years: 8,
    hourly_rate: 120,
    languages: ['English', 'Spanish'],
    rating: 4.7,
    total_sessions: 38,
    specializations: ['OSHA Compliance', 'GDPR Training', 'Sexual Harassment Prevention'],
    training_style: 'Clear, structured approach with emphasis on practical compliance',
    status: 'active',
    created_at: '2024-01-20T00:00:00Z'
  }
];

// Mock Training Courses
const mockCourses: TrainingCourse[] = [
  {
    id: 'course1',
    org_id: 'org1',
    title: 'React Development Fundamentals',
    description: 'Comprehensive introduction to React.js development, covering components, state management, and modern React patterns.',
    category_id: 'cat1',
    type: 'technical',
    level: 'intermediate',
    delivery_method: 'hybrid',
    duration_hours: 24,
    max_participants: 15,
    min_participants: 5,
    prerequisites: ['Basic JavaScript knowledge', 'HTML/CSS familiarity'],
    learning_objectives: [
      'Understand React component architecture',
      'Master state and props management',
      'Implement modern React hooks',
      'Build responsive user interfaces',
      'Apply testing best practices'
    ],
    course_outline: [
      {
        module_title: 'Introduction to React',
        module_description: 'React fundamentals and setup',
        duration_minutes: 180,
        learning_outcomes: ['Understand React philosophy', 'Set up development environment'],
        resources: ['React documentation', 'Setup guide']
      },
      {
        module_title: 'Components and JSX',
        module_description: 'Building components with JSX syntax',
        duration_minutes: 240,
        learning_outcomes: ['Create functional components', 'Use JSX effectively'],
        resources: ['Component examples', 'JSX best practices']
      },
      {
        module_title: 'State and Props',
        module_description: 'Managing component state and data flow',
        duration_minutes: 300,
        learning_outcomes: ['Manage local state', 'Pass data between components'],
        resources: ['State management patterns', 'Props drilling examples']
      },
      {
        module_title: 'Hooks and Advanced Patterns',
        module_description: 'Modern React patterns and hooks',
        duration_minutes: 360,
        learning_outcomes: ['Use React hooks', 'Implement custom hooks'],
        resources: ['Hooks documentation', 'Custom hook examples']
      },
      {
        module_title: 'Testing and Deployment',
        module_description: 'Testing React applications and deployment strategies',
        duration_minutes: 360,
        learning_outcomes: ['Write unit tests', 'Deploy React applications'],
        resources: ['Testing library docs', 'Deployment guides']
      }
    ],
    materials: [
      {
        type: 'document',
        title: 'React Quick Reference Guide',
        description: 'Comprehensive cheat sheet for React development',
        url: '/documents/react-reference.pdf',
        is_required: true,
        order: 1
      },
      {
        type: 'video',
        title: 'React Fundamentals Video Series',
        description: '10-part video series covering React basics',
        url: '/videos/react-fundamentals',
        duration_minutes: 180,
        is_required: true,
        order: 2
      },
      {
        type: 'presentation',
        title: 'Modern React Patterns',
        description: 'Slide deck covering advanced React patterns',
        url: '/presentations/react-patterns.pptx',
        is_required: false,
        order: 3
      }
    ],
    assessment_required: true,
    certification_awarded: true,
    certification_validity_months: 24,
    cost_per_participant: 800,
    status: 'published',
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
    difficulty_rating: 3,
    average_rating: 4.6,
    total_enrollments: 89,
    completion_rate: 87,
    target_audience: ['Frontend Developers', 'Full-stack Developers', 'UI Engineers'],
    required_for_roles: ['Senior Frontend Developer', 'React Developer'],
    created_by: 'trainer1',
    created_at: '2024-01-15T00:00:00Z',
    published_at: '2024-01-20T00:00:00Z'
  },
  {
    id: 'course2',
    org_id: 'org1',
    title: 'Leadership Essentials for New Managers',
    description: 'Foundational leadership skills for first-time managers, covering team dynamics, communication, and performance management.',
    category_id: 'cat2',
    type: 'leadership',
    level: 'beginner',
    delivery_method: 'in_person',
    duration_hours: 16,
    max_participants: 12,
    min_participants: 6,
    prerequisites: ['6+ months management experience'],
    learning_objectives: [
      'Develop effective communication skills',
      'Learn performance management techniques',
      'Understand team dynamics',
      'Build delegation skills',
      'Handle difficult conversations'
    ],
    course_outline: [
      {
        module_title: 'Leadership Fundamentals',
        module_description: 'Core principles of effective leadership',
        duration_minutes: 240,
        learning_outcomes: ['Define leadership vs management', 'Identify leadership styles'],
        resources: ['Leadership assessment', 'Style guide']
      },
      {
        module_title: 'Communication and Feedback',
        module_description: 'Effective communication and feedback techniques',
        duration_minutes: 240,
        learning_outcomes: ['Give constructive feedback', 'Active listening skills'],
        resources: ['Communication templates', 'Feedback framework']
      },
      {
        module_title: 'Team Dynamics and Motivation',
        module_description: 'Understanding and motivating team members',
        duration_minutes: 240,
        learning_outcomes: ['Motivate diverse teams', 'Resolve team conflicts'],
        resources: ['Team assessment tools', 'Motivation theories']
      },
      {
        module_title: 'Performance Management',
        module_description: 'Setting goals and managing performance',
        duration_minutes: 240,
        learning_outcomes: ['Set SMART goals', 'Conduct performance reviews'],
        resources: ['Goal-setting templates', 'Performance frameworks']
      }
    ],
    assessment_required: true,
    certification_awarded: true,
    certification_validity_months: 36,
    cost_per_participant: 1200,
    status: 'published',
    tags: ['Leadership', 'Management', 'Team Building', 'Communication'],
    difficulty_rating: 2,
    average_rating: 4.8,
    total_enrollments: 67,
    completion_rate: 94,
    target_audience: ['New Managers', 'Team Leads', 'Supervisors'],
    required_for_roles: ['Manager', 'Team Lead', 'Department Head'],
    created_by: 'trainer2',
    created_at: '2024-01-10T00:00:00Z',
    published_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'course3',
    org_id: 'org1',
    title: 'Workplace Safety and OSHA Compliance',
    description: 'Mandatory safety training covering OSHA regulations, workplace hazards, and emergency procedures.',
    category_id: 'cat3',
    type: 'compliance',
    level: 'beginner',
    delivery_method: 'virtual',
    duration_hours: 4,
    max_participants: 50,
    min_participants: 1,
    learning_objectives: [
      'Understand OSHA regulations',
      'Identify workplace hazards',
      'Know emergency procedures',
      'Use safety equipment properly',
      'Report safety incidents'
    ],
    course_outline: [
      {
        module_title: 'OSHA Overview',
        module_description: 'Introduction to OSHA and workplace safety regulations',
        duration_minutes: 60,
        learning_outcomes: ['Understand OSHA purpose', 'Know employee rights'],
        resources: ['OSHA handbook', 'Regulation summary']
      },
      {
        module_title: 'Hazard Identification',
        module_description: 'Recognizing and assessing workplace hazards',
        duration_minutes: 60,
        learning_outcomes: ['Identify common hazards', 'Assess risk levels'],
        resources: ['Hazard checklist', 'Risk assessment forms']
      },
      {
        module_title: 'Safety Procedures',
        module_description: 'Proper safety procedures and equipment use',
        duration_minutes: 60,
        learning_outcomes: ['Follow safety protocols', 'Use PPE correctly'],
        resources: ['Safety manual', 'PPE guide']
      },
      {
        module_title: 'Emergency Response',
        module_description: 'Emergency procedures and incident reporting',
        duration_minutes: 60,
        learning_outcomes: ['Execute emergency procedures', 'Report incidents properly'],
        resources: ['Emergency guide', 'Incident forms']
      }
    ],
    assessment_required: true,
    certification_awarded: true,
    certification_validity_months: 12,
    status: 'published',
    tags: ['Safety', 'OSHA', 'Compliance', 'Emergency Procedures'],
    difficulty_rating: 1,
    average_rating: 4.3,
    total_enrollments: 245,
    completion_rate: 98,
    target_audience: ['All Employees'],
    auto_assign_rules: {
      departments: ['All'],
      roles: ['All'],
      hire_date_after: '2024-01-01'
    },
    created_by: 'trainer3',
    created_at: '2024-01-20T00:00:00Z',
    published_at: '2024-01-25T00:00:00Z'
  },
  {
    id: 'course4',
    org_id: 'org1',
    title: 'Effective Communication Skills',
    description: 'Develop professional communication skills including presentation, writing, and interpersonal communication.',
    category_id: 'cat4',
    type: 'soft_skills',
    level: 'intermediate',
    delivery_method: 'blended',
    duration_hours: 12,
    max_participants: 20,
    min_participants: 8,
    learning_objectives: [
      'Improve verbal communication',
      'Enhance written communication',
      'Develop presentation skills',
      'Master active listening',
      'Handle difficult conversations'
    ],
    course_outline: [
      {
        module_title: 'Communication Fundamentals',
        module_description: 'Basic principles of effective communication',
        duration_minutes: 180,
        learning_outcomes: ['Understand communication models', 'Identify barriers'],
        resources: ['Communication theory', 'Barrier analysis']
      },
      {
        module_title: 'Verbal Communication',
        module_description: 'Speaking clearly and persuasively',
        duration_minutes: 180,
        learning_outcomes: ['Speak with confidence', 'Use persuasive techniques'],
        resources: ['Speaking tips', 'Persuasion techniques']
      },
      {
        module_title: 'Written Communication',
        module_description: 'Professional writing and documentation',
        duration_minutes: 180,
        learning_outcomes: ['Write clearly and concisely', 'Format professional documents'],
        resources: ['Writing guide', 'Template library']
      },
      {
        module_title: 'Presentation Skills',
        module_description: 'Creating and delivering effective presentations',
        duration_minutes: 180,
        learning_outcomes: ['Design compelling presentations', 'Deliver with confidence'],
        resources: ['Presentation templates', 'Delivery techniques']
      }
    ],
    assessment_required: true,
    certification_awarded: true,
    certification_validity_months: 24,
    cost_per_participant: 600,
    status: 'published',
    tags: ['Communication', 'Presentation', 'Writing', 'Soft Skills'],
    difficulty_rating: 2,
    average_rating: 4.5,
    total_enrollments: 134,
    completion_rate: 91,
    target_audience: ['All Employees', 'Client-facing Roles'],
    created_by: 'trainer2',
    created_at: '2024-01-12T00:00:00Z',
    published_at: '2024-01-18T00:00:00Z'
  },
  {
    id: 'course5',
    org_id: 'org1',
    title: 'New Employee Onboarding',
    description: 'Comprehensive onboarding program for new hires covering company culture, policies, and role-specific training.',
    category_id: 'cat5',
    type: 'onboarding',
    level: 'beginner',
    delivery_method: 'hybrid',
    duration_hours: 20,
    max_participants: 10,
    min_participants: 1,
    learning_objectives: [
      'Understand company culture and values',
      'Learn policies and procedures',
      'Set up necessary accounts and tools',
      'Meet key team members',
      'Complete initial role training'
    ],
    course_outline: [
      {
        module_title: 'Welcome and Company Overview',
        module_description: 'Introduction to company history, mission, and culture',
        duration_minutes: 240,
        learning_outcomes: ['Understand company mission', 'Learn organizational structure'],
        resources: ['Company handbook', 'Org chart']
      },
      {
        module_title: 'Policies and Procedures',
        module_description: 'HR policies, benefits, and administrative procedures',
        duration_minutes: 240,
        learning_outcomes: ['Understand HR policies', 'Complete required forms'],
        resources: ['Employee handbook', 'Benefits guide']
      },
      {
        module_title: 'Systems and Tools',
        module_description: 'Setup and training on company systems and tools',
        duration_minutes: 240,
        learning_outcomes: ['Access all required systems', 'Use collaboration tools'],
        resources: ['System guides', 'Setup checklists']
      },
      {
        module_title: 'Role-Specific Training',
        module_description: 'Department-specific training and role expectations',
        duration_minutes: 360,
        learning_outcomes: ['Understand role responsibilities', 'Meet team members'],
        resources: ['Job description', 'Team directory']
      },
      {
        module_title: 'Goals and Next Steps',
        module_description: 'Setting initial goals and planning development',
        duration_minutes: 120,
        learning_outcomes: ['Set 30-60-90 day goals', 'Plan development path'],
        resources: ['Goal templates', 'Development plans']
      }
    ],
    assessment_required: false,
    certification_awarded: true,
    certification_validity_months: 12,
    status: 'published',
    tags: ['Onboarding', 'New Hire', 'Company Culture', 'Orientation'],
    difficulty_rating: 1,
    average_rating: 4.7,
    total_enrollments: 156,
    completion_rate: 99,
    target_audience: ['New Employees'],
    auto_assign_rules: {
      conditions: ['New hire within 30 days']
    },
    created_by: 'trainer3',
    created_at: '2024-01-05T00:00:00Z',
    published_at: '2024-01-10T00:00:00Z'
  }
];

// Mock Training Sessions
const mockSessions: TrainingSession[] = [
  {
    id: 'session1',
    org_id: 'org1',
    course_id: 'course1',
    trainer_id: 'trainer1',
    title: 'React Development Fundamentals - Batch 1',
    description: 'Intensive 3-day React training workshop',
    session_type: 'workshop',
    delivery_method: 'hybrid',
    start_time: '2024-03-15T09:00:00Z',
    end_time: '2024-03-17T17:00:00Z',
    timezone: 'America/New_York',
    location: 'Training Room A, Building 1',
    room_booking_id: 'booking1',
    virtual_meeting_url: 'https://zoom.us/j/123456789',
    virtual_platform: 'Zoom',
    max_participants: 15,
    current_enrollment: 12,
    enrollment_deadline: '2024-03-10T23:59:59Z',
    materials_list: ['Laptop with Node.js installed', 'Code editor', 'Training materials'],
    status: 'scheduled',
    attendance_tracking: true,
    recording_enabled: true,
    cost_per_participant: 800,
    total_cost: 9600,
    equipment_bookings: ['asset1', 'asset2'],
    language: 'English',
    is_mandatory: false,
    created_by: 'trainer1',
    created_at: '2024-02-01T00:00:00Z'
  },
  {
    id: 'session2',
    org_id: 'org1',
    course_id: 'course2',
    trainer_id: 'trainer2',
    title: 'Leadership Essentials - Q1 Cohort',
    description: 'Leadership development program for new managers',
    session_type: 'seminar',
    delivery_method: 'in_person',
    start_time: '2024-03-20T09:00:00Z',
    end_time: '2024-03-22T17:00:00Z',
    timezone: 'America/New_York',
    location: 'Executive Conference Room',
    room_booking_id: 'booking2',
    max_participants: 12,
    current_enrollment: 10,
    waiting_list_count: 2,
    enrollment_deadline: '2024-03-15T23:59:59Z',
    materials_list: ['Notebook', 'Leadership assessment packet'],
    status: 'scheduled',
    attendance_tracking: true,
    cost_per_participant: 1200,
    total_cost: 12000,
    catering_required: true,
    catering_details: 'Coffee breaks and lunch provided',
    language: 'English',
    is_mandatory: false,
    created_by: 'trainer2',
    created_at: '2024-02-05T00:00:00Z'
  },
  {
    id: 'session3',
    org_id: 'org1',
    course_id: 'course3',
    trainer_id: 'trainer3',
    title: 'OSHA Safety Training - Monthly Session',
    description: 'Monthly mandatory safety training for all employees',
    session_type: 'webinar',
    delivery_method: 'virtual',
    start_time: '2024-03-25T14:00:00Z',
    end_time: '2024-03-25T18:00:00Z',
    timezone: 'America/New_York',
    virtual_meeting_url: 'https://teams.microsoft.com/meet/123456',
    virtual_platform: 'Microsoft Teams',
    max_participants: 50,
    current_enrollment: 35,
    enrollment_deadline: '2024-03-22T23:59:59Z',
    status: 'scheduled',
    attendance_tracking: true,
    recording_enabled: true,
    language: 'English',
    is_mandatory: true,
    compliance_tracking: true,
    created_by: 'trainer3',
    created_at: '2024-02-10T00:00:00Z'
  },
  {
    id: 'session4',
    org_id: 'org1',
    course_id: 'course4',
    trainer_id: 'trainer2',
    title: 'Communication Skills Workshop',
    description: 'Interactive communication skills development workshop',
    session_type: 'workshop',
    delivery_method: 'in_person',
    start_time: '2024-04-01T09:00:00Z',
    end_time: '2024-04-02T17:00:00Z',
    timezone: 'America/New_York',
    location: 'Training Room B, Building 2',
    room_booking_id: 'booking3',
    max_participants: 20,
    current_enrollment: 18,
    enrollment_deadline: '2024-03-28T23:59:59Z',
    materials_list: ['Workbook', 'Video recording equipment for practice'],
    status: 'scheduled',
    attendance_tracking: true,
    cost_per_participant: 600,
    total_cost: 10800,
    equipment_bookings: ['asset3'],
    language: 'English',
    is_mandatory: false,
    created_by: 'trainer2',
    created_at: '2024-02-15T00:00:00Z'
  },
  {
    id: 'session5',
    org_id: 'org1',
    course_id: 'course5',
    trainer_id: 'trainer3',
    title: 'New Employee Onboarding - March Intake',
    description: 'Comprehensive onboarding for March new hires',
    session_type: 'live',
    delivery_method: 'hybrid',
    start_time: '2024-03-28T09:00:00Z',
    end_time: '2024-03-29T17:00:00Z',
    timezone: 'America/New_York',
    location: 'Main Conference Room',
    room_booking_id: 'booking4',
    virtual_meeting_url: 'https://zoom.us/j/987654321',
    virtual_platform: 'Zoom',
    max_participants: 10,
    current_enrollment: 6,
    enrollment_deadline: '2024-03-26T23:59:59Z',
    materials_list: ['Employee handbook', 'Welcome packet', 'IT setup checklist'],
    status: 'scheduled',
    attendance_tracking: true,
    language: 'English',
    is_mandatory: true,
    created_by: 'trainer3',
    created_at: '2024-02-20T00:00:00Z'
  }
];

// Mock Training Enrollments
const mockEnrollments: TrainingEnrollment[] = [
  {
    id: 'enrollment1',
    org_id: 'org1',
    session_id: 'session1',
    course_id: 'course1',
    user_id: 'user1',
    enrollment_type: 'self_enrolled',
    enrollment_date: '2024-02-15T10:30:00Z',
    status: 'enrolled',
    manager_approval_required: false,
    cost_charged: 800,
    created_at: '2024-02-15T10:30:00Z'
  },
  {
    id: 'enrollment2',
    org_id: 'org1',
    session_id: 'session2',
    course_id: 'course2',
    user_id: 'user2',
    enrollment_type: 'manager_assigned',
    enrolled_by: 'manager1',
    enrollment_date: '2024-02-10T14:20:00Z',
    status: 'enrolled',
    manager_approval_required: true,
    manager_approved: true,
    manager_approved_by: 'manager1',
    manager_approval_date: '2024-02-10T14:25:00Z',
    cost_charged: 1200,
    created_at: '2024-02-10T14:20:00Z'
  },
  {
    id: 'enrollment3',
    org_id: 'org1',
    session_id: 'session3',
    course_id: 'course3',
    user_id: 'user3',
    enrollment_type: 'auto_assigned',
    enrollment_date: '2024-02-12T09:00:00Z',
    status: 'enrolled',
    created_at: '2024-02-12T09:00:00Z'
  },
  {
    id: 'enrollment4',
    org_id: 'org1',
    session_id: 'session1',
    course_id: 'course1',
    user_id: 'user4',
    enrollment_type: 'hr_assigned',
    enrolled_by: 'hr1',
    enrollment_date: '2024-02-18T11:15:00Z',
    status: 'enrolled',
    cost_charged: 800,
    created_at: '2024-02-18T11:15:00Z'
  },
  {
    id: 'enrollment5',
    org_id: 'org1',
    session_id: 'session5',
    course_id: 'course5',
    user_id: 'user5',
    enrollment_type: 'mandatory',
    enrollment_date: '2024-02-25T08:00:00Z',
    status: 'enrolled',
    created_at: '2024-02-25T08:00:00Z'
  }
];

// Mock Training Assessments
const mockAssessments: TrainingAssessment[] = [
  {
    id: 'assessment1',
    org_id: 'org1',
    course_id: 'course1',
    title: 'React Fundamentals Knowledge Check',
    description: 'Post-training assessment for React fundamentals course',
    type: 'post_training',
    format: 'multiple_choice',
    duration_minutes: 60,
    total_questions: 25,
    passing_score: 80,
    max_attempts: 2,
    questions: [
      {
        id: 'q1',
        question: 'What is the virtual DOM in React?',
        type: 'multiple_choice',
        options: [
          'A real DOM representation',
          'A JavaScript representation of the real DOM',
          'A CSS framework',
          'A database structure'
        ],
        correct_answers: ['A JavaScript representation of the real DOM'],
        points: 4,
        explanation: 'The virtual DOM is a JavaScript representation of the real DOM that React uses for efficient updates.'
      },
      {
        id: 'q2',
        question: 'React components must return a single parent element.',
        type: 'true_false',
        options: ['True', 'False'],
        correct_answers: ['False'],
        points: 2,
        explanation: 'React components can return multiple elements using fragments or arrays.'
      }
    ],
    instructions: 'Complete all questions within 60 minutes. You have 2 attempts to pass.',
    time_limit_enforced: true,
    randomize_questions: true,
    show_correct_answers: true,
    feedback_immediate: true,
    is_mandatory: true,
    weight_in_course: 30,
    created_by: 'trainer1',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'assessment2',
    org_id: 'org1',
    course_id: 'course2',
    title: 'Leadership Skills Assessment',
    description: 'Practical assessment of leadership competencies',
    type: 'practical',
    format: 'mixed',
    duration_minutes: 90,
    total_questions: 15,
    passing_score: 75,
    max_attempts: 1,
    instructions: 'Complete scenario-based questions and role-playing exercises.',
    time_limit_enforced: true,
    is_mandatory: true,
    weight_in_course: 40,
    created_by: 'trainer2',
    created_at: '2024-01-10T00:00:00Z'
  }
];

// Mock Training Certificates
const mockCertificates: TrainingCertificate[] = [
  {
    id: 'cert1',
    org_id: 'org1',
    user_id: 'user1',
    course_id: 'course1',
    session_id: 'session1',
    enrollment_id: 'enrollment1',
    certificate_number: 'REACT-2024-001',
    title: 'React Development Fundamentals Certificate',
    description: 'Successfully completed React Development Fundamentals training program',
    issue_date: '2024-03-20T00:00:00Z',
    expiry_date: '2026-03-20T00:00:00Z',
    status: 'active',
    certificate_url: '/certificates/REACT-2024-001.pdf',
    verification_code: 'RDF-ABC123-XYZ789',
    issuing_authority: 'TechCorp Training Department',
    issuer_signature: 'Sarah Johnson',
    issuer_title: 'Senior Technical Trainer',
    competencies_achieved: [
      'React Component Development',
      'State Management',
      'Modern React Patterns',
      'Testing Best Practices'
    ],
    continuing_education_credits: 24,
    renewal_required: true,
    renewal_criteria: ['Complete advanced React course', 'Pass renewal assessment'],
    next_renewal_date: '2026-03-20T00:00:00Z',
    verification_url: 'https://training.techcorp.com/verify/RDF-ABC123-XYZ789',
    qr_code_data: 'https://training.techcorp.com/verify/RDF-ABC123-XYZ789',
    created_at: '2024-03-20T00:00:00Z'
  },
  {
    id: 'cert2',
    org_id: 'org1',
    user_id: 'user2',
    course_id: 'course2',
    session_id: 'session2',
    enrollment_id: 'enrollment2',
    certificate_number: 'LEAD-2024-001',
    title: 'Leadership Essentials Certificate',
    description: 'Successfully completed Leadership Essentials for New Managers program',
    issue_date: '2024-03-25T00:00:00Z',
    expiry_date: '2027-03-25T00:00:00Z',
    status: 'active',
    certificate_url: '/certificates/LEAD-2024-001.pdf',
    verification_code: 'LE-DEF456-UVW012',
    issuing_authority: 'TechCorp Leadership Institute',
    issuer_signature: 'Dr. Michael Chen',
    issuer_title: 'Executive Leadership Coach',
    competencies_achieved: [
      'Team Leadership',
      'Performance Management',
      'Effective Communication',
      'Conflict Resolution'
    ],
    continuing_education_credits: 16,
    created_at: '2024-03-25T00:00:00Z'
  }
];

// Mock Training Feedback
const mockFeedback: TrainingFeedback[] = [
  {
    id: 'feedback1',
    org_id: 'org1',
    session_id: 'session1',
    course_id: 'course1',
    trainer_id: 'trainer1',
    user_id: 'user1',
    feedback_type: 'session',
    overall_rating: 5,
    content_quality_rating: 5,
    trainer_effectiveness_rating: 5,
    delivery_method_rating: 4,
    materials_rating: 4,
    learning_objectives_met: true,
    would_recommend: true,
    most_valuable_aspect: 'Hands-on coding exercises and real-world examples',
    suggestions_for_improvement: 'More time for Q&A sessions',
    pace_feedback: 'just_right',
    difficulty_feedback: 'just_right',
    engagement_level: 'very_high',
    follow_up_training_needed: true,
    follow_up_topics: ['Advanced React Patterns', 'React Performance Optimization'],
    submitted_at: '2024-03-20T16:30:00Z',
    created_at: '2024-03-20T16:30:00Z'
  },
  {
    id: 'feedback2',
    org_id: 'org1',
    session_id: 'session2',
    course_id: 'course2',
    trainer_id: 'trainer2',
    user_id: 'user2',
    feedback_type: 'trainer',
    overall_rating: 5,
    content_quality_rating: 5,
    trainer_effectiveness_rating: 5,
    delivery_method_rating: 5,
    materials_rating: 4,
    venue_rating: 5,
    learning_objectives_met: true,
    would_recommend: true,
    most_valuable_aspect: 'Interactive exercises and peer discussions',
    least_valuable_aspect: 'Some theoretical content could be condensed',
    suggestions_for_improvement: 'Add more case studies from our industry',
    pace_feedback: 'just_right',
    difficulty_feedback: 'just_right',
    engagement_level: 'very_high',
    submitted_at: '2024-03-25T17:45:00Z',
    created_at: '2024-03-25T17:45:00Z'
  }
];

export class TrainingService {
  // ============= CATEGORY METHODS =============
  static async getCategories(orgId: string): Promise<TrainingCategory[]> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      return mockCategories.filter(cat => cat.org_id === orgId);
    }
    
    // Real Supabase implementation would go here
    throw new Error('Supabase not configured. Using mock data.');
  }

  static async createCategory(category: Omit<TrainingCategory, 'id' | 'created_at'>): Promise<TrainingCategory> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      const newCategory: TrainingCategory = {
        ...category,
        id: `cat${Date.now()}`,
        created_at: new Date().toISOString()
      };
      mockCategories.push(newCategory);
      return newCategory;
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  // ============= COURSE METHODS =============
  static async getCourses(orgId: string, filters?: {
    category_id?: string;
    type?: string;
    level?: string;
    status?: string;
    search?: string;
  }): Promise<TrainingCourse[]> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      let courses = mockCourses.filter(course => course.org_id === orgId);
      
      if (filters) {
        if (filters.category_id) {
          courses = courses.filter(course => course.category_id === filters.category_id);
        }
        if (filters.type) {
          courses = courses.filter(course => course.type === filters.type);
        }
        if (filters.level) {
          courses = courses.filter(course => course.level === filters.level);
        }
        if (filters.status) {
          courses = courses.filter(course => course.status === filters.status);
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          courses = courses.filter(course => 
            course.title.toLowerCase().includes(searchLower) ||
            course.description.toLowerCase().includes(searchLower) ||
            course.tags?.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }
      }
      
      // Populate category data
      return courses.map(course => ({
        ...course,
        category: mockCategories.find(cat => cat.id === course.category_id)
      }));
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  static async getCourse(courseId: string): Promise<TrainingCourse | null> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      const course = mockCourses.find(c => c.id === courseId);
      if (!course) return null;
      
      return {
        ...course,
        category: mockCategories.find(cat => cat.id === course.category_id)
      };
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  static async createCourse(course: Omit<TrainingCourse, 'id' | 'created_at' | 'updated_at'>): Promise<TrainingCourse> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      const newCourse: TrainingCourse = {
        ...course,
        id: `course${Date.now()}`,
        created_at: new Date().toISOString(),
        total_enrollments: 0,
        completion_rate: 0
      };
      mockCourses.push(newCourse);
      return newCourse;
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  static async updateCourse(courseId: string, updates: Partial<TrainingCourse>): Promise<TrainingCourse> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      const index = mockCourses.findIndex(c => c.id === courseId);
      if (index === -1) throw new Error('Course not found');
      
      mockCourses[index] = {
        ...mockCourses[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      return mockCourses[index];
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  // ============= TRAINER METHODS =============
  static async getTrainers(orgId: string, filters?: {
    type?: string;
    expertise_area?: string;
    status?: string;
    available_date?: string;
  }): Promise<Trainer[]> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      let trainers = mockTrainers.filter(trainer => trainer.org_id === orgId);
      
      if (filters) {
        if (filters.type) {
          trainers = trainers.filter(trainer => trainer.type === filters.type);
        }
        if (filters.expertise_area) {
          trainers = trainers.filter(trainer => 
            trainer.expertise_areas.some(area => 
              area.toLowerCase().includes(filters.expertise_area!.toLowerCase())
            )
          );
        }
        if (filters.status) {
          trainers = trainers.filter(trainer => trainer.status === filters.status);
        }
      }
      
      return trainers;
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  static async getTrainer(trainerId: string): Promise<Trainer | null> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      return mockTrainers.find(t => t.id === trainerId) || null;
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  static async createTrainer(trainer: Omit<Trainer, 'id' | 'created_at' | 'updated_at'>): Promise<Trainer> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      const newTrainer: Trainer = {
        ...trainer,
        id: `trainer${Date.now()}`,
        created_at: new Date().toISOString(),
        total_sessions: 0
      };
      mockTrainers.push(newTrainer);
      return newTrainer;
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  static async updateTrainer(trainerId: string, updates: Partial<Trainer>): Promise<Trainer> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      const index = mockTrainers.findIndex(t => t.id === trainerId);
      if (index === -1) throw new Error('Trainer not found');
      
      mockTrainers[index] = {
        ...mockTrainers[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      return mockTrainers[index];
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  // ============= SESSION METHODS =============
  static async getSessions(orgId: string, filters?: {
    course_id?: string;
    trainer_id?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    delivery_method?: string;
  }): Promise<TrainingSession[]> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      let sessions = mockSessions.filter(session => session.org_id === orgId);
      
      if (filters) {
        if (filters.course_id) {
          sessions = sessions.filter(session => session.course_id === filters.course_id);
        }
        if (filters.trainer_id) {
          sessions = sessions.filter(session => session.trainer_id === filters.trainer_id);
        }
        if (filters.status) {
          sessions = sessions.filter(session => session.status === filters.status);
        }
        if (filters.start_date) {
          sessions = sessions.filter(session => 
            new Date(session.start_time) >= new Date(filters.start_date!)
          );
        }
        if (filters.end_date) {
          sessions = sessions.filter(session => 
            new Date(session.start_time) <= new Date(filters.end_date!)
          );
        }
        if (filters.delivery_method) {
          sessions = sessions.filter(session => session.delivery_method === filters.delivery_method);
        }
      }
      
      // Populate related data
      return sessions.map(session => ({
        ...session,
        course: mockCourses.find(c => c.id === session.course_id),
        trainer: mockTrainers.find(t => t.id === session.trainer_id)
      }));
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  static async getSession(sessionId: string): Promise<TrainingSession | null> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      const session = mockSessions.find(s => s.id === sessionId);
      if (!session) return null;
      
      return {
        ...session,
        course: mockCourses.find(c => c.id === session.course_id),
        trainer: mockTrainers.find(t => t.id === session.trainer_id)
      };
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  static async createSession(session: Omit<TrainingSession, 'id' | 'created_at' | 'updated_at'>): Promise<TrainingSession> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      const newSession: TrainingSession = {
        ...session,
        id: `session${Date.now()}`,
        current_enrollment: 0,
        created_at: new Date().toISOString()
      };
      mockSessions.push(newSession);
      return newSession;
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  static async updateSession(sessionId: string, updates: Partial<TrainingSession>): Promise<TrainingSession> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      const index = mockSessions.findIndex(s => s.id === sessionId);
      if (index === -1) throw new Error('Session not found');
      
      mockSessions[index] = {
        ...mockSessions[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      return mockSessions[index];
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  // ============= ENROLLMENT METHODS =============
  static async getEnrollments(orgId: string, filters?: {
    user_id?: string;
    session_id?: string;
    course_id?: string;
    status?: string;
    enrollment_type?: string;
  }): Promise<TrainingEnrollment[]> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      let enrollments = mockEnrollments.filter(enrollment => enrollment.org_id === orgId);
      
      if (filters) {
        if (filters.user_id) {
          enrollments = enrollments.filter(enrollment => enrollment.user_id === filters.user_id);
        }
        if (filters.session_id) {
          enrollments = enrollments.filter(enrollment => enrollment.session_id === filters.session_id);
        }
        if (filters.course_id) {
          enrollments = enrollments.filter(enrollment => enrollment.course_id === filters.course_id);
        }
        if (filters.status) {
          enrollments = enrollments.filter(enrollment => enrollment.status === filters.status);
        }
        if (filters.enrollment_type) {
          enrollments = enrollments.filter(enrollment => enrollment.enrollment_type === filters.enrollment_type);
        }
      }
      
      // Populate related data
      return enrollments.map(enrollment => ({
        ...enrollment,
        session: mockSessions.find(s => s.id === enrollment.session_id),
        course: mockCourses.find(c => c.id === enrollment.course_id)
      }));
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  static async createEnrollment(enrollment: Omit<TrainingEnrollment, 'id' | 'created_at' | 'updated_at'>): Promise<TrainingEnrollment> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      const newEnrollment: TrainingEnrollment = {
        ...enrollment,
        id: `enrollment${Date.now()}`,
        created_at: new Date().toISOString()
      };
      mockEnrollments.push(newEnrollment);
      
      // Update session enrollment count
      const sessionIndex = mockSessions.findIndex(s => s.id === enrollment.session_id);
      if (sessionIndex !== -1) {
        mockSessions[sessionIndex].current_enrollment += 1;
      }
      
      return newEnrollment;
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  static async updateEnrollment(enrollmentId: string, updates: Partial<TrainingEnrollment>): Promise<TrainingEnrollment> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      const index = mockEnrollments.findIndex(e => e.id === enrollmentId);
      if (index === -1) throw new Error('Enrollment not found');
      
      mockEnrollments[index] = {
        ...mockEnrollments[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      return mockEnrollments[index];
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  // ============= ASSESSMENT METHODS =============
  static async getAssessments(orgId: string, filters?: {
    course_id?: string;
    session_id?: string;
    type?: string;
  }): Promise<TrainingAssessment[]> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      let assessments = mockAssessments.filter(assessment => assessment.org_id === orgId);
      
      if (filters) {
        if (filters.course_id) {
          assessments = assessments.filter(assessment => assessment.course_id === filters.course_id);
        }
        if (filters.session_id) {
          assessments = assessments.filter(assessment => assessment.session_id === filters.session_id);
        }
        if (filters.type) {
          assessments = assessments.filter(assessment => assessment.type === filters.type);
        }
      }
      
      return assessments;
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  static async createAssessment(assessment: Omit<TrainingAssessment, 'id' | 'created_at' | 'updated_at'>): Promise<TrainingAssessment> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      const newAssessment: TrainingAssessment = {
        ...assessment,
        id: `assessment${Date.now()}`,
        created_at: new Date().toISOString()
      };
      mockAssessments.push(newAssessment);
      return newAssessment;
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  // ============= CERTIFICATE METHODS =============
  static async getCertificates(orgId: string, filters?: {
    user_id?: string;
    course_id?: string;
    status?: string;
  }): Promise<TrainingCertificate[]> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      let certificates = mockCertificates.filter(cert => cert.org_id === orgId);
      
      if (filters) {
        if (filters.user_id) {
          certificates = certificates.filter(cert => cert.user_id === filters.user_id);
        }
        if (filters.course_id) {
          certificates = certificates.filter(cert => cert.course_id === filters.course_id);
        }
        if (filters.status) {
          certificates = certificates.filter(cert => cert.status === filters.status);
        }
      }
      
      return certificates;
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  static async createCertificate(certificate: Omit<TrainingCertificate, 'id' | 'created_at' | 'updated_at'>): Promise<TrainingCertificate> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      const newCertificate: TrainingCertificate = {
        ...certificate,
        id: `cert${Date.now()}`,
        created_at: new Date().toISOString()
      };
      mockCertificates.push(newCertificate);
      return newCertificate;
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  // ============= FEEDBACK METHODS =============
  static async getFeedback(orgId: string, filters?: {
    session_id?: string;
    course_id?: string;
    trainer_id?: string;
    feedback_type?: string;
  }): Promise<TrainingFeedback[]> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      let feedback = mockFeedback.filter(fb => fb.org_id === orgId);
      
      if (filters) {
        if (filters.session_id) {
          feedback = feedback.filter(fb => fb.session_id === filters.session_id);
        }
        if (filters.course_id) {
          feedback = feedback.filter(fb => fb.course_id === filters.course_id);
        }
        if (filters.trainer_id) {
          feedback = feedback.filter(fb => fb.trainer_id === filters.trainer_id);
        }
        if (filters.feedback_type) {
          feedback = feedback.filter(fb => fb.feedback_type === filters.feedback_type);
        }
      }
      
      return feedback;
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  static async createFeedback(feedback: Omit<TrainingFeedback, 'id' | 'created_at'>): Promise<TrainingFeedback> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      const newFeedback: TrainingFeedback = {
        ...feedback,
        id: `feedback${Date.now()}`,
        created_at: new Date().toISOString()
      };
      mockFeedback.push(newFeedback);
      return newFeedback;
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  // ============= ANALYTICS METHODS =============
  static async getTrainingAnalytics(orgId: string, dateRange?: {
    start_date: string;
    end_date: string;
  }) {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      const courses = mockCourses.filter(c => c.org_id === orgId);
      const sessions = mockSessions.filter(s => s.org_id === orgId);
      const enrollments = mockEnrollments.filter(e => e.org_id === orgId);
      const certificates = mockCertificates.filter(c => c.org_id === orgId);
      
      return {
        total_courses: courses.length,
        published_courses: courses.filter(c => c.status === 'published').length,
        total_sessions: sessions.length,
        scheduled_sessions: sessions.filter(s => s.status === 'scheduled').length,
        completed_sessions: sessions.filter(s => s.status === 'completed').length,
        total_enrollments: enrollments.length,
        active_enrollments: enrollments.filter(e => ['enrolled', 'attended'].includes(e.status)).length,
        completed_enrollments: enrollments.filter(e => e.status === 'completed').length,
        total_certificates: certificates.length,
        active_certificates: certificates.filter(c => c.status === 'active').length,
        total_trainers: mockTrainers.filter(t => t.org_id === orgId).length,
        active_trainers: mockTrainers.filter(t => t.org_id === orgId && t.status === 'active').length,
        average_course_rating: 4.6,
        average_trainer_rating: 4.8,
        completion_rate: 89,
        certification_rate: 76,
        enrollment_trends: [
          { month: 'Jan 2024', enrollments: 45 },
          { month: 'Feb 2024', enrollments: 67 },
          { month: 'Mar 2024', enrollments: 89 }
        ],
        popular_courses: courses
          .sort((a, b) => (b.total_enrollments || 0) - (a.total_enrollments || 0))
          .slice(0, 5),
        top_trainers: mockTrainers
          .filter(t => t.org_id === orgId)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 5)
      };
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  // ============= INTEGRATION METHODS =============
  static async scheduleInterviewSession(sessionData: {
    course_id: string;
    trainer_id: string;
    title: string;
    start_time: string;
    end_time: string;
    interview_id: string;
    room_booking_id?: string;
  }): Promise<TrainingSession> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      const newSession: TrainingSession = {
        id: `session${Date.now()}`,
        org_id: 'org1',
        ...sessionData,
        session_type: 'live',
        delivery_method: sessionData.room_booking_id ? 'in_person' : 'virtual',
        timezone: 'America/New_York',
        max_participants: 1,
        current_enrollment: 1,
        status: 'scheduled',
        attendance_tracking: true,
        language: 'English',
        created_by: sessionData.trainer_id,
        created_at: new Date().toISOString()
      };
      
      mockSessions.push(newSession);
      return newSession;
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }

  static async linkDocuments(sessionId: string, documentIds: string[]): Promise<void> {
    await mockDelay();
    
    if (!isSupabaseConfigured()) {
      // In a real implementation, this would link documents to the training session
      const sessionIndex = mockSessions.findIndex(s => s.id === sessionId);
      if (sessionIndex !== -1) {
        if (!mockSessions[sessionIndex].materials_list) {
          mockSessions[sessionIndex].materials_list = [];
        }
        // Add document references to materials list
        documentIds.forEach(docId => {
          mockSessions[sessionIndex].materials_list!.push(`Document ID: ${docId}`);
        });
      }
      return;
    }
    
    throw new Error('Supabase not configured. Using mock data.');
  }
} 