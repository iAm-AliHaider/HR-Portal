import {
  AddIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
  TimeIcon,
  ViewIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Select,
  SimpleGrid,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagLabel,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { format, formatDistanceToNow } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

// Enhanced Database Service
import { EmployeeService } from "../lib/database/services";

// Types
interface OnboardingProcess {
  id: string;
  employee_id: string;
  start_date: string;
  expected_completion_date: string;
  actual_completion_date?: string;
  status: string;
  progress: number;
  mentor_id?: string;
  hr_contact_id?: string;
  department: string;
  position: string;
  created_at: string;
  updated_at?: string;
  employee?: any;
  mentor?: any;
  hr_contact?: any;
  tasks?: OnboardingTask[];
}

interface OnboardingTask {
  id: string;
  onboarding_id: string;
  task_name: string;
  description: string;
  category: string;
  priority: string;
  due_date?: string;
  completion_date?: string;
  status: string;
  assigned_to?: string;
  notes?: string;
  order_index: number;
  documents_required?: string[];
}

interface OnboardingFormData {
  employee_id: string;
  start_date: string;
  expected_completion_date: string;
  mentor_id: string;
  hr_contact_id: string;
  department: string;
  position: string;
}

const OnboardingEnhanced: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.900");

  // State
  const [onboardingProcesses, setOnboardingProcesses] = useState<
    OnboardingProcess[]
  >([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<any>({});

  // Modal states
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [selectedProcess, setSelectedProcess] =
    useState<OnboardingProcess | null>(null);
  const [formData, setFormData] = useState<OnboardingFormData>({
    employee_id: "",
    start_date: "",
    expected_completion_date: "",
    mentor_id: "",
    hr_contact_id: "",
    department: "",
    position: "",
  });

  const deleteRef = React.useRef<HTMLButtonElement>(null);

  // Status colors
  const statusColors: Record<string, string> = {
    not_started: "gray",
    in_progress: "blue",
    completed: "green",
    overdue: "red",
    paused: "orange",
  };

  // Priority colors
  const priorityColors: Record<string, string> = {
    low: "green",
    medium: "yellow",
    high: "orange",
    critical: "red",
  };

  // Task categories
  const taskCategories = [
    "Documentation",
    "IT Setup",
    "Orientation",
    "Training",
    "Compliance",
    "Team Introduction",
    "System Access",
    "Benefits Enrollment",
  ];

  // Departments
  const departments = [
    "Engineering",
    "Product",
    "Design",
    "Marketing",
    "Sales",
    "Operations",
    "HR",
    "Finance",
    "Legal",
  ];

  // Load data
  const loadOnboardingProcesses = useCallback(async () => {
    try {
      setLoading(true);

      // Mock onboarding processes data for development
      const mockProcesses: OnboardingProcess[] = [
        {
          id: "1",
          employee_id: "emp1",
          start_date: "2024-12-02",
          expected_completion_date: "2024-12-16",
          status: "in_progress",
          progress: 60,
          mentor_id: "emp2",
          hr_contact_id: "emp3",
          department: "Engineering",
          position: "Senior Software Engineer",
          created_at: new Date().toISOString(),
          employee: {
            id: "emp1",
            name: "Sarah Johnson",
            email: "sarah.johnson@company.com",
            hire_date: "2024-12-02",
          },
          mentor: {
            id: "emp2",
            name: "Michael Chen",
            email: "michael.chen@company.com",
          },
          hr_contact: {
            id: "emp3",
            name: "Emily Rodriguez",
            email: "emily.rodriguez@company.com",
          },
          tasks: [
            {
              id: "task1",
              onboarding_id: "1",
              task_name: "Complete I-9 Form",
              description:
                "Fill out and submit employment eligibility verification",
              category: "Documentation",
              priority: "critical",
              due_date: "2024-12-03",
              completion_date: "2024-12-03",
              status: "completed",
              order_index: 1,
              documents_required: ["I-9 Form", "ID Documents"],
            },
            {
              id: "task2",
              onboarding_id: "1",
              task_name: "IT Equipment Setup",
              description:
                "Receive and set up laptop, accounts, and development environment",
              category: "IT Setup",
              priority: "high",
              due_date: "2024-12-04",
              completion_date: "2024-12-04",
              status: "completed",
              order_index: 2,
            },
            {
              id: "task3",
              onboarding_id: "1",
              task_name: "Security Training",
              description:
                "Complete mandatory cybersecurity awareness training",
              category: "Training",
              priority: "high",
              due_date: "2024-12-06",
              status: "in_progress",
              order_index: 3,
            },
            {
              id: "task4",
              onboarding_id: "1",
              task_name: "Team Introductions",
              description: "Meet with team members and key stakeholders",
              category: "Team Introduction",
              priority: "medium",
              due_date: "2024-12-10",
              status: "not_started",
              order_index: 4,
            },
          ],
        },
        {
          id: "2",
          employee_id: "emp4",
          start_date: "2024-11-15",
          expected_completion_date: "2024-11-29",
          actual_completion_date: "2024-11-28",
          status: "completed",
          progress: 100,
          mentor_id: "emp1",
          hr_contact_id: "emp3",
          department: "Product",
          position: "Product Manager",
          created_at: new Date(
            Date.now() - 14 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          employee: {
            id: "emp4",
            name: "Alex Thompson",
            email: "alex.thompson@company.com",
            hire_date: "2024-11-15",
          },
          mentor: {
            id: "emp1",
            name: "Sarah Johnson",
            email: "sarah.johnson@company.com",
          },
          hr_contact: {
            id: "emp3",
            name: "Emily Rodriguez",
            email: "emily.rodriguez@company.com",
          },
        },
        {
          id: "3",
          employee_id: "emp5",
          start_date: "2024-12-20",
          expected_completion_date: "2025-01-03",
          status: "not_started",
          progress: 0,
          mentor_id: "emp2",
          hr_contact_id: "emp3",
          department: "Design",
          position: "UX Designer",
          created_at: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          employee: {
            id: "emp5",
            name: "Maria Garcia",
            email: "maria.garcia@company.com",
            hire_date: "2024-12-20",
          },
          mentor: {
            id: "emp2",
            name: "Michael Chen",
            email: "michael.chen@company.com",
          },
          hr_contact: {
            id: "emp3",
            name: "Emily Rodriguez",
            email: "emily.rodriguez@company.com",
          },
        },
      ];

      setOnboardingProcesses(mockProcesses);
      setTotalPages(1);

      toast({
        title: "Using Demo Data",
        description: "Connected to mock onboarding data for development",
        status: "info",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error loading onboarding processes:", error);
      toast({
        title: "Error",
        description: "Failed to load onboarding processes",
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, toast]);

  const loadEmployees = useCallback(async () => {
    try {
      const response = await EmployeeService.getAll({
        page: 1,
        limit: 100,
        orderBy: "name",
        ascending: true,
      });

      if (response.success && response.data) {
        setEmployees(response.data);
      } else {
        // Mock employees
        setEmployees([
          {
            id: "emp1",
            name: "Sarah Johnson",
            email: "sarah.johnson@company.com",
            department: "Engineering",
          },
          {
            id: "emp2",
            name: "Michael Chen",
            email: "michael.chen@company.com",
            department: "Product",
          },
          {
            id: "emp3",
            name: "Emily Rodriguez",
            email: "emily.rodriguez@company.com",
            department: "HR",
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      // Calculate stats from current processes
      const stats = {
        total_processes: onboardingProcesses.length,
        not_started: onboardingProcesses.filter(
          (p) => p.status === "not_started",
        ).length,
        in_progress: onboardingProcesses.filter(
          (p) => p.status === "in_progress",
        ).length,
        completed: onboardingProcesses.filter((p) => p.status === "completed")
          .length,
        overdue: onboardingProcesses.filter((p) => {
          if (p.status === "completed") return false;
          const today = new Date();
          const expectedDate = new Date(p.expected_completion_date);
          return today > expectedDate;
        }).length,
        avg_progress:
          onboardingProcesses.length > 0
            ? onboardingProcesses.reduce((sum, p) => sum + p.progress, 0) /
              onboardingProcesses.length
            : 0,
        completion_rate:
          onboardingProcesses.length > 0
            ? (onboardingProcesses.filter((p) => p.status === "completed")
                .length /
                onboardingProcesses.length) *
              100
            : 0,
      };
      setStats(stats);
    } catch (error) {
      console.error("Error calculating stats:", error);
    }
  }, [onboardingProcesses]);

  useEffect(() => {
    loadOnboardingProcesses();
    loadEmployees();
  }, [loadOnboardingProcesses, loadEmployees]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Filter processes
  const filteredProcesses = onboardingProcesses.filter((process) => {
    const matchesSearch =
      process.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || process.status === statusFilter;
    const matchesDepartment =
      departmentFilter === "all" || process.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Handlers
  const handleCreateProcess = async () => {
    try {
      // Mock process creation
      const newProcess: OnboardingProcess = {
        id: `process_${Date.now()}`,
        ...formData,
        status: "not_started",
        progress: 0,
        created_at: new Date().toISOString(),
      };

      setOnboardingProcesses((prev) => [newProcess, ...prev]);

      toast({
        title: "Success",
        description: "Onboarding process created successfully",
        status: "success",
        duration: 3000,
      });
      onCreateClose();
      resetForm();
    } catch (error) {
      console.error("Error creating process:", error);
      toast({
        title: "Error",
        description: "Failed to create onboarding process",
        status: "error",
        duration: 5000,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      employee_id: "",
      start_date: "",
      expected_completion_date: "",
      mentor_id: "",
      hr_contact_id: "",
      department: "",
      position: "",
    });
  };

  const openViewModal = (process: OnboardingProcess) => {
    setSelectedProcess(process);
    onViewOpen();
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 90) return "green";
    if (progress >= 70) return "blue";
    if (progress >= 50) return "yellow";
    if (progress >= 30) return "orange";
    return "red";
  };

  const isOverdue = (process: OnboardingProcess): boolean => {
    if (process.status === "completed") return false;
    const today = new Date();
    const expectedDate = new Date(process.expected_completion_date);
    return today > expectedDate;
  };

  return (
    <>
      <Head>
        <title>Employee Onboarding Management - Enhanced | HR Portal</title>
        <meta
          name="description"
          content="Enhanced employee onboarding management with task tracking and progress monitoring"
        />
      </Head>

      <Container maxW="8xl" py={8}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="lg" color="blue.600">
              Employee Onboarding Management
            </Heading>
            <Text color="gray.600" mt={2}>
              Track new employee onboarding progress, tasks, and mentorship
            </Text>
          </Box>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onCreateOpen}
            size="lg"
          >
            New Onboarding
          </Button>
        </Flex>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} mb={8}>
          <Stat>
            <StatLabel>Total Processes</StatLabel>
            <StatNumber color="blue.500">
              {stats.total_processes || 0}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Not Started</StatLabel>
            <StatNumber color="gray.500">{stats.not_started || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>In Progress</StatLabel>
            <StatNumber color="blue.500">{stats.in_progress || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Completed</StatLabel>
            <StatNumber color="green.500">{stats.completed || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Overdue</StatLabel>
            <StatNumber color="red.500">{stats.overdue || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Avg Progress</StatLabel>
            <StatNumber color="purple.500">
              {(stats.avg_progress || 0).toFixed(0)}%
            </StatNumber>
          </Stat>
        </SimpleGrid>

        {/* Filters */}
        <Card bg={cardBg} mb={6}>
          <CardBody>
            <Grid templateColumns={{ base: "1fr", md: "2fr 1fr 1fr" }} gap={4}>
              <InputGroup>
                <InputLeftElement>
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search onboarding processes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                title="Filter by status"
              >
                <option value="all">All Statuses</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
                <option value="paused">Paused</option>
              </Select>
              <Select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                title="Filter by department"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </Select>
            </Grid>
          </CardBody>
        </Card>

        {/* Onboarding Processes Grid */}
        {loading ? (
          <Flex justify="center" align="center" height="400px">
            <VStack>
              <Spinner size="xl" color="blue.500" />
              <Text>Loading onboarding processes...</Text>
            </VStack>
          </Flex>
        ) : (
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
          >
            {filteredProcesses.map((process) => (
              <Card
                key={process.id}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                position="relative"
              >
                {isOverdue(process) && (
                  <Box position="absolute" top={2} right={2} zIndex={1}>
                    <Badge colorScheme="red" variant="solid">
                      <WarningIcon mr={1} />
                      Overdue
                    </Badge>
                  </Box>
                )}
                <CardHeader pb={2}>
                  <Flex justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <Heading size="md" pr={isOverdue(process) ? 20 : 0}>
                        {process.employee?.name}
                      </Heading>
                      <Text fontSize="sm" color="gray.600">
                        {process.position} • {process.department}
                      </Text>
                      <HStack>
                        <Badge colorScheme={statusColors[process.status]}>
                          {process.status.replace("_", " ").toUpperCase()}
                        </Badge>
                        <Tag size="sm" colorScheme="blue">
                          <TagLabel>{process.progress}% Complete</TagLabel>
                        </Tag>
                      </HStack>
                    </VStack>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<ChevronDownIcon />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<ViewIcon />}
                          onClick={() => openViewModal(process)}
                        >
                          View Details
                        </MenuItem>
                        <MenuItem icon={<EditIcon />}>Edit Process</MenuItem>
                        <MenuDivider />
                        <MenuItem icon={<CheckIcon />} color="green.500">
                          Mark Completed
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem icon={<DeleteIcon />} color="red.500">
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack align="start" spacing={3}>
                    <HStack>
                      <CalendarIcon color="gray.500" />
                      <Text fontSize="sm">
                        Started:{" "}
                        {format(new Date(process.start_date), "MMM d, yyyy")}
                      </Text>
                    </HStack>

                    <HStack>
                      <TimeIcon color="gray.500" />
                      <Text fontSize="sm">
                        Due:{" "}
                        {format(
                          new Date(process.expected_completion_date),
                          "MMM d, yyyy",
                        )}
                      </Text>
                    </HStack>

                    {process.mentor && (
                      <Text fontSize="sm">
                        <strong>Mentor:</strong> {process.mentor.name}
                      </Text>
                    )}

                    {process.hr_contact && (
                      <Text fontSize="sm">
                        <strong>HR Contact:</strong> {process.hr_contact.name}
                      </Text>
                    )}

                    {/* Progress Bar */}
                    <Box w="full">
                      <Flex justify="space-between" mb={1}>
                        <Text fontSize="xs" color="gray.500">
                          Overall Progress
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {process.progress}%
                        </Text>
                      </Flex>
                      <Progress
                        value={process.progress}
                        size="sm"
                        colorScheme={getProgressColor(process.progress)}
                      />
                    </Box>

                    {/* Task Summary */}
                    {process.tasks && (
                      <Box w="full">
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          Tasks:{" "}
                          {
                            process.tasks.filter(
                              (t) => t.status === "completed",
                            ).length
                          }
                          /{process.tasks.length} completed
                        </Text>
                        <HStack spacing={1}>
                          {process.tasks.slice(0, 4).map((task, index) => (
                            <Box
                              key={index}
                              w="4px"
                              h="4px"
                              bg={
                                task.status === "completed"
                                  ? "green.400"
                                  : "gray.300"
                              }
                              borderRadius="full"
                            />
                          ))}
                          {process.tasks.length > 4 && (
                            <Text fontSize="xs" color="gray.400">
                              +{process.tasks.length - 4}
                            </Text>
                          )}
                        </HStack>
                      </Box>
                    )}

                    <Text fontSize="xs" color="gray.500">
                      Created{" "}
                      {formatDistanceToNow(new Date(process.created_at))} ago
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}

        {/* Create Modal */}
        <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Onboarding Process</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Employee</FormLabel>
                  <Select
                    value={formData.employee_id}
                    onChange={(e) =>
                      setFormData({ ...formData, employee_id: e.target.value })
                    }
                    title="Select employee"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} - {emp.department}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Department</FormLabel>
                    <Select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      title="Select department"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Position</FormLabel>
                    <Input
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                      placeholder="Senior Software Engineer"
                    />
                  </FormControl>
                </Grid>

                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Start Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Expected Completion</FormLabel>
                    <Input
                      type="date"
                      value={formData.expected_completion_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expected_completion_date: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl>
                    <FormLabel>Mentor</FormLabel>
                    <Select
                      value={formData.mentor_id}
                      onChange={(e) =>
                        setFormData({ ...formData, mentor_id: e.target.value })
                      }
                      title="Select mentor"
                    >
                      <option value="">Select Mentor</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>HR Contact</FormLabel>
                    <Select
                      value={formData.hr_contact_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hr_contact_id: e.target.value,
                        })
                      }
                      title="Select HR contact"
                    >
                      <option value="">Select HR Contact</option>
                      {employees
                        .filter((emp) => emp.department === "HR")
                        .map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name}
                          </option>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={onCreateClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleCreateProcess}
                isDisabled={
                  !formData.employee_id ||
                  !formData.department ||
                  !formData.position ||
                  !formData.start_date ||
                  !formData.expected_completion_date
                }
              >
                Create Process
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* View Modal */}
        <Modal isOpen={isViewOpen} onClose={onViewClose} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Onboarding Process Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedProcess && (
                <Tabs>
                  <TabList>
                    <Tab>Overview</Tab>
                    <Tab>Tasks ({selectedProcess.tasks?.length || 0})</Tab>
                    <Tab>Timeline</Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <VStack align="start" spacing={4}>
                        <Grid templateColumns="1fr 1fr" gap={6} w="full">
                          <VStack align="start" spacing={3}>
                            <Text fontWeight="bold">Employee Information</Text>
                            <Text>Name: {selectedProcess.employee?.name}</Text>
                            <Text>Position: {selectedProcess.position}</Text>
                            <Text>
                              Department: {selectedProcess.department}
                            </Text>
                            <Text>
                              Start Date:{" "}
                              {format(
                                new Date(selectedProcess.start_date),
                                "MMM d, yyyy",
                              )}
                            </Text>
                            <HStack>
                              <Text>Status:</Text>
                              <Badge
                                colorScheme={
                                  statusColors[selectedProcess.status]
                                }
                              >
                                {selectedProcess.status
                                  .replace("_", " ")
                                  .toUpperCase()}
                              </Badge>
                            </HStack>
                          </VStack>

                          <VStack align="start" spacing={3}>
                            <Text fontWeight="bold">Progress & Timeline</Text>
                            <Text>Progress: {selectedProcess.progress}%</Text>
                            <Text>
                              Expected Completion:{" "}
                              {format(
                                new Date(
                                  selectedProcess.expected_completion_date,
                                ),
                                "MMM d, yyyy",
                              )}
                            </Text>
                            {selectedProcess.actual_completion_date && (
                              <Text>
                                Completed:{" "}
                                {format(
                                  new Date(
                                    selectedProcess.actual_completion_date,
                                  ),
                                  "MMM d, yyyy",
                                )}
                              </Text>
                            )}
                            {selectedProcess.mentor && (
                              <Text>Mentor: {selectedProcess.mentor.name}</Text>
                            )}
                            {selectedProcess.hr_contact && (
                              <Text>
                                HR Contact: {selectedProcess.hr_contact.name}
                              </Text>
                            )}
                          </VStack>
                        </Grid>

                        <Divider />

                        <Box w="full">
                          <Text fontWeight="bold" mb={2}>
                            Overall Progress
                          </Text>
                          <Progress
                            value={selectedProcess.progress}
                            size="lg"
                            colorScheme={getProgressColor(
                              selectedProcess.progress,
                            )}
                          />
                        </Box>
                      </VStack>
                    </TabPanel>

                    <TabPanel>
                      <VStack align="start" spacing={4}>
                        {selectedProcess.tasks &&
                        selectedProcess.tasks.length > 0 ? (
                          selectedProcess.tasks.map((task) => (
                            <Card key={task.id} w="full" size="sm">
                              <CardBody>
                                <HStack justify="space-between" align="start">
                                  <VStack align="start" spacing={1}>
                                    <HStack>
                                      <Text fontWeight="medium">
                                        {task.task_name}
                                      </Text>
                                      <Badge
                                        colorScheme={
                                          priorityColors[task.priority]
                                        }
                                      >
                                        {task.priority.toUpperCase()}
                                      </Badge>
                                      <Badge variant="outline">
                                        {task.category}
                                      </Badge>
                                    </HStack>
                                    <Text fontSize="sm" color="gray.600">
                                      {task.description}
                                    </Text>
                                    {task.due_date && (
                                      <Text fontSize="xs" color="gray.500">
                                        Due:{" "}
                                        {format(
                                          new Date(task.due_date),
                                          "MMM d, yyyy",
                                        )}
                                      </Text>
                                    )}
                                  </VStack>
                                  <Badge
                                    colorScheme={
                                      task.status === "completed"
                                        ? "green"
                                        : task.status === "in_progress"
                                          ? "blue"
                                          : "gray"
                                    }
                                  >
                                    {task.status
                                      .replace("_", " ")
                                      .toUpperCase()}
                                  </Badge>
                                </HStack>
                              </CardBody>
                            </Card>
                          ))
                        ) : (
                          <Text color="gray.500">No tasks assigned yet</Text>
                        )}
                      </VStack>
                    </TabPanel>

                    <TabPanel>
                      <VStack align="start" spacing={4}>
                        <Text fontWeight="bold">Process Timeline</Text>
                        <Box w="full">
                          <VStack align="start" spacing={3}>
                            <HStack>
                              <Box
                                w="3"
                                h="3"
                                bg="blue.400"
                                borderRadius="full"
                              />
                              <Text fontSize="sm">
                                Process created on{" "}
                                {format(
                                  new Date(selectedProcess.created_at),
                                  "MMM d, yyyy",
                                )}
                              </Text>
                            </HStack>
                            <HStack>
                              <Box
                                w="3"
                                h="3"
                                bg="green.400"
                                borderRadius="full"
                              />
                              <Text fontSize="sm">
                                Started on{" "}
                                {format(
                                  new Date(selectedProcess.start_date),
                                  "MMM d, yyyy",
                                )}
                              </Text>
                            </HStack>
                            {selectedProcess.actual_completion_date ? (
                              <HStack>
                                <Box
                                  w="3"
                                  h="3"
                                  bg="purple.400"
                                  borderRadius="full"
                                />
                                <Text fontSize="sm">
                                  Completed on{" "}
                                  {format(
                                    new Date(
                                      selectedProcess.actual_completion_date,
                                    ),
                                    "MMM d, yyyy",
                                  )}
                                </Text>
                              </HStack>
                            ) : (
                              <HStack>
                                <Box
                                  w="3"
                                  h="3"
                                  bg="orange.400"
                                  borderRadius="full"
                                />
                                <Text fontSize="sm">
                                  Expected completion:{" "}
                                  {format(
                                    new Date(
                                      selectedProcess.expected_completion_date,
                                    ),
                                    "MMM d, yyyy",
                                  )}
                                </Text>
                              </HStack>
                            )}
                          </VStack>
                        </Box>
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onViewClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </>
  );
};

export default OnboardingEnhanced;
