import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase/client';

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

interface Application {
  id: string;
  job_id: string;
  job_title: string;
  company_name: string;
  status: string;
  applied_at: string;
  last_updated: string;
}

export default function CandidateDashboard() {
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      // Check authentication
      const session = await checkAuthentication();
      if (!session) {
        router.push('/candidate/login?redirect=/candidate/dashboard');
        return;
      }

      // Load candidate data
      await loadCandidateData();
      await loadApplications();
      await loadRecentJobs();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
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

  const loadCandidateData = async () => {
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

  const loadApplications = async () => {
    // Mock applications for development
    const mockApplications: Application[] = [
      {
        id: '1',
        job_id: '1',
        job_title: 'Senior Software Engineer',
        company_name: 'Tech Company',
        status: 'under_review',
        applied_at: '2024-01-15T10:00:00Z',
        last_updated: '2024-01-16T14:30:00Z'
      },
      {
        id: '2',
        job_id: '2',
        job_title: 'Product Designer',
        company_name: 'Design Studio',
        status: 'interview_scheduled',
        applied_at: '2024-01-10T09:00:00Z',
        last_updated: '2024-01-18T11:00:00Z'
      }
    ];

    // Try to load real applications from Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            jobs(title, company)
          `)
          .eq('candidate_id', user.id)
          .order('applied_at', { ascending: false });

        if (!error && data) {
          setApplications(data.map(app => ({
            id: app.id,
            job_id: app.job_id,
            job_title: app.jobs?.title || 'Unknown Position',
            company_name: app.jobs?.company || 'Company',
            status: app.status,
            applied_at: app.applied_at,
            last_updated: app.updated_at
          })));
          return;
        }
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    }

    // Use mock data for development
    setApplications(mockApplications);
  };

  const loadRecentJobs = async () => {
    // Mock recent jobs
    const mockJobs = [
      {
        id: '3',
        title: 'DevOps Engineer',
        company: 'Cloud Corp',
        location: 'Remote',
        salary_range: '$110k - $140k',
        posted_days_ago: 2
      },
      {
        id: '4',
        title: 'Frontend Developer',
        company: 'Startup Inc',
        location: 'San Francisco',
        salary_range: '$95k - $125k',
        posted_days_ago: 5
      }
    ];

    setRecentJobs(mockJobs);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'interview_scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'offer_extended':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'under_review':
        return 'Under Review';
      case 'interview_scheduled':
        return 'Interview Scheduled';
      case 'offer_extended':
        return 'Offer Extended';
      case 'rejected':
        return 'Not Selected';
      default:
        return status;
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('candidateSession');
      localStorage.removeItem('candidateProfile');
      router.push('/careers');
    } catch (error) {
      console.error('Sign out error:', error);
      // Force redirect even if sign out fails
      router.push('/careers');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
          <Link href="/candidate/login" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard | Candidate Portal</title>
        <meta name="description" content="Manage your job applications and profile" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white text-sm font-bold mr-3">
                C
              </div>
              <h1 className="text-xl font-bold text-gray-900">Candidate Portal</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/careers" className="text-gray-600 hover:text-gray-900">
                Browse Jobs
              </Link>
              <div className="relative">
                <button 
                  onClick={handleSignOut}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <span className="mr-2">{candidate.first_name} {candidate.last_name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {candidate.first_name}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your job search</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Applications ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">In Review</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {applications.filter(app => app.status === 'under_review' || app.status === 'interview_scheduled').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 8l-2-2 1.5-1.5L14 18l6-6z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Interviews</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {applications.filter(app => app.status === 'interview_scheduled').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Applications</h3>
              </div>
              <div className="p-6">
                {applications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No applications yet</p>
                    <Link href="/careers" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      Browse Jobs
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.slice(0, 3).map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{application.job_title}</h4>
                          <p className="text-sm text-gray-600">{application.company_name}</p>
                          <p className="text-xs text-gray-500">Applied {new Date(application.applied_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Jobs */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recommended for You</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div>
                        <h4 className="font-medium text-gray-900">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                        <p className="text-sm text-green-600 font-medium">{job.salary_range}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-gray-500">{job.posted_days_ago}d ago</span>
                        <Link href={`/careers/jobs/${job.id}/apply`} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                          Apply
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">All Applications</h3>
            </div>
            <div className="p-6">
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by applying to your first job.</p>
                  <div className="mt-6">
                    <Link href="/careers" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      Browse Jobs
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{application.job_title}</h4>
                          <p className="text-gray-600">{application.company_name}</p>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            <span>Applied: {new Date(application.applied_at).toLocaleDateString()}</span>
                            <span>Updated: {new Date(application.last_updated).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                            {getStatusText(application.status)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-3">
                        <Link href={`/careers/jobs/${application.job_id}`} className="text-blue-600 hover:text-blue-500 text-sm">
                          View Job
                        </Link>
                        <Link href={`/candidate/applications/${application.id}`} className="text-blue-600 hover:text-blue-500 text-sm">
                          View Application
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <p className="text-gray-900">{candidate.first_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <p className="text-gray-900">{candidate.last_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{candidate.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{candidate.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Company</label>
                  <p className="text-gray-900">{candidate.current_company || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Position</label>
                  <p className="text-gray-900">{candidate.current_position || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <p className="text-gray-900">{candidate.experience_years ? `${candidate.experience_years} years` : 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  <p className="text-gray-900">{candidate.skills || 'Not provided'}</p>
                </div>
                {candidate.summary && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                    <p className="text-gray-900">{candidate.summary}</p>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <Link href="/candidate/profile/edit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
