import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  Heading,
  Text,
  Button,
  Grid,
  Flex,
  Badge,
  Input,
  Select,
  Card,
  CardBody,
  CardHeader,
  useToast,
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
  Avatar,
  Container,
  useColorModeValue,
  ButtonGroup,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  InputGroup,
  InputLeftElement,
  Center,
  CircularProgress,
  CircularProgressLabel,
  useBreakpointValue
} from '@chakra-ui/react';
import {
  SearchIcon,
  AddIcon,
  ViewIcon,
  EditIcon,
  SettingsIcon,
  DownloadIcon,
  StarIcon,
  EmailIcon,
  CalendarIcon
} from '@chakra-ui/icons';
import { format } from 'date-fns';
import SimpleDashboardLayout from '@/components/layout/SimpleDashboardLayout';
import { GetServerSideProps } from 'next';

// Interfaces
interface PerformanceReview {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_avatar?: string;
  department: string;
  position: string;
  manager_name: string;
  review_type: 'annual' | 'quarterly' | 'mid_year' | 'probationary';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  overall_rating: number;
  competency_scores: Record<string, number>;
  goals_achievement: number;
  strengths: string[];
  areas_for_improvement: string[];
  manager_comments: string;
  due_date: string;
  created_at: string;
}

interface Goal {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_avatar?: string;
  department: string;
  title: string;
  description: string;
  category: 'performance' | 'development' | 'strategic' | 'personal';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'active' | 'completed' | 'paused';
  progress: number;
  target_date: string;
  manager_name: string;
  key_results: string[];
  created_at: string;
}

// Mock data
const MOCK_REVIEWS: PerformanceReview[] = [
  {
    id: 'pr1',
    employee_id: 'emp1',
    employee_name: 'Sarah Williams',
    employee_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612d5ca?w=150',
    department: 'Engineering',
    position: 'Frontend Developer',
    manager_name: 'Diana Wong',
    review_type: 'annual',
    status: 'completed',
    overall_rating: 4.2,
    competency_scores: {
      'Technical Skills': 4.5,
      'Communication': 4.0,
      'Leadership': 3.8,
      'Problem Solving': 4.3
    },
    goals_achievement: 85,
    strengths: ['Strong technical expertise', 'Excellent problem-solving skills'],
    areas_for_improvement: ['Public speaking', 'Project management skills'],
    manager_comments: 'Sarah has shown exceptional growth this year.',
    due_date: '2024-02-01',
    created_at: '2024-01-15T09:00:00Z'
  },
  {
    id: 'pr2',
    employee_id: 'emp2',
    employee_name: 'James Peterson',
    employee_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    department: 'Sales',
    position: 'Account Executive',
    manager_name: 'Robert Chen',
    review_type: 'quarterly',
    status: 'in_progress',
    overall_rating: 0,
    competency_scores: {},
    goals_achievement: 0,
    strengths: [],
    areas_for_improvement: [],
    manager_comments: '',
    due_date: '2024-07-15',
    created_at: '2024-06-01T09:00:00Z'
  }
];

const MOCK_GOALS: Goal[] = [
  {
    id: 'g1',
    employee_id: 'emp1',
    employee_name: 'Sarah Williams',
    employee_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612d5ca?w=150',
    department: 'Engineering',
    title: 'Lead Frontend Architecture Migration',
    description: 'Migrate the main application from React 16 to React 18',
    category: 'performance',
    priority: 'high',
    status: 'active',
    progress: 75,
    target_date: '2024-08-31',
    manager_name: 'Diana Wong',
    key_results: [
      'Complete component migration (100%)',
      'Implement new state management (90%)',
      'Update documentation (60%)'
    ],
    created_at: '2024-01-15T09:00:00Z'
  },
  {
    id: 'g2',
    employee_id: 'emp2',
    employee_name: 'James Peterson',
    employee_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    department: 'Sales',
    title: 'Achieve Q2 Sales Target',
    description: 'Reach $500K in sales revenue for Q2 2024',
    category: 'performance',
    priority: 'critical',
    status: 'active',
    progress: 80,
    target_date: '2024-06-30',
    manager_name: 'Robert Chen',
    key_results: [
      'Close 20 new deals (16/20)',
      'Maintain 95% customer satisfaction (97%)'
    ],
    created_at: '2024-04-01T09:00:00Z'
  }
];

const PerformanceManagementPage = () => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // State
  const [reviews, setReviews] = useState<PerformanceReview[]>(MOCK_REVIEWS);
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);
  const [selectedTab, setSelectedTab] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  
  // Modal states
  const { isOpen: isReviewOpen, onOpen: onReviewOpen, onClose: onReviewClose } = useDisclosure();
  const { isOpen: isGoalOpen, onOpen: onGoalOpen, onClose: onGoalClose } = useDisclosure();
  const { isOpen: isCreateReviewOpen, onOpen: onCreateReviewOpen, onClose: onCreateReviewClose } = useDisclosure();
  const { isOpen: isCreateGoalOpen, onOpen: onCreateGoalOpen, onClose: onCreateGoalClose } = useDisclosure();

  // Statistics
  const stats = {
    totalReviews: reviews.length,
    completedReviews: reviews.filter(r => r.status === 'completed').length,
    overdueReviews: reviews.filter(r => r.status === 'overdue').length,
    totalGoals: goals.length,
    activeGoals: goals.filter(g => g.status === 'active').length,
    completedGoals: goals.filter(g => g.status === 'completed').length,
    avgGoalProgress: Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length),
    avgRating: reviews.filter(r => r.overall_rating > 0).reduce((sum, r) => sum + r.overall_rating, 0) / reviews.filter(r => r.overall_rating > 0).length || 0
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in_progress': return 'blue';
      case 'pending': return 'yellow';
      case 'overdue': return 'red';
      case 'active': return 'blue';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'blue';
      case 'development': return 'purple';
      case 'strategic': return 'teal';
      case 'personal': return 'pink';
      default: return 'gray';
    }
  };

  const handleViewReview = (review: PerformanceReview) => {
    setSelectedReview(review);
    onReviewOpen();
  };

  const handleViewGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    onGoalOpen();
  };

  const getDepartments = () => {
    return Array.from(new Set([...reviews.map(r => r.department), ...goals.map(g => g.department)]));
  };

  // Dashboard Tab Component
  const DashboardTab = () => (
    <VStack spacing={6} align="stretch">
      {/* Key Metrics */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody textAlign="center">
            <CircularProgress value={(stats.completedReviews / stats.totalReviews) * 100} color="green.400" size="80px">
              <CircularProgressLabel fontSize="sm">{Math.round((stats.completedReviews / stats.totalReviews) * 100)}%</CircularProgressLabel>
            </CircularProgress>
            <Text fontWeight="medium" mt={2}>Review Completion</Text>
            <Text fontSize="sm" color="gray.500">{stats.completedReviews}/{stats.totalReviews} completed</Text>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody textAlign="center">
            <CircularProgress value={stats.avgGoalProgress} color="blue.400" size="80px">
              <CircularProgressLabel fontSize="sm">{stats.avgGoalProgress}%</CircularProgressLabel>
            </CircularProgress>
            <Text fontWeight="medium" mt={2}>Goal Progress</Text>
            <Text fontSize="sm" color="gray.500">{stats.activeGoals} active goals</Text>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody textAlign="center">
            <VStack spacing={2}>
              <HStack spacing={1}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon 
                    key={star} 
                    color={star <= Math.round(stats.avgRating) ? "yellow.400" : "gray.300"} 
                    boxSize={4}
                  />
                ))}
              </HStack>
              <Text fontSize="2xl" fontWeight="bold">{stats.avgRating.toFixed(1)}</Text>
            </VStack>
            <Text fontWeight="medium" mt={2}>Avg Rating</Text>
            <Text fontSize="sm" color="gray.500">Performance score</Text>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color={stats.overdueReviews > 0 ? "red.500" : "green.500"}>
              {stats.overdueReviews}
            </Text>
            <Text fontWeight="medium" mt={2}>Overdue Reviews</Text>
            <Text fontSize="sm" color="gray.500">Need attention</Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Recent Activities */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Card bg={cardBg} borderColor={borderColor}>
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Heading size="md">Recent Reviews</Heading>
              <Button size="sm" variant="outline" onClick={() => setSelectedTab(1)}>
                View All
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {reviews.slice(0, 3).map((review) => (
                <Flex key={review.id} justify="space-between" align="center" p={3} borderRadius="md" bg={useColorModeValue('gray.50', 'gray.700')}>
                  <HStack spacing={3}>
                    <Avatar size="sm" name={review.employee_name} src={review.employee_avatar} />
                    <Box>
                      <Text fontWeight="medium" fontSize="sm">{review.employee_name}</Text>
                      <Text fontSize="xs" color="gray.500">{review.review_type} review</Text>
                    </Box>
                  </HStack>
                  <VStack spacing={1} align="end">
                    <Badge colorScheme={getStatusColor(review.status)} variant="subtle" fontSize="xs">
                      {review.status}
                    </Badge>
                    <Text fontSize="xs" color="gray.500">{formatDate(review.due_date)}</Text>
                  </VStack>
                </Flex>
              ))}
            </VStack>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderColor={borderColor}>
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Heading size="md">Active Goals</Heading>
              <Button size="sm" variant="outline" onClick={() => setSelectedTab(2)}>
                View All
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {goals.filter(g => g.status === 'active').slice(0, 3).map((goal) => (
                <Flex key={goal.id} justify="space-between" align="center" p={3} borderRadius="md" bg={useColorModeValue('gray.50', 'gray.700')}>
                  <Box flex={1}>
                    <Text fontWeight="medium" fontSize="sm" noOfLines={1}>{goal.title}</Text>
                    <HStack spacing={2} mt={1}>
                      <Badge colorScheme={getCategoryColor(goal.category)} variant="subtle" fontSize="xs">
                        {goal.category}
                      </Badge>
                      <Badge colorScheme={getPriorityColor(goal.priority)} variant="subtle" fontSize="xs">
                        {goal.priority}
                      </Badge>
                    </HStack>
                  </Box>
                  <VStack spacing={1} align="end" minW="80px">
                    <Text fontSize="sm" fontWeight="medium">{goal.progress}%</Text>
                    <Progress value={goal.progress} colorScheme="blue" size="sm" width="60px" />
                  </VStack>
                </Flex>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </VStack>
  );

  return (
    <>
      <Head>
        <title>Performance Management | HR Portal</title>
        <meta name="description" content="Comprehensive performance management and goal tracking system" />
      </Head>
      
      <SimpleDashboardLayout>
        <Box bg={bgColor} minH="100vh" pb={8}>
          <Container maxW="full" py={6}>
            {/* Breadcrumb */}
            <Breadcrumb mb={6} fontSize="sm">
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => router.push('/dashboard')}>
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink>HR Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>Performance Management</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            {/* Header */}
            <Flex justify="space-between" align="center" mb={6} direction={isMobile ? 'column' : 'row'} gap={4}>
              <Box>
                <Heading size="lg">Performance Management</Heading>
                <Text color="gray.600">Track performance reviews, goals, and employee development</Text>
              </Box>
              
              <ButtonGroup spacing={2} size={isMobile ? 'sm' : 'md'}>
                <Button variant="outline" leftIcon={<DownloadIcon />}>
                  Export Reports
                </Button>
                <Button colorScheme="blue" leftIcon={<AddIcon />} onClick={onCreateReviewOpen}>
                  New Review
                </Button>
                <Button colorScheme="green" leftIcon={<AddIcon />} onClick={onCreateGoalOpen}>
                  New Goal
                </Button>
              </ButtonGroup>
            </Flex>

            {/* Statistics Cards */}
            <SimpleGrid columns={{ base: 2, md: 4, lg: 7 }} spacing={4} mb={6}>
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Total Reviews</StatLabel>
                <StatNumber fontSize="xl">{stats.totalReviews}</StatNumber>
                <StatHelpText>This year</StatHelpText>
              </Stat>
              
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Completed</StatLabel>
                <StatNumber fontSize="xl" color="green.500">{stats.completedReviews}</StatNumber>
                <StatHelpText>{Math.round((stats.completedReviews / stats.totalReviews) * 100)}% done</StatHelpText>
              </Stat>
              
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Overdue</StatLabel>
                <StatNumber fontSize="xl" color="red.500">{stats.overdueReviews}</StatNumber>
                <StatHelpText>Need attention</StatHelpText>
              </Stat>
              
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Active Goals</StatLabel>
                <StatNumber fontSize="xl" color="purple.500">{stats.activeGoals}</StatNumber>
                <StatHelpText>In progress</StatHelpText>
              </Stat>
              
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Avg Progress</StatLabel>
                <StatNumber fontSize="xl">{stats.avgGoalProgress}%</StatNumber>
                <StatHelpText>Goal completion</StatHelpText>
              </Stat>
              
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Avg Rating</StatLabel>
                <StatNumber fontSize="xl">{stats.avgRating.toFixed(1)}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  +0.2 vs last period
                </StatHelpText>
              </Stat>
              
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Goal Success</StatLabel>
                <StatNumber fontSize="xl">{Math.round((stats.completedGoals / stats.totalGoals) * 100)}%</StatNumber>
                <StatHelpText>Completion rate</StatHelpText>
              </Stat>
            </SimpleGrid>

            {/* Main Content Tabs */}
            <Tabs index={selectedTab} onChange={setSelectedTab}>
              <TabList mb={6}>
                <Tab>Dashboard</Tab>
                <Tab>Reviews</Tab>
                <Tab>Goals</Tab>
                <Tab>Analytics</Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0}>
                  <DashboardTab />
                </TabPanel>

                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    {/* Filters */}
                    <Card bg={cardBg} borderColor={borderColor}>
                      <CardBody>
                        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                          <InputGroup>
                            <InputLeftElement>
                              <SearchIcon color="gray.400" />
                            </InputLeftElement>
                            <Input
                              placeholder="Search reviews..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </InputGroup>
                          
                          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="overdue">Overdue</option>
                          </Select>
                          
                          <Select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
                            <option value="all">All Departments</option>
                            {getDepartments().map(dept => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </Select>
                        </Grid>
                      </CardBody>
                    </Card>

                    {/* Reviews Table */}
                    <Card bg={cardBg} borderColor={borderColor}>
                      <CardHeader>
                        <Flex justify="space-between" align="center">
                          <Heading size="md">Performance Reviews</Heading>
                          <Text fontSize="sm" color="gray.500">{reviews.length} reviews</Text>
                        </Flex>
                      </CardHeader>
                      <CardBody p={0}>
                        <Box overflowX="auto">
                          <Table variant="simple">
                            <Thead>
                              <Tr>
                                <Th>Employee</Th>
                                <Th>Review Type</Th>
                                <Th>Rating</Th>
                                <Th>Status</Th>
                                <Th>Due Date</Th>
                                <Th>Actions</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {reviews.map((review) => (
                                <Tr key={review.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                                  <Td>
                                    <HStack spacing={3}>
                                      <Avatar size="sm" name={review.employee_name} src={review.employee_avatar} />
                                      <Box>
                                        <Text fontWeight="medium">{review.employee_name}</Text>
                                        <Text fontSize="sm" color="gray.500">{review.department}</Text>
                                      </Box>
                                    </HStack>
                                  </Td>
                                  <Td>
                                    <Badge colorScheme="blue" variant="subtle" textTransform="capitalize">
                                      {review.review_type.replace('_', ' ')}
                                    </Badge>
                                  </Td>
                                  <Td>
                                    {review.overall_rating > 0 ? (
                                      <HStack spacing={1}>
                                        <Text fontWeight="medium">{review.overall_rating.toFixed(1)}</Text>
                                        <StarIcon color="yellow.400" boxSize={3} />
                                      </HStack>
                                    ) : (
                                      <Text color="gray.400" fontSize="sm">-</Text>
                                    )}
                                  </Td>
                                  <Td>
                                    <Badge colorScheme={getStatusColor(review.status)} variant="subtle">
                                      {review.status.replace('_', ' ')}
                                    </Badge>
                                  </Td>
                                  <Td>
                                    <Text fontSize="sm">{formatDate(review.due_date)}</Text>
                                  </Td>
                                  <Td>
                                    <Menu>
                                      <MenuButton as={IconButton} icon={<SettingsIcon />} variant="ghost" size="sm" aria-label="Options menu" />
                                      <MenuList>
                                        <MenuItem icon={<ViewIcon />} onClick={() => handleViewReview(review)}>
                                          View Details
                                        </MenuItem>
                                        <MenuItem icon={<StarIcon />}>
                                          Add Rating
                                        </MenuItem>
                                        <MenuItem icon={<CalendarIcon />}>
                                          Reschedule
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
                  </VStack>
                </TabPanel>

                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    {/* Goals Grid */}
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {goals.map((goal) => (
                        <Card key={goal.id} bg={cardBg} borderColor={borderColor} _hover={{ transform: 'translateY(-2px)', shadow: 'md' }} transition="all 0.2s">
                          <CardHeader pb={2}>
                            <Flex justify="space-between" align="flex-start">
                              <VStack align="flex-start" spacing={1} flex={1}>
                                <Heading size="sm" noOfLines={2}>{goal.title}</Heading>
                                <HStack spacing={2}>
                                  <Badge colorScheme={getCategoryColor(goal.category)} variant="subtle" fontSize="xs">
                                    {goal.category}
                                  </Badge>
                                  <Badge colorScheme={getPriorityColor(goal.priority)} variant="subtle" fontSize="xs">
                                    {goal.priority}
                                  </Badge>
                                </HStack>
                              </VStack>
                              <IconButton
                                icon={<ViewIcon />}
                                size="sm"
                                variant="ghost"
                                aria-label="View review details"
                                onClick={() => handleViewGoal(goal)}
                              />
                            </Flex>
                          </CardHeader>
                          <CardBody pt={0}>
                            <VStack spacing={4} align="stretch">
                              <HStack spacing={3}>
                                <Avatar size="sm" name={goal.employee_name} src={goal.employee_avatar} />
                                <Box>
                                  <Text fontSize="sm" fontWeight="medium">{goal.employee_name}</Text>
                                  <Text fontSize="xs" color="gray.500">{goal.department}</Text>
                                </Box>
                              </HStack>
                              
                              <Box>
                                <Flex justify="space-between" mb={1}>
                                  <Text fontSize="sm" color="gray.600">Progress</Text>
                                  <Text fontSize="sm" fontWeight="medium">{goal.progress}%</Text>
                                </Flex>
                                <Progress value={goal.progress} colorScheme="blue" size="md" />
                              </Box>
                              
                              <Flex justify="space-between" align="center">
                                <Badge colorScheme={getStatusColor(goal.status)} variant="subtle">
                                  {goal.status}
                                </Badge>
                                <Text fontSize="xs" color="gray.500">
                                  Due: {formatDate(goal.target_date)}
                                </Text>
                              </Flex>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </VStack>
                </TabPanel>

                <TabPanel p={0}>
                  <Center py={20}>
                    <VStack spacing={4}>
                      <Text color="gray.500">Performance Analytics</Text>
                      <Text fontSize="sm" color="gray.400">
                        Advanced analytics and reporting dashboard coming soon...
                      </Text>
                      <Button variant="outline" size="sm">
                        View Reports
                      </Button>
                    </VStack>
                  </Center>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Container>
        </Box>

        {/* Review Details Modal */}
        <Modal isOpen={isReviewOpen} onClose={onReviewClose} size="4xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Performance Review Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedReview && (
                <VStack spacing={6} align="stretch">
                  <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                    <Stat textAlign="center">
                      <StatLabel>Overall Rating</StatLabel>
                      <StatNumber>{selectedReview.overall_rating > 0 ? selectedReview.overall_rating.toFixed(1) : 'N/A'}</StatNumber>
                    </Stat>
                    <Stat textAlign="center">
                      <StatLabel>Review Type</StatLabel>
                      <StatNumber fontSize="lg" textTransform="capitalize">
                        {selectedReview.review_type.replace('_', ' ')}
                      </StatNumber>
                    </Stat>
                    <Stat textAlign="center">
                      <StatLabel>Status</StatLabel>
                      <Badge colorScheme={getStatusColor(selectedReview.status)} variant="subtle" fontSize="lg">
                        {selectedReview.status.replace('_', ' ')}
                      </Badge>
                    </Stat>
                  </Grid>

                  {Object.keys(selectedReview.competency_scores).length > 0 && (
                    <Box>
                      <Text fontWeight="medium" mb={3}>Competency Scores</Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        {Object.entries(selectedReview.competency_scores).map(([competency, score]) => (
                          <Box key={competency}>
                            <Flex justify="space-between" mb={1}>
                              <Text fontSize="sm">{competency}</Text>
                              <Text fontSize="sm" fontWeight="medium">{score.toFixed(1)}</Text>
                            </Flex>
                            <Progress value={(score / 5) * 100} colorScheme="blue" size="sm" />
                          </Box>
                        ))}
                      </SimpleGrid>
                    </Box>
                  )}

                  {selectedReview.strengths.length > 0 && (
                    <Box>
                      <Text fontWeight="medium" mb={2}>Strengths</Text>
                      <VStack align="stretch" spacing={1}>
                        {selectedReview.strengths.map((strength, index) => (
                          <Text key={index} fontSize="sm">• {strength}</Text>
                        ))}
                      </VStack>
                    </Box>
                  )}

                  {selectedReview.areas_for_improvement.length > 0 && (
                    <Box>
                      <Text fontWeight="medium" mb={2}>Areas for Improvement</Text>
                      <VStack align="stretch" spacing={1}>
                        {selectedReview.areas_for_improvement.map((area, index) => (
                          <Text key={index} fontSize="sm">• {area}</Text>
                        ))}
                      </VStack>
                    </Box>
                  )}

                  {selectedReview.manager_comments && (
                    <Box>
                      <Text fontWeight="medium" mb={2}>Manager Comments</Text>
                      <Text fontSize="sm" color="gray.600">{selectedReview.manager_comments}</Text>
                    </Box>
                  )}
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onReviewClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Goal Details Modal */}
        <Modal isOpen={isGoalOpen} onClose={onGoalClose} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Goal Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedGoal && (
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Heading size="md" mb={2}>{selectedGoal.title}</Heading>
                    <Text color="gray.600">{selectedGoal.description}</Text>
                  </Box>

                  <Box>
                    <Text fontWeight="medium" mb={2}>Key Results</Text>
                    <VStack align="stretch" spacing={1}>
                      {selectedGoal.key_results.map((result, index) => (
                        <Text key={index} fontSize="sm">• {result}</Text>
                      ))}
                    </VStack>
                  </Box>

                  <Box>
                    <Flex justify="space-between" mb={1}>
                      <Text fontSize="sm" color="gray.600">Progress</Text>
                      <Text fontSize="sm" fontWeight="medium">{selectedGoal.progress}%</Text>
                    </Flex>
                    <Progress value={selectedGoal.progress} colorScheme="blue" size="lg" />
                  </Box>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <ButtonGroup spacing={2}>
                <Button variant="ghost" onClick={onGoalClose}>
                  Close
                </Button>
                <Button colorScheme="blue">
                  Edit Goal
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Create Review Modal */}
        <Modal isOpen={isCreateReviewOpen} onClose={onCreateReviewClose} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Performance Review</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Employee</FormLabel>
                  <Select placeholder="Select employee">
                    <option value="emp1">Sarah Williams - Engineering</option>
                    <option value="emp2">James Peterson - Sales</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Review Type</FormLabel>
                  <Select placeholder="Select review type">
                    <option value="annual">Annual Review</option>
                    <option value="quarterly">Quarterly Review</option>
                    <option value="mid_year">Mid-Year Review</option>
                    <option value="probationary">Probationary Review</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Due Date</FormLabel>
                  <Input type="date" />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <ButtonGroup spacing={2}>
                <Button variant="ghost" onClick={onCreateReviewClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue">
                  Create Review
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Create Goal Modal */}
        <Modal isOpen={isCreateGoalOpen} onClose={onCreateGoalClose} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Goal</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Goal Title</FormLabel>
                  <Input placeholder="Enter goal title" />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea placeholder="Describe the goal and success criteria" rows={3} />
                </FormControl>
                
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                  <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Select>
                      <option value="performance">Performance</option>
                      <option value="development">Development</option>
                      <option value="strategic">Strategic</option>
                      <option value="personal">Personal</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Priority</FormLabel>
                    <Select>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Target Date</FormLabel>
                    <Input type="date" />
                  </FormControl>
                </Grid>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <ButtonGroup spacing={2}>
                <Button variant="ghost" onClick={onCreateGoalClose}>
                  Cancel
                </Button>
                <Button colorScheme="green">
                  Create Goal
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </SimpleDashboardLayout>
    </>
  );
};

export default PerformanceManagementPage;

// Force server-side rendering to prevent SSR issues
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      timestamp: new Date().toISOString(),
    },
  };
}; 
