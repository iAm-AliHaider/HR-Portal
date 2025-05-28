import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useJobs, useApplications } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { GetServerSideProps } from 'next';


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function RecruitmentDashboard() {
  const router = useRouter();
  const { user, role } = useAuth();
  const { jobs, loading: jobsLoading } = useJobs();
  const { applications: allApplications, loading: applicationsLoading } = useApplications();
  
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Calculate recruitment metrics
  const openJobs = jobs.filter(job => job.status === 'open');
  const closedJobs = jobs.filter(job => job.status === 'closed');
  const totalApplications = allApplications.length;
  
  // Application status counts
  const newApplications = allApplications.filter(app => app.status === 'Applied').length;
  const inScreening = allApplications.filter(app => app.status === 'Screening').length;
  const inInterview = allApplications.filter(app => app.status === 'Interview').length;
  const inOffer = allApplications.filter(app => app.status === 'Offered').length;
  const hired = allApplications.filter(app => app.status === 'Hired').length;
  const rejected = allApplications.filter(app => app.status === 'Rejected').length;
  
  // Calculate conversion rates
  const screeningRate = totalApplications > 0 ? Math.round((inScreening / totalApplications) * 100) : 0;
  const interviewRate = inScreening > 0 ? Math.round((inInterview / inScreening) * 100) : 0;
  const offerRate = inInterview > 0 ? Math.round((inOffer / inInterview) * 100) : 0;
  const hireRate = inOffer > 0 ? Math.round((hired / inOffer) * 100) : 0;

  return (
    <>
      <Head>
        <title>Recruitment Dashboard | HR Portal</title>
        <meta name="description" content="Recruitment dashboard to manage the hiring process" />
      </Head>
      
      <DashboardLayout 
        title="Recruitment Dashboard" 
        subtitle="Manage your entire recruitment process"
        actions={
          role === 'admin' || role === 'hr' || role === 'recruiter' ? (
            <Link href="/jobs/new">
              <Button className="bg-blue-600 hover:bg-blue-700">Post New Job</Button>
            </Link>
          ) : null
        }
      >
        <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Open Jobs</span>
                    <span className="text-2xl font-bold">{openJobs.length}</span>
                    <span className="text-xs text-gray-500 mt-1">Total: {jobs.length}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Total Applications</span>
                    <span className="text-2xl font-bold">{totalApplications}</span>
                    <span className="text-xs text-gray-500 mt-1">New: {newApplications}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Interviews Scheduled</span>
                    <span className="text-2xl font-bold">{inInterview}</span>
                    <span className="text-xs text-gray-500 mt-1">Conversion: {interviewRate}%</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Offers Extended</span>
                    <span className="text-2xl font-bold">{inOffer}</span>
                    <span className="text-xs text-gray-500 mt-1">Accepted: {hired}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Recruitment Funnel</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Applications</span>
                        <span className="text-sm font-medium">{totalApplications}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Screening</span>
                        <span className="text-sm font-medium">{inScreening} ({screeningRate}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${screeningRate}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Interviews</span>
                        <span className="text-sm font-medium">{inInterview} ({interviewRate}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: `${interviewRate}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Offers</span>
                        <span className="text-sm font-medium">{inOffer} ({offerRate}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-300 h-2.5 rounded-full" style={{ width: `${offerRate}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Hired</span>
                        <span className="text-sm font-medium">{hired} ({hireRate}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${hireRate}%` }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
                  <div className="space-y-4">
                    {allApplications.slice(0, 5).map((application, index) => (
                      <div key={index} className="flex items-start">
                        <div className={`w-3 h-3 mt-1.5 rounded-full mr-3 ${
                          application.status === 'Applied' ? 'bg-blue-500' :
                          application.status === 'Screening' ? 'bg-yellow-500' :
                          application.status === 'Interview' ? 'bg-purple-500' :
                          application.status === 'Offered' ? 'bg-orange-500' :
                          application.status === 'Hired' ? 'bg-green-500' :
                          'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium">{application.candidate_name}</p>
                          <p className="text-xs text-gray-500">{application.job_title} - {application.status}</p>
                          <p className="text-xs text-gray-400">Applied on {new Date(application.applied_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                    
                    {allApplications.length === 0 && (
                      <p className="text-sm text-gray-500">No recent activities</p>
                    )}
                    
                    <div className="pt-2">
                      <Link href="/applications">
                        <Button variant="outline" size="sm" className="w-full">View All Applications</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Link href="/jobs/new">
                      <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                        <svg className="w-6 h-6 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <h4 className="font-medium">Post New Job</h4>
                        <p className="text-sm text-gray-500">Create a new job listing</p>
                      </div>
                    </Link>
                    
                    <Link href="/applications">
                      <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                        <svg className="w-6 h-6 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h4 className="font-medium">Review Applications</h4>
                        <p className="text-sm text-gray-500">Manage candidate applications</p>
                      </div>
                    </Link>
                    
                    <Link href="/interviews">
                      <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                        <svg className="w-6 h-6 text-purple-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h4 className="font-medium">Schedule Interviews</h4>
                        <p className="text-sm text-gray-500">Manage interview calendar</p>
                      </div>
                    </Link>
                    
                    <Link href="/recruitment/reports">
                      <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                        <svg className="w-6 h-6 text-orange-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <h4 className="font-medium">View Reports</h4>
                        <p className="text-sm text-gray-500">Analytics and insights</p>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="jobs">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Job Listings</h3>
                  <Link href="/jobs/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">Add New Job</Button>
                  </Link>
                </div>
                
                {jobsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No jobs posted yet</p>
                    <Link href="/jobs/new">
                      <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Post Your First Job</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <div>
                            <Link href={`/jobs/${job.id}`}>
                              <h4 className="font-medium text-blue-600 hover:underline">{job.title}</h4>
                            </Link>
                            <div className="text-sm text-gray-500">{job.department} · {job.location} · {job.type}</div>
                            <div className="text-xs text-gray-400 mt-1">Posted: {new Date(job.created_at).toLocaleDateString()}</div>
                          </div>
                          <div className="mt-2 md:mt-0 flex items-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {job.status === 'open' ? 'Open' : 'Closed'}
                            </span>
                            <div className="ml-4 text-sm">
                              <span className="font-medium">{job.applications_count || 0}</span> applications
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 text-center">
                      <Link href="/jobs">
                        <Button variant="outline">View All Jobs</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="applications">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Recent Applications</h3>
                  <Link href="/applications">
                    <Button variant="outline">View All</Button>
                  </Link>
                </div>
                
                {applicationsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : allApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No applications received yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 pb-4">Candidate</th>
                          <th className="text-left p-2 pb-4">Position</th>
                          <th className="text-left p-2 pb-4">Applied On</th>
                          <th className="text-left p-2 pb-4">Status</th>
                          <th className="text-right p-2 pb-4">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allApplications.slice(0, 5).map((application, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-3">{application.candidate_name}</td>
                            <td className="p-3">{application.job_title}</td>
                            <td className="p-3">{new Date(application.applied_at).toLocaleDateString()}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                application.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                                application.status === 'Screening' ? 'bg-yellow-100 text-yellow-800' :
                                application.status === 'Interview' ? 'bg-purple-100 text-purple-800' :
                                application.status === 'Offered' ? 'bg-orange-100 text-orange-800' :
                                application.status === 'Hired' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {application.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <Link href={`/applications/${application.id}`}>
                                <Button size="sm" variant="outline">View</Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="interviews">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Upcoming Interviews</h3>
                  <Link href="/interviews">
                    <Button variant="outline">View Calendar</Button>
                  </Link>
                </div>
                
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Interview calendar will be displayed here</p>
                  <Link href="/interviews">
                    <Button className="bg-blue-600 hover:bg-blue-700">Manage Interviews</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="offers">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Offer Management</h3>
                  <Link href="/offers">
                    <Button variant="outline">View All Offers</Button>
                  </Link>
                </div>
                
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Offer management dashboard will be displayed here</p>
                  <Link href="/offers">
                    <Button className="bg-blue-600 hover:bg-blue-700">Manage Offers</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardLayout>
    </>
  );
} 
