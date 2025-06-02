import {
  AddIcon,
  CalendarIcon,
  ChevronDownIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  SearchIcon,
  TimeIcon,
  ViewIcon,
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
  NumberInput,
  NumberInputField,
  Progress,
  Select,
  SimpleGrid,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Tag,
  TagLabel,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

// Enhanced Database Service
import { EmployeeService } from "../lib/database/services";

// Types
interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  duration_hours: number;
  max_capacity?: number;
  instructor?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  is_mandatory: boolean;
  certification_required: boolean;
  status: string;
  created_at: string;
  updated_at?: string;
  enrolled_count?: number;
  completed_count?: number;
}

interface TrainingEnrollment {
  id: string;
  course_id: string;
  employee_id: string;
  enrollment_date: string;
  completion_date?: string;
  status: string;
  progress: number;
  score?: number;
  certificate_url?: string;
  notes?: string;
  course?: TrainingCourse;
  employee?: any;
}

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  type: string;
  duration_hours: number;
  max_capacity: number;
  instructor: string;
  start_date: string;
  end_date: string;
  location: string;
  is_mandatory: boolean;
  certification_required: boolean;
}

const TrainingEnhanced: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.900");

  // State
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [enrollments, setEnrollments] = useState<TrainingEnrollment[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
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

  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(
    null,
  );
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    category: "",
    type: "",
    duration_hours: 0,
    max_capacity: 0,
    instructor: "",
    start_date: "",
    end_date: "",
    location: "",
    is_mandatory: false,
    certification_required: false,
  });

  const deleteRef = React.useRef<HTMLButtonElement>(null);

  // Status colors
  const statusColors: Record<string, string> = {
    active: "green",
    upcoming: "blue",
    completed: "purple",
    cancelled: "red",
    draft: "gray",
  };

  // Course categories
  const categories = [
    "Technical Skills",
    "Leadership",
    "Communication",
    "Safety",
    "Compliance",
    "Software Training",
    "Professional Development",
    "Industry Knowledge",
    "Soft Skills",
    "Other",
  ];

  // Course types
  const types = [
    { value: "online", label: "Online" },
    { value: "classroom", label: "Classroom" },
    { value: "workshop", label: "Workshop" },
    { value: "seminar", label: "Seminar" },
    { value: "webinar", label: "Webinar" },
    { value: "certification", label: "Certification" },
  ];

  // Load data
  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);

      // Mock training courses data for development
      const mockCourses: TrainingCourse[] = [
        {
          id: "1",
          title: "React Development Fundamentals",
          description:
            "Comprehensive course covering React.js fundamentals, hooks, and best practices for modern web development.",
          category: "Technical Skills",
          type: "online",
          duration_hours: 40,
          max_capacity: 25,
          instructor: "Sarah Wilson",
          start_date: "2024-12-15",
          end_date: "2024-12-22",
          location: "Online Platform",
          is_mandatory: false,
          certification_required: true,
          status: "active",
          created_at: new Date().toISOString(),
          enrolled_count: 18,
          completed_count: 12,
        },
        {
          id: "2",
          title: "Leadership Excellence Program",
          description:
            "Advanced leadership training focusing on team management, strategic thinking, and organizational leadership.",
          category: "Leadership",
          type: "workshop",
          duration_hours: 24,
          max_capacity: 15,
          instructor: "Michael Thompson",
          start_date: "2024-12-20",
          end_date: "2024-12-21",
          location: "Conference Room A",
          is_mandatory: true,
          certification_required: true,
          status: "upcoming",
          created_at: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          enrolled_count: 12,
          completed_count: 0,
        },
        {
          id: "3",
          title: "Workplace Safety Training",
          description:
            "Mandatory safety training covering workplace safety protocols, emergency procedures, and risk management.",
          category: "Safety",
          type: "classroom",
          duration_hours: 8,
          max_capacity: 30,
          instructor: "David Park",
          start_date: "2024-11-15",
          end_date: "2024-11-15",
          location: "Training Room B",
          is_mandatory: true,
          certification_required: true,
          status: "completed",
          created_at: new Date(
            Date.now() - 14 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          enrolled_count: 28,
          completed_count: 26,
        },
        {
          id: "4",
          title: "Data Analytics with Python",
          description:
            "Hands-on training in data analysis, visualization, and machine learning using Python and popular libraries.",
          category: "Technical Skills",
          type: "online",
          duration_hours: 60,
          max_capacity: 20,
          instructor: "Emily Chen",
          start_date: "2025-01-10",
          end_date: "2025-01-24",
          location: "Online Platform",
          is_mandatory: false,
          certification_required: true,
          status: "upcoming",
          created_at: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          enrolled_count: 5,
          completed_count: 0,
        },
      ];

      setCourses(mockCourses);
      setTotalPages(1);

      toast({
        title: "Using Demo Data",
        description: "Connected to mock training data for development",
        status: "info",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error loading courses:", error);
      toast({
        title: "Error",
        description: "Failed to load training courses",
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
            department: "Design",
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      // Calculate stats from current courses
      const stats = {
        total_courses: courses.length,
        active_courses: courses.filter((c) => c.status === "active").length,
        upcoming_courses: courses.filter((c) => c.status === "upcoming").length,
        completed_courses: courses.filter((c) => c.status === "completed")
          .length,
        total_enrollments: courses.reduce(
          (sum, c) => sum + (c.enrolled_count || 0),
          0,
        ),
        completion_rate:
          courses.length > 0
            ? courses.reduce((sum, c) => {
                const total = c.enrolled_count || 0;
                const completed = c.completed_count || 0;
                return sum + (total > 0 ? (completed / total) * 100 : 0);
              }, 0) / courses.length
            : 0,
        mandatory_courses: courses.filter((c) => c.is_mandatory).length,
      };
      setStats(stats);
    } catch (error) {
      console.error("Error calculating stats:", error);
    }
  }, [courses]);

  useEffect(() => {
    loadCourses();
    loadEmployees();
  }, [loadCourses, loadEmployees]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.instructor || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || course.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || course.status === statusFilter;
    const matchesType = typeFilter === "all" || course.type === typeFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesType;
  });

  // Handlers
  const handleCreateCourse = async () => {
    try {
      // Mock course creation
      const newCourse: TrainingCourse = {
        id: `course_${Date.now()}`,
        ...formData,
        status: "draft",
        created_at: new Date().toISOString(),
        enrolled_count: 0,
        completed_count: 0,
      };

      setCourses((prev) => [newCourse, ...prev]);

      toast({
        title: "Success",
        description: "Training course created successfully",
        status: "success",
        duration: 3000,
      });
      onCreateClose();
      resetForm();
    } catch (error) {
      console.error("Error creating course:", error);
      toast({
        title: "Error",
        description: "Failed to create course",
        status: "error",
        duration: 5000,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      type: "",
      duration_hours: 0,
      max_capacity: 0,
      instructor: "",
      start_date: "",
      end_date: "",
      location: "",
      is_mandatory: false,
      certification_required: false,
    });
  };

  const openViewModal = (course: TrainingCourse) => {
    setSelectedCourse(course);
    onViewOpen();
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return "green";
    if (progress >= 60) return "blue";
    if (progress >= 40) return "yellow";
    return "red";
  };

  return (
    <>
      <Head>
        <title>Training & Learning Management - Enhanced | HR Portal</title>
        <meta
          name="description"
          content="Enhanced training and learning management with course tracking and employee development"
        />
      </Head>

      <Container maxW="8xl" py={8}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="lg" color="blue.600">
              Training & Learning Management
            </Heading>
            <Text color="gray.600" mt={2}>
              Manage employee training courses, certifications, and skill
              development
            </Text>
          </Box>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onCreateOpen}
            size="lg"
          >
            New Course
          </Button>
        </Flex>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 4, lg: 7 }} spacing={4} mb={8}>
          <Stat>
            <StatLabel>Total Courses</StatLabel>
            <StatNumber color="blue.500">{stats.total_courses || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Active</StatLabel>
            <StatNumber color="green.500">
              {stats.active_courses || 0}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Upcoming</StatLabel>
            <StatNumber color="blue.500">
              {stats.upcoming_courses || 0}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Completed</StatLabel>
            <StatNumber color="purple.500">
              {stats.completed_courses || 0}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Enrollments</StatLabel>
            <StatNumber color="cyan.500">
              {stats.total_enrollments || 0}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Completion Rate</StatLabel>
            <StatNumber color="green.500">
              {(stats.completion_rate || 0).toFixed(1)}%
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Mandatory</StatLabel>
            <StatNumber color="orange.500">
              {stats.mandatory_courses || 0}
            </StatNumber>
          </Stat>
        </SimpleGrid>

        {/* Filters */}
        <Card bg={cardBg} mb={6}>
          <CardBody>
            <Grid
              templateColumns={{ base: "1fr", md: "2fr 1fr 1fr 1fr" }}
              gap={4}
            >
              <InputGroup>
                <InputLeftElement>
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                title="Filter by category"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                title="Filter by status"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="draft">Draft</option>
              </Select>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                title="Filter by type"
              >
                <option value="all">All Types</option>
                {types.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </Grid>
          </CardBody>
        </Card>

        {/* Courses Grid */}
        {loading ? (
          <Flex justify="center" align="center" height="400px">
            <VStack>
              <Spinner size="xl" color="blue.500" />
              <Text>Loading training courses...</Text>
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
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                position="relative"
              >
                {course.is_mandatory && (
                  <Box position="absolute" top={2} right={2} zIndex={1}>
                    <Badge colorScheme="red" variant="solid">
                      Mandatory
                    </Badge>
                  </Box>
                )}
                <CardHeader pb={2}>
                  <Flex justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <Heading size="md" pr={course.is_mandatory ? 20 : 0}>
                        {course.title}
                      </Heading>
                      <Text fontSize="sm" color="gray.600">
                        {course.category} • {course.type}
                      </Text>
                      <HStack>
                        <Badge colorScheme={statusColors[course.status]}>
                          {course.status.toUpperCase()}
                        </Badge>
                        {course.certification_required && (
                          <Tag size="sm" colorScheme="blue">
                            <TagLabel>Certificate</TagLabel>
                          </Tag>
                        )}
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
                          onClick={() => openViewModal(course)}
                        >
                          View Details
                        </MenuItem>
                        <MenuItem icon={<EditIcon />}>Edit Course</MenuItem>
                        <MenuDivider />
                        <MenuItem icon={<DownloadIcon />}>
                          Export Enrollments
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
                    <Text fontSize="sm" color="gray.600" noOfLines={2}>
                      {course.description}
                    </Text>

                    {course.instructor && (
                      <HStack>
                        <Text fontSize="sm" fontWeight="medium">
                          Instructor:
                        </Text>
                        <Text fontSize="sm">{course.instructor}</Text>
                      </HStack>
                    )}

                    <HStack>
                      <TimeIcon color="gray.500" />
                      <Text fontSize="sm">{course.duration_hours} hours</Text>
                    </HStack>

                    {course.start_date && course.end_date && (
                      <HStack>
                        <CalendarIcon color="gray.500" />
                        <Text fontSize="sm">
                          {format(new Date(course.start_date), "MMM d")} -{" "}
                          {format(new Date(course.end_date), "MMM d, yyyy")}
                        </Text>
                      </HStack>
                    )}

                    {course.location && (
                      <Text fontSize="sm" color="gray.600">
                        📍 {course.location}
                      </Text>
                    )}

                    {/* Enrollment Progress */}
                    <Box w="full">
                      <Flex justify="space-between" mb={1}>
                        <Text fontSize="xs" color="gray.500">
                          Enrollment Progress
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {course.enrolled_count || 0}/
                          {course.max_capacity || 0}
                        </Text>
                      </Flex>
                      <Progress
                        value={
                          ((course.enrolled_count || 0) /
                            (course.max_capacity || 1)) *
                          100
                        }
                        size="sm"
                        colorScheme={
                          ((course.enrolled_count || 0) /
                            (course.max_capacity || 1)) *
                            100 >=
                          80
                            ? "red"
                            : "green"
                        }
                      />
                    </Box>

                    {/* Completion Progress */}
                    <Box w="full">
                      <Flex justify="space-between" mb={1}>
                        <Text fontSize="xs" color="gray.500">
                          Completion Progress
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {course.completed_count || 0}/
                          {course.enrolled_count || 0}
                        </Text>
                      </Flex>
                      <Progress
                        value={
                          course.enrolled_count
                            ? ((course.completed_count || 0) /
                                course.enrolled_count) *
                              100
                            : 0
                        }
                        size="sm"
                        colorScheme={getProgressColor(
                          course.enrolled_count
                            ? ((course.completed_count || 0) /
                                course.enrolled_count) *
                                100
                            : 0,
                        )}
                      />
                    </Box>

                    <Text fontSize="xs" color="gray.500">
                      Created{" "}
                      {format(new Date(course.created_at), "MMM d, yyyy")}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}

        {/* Create Modal */}
        <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Training Course</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Course Title</FormLabel>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="React Development Fundamentals"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Course description..."
                    rows={3}
                  />
                </FormControl>

                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      title="Select category"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Type</FormLabel>
                    <Select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      title="Select type"
                    >
                      <option value="">Select Type</option>
                      {types.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid templateColumns="1fr 1fr 1fr" gap={4} w="full">
                  <FormControl>
                    <FormLabel>Duration (Hours)</FormLabel>
                    <NumberInput
                      value={formData.duration_hours}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          duration_hours: Number(value),
                        })
                      }
                    >
                      <NumberInputField placeholder="0" />
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Max Capacity</FormLabel>
                    <NumberInput
                      value={formData.max_capacity}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          max_capacity: Number(value),
                        })
                      }
                    >
                      <NumberInputField placeholder="0" />
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Instructor</FormLabel>
                    <Input
                      value={formData.instructor}
                      onChange={(e) =>
                        setFormData({ ...formData, instructor: e.target.value })
                      }
                      placeholder="Instructor name"
                    />
                  </FormControl>
                </Grid>

                <Grid templateColumns="1fr 1fr 1fr" gap={4} w="full">
                  <FormControl>
                    <FormLabel>Start Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>End Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Location</FormLabel>
                    <Input
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="Training location"
                    />
                  </FormControl>
                </Grid>

                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl>
                    <HStack>
                      <input
                        type="checkbox"
                        checked={formData.is_mandatory}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_mandatory: e.target.checked,
                          })
                        }
                      />
                      <FormLabel mb={0}>Mandatory Course</FormLabel>
                    </HStack>
                  </FormControl>

                  <FormControl>
                    <HStack>
                      <input
                        type="checkbox"
                        checked={formData.certification_required}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            certification_required: e.target.checked,
                          })
                        }
                      />
                      <FormLabel mb={0}>Certification Required</FormLabel>
                    </HStack>
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
                onClick={handleCreateCourse}
                isDisabled={
                  !formData.title || !formData.category || !formData.type
                }
              >
                Create Course
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* View Modal */}
        <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Course Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedCourse && (
                <VStack align="start" spacing={4}>
                  <Grid templateColumns="1fr 1fr" gap={6} w="full">
                    <VStack align="start" spacing={3}>
                      <Text fontWeight="bold">Course Information</Text>
                      <Text>Title: {selectedCourse.title}</Text>
                      <Text>Category: {selectedCourse.category}</Text>
                      <Text>Type: {selectedCourse.type}</Text>
                      <Text>
                        Duration: {selectedCourse.duration_hours} hours
                      </Text>
                      {selectedCourse.instructor && (
                        <Text>Instructor: {selectedCourse.instructor}</Text>
                      )}
                      <HStack>
                        <Text>Status:</Text>
                        <Badge
                          colorScheme={statusColors[selectedCourse.status]}
                        >
                          {selectedCourse.status.toUpperCase()}
                        </Badge>
                      </HStack>
                    </VStack>

                    <VStack align="start" spacing={3}>
                      <Text fontWeight="bold">Enrollment Details</Text>
                      <Text>
                        Capacity: {selectedCourse.max_capacity || "Unlimited"}
                      </Text>
                      <Text>
                        Enrolled: {selectedCourse.enrolled_count || 0}
                      </Text>
                      <Text>
                        Completed: {selectedCourse.completed_count || 0}
                      </Text>
                      <Text>
                        Completion Rate:{" "}
                        {selectedCourse.enrolled_count
                          ? (
                              ((selectedCourse.completed_count || 0) /
                                selectedCourse.enrolled_count) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </Text>
                      <Text>
                        Mandatory: {selectedCourse.is_mandatory ? "Yes" : "No"}
                      </Text>
                      <Text>
                        Certificate:{" "}
                        {selectedCourse.certification_required ? "Yes" : "No"}
                      </Text>
                    </VStack>
                  </Grid>

                  <Divider />

                  {selectedCourse.description && (
                    <>
                      <Text fontWeight="bold">Description</Text>
                      <Text>{selectedCourse.description}</Text>
                      <Divider />
                    </>
                  )}

                  {selectedCourse.start_date && selectedCourse.end_date && (
                    <>
                      <Text fontWeight="bold">Schedule</Text>
                      <Text>
                        Start:{" "}
                        {format(new Date(selectedCourse.start_date), "PPP")}
                      </Text>
                      <Text>
                        End: {format(new Date(selectedCourse.end_date), "PPP")}
                      </Text>
                      {selectedCourse.location && (
                        <Text>Location: {selectedCourse.location}</Text>
                      )}
                    </>
                  )}
                </VStack>
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

export default TrainingEnhanced;
