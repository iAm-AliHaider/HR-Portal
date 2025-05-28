import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { shouldBypassAuth } from '@/lib/auth';
import TabGroup from '@/components/ui/TabGroup';
import Timeline, { TimelineItem } from '@/components/ui/Timeline';
import { GetServerSideProps } from 'next';

// Mock people data - same as in the directory page
const MOCK_PEOPLE = [
  { id: 1, name: 'Alice Johnson', role: 'HR Manager', department: 'Human Resources', location: 'New York', email: 'alice@example.com', phone: '(123) 456-7890', status: 'active', manager: 'Bob Smith', hireDate: '2019-05-12' },
  { id: 2, name: 'Bob Smith', role: 'CEO', department: 'Executive', location: 'New York', email: 'bob@example.com', phone: '(123) 456-7891', status: 'active', manager: null, hireDate: '2018-01-10' },
  { id: 3, name: 'Carlos Rodriguez', role: 'Software Engineer', department: 'Engineering', location: 'San Francisco', email: 'carlos@example.com', phone: '(123) 456-7892', status: 'active', manager: 'Diana Wong', hireDate: '2020-07-15' },
  { id: 4, name: 'Diana Wong', role: 'Engineering Director', department: 'Engineering', location: 'San Francisco', email: 'diana@example.com', phone: '(123) 456-7893', status: 'active', manager: 'Bob Smith', hireDate: '2019-03-20' },
  { id: 5, name: 'Emily Chen', role: 'Marketing Specialist', department: 'Marketing', location: 'Chicago', email: 'emily@example.com', phone: '(123) 456-7894', status: 'active', manager: 'Frank Miller', hireDate: '2021-02-10' },
  { id: 6, name: 'Frank Miller', role: 'Marketing Director', department: 'Marketing', location: 'Chicago', email: 'frank@example.com', phone: '(123) 456-7895', status: 'active', manager: 'Bob Smith', hireDate: '2018-11-05' },
  { id: 7, name: 'Grace Kim', role: 'UI/UX Designer', department: 'Design', location: 'Remote', email: 'grace@example.com', phone: '(123) 456-7896', status: 'active', manager: 'Diana Wong', hireDate: '2020-09-15' },
  { id: 8, name: 'Henry Wilson', role: 'Financial Analyst', department: 'Finance', location: 'New York', email: 'henry@example.com', phone: '(123) 456-7897', status: 'inactive', manager: 'Irene Lopez', hireDate: '2019-06-30' },
  { id: 9, name: 'Irene Lopez', role: 'Finance Director', department: 'Finance', location: 'New York', email: 'irene@example.com', phone: '(123) 456-7898', status: 'active', manager: 'Bob Smith', hireDate: '2018-05-20' },
  { id: 10, name: 'Jack Thompson', role: 'Sales Representative', department: 'Sales', location: 'Miami', email: 'jack@example.com', phone: '(123) 456-7899', status: 'active', manager: 'Kelly Brown', hireDate: '2021-01-10' },
  { id: 11, name: 'Kelly Brown', role: 'Sales Manager', department: 'Sales', location: 'Miami', email: 'kelly@example.com', phone: '(123) 456-7900', status: 'active', manager: 'Bob Smith', hireDate: '2019-04-05' },
  { id: 12, name: 'Leo Garcia', role: 'Customer Support', department: 'Support', location: 'Remote', email: 'leo@example.com', phone: '(123) 456-7901', status: 'active', manager: 'Maria Patel', hireDate: '2020-11-15' },
  { id: 13, name: 'Maria Patel', role: 'Support Manager', department: 'Support', location: 'Austin', email: 'maria@example.com', phone: '(123) 456-7902', status: 'active', manager: 'Bob Smith', hireDate: '2019-02-20' },
  { id: 14, name: 'Noah Robinson', role: 'DevOps Engineer', department: 'Engineering', location: 'San Francisco', email: 'noah@example.com', phone: '(123) 456-7903', status: 'active', manager: 'Diana Wong', hireDate: '2020-08-15' },
  { id: 15, name: 'Olivia Davis', role: 'Content Strategist', department: 'Marketing', location: 'Chicago', email: 'olivia@example.com', phone: '(123) 456-7904', status: 'active', manager: 'Frank Miller', hireDate: '2021-03-10' }
];

// Mock employment history for timeline
const MOCK_EMPLOYMENT_HISTORY = {
  1: [
    { date: '2019-05-12', title: 'Joined the company', description: 'Started as HR Specialist' },
    { date: '2020-01-15', title: 'Promotion', description: 'Promoted to HR Manager' },
    { date: '2021-08-10', title: 'Recognition Award', description: 'Received Outstanding Service Award' }
  ],
  2: [
    { date: '2018-01-10', title: 'Founded the company', description: 'Started as CEO' }
  ],
  3: [
    { date: '2020-07-15', title: 'Joined the company', description: 'Started as Junior Software Engineer' },
    { date: '2021-06-20', title: 'Promotion', description: 'Promoted to Software Engineer' }
  ]
};

// Mock performance reviews
const MOCK_PERFORMANCE = {
  1: [
    { year: 2021, quarter: 'Q4', rating: 4.8, comments: 'Outstanding performance in leading HR initiatives.' },
    { year: 2021, quarter: 'Q3', rating: 4.7, comments: 'Strong leadership and team management skills.' },
    { year: 2021, quarter: 'Q2', rating: 4.5, comments: 'Excellent work in improving onboarding processes.' },
    { year: 2021, quarter: 'Q1', rating: 4.4, comments: 'Very good work in employee relations.' }
  ],
  2: [
    { year: 2021, quarter: 'Q4', rating: 5.0, comments: 'Exceptional leadership driving company growth.' },
    { year: 2021, quarter: 'Q3', rating: 4.9, comments: 'Strategic vision continues to benefit company.' }
  ],
  3: [
    { year: 2021, quarter: 'Q4', rating: 4.2, comments: 'Great technical skills and teamwork.' },
    { year: 2021, quarter: 'Q3', rating: 4.0, comments: 'Good progress in project deliverables.' }
  ]
};

// Mock skills
const MOCK_SKILLS = {
  1: ['HR Management', 'Recruiting', 'Employee Relations', 'Conflict Resolution', 'Benefits Administration', 'Onboarding'],
  2: ['Leadership', 'Strategic Planning', 'Business Development', 'Public Speaking', 'Team Building'],
  3: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'API Development', 'Git', 'MongoDB']
};

// Mock direct reports
const getDirectReports = (managerId) => {
  return MOCK_PEOPLE.filter(person => person.manager === MOCK_PEOPLE.find(p => p.id === managerId)?.name);
};

const EmployeeProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, role } = useAuth();
  const allowAccess = shouldBypassAuth(router.query);
  const [employee, setEmployee] = useState(null);
  const [directReports, setDirectReports] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [employmentHistory, setEmploymentHistory] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [skills, setSkills] = useState([]);
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load employee data
  useEffect(() => {
    if (id) {
      const numericId = Number(id);
      const employeeData = MOCK_PEOPLE.find(person => person.id === numericId);
      
      if (employeeData) {
        setEmployee(employeeData);
        setDirectReports(getDirectReports(numericId));
        setEmploymentHistory(MOCK_EMPLOYMENT_HISTORY[numericId] || []);
        setPerformanceData(MOCK_PERFORMANCE[numericId] || []);
        setSkills(MOCK_SKILLS[numericId] || []);
        
        // Find manager
        if (employeeData.manager) {
          const managerData = MOCK_PEOPLE.find(person => person.name === employeeData.manager);
          setManager(managerData);
        }
      }
      
      setLoading(false);
    }
  }, [id]);

  // Ensure user has access to this page
  useEffect(() => {
    if (!allowAccess) {
      router.push('/login?redirect=/people');
    }
  }, [allowAccess, router]);

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Create data for TabGroup
  const tabData = [
    { id: 'overview', label: 'Overview', content: (
      <div className="space-y-8">
        {/* Basic Information */}
        <section>
          <h3 className="text-lg font-medium mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Department</div>
              <div className="font-medium">{employee?.department}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Location</div>
              <div className="font-medium">{employee?.location}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Hire Date</div>
              <div className="font-medium">{employee?.hireDate ? formatDate(employee.hireDate) : 'N/A'}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Status</div>
              <div className="font-medium">
                <span className={`px-2 py-1 text-xs rounded-full ${employee?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {employee?.status}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h3 className="text-lg font-medium mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium">{employee?.email}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Phone</div>
              <div className="font-medium">{employee?.phone}</div>
            </div>
          </div>
        </section>

        {/* Reporting Structure */}
        <section>
          <h3 className="text-lg font-medium mb-4">Reporting Structure</h3>
          <div className="grid grid-cols-1 gap-4">
            {manager && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Manager</div>
                <div className="flex items-center mt-1">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-800 mr-2">
                    {manager.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium">{manager.name}</div>
                    <div className="text-xs text-gray-500">{manager.role}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <button
                    className="text-blue-600 text-sm"
                    onClick={() => router.push(`/people/${manager.id}`)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            )}

            {directReports.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-2">Direct Reports ({directReports.length})</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {directReports.map(report => (
                    <div key={report.id} className="border rounded-md p-2">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-800 mr-2">
                          {report.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium">{report.name}</div>
                          <div className="text-xs text-gray-500">{report.role}</div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <button
                          className="text-blue-600 text-sm"
                          onClick={() => router.push(`/people/${report.id}`)}
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h3 className="text-lg font-medium mb-4">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    )},
    { id: 'history', label: 'Employment History', content: (
      <div className="space-y-8">
        {employmentHistory.length > 0 ? (
          <Timeline items={employmentHistory.map(item => ({
            date: formatDate(item.date),
            title: item.title,
            description: item.description
          }))} />
        ) : (
          <div className="text-gray-500 italic">No employment history available</div>
        )}
      </div>
    )},
    { id: 'performance', label: 'Performance', content: (
      <div className="space-y-8">
        {performanceData.length > 0 ? (
          <>
            <section>
              <h3 className="text-lg font-medium mb-4">Performance Reviews</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {performanceData.map((review, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {review.year} {review.quarter}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              review.rating >= 4.5 ? 'bg-green-100 text-green-800' : 
                              review.rating >= 3.5 ? 'bg-blue-100 text-blue-800' :
                              review.rating >= 2.5 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {review.rating.toFixed(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{review.comments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-medium mb-4">Performance Trend</h3>
              <div className="h-64 bg-white p-4 border rounded-lg flex items-center justify-center">
                {/* In a real app, this would be a chart showing performance trends */}
                <div className="text-gray-500">
                  Performance chart visualization would appear here
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="text-gray-500 italic">No performance data available</div>
        )}
      </div>
    )},
    { id: 'documents', label: 'Documents', content: (
      <div className="space-y-8">
        <section>
          <h3 className="text-lg font-medium mb-4">Employee Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 mr-3">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Employment Contract</div>
                  <div className="text-xs text-gray-500">PDF • 2.3 MB • Uploaded {formatDate('2019-05-12')}</div>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button className="text-blue-600 text-sm">
                  Download
                </button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 mr-3">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">NDA Agreement</div>
                  <div className="text-xs text-gray-500">PDF • 1.1 MB • Uploaded {formatDate('2019-05-12')}</div>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button className="text-blue-600 text-sm">
                  Download
                </button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-700 mr-3">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Performance Review 2021</div>
                  <div className="text-xs text-gray-500">XLSX • 0.5 MB • Uploaded {formatDate('2021-12-15')}</div>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button className="text-blue-600 text-sm">
                  Download
                </button>
              </div>
            </div>
          </div>

          {role === 'admin' || role === 'hr' ? (
            <div className="mt-6">
              <Button variant="outline" size="sm">
                Upload New Document
              </Button>
            </div>
          ) : null}
        </section>
      </div>
    )}
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-6 flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading employee profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!employee) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-6">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="text-center py-8">
                <div className="text-xl text-red-500 mb-2">Employee Not Found</div>
                <p className="text-gray-500 mb-6">The employee you're looking for doesn't exist or has been removed.</p>
                <Button 
                  variant="default" 
                  onClick={() => router.push('/people')}
                >
                  Return to Directory
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        {/* Back button */}
        <div className="mb-4">
          <button 
            className="flex items-center text-gray-600 hover:text-gray-900"
            onClick={() => router.push('/people')}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Directory
          </button>
        </div>

        {/* Employee Profile Header */}
        <Card variant="elevated" className="mb-6">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32 relative">
              {/* Admin Action buttons */}
              {(role === 'admin' || role === 'hr') && (
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="bg-white hover:bg-gray-50 text-gray-800"
                    onClick={() => router.push(`/people/edit/${employee.id}`)}
                  >
                    Edit Profile
                  </Button>
                  {employee.status === 'active' ? (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="bg-white hover:bg-gray-50 text-red-600"
                      onClick={() => console.log('Deactivate employee')}
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="bg-white hover:bg-gray-50 text-green-600"
                      onClick={() => console.log('Activate employee')}
                    >
                      Activate
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            <div className="px-6 pb-6">
              <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-4">
                <div className="h-32 w-32 rounded-full bg-white p-1 shadow-lg mb-4 md:mb-0">
                  <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-800">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="md:ml-6 flex-1">
                  <h1 className="text-2xl font-bold">{employee.name}</h1>
                  <div className="flex flex-col md:flex-row md:items-center mt-1 md:space-x-4">
                    <div className="text-gray-600">{employee.role}</div>
                    <div className="hidden md:block text-gray-400">•</div>
                    <div className="text-gray-600">{employee.department}</div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => window.location.href = `mailto:${employee.email}`}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => window.location.href = `tel:${employee.phone}`}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card variant="bordered">
          <CardContent className="p-0">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {tabData.map(tab => (
                  <button
                    key={tab.id}
                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 focus:outline-none ${
                      tab.id === activeTab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="py-6 px-6">
              {tabData.find(tab => tab.id === activeTab)?.content}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default EmployeeProfile; 