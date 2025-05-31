import React from "react";

import Head from "next/head";
import Link from "next/link";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Mock job data for testing
const mockJobs = [
  {
    id: "1",
    title: "Software Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    salary_range: "$120,000 - $180,000",
    description: "Join our engineering team to build amazing products.",
    status: "open",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Product Manager",
    department: "Product",
    location: "New York, NY",
    type: "Full-time",
    salary_range: "$130,000 - $190,000",
    description: "Lead product strategy and work with cross-functional teams.",
    status: "open",
    created_at: "2024-01-20T14:30:00Z",
  },
  {
    id: "3",
    title: "UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    salary_range: "$100,000 - $150,000",
    description: "Create beautiful and intuitive user experiences.",
    status: "open",
    created_at: "2024-01-25T09:15:00Z",
  },
];

export default function JobsTestPage() {
  return (
    <>
      <Head>
        <title>Jobs | HR Portal</title>
        <meta name="description" content="Browse current job opportunities" />
      </Head>

      <ModernDashboardLayout
        title="Job Openings"
        subtitle="Browse current opportunities (Test Page - No Auth Required)"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              ✅ Jobs Page Fixed!
            </h2>
            <p className="text-blue-700">
              This page is now accessible without authentication. The
              RequireRole wrapper has been removed from the jobs page.
            </p>
          </div>

          <div className="text-sm text-gray-500 mb-4">
            Showing {mockJobs.length} jobs
          </div>

          <div className="grid grid-cols-1 gap-6">
            {mockJobs.map((job) => (
              <Card
                key={job.id}
                className="hover:border-blue-300 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        {job.title}
                      </h2>
                      <div className="flex flex-wrap items-center text-sm text-gray-600 gap-x-4 gap-y-2 mb-2">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          {job.department}
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {job.salary_range}
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {job.type}
                        </div>
                      </div>
                      <p className="text-gray-600">{job.description}</p>
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-col md:items-end">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-2">
                        Open
                      </span>
                      <div className="text-sm text-gray-500">
                        Posted {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Next Steps:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Jobs page now loads without authentication</li>
              <li>• RequireRole wrapper removed from jobs/index.tsx</li>
              <li>• Page accessible to all users including guests</li>
              <li>• Ready for production deployment</li>
            </ul>
          </div>
        </div>
      </ModernDashboardLayout>
    </>
  );
}
