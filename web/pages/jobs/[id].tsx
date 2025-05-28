import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RequireRole } from '@/components/RequireRole';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useJob, useJobApplications, useToast, useModal } from '@/hooks/useApi';
import ShareJobModal from '@/components/jobs/ShareJobModal';

// Application statuses with their colors
const applicationStatusColors = {
  'Applied': 'bg-blue-100 text-blue-800',
  'Phone Screen': 'bg-purple-100 text-purple-800',
  'Interview': 'bg-indigo-100 text-indigo-800',
  'Offered': 'bg-yellow-100 text-yellow-800',
  'Hired': 'bg-green-100 text-green-800',
  'Rejected': 'bg-red-100 text-red-800'
};

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, role } = useAuth();
  const toast = useToast();
  
  // API hooks
  const { job, loading: jobLoading, error: jobError, refetch: refetchJob } = useJob(id as string);
  const { applications, loading: applicationsLoading } = useJobApplications(id as string);
  
  // UI state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  
  // Modals
  const applyModal = useModal();
  const closeJobModal = useModal();
  
  // Get permissions based on role
  const permissions = {
    canEdit: ['admin', 'hr', 'recruiter'].includes(role || ''),
    canDelete: ['admin'].includes(role || ''),
    canReview: ['admin', 'hr', 'recruiter', 'manager'].includes(role || ''),
    canApply: ['employee'].includes(role || '')
  };
  
  // Generate application statistics
  const generateApplicationStats = () => {
    if (!applications) return [];
    
    const statuses = ['Applied', 'Phone Screen', 'Interview', 'Offered', 'Hired', 'Rejected'];
    return statuses.map(status => {
      const count = applications.filter(app => app.status === status).length;
      return {
        name: status,
        value: count,
        color: applicationStatusColors[status as keyof typeof applicationStatusColors]
      };
    });
  };
  
  const applicationStatuses = generateApplicationStats();
  
  // Handle job application
  const handleApply = async () => {
    router.push(`/jobs/${id}/apply`);
  };
  
  // Handle job closing
  const handleCloseJob = async () => {
    try {
      // In real implementation, this would call the closeJob method from the API
      // await closeJob(id as string);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Job closed successfully');
      refetchJob();
      closeJobModal.closeModal();
    } catch (error) {
      toast.error('Failed to close job');
    }
  };
  
  // Loading state
  if (jobLoading || applicationsLoading) {
    return (
      <RequireRole allowed={['admin', 'hr', 'recruiter', 'manager', 'employee']}>
        <DashboardLayout>
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3d91]"></div>
          </div>
        </DashboardLayout>
      </RequireRole>
    );
  }
  
  // Error state
  if (jobError) {
    return (
      <RequireRole allowed={['admin', 'hr', 'recruiter', 'manager', 'employee']}>
        <DashboardLayout>
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Error Loading Job</h1>
            <p className="text-gray-600 mb-6">There was an error loading the job details: {jobError}</p>
            <Link href="/jobs">
              <Button>Back to Jobs</Button>
            </Link>
          </div>
        </DashboardLayout>
      </RequireRole>
    );
  }
  
  // Not found state
  if (!job) {
    return (
      <RequireRole allowed={['admin', 'hr', 'recruiter', 'manager', 'employee']}>
        <DashboardLayout>
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
            <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
            <Link href="/jobs">
              <Button>Back to Jobs</Button>
            </Link>
          </div>
        </DashboardLayout>
      </RequireRole>
    );
  }
  
  return (
    <RequireRole allowed={['admin', 'hr', 'recruiter', 'manager', 'employee']}>
      <DashboardLayout title={job.title} subtitle={`${job.department} · ${job.location}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic info card */}
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-2xl">{job.title}</CardTitle>
                    <div className="flex items-center mt-2 text-gray-600 text-sm space-x-4">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {job.department}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.type}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status === 'open' ? 'Open' : 'Closed'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-gray-500">Salary Range</div>
                    <div className="font-medium mt-1">{job.salary_range}</div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-gray-500">Date Posted</div>
                    <div className="font-medium mt-1">{new Date(job.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-gray-500">Expires</div>
                    <div className="font-medium mt-1">{new Date(job.closing_date).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-2">About the Role</h3>
                  <p className="mb-4">{job.description}</p>
                  
                  <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                  <div className="mb-4" dangerouslySetInnerHTML={{ __html: job.requirements }} />
                  
                  {job.benefits && (
                    <>
                      <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                      <div className="mb-4" dangerouslySetInnerHTML={{ __html: job.benefits }} />
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex flex-wrap gap-3">
                {permissions.canApply && job.status === 'open' && (
                  <Button onClick={handleApply} className="bg-blue-600 hover:bg-blue-700">
                    Apply for this job
                  </Button>
                )}
                
                <Button onClick={() => setShareModalOpen(true)} variant="outline">
                  Share Job
                </Button>
                
                {permissions.canEdit && (
                  <Button onClick={() => router.push(`/jobs/${job.id}/edit`)} variant="outline">
                    Edit Job
                  </Button>
                )}
                
                {permissions.canEdit && job.status === 'open' && (
                  <Button 
                    onClick={() => closeJobModal.openModal()} 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Close Job
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply CTA for small screens */}
            {permissions.canApply && job.status === 'open' && (
              <Card className="lg:hidden">
                <CardContent className="pt-6">
                  <Button onClick={handleApply} className="w-full bg-blue-600 hover:bg-blue-700">
                    Apply for this job
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Applications stats - visible only to appropriate roles */}
            {permissions.canReview && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applicationStatuses.map((status) => (
                      <div key={status.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-2 ${status.color.split(' ')[0]}`}></span>
                          <span>{status.name}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${status.color}`}>{status.value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      onClick={() => router.push(`/applications?jobId=${job.id}`)} 
                      className="w-full"
                      variant="outline"
                    >
                      View All Applications
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Similar jobs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Similar Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">Other open positions you might be interested in</p>
                
                <div className="space-y-4">
                  {/* We would fetch similar jobs here - for now showing sample */}
                  <div className="border rounded-lg p-3 hover:border-blue-300 transition-colors cursor-pointer">
                    <h3 className="font-medium">Frontend Developer</h3>
                    <div className="text-sm text-gray-500">Engineering · San Francisco</div>
                  </div>
                  
                  <div className="border rounded-lg p-3 hover:border-blue-300 transition-colors cursor-pointer">
                    <h3 className="font-medium">UX Designer</h3>
                    <div className="text-sm text-gray-500">Design · Remote</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Share Job Modal */}
        <ShareJobModal 
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          job={{
            id: job.id,
            title: job.title,
            department: job.department,
            location: job.location
          }}
        />
        
        {/* Close Job Modal */}
        {closeJobModal.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h2 className="text-xl font-bold mb-4">Close Job</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to close this job posting? It will no longer appear in search results and no new applications will be accepted.</p>
              
              <div className="flex justify-end space-x-3">
                <Button onClick={() => closeJobModal.closeModal()} variant="outline">Cancel</Button>
                <Button onClick={handleCloseJob} className="bg-red-600 hover:bg-red-700">Close Job</Button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </RequireRole>
  );
} 