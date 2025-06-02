import {
  AddIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
  EmailIcon,
  PhoneIcon,
  SearchIcon,
  StarIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
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
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { format, formatDistanceToNow } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

// Enhanced Database Service
import { ApplicationsService, JobsService } from "../lib/database/services";

// Types
interface Application {
  id: string;
  job_id: string;
  applicant_id?: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone?: string;
  resume_url?: string;
  cover_letter_url?: string;
  status: string;
  stage_id?: string;
  source: string;
  salary_expectation?: number;
  availability_date?: string;
  years_experience?: number;
  skills?: string[];
  education?: any[];
  work_experience?: any[];
  custom_fields?: any;
  notes?: string;
  created_at: string;
  updated_at?: string;
  job?: any;
  candidate?: any;
  stage?: any;
  reviews?: any[];
}

interface ApplicationFormData {
  job_id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  resume_url?: string;
  cover_letter_url?: string;
  status: string;
  source: string;
  salary_expectation?: number;
  availability_date?: string;
  years_experience?: number;
  skills: string;
  notes?: string;
}

const ApplicationsEnhanced: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.900");

  // State
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<any>({});
  const [selectedApplications, setSelectedApplications] = useState<string[]>(
    [],
  );

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

  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [formData, setFormData] = useState<ApplicationFormData>({
    job_id: "",
    candidate_name: "",
    candidate_email: "",
    candidate_phone: "",
    status: "applied",
    source: "website",
    skills: "",
  });

  const deleteRef = React.useRef<HTMLButtonElement>(null);

  // Application statuses with colors
  const statusColors: Record<string, string> = {
    applied: "blue",
    screening: "orange",
    interview: "purple",
    assessment: "cyan",
    offer: "green",
    hired: "green",
    rejected: "red",
    withdrawn: "gray",
  };

  // Load data
  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);

      const response = await ApplicationsService.getAll({
        page: currentPage,
        limit: 12,
        orderBy: "created_at",
        ascending: false,
      });

      if (response.success && response.data) {
        setApplications(response.data);
        setTotalPages(Math.ceil((response.count || 0) / 12));
      } else {
        // Fallback to mock data for development
        const mockApplications: Application[] = [
          {
            id: "1",
            job_id: "job1",
            candidate_name: "Sarah Johnson",
            candidate_email: "sarah.johnson@email.com",
            candidate_phone: "+1 (555) 123-4567",
            status: "interview",
            source: "LinkedIn",
            salary_expectation: 85000,
            years_experience: 5,
            skills: ["React", "TypeScript", "Node.js"],
            created_at: new Date().toISOString(),
            job: {
              id: "job1",
              title: "Senior Frontend Developer",
              department: "Engineering",
            },
          },
          {
            id: "2",
            job_id: "job2",
            candidate_name: "Michael Chen",
            candidate_email: "michael.chen@email.com",
            candidate_phone: "+1 (555) 987-6543",
            status: "screening",
            source: "Website",
            salary_expectation: 95000,
            years_experience: 8,
            skills: ["Python", "Django", "PostgreSQL"],
            created_at: new Date(Date.now() - 86400000).toISOString(),
            job: {
              id: "job2",
              title: "Backend Engineer",
              department: "Engineering",
            },
          },
          {
            id: "3",
            job_id: "job1",
            candidate_name: "Emily Rodriguez",
            candidate_email: "emily.rodriguez@email.com",
            candidate_phone: "+1 (555) 555-0123",
            status: "applied",
            source: "Indeed",
            salary_expectation: 75000,
            years_experience: 3,
            skills: ["JavaScript", "Vue.js", "CSS"],
            created_at: new Date(Date.now() - 172800000).toISOString(),
            job: {
              id: "job1",
              title: "Senior Frontend Developer",
              department: "Engineering",
            },
          },
        ];

        setApplications(mockApplications);
        setTotalPages(1);

        toast({
          title: "Using Demo Data",
          description: "Connected to mock data for development",
          status: "info",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error loading applications:", error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, toast]);

  const loadJobs = useCallback(async () => {
    try {
      const response = await JobsService.getAll();
      if (response.success && response.data) {
        setJobs(response.data);
      } else {
        // Mock jobs for development
        setJobs([
          {
            id: "job1",
            title: "Senior Frontend Developer",
            department: "Engineering",
          },
          { id: "job2", title: "Backend Engineer", department: "Engineering" },
          { id: "job3", title: "Product Manager", department: "Product" },
        ]);
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const response = await ApplicationsService.getApplicationStats();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        // Mock stats
        setStats({
          total: applications.length,
          applied: applications.filter((a) => a.status === "applied").length,
          screening: applications.filter((a) => a.status === "screening")
            .length,
          interview: applications.filter((a) => a.status === "interview")
            .length,
          hired: applications.filter((a) => a.status === "hired").length,
          rejected: applications.filter((a) => a.status === "rejected").length,
        });
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  }, [applications]);

  useEffect(() => {
    loadApplications();
    loadJobs();
  }, [loadApplications, loadJobs]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.candidate_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.job?.title || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesJob = jobFilter === "all" || app.job_id === jobFilter;

    return matchesSearch && matchesStatus && matchesJob;
  });

  // Handlers
  const handleCreateApplication = async () => {
    try {
      const applicationData = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        salary_expectation: formData.salary_expectation || undefined,
      };

      const response = await ApplicationsService.create(applicationData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Application created successfully",
          status: "success",
          duration: 3000,
        });
        onCreateClose();
        resetForm();
        loadApplications();
      } else {
        throw new Error(response.error || "Failed to create application");
      }
    } catch (error) {
      console.error("Error creating application:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create application",
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleUpdateApplication = async () => {
    if (!selectedApplication) return;

    try {
      const updates = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        salary_expectation: formData.salary_expectation || undefined,
      };

      const response = await ApplicationsService.update(
        selectedApplication.id,
        updates,
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Application updated successfully",
          status: "success",
          duration: 3000,
        });
        onEditClose();
        resetForm();
        loadApplications();
      } else {
        throw new Error(response.error || "Failed to update application");
      }
    } catch (error) {
      console.error("Error updating application:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update application",
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleDeleteApplication = async () => {
    if (!selectedApplication) return;

    try {
      const response = await ApplicationsService.delete(selectedApplication.id);

      if (response.success) {
        toast({
          title: "Success",
          description: "Application deleted successfully",
          status: "success",
          duration: 3000,
        });
        onDeleteClose();
        setSelectedApplication(null);
        loadApplications();
      } else {
        throw new Error(response.error || "Failed to delete application");
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete application",
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string,
  ) => {
    try {
      const response = await ApplicationsService.updateStatus(
        applicationId,
        newStatus,
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Application status updated",
          status: "success",
          duration: 3000,
        });
        loadApplications();
      } else {
        throw new Error(response.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        status: "error",
        duration: 5000,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      job_id: "",
      candidate_name: "",
      candidate_email: "",
      candidate_phone: "",
      status: "applied",
      source: "website",
      skills: "",
    });
  };

  const openEditModal = (application: Application) => {
    setSelectedApplication(application);
    setFormData({
      job_id: application.job_id,
      candidate_name: application.candidate_name,
      candidate_email: application.candidate_email,
      candidate_phone: application.candidate_phone || "",
      status: application.status,
      source: application.source,
      salary_expectation: application.salary_expectation,
      availability_date: application.availability_date,
      years_experience: application.years_experience,
      skills: (application.skills || []).join(", "),
      notes: application.notes || "",
    });
    onEditOpen();
  };

  const openViewModal = (application: Application) => {
    setSelectedApplication(application);
    onViewOpen();
  };

  const openDeleteDialog = (application: Application) => {
    setSelectedApplication(application);
    onDeleteOpen();
  };

  return (
    <>
      <Head>
        <title>Applications Management - Enhanced | HR Portal</title>
        <meta
          name="description"
          content="Enhanced applications management with full CRUD operations and database connectivity"
        />
      </Head>

      <Container maxW="8xl" py={8}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="lg" color="blue.600">
              Applications Management
            </Heading>
            <Text color="gray.600" mt={2}>
              Manage job applications with comprehensive CRUD operations
            </Text>
          </Box>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onCreateOpen}
            size="lg"
          >
            Add Application
          </Button>
        </Flex>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={4} mb={8}>
          <Stat>
            <StatLabel>Total</StatLabel>
            <StatNumber color="blue.500">{stats.total || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Applied</StatLabel>
            <StatNumber color="blue.500">{stats.applied || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Screening</StatLabel>
            <StatNumber color="orange.500">{stats.screening || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Interview</StatLabel>
            <StatNumber color="purple.500">{stats.interview || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Hired</StatLabel>
            <StatNumber color="green.500">{stats.hired || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Rejected</StatLabel>
            <StatNumber color="red.500">{stats.rejected || 0}</StatNumber>
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
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="applied">Applied</option>
                <option value="screening">Screening</option>
                <option value="interview">Interview</option>
                <option value="assessment">Assessment</option>
                <option value="offer">Offer</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </Select>
              <Select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
              >
                <option value="all">All Jobs</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </Select>
            </Grid>
          </CardBody>
        </Card>

        {/* Applications Grid */}
        {loading ? (
          <Flex justify="center" align="center" height="400px">
            <VStack>
              <Spinner size="xl" color="blue.500" />
              <Text>Loading applications...</Text>
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
              {filteredApplications.map((application) => (
                <Card
                  key={application.id}
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <CardHeader pb={2}>
                    <Flex justify="space-between" align="start">
                      <VStack align="start" spacing={1}>
                        <Heading size="md">
                          {application.candidate_name}
                        </Heading>
                        <Text fontSize="sm" color="gray.600">
                          {application.job?.title || "Unknown Position"}
                        </Text>
                        <Badge colorScheme={statusColors[application.status]}>
                          {application.status.toUpperCase()}
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
                            onClick={() => openViewModal(application)}
                          >
                            View Details
                          </MenuItem>
                          <MenuItem
                            icon={<EditIcon />}
                            onClick={() => openEditModal(application)}
                          >
                            Edit
                          </MenuItem>
                          <MenuDivider />
                          {[
                            "applied",
                            "screening",
                            "interview",
                            "offer",
                            "hired",
                            "rejected",
                          ].map((status) => (
                            <MenuItem
                              key={status}
                              onClick={() =>
                                handleStatusChange(application.id, status)
                              }
                              isDisabled={application.status === status}
                            >
                              Mark as {status}
                            </MenuItem>
                          ))}
                          <MenuDivider />
                          <MenuItem
                            icon={<DeleteIcon />}
                            onClick={() => openDeleteDialog(application)}
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
                        <EmailIcon color="gray.500" />
                        <Text fontSize="sm">{application.candidate_email}</Text>
                      </HStack>
                      {application.candidate_phone && (
                        <HStack>
                          <PhoneIcon color="gray.500" />
                          <Text fontSize="sm">
                            {application.candidate_phone}
                          </Text>
                        </HStack>
                      )}
                      <HStack>
                        <CalendarIcon color="gray.500" />
                        <Text fontSize="sm">
                          Applied{" "}
                          {formatDistanceToNow(
                            new Date(application.created_at),
                          )}{" "}
                          ago
                        </Text>
                      </HStack>
                      {application.years_experience && (
                        <HStack>
                          <StarIcon color="gray.500" />
                          <Text fontSize="sm">
                            {application.years_experience} years experience
                          </Text>
                        </HStack>
                      )}
                      {application.skills && application.skills.length > 0 && (
                        <Wrap>
                          {application.skills
                            .slice(0, 3)
                            .map((skill, index) => (
                              <WrapItem key={index}>
                                <Tag size="sm" colorScheme="blue">
                                  <TagLabel>{skill}</TagLabel>
                                </Tag>
                              </WrapItem>
                            ))}
                          {application.skills.length > 3 && (
                            <WrapItem>
                              <Tag size="sm" variant="outline">
                                +{application.skills.length - 3} more
                              </Tag>
                            </WrapItem>
                          )}
                        </Wrap>
                      )}
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
              {isCreateOpen ? "Add New Application" : "Edit Application"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Job Position</FormLabel>
                  <Select
                    value={formData.job_id}
                    onChange={(e) =>
                      setFormData({ ...formData, job_id: e.target.value })
                    }
                  >
                    <option value="">Select a job</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} - {job.department}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Candidate Name</FormLabel>
                    <Input
                      value={formData.candidate_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          candidate_name: e.target.value,
                        })
                      }
                      placeholder="Full name"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={formData.candidate_email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          candidate_email: e.target.value,
                        })
                      }
                      placeholder="email@example.com"
                    />
                  </FormControl>
                </Grid>

                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl>
                    <FormLabel>Phone</FormLabel>
                    <Input
                      value={formData.candidate_phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          candidate_phone: e.target.value,
                        })
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Years of Experience</FormLabel>
                    <NumberInput
                      value={formData.years_experience || ""}
                      onChange={(_, value) =>
                        setFormData({
                          ...formData,
                          years_experience: value || undefined,
                        })
                      }
                      min={0}
                      max={50}
                    >
                      <NumberInputField placeholder="Years" />
                    </NumberInput>
                  </FormControl>
                </Grid>

                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="applied">Applied</option>
                      <option value="screening">Screening</option>
                      <option value="interview">Interview</option>
                      <option value="assessment">Assessment</option>
                      <option value="offer">Offer</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Source</FormLabel>
                    <Select
                      value={formData.source}
                      onChange={(e) =>
                        setFormData({ ...formData, source: e.target.value })
                      }
                    >
                      <option value="website">Company Website</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="indeed">Indeed</option>
                      <option value="glassdoor">Glassdoor</option>
                      <option value="referral">Referral</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel>Salary Expectation</FormLabel>
                  <NumberInput
                    value={formData.salary_expectation || ""}
                    onChange={(_, value) =>
                      setFormData({
                        ...formData,
                        salary_expectation: value || undefined,
                      })
                    }
                    min={0}
                  >
                    <NumberInputField placeholder="Annual salary expectation" />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Skills</FormLabel>
                  <Input
                    value={formData.skills}
                    onChange={(e) =>
                      setFormData({ ...formData, skills: e.target.value })
                    }
                    placeholder="React, TypeScript, Node.js (comma-separated)"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Notes</FormLabel>
                  <Textarea
                    value={formData.notes || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Additional notes..."
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
                onClick={
                  isCreateOpen
                    ? handleCreateApplication
                    : handleUpdateApplication
                }
                isDisabled={
                  !formData.job_id ||
                  !formData.candidate_name ||
                  !formData.candidate_email
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
            <ModalHeader>Application Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedApplication && (
                <VStack align="start" spacing={4}>
                  <Flex align="center" gap={4}>
                    <Avatar
                      name={selectedApplication.candidate_name}
                      size="lg"
                    />
                    <VStack align="start" spacing={1}>
                      <Heading size="lg">
                        {selectedApplication.candidate_name}
                      </Heading>
                      <Text color="gray.600">
                        {selectedApplication.job?.title}
                      </Text>
                      <Badge
                        colorScheme={statusColors[selectedApplication.status]}
                      >
                        {selectedApplication.status.toUpperCase()}
                      </Badge>
                    </VStack>
                  </Flex>

                  <Divider />

                  <Grid templateColumns="1fr 1fr" gap={6} w="full">
                    <VStack align="start" spacing={3}>
                      <Text fontWeight="bold">Contact Information</Text>
                      <HStack>
                        <EmailIcon />
                        <Text>{selectedApplication.candidate_email}</Text>
                      </HStack>
                      {selectedApplication.candidate_phone && (
                        <HStack>
                          <PhoneIcon />
                          <Text>{selectedApplication.candidate_phone}</Text>
                        </HStack>
                      )}
                    </VStack>

                    <VStack align="start" spacing={3}>
                      <Text fontWeight="bold">Application Info</Text>
                      <HStack>
                        <CalendarIcon />
                        <Text>
                          Applied{" "}
                          {format(
                            new Date(selectedApplication.created_at),
                            "MMM d, yyyy",
                          )}
                        </Text>
                      </HStack>
                      <Text>Source: {selectedApplication.source}</Text>
                      {selectedApplication.years_experience && (
                        <Text>
                          {selectedApplication.years_experience} years
                          experience
                        </Text>
                      )}
                    </VStack>
                  </Grid>

                  {selectedApplication.salary_expectation && (
                    <>
                      <Divider />
                      <Text fontWeight="bold">Salary Expectation</Text>
                      <Text>
                        $
                        {selectedApplication.salary_expectation.toLocaleString()}{" "}
                        annually
                      </Text>
                    </>
                  )}

                  {selectedApplication.skills &&
                    selectedApplication.skills.length > 0 && (
                      <>
                        <Divider />
                        <Text fontWeight="bold">Skills</Text>
                        <Wrap>
                          {selectedApplication.skills.map((skill, index) => (
                            <WrapItem key={index}>
                              <Tag colorScheme="blue">
                                <TagLabel>{skill}</TagLabel>
                              </Tag>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </>
                    )}

                  {selectedApplication.notes && (
                    <>
                      <Divider />
                      <Text fontWeight="bold">Notes</Text>
                      <Text>{selectedApplication.notes}</Text>
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
                Delete Application
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete the application from{" "}
                <strong>{selectedApplication?.candidate_name}</strong>? This
                action cannot be undone.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={deleteRef} onClick={onDeleteClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleDeleteApplication}
                  ml={3}
                >
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

export default ApplicationsEnhanced;
