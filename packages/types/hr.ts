// Shared HR/ATS types for web and mobile

export type Organization = {
  id: string;
  name: string;
  domain?: string;
  created_at: string;
  plan?: string;
  logo_url?: string;
  custom_domain?: string;
};

export type User = {
  id: string;
  org_id: string;
  email: string;
  full_name?: string;
  role: string; // 'candidate', 'employee', 'recruiter', etc.
  status: string; // 'candidate', 'employee', 'inactive', etc.
  created_at: string;
  is_active?: boolean;
  invited_by?: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  department?: string;
  position?: string;
  hire_date?: string;
  skills?: string[];
  resume_url?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  preferred_salary_range?: {
    min: number;
    max: number;
    currency: string;
  };
  education?: EducationHistory[];
  experience?: WorkExperience[];
  references?: Reference[];
};

export type EducationHistory = {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  grade?: string;
  activities?: string;
  description?: string;
};

export type WorkExperience = {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
  is_current?: boolean;
  location?: string;
  description?: string;
  achievements?: string[];
  skills_used?: string[];
};

export type Reference = {
  id: string;
  name: string;
  position: string;
  company: string;
  relationship: string;
  email?: string;
  phone?: string;
  letter_url?: string;
};

// Type aliases for compatibility with components
export type Education = EducationHistory;
export type Experience = WorkExperience;

// Job status type for forms
export type JobStatus = 'draft' | 'published' | 'closed' | 'archived';

export type Department = {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  manager_id?: string;
  created_at: string;
};

export type JobCategory = {
  id: string;
  name: string;
  description?: string;
};

export type Job = {
  id: string;
  org_id: string;
  title: string;
  dept_id?: string;
  category_id?: string;
  description?: string;
  status: 'draft' | 'published' | 'closed' | 'archived';
  created_at: string;
  posted_at?: string;
  closes_at?: string;
  location: string;
  job_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'remote';
  salary_range?: {
    min: number;
    max: number;
    currency: string;
  };
  experience_level?: string;
  education_level?: string;
  skills_required?: string[];
  responsibilities?: string[];
  benefits?: string[];
  poster_id: string;
  stage_ids?: string[]; // References to JobStage in correct order
  template_id?: string; // If created from template
  is_remote?: boolean;
  is_featured?: boolean;
  external_posting_urls?: string[];
  application_count?: number;
  views_count?: number;
  // Additional properties for JobForm
  city?: string;
  country?: string;
  requirements?: string[];
  application_url?: string;
  contact_email?: string;
  visa_sponsorship?: boolean;
  internal_notes?: string;
};

export type JobTemplate = {
  id: string;
  org_id: string;
  title: string;
  description?: string;
  category_id?: string;
  dept_id?: string;
  stage_ids?: string[];
  skills_required?: string[];
  responsibilities?: string[];
  benefits?: string[];
  created_at: string;
  created_by: string;
};

export type JobStage = {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  order: number;
  required_approvers?: number;
  is_rejection_point?: boolean;
  feedback_template_id?: string;
  automated_actions?: {
    emails?: {
      candidate?: boolean;
      team?: boolean;
      template_id?: string;
    }
    tasks?: {
      assignee_role?: string;
      template_id?: string;
    }
  };
  created_at: string;
};

export type Application = {
  id: string;
  org_id: string;
  user_id: string;
  job_id: string;
  cv_url?: string;
  cover_letter_url?: string;
  status: 'new' | 'screening' | 'interview' | 'assessment' | 'shortlisted' | 'offered' | 'hired' | 'rejected' | 'withdrawn';
  current_stage_id?: string;
  stage_history?: {
    stage_id: string;
    entered_at: string;
    exited_at?: string;
    duration?: number;
    notes?: string;
  }[];
  source?: string;
  referral_id?: string;
  application_date: string;
  last_activity_date?: string;
  rejection_reason?: string;
  rejection_date?: string;
  withdrawn_reason?: string;
  withdrawn_date?: string;
  salary_expectation?: {
    amount: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
  };
  availability_date?: string;
  notice_period?: string;
  custom_fields?: Record<string, any>;
  total_score?: number;
  created_at: string;
  has_offer?: boolean;
};

export type CandidateAssessment = {
  id: string;
  org_id: string;
  application_id: string;
  type: 'coding' | 'personality' | 'skills' | 'cognitive' | 'custom';
  name: string;
  description?: string;
  assigned_by: string;
  assigned_at: string;
  due_date?: string;
  completed_at?: string;
  score?: number;
  max_score?: number;
  pass_threshold?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  assessment_url?: string;
  results_url?: string;
  feedback?: string;
  graded_by?: string;
  graded_at?: string;
};

export type Interview = {
  id: string;
  org_id: string;
  application_id: string;
  stage_id?: string;
  title: string;
  description?: string;
  type: 'phone' | 'video' | 'in_person' | 'technical' | 'panel';
  interviewer_ids: string[];
  scheduled_at: string;
  duration: number; // minutes
  location?: string;
  meeting_url?: string;
  meeting_room_id?: string;
  asset_booking_ids?: string[];
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show';
  feedback?: InterviewFeedback[];
  overall_rating?: number;
  notes?: string;
  created_at: string;
  reschedule_count?: number;
  last_rescheduled_at?: string;
  last_rescheduled_by?: string;
  updated_at?: string;
};

export type InterviewFeedback = {
  id: string;
  interview_id: string;
  interviewer_id: string;
  submitted_at: string;
  overall_rating: number;
  recommend_hiring: 'strong_yes' | 'yes' | 'neutral' | 'no' | 'strong_no';
  feedback_sections: {
    category: string;
    rating: number;
    comments: string;
  }[];
  strengths?: string[];
  weaknesses?: string[];
  general_comments?: string;
};

export type Offer = {
  id: string;
  org_id: string;
  application_id: string;
  candidate_id: string;
  job_id: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'accepted' | 'negotiating' | 'rejected' | 'expired';
  position_title?: string; // Job position title for the offer
  salary: {
    amount: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
  };
  equity?: {
    amount: number;
    type: 'options' | 'rsus' | 'shares';
    vesting_schedule?: string;
  };
  equity_description?: string; // Simple text description for forms
  benefits?: string[];
  bonus?: {
    amount: number | string;
    currency: string;
    type: 'signing' | 'performance' | 'retention';
    conditions?: string;
  }[];
  start_date?: string;
  expiration_date?: string;
  probation_period?: number;
  approved_by?: string[];
  created_by: string;
  created_at: string;
  sent_at?: string;
  submitted_at?: string; // When submitted for approval
  responded_at?: string;
  document_url?: string;
  candidate_notes?: string;
  negotiation_notes?: string;
  accepted_at?: string;
  rejected_at?: string;
  notes?: string; // Additional notes for the offer
};

export type OnboardingTask = {
  id: string;
  org_id: string;
  user_id: string;
  dept_id?: string;
  title: string;
  description: string;
  category?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'skipped';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to: string; // Either HR, manager, or new employee
  assigned_by: string;
  due_date?: string;
  completed_at?: string;
  completed_by?: string;
  dependencies?: string[]; // IDs of tasks that must be completed first
  documents_required?: string[];
  documents_uploaded?: string[];
  approval_required?: boolean;
  approved_by?: string;
  approved_at?: string;
  time_estimate?: number; // Estimated hours to complete
  actual_time?: number; // Actual hours spent
  instructions?: string; // Detailed instructions for the task
  resources?: string[]; // URLs or references to helpful resources
  created_at: string;
  updated_at?: string;
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
};

export type OnboardingPlan = {
  id: string;
  org_id: string;
  title: string;
  description?: string;
  department_id?: string;
  job_role?: string;
  is_default?: boolean;
  is_active?: boolean;
  duration_days?: number; // Expected completion timeframe
  task_templates: {
    title: string;
    description: string;
    category?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    assigned_to_role: 'hr' | 'manager' | 'employee' | 'it' | 'finance' | 'buddy';
    due_day_offset: number; // Days from start date
    dependencies?: number[]; // Indices of tasks that must be completed first
    documents_required?: string[];
    approval_required?: boolean;
    time_estimate?: number;
    instructions?: string;
    resources?: string[];
    auto_assign?: boolean; // Automatically assign when dependencies are met
  }[];
  checklist_items?: {
    title: string;
    description?: string;
    category: string;
    required: boolean;
  }[];
  created_by: string;
  created_at: string;
  updated_at?: string;
};

export type OnboardingWorkflow = {
  id: string;
  org_id: string;
  employee_id: string;
  employee_name: string;
  employee_email: string;
  employee_avatar?: string;
  plan_id: string;
  plan_name: string;
  department: string;
  position: string;
  manager_id: string;
  manager_name: string;
  buddy_id?: string;
  buddy_name?: string;
  hr_representative_id: string;
  hr_representative_name: string;
  start_date: string;
  expected_completion_date: string;
  actual_completion_date?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused' | 'cancelled';
  progress_percentage: number;
  current_stage: string;
  total_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  upcoming_tasks: number;
  milestones?: {
    name: string;
    description?: string;
    target_date: string;
    completed_date?: string;
    status: 'pending' | 'completed' | 'overdue';
  }[];
  feedback?: {
    feedback_id: string;
    submitted_by: string;
    submitted_at: string;
    rating: number;
    comments: string;
    suggestions?: string;
  }[];
  documents_collected?: string[];
  equipment_issued?: {
    item: string;
    serial_number?: string;
    issued_date: string;
    returned_date?: string;
  }[];
  training_sessions?: {
    session_id: string;
    title: string;
    scheduled_date: string;
    completed_date?: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    trainer?: string;
  }[];
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type Team = {
  id: string;
  org_id: string;
  name: string;
  supervisor_id?: string;
};

export type TeamMember = {
  team_id: string;
  user_id: string;
  role: string;
};

export type Request = {
  id: string;
  org_id: string;
  user_id: string;
  type: string;
  details?: string;
  status: string;
  approver_id?: string;
  attachments?: string[];
  created_at: string;
};

export type Approval = {
  id: string;
  org_id: string;
  request_id: string;
  approver_id: string;
  status: string;
  comments?: string;
  created_at: string;
};

export type Attendance = {
  id: string;
  org_id: string;
  user_id: string;
  date: string;
  check_in?: string;
  check_out?: string;
  type: string;
};

export type PerformanceReview = {
  id: string;
  org_id: string;
  user_id: string;
  reviewer_id: string;
  period: string;
  rating: number;
  feedback?: string;
};

export type Payslip = {
  id: string;
  org_id: string;
  user_id: string;
  month: string;
  gross: number;
  net: number;
  tax: number;
  url: string;
};

export type Grievance = {
  id: string;
  org_id: string;
  user_id: string;
  subject: string;
  description: string;
  status: string;
  messages?: { from: string; text: string }[];
};

export type Document = {
  id: string;
  org_id: string;
  project_id?: string;
  user_id?: string;
  name: string;
  description?: string;
  url: string;
  file_path?: string;
  file_type: string; // pdf, doc, xls, etc.
  file_size?: number;
  type: string; // category like 'Policy', 'Handbook', 'Contract', etc.
  tags?: string[];
  status: 'active' | 'archived' | 'draft';
  created_at: string;
  updated_at?: string;
  created_by?: string;
  last_accessed?: string;
  access_level: 'public' | 'private' | 'restricted';
  allowed_users?: string[]; // user IDs who can access if restricted
  allowed_departments?: string[]; // department IDs that can access if restricted
  version?: string;
  expiry_date?: string;
  is_template?: boolean;
};

export type OrgChart = {
  id: string;
  org_id: string;
  parent_id?: string;
  name: string;
  type: string;
};

export type OffboardingTask = {
  id: string;
  org_id: string;
  process_id: string;
  title: string;
  description: string;
  category: 'hr' | 'it' | 'finance' | 'manager' | 'employee' | 'legal' | 'admin';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'skipped';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to: string; // User ID
  assigned_to_name: string;
  assigned_by: string;
  due_date: string;
  completed_at?: string;
  completed_by?: string;
  dependencies?: string[];
  approval_required?: boolean;
  approved_by?: string;
  approved_at?: string;
  instructions?: string;
  documents_required?: string[];
  documents_uploaded?: string[];
  time_estimate?: number;
  actual_time?: number;
  created_at: string;
  updated_at?: string;
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
};

export type OffboardingProcess = {
  id: string;
  org_id: string;
  employee_id: string;
  employee_name: string;
  employee_email: string;
  employee_avatar?: string;
  department: string;
  position: string;
  employee_number?: string;
  manager_id: string;
  manager_name: string;
  hr_partner_id: string;
  hr_partner_name: string;
  resignation_date: string;
  last_working_day: string;
  effective_termination_date: string;
  reason: 'resignation' | 'termination' | 'retirement' | 'redundancy' | 'end_of_contract' | 'mutual_agreement';
  status: 'initiated' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  progress_percentage: number;
  current_phase: string;
  tasks_completed: number;
  total_tasks: number;
  overdue_tasks: number;
  // Exit Interview
  exit_interview_scheduled: boolean;
  exit_interview_date?: string;
  exit_interview_completed?: boolean;
  exit_interview_feedback?: {
    overall_rating: number;
    would_recommend: boolean;
    reason_for_leaving: string;
    suggestions: string;
    management_feedback: string;
    culture_feedback: string;
    growth_opportunities_feedback: string;
    work_life_balance_rating: number;
    compensation_satisfaction: number;
    additional_comments?: string;
  };
  // Benefits and Final Pay
  benefits_info: string;
  final_pay_calculated: boolean;
  final_pay_amount?: number;
  vacation_days_remaining?: number;
  vacation_payout_amount?: number;
  cobra_eligible?: boolean;
  cobra_info_sent?: boolean;
  retirement_plan_info?: string;
  // Equipment and Access
  equipment_to_return: {
    item: string;
    serial_number?: string;
    condition?: string;
    returned: boolean;
    returned_date?: string;
  }[];
  equipment_returned: boolean;
  access_revoked: boolean;
  access_revocation_date?: string;
  badge_returned: boolean;
  // Knowledge Transfer
  knowledge_transfer_required: boolean;
  knowledge_transfer_sessions?: {
    id: string;
    topic: string;
    recipient_id: string;
    recipient_name: string;
    scheduled_date: string;
    completed_date?: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    documentation_link?: string;
  }[];
  handover_documents?: string[];
  project_transitions?: {
    project_id: string;
    project_name: string;
    new_owner_id: string;
    new_owner_name: string;
    transition_date: string;
    status: 'pending' | 'in_progress' | 'completed';
  }[];
  // Communication
  announcement_sent: boolean;
  team_notification_sent: boolean;
  client_notification_required: boolean;
  client_notification_sent?: boolean;
  farewell_event_planned?: boolean;
  farewell_event_date?: string;
  // Documentation
  termination_letter_sent?: boolean;
  reference_letter_requested?: boolean;
  reference_letter_provided?: boolean;
  non_disclosure_acknowledged?: boolean;
  non_compete_acknowledged?: boolean;
  // Timeline
  created_at: string;
  updated_at: string;
  notes: string;
  additional_requirements?: string[];
  escalation_required?: boolean;
  escalation_reason?: string;
};

export type OffboardingTemplate = {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  department_id?: string;
  job_role?: string;
  reason_for_leaving?: string;
  is_default?: boolean;
  is_active?: boolean;
  task_templates: {
    title: string;
    description: string;
    category: 'hr' | 'it' | 'finance' | 'manager' | 'employee' | 'legal' | 'admin';
    priority: 'low' | 'medium' | 'high' | 'critical';
    assigned_to_role: 'hr' | 'manager' | 'employee' | 'it' | 'finance' | 'legal' | 'admin';
    due_day_offset: number; // Days before last working day (negative) or after (positive)
    dependencies?: number[];
    approval_required?: boolean;
    instructions?: string;
    documents_required?: string[];
    auto_assign?: boolean;
  }[];
  checklist_items?: {
    title: string;
    description?: string;
    category: string;
    required: boolean;
  }[];
  exit_interview_required?: boolean;
  knowledge_transfer_required?: boolean;
  reference_letter_provided?: boolean;
  created_by: string;
  created_at: string;
  updated_at?: string;
};

export type KnowledgeTransferSession = {
  id: string;
  org_id: string;
  offboarding_process_id: string;
  departing_employee_id: string;
  recipient_id: string;
  topic: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  scheduled_date: string;
  duration_minutes: number;
  location?: string;
  meeting_url?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  completion_notes?: string;
  documentation_created?: boolean;
  documentation_links?: string[];
  follow_up_required?: boolean;
  follow_up_date?: string;
  created_at: string;
  updated_at?: string;
};

export type ExitInterview = {
  id: string;
  org_id: string;
  offboarding_process_id: string;
  employee_id: string;
  interviewer_id: string;
  scheduled_date: string;
  conducted_date?: string;
  duration_minutes?: number;
  format: 'in_person' | 'video_call' | 'phone' | 'written_survey';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  responses: {
    overall_satisfaction: number; // 1-10 scale
    would_recommend_company: boolean;
    reason_for_leaving: string;
    job_satisfaction: number;
    management_satisfaction: number;
    work_life_balance: number;
    compensation_satisfaction: number;
    growth_opportunities: number;
    company_culture: number;
    training_adequacy: number;
    workload_manageability: number;
    recognition_appreciation: number;
    communication_effectiveness: number;
    work_environment: number;
    benefits_satisfaction: number;
    positive_aspects: string[];
    improvement_suggestions: string[];
    management_feedback: string;
    additional_comments?: string;
  };
  action_items?: {
    description: string;
    assigned_to: string;
    due_date: string;
    status: 'pending' | 'in_progress' | 'completed';
  }[];
  confidential_notes?: string;
  created_at: string;
  updated_at?: string;
};

export type Task = {
  id: string;
  org_id: string;
  title: string;
  description?: string;
  due_date: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Todo' | 'In Progress' | 'On Hold' | 'Completed';
  assigned_to?: string; // user_id
  assigned_by?: string; // user_id
  category?: string;
  project_id?: string;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  checklist?: TaskChecklistItem[];
  tags?: string[];
  reminder?: string;
  recurring?: boolean;
  recurring_pattern?: string; // daily, weekly, monthly, etc.
  linked_tasks?: string[]; // array of related task IDs
  time_tracked?: number; // in minutes
};

export type TaskComment = {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  attachments?: TaskAttachment[];
};

export type TaskAttachment = {
  id: string;
  name: string;
  url: string;
  type: string; // file type
  size?: number;
  uploaded_by: string;
  uploaded_at: string;
};

export type TaskChecklistItem = {
  id: string;
  content: string;
  completed: boolean;
  completed_at?: string;
  completed_by?: string;
};

// Additional types for billing and settings
export type Billing = {
  plan: string;
  usage: string;
  renewal: string;
  paymentMethod: string;
};

export type SaaSSettings = {
  customDomain: string;
  featureToggles: Record<string, boolean>;
  tenantSettings: Record<string, any>;
};

// Legacy Offboarding type for backward compatibility
export type Offboarding = {
  id: string;
  org_id: string;
  user_id: string;
  status: string;
  benefits?: string;
  exit_date?: string;
};

export type MeetingRoom = {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  location: string;
  building?: string;
  floor?: string;
  capacity: number;
  equipment?: string[]; // Available equipment like projector, whiteboard, etc.
  amenities?: string[]; // Coffee, water, catering options, etc.
  is_active: boolean;
  booking_rules?: {
    min_duration?: number; // minutes
    max_duration?: number; // minutes
    advance_booking_hours?: number;
    max_advance_days?: number;
    requires_approval?: boolean;
    business_hours_only?: boolean;
    allowed_roles?: string[];
  };
  hourly_rate?: number;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  images?: string[];
  video_conference_enabled?: boolean;
  accessibility_features?: string[];
  created_at: string;
  updated_at?: string;
};

export type Asset = {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  category: string; // projector, laptop, camera, etc.
  brand?: string;
  model?: string;
  serial_number?: string;
  asset_tag?: string;
  location?: string;
  status: 'available' | 'in_use' | 'maintenance' | 'retired';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  purchase_date?: string;
  warranty_expiry?: string;
  specifications?: Record<string, any>;
  booking_rules?: {
    max_duration_hours?: number;
    advance_booking_hours?: number;
    requires_approval?: boolean;
    checkout_required?: boolean;
    allowed_roles?: string[];
  };
  hourly_rate?: number;
  daily_rate?: number;
  responsible_person?: string;
  images?: string[];
  maintenance_schedule?: string;
  last_maintenance_date?: string;
  created_at: string;
  updated_at?: string;
};

export type RoomBooking = {
  id: string;
  org_id: string;
  room_id: string;
  room?: MeetingRoom; // Populated relation
  booked_by: string;
  booking_type: 'interview' | 'meeting' | 'training' | 'event' | 'other';
  related_record_id?: string; // Could be interview_id, meeting_id, etc.
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  attendee_count?: number;
  attendees?: string[]; // Array of user IDs or email addresses
  setup_requirements?: string;
  catering_requirements?: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
  is_recurring?: boolean;
  recurring_pattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    days_of_week?: number[]; // 0-6, Sunday = 0
    end_date?: string;
    occurrences?: number;
  };
  cancellation_reason?: string;
  cancelled_at?: string;
  cancelled_by?: string;
  cost?: number;
  approval_required?: boolean;
  approved_by?: string;
  approved_at?: string;
  notes?: string;
  reminder_sent?: boolean;
  check_in_time?: string;
  check_out_time?: string;
  created_at: string;
  updated_at?: string;
};

export type AssetBooking = {
  id: string;
  org_id: string;
  asset_id: string;
  asset?: Asset; // Populated relation
  booked_by: string;
  booking_type: 'interview' | 'meeting' | 'training' | 'project' | 'other';
  related_record_id?: string; // Could be interview_id, project_id, etc.
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  pickup_location?: string;
  return_location?: string;
  purpose?: string;
  status: 'confirmed' | 'checked_out' | 'returned' | 'cancelled' | 'overdue';
  cancellation_reason?: string;
  cancelled_at?: string;
  cancelled_by?: string;
  cost?: number;
  approval_required?: boolean;
  approved_by?: string;
  approved_at?: string;
  checkout_notes?: string;
  return_notes?: string;
  condition_on_checkout?: string;
  condition_on_return?: string;
  checked_out_at?: string;
  checked_out_by?: string;
  returned_at?: string;
  returned_by?: string;
  damage_reported?: boolean;
  damage_description?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
};

export type BookingConflict = {
  id: string;
  org_id: string;
  resource_type: 'room' | 'asset';
  resource_id: string;
  booking1_id: string;
  booking2_id: string;
  conflict_type: 'overlap' | 'double_booking' | 'maintenance';
  start_time: string;
  end_time: string;
  resolved: boolean;
  resolution_action?: string;
  resolved_by?: string;
  resolved_at?: string;
  notes?: string;
  created_at: string;
};

// ============= TRAINING MODULE TYPES =============

export type TrainingCategory = {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parent_id?: string; // For hierarchical categories
  is_active: boolean;
  created_at: string;
  updated_at?: string;
};

export type TrainingCourse = {
  id: string;
  org_id: string;
  title: string;
  description: string;
  category_id: string;
  category?: TrainingCategory;
  type: 'onboarding' | 'technical' | 'compliance' | 'leadership' | 'soft_skills' | 'certification' | 'custom';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  delivery_method: 'in_person' | 'virtual' | 'hybrid' | 'self_paced' | 'blended';
  duration_hours: number;
  max_participants?: number;
  min_participants?: number;
  prerequisites?: string[];
  learning_objectives: string[];
  course_outline: {
    module_title: string;
    module_description: string;
    duration_minutes: number;
    learning_outcomes: string[];
    resources?: string[];
  }[];
  materials?: {
    type: 'document' | 'video' | 'presentation' | 'quiz' | 'assignment' | 'resource';
    title: string;
    description?: string;
    url: string;
    duration_minutes?: number;
    is_required: boolean;
    order: number;
  }[];
  assessment_required: boolean;
  certification_awarded: boolean;
  certification_validity_months?: number;
  cost_per_participant?: number;
  status: 'draft' | 'published' | 'archived' | 'under_review';
  tags?: string[];
  difficulty_rating: number; // 1-5
  average_rating?: number;
  total_enrollments?: number;
  completion_rate?: number;
  target_audience?: string[];
  required_for_roles?: string[];
  expiry_date?: string;
  auto_assign_rules?: {
    departments?: string[];
    roles?: string[];
    hire_date_after?: string;
    conditions?: string[];
  };
  created_by: string;
  created_at: string;
  updated_at?: string;
  published_at?: string;
};

export type Trainer = {
  id: string;
  org_id: string;
  user_id?: string; // If internal employee
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  type: 'internal' | 'external' | 'contractor';
  bio?: string;
  expertise_areas: string[];
  certifications?: {
    name: string;
    issuing_body: string;
    issue_date: string;
    expiry_date?: string;
    credential_id?: string;
    verification_url?: string;
  }[];
  experience_years: number;
  hourly_rate?: number;
  daily_rate?: number;
  availability?: {
    day_of_week: number; // 0-6, Sunday = 0
    start_time: string;
    end_time: string;
    timezone: string;
  }[];
  languages: string[];
  rating?: number;
  total_sessions?: number;
  profile_image_url?: string;
  linkedin_url?: string;
  website_url?: string;
  specializations: string[];
  training_style?: string;
  equipment_requirements?: string[];
  travel_willingness?: {
    local: boolean;
    national: boolean;
    international: boolean;
    max_travel_distance_km?: number;
  };
  status: 'active' | 'inactive' | 'pending_approval';
  notes?: string;
  created_at: string;
  updated_at?: string;
};

export type TrainingSession = {
  id: string;
  org_id: string;
  course_id: string;
  course?: TrainingCourse;
  trainer_id: string;
  trainer?: Trainer;
  title: string;
  description?: string;
  session_type: 'live' | 'recorded' | 'workshop' | 'seminar' | 'webinar' | 'hands_on';
  delivery_method: 'in_person' | 'virtual' | 'hybrid';
  start_time: string;
  end_time: string;
  timezone: string;
  location?: string;
  room_booking_id?: string;
  room?: MeetingRoom;
  virtual_meeting_url?: string;
  virtual_meeting_id?: string;
  virtual_platform?: string; // Zoom, Teams, etc.
  max_participants: number;
  current_enrollment: number;
  waiting_list_count?: number;
  enrollment_deadline?: string;
  cancellation_deadline?: string;
  materials_list?: string[];
  pre_session_requirements?: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  attendance_tracking: boolean;
  recording_enabled?: boolean;
  recording_url?: string;
  session_notes?: string;
  feedback_collected?: boolean;
  average_rating?: number;
  cost_per_participant?: number;
  total_cost?: number;
  equipment_bookings?: string[]; // Asset booking IDs
  catering_required?: boolean;
  catering_details?: string;
  accessibility_requirements?: string[];
  language: string;
  interpretation_required?: boolean;
  custom_fields?: Record<string, any>;
  recurring_session_id?: string;
  is_mandatory?: boolean;
  compliance_tracking?: boolean;
  certificate_template_id?: string;
  created_by: string;
  created_at: string;
  updated_at?: string;
  cancelled_at?: string;
  cancelled_by?: string;
  cancellation_reason?: string;
};

export type TrainingEnrollment = {
  id: string;
  org_id: string;
  session_id: string;
  session?: TrainingSession;
  course_id: string;
  course?: TrainingCourse;
  user_id: string;
  user?: User;
  enrollment_type: 'self_enrolled' | 'manager_assigned' | 'hr_assigned' | 'auto_assigned' | 'mandatory';
  enrolled_by?: string;
  enrollment_date: string;
  enrollment_deadline?: string;
  status: 'enrolled' | 'waitlisted' | 'attended' | 'completed' | 'failed' | 'cancelled' | 'no_show';
  attendance_status?: 'present' | 'absent' | 'partial' | 'late';
  check_in_time?: string;
  check_out_time?: string;
  completion_percentage?: number;
  completion_date?: string;
  grade?: number; // 0-100
  pass_fail_status?: 'pass' | 'fail' | 'pending';
  certificate_issued?: boolean;
  certificate_url?: string;
  certificate_issue_date?: string;
  feedback_rating?: number;
  feedback_comments?: string;
  learning_outcomes_met?: string[];
  post_training_assessment_score?: number;
  manager_approval_required?: boolean;
  manager_approved?: boolean;
  manager_approved_by?: string;
  manager_approval_date?: string;
  cost_charged?: number;
  cost_center?: string;
  notes?: string;
  reminder_sent?: boolean;
  follow_up_required?: boolean;
  follow_up_date?: string;
  created_at: string;
  updated_at?: string;
  cancelled_at?: string;
  cancelled_by?: string;
  cancellation_reason?: string;
};

export type TrainingAssessment = {
  id: string;
  org_id: string;
  course_id: string;
  course?: TrainingCourse;
  session_id?: string;
  session?: TrainingSession;
  title: string;
  description?: string;
  type: 'pre_training' | 'post_training' | 'knowledge_check' | 'practical' | 'certification';
  format: 'multiple_choice' | 'true_false' | 'essay' | 'practical_demo' | 'mixed';
  duration_minutes?: number;
  total_questions?: number;
  passing_score: number; // percentage
  max_attempts: number;
  questions?: {
    id: string;
    question: string;
    type: 'multiple_choice' | 'true_false' | 'essay' | 'fill_blank';
    options?: string[];
    correct_answers?: string[];
    points: number;
    explanation?: string;
  }[];
  instructions?: string;
  resources_allowed?: string[];
  time_limit_enforced?: boolean;
  randomize_questions?: boolean;
  show_correct_answers?: boolean;
  feedback_immediate?: boolean;
  retake_policy?: string;
  is_mandatory: boolean;
  weight_in_course?: number; // percentage contribution to final grade
  prerequisite_assessments?: string[];
  created_by: string;
  created_at: string;
  updated_at?: string;
};

export type TrainingAssessmentAttempt = {
  id: string;
  org_id: string;
  assessment_id: string;
  assessment?: TrainingAssessment;
  user_id: string;
  user?: User;
  enrollment_id: string;
  attempt_number: number;
  start_time: string;
  end_time?: string;
  submitted_time?: string;
  status: 'in_progress' | 'submitted' | 'graded' | 'expired' | 'abandoned';
  score?: number; // percentage
  grade?: string; // A, B, C, D, F or Pass/Fail
  passed: boolean;
  time_taken_minutes?: number;
  answers?: {
    question_id: string;
    answer: string | string[];
    is_correct?: boolean;
    points_earned?: number;
    feedback?: string;
  }[];
  total_points_earned?: number;
  total_points_possible?: number;
  proctor_notes?: string;
  flagged_for_review?: boolean;
  review_notes?: string;
  graded_by?: string;
  graded_at?: string;
  certificate_eligible?: boolean;
  remedial_training_required?: boolean;
  remedial_training_assigned?: string[];
  feedback_provided?: string;
  created_at: string;
  updated_at?: string;
};

export type TrainingCertificate = {
  id: string;
  org_id: string;
  user_id: string;
  user?: User;
  course_id: string;
  course?: TrainingCourse;
  session_id?: string;
  session?: TrainingSession;
  enrollment_id: string;
  certificate_number: string;
  title: string;
  description?: string;
  issue_date: string;
  expiry_date?: string;
  status: 'active' | 'expired' | 'revoked' | 'suspended';
  certificate_url?: string;
  verification_code: string;
  issuing_authority: string;
  issuer_signature?: string;
  issuer_title?: string;
  competencies_achieved?: string[];
  continuing_education_credits?: number;
  renewal_required?: boolean;
  renewal_criteria?: string[];
  next_renewal_date?: string;
  verification_url?: string;
  badge_url?: string;
  blockchain_hash?: string; // For blockchain verification
  qr_code_data?: string;
  printed_count?: number;
  last_verified_at?: string;
  notes?: string;
  revoked_at?: string;
  revoked_by?: string;
  revocation_reason?: string;
  created_at: string;
  updated_at?: string;
};

export type TrainingPathway = {
  id: string;
  org_id: string;
  title: string;
  description: string;
  target_role?: string;
  target_department?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimated_duration_hours: number;
  courses: {
    course_id: string;
    order: number;
    is_required: boolean;
    prerequisites?: string[];
    estimated_completion_weeks?: number;
  }[];
  learning_objectives: string[];
  completion_criteria: {
    required_courses: number;
    minimum_grade?: number;
    certifications_required?: string[];
    practical_assessment_required?: boolean;
  };
  badge_awarded?: string;
  certificate_awarded?: boolean;
  career_progression?: string[];
  status: 'draft' | 'published' | 'archived';
  enrollment_count?: number;
  completion_rate?: number;
  average_rating?: number;
  created_by: string;
  created_at: string;
  updated_at?: string;
};

export type TrainingPathwayEnrollment = {
  id: string;
  org_id: string;
  pathway_id: string;
  pathway?: TrainingPathway;
  user_id: string;
  user?: User;
  enrolled_by?: string;
  enrollment_date: string;
  target_completion_date?: string;
  status: 'in_progress' | 'completed' | 'paused' | 'withdrawn';
  progress_percentage: number;
  current_course_id?: string;
  completed_courses: string[];
  failed_courses?: string[];
  total_time_spent_hours?: number;
  completion_date?: string;
  final_grade?: number;
  certificate_issued?: boolean;
  badge_earned?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
};

export type TrainingFeedback = {
  id: string;
  org_id: string;
  session_id?: string;
  session?: TrainingSession;
  course_id?: string;
  course?: TrainingCourse;
  trainer_id?: string;
  trainer?: Trainer;
  user_id: string;
  user?: User;
  feedback_type: 'session' | 'course' | 'trainer' | 'content' | 'platform';
  overall_rating: number; // 1-5
  content_quality_rating?: number;
  trainer_effectiveness_rating?: number;
  delivery_method_rating?: number;
  materials_rating?: number;
  venue_rating?: number;
  technical_quality_rating?: number;
  learning_objectives_met: boolean;
  would_recommend: boolean;
  most_valuable_aspect?: string;
  least_valuable_aspect?: string;
  suggestions_for_improvement?: string;
  additional_topics_requested?: string[];
  pace_feedback?: 'too_slow' | 'just_right' | 'too_fast';
  difficulty_feedback?: 'too_easy' | 'just_right' | 'too_difficult';
  engagement_level?: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  technical_issues?: string;
  accessibility_feedback?: string;
  follow_up_training_needed?: boolean;
  follow_up_topics?: string[];
  anonymized?: boolean;
  submitted_at: string;
  created_at: string;
};

export type TrainingReport = {
  id: string;
  org_id: string;
  report_type: 'enrollment' | 'completion' | 'compliance' | 'roi' | 'feedback' | 'trainer_performance';
  title: string;
  description?: string;
  date_range: {
    start_date: string;
    end_date: string;
  };
  filters?: {
    departments?: string[];
    roles?: string[];
    courses?: string[];
    trainers?: string[];
    locations?: string[];
  };
  metrics: {
    total_enrollments?: number;
    total_completions?: number;
    completion_rate?: number;
    average_rating?: number;
    total_cost?: number;
    cost_per_completion?: number;
    time_to_completion_avg?: number;
    compliance_rate?: number;
    certification_rate?: number;
  };
  data_points?: Record<string, any>;
  chart_data?: Record<string, any>;
  generated_by: string;
  generated_at: string;
  report_url?: string;
  scheduled_delivery?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    recipients: string[];
    next_delivery: string;
  };
  created_at: string;
};

export type TrainingBudget = {
  id: string;
  org_id: string;
  fiscal_year: string;
  department_id?: string;
  total_budget: number;
  allocated_budget: number;
  spent_amount: number;
  remaining_budget: number;
  currency: string;
  budget_categories: {
    category: 'internal_training' | 'external_training' | 'certification' | 'materials' | 'travel' | 'technology';
    allocated: number;
    spent: number;
  }[];
  approval_workflow?: {
    threshold_amount: number;
    approver_ids: string[];
    auto_approval_limit?: number;
  };
  tracking_enabled: boolean;
  created_by: string;
  created_at: string;
  updated_at?: string;
};

export type TrainingIntegration = {
  id: string;
  org_id: string;
  integration_type: 'lms' | 'hr_system' | 'assessment_platform' | 'video_platform' | 'document_system';
  platform_name: string;
  api_endpoint?: string;
  auth_type: 'api_key' | 'oauth' | 'saml' | 'basic_auth';
  credentials?: Record<string, any>;
  sync_settings: {
    auto_sync_enabled: boolean;
    sync_frequency: 'hourly' | 'daily' | 'weekly';
    sync_data_types: string[];
    last_sync_at?: string;
    next_sync_at?: string;
  };
  field_mappings?: Record<string, string>;
  status: 'active' | 'inactive' | 'error' | 'testing';
  error_log?: string[];
  created_by: string;
  created_at: string;
  updated_at?: string;
}; 