import {
  AddIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
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
} from "@chakra-ui/react";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

// Enhanced Database Service
import { EmployeeService, LeaveService } from "../lib/database/services";

// Types
interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type_id: string;
  start_date: string;
  end_date: string;
  days: number;
  reason?: string;
  status: string;
  approver_id?: string;
  approval_date?: string;
  approver_comments?: string;
  created_at: string;
  updated_at?: string;
  employee?: any;
  leave_type?: any;
  approver?: any;
}

interface LeaveFormData {
  employee_id: string;
  leave_type_id: string;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
}

interface LeaveType {
  id: string;
  name: string;
  days_per_year: number;
  requires_approval: boolean;
  color?: string;
}

const LeaveEnhanced: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.900");

  // State
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
  const {
    isOpen: isApprovalOpen,
    onOpen: onApprovalOpen,
    onClose: onApprovalClose,
  } = useDisclosure();

  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null,
  );
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject">(
    "approve",
  );
  const [approvalComments, setApprovalComments] = useState("");
  const [formData, setFormData] = useState<LeaveFormData>({
    employee_id: "",
    leave_type_id: "",
    start_date: "",
    end_date: "",
    days: 0,
    reason: "",
  });

  const deleteRef = React.useRef<HTMLButtonElement>(null);

  // Status colors
  const statusColors: Record<string, string> = {
    pending: "yellow",
    approved: "green",
    rejected: "red",
    cancelled: "gray",
  };

  // Leave type colors
  const leaveTypeColors: Record<string, string> = {
    vacation: "blue",
    sick: "red",
    personal: "purple",
    maternity: "pink",
    paternity: "cyan",
    emergency: "orange",
  };

  // Load data
  const loadLeaveRequests = useCallback(async () => {
    try {
      setLoading(true);

      const response = await LeaveService.getRequests({
        page: currentPage,
        limit: 12,
        orderBy: "created_at",
        ascending: false,
      });

      if (response.success && response.data) {
        setLeaveRequests(response.data);
        setTotalPages(Math.ceil((response.count || 0) / 12));
      } else {
        // Fallback to mock data for development
        const mockRequests: LeaveRequest[] = [
          {
            id: "1",
            employee_id: "emp1",
            leave_type_id: "type1",
            start_date: "2024-12-20",
            end_date: "2024-12-30",
            days: 10,
            reason: "Annual vacation with family",
            status: "pending",
            created_at: new Date().toISOString(),
            employee: {
              id: "emp1",
              name: "Sarah Johnson",
              email: "sarah.johnson@company.com",
              department: "Engineering",
              position: "Senior Software Engineer",
            },
            leave_type: {
              id: "type1",
              name: "Vacation",
              days_per_year: 25,
              requires_approval: true,
            },
          },
          {
            id: "2",
            employee_id: "emp2",
            leave_type_id: "type2",
            start_date: "2024-12-15",
            end_date: "2024-12-16",
            days: 2,
            reason: "Medical appointment",
            status: "approved",
            approver_id: "mgr1",
            approval_date: new Date(
              Date.now() - 24 * 60 * 60 * 1000,
            ).toISOString(),
            created_at: new Date(
              Date.now() - 3 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            employee: {
              id: "emp2",
              name: "Michael Chen",
              email: "michael.chen@company.com",
              department: "Product",
              position: "Product Manager",
            },
            leave_type: {
              id: "type2",
              name: "Sick Leave",
              days_per_year: 15,
              requires_approval: false,
            },
            approver: {
              id: "mgr1",
              name: "David Kim",
              email: "david.kim@company.com",
            },
          },
          {
            id: "3",
            employee_id: "emp3",
            leave_type_id: "type3",
            start_date: "2024-12-25",
            end_date: "2024-12-25",
            days: 1,
            reason: "Personal errands",
            status: "rejected",
            approver_id: "mgr1",
            approval_date: new Date(
              Date.now() - 12 * 60 * 60 * 1000,
            ).toISOString(),
            approver_comments: "Insufficient notice period",
            created_at: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            employee: {
              id: "emp3",
              name: "Emily Rodriguez",
              email: "emily.rodriguez@company.com",
              department: "Design",
              position: "UX Designer",
            },
            leave_type: {
              id: "type3",
              name: "Personal Leave",
              days_per_year: 10,
              requires_approval: true,
            },
            approver: {
              id: "mgr1",
              name: "David Kim",
              email: "david.kim@company.com",
            },
          },
        ];

        setLeaveRequests(mockRequests);
        setTotalPages(1);

        toast({
          title: "Using Demo Data",
          description: "Connected to mock data for development",
          status: "info",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error loading leave requests:", error);
      toast({
        title: "Error",
        description: "Failed to load leave requests",
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

  const loadLeaveTypes = useCallback(async () => {
    try {
      const response = await LeaveService.getLeaveTypes();

      if (response.success && response.data) {
        setLeaveTypes(response.data);
      } else {
        // Mock leave types
        setLeaveTypes([
          {
            id: "type1",
            name: "Vacation",
            days_per_year: 25,
            requires_approval: true,
          },
          {
            id: "type2",
            name: "Sick Leave",
            days_per_year: 15,
            requires_approval: false,
          },
          {
            id: "type3",
            name: "Personal Leave",
            days_per_year: 10,
            requires_approval: true,
          },
          {
            id: "type4",
            name: "Maternity Leave",
            days_per_year: 90,
            requires_approval: true,
          },
          {
            id: "type5",
            name: "Emergency Leave",
            days_per_year: 5,
            requires_approval: false,
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading leave types:", error);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      // Calculate stats from current requests
      const stats = {
        total: leaveRequests.length,
        pending: leaveRequests.filter((r) => r.status === "pending").length,
        approved: leaveRequests.filter((r) => r.status === "approved").length,
        rejected: leaveRequests.filter((r) => r.status === "rejected").length,
        total_days: leaveRequests.reduce((sum, r) => sum + r.days, 0),
        approved_days: leaveRequests
          .filter((r) => r.status === "approved")
          .reduce((sum, r) => sum + r.days, 0),
      };
      setStats(stats);
    } catch (error) {
      console.error("Error calculating stats:", error);
    }
  }, [leaveRequests]);

  useEffect(() => {
    loadLeaveRequests();
    loadEmployees();
    loadLeaveTypes();
  }, [loadLeaveRequests, loadEmployees, loadLeaveTypes]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Calculate days between dates
  const calculateDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return differenceInDays(end, start) + 1;
  };

  // Update days when dates change
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const days = calculateDays(formData.start_date, formData.end_date);
      setFormData((prev) => ({ ...prev, days }));
    }
  }, [formData.start_date, formData.end_date]);

  // Filter requests
  const filteredRequests = leaveRequests.filter((request) => {
    const matchesSearch =
      request.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.leave_type?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (request.reason || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    const matchesType =
      typeFilter === "all" || request.leave_type?.name === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Handlers
  const handleCreateRequest = async () => {
    try {
      const response = await LeaveService.create(formData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Leave request created successfully",
          status: "success",
          duration: 3000,
        });
        onCreateClose();
        resetForm();
        loadLeaveRequests();
      } else {
        throw new Error(response.error || "Failed to create leave request");
      }
    } catch (error) {
      console.error("Error creating leave request:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create leave request",
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    try {
      const response = await LeaveService.update(selectedRequest.id, formData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Leave request updated successfully",
          status: "success",
          duration: 3000,
        });
        onEditClose();
        resetForm();
        loadLeaveRequests();
      } else {
        throw new Error(response.error || "Failed to update leave request");
      }
    } catch (error) {
      console.error("Error updating leave request:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update leave request",
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleDeleteRequest = async () => {
    if (!selectedRequest) return;

    try {
      const response = await LeaveService.delete(selectedRequest.id);

      if (response.success) {
        toast({
          title: "Success",
          description: "Leave request deleted successfully",
          status: "success",
          duration: 3000,
        });
        onDeleteClose();
        setSelectedRequest(null);
        loadLeaveRequests();
      } else {
        throw new Error(response.error || "Failed to delete leave request");
      }
    } catch (error) {
      console.error("Error deleting leave request:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete leave request",
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleApprovalAction = async () => {
    if (!selectedRequest) return;

    try {
      let response;
      if (approvalAction === "approve") {
        response = await LeaveService.approve(
          selectedRequest.id,
          "current-user-id",
          approvalComments,
        );
      } else {
        response = await LeaveService.reject(
          selectedRequest.id,
          "current-user-id",
          approvalComments,
        );
      }

      if (response.success) {
        toast({
          title: "Success",
          description: `Leave request ${approvalAction}d successfully`,
          status: "success",
          duration: 3000,
        });
        onApprovalClose();
        setApprovalComments("");
        loadLeaveRequests();
      } else {
        throw new Error(
          response.error || `Failed to ${approvalAction} leave request`,
        );
      }
    } catch (error) {
      console.error(`Error ${approvalAction}ing leave request:`, error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : `Failed to ${approvalAction} leave request`,
        status: "error",
        duration: 5000,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      employee_id: "",
      leave_type_id: "",
      start_date: "",
      end_date: "",
      days: 0,
      reason: "",
    });
  };

  const openEditModal = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setFormData({
      employee_id: request.employee_id,
      leave_type_id: request.leave_type_id,
      start_date: request.start_date,
      end_date: request.end_date,
      days: request.days,
      reason: request.reason || "",
    });
    onEditOpen();
  };

  const openViewModal = (request: LeaveRequest) => {
    setSelectedRequest(request);
    onViewOpen();
  };

  const openDeleteDialog = (request: LeaveRequest) => {
    setSelectedRequest(request);
    onDeleteOpen();
  };

  const openApprovalDialog = (
    request: LeaveRequest,
    action: "approve" | "reject",
  ) => {
    setSelectedRequest(request);
    setApprovalAction(action);
    onApprovalOpen();
  };

  return (
    <>
      <Head>
        <title>Leave Management - Enhanced | HR Portal</title>
        <meta
          name="description"
          content="Enhanced leave management with full CRUD operations and approval workflow"
        />
      </Head>

      <Container maxW="8xl" py={8}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="lg" color="blue.600">
              Leave Management
            </Heading>
            <Text color="gray.600" mt={2}>
              Manage employee leave requests and approvals
            </Text>
          </Box>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onCreateOpen}
            size="lg"
          >
            New Request
          </Button>
        </Flex>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} mb={8}>
          <Stat>
            <StatLabel>Total Requests</StatLabel>
            <StatNumber color="blue.500">{stats.total || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Pending</StatLabel>
            <StatNumber color="yellow.500">{stats.pending || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Approved</StatLabel>
            <StatNumber color="green.500">{stats.approved || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Rejected</StatLabel>
            <StatNumber color="red.500">{stats.rejected || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Total Days</StatLabel>
            <StatNumber color="purple.500">{stats.total_days || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Approved Days</StatLabel>
            <StatNumber color="green.500">
              {stats.approved_days || 0}
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
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </Select>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                {leaveTypes.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </Select>
            </Grid>
          </CardBody>
        </Card>

        {/* Requests Grid */}
        {loading ? (
          <Flex justify="center" align="center" height="400px">
            <VStack>
              <Spinner size="xl" color="blue.500" />
              <Text>Loading leave requests...</Text>
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
              {filteredRequests.map((request) => (
                <Card
                  key={request.id}
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <CardHeader pb={2}>
                    <Flex justify="space-between" align="start">
                      <VStack align="start" spacing={1}>
                        <Heading size="md">{request.employee?.name}</Heading>
                        <Text fontSize="sm" color="gray.600">
                          {request.employee?.department} •{" "}
                          {request.employee?.position}
                        </Text>
                        <HStack>
                          <Badge colorScheme={statusColors[request.status]}>
                            {request.status.toUpperCase()}
                          </Badge>
                          <Tag
                            size="sm"
                            colorScheme={
                              leaveTypeColors[
                                request.leave_type?.name?.toLowerCase()
                              ] || "gray"
                            }
                          >
                            <TagLabel>{request.leave_type?.name}</TagLabel>
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
                            onClick={() => openViewModal(request)}
                          >
                            View Details
                          </MenuItem>
                          <MenuItem
                            icon={<EditIcon />}
                            onClick={() => openEditModal(request)}
                          >
                            Edit Request
                          </MenuItem>
                          {request.status === "pending" && (
                            <>
                              <MenuDivider />
                              <MenuItem
                                icon={<CheckIcon />}
                                onClick={() =>
                                  openApprovalDialog(request, "approve")
                                }
                                color="green.500"
                              >
                                Approve
                              </MenuItem>
                              <MenuItem
                                icon={<CloseIcon />}
                                onClick={() =>
                                  openApprovalDialog(request, "reject")
                                }
                                color="red.500"
                              >
                                Reject
                              </MenuItem>
                            </>
                          )}
                          <MenuDivider />
                          <MenuItem
                            icon={<DeleteIcon />}
                            onClick={() => openDeleteDialog(request)}
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
                        <CalendarIcon color="gray.500" />
                        <Text fontSize="sm">
                          {format(new Date(request.start_date), "MMM d")} -{" "}
                          {format(new Date(request.end_date), "MMM d, yyyy")}
                        </Text>
                      </HStack>

                      <HStack>
                        <TimeIcon color="gray.500" />
                        <Text fontSize="sm">{request.days} days</Text>
                      </HStack>

                      {request.reason && (
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                          {request.reason}
                        </Text>
                      )}

                      <HStack>
                        <Text fontSize="sm" color="gray.500">
                          Requested{" "}
                          {formatDistanceToNow(new Date(request.created_at))}{" "}
                          ago
                        </Text>
                      </HStack>

                      {request.approval_date && (
                        <HStack>
                          <Text fontSize="sm" color="gray.500">
                            {request.status === "approved"
                              ? "Approved"
                              : "Rejected"}{" "}
                            by {request.approver?.name}
                          </Text>
                        </HStack>
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
              {isCreateOpen ? "New Leave Request" : "Edit Leave Request"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Employee</FormLabel>
                    <Select
                      value={formData.employee_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          employee_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} - {emp.department}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Leave Type</FormLabel>
                    <Select
                      value={formData.leave_type_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          leave_type_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Type</option>
                      {leaveTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name} ({type.days_per_year} days/year)
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid templateColumns="1fr 1fr 1fr" gap={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Start Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          start_date: e.target.value,
                        })
                      }
                    />
                  </FormControl>

                  <FormControl isRequired>
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
                    <FormLabel>Days</FormLabel>
                    <NumberInput value={formData.days} isReadOnly>
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel>Reason (Optional)</FormLabel>
                  <Textarea
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    placeholder="Reason for leave request..."
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
                  isCreateOpen ? handleCreateRequest : handleUpdateRequest
                }
                isDisabled={
                  !formData.employee_id ||
                  !formData.leave_type_id ||
                  !formData.start_date ||
                  !formData.end_date
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
            <ModalHeader>Leave Request Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedRequest && (
                <VStack align="start" spacing={4}>
                  <Grid templateColumns="1fr 1fr" gap={6} w="full">
                    <VStack align="start" spacing={3}>
                      <Text fontWeight="bold">Employee Information</Text>
                      <Text>Name: {selectedRequest.employee?.name}</Text>
                      <Text>Email: {selectedRequest.employee?.email}</Text>
                      <Text>
                        Department: {selectedRequest.employee?.department}
                      </Text>
                      <Text>
                        Position: {selectedRequest.employee?.position}
                      </Text>
                    </VStack>

                    <VStack align="start" spacing={3}>
                      <Text fontWeight="bold">Leave Details</Text>
                      <Text>Type: {selectedRequest.leave_type?.name}</Text>
                      <Text>
                        Dates:{" "}
                        {format(new Date(selectedRequest.start_date), "MMM d")}{" "}
                        - {format(new Date(selectedRequest.end_date), "MMM d")}
                      </Text>
                      <Text>Duration: {selectedRequest.days} days</Text>
                      <HStack>
                        <Text>Status:</Text>
                        <Badge
                          colorScheme={statusColors[selectedRequest.status]}
                        >
                          {selectedRequest.status.toUpperCase()}
                        </Badge>
                      </HStack>
                    </VStack>
                  </Grid>

                  <Divider />

                  {selectedRequest.reason && (
                    <>
                      <Text fontWeight="bold">Reason</Text>
                      <Text>{selectedRequest.reason}</Text>
                      <Divider />
                    </>
                  )}

                  {selectedRequest.approver && (
                    <>
                      <Text fontWeight="bold">Approval Information</Text>
                      <Text>
                        {selectedRequest.status === "approved"
                          ? "Approved"
                          : "Rejected"}{" "}
                        by: {selectedRequest.approver.name}
                      </Text>
                      {selectedRequest.approval_date && (
                        <Text>
                          Date:{" "}
                          {format(
                            new Date(selectedRequest.approval_date),
                            "MMM d, yyyy 'at' h:mm a",
                          )}
                        </Text>
                      )}
                      {selectedRequest.approver_comments && (
                        <Text>
                          Comments: {selectedRequest.approver_comments}
                        </Text>
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

        {/* Approval Modal */}
        <Modal isOpen={isApprovalOpen} onClose={onApprovalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {approvalAction === "approve" ? "Approve" : "Reject"} Leave
              Request
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Text>
                  Are you sure you want to {approvalAction} the leave request
                  from <strong>{selectedRequest?.employee?.name}</strong>?
                </Text>
                <FormControl>
                  <FormLabel>Comments (Optional)</FormLabel>
                  <Textarea
                    value={approvalComments}
                    onChange={(e) => setApprovalComments(e.target.value)}
                    placeholder="Add comments..."
                    rows={3}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={onApprovalClose}>
                Cancel
              </Button>
              <Button
                colorScheme={approvalAction === "approve" ? "green" : "red"}
                onClick={handleApprovalAction}
              >
                {approvalAction === "approve" ? "Approve" : "Reject"}
              </Button>
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
                Delete Leave Request
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete the leave request from{" "}
                <strong>{selectedRequest?.employee?.name}</strong>? This action
                cannot be undone.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={deleteRef} onClick={onDeleteClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleDeleteRequest} ml={3}>
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

export default LeaveEnhanced;
