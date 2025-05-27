import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  Divider,
  Spinner,
  useToast,
  Tag,
  TagLabel,
  HStack,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Container,
  useColorModeValue,
  ButtonGroup,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
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
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  AvatarGroup,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import {
  SearchIcon,
  CalendarIcon,
  TimeIcon,
  SettingsIcon,
  AddIcon,
  ViewIcon,
  EditIcon,
  DeleteIcon,
  CopyIcon,
  ExternalLinkIcon,
  EmailIcon,
  StarIcon,
  CheckIcon,
  CloseIcon,
  WarningIcon,
  InfoIcon,
  ChevronDownIcon,
  DownloadIcon
} from '@chakra-ui/icons';
import { formatDistanceToNow, format } from 'date-fns';
import { Job, Department, JobCategory } from '../../../packages/types';
import { getJobs, getDepartments, getJobCategories, publishJob, closeJob, archiveJob } from '../../services/jobs';

type ViewMode = 'cards' | 'table' | 'compact';

const JobBoard = ({ orgId }: { orgId: string }) => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  
  // Modal states
  const { isOpen: isCloseJobOpen, onOpen: onCloseJobOpen, onClose: onCloseJobClose } = useDisclosure();
  const { isOpen: isArchiveJobOpen, onOpen: onArchiveJobOpen, onClose: onArchiveJobClose } = useDisclosure();
  
  // State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterJobType, setFilterJobType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [jobsData, departmentsData, categoriesData] = await Promise.all([
          getJobs(orgId),
          getDepartments(orgId),
          getJobCategories()
        ]);
        setJobs(jobsData);
        setDepartments(departmentsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load jobs. Please try again later.',
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

  // Filter and sort jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'all' || job.dept_id === filterDepartment;
    const matchesCategory = filterCategory === 'all' || job.category_id === filterCategory;
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesJobType = filterJobType === 'all' || job.job_type === filterJobType;
    const matchesLocation = filterLocation === 'all' || job.location.toLowerCase().includes(filterLocation.toLowerCase());
    
    return matchesSearch && matchesDepartment && matchesCategory && matchesStatus && matchesJobType && matchesLocation;
  }).sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'created_at':
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'applications':
        aValue = a.application_count || 0;
        bValue = b.application_count || 0;
        break;
      case 'views':
        aValue = a.views_count || 0;
        bValue = b.views_count || 0;
        break;
      default:
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
    }
    
    if (typeof aValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Get unique locations for filter
  const uniqueLocations = Array.from(new Set(jobs.map(job => job.location))).filter(Boolean);

  // Job statistics
  const stats = {
    total: jobs.length,
    published: jobs.filter(j => j.status === 'published').length,
    draft: jobs.filter(j => j.status === 'draft').length,
    closed: jobs.filter(j => j.status === 'closed').length,
    totalApplications: jobs.reduce((sum, job) => sum + (job.application_count || 0), 0),
    avgApplications: jobs.length > 0 ? Math.round(jobs.reduce((sum, job) => sum + (job.application_count || 0), 0) / jobs.length) : 0
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const formatFullDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'green';
      case 'draft': return 'gray';
      case 'closed': return 'red';
      case 'archived': return 'orange';
      default: return 'gray';
    }
  };

  const getJobTypeLabel = (jobType: string) => {
    switch (jobType) {
      case 'full_time': return 'Full Time';
      case 'part_time': return 'Part Time';
      case 'contract': return 'Contract';
      case 'internship': return 'Internship';
      case 'remote': return 'Remote';
      default: return jobType;
    }
  };

  const getDepartmentName = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.name : 'Unknown';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const handleJobAction = async (action: string, jobId: string) => {
    try {
      switch (action) {
        case 'publish':
          await publishJob(jobId);
          toast({
            title: 'Job Published',
            description: 'The job has been published successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          break;
        case 'close':
          setSelectedJobId(jobId);
          onCloseJobOpen();
          return;
        case 'archive':
          setSelectedJobId(jobId);
          onArchiveJobOpen();
          return;
        case 'duplicate':
          router.push(`/jobs/new?template=${jobId}`);
          return;
      }
      
      // Refresh jobs data
      const updatedJobs = await getJobs(orgId);
      setJobs(updatedJobs);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to perform action. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCloseJob = async () => {
    if (!selectedJobId) return;
    
    try {
      await closeJob(selectedJobId);
      toast({
        title: 'Job Closed',
        description: 'The job has been closed and is no longer accepting applications.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Refresh jobs data
      const updatedJobs = await getJobs(orgId);
      setJobs(updatedJobs);
      onCloseJobClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to close job. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleArchiveJob = async () => {
    if (!selectedJobId) return;
    
    try {
      await archiveJob(selectedJobId);
      toast({
        title: 'Job Archived',
        description: 'The job has been archived.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Refresh jobs data
      const updatedJobs = await getJobs(orgId);
      setJobs(updatedJobs);
      onArchiveJobClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to archive job. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Job Card Component
  const JobCard = ({ job }: { job: Job }) => (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <CardHeader pb={2}>
        <Flex justify="space-between" align="flex-start" mb={2}>
          <Box flex="1">
            <Heading size="md" mb={1} noOfLines={2}>
              {job.title}
            </Heading>
            <Text fontSize="sm" color="gray.500" mb={2}>
              {getDepartmentName(job.dept_id || '')} • {job.location}
            </Text>
        </Box>
          <Menu>
            <MenuButton as={IconButton} icon={<SettingsIcon />} variant="ghost" size="sm" />
            <MenuList>
              <MenuItem icon={<ViewIcon />} onClick={() => router.push(`/jobs/${job.id}`)}>
                View Details
              </MenuItem>
              <MenuItem icon={<EditIcon />} onClick={() => router.push(`/jobs/${job.id}/edit`)}>
                Edit Job
              </MenuItem>
              <MenuItem icon={<CopyIcon />} onClick={() => handleJobAction('duplicate', job.id)}>
                Duplicate
              </MenuItem>
              {job.status === 'draft' && (
                <MenuItem icon={<CheckIcon />} onClick={() => handleJobAction('publish', job.id)}>
                  Publish
                </MenuItem>
              )}
              {job.status === 'published' && (
                <MenuItem icon={<CloseIcon />} onClick={() => handleJobAction('close', job.id)}>
                  Close Job
                </MenuItem>
              )}
              <MenuItem icon={<DeleteIcon />} color="red.500" onClick={() => handleJobAction('archive', job.id)}>
                Archive
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        
        <HStack spacing={2} mb={3}>
          <Badge colorScheme={getStatusColor(job.status)} variant="subtle">
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Badge>
          <Badge variant="outline" fontSize="xs">
            {getJobTypeLabel(job.job_type)}
          </Badge>
          {job.is_remote && (
            <Badge colorScheme="blue" variant="outline" fontSize="xs">
              Remote
            </Badge>
          )}
          {job.is_featured && (
            <Badge colorScheme="purple" variant="subtle" fontSize="xs">
              <StarIcon mr={1} />
              Featured
            </Badge>
          )}
        </HStack>
      </CardHeader>
      
      <CardBody pt={0} flex="1">
        <VStack align="stretch" spacing={3}>
          {job.description && (
            <Text fontSize="sm" noOfLines={3}>
              {job.description}
            </Text>
          )}
          
          {job.skills_required && job.skills_required.length > 0 && (
            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>Required Skills</Text>
              <Wrap>
                {job.skills_required.slice(0, 3).map((skill, index) => (
                  <WrapItem key={index}>
                    <Tag size="sm" colorScheme="blue" variant="subtle">
                      <TagLabel>{skill}</TagLabel>
                    </Tag>
                  </WrapItem>
                ))}
                {job.skills_required.length > 3 && (
                  <WrapItem>
                    <Tag size="sm" variant="outline">
                      <TagLabel>+{job.skills_required.length - 3} more</TagLabel>
                    </Tag>
                  </WrapItem>
                )}
              </Wrap>
            </Box>
          )}
          
          {job.salary_range && (
            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>Salary Range</Text>
              <Text fontSize="sm" fontWeight="medium">
                ${job.salary_range.min?.toLocaleString()} - ${job.salary_range.max?.toLocaleString()} {job.salary_range.currency}
              </Text>
            </Box>
          )}
        </VStack>
      </CardBody>
      
      <CardFooter pt={0} mt="auto">
        <Flex justify="space-between" align="center" width="100%">
          <VStack align="flex-start" spacing={0}>
            <HStack spacing={4}>
              <HStack spacing={1}>
                <Text fontSize="xs" color="gray.500">{job.application_count || 0}</Text>
                <Text fontSize="xs" color="gray.500">applications</Text>
              </HStack>
              <HStack spacing={1}>
                <Text fontSize="xs" color="gray.500">{job.views_count || 0}</Text>
                <Text fontSize="xs" color="gray.500">views</Text>
              </HStack>
            </HStack>
            <Text fontSize="xs" color="gray.500">
              Posted {formatDate(job.posted_at || job.created_at)}
            </Text>
          </VStack>
          
          <Button 
            size="sm"
            colorScheme="blue" 
            variant="outline" 
            onClick={() => router.push(`/jobs/${job.id}`)}
          >
            View
          </Button>
        </Flex>
      </CardFooter>
    </Card>
  );

  return (
    <Container maxW="full" p={0}>
      <Box bg={bgColor} minH="100vh" pb={8}>
        <Container maxW="full" py={6}>
          {/* Header */}
          <Flex justify="space-between" align="center" mb={6}>
            <Box>
              <Heading size="lg">Job Positions</Heading>
              <Text color="gray.600">{filteredJobs.length} of {jobs.length} jobs</Text>
            </Box>
            
            <ButtonGroup spacing={2}>
              <Button 
                variant="outline"
                leftIcon={<DownloadIcon />}
              >
                Export
              </Button>
              <Button 
                colorScheme="blue" 
                leftIcon={<AddIcon />}
                onClick={() => router.push('/jobs/new')}
              >
                Post New Job
              </Button>
            </ButtonGroup>
      </Flex>

          {/* Statistics Cards */}
          <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} mb={6}>
            <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
              <StatLabel fontSize="xs">Total Jobs</StatLabel>
              <StatNumber fontSize="xl">{stats.total}</StatNumber>
            </Stat>
            <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
              <StatLabel fontSize="xs">Published</StatLabel>
              <StatNumber fontSize="xl" color="green.500">{stats.published}</StatNumber>
            </Stat>
            <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
              <StatLabel fontSize="xs">Draft</StatLabel>
              <StatNumber fontSize="xl" color="gray.500">{stats.draft}</StatNumber>
            </Stat>
            <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
              <StatLabel fontSize="xs">Closed</StatLabel>
              <StatNumber fontSize="xl" color="red.500">{stats.closed}</StatNumber>
            </Stat>
            <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
              <StatLabel fontSize="xs">Applications</StatLabel>
              <StatNumber fontSize="xl">{stats.totalApplications}</StatNumber>
            </Stat>
            <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
              <StatLabel fontSize="xs">Avg/Job</StatLabel>
              <StatNumber fontSize="xl">{stats.avgApplications}</StatNumber>
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
                      placeholder="Search jobs, descriptions, locations..."
            value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
                </GridItem>
                
                <Select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
          <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
            </option>
          ))}
        </Select>
        
                <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="closed">Closed</option>
                  <option value="archived">Archived</option>
                </Select>
              </Grid>
              
              <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={4}>
                <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
            </option>
          ))}
        </Select>
        
                <Select value={filterJobType} onChange={(e) => setFilterJobType(e.target.value)}>
                  <option value="all">All Job Types</option>
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                </Select>
                
                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="created_at">Sort by Date Created</option>
                  <option value="title">Sort by Title</option>
                  <option value="applications">Sort by Applications</option>
                  <option value="views">Sort by Views</option>
                </Select>
              </Grid>
              
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.500">
                  Showing {filteredJobs.length} of {jobs.length} jobs
                </Text>
                
                <HStack spacing={2}>
                  <Text fontSize="sm" color="gray.500">View:</Text>
                  <ButtonGroup isAttached size="sm">
                    <Button
                      variant={viewMode === 'cards' ? 'solid' : 'outline'}
                      onClick={() => setViewMode('cards')}
                    >
                      Cards
                    </Button>
                    <Button
                      variant={viewMode === 'table' ? 'solid' : 'outline'}
                      onClick={() => setViewMode('table')}
                    >
                      Table
                    </Button>
                    <Button
                      variant={viewMode === 'compact' ? 'solid' : 'outline'}
                      onClick={() => setViewMode('compact')}
                    >
                      Compact
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
                <Text>Loading jobs...</Text>
              </VStack>
        </Flex>
      ) : filteredJobs.length === 0 ? (
            <Alert status="info" borderRadius="lg">
              <AlertIcon />
              <AlertTitle>No jobs found!</AlertTitle>
              <AlertDescription>
                {jobs.length === 0 
                  ? "No jobs have been created yet. Create your first job posting!"
                  : "Try adjusting your filters or search terms."
                }
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {viewMode === 'cards' && (
        <Grid 
          templateColumns={{ 
            base: "1fr", 
            md: "repeat(2, 1fr)", 
                    lg: "repeat(3, 1fr)",
                    xl: "repeat(4, 1fr)"
          }} 
          gap={6}
        >
          {filteredJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </Grid>
              )}

              {viewMode === 'table' && (
                <Card bg={cardBg} borderColor={borderColor}>
                  <CardBody p={0}>
                    <Box overflowX="auto">
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Job Title</Th>
                            <Th>Department</Th>
                            <Th>Status</Th>
                            <Th>Applications</Th>
                            <Th>Views</Th>
                            <Th>Posted</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredJobs.map(job => (
                            <Tr key={job.id} _hover={{ bg: hoverBg }}>
                              <Td>
                                <VStack align="flex-start" spacing={1}>
                                  <Text fontWeight="medium" noOfLines={1}>{job.title}</Text>
                                  <Text fontSize="sm" color="gray.500">{job.location}</Text>
                                </VStack>
                              </Td>
                              <Td>
                                <Text fontSize="sm">{getDepartmentName(job.dept_id || '')}</Text>
                              </Td>
                              <Td>
                                <Badge colorScheme={getStatusColor(job.status)} variant="subtle">
                                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Badge>
                              </Td>
                              <Td>
                                <Text>{job.application_count || 0}</Text>
                              </Td>
                              <Td>
                                <Text>{job.views_count || 0}</Text>
                              </Td>
                              <Td>
                                <Text fontSize="sm">{formatDate(job.posted_at || job.created_at)}</Text>
                              </Td>
                              <Td>
                                <Menu>
                                  <MenuButton as={IconButton} icon={<SettingsIcon />} variant="ghost" size="sm" />
                                  <MenuList>
                                    <MenuItem icon={<ViewIcon />} onClick={() => router.push(`/jobs/${job.id}`)}>
                                      View Details
                                    </MenuItem>
                                    <MenuItem icon={<EditIcon />} onClick={() => router.push(`/jobs/${job.id}/edit`)}>
                                      Edit Job
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

              {viewMode === 'compact' && (
                <VStack spacing={2} align="stretch">
                  {filteredJobs.map(job => (
                    <Card key={job.id} bg={cardBg} borderColor={borderColor} variant="outline">
                      <CardBody py={3}>
                        <Flex justify="space-between" align="center">
                          <HStack spacing={4} flex="1">
                            <Box flex="1">
                              <HStack spacing={2} mb={1}>
                                <Text fontWeight="medium" noOfLines={1}>{job.title}</Text>
                                <Badge colorScheme={getStatusColor(job.status)} variant="subtle" size="sm">
                                  {job.status}
                                </Badge>
                              </HStack>
                              <Text fontSize="sm" color="gray.500">
                                {getDepartmentName(job.dept_id || '')} • {job.location} • {getJobTypeLabel(job.job_type)}
                              </Text>
                            </Box>
                            <VStack spacing={0} align="center" minW="80px">
                              <Text fontSize="sm" fontWeight="medium">{job.application_count || 0}</Text>
                              <Text fontSize="xs" color="gray.500">applications</Text>
                            </VStack>
                            <VStack spacing={0} align="center" minW="80px">
                              <Text fontSize="sm" fontWeight="medium">{job.views_count || 0}</Text>
                              <Text fontSize="xs" color="gray.500">views</Text>
                            </VStack>
                            <Text fontSize="sm" color="gray.500" minW="100px">
                              {formatDate(job.posted_at || job.created_at)}
                    </Text>
                          </HStack>
                          <ButtonGroup size="sm" spacing={2}>
                            <Button variant="outline" onClick={() => router.push(`/jobs/${job.id}`)}>
                              View
                            </Button>
                            <Button onClick={() => router.push(`/jobs/${job.id}/edit`)}>
                              Edit
                    </Button>
                          </ButtonGroup>
                  </Flex>
                      </CardBody>
              </Card>
          ))}
                </VStack>
              )}
            </>
      )}
        </Container>
    </Box>

      {/* Close Job Modal */}
      <Modal isOpen={isCloseJobOpen} onClose={onCloseJobClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Close Job</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="warning" mb={4}>
              <AlertIcon />
              <AlertTitle>This will stop accepting new applications!</AlertTitle>
              <AlertDescription>
                The job will be marked as closed and candidates won't be able to apply anymore.
              </AlertDescription>
            </Alert>
            <Text>Are you sure you want to close this job posting?</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseJobClose}>
              Cancel
            </Button>
            <Button colorScheme="orange" onClick={handleCloseJob}>
              Close Job
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Archive Job Modal */}
      <Modal isOpen={isArchiveJobOpen} onClose={onArchiveJobClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Archive Job</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="warning" mb={4}>
              <AlertIcon />
              <AlertTitle>This will archive the job!</AlertTitle>
              <AlertDescription>
                Archived jobs are hidden from the main list and can be restored later if needed.
              </AlertDescription>
            </Alert>
            <Text>Are you sure you want to archive this job posting?</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onArchiveJobClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleArchiveJob}>
              Archive Job
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default JobBoard; 