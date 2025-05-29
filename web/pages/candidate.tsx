import { useState } from 'react';
import { Application, Job } from '../../packages/types';
import { Card } from '@/components/ui/card';
const mockJobs: Job[] = [
  { 
    id: '1', 
    org_id: 'org1', 
    title: 'Frontend Engineer', 
    status: 'published', 
    created_at: '2024-06-01T10:00:00Z',
    location: 'New York',
    job_type: 'full_time',
    poster_id: 'user1'
  },
  { 
    id: '2', 
    org_id: 'org1', 
    title: 'Backend Engineer', 
    status: 'published', 
    created_at: '2024-06-02T10:00:00Z',
    location: 'San Francisco',
    job_type: 'full_time',
    poster_id: 'user1'
  },
];

const mockApplications: Application[] = [
  { 
    id: 'a1', 
    org_id: 'org1', 
    user_id: 'candidate1', 
    job_id: '1', 
    status: 'shortlisted', 
    application_date: '2024-06-03T10:00:00Z',
    created_at: '2024-06-03T10:00:00Z' 
  },
  { 
    id: 'a2', 
    org_id: 'org1', 
    user_id: 'candidate1', 
    job_id: '2', 
    status: 'new', 
    application_date: '2024-06-04T10:00:00Z',
    created_at: '2024-06-04T10:00:00Z' 
  },
];

const getJobTitle = (jobId: string) => mockJobs.find((j) => j.id === jobId)?.title || 'Unknown';

export default function CandidateJourney() {
  const [applications] = useState<Application[]>(mockApplications);

  return (
    
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Applications</h1>
        <div className="flex flex-col gap-6">
          {applications.map((app) => (
            <Card key={app.id} className="hover:shadow-lg transition">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{getJobTitle(app.job_id)}</span>
                  <span className="text-xs text-gray-400">Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-sm text-blue-600">Status: {app.status}</div>
                <div className="text-xs text-gray-500">Next step: {app.status === 'new' ? 'Awaiting review' : app.status === 'shortlisted' ? 'Interview scheduling' : 'Check email for updates'}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    
  );
} 
