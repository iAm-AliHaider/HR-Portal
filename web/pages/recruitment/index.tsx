import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useJobs, useApplications } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { 
  Users, 
  Briefcase, 
  UserCheck, 
  CheckCircle, 
  Calendar, 
  BarChart2,
  Award,
  Mail,
  ClipboardCheck,
  FileText,
  User,
  Plus,
  ArrowRight
} from 'lucide-react';
import { PageLayout, StatsCard, CardGrid, Card } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  const isRecruiter = role === 'admin' || role === 'hr' || role === 'recruiter';

  return (
    <PageLayout
      title="Recruitment Dashboard"
      description="Manage your entire recruitment process"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Recruitment" }
      ]}
      actionButton={isRecruiter ? {
        label: "Post New Job",
        onClick: () => router.push('/jobs/new'),
        icon: <Plus className="h-4 w-4" strokeWidth={1.5} />,
      } : undefined}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Open Jobs"
              value={openJobs.length}
              description={`Total: ${jobs.length}`}
              icon={<Briefcase className="h-5 w-5" strokeWidth={1.5} />}
            />
            
            <StatsCard
              title="Total Applications"
              value={totalApplications}
              description={`New: ${newApplications}`}
              icon={<FileText className="h-5 w-5" strokeWidth={1.5} />}
            />
            
            <StatsCard
              title="Interviews Scheduled"
              value={inInterview}
              description={`Conversion: ${interviewRate}%`}
              icon={<Calendar className="h-5 w-5" strokeWidth={1.5} />}
            />
            
            <StatsCard
              title="Offers Extended"
              value={inOffer}
              description={`Accepted: ${hired}`}
              icon={<Award className="h-5 w-5" strokeWidth={1.5} />}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-medium text-zinc-900 mb-4 flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 text-zinc-700" strokeWidth={1.5} />
                Recruitment Funnel
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-zinc-700">Applications</span>
                    <span className="text-sm font-medium text-zinc-900">{totalApplications}</span>
                  </div>
                  <div className="w-full bg-zinc-200 rounded-full h-2.5">
                    <div className="bg-zinc-900 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-zinc-700">Screening</span>
                    <span className="text-sm font-medium text-zinc-900">{inScreening} ({screeningRate}%)</span>
                  </div>
                  <div className="w-full bg-zinc-200 rounded-full h-2.5">
                    <div className="bg-zinc-800 h-2.5 rounded-full" style={{ width: `${screeningRate}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-zinc-700">Interviews</span>
                    <span className="text-sm font-medium text-zinc-900">{inInterview} ({interviewRate}%)</span>
                  </div>
                  <div className="w-full bg-zinc-200 rounded-full h-2.5">
                    <div className="bg-zinc-700 h-2.5 rounded-full" style={{ width: `${interviewRate}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-zinc-700">Offers</span>
                    <span className="text-sm font-medium text-zinc-900">{inOffer} ({offerRate}%)</span>
                  </div>
                  <div className="w-full bg-zinc-200 rounded-full h-2.5">
                    <div className="bg-zinc-600 h-2.5 rounded-full" style={{ width: `${offerRate}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-zinc-700">Hired</span>
                    <span className="text-sm font-medium text-zinc-900">{hired} ({hireRate}%)</span>
                  </div>
                  <div className="w-full bg-zinc-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${hireRate}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-medium text-zinc-900 mb-4 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5 text-zinc-700" strokeWidth={1.5} />
                Recent Activities
              </h3>
              <div className="space-y-4">
                {allApplications.slice(0, 5).map((application, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`w-3 h-3 mt-1.5 rounded-full mr-3 ${
                      application.status === 'Applied' ? 'bg-zinc-500' :
                      application.status === 'Screening' ? 'bg-yellow-500' :
                      application.status === 'Interview' ? 'bg-zinc-700' :
                      application.status === 'Offered' ? 'bg-zinc-900' :
                      application.status === 'Hired' ? 'bg-green-600' :
                      'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{application.candidate_name}</p>
                      <p className="text-xs text-zinc-500">{application.job_title} - {application.status}</p>
                      <p className="text-xs text-zinc-400">Applied on {new Date(application.applied_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                
                {allApplications.length === 0 && (
                  <p className="text-sm text-zinc-500">No recent activities</p>
                )}
                
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => router.push('/applications')}
                  >
                    View All Applications
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-medium text-zinc-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div 
                  className="border rounded-lg p-4 hover:bg-zinc-50 transition-colors cursor-pointer"
                  onClick={() => router.push('/jobs/new')}
                >
                  <Plus className="w-6 h-6 text-zinc-900 mb-2" strokeWidth={1.5} />
                  <h4 className="font-medium text-zinc-900">Post New Job</h4>
                  <p className="text-sm text-zinc-500">Create a new job listing</p>
                </div>
                
                <div 
                  className="border rounded-lg p-4 hover:bg-zinc-50 transition-colors cursor-pointer"
                  onClick={() => router.push('/applications')}
                >
                  <FileText className="w-6 h-6 text-zinc-900 mb-2" strokeWidth={1.5} />
                  <h4 className="font-medium text-zinc-900">Review Applications</h4>
                  <p className="text-sm text-zinc-500">Manage candidate applications</p>
                </div>
                
                <div 
                  className="border rounded-lg p-4 hover:bg-zinc-50 transition-colors cursor-pointer"
                  onClick={() => router.push('/interviews')}
                >
                  <Calendar className="w-6 h-6 text-zinc-900 mb-2" strokeWidth={1.5} />
                  <h4 className="font-medium text-zinc-900">Schedule Interviews</h4>
                  <p className="text-sm text-zinc-500">Manage interview calendar</p>
                </div>
                
                <div 
                  className="border rounded-lg p-4 hover:bg-zinc-50 transition-colors cursor-pointer"
                  onClick={() => router.push('/recruitment/reports')}
                >
                  <BarChart2 className="w-6 h-6 text-zinc-900 mb-2" strokeWidth={1.5} />
                  <h4 className="font-medium text-zinc-900">Analytics</h4>
                  <p className="text-sm text-zinc-500">View recruitment metrics</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="jobs">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-zinc-900">Job Listings</h3>
            {isRecruiter && (
              <Button onClick={() => router.push('/jobs/new')}>
                <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
                Post Job
              </Button>
            )}
          </div>
          
          <div className="rounded-md border border-zinc-200 bg-white shadow-sm overflow-hidden">
            {jobsLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 mx-auto"></div>
                <p className="mt-2 text-sm text-zinc-500">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-6 text-center">
                <Briefcase className="h-10 w-10 text-zinc-400 mx-auto mb-3" strokeWidth={1.5} />
                <h3 className="text-zinc-500 text-lg">No jobs posted</h3>
                <p className="text-zinc-400 text-sm mt-1 mb-4">Create your first job posting to start hiring</p>
                {isRecruiter && (
                  <Button onClick={() => router.push('/jobs/new')}>
                    <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
                    Post Job
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-zinc-200">
                {jobs.map((job) => (
                  <div key={job.id} className="p-4 hover:bg-zinc-50 transition-colors cursor-pointer" onClick={() => router.push(`/jobs/${job.id}`)}>
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-zinc-900">{job.title}</h4>
                        <p className="text-sm text-zinc-500">{job.department} • {job.location}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-zinc-100 text-zinc-800'
                        }`}>
                          {job.status === 'open' ? 'Open' : 'Closed'}
                        </span>
                        <span className="text-sm text-zinc-500 mt-1">{job.applications?.length || 0} applications</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      <span className="text-zinc-500">Posted: {new Date(job.created_at).toLocaleDateString()}</span>
                      <ArrowRight className="h-3 w-3 ml-auto text-zinc-400" strokeWidth={1.5} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="applications">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-zinc-900">Applications</h3>
            <Button variant="outline" onClick={() => router.push('/applications')}>
              View All Applications
            </Button>
          </div>
          
          <div className="rounded-md border border-zinc-200 bg-white shadow-sm overflow-hidden">
            {applicationsLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 mx-auto"></div>
                <p className="mt-2 text-sm text-zinc-500">Loading applications...</p>
              </div>
            ) : allApplications.length === 0 ? (
              <div className="p-6 text-center">
                <User className="h-10 w-10 text-zinc-400 mx-auto mb-3" strokeWidth={1.5} />
                <h3 className="text-zinc-500 text-lg">No applications yet</h3>
                <p className="text-zinc-400 text-sm mt-1">Applications will appear here when candidates apply</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-200">
                {allApplications.slice(0, 10).map((application) => (
                  <div 
                    key={application.id} 
                    className="p-4 hover:bg-zinc-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/applications/${application.id}`)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-base font-medium text-zinc-900">{application.candidate_name}</h4>
                        <p className="text-sm text-zinc-500">{application.job_title}</p>
                      </div>
                      <div>
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          application.status === 'Applied' ? 'bg-zinc-100 text-zinc-800' :
                          application.status === 'Screening' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'Interview' ? 'bg-zinc-200 text-zinc-800' :
                          application.status === 'Offered' ? 'bg-zinc-800 text-white' :
                          application.status === 'Hired' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {application.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      <span className="text-zinc-500">Applied: {new Date(application.applied_at).toLocaleDateString()}</span>
                      <ArrowRight className="h-3 w-3 ml-auto text-zinc-400" strokeWidth={1.5} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {allApplications.length > 10 && (
            <div className="mt-4 text-right">
              <Button variant="link" onClick={() => router.push('/applications')} className="text-zinc-500 hover:text-zinc-900">
                View all {allApplications.length} applications
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="interviews">
          <div className="mb-6 text-center">
            <Calendar className="h-16 w-16 text-zinc-300 mx-auto mb-2" strokeWidth={1.5} />
            <h3 className="text-lg font-medium text-zinc-900">Interview Calendar</h3>
            <p className="text-zinc-500 mt-1 mb-4">Schedule and manage candidate interviews</p>
            <Button onClick={() => router.push('/interviews')}>
              View Interview Calendar
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="offers">
          <div className="mb-6 text-center">
            <Award className="h-16 w-16 text-zinc-300 mx-auto mb-2" strokeWidth={1.5} />
            <h3 className="text-lg font-medium text-zinc-900">Offers Management</h3>
            <p className="text-zinc-500 mt-1 mb-4">Manage job offers and track responses</p>
            <Button onClick={() => router.push('/offers')}>
              View Offers
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
} 
