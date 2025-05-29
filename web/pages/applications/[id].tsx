import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Flex, 
  Badge, 
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel,
  Divider,
  Grid,
  GridItem,
  VStack,
  HStack,
  Avatar,
  Spinner,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Card,
  CardBody,
  CardHeader,
  List,
  ListItem,
  Progress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useDisclosure,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  IconButton,
  Tooltip,
  Tag,
  TagLabel,
  Link,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Container,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Wrap,
  WrapItem,
  ButtonGroup,
  Stack
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  EmailIcon,
  PhoneIcon,
  ExternalLinkIcon,
  CalendarIcon,
  StarIcon,
  EditIcon,
  DeleteIcon,
  DownloadIcon,
  AddIcon,
  TimeIcon,
  CheckIcon,
  InfoIcon,
  WarningIcon,
  CloseIcon,
  ArrowForwardIcon,
  RepeatIcon,
  ChatIcon,
  AttachmentIcon,
  ViewIcon
} from '@chakra-ui/icons';
import { format, formatDistanceToNow } from 'date-fns';
import SimpleDashboardLayout from '@/components/layout/SimpleDashboardLayout';
import ScheduleInterviewModal from '../../components/applications/ScheduleInterviewModal';
import { Application, Interview, CandidateAssessment, Job, JobStage, User } from '../../../packages/types';
import { getApplicationById, moveApplicationToStage, rejectApplication, withdrawApplication } from '../../services/applications';
import { getJobById, getJobStageById } from '../../services/jobs';
import { getInterviewsByApplicationId, createInterview } from '../../services/interviews';
import { getAssessments } from '../../services/applications';
import { getCandidateById } from '../../services/applications';
import { GetServerSideProps } from 'next';

// Enhanced status colors with gradients
const statusColors = {
  new: 'blue',
  screening: 'purple',
  interview: 'orange',
  assessment: 'cyan',
  shortlisted: 'teal',
  offered: 'green',
  hired: 'green',
  rejected: 'red',
  withdrawn: 'gray',
  declined: 'red'
} as const;

// Mock activity data
const mockActivities = [
  {
    id: 1,
    type: 'status_change',
    title: 'Application moved to Interview stage',
    description: 'Application has progressed to the interview stage',
    user: 'Sarah Davis',
    timestamp: '2024-01-20T14:30:00Z',
    icon: 'arrow_forward'
  },
  {
    id: 2,
    type: 'interview_scheduled',
    title: 'Technical interview scheduled',
    description: 'Technical interview scheduled for January 25th at 10:00 AM',
    user: 'John Smith',
    timestamp: '2024-01-19T09:15:00Z',
    icon: 'calendar'
  },
  {
    id: 3,
    type: 'note_added',
    title: 'Note added',
    description: 'Great candidate with strong React experience',
    user: 'Mike Johnson',
    timestamp: '2024-01-18T16:45:00Z',
    icon: 'chat'
  }
];

interface ApplicationWithDetails extends Application {
  candidate?: User;
  job?: Job;
  currentStage?: JobStage;
}

const ApplicationDetailPage = () => {
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  // Modal states
  const { isOpen: isRejectOpen, onOpen: onRejectOpen, onClose: onRejectClose } = useDisclosure();
  const { isOpen: isMoveOpen, onOpen: onMoveOpen, onClose: onMoveClose } = useDisclosure();
  const { isOpen: isScheduleInterviewOpen, onOpen: onScheduleInterviewOpen, onClose: onScheduleInterviewClose } = useDisclosure();
  const { isOpen: isAddNoteOpen, onOpen: onAddNoteOpen, onClose: onAddNoteClose } = useDisclosure();
  const { isOpen: isScoreOpen, onOpen: onScoreOpen, onClose: onScoreClose } = useDisclosure();
  
  // State
  const [application, setApplication] = useState<ApplicationWithDetails | null>(null);
  const [stages, setStages] = useState<JobStage[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [assessments, setAssessments] = useState<CandidateAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  
  // Form states
  const [rejectReason, setRejectReason] = useState('');
  const [moveNotes, setMoveNotes] = useState('');
  const [targetStageId, setTargetStageId] = useState('');
  const [newNote, setNewNote] = useState('');
  const [scoreRating, setScoreRating] = useState(0);
  const [scoreNotes, setScoreNotes] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch application data
        const appData = await getApplicationById(id as string);
        if (!appData) {
          toast({
            title: 'Error',
            description: 'Application not found',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          router.push('/applications');
          return;
        }
        
        // Fetch related data in parallel
        const [candidateData, jobData, interviewsData, assessmentsData] = await Promise.all([
          getCandidateById(appData.user_id),
          getJobById(appData.job_id),
          getInterviewsByApplicationId(appData.id),
          getAssessments(appData.id)
        ]);
        
        let currentStageData = null;
        let stageObjects: JobStage[] = [];
        
        if (jobData && jobData.stage_ids) {
          // Convert stage IDs to actual stage objects
          const stagePromises = jobData.stage_ids.map(stageId => getJobStageById(stageId));
          stageObjects = (await Promise.all(stagePromises)).filter(Boolean) as JobStage[];
          setStages(stageObjects);
          
          // Set current stage
          if (appData.current_stage_id) {
            currentStageData = await getJobStageById(appData.current_stage_id);
          }
        }
        
        setApplication({
          ...appData,
          candidate: candidateData,
          job: jobData,
          currentStage: currentStageData
        });
        setInterviews(interviewsData);
        setAssessments(assessmentsData);
        
      } catch (error) {
        console.error('Error fetching application details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load application details. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, router, toast]);

  const handleReject = async () => {
    if (!application) return;
    
    try {
      await rejectApplication(application.id, rejectReason);
      
      toast({
        title: 'Application rejected',
        description: 'The candidate has been notified of the decision',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Refresh application data
      const updatedApp = await getApplicationById(application.id);
      if (updatedApp) {
        setApplication({ ...application, ...updatedApp });
      }
      
      onRejectClose();
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject application. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleMoveToStage = async () => {
    if (!application || !targetStageId) return;
    
    try {
      await moveApplicationToStage(application.id, targetStageId, moveNotes);
      
      toast({
        title: 'Stage updated',
        description: 'Application has been moved to the new stage',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Refresh application and stage data
      const [updatedApp, updatedStage] = await Promise.all([
        getApplicationById(application.id),
        getJobStageById(targetStageId)
      ]);
      
      if (updatedApp) {
        setApplication({
          ...application,
          ...updatedApp,
          currentStage: updatedStage
        });
      }
      
      onMoveClose();
      setTargetStageId('');
      setMoveNotes('');
    } catch (error) {
      console.error('Error moving application:', error);
      toast({
        title: 'Error',
        description: 'Failed to move application. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleInterviewScheduled = async (interview: Partial<Interview>) => {
    try {
      await createInterview(interview);
      
      // Refresh interviews data
      const updatedInterviews = await getInterviewsByApplicationId(application!.id);
      setInterviews(updatedInterviews);
    } catch (error) {
      throw error; // Re-throw to let modal handle the error
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const calculateProgress = () => {
    if (!stages || stages.length === 0) return 0;
    
    const currentIndex = stages.findIndex(stage => stage.id === application?.current_stage_id);
    if (currentIndex === -1) return 0;
    
    return ((currentIndex + 1) / stages.length) * 100;
  };

  const getNextStages = () => {
    if (!stages || !application?.current_stage_id) return [];
    
    const currentIndex = stages.findIndex(stage => stage.id === application.current_stage_id);
    return stages.slice(currentIndex + 1);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'status_change': return <ArrowForwardIcon />;
      case 'interview_scheduled': return <CalendarIcon />;
      case 'note_added': return <ChatIcon />;
      case 'document_uploaded': return <AttachmentIcon />;
      case 'assessment_sent': return <EditIcon />;
      default: return <InfoIcon />;
    }
  };

  if (isLoading) {
    return (
      <SimpleDashboardLayout>
        <Container maxW="full" centerContent py={20}>
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text>Loading application details...</Text>
          </VStack>
        </Container>
      </SimpleDashboardLayout>
    );
  }

  if (!application) {
    return (
      <SimpleDashboardLayout>
        <Container maxW="full" centerContent py={20}>
          <VStack spacing={6}>
            <WarningIcon boxSize={16} color="orange.500" />
            <Heading size="lg" textAlign="center">Application not found</Heading>
            <Text color="gray.500" textAlign="center">
              The application you're looking for doesn't exist or has been removed.
            </Text>
            <Button colorScheme="blue" onClick={() => router.push('/applications')}>
              Back to Applications
            </Button>
          </VStack>
        </Container>
      </SimpleDashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>{application.candidate?.full_name || 'Candidate'} - Application Details</title>
      </Head>
      
      <SimpleDashboardLayout>
        <Box bg={bgColor} minH="100vh" pb={8}>
          <Container maxW="full" py={6}>
            {/* Breadcrumb */}
            <Breadcrumb mb={6} fontSize="sm">
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => router.push('/applications')}>
                  Applications
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>{application.candidate?.full_name || 'Candidate'}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            {/* Header Section */}
            <Card mb={6} bg={cardBg} borderColor={borderColor} shadow="sm">
              <CardBody>
                <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
                  {/* Candidate Info */}
                  <Flex align="center" flex="1">
                    <Avatar
                      size="xl"
                      name={application.candidate?.full_name}
                      src={application.candidate?.avatar_url}
                      mr={6}
                    />
                    <Box>
                      <Heading size="lg" mb={2}>
                        {application.candidate?.full_name || 'Unknown Candidate'}
                      </Heading>
                      <Text fontSize="lg" color="gray.600" mb={3}>
                        {application.job?.title || 'Unknown Position'}
                      </Text>
                      
                      <HStack spacing={4} mb={3}>
                        {application.candidate?.email && (
                          <HStack>
                            <EmailIcon color="gray.500" />
                            <Text fontSize="sm">{application.candidate.email}</Text>
                          </HStack>
                        )}
                        {application.candidate?.phone && (
                          <HStack>
                            <PhoneIcon color="gray.500" />
                            <Text fontSize="sm">{application.candidate.phone}</Text>
                          </HStack>
                        )}
                      </HStack>
                      
                      <HStack spacing={2}>
                        <Badge
                          colorScheme={statusColors[application.status as keyof typeof statusColors]}
                          fontSize="sm"
                          px={3}
                          py={1}
                          borderRadius="full"
                        >
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                        
                        {application.total_score && (
                          <Badge colorScheme="gray" variant="outline" fontSize="sm" px={3} py={1} borderRadius="full">
                            Score: {application.total_score}%
                          </Badge>
                        )}
                        
                        <Badge colorScheme="blue" variant="outline" fontSize="sm" px={3} py={1} borderRadius="full">
                          {formatDistanceToNow(new Date(application.application_date), { addSuffix: true })}
                        </Badge>
                      </HStack>
                    </Box>
                  </Flex>

                  {/* Quick Stats */}
                  <SimpleGrid columns={3} spacing={4} minW="300px">
                    <Stat textAlign="center">
                      <StatLabel fontSize="xs">Experience</StatLabel>
                      <StatNumber fontSize="lg">
                        {application.custom_fields?.years_of_experience || 0}y
                      </StatNumber>
                    </Stat>
                    <Stat textAlign="center">
                      <StatLabel fontSize="xs">Interviews</StatLabel>
                      <StatNumber fontSize="lg">{interviews.length}</StatNumber>
                    </Stat>
                    <Stat textAlign="center">
                      <StatLabel fontSize="xs">Assessments</StatLabel>
                      <StatNumber fontSize="lg">{assessments.length}</StatNumber>
                    </Stat>
                  </SimpleGrid>

                  {/* Actions */}
                  <VStack spacing={2} minW="200px">
                    <ButtonGroup width="full" size="sm">
                      <Button
                        colorScheme="blue"
                        leftIcon={<CalendarIcon />}
                        onClick={onScheduleInterviewOpen}
                        isDisabled={application.status === 'rejected' || application.status === 'withdrawn'}
                      >
                        Schedule Interview
                      </Button>
                    </ButtonGroup>
                    
                    <ButtonGroup width="full" size="sm">
                      <Button
                        variant="outline"
                        leftIcon={<ArrowForwardIcon />}
                        onClick={onMoveOpen}
                        isDisabled={application.status === 'rejected' || application.status === 'withdrawn'}
                      >
                        Move Stage
                      </Button>
                      <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" size="sm">
                          More
                        </MenuButton>
                        <MenuList>
                          <MenuItem icon={<ChatIcon />} onClick={onAddNoteOpen}>
                            Add Note
                          </MenuItem>
                          <MenuItem icon={<StarIcon />} onClick={onScoreOpen}>
                            Update Score
                          </MenuItem>
                          <MenuItem icon={<EmailIcon />}>
                            Send Email
                          </MenuItem>
                          <MenuItem icon={<DownloadIcon />}>
                            Download Resume
                          </MenuItem>
                          <Divider />
                          <MenuItem icon={<CloseIcon />} color="red.500" onClick={onRejectOpen}>
                            Reject Application
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </ButtonGroup>
                  </VStack>
                </Flex>
              </CardBody>
            </Card>

            {/* Progress Section */}
            <Card mb={6} bg={cardBg} borderColor={borderColor} shadow="sm">
              <CardBody>
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md">Recruitment Progress</Heading>
                  <Text fontSize="sm" color="gray.500">
                    {application.currentStage?.name || 'Unknown Stage'} • {Math.round(calculateProgress())}% complete
                  </Text>
                </Flex>
                
                <Progress
                  value={calculateProgress()}
                  colorScheme="blue"
                  borderRadius="full"
                  height="12px"
                  mb={4}
                />
                
                <HStack spacing={4} overflowX="auto" pb={2}>
                  {stages.map((stage, index) => {
                    const isCurrent = stage.id === application.current_stage_id;
                    const isPast = stages.findIndex(s => s.id === application.current_stage_id) > index;
                    
                    return (
                      <HStack key={stage.id} spacing={2} minW="max-content">
                        <Box
                          w={3}
                          h={3}
                          borderRadius="full"
                          bg={isCurrent ? 'blue.500' : isPast ? 'green.500' : 'gray.300'}
                        />
                        <Text
                          fontSize="sm"
                          fontWeight={isCurrent ? 'bold' : 'normal'}
                          color={isCurrent ? 'blue.500' : isPast ? 'green.500' : 'gray.500'}
                        >
                          {stage.name}
                        </Text>
                      </HStack>
                    );
                  })}
                </HStack>
              </CardBody>
            </Card>

            {/* Main Content Tabs */}
            <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
              <TabList mb={6} bg={cardBg} borderRadius="lg" p={1}>
                <Tab>Overview</Tab>
                <Tab>Profile</Tab>
                <Tab>Interviews ({interviews.length})</Tab>
                <Tab>Assessments ({assessments.length})</Tab>
                <Tab>Documents</Tab>
                <Tab>Activity</Tab>
                <Tab>Notes</Tab>
              </TabList>

              <TabPanels>
                {/* Overview Tab */}
                <TabPanel p={0}>
                  <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
                    <VStack spacing={6} align="stretch">
                      {/* Application Details */}
                      <Card bg={cardBg} borderColor={borderColor} shadow="sm">
                        <CardHeader>
                          <Heading size="md">Application Details</Heading>
                        </CardHeader>
                        <CardBody>
                          <SimpleGrid columns={2} spacing={4}>
                            <Box>
                              <Text fontSize="sm" color="gray.500" mb={1}>Applied Date</Text>
                              <Text fontWeight="medium">{formatDate(application.application_date)}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" color="gray.500" mb={1}>Source</Text>
                              <Text fontWeight="medium">{application.source || 'Direct Application'}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" color="gray.500" mb={1}>Current Stage</Text>
                              <Text fontWeight="medium">{application.currentStage?.name || 'N/A'}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" color="gray.500" mb={1}>Last Activity</Text>
                              <Text fontWeight="medium">{formatDate(application.last_activity_date || application.application_date)}</Text>
                            </Box>
                            {application.salary_expectation && (
                              <>
                                <Box>
                                  <Text fontSize="sm" color="gray.500" mb={1}>Salary Expectation</Text>
                                  <Text fontWeight="medium">
                                    ${application.salary_expectation.amount?.toLocaleString()} {application.salary_expectation.currency}/{application.salary_expectation.period}
                                  </Text>
                                </Box>
                                <Box>
                                  <Text fontSize="sm" color="gray.500" mb={1}>Notice Period</Text>
                                  <Text fontWeight="medium">{application.notice_period || 'Not specified'}</Text>
                                </Box>
                              </>
                            )}
                          </SimpleGrid>
                        </CardBody>
                      </Card>

                      {/* Skills & Experience */}
                      {application.candidate?.skills && (
                        <Card bg={cardBg} borderColor={borderColor} shadow="sm">
                          <CardHeader>
                            <Heading size="md">Skills & Experience</Heading>
                          </CardHeader>
                          <CardBody>
                            <VStack align="stretch" spacing={4}>
                              <Box>
                                <Text fontSize="sm" color="gray.500" mb={2}>Skills</Text>
                                <Wrap>
                                  {application.candidate.skills.map((skill, index) => (
                                    <WrapItem key={index}>
                                      <Tag colorScheme="blue" variant="subtle">
                                        <TagLabel>{skill}</TagLabel>
                                      </Tag>
                                    </WrapItem>
                                  ))}
                                </Wrap>
                              </Box>
                              
                              <Box>
                                <Text fontSize="sm" color="gray.500" mb={2}>Experience Level</Text>
                                <Text fontWeight="medium">
                                  {application.custom_fields?.years_of_experience || 0} years of professional experience
                                </Text>
                              </Box>
                            </VStack>
                          </CardBody>
                        </Card>
                      )}
                    </VStack>

                    {/* Sidebar */}
                    <VStack spacing={6} align="stretch">
                      {/* Quick Actions */}
                      <Card bg={cardBg} borderColor={borderColor} shadow="sm">
                        <CardHeader>
                          <Heading size="md">Quick Actions</Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={3}>
                            <Button
                              width="full"
                              leftIcon={<EmailIcon />}
                              variant="outline"
                              size="sm"
                            >
                              Send Email
                            </Button>
                            <Button
                              width="full"
                              leftIcon={<CalendarIcon />}
                              variant="outline"
                              size="sm"
                              onClick={onScheduleInterviewOpen}
                            >
                              Schedule Interview
                            </Button>
                            <Button
                              width="full"
                              leftIcon={<EditIcon />}
                              variant="outline"
                              size="sm"
                            >
                              Send Assessment
                            </Button>
                            <Button
                              width="full"
                              leftIcon={<DownloadIcon />}
                              variant="outline"
                              size="sm"
                              as="a"
                              href={application.candidate?.resume_url}
                              target="_blank"
                            >
                              Download Resume
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>

                      {/* Contact Information */}
                      <Card bg={cardBg} borderColor={borderColor} shadow="sm">
                        <CardHeader>
                          <Heading size="md">Contact Information</Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack align="stretch" spacing={3}>
                            {application.candidate?.email && (
                              <HStack>
                                <EmailIcon color="gray.500" />
                                <Link href={`mailto:${application.candidate.email}`} color="blue.500">
                                  {application.candidate.email}
                                </Link>
                              </HStack>
                            )}
                            {application.candidate?.phone && (
                              <HStack>
                                <PhoneIcon color="gray.500" />
                                <Link href={`tel:${application.candidate.phone}`} color="blue.500">
                                  {application.candidate.phone}
                                </Link>
                              </HStack>
                            )}
                            {application.candidate?.linkedin_url && (
                              <HStack>
                                <ExternalLinkIcon color="gray.500" />
                                <Link href={application.candidate.linkedin_url} target="_blank" color="blue.500">
                                  LinkedIn Profile
                                </Link>
                              </HStack>
                            )}
                          </VStack>
                        </CardBody>
                      </Card>

                      {/* Recent Activity */}
                      <Card bg={cardBg} borderColor={borderColor} shadow="sm">
                        <CardHeader>
                          <Heading size="md">Recent Activity</Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack align="stretch" spacing={3}>
                            {mockActivities.slice(0, 3).map((activity, index) => (
                              <HStack key={activity.id} align="flex-start" spacing={3}>
                                <Box
                                  p={2}
                                  borderRadius="full"
                                  bg="blue.100"
                                  color="blue.600"
                                  fontSize="sm"
                                >
                                  {getActivityIcon(activity.type)}
                                </Box>
                                <Box flex="1">
                                  <Text fontSize="sm" fontWeight="medium">
                                    {activity.title}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                  </Text>
                                </Box>
                              </HStack>
                            ))}
                          </VStack>
                        </CardBody>
                      </Card>
                    </VStack>
                  </Grid>
                </TabPanel>

                {/* Profile Tab */}
                <TabPanel p={0}>
                  <Card bg={cardBg} borderColor={borderColor} shadow="sm">
                    <CardBody>
                      <Heading size="md" mb={6}>Candidate Profile</Heading>
                      
                      {application.candidate ? (
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                          <VStack align="stretch" spacing={4}>
                            <Box>
                              <Text fontSize="sm" color="gray.500" mb={2}>Full Name</Text>
                              <Text fontWeight="medium">{application.candidate.full_name}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" color="gray.500" mb={2}>Email</Text>
                              <Text fontWeight="medium">{application.candidate.email}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" color="gray.500" mb={2}>Phone</Text>
                              <Text fontWeight="medium">{application.candidate.phone || 'Not provided'}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" color="gray.500" mb={2}>Member Since</Text>
                              <Text fontWeight="medium">{formatDate(application.candidate.created_at)}</Text>
                            </Box>
                          </VStack>
                          
                          <VStack align="stretch" spacing={4}>
                            {application.candidate.skills && (
                              <Box>
                                <Text fontSize="sm" color="gray.500" mb={2}>Skills</Text>
                                <Wrap>
                                  {application.candidate.skills.map((skill, index) => (
                                    <WrapItem key={index}>
                                      <Tag colorScheme="blue" variant="subtle">
                                        <TagLabel>{skill}</TagLabel>
                                      </Tag>
                                    </WrapItem>
                                  ))}
                                </Wrap>
                              </Box>
                            )}
                            
                            <Box>
                              <Text fontSize="sm" color="gray.500" mb={2}>Profile Links</Text>
                              <VStack align="stretch" spacing={2}>
                                {application.candidate.linkedin_url && (
                                  <Link href={application.candidate.linkedin_url} target="_blank" color="blue.500">
                                    LinkedIn Profile
                                  </Link>
                                )}
                                {application.candidate.resume_url && (
                                  <Link href={application.candidate.resume_url} target="_blank" color="blue.500">
                                    Resume/CV
                                  </Link>
                                )}
                              </VStack>
                            </Box>
                          </VStack>
                        </Grid>
                      ) : (
                        <Alert status="warning">
                          <AlertIcon />
                          <AlertTitle>No profile data available</AlertTitle>
                          <AlertDescription>
                            Candidate profile information is not available.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardBody>
                  </Card>
                </TabPanel>

                {/* Interviews Tab */}
                <TabPanel p={0}>
                  <Card bg={cardBg} borderColor={borderColor} shadow="sm">
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <Heading size="md">Interviews</Heading>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          leftIcon={<AddIcon />}
                          onClick={onScheduleInterviewOpen}
                        >
                          Schedule Interview
                        </Button>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      {interviews.length === 0 ? (
                        <Alert status="info">
                          <AlertIcon />
                          <AlertTitle>No interviews scheduled</AlertTitle>
                          <AlertDescription>
                            Schedule an interview to begin the interview process.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <VStack spacing={4} align="stretch">
                          {interviews.map(interview => (
                            <Card key={interview.id} variant="outline">
                              <CardBody>
                                <Flex justify="space-between" align="flex-start" mb={3}>
                                  <Box>
                                    <Heading size="sm" mb={1}>{interview.title}</Heading>
                                    <Text fontSize="sm" color="gray.500" mb={2}>
                                      {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)} Interview
                                    </Text>
                                    <Text fontSize="sm">
                                      {formatDateTime(interview.scheduled_at)} • {interview.duration} minutes
                                    </Text>
                                  </Box>
                                  <Badge colorScheme={interview.status === 'completed' ? 'green' : interview.status === 'cancelled' ? 'red' : 'blue'}>
                                    {interview.status}
                                  </Badge>
                                </Flex>
                                
                                {interview.description && (
                                  <Text fontSize="sm" color="gray.600" mb={3}>
                                    {interview.description}
                                  </Text>
                                )}
                                
                                {interview.notes && (
                                  <Box>
                                    <Text fontSize="sm" color="gray.500" mb={1}>Notes</Text>
                                    <Text fontSize="sm">{interview.notes}</Text>
                                  </Box>
                                )}
                              </CardBody>
                            </Card>
                          ))}
                        </VStack>
                      )}
                    </CardBody>
                  </Card>
                </TabPanel>

                {/* Assessments Tab */}
                <TabPanel p={0}>
                  <Card bg={cardBg} borderColor={borderColor} shadow="sm">
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <Heading size="md">Assessments</Heading>
                        <Button size="sm" colorScheme="blue" leftIcon={<AddIcon />}>
                          Send Assessment
                        </Button>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      {assessments.length === 0 ? (
                        <Alert status="info">
                          <AlertIcon />
                          <AlertTitle>No assessments sent</AlertTitle>
                          <AlertDescription>
                            Send technical or skills assessments to evaluate the candidate.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <VStack spacing={4} align="stretch">
                          {assessments.map(assessment => (
                            <Card key={assessment.id} variant="outline">
                              <CardBody>
                                <Text fontWeight="medium">{assessment.name}</Text>
                                <Text fontSize="sm" color="gray.500">
                                  {assessment.type} • Due: {assessment.due_date ? formatDate(assessment.due_date) : 'No deadline'}
                                </Text>
                              </CardBody>
                            </Card>
                          ))}
                        </VStack>
                      )}
                    </CardBody>
                  </Card>
                </TabPanel>

                {/* Documents Tab */}
                <TabPanel p={0}>
                  <Card bg={cardBg} borderColor={borderColor} shadow="sm">
                    <CardHeader>
                      <Heading size="md">Documents</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        {application.candidate?.resume_url && (
                          <Card variant="outline">
                            <CardBody>
                              <Flex justify="space-between" align="center">
                                <HStack>
                                  <AttachmentIcon />
                                  <Box>
                                    <Text fontWeight="medium">Resume/CV</Text>
                                    <Text fontSize="sm" color="gray.500">PDF Document</Text>
                                  </Box>
                                </HStack>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  leftIcon={<DownloadIcon />}
                                  as="a"
                                  href={application.candidate.resume_url}
                                  target="_blank"
                                >
                                  Download
                                </Button>
                              </Flex>
                            </CardBody>
                          </Card>
                        )}
                        
                        {application.cover_letter_url && (
                          <Card variant="outline">
                            <CardBody>
                              <Flex justify="space-between" align="center">
                                <HStack>
                                  <AttachmentIcon />
                                  <Box>
                                    <Text fontWeight="medium">Cover Letter</Text>
                                    <Text fontSize="sm" color="gray.500">PDF Document</Text>
                                  </Box>
                                </HStack>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  leftIcon={<DownloadIcon />}
                                  as="a"
                                  href={application.cover_letter_url}
                                  target="_blank"
                                >
                                  Download
                                </Button>
                              </Flex>
                            </CardBody>
                          </Card>
                        )}
                        
                        {!application.candidate?.resume_url && !application.cover_letter_url && (
                          <Alert status="info">
                            <AlertIcon />
                            <AlertTitle>No documents available</AlertTitle>
                            <AlertDescription>
                              No documents have been uploaded for this application.
                            </AlertDescription>
                          </Alert>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                </TabPanel>

                {/* Activity Tab */}
                <TabPanel p={0}>
                  <Card bg={cardBg} borderColor={borderColor} shadow="sm">
                    <CardHeader>
                      <Heading size="md">Activity Timeline</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        {mockActivities.map((activity, index) => (
                          <Flex key={activity.id} align="flex-start" gap={4}>
                            <Box
                              p={3}
                              borderRadius="full"
                              bg="blue.100"
                              color="blue.600"
                            >
                              {getActivityIcon(activity.type)}
                            </Box>
                            <Box flex="1">
                              <Flex justify="space-between" align="flex-start" mb={1}>
                                <Text fontWeight="medium">{activity.title}</Text>
                                <Text fontSize="xs" color="gray.500">
                                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                </Text>
                              </Flex>
                              <Text fontSize="sm" color="gray.600" mb={1}>
                                {activity.description}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                by {activity.user}
                              </Text>
                            </Box>
                          </Flex>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>
                </TabPanel>

                {/* Notes Tab */}
                <TabPanel p={0}>
                  <Card bg={cardBg} borderColor={borderColor} shadow="sm">
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <Heading size="md">Notes</Heading>
                        <Button size="sm" colorScheme="blue" leftIcon={<AddIcon />} onClick={onAddNoteOpen}>
                          Add Note
                        </Button>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Alert status="info">
                        <AlertIcon />
                        <AlertTitle>No notes yet</AlertTitle>
                        <AlertDescription>
                          Add notes to keep track of important information about this candidate.
                        </AlertDescription>
                      </Alert>
                    </CardBody>
                  </Card>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Container>
        </Box>

        {/* Schedule Interview Modal */}
        {application && (
          <ScheduleInterviewModal
            isOpen={isScheduleInterviewOpen}
            onClose={onScheduleInterviewClose}
            application={{
              ...application,
              candidate: application.candidate
            }}
            onSchedule={handleInterviewScheduled}
          />
        )}

        {/* Reject Application Modal */}
        <Modal isOpen={isRejectOpen} onClose={onRejectClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Reject Application</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Alert status="warning" mb={4}>
                <AlertIcon />
                <AlertTitle>This action cannot be undone!</AlertTitle>
                <AlertDescription>
                  The candidate will be notified of the rejection.
                </AlertDescription>
              </Alert>
              
              <FormControl>
                <FormLabel>Rejection Reason</FormLabel>
                <Textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Provide a professional reason for rejection..."
                  rows={4}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onRejectClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleReject}>
                Reject Application
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Move to Stage Modal */}
        <Modal isOpen={isMoveOpen} onClose={onMoveClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Move to Stage</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb={4}>
                <FormLabel>Select Next Stage</FormLabel>
                <Select
                  value={targetStageId}
                  onChange={(e) => setTargetStageId(e.target.value)}
                  placeholder="Choose a stage"
                >
                  {getNextStages().map(stage => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Notes (Optional)</FormLabel>
                <Textarea
                  value={moveNotes}
                  onChange={(e) => setMoveNotes(e.target.value)}
                  placeholder="Add notes about this stage progression..."
                  rows={3}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onMoveClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleMoveToStage}
                isDisabled={!targetStageId}
              >
                Move to Stage
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Add Note Modal */}
        <Modal isOpen={isAddNoteOpen} onClose={onAddNoteClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Note</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Note Content</FormLabel>
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add your note here..."
                  rows={5}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onAddNoteClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" isDisabled={!newNote.trim()}>
                Add Note
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Update Score Modal */}
        <Modal isOpen={isScoreOpen} onClose={onScoreClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Candidate Score</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb={4}>
                <FormLabel>Overall Score (0-100)</FormLabel>
                <NumberInput
                  value={scoreRating}
                  onChange={(_, value) => setScoreRating(value)}
                  min={0}
                  max={100}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              
              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  value={scoreNotes}
                  onChange={(e) => setScoreNotes(e.target.value)}
                  placeholder="Add notes about the scoring..."
                  rows={3}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onScoreClose}>
                Cancel
              </Button>
              <Button colorScheme="blue">
                Update Score
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </SimpleDashboardLayout>
    </>
  );
};


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default ApplicationDetailPage; 