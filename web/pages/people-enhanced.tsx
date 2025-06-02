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
  Select,
  SimpleGrid,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
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
interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  employee_id?: string;
  department: string;
  position: string;
  hire_date?: string;
  manager_id?: string;
  role: string;
  status?: string;
  created_at: string;
  updated_at?: string;
  manager?: any;
  department_info?: any;
}

interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  employee_id: string;
  department: string;
  position: string;
  hire_date: string;
  manager_id: string;
  role: string;
  status: string;
}

const PeopleEnhanced: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.900");

  // State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
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

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    email: "",
    phone: "",
    employee_id: "",
    department: "",
    position: "",
    hire_date: "",
    manager_id: "",
    role: "employee",
    status: "active",
  });

  const deleteRef = React.useRef<HTMLButtonElement>(null);

  // Employee roles with colors
  const roleColors: Record<string, string> = {
    admin: "red",
    hr: "purple",
    manager: "blue",
    team_lead: "cyan",
    employee: "green",
    contractor: "orange",
    intern: "gray",
  };

  // Status colors
  const statusColors: Record<string, string> = {
    active: "green",
    inactive: "gray",
    terminated: "red",
    on_leave: "yellow",
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

  // Role options
  const roles = [
    { value: "admin", label: "Admin" },
    { value: "hr", label: "HR" },
    { value: "manager", label: "Manager" },
    { value: "team_lead", label: "Team Lead" },
    { value: "employee", label: "Employee" },
    { value: "contractor", label: "Contractor" },
    { value: "intern", label: "Intern" },
  ];

  // Load data
  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);

      const response = await EmployeeService.getAll({
        page: currentPage,
        limit: 12,
        orderBy: "created_at",
        ascending: false,
      });

      if (response.success && response.data) {
        setEmployees(response.data);
        setTotalPages(Math.ceil((response.count || 0) / 12));
      } else {
        // Fallback to mock data for development
        const mockEmployees: Employee[] = [
          {
            id: "1",
            name: "Sarah Johnson",
            email: "sarah.johnson@company.com",
            phone: "+1 (555) 123-4567",
            employee_id: "EMP001",
            department: "Engineering",
            position: "Senior Software Engineer",
            hire_date: "2022-03-15",
            role: "employee",
            status: "active",
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Michael Chen",
            email: "michael.chen@company.com",
            phone: "+1 (555) 987-6543",
            employee_id: "EMP002",
            department: "Product",
            position: "Product Manager",
            hire_date: "2021-11-08",
            role: "manager",
            status: "active",
            created_at: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
          {
            id: "3",
            name: "Emily Rodriguez",
            email: "emily.rodriguez@company.com",
            phone: "+1 (555) 555-0123",
            employee_id: "EMP003",
            department: "Design",
            position: "UX Designer",
            hire_date: "2023-01-20",
            role: "employee",
            status: "active",
            created_at: new Date(
              Date.now() - 14 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
          {
            id: "4",
            name: "David Kim",
            email: "david.kim@company.com",
            phone: "+1 (555) 444-0987",
            employee_id: "EMP004",
            department: "HR",
            position: "HR Manager",
            hire_date: "2020-05-12",
            role: "hr",
            status: "active",
            created_at: new Date(
              Date.now() - 21 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
        ];

        setEmployees(mockEmployees);
        setTotalPages(1);

        toast({
          title: "Using Demo Data",
          description: "Connected to mock data for development",
          status: "info",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error loading employees:", error);
      toast({
        title: "Error",
        description: "Failed to load employees",
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, toast]);

  const loadStats = useCallback(async () => {
    try {
      // Calculate stats from current employees
      const stats = {
        total: employees.length,
        active: employees.filter((e) => e.status === "active").length,
        managers: employees.filter(
          (e) => e.role === "manager" || e.role === "hr" || e.role === "admin",
        ).length,
        new_hires: employees.filter((e) => {
          if (!e.hire_date) return false;
          const hireDate = new Date(e.hire_date);
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          return hireDate >= threeMonthsAgo;
        }).length,
        departments: [...new Set(employees.map((e) => e.department))].length,
        on_leave: employees.filter((e) => e.status === "on_leave").length,
      };
      setStats(stats);
    } catch (error) {
      console.error("Error calculating stats:", error);
    }
  }, [employees]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Filter employees
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.employee_id || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === "all" || employee.department === departmentFilter;
    const matchesRole = roleFilter === "all" || employee.role === roleFilter;

    return matchesSearch && matchesDepartment && matchesRole;
  });

  // Handlers
  const handleCreateEmployee = async () => {
    try {
      const response = await EmployeeService.create(formData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Employee created successfully",
          status: "success",
          duration: 3000,
        });
        onCreateClose();
        resetForm();
        loadEmployees();
      } else {
        throw new Error(response.error || "Failed to create employee");
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create employee",
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleUpdateEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      const response = await EmployeeService.update(
        selectedEmployee.id,
        formData,
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Employee updated successfully",
          status: "success",
          duration: 3000,
        });
        onEditClose();
        resetForm();
        loadEmployees();
      } else {
        throw new Error(response.error || "Failed to update employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update employee",
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      const response = await EmployeeService.delete(selectedEmployee.id);

      if (response.success) {
        toast({
          title: "Success",
          description: "Employee deleted successfully",
          status: "success",
          duration: 3000,
        });
        onDeleteClose();
        setSelectedEmployee(null);
        loadEmployees();
      } else {
        throw new Error(response.error || "Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete employee",
        status: "error",
        duration: 5000,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      employee_id: "",
      department: "",
      position: "",
      hire_date: "",
      manager_id: "",
      role: "employee",
      status: "active",
    });
  };

  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone || "",
      employee_id: employee.employee_id || "",
      department: employee.department,
      position: employee.position,
      hire_date: employee.hire_date || "",
      manager_id: employee.manager_id || "",
      role: employee.role,
      status: employee.status || "active",
    });
    onEditOpen();
  };

  const openViewModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    onViewOpen();
  };

  const openDeleteDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    onDeleteOpen();
  };

  return (
    <>
      <Head>
        <title>People Management - Enhanced | HR Portal</title>
        <meta
          name="description"
          content="Enhanced people management with full CRUD operations and database connectivity"
        />
      </Head>

      <Container maxW="8xl" py={8}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="lg" color="blue.600">
              People Management
            </Heading>
            <Text color="gray.600" mt={2}>
              Manage employees and team members with comprehensive tools
            </Text>
          </Box>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onCreateOpen}
            size="lg"
          >
            Add Employee
          </Button>
        </Flex>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} mb={8}>
          <Stat>
            <StatLabel>Total People</StatLabel>
            <StatNumber color="blue.500">{stats.total || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Active</StatLabel>
            <StatNumber color="green.500">{stats.active || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Managers</StatLabel>
            <StatNumber color="purple.500">{stats.managers || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>New Hires</StatLabel>
            <StatNumber color="cyan.500">{stats.new_hires || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Departments</StatLabel>
            <StatNumber color="orange.500">{stats.departments || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>On Leave</StatLabel>
            <StatNumber color="yellow.500">{stats.on_leave || 0}</StatNumber>
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
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
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
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </Select>
            </Grid>
          </CardBody>
        </Card>

        {/* Employees Grid */}
        {loading ? (
          <Flex justify="center" align="center" height="400px">
            <VStack>
              <Spinner size="xl" color="blue.500" />
              <Text>Loading employees...</Text>
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
              {filteredEmployees.map((employee) => (
                <Card
                  key={employee.id}
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <CardHeader pb={2}>
                    <Flex justify="space-between" align="start">
                      <HStack spacing={3}>
                        <Avatar name={employee.name} size="md" />
                        <VStack align="start" spacing={1}>
                          <Heading size="md">{employee.name}</Heading>
                          <Text fontSize="sm" color="gray.600">
                            {employee.position}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {employee.department}
                          </Text>
                          <HStack>
                            <Badge colorScheme={roleColors[employee.role]}>
                              {employee.role.toUpperCase()}
                            </Badge>
                            <Badge
                              colorScheme={
                                statusColors[employee.status || "active"]
                              }
                            >
                              {(employee.status || "active").toUpperCase()}
                            </Badge>
                          </HStack>
                        </VStack>
                      </HStack>
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
                            onClick={() => openViewModal(employee)}
                          >
                            View Details
                          </MenuItem>
                          <MenuItem
                            icon={<EditIcon />}
                            onClick={() => openEditModal(employee)}
                          >
                            Edit Employee
                          </MenuItem>
                          <MenuDivider />
                          <MenuItem
                            icon={<DeleteIcon />}
                            onClick={() => openDeleteDialog(employee)}
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
                        <Text fontSize="sm">{employee.email}</Text>
                      </HStack>
                      {employee.phone && (
                        <HStack>
                          <PhoneIcon color="gray.500" />
                          <Text fontSize="sm">{employee.phone}</Text>
                        </HStack>
                      )}
                      {employee.employee_id && (
                        <HStack>
                          <Tag size="sm" colorScheme="blue">
                            <TagLabel>ID: {employee.employee_id}</TagLabel>
                          </Tag>
                        </HStack>
                      )}
                      {employee.hire_date && (
                        <HStack>
                          <CalendarIcon color="gray.500" />
                          <Text fontSize="sm">
                            Hired{" "}
                            {format(
                              new Date(employee.hire_date),
                              "MMM d, yyyy",
                            )}
                          </Text>
                        </HStack>
                      )}
                      <HStack>
                        <CalendarIcon color="gray.500" />
                        <Text fontSize="sm">
                          Added{" "}
                          {formatDistanceToNow(new Date(employee.created_at))}{" "}
                          ago
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
              {isCreateOpen ? "Add New Employee" : "Edit Employee"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="John Doe"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="john.doe@company.com"
                    />
                  </FormControl>
                </Grid>

                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl>
                    <FormLabel>Phone</FormLabel>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Employee ID</FormLabel>
                    <Input
                      value={formData.employee_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          employee_id: e.target.value,
                        })
                      }
                      placeholder="EMP001"
                    />
                  </FormControl>
                </Grid>

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
                    <FormLabel>Position</FormLabel>
                    <Input
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                      placeholder="Software Engineer"
                    />
                  </FormControl>
                </Grid>

                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl>
                    <FormLabel>Role</FormLabel>
                    <Select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
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
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="on_leave">On Leave</option>
                      <option value="terminated">Terminated</option>
                    </Select>
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel>Hire Date</FormLabel>
                  <Input
                    type="date"
                    value={formData.hire_date}
                    onChange={(e) =>
                      setFormData({ ...formData, hire_date: e.target.value })
                    }
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
                  isCreateOpen ? handleCreateEmployee : handleUpdateEmployee
                }
                isDisabled={
                  !formData.name ||
                  !formData.email ||
                  !formData.department ||
                  !formData.position
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
            <ModalHeader>Employee Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedEmployee && (
                <VStack align="start" spacing={4}>
                  <Flex align="center" gap={4}>
                    <Avatar name={selectedEmployee.name} size="xl" />
                    <VStack align="start" spacing={1}>
                      <Heading size="lg">{selectedEmployee.name}</Heading>
                      <Text color="gray.600" fontSize="lg">
                        {selectedEmployee.position}
                      </Text>
                      <Text color="gray.600">
                        {selectedEmployee.department}
                      </Text>
                      <HStack>
                        <Badge colorScheme={roleColors[selectedEmployee.role]}>
                          {selectedEmployee.role.toUpperCase()}
                        </Badge>
                        <Badge
                          colorScheme={
                            statusColors[selectedEmployee.status || "active"]
                          }
                        >
                          {(selectedEmployee.status || "active").toUpperCase()}
                        </Badge>
                      </HStack>
                    </VStack>
                  </Flex>

                  <Divider />

                  <Grid templateColumns="1fr 1fr" gap={6} w="full">
                    <VStack align="start" spacing={3}>
                      <Text fontWeight="bold">Contact Information</Text>
                      <HStack>
                        <EmailIcon />
                        <Text>{selectedEmployee.email}</Text>
                      </HStack>
                      {selectedEmployee.phone && (
                        <HStack>
                          <PhoneIcon />
                          <Text>{selectedEmployee.phone}</Text>
                        </HStack>
                      )}
                      {selectedEmployee.employee_id && (
                        <Text>ID: {selectedEmployee.employee_id}</Text>
                      )}
                    </VStack>

                    <VStack align="start" spacing={3}>
                      <Text fontWeight="bold">Employment Details</Text>
                      {selectedEmployee.hire_date && (
                        <Text>
                          Hired:{" "}
                          {format(
                            new Date(selectedEmployee.hire_date),
                            "MMM d, yyyy",
                          )}
                        </Text>
                      )}
                      <Text>
                        Added:{" "}
                        {format(
                          new Date(selectedEmployee.created_at),
                          "MMM d, yyyy",
                        )}
                      </Text>
                      {selectedEmployee.updated_at && (
                        <Text>
                          Updated:{" "}
                          {format(
                            new Date(selectedEmployee.updated_at),
                            "MMM d, yyyy",
                          )}
                        </Text>
                      )}
                    </VStack>
                  </Grid>
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
                Delete Employee
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete{" "}
                <strong>{selectedEmployee?.name}</strong>? This action cannot be
                undone and will remove all associated data.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={deleteRef} onClick={onDeleteClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleDeleteEmployee} ml={3}>
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

export default PeopleEnhanced;
