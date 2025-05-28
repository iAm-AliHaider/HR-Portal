import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../../../../lib/supabase/client';
import { GetServerSideProps } from 'next';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  salary_range: string;
  closing_date: string;
}

interface CandidateProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  current_company?: string;
  current_position?: string;
  experience_years?: number;
  skills?: string;
  summary?: string;
}


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function JobApplicationPage() {
  const [job, setJob] = useState<Job | null>(null);
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resumeUrl: '',
    portfolioUrl: '',
    availabilityDate: '',
    expectedSalary: '',
    additionalInfo: ''
  });

  const router = useRouter();
  const { id: jobId } = router.query;

  useEffect(() => {
    if (jobId) {
      loadJobAndCheckAuth();
    }
  }, [jobId]);

  const loadJobAndCheckAuth = async () => {
    try {
      // Load job details
      await loadJob();
      
      // Check authentication
      const authResult = await checkAuthentication();
      if (authResult) {
        setIsAuthenticated(true);
        await loadCandidateProfile();
      }
    } catch (error) {
      console.error('Error loading job and auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadJob = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) {
        // Mock job data for development
        const mockJob: Job = {
          id: jobId as string,
          title: 'Senior Software Engineer',
          department: 'Engineering',
          location: 'Remote',
          type: 'Full-time',
          description: 'We are looking for a Senior Software Engineer to join our team and help build amazing products...',
          requirements: 'At least 5 years of experience with modern JavaScript frameworks, strong problem-solving skills, experience with cloud platforms...',
          salary_range: '$120k - $150k',
          closing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
        setJob(mockJob);
      } else {
        setJob(data);
      }
    } catch (error) {
      console.error('Error loading job:', error);
    }
  };

  const checkAuthentication = async () => {
    // Check Supabase session first
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) return session;
    } catch (error) {
      console.error('Supabase session check error:', error);
    }

    // Fall back to local storage for development
    if (process.env.NODE_ENV === 'development') {
      const candidateSession = localStorage.getItem('candidateSession');
      if (candidateSession) {
        const session = JSON.parse(candidateSession);
        if (session.authenticated) {
          return session;
        }
      }
    }

    return null;
  };

  const loadCandidateProfile = async () => {
    // Try to load from Supabase first
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('candidates')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setCandidate(data);
          return;
        }
      }
    } catch (error) {
      console.error('Error loading candidate from Supabase:', error);
    }

    // Fall back to localStorage for development
    if (process.env.NODE_ENV === 'development') {
      const candidateSession = localStorage.getItem('candidateSession');
      if (candidateSession) {
        const session = JSON.parse(candidateSession);
        setCandidate(session.user);
        return;
      }

      const candidateProfile = localStorage.getItem('candidateProfile');
      if (candidateProfile) {
        setCandidate(JSON.parse(candidateProfile));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!isAuthenticated) {
      setError('Please sign in to apply for this position');
      setSubmitting(false);
      return;
    }

    if (!candidate) {
      setError('Candidate profile not found');
      setSubmitting(false);
      return;
    }

    try {
      // Create application
      const application = {
        job_id: jobId,
        candidate_id: candidate.id,
        candidate_name: `${candidate.first_name} ${candidate.last_name}`,
        candidate_email: candidate.email,
        cover_letter: applicationData.coverLetter,
        resume_url: applicationData.resumeUrl,
        portfolio_url: applicationData.portfolioUrl,
        availability_date: applicationData.availabilityDate || null,
        expected_salary: applicationData.expectedSalary,
        additional_info: applicationData.additionalInfo,
        status: 'pending',
        applied_at: new Date().toISOString()
      };

      // Try to submit to Supabase
      const { error } = await supabase
        .from('applications')
        .insert([application]);

      if (error) {
        // For development, simulate success
        if (process.env.NODE_ENV === 'development') {
          console.warn('Application submission failed (dev mode):', error.message);
          // Store application locally
          const existingApplications = JSON.parse(localStorage.getItem('candidateApplications') || '[]');
          existingApplications.push({
            ...application,
            id: `app-${Date.now()}`,
            job_title: job?.title,
            company_name: 'Tech Company'
          });
          localStorage.setItem('candidateApplications', JSON.stringify(existingApplications));
          setSuccess(true);
          return;
        }
        throw error;
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Application submission error:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignInRedirect = () => {
    router.push(`/candidate/login?redirect=${encodeURIComponent(router.asPath)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for could not be found.</p>
          <Link href="/careers" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Application Submitted!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Thank you for applying to <strong>{job.title}</strong>. We'll review your application and get back to you soon.
            </p>
            <div className="mt-6 space-y-3">
              <Link href="/candidate/dashboard" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                View My Applications
              </Link>
              <Link href="/careers" className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Browse More Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Apply for {job.title} | Recruitment Portal</title>
        <meta name="description" content={`Apply for ${job.title} position`} />
      </Head>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/careers" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Apply for {job.title}</h1>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {job.department}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.location}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {job.type}
            </span>
            {job.salary_range && (
              <span className="flex items-center text-green-600 font-medium">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                {job.salary_range}
              </span>
            )}
          </div>
        </div>

        {!isAuthenticated ? (
          /* Sign In Required */
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sign In Required</h3>
            <p className="text-gray-600 mb-6">
              Please sign in to your candidate account to apply for this position.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleSignInRedirect}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700"
              >
                Sign In to Apply
              </button>
              <Link href="/candidate/register" className="w-full block bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 text-center">
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Job Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Job Summary</h2>
              <div className="prose prose-sm text-gray-600">
                <p>{job.description}</p>
                <h4>Requirements:</h4>
                <p>{job.requirements}</p>
              </div>
            </div>

            {/* Application Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Application Details</h2>
              
              {candidate && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Applying as:</h3>
                  <p className="text-gray-700">{candidate.first_name} {candidate.last_name}</p>
                  <p className="text-gray-600">{candidate.email}</p>
                  {candidate.current_position && (
                    <p className="text-gray-600">{candidate.current_position} at {candidate.current_company}</p>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    name="coverLetter"
                    required
                    rows={6}
                    value={applicationData.coverLetter}
                    onChange={handleInputChange}
                    placeholder="Tell us why you're interested in this position and how your skills and experience make you a great fit..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume URL *
                    </label>
                    <input
                      type="url"
                      name="resumeUrl"
                      required
                      value={applicationData.resumeUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/resume.pdf"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Please provide a link to your resume (Google Drive, Dropbox, etc.)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      name="portfolioUrl"
                      value={applicationData.portfolioUrl}
                      onChange={handleInputChange}
                      placeholder="https://yourportfolio.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability Date
                    </label>
                    <input
                      type="date"
                      name="availabilityDate"
                      value={applicationData.availabilityDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Salary
                    </label>
                    <input
                      type="text"
                      name="expectedSalary"
                      value={applicationData.expectedSalary}
                      onChange={handleInputChange}
                      placeholder="e.g., $120k - $140k"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    name="additionalInfo"
                    rows={4}
                    value={applicationData.additionalInfo}
                    onChange={handleInputChange}
                    placeholder="Any additional information you'd like to share..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting Application...' : 'Submit Application'}
                  </button>
                  
                  <Link 
                    href={`/careers/jobs/${jobId}`}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 text-center"
                  >
                    View Job Details
                  </Link>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 