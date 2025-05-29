import { useState } from 'react';
import { Job, Application } from '../../packages/types';
import { Card } from '@/components/ui/card';
import { Button } from '../components/ui/button';
import { ModernRequireRole } from '@/components/ModernRequireRole';

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
    status: 'new', 
    application_date: '2024-06-03T10:00:00Z',
    created_at: '2024-06-03T10:00:00Z' 
  },
  { 
    id: 'a2', 
    org_id: 'org1', 
    user_id: 'candidate2', 
    job_id: '1', 
    status: 'shortlisted', 
    application_date: '2024-06-04T10:00:00Z',
    created_at: '2024-06-04T10:00:00Z' 
  },
  { 
    id: 'a3', 
    org_id: 'org1', 
    user_id: 'candidate3', 
    job_id: '2', 
    status: 'interview', 
    application_date: '2024-06-05T10:00:00Z',
    created_at: '2024-06-05T10:00:00Z' 
  },
  { 
    id: 'a4', 
    org_id: 'org1', 
    user_id: 'candidate4', 
    job_id: '2', 
    status: 'hired', 
    application_date: '2024-06-06T10:00:00Z',
    created_at: '2024-06-06T10:00:00Z' 
  },
];

const getCount = (status: string) => mockApplications.filter((a) => a.status === status).length;

export default function HiringPipeline() {
  const [jobs] = useState<Job[]>(mockJobs);
  const [applications] = useState<Application[]>(mockApplications);

  return (
    <ModernRequireRole allowed={['admin', 'hr', 'manager']} fallbackToPublic={true}>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Hiring Pipeline Overview</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card><div className="flex flex-col items-center"><span className="text-3xl font-bold">{jobs.length}</span><span className="text-gray-500">Open Jobs</span></div></Card>
          <Card><div className="flex flex-col items-center"><span className="text-3xl font-bold">{getCount('applied')}</span><span className="text-gray-500">Applied</span></div></Card>
          <Card><div className="flex flex-col items-center"><span className="text-3xl font-bold">{getCount('shortlisted')}</span><span className="text-gray-500">Shortlisted</span></div></Card>
          <Card><div className="flex flex-col items-center"><span className="text-3xl font-bold">{getCount('interviewed')}</span><span className="text-gray-500">Interviewed</span></div></Card>
          <Card><div className="flex flex-col items-center"><span className="text-3xl font-bold">{getCount('hired')}</span><span className="text-gray-500">Hired</span></div></Card>
        </div>
        <div className="flex gap-4 flex-wrap">
          <Button variant="outline">View Jobs</Button>
          <Button variant="outline">View Applications</Button>
          <Button variant="outline">View Interviews</Button>
          <Button variant="outline">View Onboarding</Button>
        </div>
      </div>
    </ModernRequireRole>
  );
} 
