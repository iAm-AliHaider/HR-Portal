import { useState } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import {
  SearchIcon,
  AddIcon,
  ViewIcon,
  EditIcon,
  SettingsIcon,
  DownloadIcon,
  CheckIcon,
  TimeIcon,
  WarningIcon,
  CheckCircleIcon,
  EmailIcon,
  AttachmentIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
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
  SimpleGrid,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Container,
  useColorModeValue,
  ButtonGroup,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
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
  Tag,
  TagLabel,
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
} from "@chakra-ui/react";
import { format, formatDistanceToNow } from "date-fns";
import { GetServerSideProps } from "next";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";

// Enhanced Task Interface
interface EnhancedOnboardingTask {
  id: string;
  org_id: string;
  user_id: string;
  title: string;
  description: string;
  category:
    | "documentation"
    | "training"
    | "equipment"
    | "systems"
    | "introductions"
    | "compliance";
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "in_progress" | "completed";
  estimated_duration: number;
  assigned_to?: string;
  assigned_to_name?: string;
  due_date: string;
  created_at: string;
  completed_at?: string;
  completed_by?: string;
  completed_by_name?: string;
  completion_notes?: string;
  employee_name?: string;
  department?: string;
  program_name?: string;
  is_overdue?: boolean;
  resources?: {
    name: string;
    url: string;
    type: "document" | "video" | "form" | "link";
  }[];
}

// Mock data
const MOCK_TASKS: EnhancedOnboardingTask[] = [
  {
    id: "task1",
    org_id: "org1",
    user_id: "emp1",
    title: "Complete I-9 Employment Eligibility Verification",
    description:
      "Submit required documents for employment verification with HR",
    category: "compliance",
    priority: "critical",
    status: "completed",
    estimated_duration: 15,
    due_date: "2024-05-21T17:00:00Z",
    created_at: "2024-05-20T08:00:00Z",
    completed_at: "2024-05-21T10:30:00Z",
    completed_by: "emp1",
    completed_by_name: "Sarah Williams",
    completion_notes: "Documents submitted and verified",
    employee_name: "Sarah Williams",
    department: "Engineering",
    program_name: "Engineering Onboarding",
    assigned_to: "hr1",
    assigned_to_name: "Alice Johnson",
    resources: [
      { name: "I-9 Form", url: "#", type: "form" },
      { name: "Acceptable Documents List", url: "#", type: "document" },
    ],
  },
  {
    id: "task2",
    org_id: "org1",
    user_id: "emp1",
    title: "Setup Development Environment",
    description:
      "Install required development tools, IDEs, and access to repositories",
    category: "systems",
    priority: "high",
    status: "completed",
    estimated_duration: 120,
    due_date: "2024-05-22T17:00:00Z",
    created_at: "2024-05-20T08:00:00Z",
    assigned_to: "buddy1",
    assigned_to_name: "Carlos Rodriguez",
    completed_at: "2024-05-22T15:45:00Z",
    completed_by: "emp1",
    completed_by_name: "Sarah Williams",
    completion_notes:
      "All tools installed successfully, repositories accessible",
    employee_name: "Sarah Williams",
    department: "Engineering",
    program_name: "Engineering Onboarding",
    resources: [
      { name: "Dev Setup Guide", url: "#", type: "document" },
      { name: "Tool Installation Video", url: "#", type: "video" },
    ],
  },
  {
    id: "task3",
    org_id: "org1",
    user_id: "emp1",
    title: "Security Training Module",
    description:
      "Complete mandatory cybersecurity awareness training and pass the assessment",
    category: "training",
    priority: "high",
    status: "in_progress",
    estimated_duration: 60,
    due_date: "2024-05-24T17:00:00Z",
    created_at: "2024-05-20T08:00:00Z",
    employee_name: "Sarah Williams",
    department: "Engineering",
    program_name: "Engineering Onboarding",
    assigned_to: "security1",
    assigned_to_name: "Security Team",
    resources: [
      { name: "Security Training Portal", url: "#", type: "link" },
      { name: "Security Policy Document", url: "#", type: "document" },
    ],
  },
  {
    id: "task4",
    org_id: "org1",
    user_id: "emp2",
    title: "CRM System Training",
    description: "Complete comprehensive training on the sales CRM system",
    category: "training",
    priority: "high",
    status: "completed",
    estimated_duration: 90,
    due_date: "2024-05-23T17:00:00Z",
    created_at: "2024-05-22T08:00:00Z",
    completed_at: "2024-05-23T14:20:00Z",
    completed_by: "emp2",
    completed_by_name: "James Peterson",
    completion_notes: "Training completed with 95% score on assessment",
    employee_name: "James Peterson",
    department: "Sales",
    program_name: "Sales Team Orientation",
    assigned_to: "sales_trainer1",
    assigned_to_name: "Sales Training Team",
  },
  {
    id: "task5",
    org_id: "org1",
    user_id: "emp3",
    title: "Hardware Setup",
    description:
      "Receive and configure laptop, monitor, and other essential equipment",
    category: "equipment",
    priority: "critical",
    status: "pending",
    estimated_duration: 45,
    due_date: "2024-05-20T17:00:00Z",
    created_at: "2024-05-15T08:00:00Z",
    employee_name: "Lisa Chen",
    department: "Engineering",
    program_name: "Engineering Onboarding",
    assigned_to: "it1",
    assigned_to_name: "IT Support",
    is_overdue: true,
  },
];

const OnboardingTasksPage = () => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.900");

  // State
  const [tasks, setTasks] = useState<EnhancedOnboardingTask[]>(MOCK_TASKS);
  const [selectedTab, setSelectedTab] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] =
    useState<EnhancedOnboardingTask | null>(null);

  // Modal states
  const {
    isOpen: isTaskOpen,
    onOpen: onTaskOpen,
    onClose: onTaskClose,
  } = useDisclosure();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  // Statistics
  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "completed").length,
    pendingTasks: tasks.filter((t) => t.status === "pending").length,
    inProgressTasks: tasks.filter((t) => t.status === "in_progress").length,
    overdueTasks: tasks.filter(
      (t) =>
        t.is_overdue ||
        (t.status !== "completed" && new Date(t.due_date) < new Date()),
    ).length,
  };

  const completionRate =
    tasks.length > 0
      ? Math.round((stats.completedTasks / tasks.length) * 100)
      : 0;

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      !searchTerm ||
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.employee_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || task.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const formatRelativeDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "green";
      case "in_progress":
        return "blue";
      case "pending":
        return "yellow";
      default:
        return "gray";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "red";
      case "high":
        return "orange";
      case "medium":
        return "yellow";
      case "low":
        return "green";
      default:
        return "gray";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "documentation":
        return "📄";
      case "training":
        return "🎓";
      case "equipment":
        return "💻";
      case "systems":
        return "⚙️";
      case "introductions":
        return "👥";
      case "compliance":
        return "✅";
      default:
        return "📋";
    }
  };

  const handleViewTask = (task: EnhancedOnboardingTask) => {
    setSelectedTask(task);
    onTaskOpen();
  };

  const handleMarkComplete = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "completed",
              completed_at: new Date().toISOString(),
              completed_by: "current_user",
              completed_by_name: "Current User",
            }
          : task,
      ),
    );

    toast({
      title: "Task Completed",
      description: "Task has been marked as completed successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <>
      <Head>
        <title>Onboarding Tasks | HR Portal</title>
        <meta
          name="description"
          content="Comprehensive onboarding task management system"
        />
      </Head>

      <ModernDashboardLayout>
        <Box bg={bgColor} minH="100vh" pb={8}>
          <Container maxW="full" py={6}>
            {/* Breadcrumb */}
            <Breadcrumb mb={6} fontSize="sm">
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => router.push("/dashboard")}>
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink>HR Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>Onboarding Tasks</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            {/* Header */}
            <Flex justify="space-between" align="center" mb={6}>
              <Box>
                <Heading size="lg">Onboarding Tasks</Heading>
                <Text color="gray.600">
                  Manage and track all onboarding tasks across the organization
                </Text>
              </Box>

              <ButtonGroup spacing={2}>
                <Button variant="outline" leftIcon={<DownloadIcon />}>
                  Export Tasks
                </Button>
                <Button
                  colorScheme="blue"
                  leftIcon={<AddIcon />}
                  onClick={onCreateOpen}
                >
                  Create Task
                </Button>
              </ButtonGroup>
            </Flex>

            {/* Alert for overdue tasks */}
            {stats.overdueTasks > 0 && (
              <Alert status="warning" mb={6} borderRadius="lg">
                <AlertIcon />
                <AlertTitle>Overdue Tasks</AlertTitle>
                <AlertDescription>
                  {stats.overdueTasks} task
                  {stats.overdueTasks > 1 ? "s are" : " is"} overdue and need
                  immediate attention.
                </AlertDescription>
              </Alert>
            )}

            {/* Statistics Cards */}
            <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4} mb={6}>
              <Stat
                bg={cardBg}
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <StatLabel fontSize="xs">Total Tasks</StatLabel>
                <StatNumber fontSize="xl">{stats.totalTasks}</StatNumber>
                <StatHelpText>All onboarding tasks</StatHelpText>
              </Stat>

              <Stat
                bg={cardBg}
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <StatLabel fontSize="xs">Completed</StatLabel>
                <StatNumber fontSize="xl" color="green.500">
                  {stats.completedTasks}
                </StatNumber>
                <StatHelpText>{completionRate}% completion</StatHelpText>
              </Stat>

              <Stat
                bg={cardBg}
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <StatLabel fontSize="xs">In Progress</StatLabel>
                <StatNumber fontSize="xl" color="blue.500">
                  {stats.inProgressTasks}
                </StatNumber>
                <StatHelpText>Currently active</StatHelpText>
              </Stat>

              <Stat
                bg={cardBg}
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <StatLabel fontSize="xs">Pending</StatLabel>
                <StatNumber fontSize="xl" color="yellow.500">
                  {stats.pendingTasks}
                </StatNumber>
                <StatHelpText>Not yet started</StatHelpText>
              </Stat>

              <Stat
                bg={cardBg}
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <StatLabel fontSize="xs">Overdue</StatLabel>
                <StatNumber fontSize="xl" color="red.500">
                  {stats.overdueTasks}
                </StatNumber>
                <StatHelpText>Need attention</StatHelpText>
              </Stat>
            </SimpleGrid>

            {/* Filters */}
            <Card bg={cardBg} borderColor={borderColor} mb={6}>
              <CardBody>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                  gap={4}
                >
                  <InputGroup>
                    <InputLeftElement>
                      <SearchIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>

                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </Select>

                  <Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="documentation">Documentation</option>
                    <option value="training">Training</option>
                    <option value="equipment">Equipment</option>
                    <option value="systems">Systems</option>
                    <option value="introductions">Introductions</option>
                    <option value="compliance">Compliance</option>
                  </Select>
                </Grid>
              </CardBody>
            </Card>

            {/* Tasks Table */}
            <Card bg={cardBg} borderColor={borderColor}>
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Heading size="md">All Tasks</Heading>
                  <Text fontSize="sm" color="gray.500">
                    {filteredTasks.length} tasks
                  </Text>
                </Flex>
              </CardHeader>
              <CardBody p={0}>
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Task</Th>
                        <Th>Employee</Th>
                        <Th>Category</Th>
                        <Th>Priority</Th>
                        <Th>Status</Th>
                        <Th>Due Date</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredTasks.map((task) => (
                        <Tr
                          key={task.id}
                          _hover={{
                            bg: useColorModeValue("gray.50", "gray.700"),
                          }}
                        >
                          <Td>
                            <HStack spacing={3}>
                              <Text fontSize="lg">
                                {getCategoryIcon(task.category)}
                              </Text>
                              <Box>
                                <Text fontWeight="medium" noOfLines={1}>
                                  {task.title}
                                </Text>
                                <Text
                                  fontSize="sm"
                                  color="gray.500"
                                  noOfLines={1}
                                >
                                  {task.description}
                                </Text>
                              </Box>
                            </HStack>
                          </Td>
                          <Td>
                            <Text fontWeight="medium">
                              {task.employee_name}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {task.department}
                            </Text>
                          </Td>
                          <Td>
                            <Tag size="sm" colorScheme="blue" variant="subtle">
                              <TagLabel textTransform="capitalize">
                                {task.category}
                              </TagLabel>
                            </Tag>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={getPriorityColor(task.priority)}
                              variant="subtle"
                            >
                              {task.priority}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={getStatusColor(task.status)}
                              variant="subtle"
                            >
                              {task.status === "in_progress"
                                ? "In Progress"
                                : task.status}
                            </Badge>
                            {(task.is_overdue ||
                              (task.status !== "completed" &&
                                new Date(task.due_date) < new Date())) && (
                              <Badge
                                colorScheme="red"
                                variant="solid"
                                ml={1}
                                fontSize="xs"
                              >
                                Overdue
                              </Badge>
                            )}
                          </Td>
                          <Td>
                            <Text fontSize="sm">
                              {formatDate(task.due_date)}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {formatRelativeDate(task.due_date)}
                            </Text>
                          </Td>
                          <Td>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<SettingsIcon />}
                                variant="ghost"
                                size="sm"
                              />
                              <MenuList>
                                <MenuItem
                                  icon={<ViewIcon />}
                                  onClick={() => handleViewTask(task)}
                                >
                                  View Details
                                </MenuItem>
                                {task.status !== "completed" && (
                                  <MenuItem
                                    icon={<CheckCircleIcon />}
                                    onClick={() => handleMarkComplete(task.id)}
                                  >
                                    Mark Complete
                                  </MenuItem>
                                )}
                                <MenuItem icon={<EditIcon />}>
                                  Edit Task
                                </MenuItem>
                                <MenuItem icon={<EmailIcon />}>
                                  Send Reminder
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
          </Container>
        </Box>

        {/* Task Details Modal */}
        <Modal isOpen={isTaskOpen} onClose={onTaskClose} size="4xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedTask?.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedTask && (
                <VStack spacing={6} align="stretch">
                  <Grid
                    templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                    gap={4}
                  >
                    <Stat textAlign="center">
                      <StatLabel>Status</StatLabel>
                      <Badge
                        colorScheme={getStatusColor(selectedTask.status)}
                        variant="subtle"
                      >
                        {selectedTask.status.replace("_", " ")}
                      </Badge>
                    </Stat>
                    <Stat textAlign="center">
                      <StatLabel>Priority</StatLabel>
                      <Badge
                        colorScheme={getPriorityColor(selectedTask.priority)}
                        variant="subtle"
                      >
                        {selectedTask.priority}
                      </Badge>
                    </Stat>
                    <Stat textAlign="center">
                      <StatLabel>Duration</StatLabel>
                      <StatNumber fontSize="lg">
                        {selectedTask.estimated_duration}m
                      </StatNumber>
                    </Stat>
                  </Grid>

                  <Box>
                    <Text fontWeight="medium" mb={2}>
                      Description
                    </Text>
                    <Text color="gray.600">{selectedTask.description}</Text>
                  </Box>

                  <Grid
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                    gap={6}
                  >
                    <Box>
                      <Text fontWeight="medium" mb={2}>
                        Task Details
                      </Text>
                      <VStack spacing={2} align="stretch">
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.500">
                            Employee:
                          </Text>
                          <Text fontSize="sm">
                            {selectedTask.employee_name}
                          </Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.500">
                            Department:
                          </Text>
                          <Text fontSize="sm">{selectedTask.department}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.500">
                            Due Date:
                          </Text>
                          <Text fontSize="sm">
                            {formatDate(selectedTask.due_date)}
                          </Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.500">
                            Assigned To:
                          </Text>
                          <Text fontSize="sm">
                            {selectedTask.assigned_to_name || "Unassigned"}
                          </Text>
                        </Flex>
                      </VStack>
                    </Box>

                    {selectedTask.resources &&
                      selectedTask.resources.length > 0 && (
                        <Box>
                          <Text fontWeight="medium" mb={2}>
                            Resources
                          </Text>
                          <VStack spacing={2} align="stretch">
                            {selectedTask.resources.map((resource, index) => (
                              <Flex
                                key={index}
                                align="center"
                                p={2}
                                borderRadius="md"
                                bg={useColorModeValue("gray.50", "gray.700")}
                              >
                                <AttachmentIcon mr={2} />
                                <Text fontSize="sm">{resource.name}</Text>
                                <ExternalLinkIcon ml="auto" />
                              </Flex>
                            ))}
                          </VStack>
                        </Box>
                      )}
                  </Grid>

                  {selectedTask.completion_notes && (
                    <Box>
                      <Text fontWeight="medium" mb={2}>
                        Completion Notes
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {selectedTask.completion_notes}
                      </Text>
                    </Box>
                  )}
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <ButtonGroup spacing={2}>
                <Button variant="ghost" onClick={onTaskClose}>
                  Close
                </Button>
                {selectedTask?.status !== "completed" && (
                  <Button
                    colorScheme="green"
                    onClick={() => {
                      if (selectedTask) {
                        handleMarkComplete(selectedTask.id);
                        onTaskClose();
                      }
                    }}
                  >
                    Mark Complete
                  </Button>
                )}
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Create Task Modal */}
        <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Task Title</FormLabel>
                  <Input placeholder="Enter task title" />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea placeholder="Describe the task..." rows={3} />
                </FormControl>

                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={4}
                >
                  <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Select placeholder="Select category">
                      <option value="documentation">Documentation</option>
                      <option value="training">Training</option>
                      <option value="equipment">Equipment</option>
                      <option value="systems">Systems</option>
                      <option value="introductions">Introductions</option>
                      <option value="compliance">Compliance</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Priority</FormLabel>
                    <Select placeholder="Select priority">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </Select>
                  </FormControl>
                </Grid>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <ButtonGroup spacing={2}>
                <Button variant="ghost" onClick={onCreateClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue">Create Task</Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </ModernDashboardLayout>
    </>
  );
};

export default OnboardingTasksPage;

// Force server-side rendering to prevent SSR issues
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      timestamp: new Date().toISOString(),
    },
  };
};
