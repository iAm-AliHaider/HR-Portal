import { supabase } from '../lib/supabase/client';
import { Application, User, CandidateAssessment } from '../../packages/types';

// Mock application data for development
const mockApplications: Application[] = [
  {
    id: 'app1',
    org_id: 'org1',
    user_id: 'user1',
    job_id: 'job1',
    cv_url: 'https://example.com/resume1.pdf',
    cover_letter_url: '',
    status: 'interview',
    current_stage_id: 'stage3',
    stage_history: [
      {
        stage_id: 'stage1',
        entered_at: '2024-01-15T10:00:00Z',
        exited_at: '2024-01-16T14:00:00Z',
        duration: 28,
        notes: 'Application reviewed and approved for phone screening'
      },
      {
        stage_id: 'stage2',
        entered_at: '2024-01-16T14:00:00Z',
        exited_at: '2024-01-18T11:00:00Z',
        duration: 45,
        notes: 'Phone screening completed successfully'
      },
      {
        stage_id: 'stage3',
        entered_at: '2024-01-18T11:00:00Z',
        notes: 'Technical assessment scheduled'
      }
    ],
    source: 'Company Website',
    application_date: '2024-01-15T09:30:00Z',
    last_activity_date: '2024-01-18T11:00:00Z',
    salary_expectation: {
      amount: 85000,
      currency: 'USD',
      period: 'yearly'
    },
    availability_date: '2024-03-01T00:00:00Z',
    notice_period: '2 weeks',
    custom_fields: {
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      years_of_experience: 5,
      linkedin_url: 'https://linkedin.com/in/sarahjohnson',
      work_location_preference: 'hybrid'
    },
    total_score: 85,
    created_at: '2024-01-15T09:30:00Z'
  },
  {
    id: 'app2',
    org_id: 'org1',
    user_id: 'user2',
    job_id: 'job2',
    cv_url: 'https://example.com/resume2.pdf',
    status: 'screening',
    current_stage_id: 'stage2',
    stage_history: [
      {
        stage_id: 'stage1',
        entered_at: '2024-01-20T08:00:00Z',
        exited_at: '2024-01-21T16:00:00Z',
        duration: 32,
        notes: 'Initial application review completed'
      },
      {
        stage_id: 'stage2',
        entered_at: '2024-01-21T16:00:00Z',
        notes: 'Phone screening scheduled for tomorrow'
      }
    ],
    source: 'LinkedIn',
    application_date: '2024-01-20T08:00:00Z',
    last_activity_date: '2024-01-21T16:00:00Z',
    salary_expectation: {
      amount: 95000,
      currency: 'USD',
      period: 'yearly'
    },
    availability_date: '2024-02-15T00:00:00Z',
    notice_period: '1 month',
    custom_fields: {
      first_name: 'Michael',
      last_name: 'Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 987-6543',
      years_of_experience: 8,
      linkedin_url: 'https://linkedin.com/in/michaelchen',
      work_location_preference: 'remote'
    },
    total_score: 78,
    created_at: '2024-01-20T08:00:00Z'
  },
  {
    id: 'app3',
    org_id: 'org1',
    user_id: 'user3',
    job_id: 'job1',
    cv_url: 'https://example.com/resume3.pdf',
    status: 'new',
    current_stage_id: 'stage1',
    stage_history: [
      {
        stage_id: 'stage1',
        entered_at: '2024-01-22T14:30:00Z',
        notes: 'New application received'
      }
    ],
    source: 'Indeed',
    application_date: '2024-01-22T14:30:00Z',
    last_activity_date: '2024-01-22T14:30:00Z',
    salary_expectation: {
      amount: 75000,
      currency: 'USD',
      period: 'yearly'
    },
    availability_date: '2024-04-01T00:00:00Z',
    notice_period: '3 weeks',
    custom_fields: {
      first_name: 'Emily',
      last_name: 'Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '+1 (555) 555-0123',
      years_of_experience: 3,
      linkedin_url: 'https://linkedin.com/in/emilyrodriguez',
      work_location_preference: 'onsite'
    },
    total_score: 72,
    created_at: '2024-01-22T14:30:00Z'
  }
];

// Mock user data for candidates
const mockUsers: User[] = [
  {
    id: 'user1',
    org_id: 'org1',
    email: 'sarah.johnson@email.com',
    full_name: 'Sarah Johnson',
    role: 'candidate',
    status: 'candidate',
    created_at: '2024-01-15T09:30:00Z',
    is_active: true,
    phone: '+1 (555) 123-4567',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
    resume_url: 'https://example.com/resume1.pdf',
    linkedin_url: 'https://linkedin.com/in/sarahjohnson'
  },
  {
    id: 'user2',
    org_id: 'org1',
    email: 'michael.chen@email.com',
    full_name: 'Michael Chen',
    role: 'candidate',
    status: 'candidate',
    created_at: '2024-01-20T08:00:00Z',
    is_active: true,
    phone: '+1 (555) 987-6543',
    skills: ['Leadership', 'HR Strategy', 'Talent Acquisition', 'Performance Management'],
    resume_url: 'https://example.com/resume2.pdf',
    linkedin_url: 'https://linkedin.com/in/michaelchen'
  },
  {
    id: 'user3',
    org_id: 'org1',
    email: 'emily.rodriguez@email.com',
    full_name: 'Emily Rodriguez',
    role: 'candidate',
    status: 'candidate',
    created_at: '2024-01-22T14:30:00Z',
    is_active: true,
    phone: '+1 (555) 555-0123',
    skills: ['JavaScript', 'React', 'CSS', 'HTML', 'UI/UX Design'],
    resume_url: 'https://example.com/resume3.pdf',
    linkedin_url: 'https://linkedin.com/in/emilyrodriguez'
  }
];

export async function getApplications(org_id: string): Promise<Application[]> {
  try {
    const { data, error } = await supabase.from('applications').select('*').eq('org_id', org_id);
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('Supabase query failed, returning mock data:', error);
    // Return mock data for development
    return mockApplications.filter(app => app.org_id === org_id);
  }
}

export async function getApplicationById(id: string): Promise<Application | null> {
  try {
    const { data, error } = await supabase.from('applications').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('Supabase query failed, returning mock data:', error);
    // Return mock data for development
    return mockApplications.find(app => app.id === id) || null;
  }
}

export async function createApplication(app: Partial<Application>): Promise<Application> {
  try {
    const { data, error } = await supabase.from('applications').insert([app]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('Supabase insert failed, returning mock data:', error);
    // For development, return a mock application
    const newApp: Application = {
      id: 'app' + Date.now(),
      org_id: app.org_id || 'org1',
      user_id: app.user_id || 'user' + Date.now(),
      job_id: app.job_id || 'job1',
      status: 'new',
      application_date: new Date().toISOString(),
      last_activity_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      ...app
    } as Application;
    
    // Add to mock data
    mockApplications.push(newApp);
    return newApp;
  }
}

export async function updateApplication(id: string, updates: Partial<Application>): Promise<Application> {
  try {
    const { data, error } = await supabase.from('applications').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('Supabase update failed, returning mock data:', error);
    // Update mock data
    const appIndex = mockApplications.findIndex(app => app.id === id);
    if (appIndex !== -1) {
      mockApplications[appIndex] = { ...mockApplications[appIndex], ...updates };
      return mockApplications[appIndex];
    }
    throw new Error('Application not found');
  }
}

export async function deleteApplication(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('applications').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.warn('Supabase delete failed:', error);
    // Remove from mock data
    const appIndex = mockApplications.findIndex(app => app.id === id);
    if (appIndex !== -1) {
      mockApplications.splice(appIndex, 1);
    }
  }
}

export async function moveApplicationToStage(applicationId: string, stageId: string, notes?: string): Promise<Application> {
  const updates: Partial<Application> = {
    current_stage_id: stageId,
    last_activity_date: new Date().toISOString()
  };

  // Add to stage history
  try {
    const { data: existingApp } = await supabase
      .from('applications')
      .select('stage_history')
      .eq('id', applicationId)
      .single();

    if (existingApp?.stage_history) {
      const newStageEntry = {
        stage_id: stageId,
        entered_at: new Date().toISOString(),
        notes: notes || undefined
      };
      
      updates.stage_history = [...existingApp.stage_history, newStageEntry];
    }
  } catch (error) {
    console.warn('Failed to fetch stage history from Supabase, using mock data:', error);
    // Use mock data
    const app = mockApplications.find(a => a.id === applicationId);
    if (app?.stage_history) {
      const newStageEntry = {
        stage_id: stageId,
        entered_at: new Date().toISOString(),
        notes: notes || undefined
      };
      updates.stage_history = [...app.stage_history, newStageEntry];
    }
  }

  return updateApplication(applicationId, updates);
}

export async function rejectApplication(applicationId: string, reason?: string): Promise<Application> {
  const updates: Partial<Application> = {
    status: 'rejected',
    rejection_reason: reason,
    rejection_date: new Date().toISOString(),
    last_activity_date: new Date().toISOString()
  };

  return updateApplication(applicationId, updates);
}

export async function withdrawApplication(applicationId: string): Promise<Application> {
  const updates: Partial<Application> = {
    status: 'withdrawn',
    withdrawn_date: new Date().toISOString(),
    last_activity_date: new Date().toISOString()
  };

  return updateApplication(applicationId, updates);
}

export async function getAssessments(applicationId: string): Promise<CandidateAssessment[]> {
  try {
    const { data, error } = await supabase
      .from('candidate_assessments')
      .select('*')
      .eq('application_id', applicationId);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('Supabase query failed, returning empty assessments:', error);
    // Return empty array for development
    return [];
  }
}

export async function getCandidateById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('Supabase query failed, returning mock user data:', error);
    // Return mock user data for development
    return mockUsers.find(user => user.id === id) || null;
  }
}

export function getApplicationStatuses(): string[] {
  return [
    'new',
    'screening', 
    'interview',
    'assessment',
    'shortlisted',
    'offered',
    'hired',
    'rejected',
    'withdrawn'
  ];
} 