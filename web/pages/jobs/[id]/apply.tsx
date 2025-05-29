import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import { useJob, useToast, useForm, useApplications } from '@/hooks/useApi';
import { RequireRole } from '@/components/RequireRole';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { GetServerSideProps } from 'next';


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function JobApplicationPage() {
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();
  const { user } = useAuth();
  
  // File uploads
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  
  // API hooks
  const { job, loading: jobLoading, error: jobError } = useJob(id as string);
  const { createApplication } = useApplications();
  
  // Form state
  const form = useForm({
    full_name: user?.name || '',
    email: user?.email || '',
    phone: '',
    cover_letter: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    current_company: '',
    current_position: '',
    years_of_experience: '',
    hear_about_us: '',
    availability_date: '',
    salary_expectation: '',
    additional_info: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle resume upload
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Resume file size must be less than 5MB');
        return;
      }
      setResumeFile(file);
    }
  };
  
  // Handle cover letter upload
  const handleCoverLetterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Cover letter file size must be less than 5MB');
        return;
      }
      setCoverLetterFile(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    let hasErrors = false;
    
    if (!form.values.full_name) {
      form.setError('full_name', 'Full name is required');
      hasErrors = true;
    }
    
    if (!form.values.email) {
      form.setError('email', 'Email is required');
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(form.values.email)) {
      form.setError('email', 'Please enter a valid email address');
      hasErrors = true;
    }
    
    if (!form.values.phone) {
      form.setError('phone', 'Phone number is required');
      hasErrors = true;
    }
    
    if (!resumeFile) {
      toast.error('Please upload your resume');
      hasErrors = true;
    }
    
    if (hasErrors) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, we would upload the files and get their URLs
      // For now, we'll simulate that
      const resumeUrl = 'https://example.com/resume.pdf';
      const coverLetterUrl = coverLetterFile ? 'https://example.com/cover-letter.pdf' : '';
      
      // Create application
      const applicationData = {
        job_id: id as string,
        job_title: job?.title,
        candidate_name: form.values.full_name,
        candidate_email: form.values.email,
        candidate_phone: form.values.phone,
        cover_letter: form.values.cover_letter,
        resume_url: resumeUrl,
        cover_letter_url: coverLetterUrl,
        linkedin_url: form.values.linkedin_url,
        github_url: form.values.github_url,
        portfolio_url: form.values.portfolio_url,
        current_company: form.values.current_company,
        current_position: form.values.current_position,
        years_of_experience: form.values.years_of_experience,
        status: 'Applied',
        applied_date: new Date().toISOString(),
        additional_info: form.values.additional_info,
        salary_expectation: form.values.salary_expectation,
      };
      
      await createApplication(applicationData);
      
      toast.success('Application submitted successfully!');
      router.push('/jobs/application-success');
    } catch (error) {
      toast.error('Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Loading state
  if (jobLoading) {
    return (
      <RequireRole allowed={['employee', 'manager', 'candidate']}>
        <ModernDashboardLayout>
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </ModernDashboardLayout>
      </RequireRole>
    );
  }
  
  // Error state
  if (jobError) {
    return (
      <RequireRole allowed={['employee', 'manager', 'candidate']}>
        <ModernDashboardLayout>
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Error Loading Job</h1>
            <p className="text-gray-600 mb-6">{jobError}</p>
            <Link href="/jobs">
              <Button>Back to Jobs</Button>
            </Link>
          </div>
        </ModernDashboardLayout>
      </RequireRole>
    );
  }
  
  // Not found state
  if (!job) {
    return (
      <RequireRole allowed={['employee', 'manager', 'candidate']}>
        <ModernDashboardLayout>
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
            <p className="text-gray-600 mb-6">The job you're trying to apply for doesn't exist or has been removed.</p>
            <Link href="/jobs">
              <Button>Back to Jobs</Button>
            </Link>
          </div>
        </ModernDashboardLayout>
      </RequireRole>
    );
  }
  
  // Job is closed
  if (job.status !== 'open') {
    return (
      <RequireRole allowed={['employee', 'manager', 'candidate']}>
        <ModernDashboardLayout>
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Job Closed</h1>
            <p className="text-gray-600 mb-6">This job posting is no longer accepting applications.</p>
            <Link href="/jobs">
              <Button>View Other Jobs</Button>
            </Link>
          </div>
        </ModernDashboardLayout>
      </RequireRole>
    );
  }
  
  return (
    <RequireRole allowed={['employee', 'manager', 'candidate']}>
      <Head>
        <title>Apply for {job.title} | HR Portal</title>
        <meta name="description" content={`Apply for ${job.title} position`} />
      </Head>
      
      <ModernDashboardLayout title={`Apply for ${job.title}`} subtitle={`${job.department} · ${job.location}`}>
        <div className="max-w-4xl mx-auto mb-10">
          <div className="mb-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Take your time to fill out this application carefully. You cannot edit it after submission.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-2">{job.title}</h2>
              <div className="flex flex-wrap text-sm text-gray-600 gap-3 mb-4">
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
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.salary_range}
                </div>
              </div>
              
              <Link href={`/jobs/${id}`}>
                <Button variant="outline" size="sm">View Full Job Description</Button>
              </Link>
            </div>
          </div>
          
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Application Form</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        className={`w-full border ${form.errors.full_name ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                        value={form.values.full_name}
                        onChange={(e) => form.setValue('full_name', e.target.value)}
                      />
                      {form.errors.full_name && (
                        <p className="mt-1 text-sm text-red-600">{form.errors.full_name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        className={`w-full border ${form.errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                        value={form.values.email}
                        onChange={(e) => form.setValue('email', e.target.value)}
                      />
                      {form.errors.email && (
                        <p className="mt-1 text-sm text-red-600">{form.errors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      className={`w-full border ${form.errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                      placeholder="+1 (555) 123-4567"
                      value={form.values.phone}
                      onChange={(e) => form.setValue('phone', e.target.value)}
                    />
                    {form.errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{form.errors.phone}</p>
                    )}
                  </div>
                </div>
                
                {/* Resume and Cover Letter */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Resume & Cover Letter</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF, DOCX) *</label>
                      <div className={`border ${!resumeFile ? 'border-red-300' : 'border-gray-300'} border-dashed rounded-md px-3 py-4`}>
                        <div className="text-center">
                          <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <div className="mt-1 text-sm text-gray-600">
                            <label htmlFor="resume-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                              <span>Upload a file</span>
                              <input 
                                id="resume-upload" 
                                name="resume" 
                                type="file" 
                                className="sr-only" 
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeUpload}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PDF or DOCX up to 5MB</p>
                        </div>
                        
                        {resumeFile && (
                          <div className="mt-2 text-center text-sm text-gray-600">
                            Selected file: {resumeFile.name}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (Optional)</label>
                      <div className="border border-gray-300 border-dashed rounded-md px-3 py-4">
                        <div className="text-center">
                          <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <div className="mt-1 text-sm text-gray-600">
                            <label htmlFor="cover-letter-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                              <span>Upload a file</span>
                              <input 
                                id="cover-letter-upload" 
                                name="cover-letter" 
                                type="file" 
                                className="sr-only" 
                                accept=".pdf,.doc,.docx"
                                onChange={handleCoverLetterUpload}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PDF or DOCX up to 5MB</p>
                        </div>
                        
                        {coverLetterFile && (
                          <div className="mt-2 text-center text-sm text-gray-600">
                            Selected file: {coverLetterFile.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter Text (Optional if uploading a file)</label>
                    <textarea
                      className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
                      placeholder="Write your cover letter here or upload a file above"
                      value={form.values.cover_letter}
                      onChange={(e) => form.setValue('cover_letter', e.target.value)}
                    ></textarea>
                  </div>
                </div>
                
                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Professional Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Company</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={form.values.current_company}
                        onChange={(e) => form.setValue('current_company', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Position</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={form.values.current_position}
                        onChange={(e) => form.setValue('current_position', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                      <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={form.values.years_of_experience}
                        onChange={(e) => form.setValue('years_of_experience', e.target.value)}
                      >
                        <option value="">Select Experience</option>
                        <option value="0-1">Less than 1 year</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Earliest Start Date</label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={form.values.availability_date}
                        onChange={(e) => form.setValue('availability_date', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Expectation</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="e.g. $80,000 - $100,000 per year"
                      value={form.values.salary_expectation}
                      onChange={(e) => form.setValue('salary_expectation', e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Online Presence */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Online Presence</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
                      <input
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={form.values.linkedin_url}
                        onChange={(e) => form.setValue('linkedin_url', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Profile</label>
                      <input
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="https://github.com/yourusername"
                        value={form.values.github_url}
                        onChange={(e) => form.setValue('github_url', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio / Personal Website</label>
                      <input
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="https://yourwebsite.com"
                        value={form.values.portfolio_url}
                        onChange={(e) => form.setValue('portfolio_url', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Additional Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
                      <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={form.values.hear_about_us}
                        onChange={(e) => form.setValue('hear_about_us', e.target.value)}
                      >
                        <option value="">Select option</option>
                        <option value="Job Board">Job Board</option>
                        <option value="Company Website">Company Website</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Referral">Employee Referral</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Event">Event or Career Fair</option>
                        <option value="Search">Web Search</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                      <textarea
                        className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
                        placeholder="Anything else you'd like us to know about your application"
                        value={form.values.additional_info}
                        onChange={(e) => form.setValue('additional_info', e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center">
                <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                  <p>Fields marked with * are required</p>
                </div>
                
                <div className="space-x-3 w-full sm:w-auto flex flex-col sm:flex-row">
                  <Link href={`/jobs/${id}`} className="w-full sm:w-auto mb-3 sm:mb-0">
                    <Button type="button" variant="outline" className="w-full">Cancel</Button>
                  </Link>
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </ModernDashboardLayout>
    </RequireRole>
  );
} 