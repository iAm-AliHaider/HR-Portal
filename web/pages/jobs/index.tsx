import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  status: string;
  salary_range?: string;
}

const mockJobs: Job[] = [
  { id: 1, title: 'Software Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', status: 'active', salary_range: '$80,000 - $120,000' },
  { id: 2, title: 'HR Manager', department: 'HR', location: 'On-site', type: 'Full-time', status: 'active', salary_range: '$70,000 - $90,000' },
  { id: 3, title: 'UX Designer', department: 'Design', location: 'Hybrid', type: 'Full-time', status: 'active', salary_range: '$75,000 - $95,000' }
];

export default function JobsManagement() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || mockJobs);
      } else {
        setJobs(mockJobs);
      }
    } catch (error) {
      console.warn('Failed to load jobs, using mock data:', error);
      setJobs(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Head>
          <title>Jobs Management | HR Portal</title>
        </Head>

        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Jobs & Recruitment</h1>
              <p className="mt-2 text-gray-600">Manage job postings and recruitment</p>
            </div>
            <Link
              href="/jobs/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              + Post New Job
            </Link>
          </div>

          {/* Jobs Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.salary_range}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link href={`/jobs/${job.id}`} className="text-blue-600 hover:text-blue-900">View</Link>
                      <button className="text-green-600 hover:text-green-900">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stats Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Active Jobs</h3>
              <p className="text-3xl font-bold text-blue-600">{jobs.filter(j => j.status === 'active').length}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Applications</h3>
              <p className="text-3xl font-bold text-green-600">47</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">This Month</h3>
              <p className="text-3xl font-bold text-purple-600">12</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}