import { useState } from "react";

import { ModernRequireRole } from "@/components/ModernRequireRole";
import { Card } from "@/components/ui/card";

import { Interview, Job, User } from "../../packages/types";

const mockJobs: Job[] = [
  {
    id: "1",
    org_id: "org1",
    title: "Frontend Engineer",
    status: "published",
    created_at: "2024-06-01T10:00:00Z",
    location: "New York",
    job_type: "full_time",
    poster_id: "user1",
  },
  {
    id: "2",
    org_id: "org1",
    title: "Backend Engineer",
    status: "published",
    created_at: "2024-06-02T10:00:00Z",
    location: "San Francisco",
    job_type: "full_time",
    poster_id: "user1",
  },
];

const mockUsers: User[] = [
  {
    id: "u1",
    org_id: "org1",
    email: "alice@example.com",
    full_name: "Alice Smith",
    role: "candidate",
    status: "candidate",
    created_at: "2024-06-01T10:00:00Z",
  },
  {
    id: "u2",
    org_id: "org1",
    email: "bob@example.com",
    full_name: "Bob Lee",
    role: "candidate",
    status: "candidate",
    created_at: "2024-06-01T10:00:00Z",
  },
];

const mockInterviews: Interview[] = [
  {
    id: "i1",
    org_id: "org1",
    application_id: "a1",
    title: "Phone Screen Interview",
    type: "phone",
    interviewer_ids: ["interviewer1"],
    status: "scheduled",
    scheduled_at: "2024-06-10T10:00:00Z",
    duration: 30,
    created_at: "2024-06-05T10:00:00Z",
  },
  {
    id: "i2",
    org_id: "org1",
    application_id: "a2",
    title: "Technical Interview",
    type: "video",
    interviewer_ids: ["interviewer1"],
    status: "scheduled",
    scheduled_at: "2024-06-11T14:00:00Z",
    duration: 60,
    created_at: "2024-06-06T10:00:00Z",
  },
];

const getJobTitle = (jobId: string) =>
  mockJobs.find((j) => j.id === jobId)?.title || "Unknown";
const getCandidate = (userId: string) => mockUsers.find((u) => u.id === userId);

export default function InterviewerDashboard() {
  const [interviews] = useState<Interview[]>(mockInterviews);

  return (
    <ModernRequireRole
      allowed={["interviewer", "recruiter", "admin"]}
      fallbackToPublic={true}
    >
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Upcoming Interviews</h1>
        <div className="flex flex-col gap-6">
          {interviews.map((interview) => {
            // For demo, just use mockUsers[0] and mockJobs[0]
            const candidate = mockUsers[0];
            const job = mockJobs[0];
            return (
              <Card key={interview.id} className="hover:shadow-lg transition">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{candidate.full_name}</span>
                    <span className="text-gray-500">({candidate.email})</span>
                  </div>
                  <div className="text-gray-600">
                    Interview for{" "}
                    <span className="font-medium">{job.title}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Scheduled:{" "}
                    {new Date(interview.scheduled_at).toLocaleString()}
                  </div>
                  <div className="text-xs text-blue-600">
                    Status: {interview.status}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </ModernRequireRole>
  );
}
