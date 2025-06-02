import {
  AddIcon,
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
  StarIcon,
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
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";

// Enhanced Database Service
import { EmployeeService } from "../lib/database/services";

interface PerformanceReview {
  id: string;
  employee_id: string;
  reviewer_id: string;
  review_period: string;
  overall_rating: number;
  goals_achievement: number;
  communication: number;
  teamwork: number;
  technical_skills: number;
  leadership: number;
  status: string;
  comments: string;
  goals: string;
  achievements: string;
  improvement_areas: string;
  created_at: string;
  updated_at?: string;
  employee?: any;
  reviewer?: any;
}

const PerformanceEnhanced: React.FC = () => {
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");

  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState<any>({});

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);

      // Mock performance reviews data
      const mockReviews: PerformanceReview[] = [
        {
          id: "1",
          employee_id: "emp1",
          reviewer_id: "emp2",
          review_period: "Q1 2024",
          overall_rating: 4.2,
          goals_achievement: 4.5,
          communication: 4.0,
          teamwork: 4.3,
          technical_skills: 4.1,
          leadership: 3.8,
          status: "completed",
          comments:
            "Excellent performance this quarter with strong technical delivery.",
          goals:
            "Complete React migration project, Improve code review process",
          achievements: "Led successful migration, Reduced bugs by 30%",
          improvement_areas: "Public speaking, Cross-team collaboration",
          created_at: new Date().toISOString(),
          employee: {
            id: "emp1",
            name: "Sarah Johnson",
            email: "sarah.johnson@company.com",
            department: "Engineering",
          },
          reviewer: {
            id: "emp2",
            name: "Michael Chen",
            email: "michael.chen@company.com",
            department: "Engineering",
          },
        },
        {
          id: "2",
          employee_id: "emp2",
          reviewer_id: "emp1",
          review_period: "Q1 2024",
          overall_rating: 4.0,
          goals_achievement: 4.2,
          communication: 4.1,
          teamwork: 3.9,
          technical_skills: 4.0,
          leadership: 4.5,
          status: "in_progress",
          comments: "Strong leadership qualities, good team management skills.",
          goals: "Launch new product feature, Mentor junior developers",
          achievements:
            "Successfully launched user dashboard, Mentored 3 developers",
          improvement_areas: "Time management, Documentation practices",
          created_at: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          employee: {
            id: "emp2",
            name: "Michael Chen",
            email: "michael.chen@company.com",
            department: "Product",
          },
          reviewer: {
            id: "emp1",
            name: "Sarah Johnson",
            email: "sarah.johnson@company.com",
            department: "Engineering",
          },
        },
      ];

      setReviews(mockReviews);

      toast({
        title: "Using Demo Data",
        description: "Connected to mock data for development",
        status: "info",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error loading reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load performance reviews",
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

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
        ]);
      }
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  }, []);

  const loadStats = useCallback(async () => {
    const stats = {
      total: reviews.length,
      completed: reviews.filter((r) => r.status === "completed").length,
      in_progress: reviews.filter((r) => r.status === "in_progress").length,
      pending: reviews.filter((r) => r.status === "pending").length,
      avg_rating:
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.overall_rating, 0) /
            reviews.length
          : 0,
    };
    setStats(stats);
  }, [reviews]);

  useEffect(() => {
    loadReviews();
    loadEmployees();
  }, [loadReviews, loadEmployees]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review_period.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    completed: "green",
    in_progress: "yellow",
    pending: "orange",
    draft: "gray",
  };

  const getRatingColor = (rating: number): string => {
    if (rating >= 4.5) return "green";
    if (rating >= 4.0) return "blue";
    if (rating >= 3.5) return "yellow";
    if (rating >= 3.0) return "orange";
    return "red";
  };

  return (
    <>
      <Head>
        <title>Performance Reviews - Enhanced | HR Portal</title>
        <meta
          name="description"
          content="Enhanced performance review management system"
        />
      </Head>

      <Container maxW="8xl" py={8}>
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="lg" color="blue.600">
              Performance Reviews
            </Heading>
            <Text color="gray.600" mt={2}>
              Manage employee performance reviews and evaluations
            </Text>
          </Box>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onCreateOpen}
            size="lg"
          >
            New Review
          </Button>
        </Flex>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4} mb={8}>
          <Stat>
            <StatLabel>Total Reviews</StatLabel>
            <StatNumber color="blue.500">{stats.total || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Completed</StatLabel>
            <StatNumber color="green.500">{stats.completed || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>In Progress</StatLabel>
            <StatNumber color="yellow.500">{stats.in_progress || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Pending</StatLabel>
            <StatNumber color="orange.500">{stats.pending || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Avg Rating</StatLabel>
            <StatNumber color={getRatingColor(stats.avg_rating || 0)}>
              {(stats.avg_rating || 0).toFixed(1)} ⭐
            </StatNumber>
          </Stat>
        </SimpleGrid>

        {/* Filters */}
        <Card bg={cardBg} mb={6}>
          <CardBody>
            <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={4}>
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
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="draft">Draft</option>
              </Select>
            </Grid>
          </CardBody>
        </Card>

        {/* Reviews Grid */}
        {loading ? (
          <Flex justify="center" align="center" height="400px">
            <VStack>
              <Spinner size="xl" color="blue.500" />
              <Text>Loading performance reviews...</Text>
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
            {filteredReviews.map((review) => (
              <Card key={review.id} bg={cardBg}>
                <CardHeader>
                  <Flex justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <Heading size="md">{review.employee?.name}</Heading>
                      <Text fontSize="sm" color="gray.600">
                        {review.review_period}
                      </Text>
                      <HStack>
                        <Badge colorScheme={statusColors[review.status]}>
                          {review.status.replace("_", " ").toUpperCase()}
                        </Badge>
                        <Badge
                          colorScheme={getRatingColor(review.overall_rating)}
                        >
                          {review.overall_rating.toFixed(1)} ⭐
                        </Badge>
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
                        <MenuItem icon={<ViewIcon />}>View Details</MenuItem>
                        <MenuItem icon={<EditIcon />}>Edit Review</MenuItem>
                        <MenuItem icon={<DeleteIcon />} color="red.500">
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack align="start" spacing={3}>
                    <Text fontSize="sm">
                      <strong>Reviewer:</strong> {review.reviewer?.name}
                    </Text>

                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>
                        Performance Ratings:
                      </Text>
                      <VStack align="start" spacing={1}>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="xs">Goals Achievement</Text>
                          <HStack>
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                boxSize="12px"
                                color={
                                  i < review.goals_achievement
                                    ? "yellow.400"
                                    : "gray.300"
                                }
                              />
                            ))}
                            <Text fontSize="xs">
                              ({review.goals_achievement})
                            </Text>
                          </HStack>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="xs">Communication</Text>
                          <HStack>
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                boxSize="12px"
                                color={
                                  i < review.communication
                                    ? "yellow.400"
                                    : "gray.300"
                                }
                              />
                            ))}
                            <Text fontSize="xs">({review.communication})</Text>
                          </HStack>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="xs">Technical Skills</Text>
                          <HStack>
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                boxSize="12px"
                                color={
                                  i < review.technical_skills
                                    ? "yellow.400"
                                    : "gray.300"
                                }
                              />
                            ))}
                            <Text fontSize="xs">
                              ({review.technical_skills})
                            </Text>
                          </HStack>
                        </HStack>
                      </VStack>
                    </Box>

                    {review.comments && (
                      <Box>
                        <Text fontSize="sm" fontWeight="medium">
                          Comments:
                        </Text>
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                          {review.comments}
                        </Text>
                      </Box>
                    )}

                    <Text fontSize="xs" color="gray.500">
                      Created{" "}
                      {format(new Date(review.created_at), "MMM d, yyyy")}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}

        {/* Create Modal Placeholder */}
        <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>New Performance Review</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Employee</FormLabel>
                  <Select placeholder="Select employee">
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} - {emp.department}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Review Period</FormLabel>
                  <Input placeholder="Q1 2024" />
                </FormControl>
                <FormControl>
                  <FormLabel>Comments</FormLabel>
                  <Textarea placeholder="Performance review comments..." />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={onCreateClose}>
                Cancel
              </Button>
              <Button colorScheme="blue">Create Review</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </>
  );
};

export default PerformanceEnhanced;
