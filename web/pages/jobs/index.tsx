import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import { ModernRequireRole } from '@/components/ModernRequireRole';
import { 
  useJobs, 
  useApplications,
  useToast, 
  useForm, 
  useModal, 
  usePagination, 
  useSearch 
} from '../../hooks/useApi';
import JobFilters, { JobFilterValues } from '@/components/jobs/JobFilters';
import { GetServerSideProps } from 'next';

// Job form interface
interface JobForm {
  title: string;
  department: string;
  location: string;
  type: string;
  salary_range: string;
  description: string;
  requirements: string;
  closing_date: string;
}

// Filter options for job listings
const departmentOptions = [
  { id: 'engineering', label: 'Engineering' },
  { id: 'design', label: 'Design' },
  { id: 'product', label: 'Product' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'sales', label: 'Sales' },
  { id: 'finance', label: 'Finance' },
  { id: 'hr', label: 'Human Resources' },
  { id: 'operations', label: 'Operations' }
];

const locationOptions = [
  { id: 'san-francisco', label: 'San Francisco, CA' },
  { id: 'new-york', label: 'New York, NY' },
  { id: 'london', label: 'London, UK' },
  { id: 'berlin', label: 'Berlin, Germany' },
  { id: 'remote', label: 'Remote' }
];

const typeOptions = [
  { id: 'full-time', label: 'Full-time' },
  { id: 'part-time', label: 'Part-time' },
  { id: 'contract', label: 'Contract' },
  { id: 'internship', label: 'Internship' }
];


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function JobsPage() {
  const router = useRouter();
  const toast = useToast();
  
  // API hooks
  const { 
    jobs, 
    loading, 
    error, 
    createJob, 
    updateJob, 
    closeJob 
  } = useJobs();
  
  const { applications } = useApplications();

  // UI state
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modals
  const addModal = useModal();
  const editModal = useModal();
  const closeModal = useModal();

  // Search and pagination
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(
    jobs, 
    ['title', 'department', 'location', 'type']
  );
  const { currentItems, currentPage, totalPages, goToPage, hasNext, hasPrev, nextPage, prevPage } = 
    usePagination(filteredItems, 9);

  // Form management
  const form = useForm<JobForm>({
    title: '',
    department: '',
    location: '',
    type: '',
    salary_range: '',
    description: '',
    requirements: '',
    closing_date: ''
  });

  // State for filtered jobs
  const [filteredJobs, setFilteredJobs] = useState(jobs || []);
  const [activeFilters, setActiveFilters] = useState<JobFilterValues>({
    search: '',
    departments: [],
    locations: [],
    types: [],
    datePosted: ''
  });
  
  // Apply filters when jobs data changes
  useEffect(() => {
    if (jobs) {
      applyFilters(activeFilters);
    }
  }, [jobs]);
  
  // Handle filter changes
  const handleFilterChange = (filters: JobFilterValues) => {
    setActiveFilters(filters);
    applyFilters(filters);
  };
  
  // Apply filters to jobs data
  const applyFilters = (filters: JobFilterValues) => {
    if (!jobs) return;
    
    let results = [...jobs];
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchTerm) || 
        job.department.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by departments
    if (filters.departments.length > 0) {
      results = results.filter(job => {
        const jobDepartment = job.department.toLowerCase().replace(/\s+/g, '-');
        return filters.departments.some(dept => 
          jobDepartment === dept || 
          dept === departmentOptions.find(d => 
            d.label.toLowerCase() === job.department.toLowerCase()
          )?.id
        );
      });
    }
    
    // Filter by locations
    if (filters.locations.length > 0) {
      results = results.filter(job => {
        const jobLocation = job.location.toLowerCase().replace(/\s+/g, '-');
        return filters.locations.some(loc => 
          jobLocation === loc || 
          jobLocation.includes(loc) ||
          loc === locationOptions.find(l => 
            l.label.toLowerCase().includes(job.location.toLowerCase())
          )?.id
        );
      });
    }
    
    // Filter by job types
    if (filters.types.length > 0) {
      results = results.filter(job => {
        const jobType = job.type.toLowerCase().replace(/\s+/g, '-');
        return filters.types.some(type => 
          jobType === type || 
          type === typeOptions.find(t => 
            t.label.toLowerCase() === job.type.toLowerCase()
          )?.id
        );
      });
    }
    
    // Filter by date posted
    if (filters.datePosted) {
      const now = new Date();
      let cutoffDate: Date;
      
      switch (filters.datePosted) {
        case 'today':
          cutoffDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          cutoffDate = new Date(now);
          cutoffDate.setDate(cutoffDate.getDate() - 7);
          break;
        case 'month':
          cutoffDate = new Date(now);
          cutoffDate.setMonth(cutoffDate.getMonth() - 1);
          break;
        default:
          cutoffDate = new Date(0); // Beginning of time
      }
      
      results = results.filter(job => {
        const jobDate = new Date(job.created_at);
        return jobDate >= cutoffDate;
      });
    }
    
    setFilteredJobs(results);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    let hasErrors = false;
    
    if (!form.values.title) {
      form.setError('title', 'Job title is required');
      hasErrors = true;
    }
    
    if (!form.values.department) {
      form.setError('department', 'Department is required');
      hasErrors = true;
    }
    
    if (!form.values.description) {
      form.setError('description', 'Job description is required');
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsSubmitting(true);
    
    try {
      if (editModal.isOpen && selectedJob) {
        // Update existing job
        await updateJob(selectedJob.id, form.values);
        toast.success('Job updated successfully!');
        editModal.closeModal();
      } else {
        // Create new job
        await createJob(form.values);
        toast.success('Job created successfully!');
        addModal.closeModal();
      }
      
      form.reset();
      setSelectedJob(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save job');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (job: any) => {
    setSelectedJob(job);
    // Set form values individually
    form.setValue('title', job.title);
    form.setValue('department', job.department);
    form.setValue('location', job.location);
    form.setValue('type', job.type);
    form.setValue('salary_range', job.salary_range);
    form.setValue('description', job.description);
    form.setValue('requirements', job.requirements);
    form.setValue('closing_date', job.closing_date);
    editModal.openModal();
  };

  // Handle close job
  const handleCloseJob = async () => {
    if (!selectedJob) return;
    
    setIsSubmitting(true);
    try {
      await closeJob(selectedJob.id);
      toast.success('Job closed successfully!');
      closeModal.closeModal();
      setSelectedJob(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to close job');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate statistics
  const stats = {
    total: jobs.length,
    open: jobs.filter(job => job.status === 'open').length,
    closed: jobs.filter(job => job.status === 'closed').length,
    totalApplications: applications.length
  };

  const departments = ['Engineering', 'HR', 'Marketing', 'Finance', 'Sales', 'Design', 'Support'];
  const locations = ['New York', 'San Francisco', 'Chicago', 'Remote', 'Los Angeles'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'];

  if (loading) {
    return (
      <ModernDashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </ModernDashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Jobs | HR System</title>
        <meta name="description" content="View and manage job listings" />
      </Head>
      
      <ModernDashboardLayout 
          title="Job Openings" 
          subtitle="Browse current opportunities"
          actions={
            <Link href="/jobs/new">
              <Button className="bg-blue-600 hover:bg-blue-700">Post a Job</Button>
            </Link>
          }
        >
          <div className="space-y-6">
            {/* Job filters */}
            <JobFilters 
              onFilterChange={handleFilterChange}
              departments={departmentOptions}
              locations={locationOptions}
              types={typeOptions}
            />
            
            {/* Loading state */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {/* Error state */}
            {error && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-2">Error Loading Jobs</h2>
                <p className="text-gray-600">{error}</p>
              </div>
            )}
            
            {/* No results state */}
            {!loading && !error && filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-600 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-2">No Jobs Found</h2>
                <p className="text-gray-600 mb-6">No jobs match your current filters. Try adjusting your search criteria.</p>
                <Button onClick={() => handleFilterChange({
                  search: '',
                  departments: [],
                  locations: [],
                  types: [],
                  datePosted: ''
                })} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
            
            {/* Job listings */}
            {!loading && !error && filteredJobs.length > 0 && (
              <div>
                <div className="text-sm text-gray-500 mb-4">
                  Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
                  {activeFilters.search && ` for "${activeFilters.search}"`}
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {filteredJobs.map((job) => (
                    <Card key={job.id} className="hover:border-blue-300 transition-colors">
                      <CardContent className="p-0">
                        <Link href={`/jobs/${job.id}`} className="block p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h2 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h2>
                              <div className="flex flex-wrap items-center text-sm text-gray-600 gap-x-4 gap-y-2 mb-2">
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {job.salary_range}
                                </div>
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {job.type}
                                </div>
                              </div>
                              <p className="text-gray-600 line-clamp-2">{job.description}</p>
                            </div>
                            
                            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col md:items-end">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              } mb-2`}>
                                {job.status === 'open' ? 'Open' : 'Closed'}
                              </span>
                              <div className="text-sm text-gray-500">
                                Posted {new Date(job.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ModernDashboardLayout>
    </>
  );
} 
