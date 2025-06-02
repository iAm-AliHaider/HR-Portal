import {
  AddIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
  ExternalLinkIcon,
  SearchIcon,
  TimeIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
import { format, formatDistanceToNow } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

// Enhanced Database Service
import { JobsService } from "../lib/database/services";

// Types
interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  description?: string;
  requirements?: string;
  salary_range?: string;
  employment_type: string;
  status: string;
  posting_date?: string;
  closing_date?: string;
  hiring_manager_id?: string;
  created_at: string;
  updated_at?: string;
  hiring_manager?: any;
  applications_count?: number;
}

interface JobFormData {
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string;
  salary_range: string;
  employment_type: string;
  status: string;
  posting_date: string;
  closing_date: string;
  hiring_manager_id: string;
}

const JobsEnhanced: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.900");

  // State
  const [jobs, setJobs] = useState<Job[]>([]);
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

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    department: "",
    location: "",
    description: "",
    requirements: "",
    salary_range: "",
    employment_type: "full-time",
    status: "draft",
    posting_date: "",
    closing_date: "",
    hiring_manager_id: "",
  });

  const deleteRef = React.useRef<HTMLButtonElement>(null);

  // Job statuses with colors
  const statusColors: Record<string, string> = {
    draft: "gray",
    published: "green",
    active: "blue",
    paused: "yellow",
    closed: "red",
    archived: "gray",
  };

  // Department options
  const departments = [
    "Engineering",
    "Product",
    "Design",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Operations",
    "Customer Success",
    "Legal",
  ];

  // Employment types
  const employmentTypes = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "temporary", label: "Temporary" },
    { value: "internship", label: "Internship" },
  ];

  // Load data
  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);

      const response = await JobsService.getAll({
        page: currentPage,
        limit: 12,
        orderBy: "created_at",
        ascending: false,
      });

      if (response.success && response.data) {
        setJobs(response.data);
        setTotalPages(Math.ceil((response.count || 0) / 12));
      } else {
        // Fallback to mock data for development
        const mockJobs: Job[] = [
          {
            id: "1",
            title: "Senior Frontend Developer",
            department: "Engineering",
            location: "San Francisco, CA",
            description:
              "We are looking for a Senior Frontend Developer to join our team...",
            requirements: "5+ years experience, React, TypeScript, Node.js",
            salary_range: "$120,000 - $150,000",
            employment_type: "full-time",
            status: "published",
            posting_date: new Date().toISOString().split("T")[0],
            closing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            created_at: new Date().toISOString(),
            applications_count: 15,
          },
          {
            id: "2",
            title: "Product Manager",
            department: "Product",
            location: "Remote",
            description:
              "Join our product team to drive product strategy and execution...",
            requirements:
              "3+ years PM experience, MBA preferred, Agile methodologies",
            salary_range: "$100,000 - $130,000",
            employment_type: "full-time",
            status: "active",
            posting_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            closing_date: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            created_at: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            applications_count: 8,
          },
          {
            id: "3",
            title: "UX Designer",
            department: "Design",
            location: "New York, NY",
            description: "Creative UX Designer to enhance user experiences...",
            requirements: "4+ years UX design, Figma, user research experience",
            salary_range: "$85,000 - $110,000",
            employment_type: "full-time",
            status: "draft",
            posting_date: "",
            closing_date: "",
            created_at: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            applications_count: 0,
          },
        ];

        setJobs(mockJobs);
        setTotalPages(1);

        toast({
          title: "Using Demo Data",
          description: "Connected to mock data for development",
          status: "info",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load jobs",
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, toast]);

  const loadStats = useCallback(async () => {
    try {
      // Calculate stats from current jobs
      const stats = {
        total: jobs.length,
        published: jobs.filter((j) => j.status === "published").length,
        active: jobs.filter((j) => j.status === "active").length,
        draft: jobs.filter((j) => j.status === "draft").length,
        total_applications: jobs.reduce(
          (sum, job) => sum + (job.applications_count || 0),
          0,
        ),
        avg_applications:
          jobs.length > 0
            ? Math.round(
                jobs.reduce(
                  (sum, job) => sum + (job.applications_count || 0),
                  0,
                ) / jobs.length,
              )
            : 0,
      };
      setStats(stats);
    } catch (error) {
      console.error("Error calculating stats:", error);
    }
  }, [jobs]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesDepartment =
      departmentFilter === "all" || job.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Handlers
  const handleCreateJob = async () => {
    try {
      const jobData = {
        ...formData,
        posting_date:
          formData.posting_date || new Date().toISOString().split("T")[0],
      };

      const response = await JobsService.create(jobData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Job created successfully",
          status: "success",
          duration: 3000,
        });
        onCreateClose();
        resetForm();
        loadJobs();
      } else {
        throw new Error(response.error || "Failed to create job");
      }
    } catch (error) {
      console.error("Error creating job:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create job",
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleUpdateJob = async () => {
    if (!selectedJob) return;

    try {
      const response = await JobsService.update(selectedJob.id, formData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Job updated successfully",
          status: "success",
          duration: 3000,
        });
        onEditClose();
        resetForm();
        loadJobs();
      } else {
        throw new Error(response.error || "Failed to update job");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update job",
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleDeleteJob = async () => {
    if (!selectedJob) return;

    try {
      const response = await JobsService.delete(selectedJob.id);

      if (response.success) {
        toast({
          title: "Success",
          description: "Job deleted successfully",
          status: "success",
          duration: 3000,
        });
        onDeleteClose();
        setSelectedJob(null);
        loadJobs();
      } else {
        throw new Error(response.error || "Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete job",
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      const response = await JobsService.update(jobId, { status: newStatus });

      if (response.success) {
        toast({
          title: "Success",
          description: "Job status updated",
          status: "success",
          duration: 3000,
        });
        loadJobs();
      } else {
        throw new Error(response.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update job status",
        status: "error",
        duration: 5000,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      location: "",
      description: "",
      requirements: "",
      salary_range: "",
      employment_type: "full-time",
      status: "draft",
      posting_date: "",
      closing_date: "",
      hiring_manager_id: "",
    });
  };

  const openEditModal = (job: Job) => {
    setSelectedJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      description: job.description || "",
      requirements: job.requirements || "",
      salary_range: job.salary_range || "",
      employment_type: job.employment_type,
      status: job.status,
      posting_date: job.posting_date || "",
      closing_date: job.closing_date || "",
      hiring_manager_id: job.hiring_manager_id || "",
    });
    onEditOpen();
  };

  const openViewModal = (job: Job) => {
    setSelectedJob(job);
    onViewOpen();
  };

  const openDeleteDialog = (job: Job) => {
    setSelectedJob(job);
    onDeleteOpen();
  };

  const viewApplications = (jobId: string) => {
    router.push(`/applications-enhanced?job=${jobId}`);
  };

  return (
    <>
      <Head>
        <title>Jobs Management - Enhanced | HR Portal</title>
        <meta
          name="description"
          content="Enhanced jobs management with full CRUD operations and database connectivity"
        />
      </Head>

      <Container maxW="8xl" py={8}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="lg" color="blue.600">
              Jobs Management
            </Heading>
            <Text color="gray.600" mt={2}>
              Manage job postings and recruitment with comprehensive tools
            </Text>
          </Box>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onCreateOpen}
            size="lg"
          >
            Create Job
          </Button>
        </Flex>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} mb={8}>
          <Stat>
            <StatLabel>Total Jobs</StatLabel>
            <StatNumber color="blue.500">{stats.total || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Published</StatLabel>
            <StatNumber color="green.500">{stats.published || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Active</StatLabel>
            <StatNumber color="blue.500">{stats.active || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Draft</StatLabel>
            <StatNumber color="gray.500">{stats.draft || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Applications</StatLabel>
            <StatNumber color="purple.500">
              {stats.total_applications || 0}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Avg/Job</StatLabel>
            <StatNumber color="orange.500">
              {stats.avg_applications || 0}
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
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="closed">Closed</option>
                <option value="archived">Archived</option>
              </Select>
              <Select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
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

        {/* Jobs Grid */}
        {loading ? (
          <Flex justify="center" align="center" height="400px">
            <VStack>
              <Spinner size="xl" color="blue.500" />
              <Text>Loading jobs...</Text>
            </VStack>
          </Flex>
        ) : (
          <>
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={6}
            >
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <CardHeader pb={2}>
                    <Flex justify="space-between" align="start">
                      <VStack align="start" spacing={1}>
                        <Heading size="md">{job.title}</Heading>
                        <Text fontSize="sm" color="gray.600">
                          {job.department} • {job.location}
                        </Text>
                        <Badge colorScheme={statusColors[job.status]}>
                          {job.status.toUpperCase()}
                        </Badge>
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
                            onClick={() => openViewModal(job)}
                          >
                            View Details
                          </MenuItem>
                          <MenuItem
                            icon={<EditIcon />}
                            onClick={() => openEditModal(job)}
                          >
                            Edit Job
                          </MenuItem>
                          <MenuItem
                            icon={<ExternalLinkIcon />}
                            onClick={() => viewApplications(job.id)}
                          >
                            View Applications ({job.applications_count || 0})
                          </MenuItem>
                          <MenuDivider />
                          {[
                            "draft",
                            "published",
                            "active",
                            "paused",
                            "closed",
                          ].map((status) => (
                            <MenuItem
                              key={status}
                              onClick={() => handleStatusChange(job.id, status)}
                              isDisabled={job.status === status}
                            >
                              Mark as {status}
                            </MenuItem>
                          ))}
                          <MenuDivider />
                          <MenuItem
                            icon={<DeleteIcon />}
                            onClick={() => openDeleteDialog(job)}
                            color="red.500"
                          >
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Flex>
                  </CardHeader>
                  <CardBody pt={0}>
                    <VStack align="start" spacing={3}>
                      <HStack>
                        <Tag size="sm" colorScheme="blue">
                          <TagLabel>{job.employment_type}</TagLabel>
                        </Tag>
                        {job.salary_range && (
                          <Tag size="sm" variant="outline">
                            <TagLabel>{job.salary_range}</TagLabel>
                          </Tag>
                        )}
                      </HStack>

                      {job.description && (
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                          {job.description}
                        </Text>
                      )}

                      <HStack>
                        <CalendarIcon color="gray.500" />
                        <Text fontSize="sm">
                          Created{" "}
                          {formatDistanceToNow(new Date(job.created_at))} ago
                        </Text>
                      </HStack>

                      {job.posting_date && (
                        <HStack>
                          <TimeIcon color="gray.500" />
                          <Text fontSize="sm">
                            Posted{" "}
                            {format(new Date(job.posting_date), "MMM d, yyyy")}
                          </Text>
                        </HStack>
                      )}

                      <HStack>
                        <Text fontSize="sm" fontWeight="medium">
                          Applications: {job.applications_count || 0}
                        </Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Flex justify="center" align="center" mt={8} gap={4}>
                <IconButton
                  aria-label="Previous page"
                  icon={<ChevronLeftIcon />}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  isDisabled={currentPage === 1}
                />
                <Text>
                  Page {currentPage} of {totalPages}
                </Text>
                <IconButton
                  aria-label="Next page"
                  icon={<ChevronRightIcon />}
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  isDisabled={currentPage === totalPages}
                />
              </Flex>
            )}
          </>
        )}

        {/* Create/Edit Modal */}
        <Modal
          isOpen={isCreateOpen || isEditOpen}
          onClose={isCreateOpen ? onCreateClose : onEditClose}
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {isCreateOpen ? "Create New Job" : "Edit Job"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Job Title</FormLabel>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Senior Software Engineer"
                  />
                </FormControl>

                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Department</FormLabel>
                    <Select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
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
                    <FormLabel>Location</FormLabel>
                    <Input
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="San Francisco, CA / Remote"
                    />
                  </FormControl>
                </Grid>

                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl>
                    <FormLabel>Employment Type</FormLabel>
                    <Select
                      value={formData.employment_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          employment_type: e.target.value,
                        })
                      }
                    >
                      {employmentTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="closed">Closed</option>
                    </Select>
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel>Salary Range</FormLabel>
                  <Input
                    value={formData.salary_range}
                    onChange={(e) =>
                      setFormData({ ...formData, salary_range: e.target.value })
                    }
                    placeholder="$120,000 - $150,000"
                  />
                </FormControl>

                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl>
                    <FormLabel>Posting Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.posting_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          posting_date: e.target.value,
                        })
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Closing Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.closing_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          closing_date: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel>Job Description</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Detailed job description..."
                    rows={4}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Requirements</FormLabel>
                  <Textarea
                    value={formData.requirements}
                    onChange={(e) =>
                      setFormData({ ...formData, requirements: e.target.value })
                    }
                    placeholder="Job requirements and qualifications..."
                    rows={3}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                mr={3}
                onClick={isCreateOpen ? onCreateClose : onEditClose}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={isCreateOpen ? handleCreateJob : handleUpdateJob}
                isDisabled={
                  !formData.title || !formData.department || !formData.location
                }
              >
                {isCreateOpen ? "Create" : "Update"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* View Modal */}
        <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Job Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedJob && (
                <VStack align="start" spacing={4}>
                  <Box>
                    <Heading size="lg">{selectedJob.title}</Heading>
                    <Text color="gray.600" fontSize="lg">
                      {selectedJob.department} • {selectedJob.location}
                    </Text>
                    <HStack mt={2}>
                      <Badge colorScheme={statusColors[selectedJob.status]}>
                        {selectedJob.status.toUpperCase()}
                      </Badge>
                      <Tag colorScheme="blue">
                        <TagLabel>{selectedJob.employment_type}</TagLabel>
                      </Tag>
                    </HStack>
                  </Box>

                  <Divider />

                  <Grid templateColumns="1fr 1fr" gap={6} w="full">
                    <VStack align="start" spacing={3}>
                      <Text fontWeight="bold">Job Information</Text>
                      {selectedJob.salary_range && (
                        <Text>Salary: {selectedJob.salary_range}</Text>
                      )}
                      <Text>
                        Created:{" "}
                        {format(
                          new Date(selectedJob.created_at),
                          "MMM d, yyyy",
                        )}
                      </Text>
                      {selectedJob.posting_date && (
                        <Text>
                          Posted:{" "}
                          {format(
                            new Date(selectedJob.posting_date),
                            "MMM d, yyyy",
                          )}
                        </Text>
                      )}
                      {selectedJob.closing_date && (
                        <Text>
                          Closes:{" "}
                          {format(
                            new Date(selectedJob.closing_date),
                            "MMM d, yyyy",
                          )}
                        </Text>
                      )}
                    </VStack>

                    <VStack align="start" spacing={3}>
                      <Text fontWeight="bold">Applications</Text>
                      <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                        {selectedJob.applications_count || 0}
                      </Text>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => viewApplications(selectedJob.id)}
                      >
                        View Applications
                      </Button>
                    </VStack>
                  </Grid>

                  {selectedJob.description && (
                    <>
                      <Divider />
                      <Text fontWeight="bold">Description</Text>
                      <Text>{selectedJob.description}</Text>
                    </>
                  )}

                  {selectedJob.requirements && (
                    <>
                      <Divider />
                      <Text fontWeight="bold">Requirements</Text>
                      <Text>{selectedJob.requirements}</Text>
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

        {/* Delete Confirmation */}
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={deleteRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Job
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete the job{" "}
                <strong>{selectedJob?.title}</strong>? This action cannot be
                undone and will affect all related applications.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={deleteRef} onClick={onDeleteClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleDeleteJob} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Container>
    </>
  );
};

export default JobsEnhanced;
