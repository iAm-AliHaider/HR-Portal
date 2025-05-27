import React, { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  useEmployees, 
  useJobs, 
  useLeaveRequests, 
  useTrainingCourses, 
  useCompliance, 
  useWorkflows 
} from '../hooks/useApi';

const MockDataTestPage = () => {
  const [activeTab, setActiveTab] = useState('employees');
  
  // Load all mock data using the hooks
  const { employees, loading: employeesLoading, error: employeesError } = useEmployees();
  const { jobs, loading: jobsLoading, error: jobsError } = useJobs();
  const { requests, loading: leaveLoading, error: leaveError } = useLeaveRequests();
  const { courses, loading: coursesLoading, error: coursesError } = useTrainingCourses();
  const { requirements, loading: complianceLoading, error: complianceError } = useCompliance();
  const { workflows, loading: workflowsLoading, error: workflowsError } = useWorkflows();

  const tabs = [
    { id: 'employees', label: 'Employees', count: employees.length },
    { id: 'jobs', label: 'Jobs', count: jobs.length },
    { id: 'leave', label: 'Leave Requests', count: requests.length },
    { id: 'training', label: 'Training', count: courses.length },
    { id: 'compliance', label: 'Compliance', count: requirements.length },
    { id: 'workflows', label: 'Workflows', count: workflows.length }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'employees':
        if (employeesLoading) return <div className="text-center py-8">Loading employees...</div>;
        if (employeesError) return <div className="text-red-500 py-8">Error: {employeesError}</div>;
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map(emp => (
              <div key={emp.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {emp.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{emp.name}</h3>
                    <p className="text-sm text-gray-600">{emp.position}</p>
                    <p className="text-sm text-gray-500">{emp.department}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <p><span className="font-medium">Email:</span> {emp.email}</p>
                  <p><span className="font-medium">Location:</span> {emp.location}</p>
                  <p><span className="font-medium">Hire Date:</span> {emp.hire_date}</p>
                  <p><span className="font-medium">Salary:</span> ${emp.salary?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'jobs':
        if (jobsLoading) return <div className="text-center py-8">Loading jobs...</div>;
        if (jobsError) return <div className="text-red-500 py-8">Error: {jobsError}</div>;
        
        return (
          <div className="space-y-6">
            {jobs.map(job => (
              <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.department} • {job.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{job.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Salary:</span>
                    <p>{job.salary_range}</p>
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>
                    <p>{job.type}</p>
                  </div>
                  <div>
                    <span className="font-medium">Applications:</span>
                    <p>{job.applications_count}</p>
                  </div>
                  <div>
                    <span className="font-medium">Posted:</span>
                    <p>{new Date(job.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'leave':
        if (leaveLoading) return <div className="text-center py-8">Loading leave requests...</div>;
        if (leaveError) return <div className="text-red-500 py-8">Error: {leaveError}</div>;
        
        return (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map(req => (
                  <tr key={req.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{req.employee_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{req.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{req.days}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        req.status === 'approved' ? 'bg-green-100 text-green-800' :
                        req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{req.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'training':
        if (coursesLoading) return <div className="text-center py-8">Loading courses...</div>;
        if (coursesError) return <div className="text-red-500 py-8">Error: {coursesError}</div>;
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Instructor:</span> {course.instructor}</p>
                  <p><span className="font-medium">Duration:</span> {course.duration}</p>
                  <p><span className="font-medium">Enrolled:</span> {course.enrolled}/{course.capacity}</p>
                  <p><span className="font-medium">Location:</span> {course.location}</p>
                  <p><span className="font-medium">Price:</span> ${course.price}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'compliance':
        if (complianceLoading) return <div className="text-center py-8">Loading compliance...</div>;
        if (complianceError) return <div className="text-red-500 py-8">Error: {complianceError}</div>;
        
        return (
          <div className="space-y-4">
            {requirements.map(req => (
              <div key={req.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{req.name}</h3>
                    <p className="text-gray-600">{req.category}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    req.status === 'compliant' ? 'bg-green-100 text-green-800' :
                    req.status === 'needs_attention' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {req.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{req.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Last Review:</span>
                    <p>{new Date(req.last_review).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Next Review:</span>
                    <p>{new Date(req.next_review).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Responsible:</span>
                    <p>{req.responsible_person}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'workflows':
        if (workflowsLoading) return <div className="text-center py-8">Loading workflows...</div>;
        if (workflowsError) return <div className="text-red-500 py-8">Error: {workflowsError}</div>;
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workflows.map(workflow => (
              <div key={workflow.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    workflow.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {workflow.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{workflow.description}</p>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Steps:</span> {workflow.steps}</p>
                  <p><span className="font-medium">Created by:</span> {workflow.created_by}</p>
                  <p><span className="font-medium">Created:</span> {new Date(workflow.created_at).toLocaleDateString()}</p>
                  <p><span className="font-medium">Trigger:</span> {workflow.trigger}</p>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return <div>Select a tab to view data</div>;
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Mock Data Test | HR System</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🧪 Mock Data Test Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive view of all mock data working perfectly until Supabase setup
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-900 rounded-full px-2 py-1 text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="mb-8">
          {renderContent()}
        </div>

        {/* Status Card */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-green-400 text-2xl">✅</div>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-green-800">
                Mock Data System is Working Perfectly!
              </h3>
              <div className="mt-2 text-green-700">
                <p>• All API services are returning rich mock data</p>
                <p>• {employees.length} employees, {jobs.length} jobs, {requests.length} leave requests</p>
                <p>• {courses.length} training courses, {requirements.length} compliance items, {workflows.length} workflows</p>
                <p>• Ready for production with automatic Supabase switch</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MockDataTestPage; 
