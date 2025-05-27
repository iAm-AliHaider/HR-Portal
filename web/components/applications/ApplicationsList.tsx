import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Avatar,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Textarea,
  Spacer,
  Divider,
  Tag,
  TagLabel,
  Tooltip,
  Progress,
  SimpleGrid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Wrap,
  WrapItem,
  ButtonGroup,
  Switch,
  Container,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  ChevronDownIcon, 
  SearchIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  SettingsIcon,
  DownloadIcon,
  EmailIcon,
  CalendarIcon,
  ViewIcon,
  EditIcon,
  DeleteIcon,
  StarIcon,
  PhoneIcon,
  ExternalLinkIcon,
  TimeIcon,
  InfoIcon,
  CheckIcon,
  CloseIcon,
  AddIcon,
  ViewOffIcon
} from '@chakra-ui/icons';
import { formatDistanceToNow, format } from 'date-fns';
import { Application, Job, User, JobStage, Interview } from '../../../packages/types';
import { getApplications, getApplicationStatuses, moveApplicationToStage, rejectApplication } from '../../services/applications';
import { getJobs, getJobStages } from '../../services/jobs';
import { createInterview } from '../../services/interviews';
import ScheduleInterviewModal from './ScheduleInterviewModal';
import BulkEmailModal from './BulkEmailModal';

const statusColorMap = {
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

type ViewMode = 'cards' | 'table' | 'pipeline';

interface ApplicationWithCandidate extends Application {
  candidate?: User;
  job?: Job;
}

interface ApplicationsListProps {
  orgId: string;
  viewMode?: 'applications' | 'candidates';
}

const ApplicationsList = ({ orgId, viewMode = 'applications' }: ApplicationsListProps) => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  
  // State
  const [applications, setApplications] = useState<ApplicationWithCandidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stages, setStages] = useState<JobStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayMode, setDisplayMode] = useState<ViewMode>(viewMode === 'candidates' ? 'cards' : 'cards');
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  
  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterJobId, setFilterJobId] = useState('all');
  const [filterExperience, setFilterExperience] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('application_date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  
  // Modal states
  const { isOpen: isBulkActionOpen, onOpen: onBulkActionOpen, onClose: onBulkActionClose } = useDisclosure();
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();
  const { isOpen: isScheduleInterviewOpen, onOpen: onScheduleInterviewOpen, onClose: onScheduleInterviewClose } = useDisclosure();
  const { isOpen: isBulkEmailOpen, onOpen: onBulkEmailOpen, onClose: onBulkEmailClose } = useDisclosure();
  const [bulkAction, setBulkAction] = useState('');
  const [bulkNotes, setBulkNotes] = useState('');
  const [selectedApplicationForInterview, setSelectedApplicationForInterview] = useState<ApplicationWithCandidate | null>(null);

  // Mock candidate data
  const candidateData: Record<string, User> = {
    'user1': {
      id: 'user1',
      org_id: 'org1',
      email: 'sarah.johnson@email.com',
      full_name: 'Sarah Johnson',
      role: 'candidate',
      status: 'candidate',
      created_at: '2024-01-15T09:30:00Z',
      is_active: true,
      phone: '+1 (555) 123-4567',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
      resume_url: 'https://example.com/resume1.pdf',
      linkedin_url: 'https://linkedin.com/in/sarahjohnson',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612d5ca?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    'user2': {
      id: 'user2',
      org_id: 'org1',
      email: 'michael.chen@email.com',
      full_name: 'Michael Chen',
      role: 'candidate',
      status: 'candidate',
      created_at: '2024-01-20T08:00:00Z',
      is_active: true,
      phone: '+1 (555) 987-6543',
      skills: ['Leadership', 'HR Strategy', 'Talent Acquisition', 'Performance Management'],
      resume_url: 'https://example.com/resume2.pdf',
      linkedin_url: 'https://linkedin.com/in/michaelchen',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    'user3': {
      id: 'user3',
      org_id: 'org1',
      email: 'emily.rodriguez@email.com',
      full_name: 'Emily Rodriguez',
      role: 'candidate',
      status: 'candidate',
      created_at: '2024-01-22T14:30:00Z',
      is_active: true,
      phone: '+1 (555) 555-0123',
      skills: ['JavaScript', 'React', 'CSS', 'HTML', 'UI/UX Design'],
      resume_url: 'https://example.com/resume3.pdf',
      linkedin_url: 'https://linkedin.com/in/emilyrodriguez',
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [applicationsData, jobsData, stagesData] = await Promise.all([
          getApplications(orgId),
          getJobs(orgId),
          getJobStages(orgId)
        ]);
        
        // Enrich applications with candidate and job data
        const enrichedApplications = applicationsData.map(app => ({
          ...app,
          candidate: candidateData[app.user_id],
          job: jobsData.find(job => job.id === app.job_id)
        }));
        
        setApplications(enrichedApplications);
        setJobs(jobsData);
        setStages(stagesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load applications. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [orgId, toast]);

  useEffect(() => {
    setIsLoading(false);
  }, [candidateData]);

  // Filter and sort applications
  const filteredApplications = applications.filter(app => {
    const candidateName = app.candidate?.full_name?.toLowerCase() || '';
    const candidateEmail = app.candidate?.email?.toLowerCase() || '';
    const jobTitle = app.job?.title?.toLowerCase() || '';
    
    const matchesSearch = 
      searchTerm === '' || 
      candidateName.includes(searchTerm.toLowerCase()) ||
      candidateEmail.includes(searchTerm.toLowerCase()) ||
      jobTitle.includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesJob = filterJobId === 'all' || app.job_id === filterJobId;
    
    const experienceYears = app.custom_fields?.years_of_experience || 0;
    const matchesExperience = filterExperience === 'all' ||
      (filterExperience === '0-2' && experienceYears <= 2) ||
      (filterExperience === '3-5' && experienceYears >= 3 && experienceYears <= 5) ||
      (filterExperience === '6-10' && experienceYears >= 6 && experienceYears <= 10) ||
      (filterExperience === '10+' && experienceYears > 10);
    
    const appDate = new Date(app.application_date);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - appDate.getTime()) / (1000 * 60 * 60 * 24));
    const matchesDateRange = filterDateRange === 'all' ||
      (filterDateRange === 'today' && daysDiff === 0) ||
      (filterDateRange === 'week' && daysDiff <= 7) ||
      (filterDateRange === 'month' && daysDiff <= 30) ||
      (filterDateRange === '3months' && daysDiff <= 90);
    
    return matchesSearch && matchesStatus && matchesJob && matchesExperience && matchesDateRange;
  }).sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'application_date':
        aValue = new Date(a.application_date).getTime();
        bValue = new Date(b.application_date).getTime();
        break;
      case 'last_activity':
        aValue = new Date(a.last_activity_date || a.application_date).getTime();
        bValue = new Date(b.last_activity_date || b.application_date).getTime();
        break;
      case 'candidate_name':
        aValue = a.candidate?.full_name || '';
        bValue = b.candidate?.full_name || '';
        break;
      case 'experience':
        aValue = a.custom_fields?.years_of_experience || 0;
        bValue = b.custom_fields?.years_of_experience || 0;
        break;
      case 'score':
        aValue = a.total_score || 0;
        bValue = b.total_score || 0;
        break;
      default:
        aValue = new Date(a.application_date).getTime();
        bValue = new Date(b.application_date).getTime();
    }
    
    if (typeof aValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / pageSize);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Statistics
  const stats = {
    total: applications.length,
    new: applications.filter(a => a.status === 'new').length,
    inProgress: applications.filter(a => ['screening', 'interview', 'assessment'].includes(a.status)).length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    hired: applications.filter(a => a.status === 'hired').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    avgScore: applications.reduce((sum, app) => sum + (app.total_score || 0), 0) / applications.length || 0
  };

  // Handlers
  const handleSortToggle = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectApplication = (appId: string, checked: boolean) => {
    if (checked) {
      setSelectedApplications([...selectedApplications, appId]);
    } else {
      setSelectedApplications(selectedApplications.filter(id => id !== appId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplications(paginatedApplications.map(app => app.id));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedApplications.length === 0) return;
    
    try {
      for (const appId of selectedApplications) {
        if (bulkAction === 'reject') {
          await rejectApplication(appId, bulkNotes);
        } else if (bulkAction.startsWith('move_to_')) {
          const stageId = bulkAction.replace('move_to_', '');
          await moveApplicationToStage(appId, stageId, bulkNotes);
        }
      }
      
      toast({
        title: 'Success',
        description: `Bulk action completed for ${selectedApplications.length} applications`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Refresh data
      const applicationsData = await getApplications(orgId);
      const enrichedApplications = applicationsData.map(app => ({
        ...app,
        candidate: candidateData[app.user_id],
        job: jobs.find(job => job.id === app.job_id)
      }));
      setApplications(enrichedApplications);
      setSelectedApplications([]);
      onBulkActionClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to perform bulk action',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleExport = () => {
    const csvData = filteredApplications.map(app => ({
      'Candidate Name': app.candidate?.full_name || 'N/A',
      'Email': app.candidate?.email || 'N/A',
      'Position': app.job?.title || 'N/A',
      'Status': app.status,
      'Application Date': format(new Date(app.application_date), 'yyyy-MM-dd'),
      'Experience': app.custom_fields?.years_of_experience || 0,
      'Score': app.total_score || 0,
      'Source': app.source || 'N/A'
    }));
    
    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    onExportClose();
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getJobTitle = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    return job ? job.title : 'Unknown Position';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <InfoIcon />;
      case 'screening': case 'interview': case 'assessment': return <TimeIcon />;
      case 'shortlisted': return <StarIcon />;
      case 'hired': return <CheckIcon />;
      case 'rejected': return <CloseIcon />;
      default: return <InfoIcon />;
    }
  };

  const handleScheduleInterview = (application: ApplicationWithCandidate) => {
    setSelectedApplicationForInterview(application);
    onScheduleInterviewOpen();
  };

  const handleInterviewScheduled = async (interview: Partial<Interview>) => {
    try {
      await createInterview(interview);
      // Refresh applications data
      const applicationsData = await getApplications(orgId);
      const enrichedApplications = applicationsData.map(app => ({
        ...app,
        candidate: candidateData[app.user_id],
        job: jobs.find(job => job.id === app.job_id)
      }));
      setApplications(enrichedApplications);
    } catch (error) {
      throw error; // Re-throw to let modal handle the error
    }
  };

  const handleBulkEmail = () => {
    if (selectedApplications.length === 0) {
      toast({
        title: 'No Selection',
        description: 'Please select candidates to send emails to.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onBulkEmailOpen();
  };

  const handleSendBulkEmails = async (emailData: any) => {
    // In a real app, this would send emails via an email service
    console.log('Sending bulk emails:', emailData);
    // Mock success
    return Promise.resolve();
  };

  // Card Component
  const CandidateCard = ({ application }: { application: ApplicationWithCandidate }) => (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
      position="relative"
    >
      <CardHeader pb={2}>
        <Flex>
          <Checkbox
            isChecked={selectedApplications.includes(application.id)}
            onChange={(e) => handleSelectApplication(application.id, e.target.checked)}
            mr={3}
          />
          <Avatar
            size="md"
            name={application.candidate?.full_name}
            src={application.candidate?.avatar_url}
            mr={3}
          />
          <Box flex="1">
            <Heading size="sm" noOfLines={1}>
              {application.candidate?.full_name || 'Unknown Candidate'}
            </Heading>
            <Text fontSize="sm" color="gray.500" noOfLines={1}>
              {application.job?.title || 'Unknown Position'}
            </Text>
            <Flex align="center" mt={1}>
              <Badge
                colorScheme={statusColorMap[application.status as keyof typeof statusColorMap]}
                variant="subtle"
                mr={2}
              >
                {getStatusIcon(application.status)}
                <Text ml={1} fontSize="xs">
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Text>
              </Badge>
              {application.total_score && (
                <Badge colorScheme="gray" variant="outline">
                  Score: {application.total_score}%
                </Badge>
              )}
            </Flex>
          </Box>
          <Menu>
            <MenuButton as={IconButton} icon={<SettingsIcon />} variant="ghost" size="sm" />
            <MenuList>
              <MenuItem icon={<ViewIcon />} onClick={() => router.push(`/applications/${application.id}`)}>
                View Details
              </MenuItem>
              <MenuItem icon={<CalendarIcon />} onClick={() => handleScheduleInterview(application)}>
                Schedule Interview
              </MenuItem>
              <MenuItem icon={<EmailIcon />}>
                Send Email
              </MenuItem>
              <MenuItem icon={<EditIcon />}>
                Move to Stage
              </MenuItem>
              <MenuItem icon={<DeleteIcon />} color="red.500">
                Reject
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </CardHeader>
      
      <CardBody pt={0}>
        <VStack align="stretch" spacing={3}>
          <Flex justify="space-between" fontSize="sm">
            <Text color="gray.500">Applied</Text>
            <Text>{formatDate(application.application_date)}</Text>
          </Flex>
          
          {application.candidate?.skills && (
            <Box>
              <Text fontSize="sm" color="gray.500" mb={1}>Skills</Text>
              <Wrap>
                {application.candidate.skills.slice(0, 3).map((skill, index) => (
                  <WrapItem key={index}>
                    <Tag size="sm" colorScheme="blue" variant="subtle">
                      <TagLabel>{skill}</TagLabel>
                    </Tag>
                  </WrapItem>
                ))}
                {application.candidate.skills.length > 3 && (
                  <WrapItem>
                    <Tag size="sm" variant="subtle">
                      <TagLabel>+{application.candidate.skills.length - 3} more</TagLabel>
                    </Tag>
                  </WrapItem>
                )}
              </Wrap>
            </Box>
          )}
          
          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color="gray.500">
              {application.custom_fields?.years_of_experience || 0} years exp.
            </Text>
            <HStack spacing={1}>
              {application.candidate?.phone && (
                <Tooltip label="Phone available">
                  <IconButton icon={<PhoneIcon />} size="xs" variant="ghost" aria-label="Phone" />
                </Tooltip>
              )}
              {application.candidate?.linkedin_url && (
                <Tooltip label="LinkedIn profile">
                  <IconButton 
                    icon={<ExternalLinkIcon />} 
                    size="xs" 
                    variant="ghost" 
                    aria-label="LinkedIn"
                    as="a"
                    href={application.candidate.linkedin_url}
                    target="_blank"
                  />
                </Tooltip>
              )}
              {application.candidate?.resume_url && (
                <Tooltip label="Resume available">
                  <IconButton 
                    icon={<DownloadIcon />} 
                    size="xs" 
                    variant="ghost" 
                    aria-label="Resume"
                    as="a"
                    href={application.candidate.resume_url}
                    target="_blank"
                  />
                </Tooltip>
              )}
            </HStack>
          </Flex>
        </VStack>
      </CardBody>
    </Card>
  );

  return (
    <Container maxW="full" p={0}>
      {/* Header with Statistics */}
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">
            {viewMode === 'candidates' ? 'Candidate Directory' : 'Candidate Pipeline'}
          </Heading>
          <ButtonGroup spacing={2}>
            <Button 
              leftIcon={<DownloadIcon />}
              variant="outline"
              onClick={onExportOpen}
            >
              Export
            </Button>
        <Button 
          colorScheme="blue" 
              leftIcon={<AddIcon />}
          onClick={() => router.push('/applications/new')}
        >
              {viewMode === 'candidates' ? 'Add Candidate' : 'New Application'}
        </Button>
          </ButtonGroup>
      </Flex>

        {/* View Mode Info */}
        {viewMode === 'candidates' ? (
          <Alert status="info" mb={6} borderRadius="lg">
            <AlertIcon />
            <AlertTitle>Candidate Directory</AlertTitle>
            <AlertDescription>
              View and manage your talent pool. Focus on candidate profiles, skills, and overall candidate database management.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert status="info" mb={6} borderRadius="lg">
            <AlertIcon />
            <AlertTitle>Application Pipeline</AlertTitle>
            <AlertDescription>
              Track application workflows and recruitment stages. Manage candidates through your hiring process from application to hire.
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <SimpleGrid columns={{ base: 2, md: 4, lg: 7 }} spacing={4} mb={6}>
          <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
            <StatLabel>{viewMode === 'candidates' ? 'Total Candidates' : 'Total'}</StatLabel>
            <StatNumber fontSize="2xl">{stats.total}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
            <StatLabel>New</StatLabel>
            <StatNumber fontSize="2xl" color="blue.500">{stats.new}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
            <StatLabel>In Progress</StatLabel>
            <StatNumber fontSize="2xl" color="orange.500">{stats.inProgress}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
            <StatLabel>Shortlisted</StatLabel>
            <StatNumber fontSize="2xl" color="teal.500">{stats.shortlisted}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
            <StatLabel>Hired</StatLabel>
            <StatNumber fontSize="2xl" color="green.500">{stats.hired}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
            <StatLabel>Rejected</StatLabel>
            <StatNumber fontSize="2xl" color="red.500">{stats.rejected}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
            <StatLabel>Avg Score</StatLabel>
            <StatNumber fontSize="2xl">{Math.round(stats.avgScore)}%</StatNumber>
          </Stat>
        </SimpleGrid>
      </Box>

      {/* Filters and Controls */}
      <Card mb={6} bg={cardBg} borderColor={borderColor}>
        <CardBody>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4} mb={4}>
            <GridItem colSpan={{ base: 1, lg: 2 }}>
              <InputGroup>
                <InputLeftElement>
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
                  placeholder={viewMode === 'candidates' ? "Search candidates, skills, experience..." : "Search candidates, positions, emails..."}
              value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
            </GridItem>
            
            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          {getApplicationStatuses().map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </Select>
        
            <Select value={filterJobId} onChange={(e) => setFilterJobId(e.target.value)}>
              <option value="all">{viewMode === 'candidates' ? 'All Positions' : 'All Positions'}</option>
          {jobs.map(job => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </Select>
          </Grid>
          
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={4}>
            <Select value={filterExperience} onChange={(e) => setFilterExperience(e.target.value)}>
              <option value="all">All Experience Levels</option>
              <option value="0-2">0-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="10+">10+ years</option>
            </Select>
            
            <Select value={filterDateRange} onChange={(e) => setFilterDateRange(e.target.value)}>
              <option value="all">{viewMode === 'candidates' ? 'All Time' : 'All Time'}</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="3months">Last 3 Months</option>
            </Select>
            
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="application_date">{viewMode === 'candidates' ? 'Sort by Join Date' : 'Sort by Application Date'}</option>
              <option value="last_activity">Sort by Last Activity</option>
              <option value="candidate_name">Sort by Name</option>
              <option value="experience">Sort by Experience</option>
              <option value="score">Sort by Score</option>
            </Select>
          </Grid>
          
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={4}>
              <Text fontSize="sm" color="gray.500">
                {filteredApplications.length} of {applications.length} {viewMode === 'candidates' ? 'candidates' : 'candidates'}
              </Text>
              {selectedApplications.length > 0 && (
                <ButtonGroup spacing={2}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                    onClick={onBulkActionOpen}
                  >
                    Bulk Actions ({selectedApplications.length})
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="purple"
            variant="outline"
                    leftIcon={<EmailIcon />}
                    onClick={handleBulkEmail}
                  >
                    Send Emails ({selectedApplications.length})
                  </Button>
                </ButtonGroup>
              )}
      </Flex>

            <HStack spacing={2}>
              <Text fontSize="sm" color="gray.500">View:</Text>
              <ButtonGroup isAttached size="sm">
                <Button
                  variant={displayMode === 'cards' ? 'solid' : 'outline'}
                  onClick={() => setDisplayMode('cards')}
                >
                  {viewMode === 'candidates' ? 'Profiles' : 'Cards'}
                </Button>
                <Button
                  variant={displayMode === 'table' ? 'solid' : 'outline'}
                  onClick={() => setDisplayMode('table')}
                >
                  Table
                </Button>
                {viewMode === 'applications' && (
                  <Button
                    variant={displayMode === 'pipeline' ? 'solid' : 'outline'}
                    onClick={() => setDisplayMode('pipeline')}
                  >
                    Pipeline
                  </Button>
                )}
              </ButtonGroup>
            </HStack>
          </Flex>
        </CardBody>
      </Card>

      {isLoading ? (
        <Box textAlign="center" py={10}>
          <Progress size="xs" isIndeterminate />
          <Text mt={4}>Loading candidates...</Text>
        </Box>
      ) : filteredApplications.length === 0 ? (
        <Alert status="info" borderRadius="lg">
          <AlertIcon />
          <AlertTitle>No candidates found!</AlertTitle>
          <AlertDescription>
            Try adjusting your filters or add new applications.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Content based on view mode */}
          {displayMode === 'cards' && (
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
                xl: "repeat(4, 1fr)"
              }}
              gap={6}
              mb={6}
            >
              {paginatedApplications.map((application) => (
                <CandidateCard key={application.id} application={application} />
              ))}
            </Grid>
          )}

          {displayMode === 'table' && (
            <Card bg={cardBg} borderColor={borderColor} mb={6}>
              <CardBody p={0}>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                        <Th>
                          <Checkbox
                            isChecked={selectedApplications.length === paginatedApplications.length}
                            isIndeterminate={selectedApplications.length > 0 && selectedApplications.length < paginatedApplications.length}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                          />
                        </Th>
                        <Th cursor="pointer" onClick={() => handleSortToggle('candidate_name')}>
                          Candidate {sortBy === 'candidate_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </Th>
                  <Th>Position</Th>
                  <Th>Status</Th>
                        <Th cursor="pointer" onClick={() => handleSortToggle('experience')}>
                          Experience {sortBy === 'experience' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </Th>
                        <Th cursor="pointer" onClick={() => handleSortToggle('score')}>
                          Score {sortBy === 'score' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </Th>
                        <Th cursor="pointer" onClick={() => handleSortToggle('application_date')}>
                          Applied {sortBy === 'application_date' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                      {paginatedApplications.map((application) => (
                        <Tr key={application.id} _hover={{ bg: hoverBg }}>
                          <Td>
                            <Checkbox
                              isChecked={selectedApplications.includes(application.id)}
                              onChange={(e) => handleSelectApplication(application.id, e.target.checked)}
                            />
                          </Td>
                          <Td>
                            <Flex align="center">
                              <Avatar
                                size="sm"
                                name={application.candidate?.full_name}
                                src={application.candidate?.avatar_url}
                                mr={3}
                              />
                              <Box>
                                <Text fontWeight="medium" noOfLines={1}>
                                  {application.candidate?.full_name || 'Unknown'}
                                </Text>
                                <Text fontSize="sm" color="gray.500" noOfLines={1}>
                                  {application.candidate?.email}
                                </Text>
                              </Box>
                            </Flex>
                          </Td>
                          <Td>
                            <Text noOfLines={1}>{getJobTitle(application.job_id)}</Text>
                    </Td>
                    <Td>
                      <Badge 
                              colorScheme={statusColorMap[application.status as keyof typeof statusColorMap]}
                              variant="subtle"
                            >
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </Td>
                          <Td>{application.custom_fields?.years_of_experience || 0} years</Td>
                          <Td>
                            {application.total_score ? (
                              <Badge colorScheme="gray" variant="outline">
                                {application.total_score}%
                              </Badge>
                            ) : (
                              '-'
                            )}
                          </Td>
                          <Td>
                            <Text fontSize="sm">{formatDate(application.application_date)}</Text>
                          </Td>
                          <Td>
                      <Menu>
                              <MenuButton as={IconButton} icon={<SettingsIcon />} variant="ghost" size="sm" />
                        <MenuList>
                                <MenuItem 
                                  icon={<ViewIcon />} 
                                  onClick={() => router.push(`/applications/${application.id}`)}
                                >
                            View Details
                          </MenuItem>
                                <MenuItem icon={<CalendarIcon />} onClick={() => handleScheduleInterview(application)}>
                                  Schedule Interview
                                </MenuItem>
                                <MenuItem icon={<EmailIcon />}>
                                  Send Email
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
              </CardBody>
            </Card>
          )}

          {displayMode === 'pipeline' && viewMode === 'applications' && (
            <Grid templateColumns={{ base: "1fr", lg: "repeat(4, 1fr)" }} gap={4} mb={6}>
              {['new', 'screening', 'interview', 'shortlisted'].map((status) => (
                <Box key={status}>
                  <Heading size="sm" mb={3} textAlign="center">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    <Badge ml={2} colorScheme={statusColorMap[status as keyof typeof statusColorMap]}>
                      {filteredApplications.filter(app => app.status === status).length}
                    </Badge>
                  </Heading>
                  <VStack spacing={3}>
                    {filteredApplications
                      .filter(app => app.status === status)
                      .slice(0, 5)
                      .map((application) => (
                        <CandidateCard key={application.id} application={application} />
                      ))}
                  </VStack>
                </Box>
              ))}
            </Grid>
          )}

          {/* Pagination */}
          <Flex justify="space-between" align="center" mt={6}>
            <HStack>
              <Text fontSize="sm" color="gray.500">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredApplications.length)} of {filteredApplications.length} candidates
              </Text>
              <Select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} w="auto" size="sm">
                <option value={12}>12 per page</option>
                <option value={24}>24 per page</option>
                <option value={48}>48 per page</option>
              </Select>
            </HStack>
            
            <HStack>
              <IconButton
                icon={<ChevronLeftIcon />}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                isDisabled={currentPage === 1}
                variant="outline"
                size="sm"
                aria-label="Previous page"
              />
              <Text fontSize="sm">
                {currentPage} of {totalPages}
              </Text>
              <IconButton
                icon={<ChevronRightIcon />}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                isDisabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                aria-label="Next page"
              />
            </HStack>
            </Flex>
        </>
      )}

      {/* Bulk Actions Modal */}
      <Modal isOpen={isBulkActionOpen} onClose={onBulkActionClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bulk Actions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Perform action on {selectedApplications.length} selected candidates:
            </Text>
            <FormControl mb={4}>
              <FormLabel>Action</FormLabel>
              <Select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)}>
                <option value="">Select an action</option>
                <option value="reject">Reject Applications</option>
                {stages.map(stage => (
                  <option key={stage.id} value={`move_to_${stage.id}`}>
                    Move to {stage.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Notes</FormLabel>
              <Textarea
                value={bulkNotes}
                onChange={(e) => setBulkNotes(e.target.value)}
                placeholder="Add notes for this action..."
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onBulkActionClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleBulkAction}
              isDisabled={!bulkAction}
            >
              Apply Action
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Export Modal */}
      <Modal isOpen={isExportOpen} onClose={onExportClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Export Candidates</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Export {filteredApplications.length} candidates to CSV file.
            </Text>
            <Text fontSize="sm" color="gray.500">
              This will include candidate names, emails, positions, status, application dates, experience, and scores.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onExportClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleExport}>
              Export CSV
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Schedule Interview Modal */}
      {selectedApplicationForInterview && (
        <ScheduleInterviewModal
          isOpen={isScheduleInterviewOpen}
          onClose={onScheduleInterviewClose}
          application={selectedApplicationForInterview}
          onSchedule={handleInterviewScheduled}
        />
      )}

      {/* Bulk Email Modal */}
      <BulkEmailModal
        isOpen={isBulkEmailOpen}
        onClose={onBulkEmailClose}
        applications={selectedApplications.map(id => 
          applications.find(app => app.id === id)!
        ).filter(Boolean)}
        onSendEmails={handleSendBulkEmails}
      />
    </Container>
  );
};

export default ApplicationsList; 