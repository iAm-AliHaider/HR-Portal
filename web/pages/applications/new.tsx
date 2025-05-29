import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  HStack,
  Card,
  CardBody,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider
} from '@chakra-ui/react';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import { Job } from '../../../packages/types';
import { getJobs } from '../../services/jobs';
import { createApplication } from '../../services/applications';
import { GetServerSideProps } from 'next';


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function NewApplicationPage() {
  const router = useRouter();
  const toast = useToast();
  const { job_id } = router.query;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState(job_id as string || '');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    coverLetter: '',
    resumeUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    yearsOfExperience: '',
    availableStartDate: '',
    expectedSalary: '',
    workLocation: 'hybrid'
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const jobsData = await getJobs('org1');
        const activeJobs = jobsData.filter(job => job.status === 'published');
        setJobs(activeJobs);

        // If job_id is provided in query, select it
        if (job_id) {
          const job = activeJobs.find(j => j.id === job_id);
          if (job) {
            setSelectedJob(job);
            setSelectedJobId(job.id);
          }
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load available jobs.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [job_id, toast]);

  useEffect(() => {
    if (selectedJobId) {
      const job = jobs.find(j => j.id === selectedJobId);
      setSelectedJob(job || null);
    }
  }, [selectedJobId, jobs]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedJobId) {
      toast({
        title: 'Error',
        description: 'Please select a job to apply for.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const applicationData = {
        org_id: 'org1', // Default org ID for now
        job_id: selectedJobId,
        user_id: 'candidate1', // In a real app, this would be from auth
        cv_url: formData.resumeUrl,
        cover_letter_url: formData.coverLetter, // In real app, would upload and get URL
        status: 'new' as const,
        application_date: new Date().toISOString(),
        last_activity_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        // Store candidate info in custom_fields for now
        custom_fields: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          years_of_experience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : 0,
          linkedin_url: formData.linkedinUrl,
          portfolio_url: formData.portfolioUrl,
          available_start_date: formData.availableStartDate,
          expected_salary: formData.expectedSalary,
          work_location_preference: formData.workLocation
        }
      };

      const newApplication = await createApplication(applicationData);

      toast({
        title: 'Application submitted successfully!',
        description: 'We will review your application and get back to you soon.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Redirect to applications list or application detail
      router.push(`/applications/${newApplication.id}`);

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ModernDashboardLayout>
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <Spinner size="lg" />
        </Box>
      </ModernDashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Submit New Application | HR Portal</title>
        <meta name="description" content="Submit a new job application" />
      </Head>

      <ModernDashboardLayout>
        <Box maxWidth="800px" mx="auto" p={6}>
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="lg" mb={2}>Submit New Application</Heading>
              <Text color="gray.600">
                Fill out the form below to apply for a position with our company.
              </Text>
            </Box>

            {jobs.length === 0 && (
              <Alert status="warning">
                <AlertIcon />
                <AlertTitle>No Active Positions</AlertTitle>
                <AlertDescription>
                  There are currently no active job openings available for applications.
                </AlertDescription>
              </Alert>
            )}

            {jobs.length > 0 && (
              <Card>
                <CardBody>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="stretch">
                      {/* Job Selection */}
                      <FormControl isRequired>
                        <FormLabel>Select Position</FormLabel>
                        <Select
                          value={selectedJobId}
                          onChange={(e) => setSelectedJobId(e.target.value)}
                          placeholder="Choose a position to apply for"
                        >
                          {jobs.map((job) => (
                            <option key={job.id} value={job.id}>
                              {job.title} - {job.dept_id} ({job.location})
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      {selectedJob && (
                        <Alert status="info">
                          <AlertIcon />
                          <Box>
                            <AlertTitle>Position: {selectedJob.title}</AlertTitle>
                            <AlertDescription>
                              {selectedJob.description}
                              <br />
                              <strong>Department:</strong> {selectedJob.dept_id} | 
                              <strong> Location:</strong> {selectedJob.location} | 
                              <strong> Type:</strong> {selectedJob.job_type}
                            </AlertDescription>
                          </Box>
                        </Alert>
                      )}

                      <Divider />

                      {/* Personal Information */}
                      <Heading size="md">Personal Information</Heading>
                      
                      <HStack spacing={4}>
                        <FormControl isRequired>
                          <FormLabel>First Name</FormLabel>
                          <Input
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="Enter your first name"
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel>Last Name</FormLabel>
                          <Input
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Enter your last name"
                          />
                        </FormControl>
                      </HStack>

                      <HStack spacing={4}>
                        <FormControl isRequired>
                          <FormLabel>Email</FormLabel>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="your.email@example.com"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Phone</FormLabel>
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+1 (555) 123-4567"
                          />
                        </FormControl>
                      </HStack>

                      <Divider />

                      {/* Professional Information */}
                      <Heading size="md">Professional Information</Heading>

                      <FormControl>
                        <FormLabel>Years of Experience</FormLabel>
                        <Select
                          value={formData.yearsOfExperience}
                          onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                          placeholder="Select years of experience"
                        >
                          <option value="0">Less than 1 year</option>
                          <option value="1">1-2 years</option>
                          <option value="3">3-5 years</option>
                          <option value="6">6-10 years</option>
                          <option value="11">10+ years</option>
                        </Select>
                      </FormControl>

                      <HStack spacing={4}>
                        <FormControl>
                          <FormLabel>Available Start Date</FormLabel>
                          <Input
                            type="date"
                            value={formData.availableStartDate}
                            onChange={(e) => handleInputChange('availableStartDate', e.target.value)}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Expected Salary</FormLabel>
                          <Input
                            value={formData.expectedSalary}
                            onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                            placeholder="e.g. $75,000 - $85,000"
                          />
                        </FormControl>
                      </HStack>

                      <FormControl>
                        <FormLabel>Work Location Preference</FormLabel>
                        <Select
                          value={formData.workLocation}
                          onChange={(e) => handleInputChange('workLocation', e.target.value)}
                        >
                          <option value="remote">Remote</option>
                          <option value="onsite">On-site</option>
                          <option value="hybrid">Hybrid</option>
                        </Select>
                      </FormControl>

                      <Divider />

                      {/* Links and Documents */}
                      <Heading size="md">Links & Documents</Heading>

                      <FormControl>
                        <FormLabel>Resume URL</FormLabel>
                        <Input
                          type="url"
                          value={formData.resumeUrl}
                          onChange={(e) => handleInputChange('resumeUrl', e.target.value)}
                          placeholder="https://drive.google.com/your-resume"
                        />
                      </FormControl>

                      <HStack spacing={4}>
                        <FormControl>
                          <FormLabel>LinkedIn Profile</FormLabel>
                          <Input
                            type="url"
                            value={formData.linkedinUrl}
                            onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                            placeholder="https://linkedin.com/in/yourprofile"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Portfolio URL</FormLabel>
                          <Input
                            type="url"
                            value={formData.portfolioUrl}
                            onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                            placeholder="https://yourportfolio.com"
                          />
                        </FormControl>
                      </HStack>

                      <FormControl>
                        <FormLabel>Cover Letter</FormLabel>
                        <Textarea
                          value={formData.coverLetter}
                          onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                          placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                          rows={6}
                        />
                      </FormControl>

                      <Divider />

                      <HStack spacing={4} justify="flex-end">
                        <Button
                          variant="outline"
                          onClick={() => router.push('/applications')}
                          isDisabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          colorScheme="blue"
                          isLoading={isSubmitting}
                          loadingText="Submitting..."
                        >
                          Submit Application
                        </Button>
                      </HStack>
                    </VStack>
                  </form>
                </CardBody>
              </Card>
            )}
          </VStack>
        </Box>
      </ModernDashboardLayout>
    </>
  );
} 
