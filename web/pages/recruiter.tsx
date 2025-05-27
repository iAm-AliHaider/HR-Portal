// @ts-nocheck
import { useState } from 'react';
import { Job, Application } from '../../packages/types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/button';

const mockJobs: Job[] = [
  {
    id: '1',
    org_id: 'org1',
    title: 'Frontend Engineer',
    description: 'Build beautiful UIs with React and Next.js.',
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
    description: 'Work on scalable APIs and databases.',
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
    user_id: 'u1',
    job_id: '1',
    status: 'applied',
    created_at: '2024-06-03T10:00:00Z',
  },
  {
    id: 'a2',
    org_id: 'org1',
    user_id: 'u2',
    job_id: '1',
    status: 'shortlisted',
    created_at: '2024-06-04T10:00:00Z',
  },
  {
    id: 'a3',
    org_id: 'org1',
    user_id: 'u3',
    job_id: '2',
    status: 'applied',
    created_at: '2024-06-05T10:00:00Z',
  },
];

export default function RecruiterDashboard() {
  const [jobs] = useState<Job[]>(mockJobs);
  const [applications] = useState<Application[]>(mockApplications);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
        <Button variant="default">Post New Job</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => {
          const jobApps = applications.filter((a) => a.job_id === job.id);
          return (
            <Card key={job.id} className="hover:shadow-lg transition cursor-pointer">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-600">{job.description}</p>
                <span className="text-xs text-gray-400">{jobApps.length} applications</span>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline">Review Candidates</Button>
                  <Button variant="ghost">View Job</Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 