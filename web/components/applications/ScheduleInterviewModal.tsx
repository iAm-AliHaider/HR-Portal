import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  HStack,
  Box,
  Text,
  Badge,
  Avatar,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  Alert,
  AlertIcon,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { CalendarIcon, TimeIcon, EmailIcon } from '@chakra-ui/icons';
import { format, addDays } from 'date-fns';
import { Application, Interview, User } from '../../../packages/types';
import InterviewBookingSection from '../interviews/InterviewBookingSection';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application & { candidate?: User };
  onSchedule: (interview: Partial<Interview>) => Promise<void>;
}

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  application,
  onSchedule
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: `${application.candidate?.full_name} - Interview`,
    type: 'video' as Interview['type'],
    scheduledDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    scheduledTime: '10:00',
    duration: 60,
    location: '',
    meetingUrl: '',
    description: '',
    interviewerIds: [] as string[],
    sendNotification: true,
    notes: '',
    // Booking options
    selectedRoomId: undefined as string | undefined,
    selectedAssetIds: [] as string[]
  });

  // Mock interviewer data
  const mockInterviewers = [
    {
      id: 'int1',
      name: 'John Smith',
      title: 'Senior Software Engineer',
      email: 'john.smith@company.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      id: 'int2',
      name: 'Sarah Davis',
      title: 'Engineering Manager',
      email: 'sarah.davis@company.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612d5ca?w=150'
    },
    {
      id: 'int3',
      name: 'Mike Johnson',
      title: 'Technical Lead',
      email: 'mike.johnson@company.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    },
    {
      id: 'int4',
      name: 'Lisa Wang',
      title: 'Product Manager',
      email: 'lisa.wang@company.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInterviewerToggle = (interviewerId: string) => {
    setFormData(prev => ({
      ...prev,
      interviewerIds: prev.interviewerIds.includes(interviewerId)
        ? prev.interviewerIds.filter(id => id !== interviewerId)
        : [...prev.interviewerIds, interviewerId]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.scheduledDate || !formData.scheduledTime || formData.interviewerIds.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields and select at least one interviewer.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const scheduledAt = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString();
      
      const interview: Partial<Interview> & {
        booking_options?: {
          room_id?: string;
          asset_ids?: string[];
          booked_by: string;
        };
      } = {
        org_id: application.org_id,
        application_id: application.id,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        interviewer_ids: formData.interviewerIds,
        scheduled_at: scheduledAt,
        duration: formData.duration,
        location: formData.location,
        meeting_url: formData.meetingUrl,
        status: 'scheduled',
        notes: formData.notes,
        created_at: new Date().toISOString()
      };

      // Add booking options for in-person interviews
      if (formData.type === 'in_person' && (formData.selectedRoomId || formData.selectedAssetIds.length > 0)) {
        interview.booking_options = {
          room_id: formData.selectedRoomId,
          asset_ids: formData.selectedAssetIds,
          booked_by: 'current_user_id' // This should be replaced with actual user ID
        };
      }

      await onSchedule(interview);
      
      toast({
        title: 'Interview Scheduled',
        description: `Interview scheduled for ${application.candidate?.full_name} on ${format(new Date(scheduledAt), 'MMM dd, yyyy at h:mm a')}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to schedule interview. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeDescription = (type: Interview['type']) => {
    switch (type) {
      case 'phone':
        return 'Audio call interview';
      case 'video':
        return 'Video conference interview';
      case 'in_person':
        return 'Face-to-face interview at office';
      case 'technical':
        return 'Technical assessment interview';
      case 'panel':
        return 'Panel interview with multiple interviewers';
      default:
        return '';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="600px">
        <ModalHeader>
          <HStack>
            <CalendarIcon />
            <Text>Schedule Interview</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Candidate Information */}
            <Box p={4} bg="gray.50" borderRadius="md">
              <HStack>
                <Avatar
                  size="md"
                  name={application.candidate?.full_name}
                  src={application.candidate?.avatar_url}
                />
                <Box>
                  <Text fontWeight="bold">{application.candidate?.full_name}</Text>
                  <Text fontSize="sm" color="gray.600">{application.candidate?.email}</Text>
                  <Badge colorScheme="blue" variant="subtle">
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </Box>
              </HStack>
            </Box>

            <Divider />

            <Tabs variant="enclosed" colorScheme="blue">
              <TabList>
                <Tab>Interview Details</Tab>
                <Tab>Room & Equipment</Tab>
              </TabList>
              
              <TabPanels>
                <TabPanel px={0}>
                  <VStack spacing={4} align="stretch">
                    {/* Interview Details */}
                    <FormControl isRequired>
                      <FormLabel>Interview Title</FormLabel>
                      <Input
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter interview title"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Interview Type</FormLabel>
                      <Select
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                      >
                        <option value="video">Video Interview</option>
                        <option value="phone">Phone Interview</option>
                        <option value="in_person">In-Person Interview</option>
                        <option value="technical">Technical Interview</option>
                        <option value="panel">Panel Interview</option>
                      </Select>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {getTypeDescription(formData.type)}
                      </Text>
                    </FormControl>

                    <HStack spacing={4}>
                      <FormControl isRequired flex={2}>
                        <FormLabel>Date</FormLabel>
                        <Input
                          type="date"
                          value={formData.scheduledDate}
                          onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                        />
                      </FormControl>
                      
                      <FormControl isRequired flex={1}>
                        <FormLabel>Time</FormLabel>
                        <Input
                          type="time"
                          value={formData.scheduledTime}
                          onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                        />
                      </FormControl>
                      
                      <FormControl flex={1}>
                        <FormLabel>Duration (min)</FormLabel>
                        <NumberInput
                          value={formData.duration}
                          onChange={(_, value) => handleInputChange('duration', value)}
                          min={15}
                          max={240}
                          step={15}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                    </HStack>

                    {formData.type === 'in_person' && (
                      <FormControl>
                        <FormLabel>Location</FormLabel>
                        <Input
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="Conference room, office address, etc."
                        />
                      </FormControl>
                    )}

                    {(formData.type === 'video' || formData.type === 'technical') && (
                      <FormControl>
                        <FormLabel>Meeting URL</FormLabel>
                        <Input
                          value={formData.meetingUrl}
                          onChange={(e) => handleInputChange('meetingUrl', e.target.value)}
                          placeholder="Zoom, Teams, or Google Meet link"
                        />
                      </FormControl>
                    )}

                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Interview agenda, topics to cover, special instructions..."
                        rows={3}
                      />
                    </FormControl>

                    {/* Interviewer Selection */}
                    <FormControl isRequired>
                      <FormLabel>Select Interviewers</FormLabel>
                      <Box maxH="200px" overflowY="auto" border="1px" borderColor="gray.200" borderRadius="md" p={2}>
                        <VStack spacing={2} align="stretch">
                          {mockInterviewers.map((interviewer) => (
                            <Box key={interviewer.id} p={2} _hover={{ bg: 'gray.50' }}>
                              <HStack>
                                <Checkbox
                                  isChecked={formData.interviewerIds.includes(interviewer.id)}
                                  onChange={() => handleInterviewerToggle(interviewer.id)}
                                />
                                <Avatar size="sm" name={interviewer.name} src={interviewer.avatar} />
                                <Box flex={1}>
                                  <Text fontSize="sm" fontWeight="medium">{interviewer.name}</Text>
                                  <Text fontSize="xs" color="gray.500">{interviewer.title}</Text>
                                </Box>
                              </HStack>
                            </Box>
                          ))}
                        </VStack>
                      </Box>
                      {formData.interviewerIds.length === 0 && (
                        <Text fontSize="xs" color="red.500" mt={1}>
                          Please select at least one interviewer
                        </Text>
                      )}
                    </FormControl>

                    <FormControl>
                      <FormLabel>Notes</FormLabel>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Internal notes for the interview team..."
                        rows={2}
                      />
                    </FormControl>

                    <Checkbox
                      isChecked={formData.sendNotification}
                      onChange={(e) => handleInputChange('sendNotification', e.target.checked)}
                    >
                      <HStack>
                        <EmailIcon />
                        <Text fontSize="sm">Send email notifications to candidate and interviewers</Text>
                      </HStack>
                    </Checkbox>

                    {formData.sendNotification && (
                      <Alert status="info" size="sm">
                        <AlertIcon />
                        <Text fontSize="sm">
                          Email notifications will be sent with interview details and calendar invites.
                        </Text>
                      </Alert>
                    )}
                  </VStack>
                </TabPanel>

                <TabPanel px={0}>
                  <InterviewBookingSection
                    interviewType={formData.type}
                    scheduledAt={`${formData.scheduledDate}T${formData.scheduledTime}`}
                    duration={formData.duration}
                    orgId={application.org_id}
                    selectedRoomId={formData.selectedRoomId}
                    selectedAssetIds={formData.selectedAssetIds}
                    onRoomChange={(roomId) => handleInputChange('selectedRoomId', roomId)}
                    onAssetsChange={(assetIds) => handleInputChange('selectedAssetIds', assetIds)}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
            leftIcon={<CalendarIcon />}
          >
            Schedule Interview
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ScheduleInterviewModal; 
