import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Grid, 
  GridItem, 
  Flex, 
  Badge, 
  Input, 
  Select, 
  InputGroup, 
  InputLeftElement,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Spinner,
  useToast,
  HStack,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Container,
  useColorModeValue,
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';
import {
  SearchIcon,
  CalendarIcon,
  TimeIcon,
  SettingsIcon,
  AddIcon,
  ViewIcon,
  EditIcon,
  ExternalLinkIcon,
  StarIcon,
  DownloadIcon,
  ChatIcon
} from '@chakra-ui/icons';
import { format } from 'date-fns';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Interview, User, Job, Application } from '../../packages/types';

// Extended interfaces for this component
interface ApplicationWithDetails extends Application {
  candidate?: User;
  job?: Job;
}

// Mock data
const MOCK_INTERVIEWS: Interview[] = [
  {
    id: 'int1',
    org_id: 'org1',
    application_id: 'app1',
    title: 'Technical Interview',
    description: 'Technical assessment focusing on React and Node.js',
    type: 'technical',
    interviewer_ids: ['user2'],
    scheduled_at: '2024-01-25T10:00:00Z',
    duration: 60,
    meeting_url: 'https://meet.google.com/abc-def-ghi',
    status: 'scheduled',
    created_at: '2024-01-20T08:00:00Z'
  },
  {
    id: 'int2',
    org_id: 'org1',
    application_id: 'app2',
    title: 'HR Interview',
    description: 'Cultural fit and behavioral assessment',
    type: 'video',
    interviewer_ids: ['user3'],
    scheduled_at: '2024-01-25T14:00:00Z',
    duration: 45,
    meeting_url: 'https://zoom.us/j/123456789',
    status: 'completed',
    overall_rating: 8.5,
    notes: 'Great communication skills, good cultural fit',
    created_at: '2024-01-18T08:00:00Z'
  }
];

const MOCK_APPLICATIONS: ApplicationWithDetails[] = [
  {
    id: 'app1',
    org_id: 'org1',
    job_id: 'job1',
    user_id: 'cand1',
    status: 'interview',
    application_date: '2024-01-15T08:00:00Z',
    created_at: '2024-01-15T08:00:00Z',
    candidate: {
      id: 'cand1',
      org_id: 'org1',
      email: 'alice.johnson@email.com',
      full_name: 'Alice Johnson',
      role: 'candidate',
      status: 'candidate',
      created_at: '2024-01-05T08:00:00Z'
    },
    job: {
      id: 'job1',
      org_id: 'org1',
      title: 'Frontend Developer',
      status: 'published',
      created_at: '2024-01-01T08:00:00Z',
      location: 'San Francisco',
      job_type: 'full_time',
      poster_id: 'user1'
    }
  },
  {
    id: 'app2',
    org_id: 'org1',
    job_id: 'job2',
    user_id: 'cand2',
    status: 'interview',
    application_date: '2024-01-12T08:00:00Z',
    created_at: '2024-01-12T08:00:00Z',
    candidate: {
      id: 'cand2',
      org_id: 'org1',
      email: 'bob.smith@email.com',
      full_name: 'Bob Smith',
      role: 'candidate',
      status: 'candidate',
      created_at: '2024-01-03T08:00:00Z'
    },
    job: {
      id: 'job2',
      org_id: 'org1',
      title: 'Backend Developer',
      status: 'published',
      created_at: '2024-01-01T08:00:00Z',
      location: 'New York',
      job_type: 'full_time',
      poster_id: 'user1'
    }
  }
];

const MOCK_INTERVIEWERS: User[] = [
  {
    id: 'user2',
    org_id: 'org1',
    email: 'sarah.davis@company.com',
    full_name: 'Sarah Davis',
    role: 'manager',
    status: 'employee',
    created_at: '2024-01-01T08:00:00Z',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    department: 'Engineering'
  },
  {
    id: 'user3',
    org_id: 'org1',
    email: 'mike.johnson@company.com',
    full_name: 'Mike Johnson',
    role: 'employee',
    status: 'employee',
    created_at: '2024-01-01T08:00:00Z',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    department: 'HR'
  }
];

type ViewMode = 'list' | 'calendar' | 'timeline';

const InterviewsPage = () => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  const { isOpen: isFeedbackOpen, onOpen: onFeedbackOpen, onClose: onFeedbackClose } = useDisclosure();
  
  const [interviews, setInterviews] = useState<Interview[]>(MOCK_INTERVIEWS);
  const [applications, setApplications] = useState<ApplicationWithDetails[]>(MOCK_APPLICATIONS);
  const [interviewers, setInterviewers] = useState<User[]>(MOCK_INTERVIEWERS);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);

  const filteredInterviews = interviews.filter(interview => {
    const application = applications.find(app => app.id === interview.application_id);
    
    const matchesSearch = 
      searchTerm === '' || 
      (application?.candidate?.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      interview.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || interview.status === filterStatus;
    const matchesType = filterType === 'all' || interview.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: interviews.length,
    scheduled: interviews.filter(i => i.status === 'scheduled').length,
    completed: interviews.filter(i => i.status === 'completed').length,
    cancelled: interviews.filter(i => i.status === 'cancelled').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getApplication = (applicationId: string) => {
    return applications.find(app => app.id === applicationId);
  };

  const getInterviewer = (interviewerId: string) => {
    return interviewers.find(int => int.id === interviewerId);
  };

  const handleAddFeedback = (interview: Interview) => {
    setSelectedInterview(interview);
    setFeedback(interview.notes || '');
    setScore(interview.overall_rating || 0);
    onFeedbackOpen();
  };

  const handleSubmitFeedback = () => {
    if (!selectedInterview) return;
    
    const updatedInterviews = interviews.map(int => 
      int.id === selectedInterview.id 
        ? { 
            ...int, 
            notes: feedback,
            overall_rating: score,
            status: 'completed' as Interview['status']
          }
        : int
    );
    setInterviews(updatedInterviews);
    
    toast({
      title: 'Feedback submitted',
      description: 'Interview feedback has been saved successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    onFeedbackClose();
  };

  const InterviewCard = ({ interview }: { interview: Interview }) => {
    const application = getApplication(interview.application_id);
    const firstInterviewer = interview.interviewer_ids[0];
    const interviewer = getInterviewer(firstInterviewer);
    
    return (
      <Card
        bg={cardBg}
        borderColor={borderColor}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        transition="all 0.2s"
        _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
      >
        <CardHeader pb={2}>
          <Flex justify="space-between" align="flex-start" mb={2}>
            <Box flex="1">
              <Heading size="sm" mb={1}>
                {interview.title}
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={2}>
                {application?.candidate?.full_name} • {application?.job?.title}
              </Text>
              <HStack spacing={2} mb={2}>
                <Badge colorScheme={getStatusColor(interview.status)} variant="subtle">
                  {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                </Badge>
                <Badge variant="outline" fontSize="xs">
                  {interview.type}
                </Badge>
              </HStack>
            </Box>
            <Menu>
              <MenuButton as={IconButton} icon={<SettingsIcon />} variant="ghost" size="sm" />
              <MenuList>
                <MenuItem icon={<ViewIcon />} onClick={() => router.push(`/applications/${interview.application_id}`)}>
                  View Application
                </MenuItem>
                <MenuItem icon={<ChatIcon />} onClick={() => handleAddFeedback(interview)}>
                  Add Feedback
                </MenuItem>
                <MenuItem icon={<EditIcon />}>
                  Reschedule
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </CardHeader>
        
        <CardBody pt={0}>
          <VStack align="stretch" spacing={3}>
            <HStack justify="space-between">
              <HStack>
                <CalendarIcon color="gray.500" />
                <Text fontSize="sm">{format(new Date(interview.scheduled_at), 'MMM d, yyyy')}</Text>
              </HStack>
              <HStack>
                <TimeIcon color="gray.500" />
                <Text fontSize="sm">{format(new Date(interview.scheduled_at), 'h:mm a')}</Text>
              </HStack>
            </HStack>
            
            {interviewer && (
              <HStack>
                <Avatar size="sm" name={interviewer.full_name} src={interviewer.avatar_url} />
                <Box>
                  <Text fontSize="sm" fontWeight="medium">{interviewer.full_name}</Text>
                  <Text fontSize="xs" color="gray.500">{interviewer.department}</Text>
                </Box>
              </HStack>
            )}
            
            {interview.description && (
              <Text fontSize="sm" color="gray.600">
                {interview.description}
              </Text>
            )}
            
            {interview.notes && (
              <Box p={3} bg="gray.50" borderRadius="md">
                <Text fontSize="xs" color="gray.500" mb={1}>Feedback</Text>
                <Text fontSize="sm">{interview.notes}</Text>
                {interview.overall_rating && (
                  <HStack mt={2}>
                    <StarIcon color="yellow.500" boxSize={4} />
                    <Text fontSize="sm" fontWeight="medium">{interview.overall_rating}/10</Text>
                  </HStack>
                )}
              </Box>
            )}
          </VStack>
        </CardBody>
        
        <CardFooter pt={0}>
          <HStack spacing={2} width="100%">
            <Button 
              size="sm" 
              variant="outline" 
              leftIcon={<ViewIcon />}
              onClick={() => router.push(`/applications/${interview.application_id}`)}
            >
              View Application
            </Button>
            {interview.meeting_url && (
              <Button
                size="sm"
                colorScheme="blue"
                leftIcon={<ExternalLinkIcon />}
                onClick={() => window.open(interview.meeting_url, '_blank')}
              >
                Join Meeting
              </Button>
            )}
          </HStack>
        </CardFooter>
      </Card>
    );
  };

  return (
    <>
      <Head>
        <title>Interviews | HR Portal</title>
        <meta name="description" content="Manage interview scheduling and feedback" />
      </Head>
      
      <DashboardLayout>
        <Box bg={bgColor} minH="100vh" pb={8}>
          <Container maxW="full" py={6}>
            {/* Breadcrumb */}
            <Breadcrumb mb={6} fontSize="sm">
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => router.push('/dashboard')}>
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>Interviews</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            {/* Header */}
            <Flex justify="space-between" align="center" mb={6}>
              <Box>
                <Heading size="lg">Interview Management</Heading>
                <Text color="gray.600">{filteredInterviews.length} of {interviews.length} interviews</Text>
              </Box>
              
              <ButtonGroup spacing={2}>
                <Button variant="outline" leftIcon={<DownloadIcon />}>
                  Export Schedule
                </Button>
                <Button 
                  colorScheme="blue" 
                  leftIcon={<AddIcon />}
                  onClick={() => router.push('/applications')}
                >
                  Schedule Interview
                </Button>
              </ButtonGroup>
            </Flex>

            {/* Statistics Cards */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Total Interviews</StatLabel>
                <StatNumber fontSize="xl">{stats.total}</StatNumber>
              </Stat>
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Scheduled</StatLabel>
                <StatNumber fontSize="xl" color="blue.500">{stats.scheduled}</StatNumber>
              </Stat>
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Completed</StatLabel>
                <StatNumber fontSize="xl" color="green.500">{stats.completed}</StatNumber>
              </Stat>
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Cancelled</StatLabel>
                <StatNumber fontSize="xl" color="red.500">{stats.cancelled}</StatNumber>
              </Stat>
            </SimpleGrid>

            {/* Filters */}
            <Card mb={6} bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4} mb={4}>
                  <GridItem colSpan={{ base: 1, lg: 2 }}>
                    <InputGroup>
                      <InputLeftElement>
                        <SearchIcon color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder="Search interviews, candidates, jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </GridItem>
                  
                  <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All Statuses</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                  
                  <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="all">All Types</option>
                    <option value="technical">Technical</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="panel">Panel</option>
                    <option value="phone">Phone</option>
                  </Select>
                </Grid>
                
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.500">
                    Showing {filteredInterviews.length} of {interviews.length} interviews
                  </Text>
                  
                  <HStack spacing={2}>
                    <Text fontSize="sm" color="gray.500">View:</Text>
                    <ButtonGroup isAttached size="sm">
                      <Button
                        variant={viewMode === 'list' ? 'solid' : 'outline'}
                        onClick={() => setViewMode('list')}
                      >
                        List
                      </Button>
                      <Button
                        variant={viewMode === 'calendar' ? 'solid' : 'outline'}
                        onClick={() => setViewMode('calendar')}
                      >
                        Calendar
                      </Button>
                    </ButtonGroup>
                  </HStack>
                </Flex>
              </CardBody>
            </Card>

            {/* Content */}
            {isLoading ? (
              <Flex justify="center" align="center" py={20}>
                <VStack spacing={4}>
                  <Spinner size="xl" />
                  <Text>Loading interviews...</Text>
                </VStack>
              </Flex>
            ) : filteredInterviews.length === 0 ? (
              <Alert status="info" borderRadius="lg">
                <AlertIcon />
                <AlertTitle>No interviews found!</AlertTitle>
                <AlertDescription>
                  {interviews.length === 0 
                    ? "No interviews have been scheduled yet. Schedule your first interview!"
                    : "Try adjusting your filters to see more interviews."
                  }
                </AlertDescription>
              </Alert>
            ) : (
              <Grid 
                templateColumns={{ 
                  base: "1fr", 
                  md: "repeat(2, 1fr)", 
                  lg: "repeat(3, 1fr)"
                }} 
                gap={6}
              >
                {filteredInterviews.map(interview => (
                  <InterviewCard key={interview.id} interview={interview} />
                ))}
              </Grid>
            )}
          </Container>
        </Box>

        {/* Feedback Modal */}
        <Modal isOpen={isFeedbackOpen} onClose={onFeedbackClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Interview Feedback</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedInterview && (
                <VStack spacing={4}>
                  <Box width="100%">
                    <Text fontSize="sm" color="gray.500" mb={2}>
                      Interview: {selectedInterview.title}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Candidate: {getApplication(selectedInterview.application_id)?.candidate?.full_name}
                    </Text>
                  </Box>
                  
                  <FormControl>
                    <FormLabel>Overall Score (0-10)</FormLabel>
                    <NumberInput
                      value={score}
                      onChange={(_, value) => setScore(value)}
                      min={0}
                      max={10}
                      step={0.1}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Feedback</FormLabel>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Provide detailed feedback about the candidate's performance..."
                      rows={4}
                    />
                  </FormControl>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onFeedbackClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleSubmitFeedback}>
                Submit Feedback
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </DashboardLayout>
    </>
  );
};

export default InterviewsPage; 
