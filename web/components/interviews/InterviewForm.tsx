import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Heading,
  FormErrorMessage,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Grid,
  GridItem,
  Divider,
  useToast,
  Flex,
  Text,
  Badge,
  HStack,
  RadioGroup,
  Radio
} from '@chakra-ui/react';
import { Interview, Application, User } from '../../../packages/types';
import { getApplicationById, getCandidateById } from '../../services/applications';
import { getInterviewById, scheduleInterview, updateInterview } from '../../services/interviews';

interface InterviewFormProps {
  interviewId?: string;
  applicationId?: string;
  onSave?: (interview: Interview) => void;
}

const InterviewForm = ({ interviewId, applicationId, onSave }: InterviewFormProps) => {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!!interviewId);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [application, setApplication] = useState<Application | null>(null);
  const [candidate, setCandidate] = useState<User | null>(null);
  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [dateTimeLocal, setDateTimeLocal] = useState('');

  const [interview, setInterview] = useState<Partial<Interview>>({
    title: '',
    description: '',
    type: 'video',
    interviewer_ids: [],
    duration: 60,
    location: '',
    meeting_url: '',
    status: 'scheduled',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // In a real app, we would fetch interviewers here
        // For now, just set some mock users
        setUserOptions([
          { id: 'user1', full_name: 'John Doe', role: 'hr' } as User,
          { id: 'user2', full_name: 'Jane Smith', role: 'manager' } as User,
          { id: 'user3', full_name: 'Bob Johnson', role: 'engineer' } as User
        ]);

        if (interviewId) {
          // Fetch existing interview data
          const interviewData = await getInterviewById(interviewId);
          if (interviewData) {
            setInterview(interviewData);
            
            // Set the date-time input value
            if (interviewData.scheduled_at) {
              const scheduledDate = new Date(interviewData.scheduled_at);
              setDateTimeLocal(formatDateForInput(scheduledDate));
            }
            
            // Fetch application if not provided
            if (!applicationId && interviewData.application_id) {
              const appData = await getApplicationById(interviewData.application_id);
              setApplication(appData);
              
              // Fetch candidate data
              if (appData?.user_id) {
                const candidateData = await getCandidateById(appData.user_id);
                setCandidate(candidateData);
              }
            }
          } else {
            toast({
              title: 'Error',
              description: 'Interview not found',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            router.push('/interviews');
          }
        } else if (applicationId) {
          // Fetch application data for new interview
          const appData = await getApplicationById(applicationId);
          if (appData) {
            setApplication(appData);
            setInterview(prev => ({
              ...prev,
              application_id: applicationId,
              org_id: appData.org_id
            }));
            
            // Fetch candidate data
            if (appData.user_id) {
              const candidateData = await getCandidateById(appData.user_id);
              setCandidate(candidateData);
            }
          } else {
            toast({
              title: 'Error',
              description: 'Application not found',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            router.push('/applications');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [interviewId, applicationId, router, toast]);

  const formatDateForInput = (date: Date): string => {
    // Format: YYYY-MM-DDThh:mm
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInterview(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateTimeLocal(value);
    
    // Convert to ISO string for the interview object
    if (value) {
      const date = new Date(value);
      setInterview(prev => ({ ...prev, scheduled_at: date.toISOString() }));
    } else {
      setInterview(prev => ({ ...prev, scheduled_at: undefined }));
    }
  };

  const handleNumberChange = (name: string, value: number) => {
    setInterview(prev => ({ ...prev, [name]: value }));
  };

  const handleInterviewerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedInterviewers = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedInterviewers.push(options[i].value);
      }
    }
    
    setInterview(prev => ({ ...prev, interviewer_ids: selectedInterviewers }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!interview.title) newErrors.title = 'Title is required';
    if (!interview.type) newErrors.type = 'Interview type is required';
    if (!interview.scheduled_at) newErrors.scheduled_at = 'Schedule date and time are required';
    if (!interview.interviewer_ids?.length) newErrors.interviewer_ids = 'At least one interviewer is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      let savedInterview;
      if (isEditing) {
        savedInterview = await updateInterview(interviewId!, interview);
        toast({
          title: 'Interview Updated',
          description: 'The interview has been updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Make sure application_id is set
        if (!interview.application_id && application) {
          interview.application_id = application.id;
        }
        
        // Make sure org_id is set
        if (!interview.org_id && application) {
          interview.org_id = application.org_id;
        }
        
        savedInterview = await scheduleInterview(interview);
        toast({
          title: 'Interview Scheduled',
          description: 'The interview has been scheduled successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      if (onSave) {
        onSave(savedInterview);
      } else {
        // Navigate to application detail page
        router.push(`/applications/${savedInterview.application_id}`);
      }
    } catch (error) {
      console.error('Error saving interview:', error);
      toast({
        title: 'Error',
        description: isEditing ? 'Failed to update interview' : 'Failed to schedule interview',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={8}>
        {/* Candidate Information (if available) */}
        {candidate && (
          <Box mb={4}>
            <Heading size="sm" mb={2}>Candidate</Heading>
            <Flex 
              border="1px" 
              borderColor="gray.200" 
              borderRadius="md" 
              p={4}
              direction={{ base: 'column', sm: 'row' }}
              justify="space-between"
              align={{ base: 'flex-start', sm: 'center' }}
              gap={4}
            >
              <Box>
                <Text fontWeight="bold">{candidate.full_name}</Text>
                <Text fontSize="sm" color="gray.600">{candidate.email}</Text>
                {application && (
                  <HStack mt={1}>
                    <Badge colorScheme="blue">{application.status}</Badge>
                    <Text fontSize="xs">Applied for: Job #{application.job_id}</Text>
                  </HStack>
                )}
              </Box>
              <Button 
                size="sm" 
                colorScheme="blue" 
                variant="outline"
                onClick={() => router.push(`/applications/${application?.id}`)}
              >
                View Application
              </Button>
            </Flex>
          </Box>
        )}

        {/* Interview Details */}
        <Box>
          <Heading size="md" mb={4}>Interview Details</Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <FormControl isRequired isInvalid={!!errors.title}>
                <FormLabel>Interview Title</FormLabel>
                <Input
                  name="title"
                  value={interview.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Technical Interview, HR Screening, etc."
                />
                <FormErrorMessage>{errors.title}</FormErrorMessage>
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl isRequired isInvalid={!!errors.type}>
                <FormLabel>Interview Type</FormLabel>
                <Select
                  name="type"
                  value={interview.type}
                  onChange={handleInputChange}
                >
                  <option value="">Select interview type</option>
                  <option value="phone">Phone</option>
                  <option value="video">Video</option>
                  <option value="in_person">In Person</option>
                  <option value="technical">Technical</option>
                  <option value="panel">Panel</option>
                </Select>
                <FormErrorMessage>{errors.type}</FormErrorMessage>
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  name="status"
                  value={interview.status}
                  onChange={handleInputChange}
                  isDisabled={!isEditing} // Only allow changing status when editing
                >
                  <option value="">Select status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rescheduled">Rescheduled</option>
                  <option value="no_show">No Show</option>
                </Select>
              </FormControl>
            </GridItem>
            
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={interview.description || ''}
                  onChange={handleInputChange}
                  placeholder="Brief description of the interview"
                  rows={3}
                />
              </FormControl>
            </GridItem>
          </Grid>
        </Box>
        
        <Divider />
        
        {/* Schedule */}
        <Box>
          <Heading size="md" mb={4}>Schedule</Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl isRequired isInvalid={!!errors.scheduled_at}>
                <FormLabel>Date and Time</FormLabel>
                <Input
                  type="datetime-local"
                  value={dateTimeLocal}
                  onChange={handleDateTimeChange}
                />
                <FormErrorMessage>{errors.scheduled_at}</FormErrorMessage>
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>Duration (minutes)</FormLabel>
                <NumberInput
                  min={15}
                  step={15}
                  value={interview.duration || 60}
                  onChange={(_, value) => handleNumberChange('duration', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>Location</FormLabel>
                <RadioGroup
                  value={interview.location ? 'in_person' : 'remote'}
                  onChange={(value) => {
                    if (value === 'in_person') {
                      setInterview(prev => ({ 
                        ...prev, 
                        location: prev.location || 'Office', 
                        meeting_url: '' 
                      }));
                    } else {
                      setInterview(prev => ({ 
                        ...prev, 
                        location: '', 
                        meeting_url: prev.meeting_url || '' 
                      }));
                    }
                  }}
                >
                  <Stack direction="row">
                    <Radio value="remote">Remote</Radio>
                    <Radio value="in_person">In-person</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
            </GridItem>
          </Grid>
          
          {interview.location ? (
            <FormControl mt={4}>
              <FormLabel>Location Details</FormLabel>
              <Input
                name="location"
                value={interview.location}
                onChange={handleInputChange}
                placeholder="e.g. Office Room 302, HQ Building"
              />
            </FormControl>
          ) : (
            <FormControl mt={4}>
              <FormLabel>Meeting URL</FormLabel>
              <Input
                name="meeting_url"
                value={interview.meeting_url || ''}
                onChange={handleInputChange}
                placeholder="e.g. https://zoom.us/j/123456789"
              />
            </FormControl>
          )}
        </Box>
        
        <Divider />
        
        {/* Interviewers */}
        <Box>
          <Heading size="md" mb={4}>Interviewers</Heading>
          <FormControl isRequired isInvalid={!!errors.interviewer_ids}>
            <FormLabel>Select Interviewers</FormLabel>
            <Select
              multiple
              size="md"
              value={interview.interviewer_ids || []}
              onChange={handleInterviewerChange}
            >
              {userOptions.map(user => (
                <option key={user.id} value={user.id}>
                  {user.full_name} ({user.role})
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.interviewer_ids}</FormErrorMessage>
          </FormControl>
        </Box>
        
        <Divider />
        
        {/* Notes */}
        <Box>
          <Heading size="md" mb={4}>Additional Information</Heading>
          <FormControl>
            <FormLabel>Notes</FormLabel>
            <Textarea
              name="notes"
              value={interview.notes || ''}
              onChange={handleInputChange}
              placeholder="Any additional notes or preparation instructions for the interview"
              rows={4}
            />
          </FormControl>
        </Box>
        
        {/* Action Buttons */}
        <Flex justify="space-between" pt={4}>
          <Button
            variant="outline"
            onClick={() => {
              if (application) {
                router.push(`/applications/${application.id}`);
              } else {
                router.push('/interviews');
              }
            }}
            isDisabled={isLoading}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
          >
            {isEditing ? 'Update Interview' : 'Schedule Interview'}
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};

export default InterviewForm; 