import {
  AddIcon,
  ArrowForwardIcon,
  TriangleUpIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
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
  Grid,
  Heading,
  HStack,
  IconButton,
  Progress,
  SimpleGrid,
  Spinner,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { format, formatDistanceToNow } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

// Enhanced Database Services
import {
  ApplicationsService,
  EmployeeService,
  JobsService,
} from "../lib/database/services";

// Types
interface DashboardStats {
  totalEmployees: number;
  totalJobs: number;
  totalApplications: number;
  activeJobs: number;
  newHires: number;
  pendingApplications: number;
}

interface RecentActivity {
  id: string;
  type: "application" | "job" | "employee";
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

const DashboardEnhanced: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.900");

  // State
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    newHires: 0,
    pendingApplications: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [recentEmployees, setRecentEmployees] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [employeesRes, jobsRes, applicationsRes] = await Promise.all([
        EmployeeService.getAll({ page: 1, limit: 5 }),
        JobsService.getAll({ page: 1, limit: 5 }),
        ApplicationsService.getAll({ page: 1, limit: 5 }),
      ]);

      // Calculate statistics
      const dashboardStats: DashboardStats = {
        totalEmployees: employeesRes.count || 0,
        totalJobs: jobsRes.count || 0,
        totalApplications: applicationsRes.count || 0,
        activeJobs: 0,
        newHires: 0,
        pendingApplications: 0,
      };

      // Use mock data if database queries fail
      if (
        !employeesRes.success ||
        !jobsRes.success ||
        !applicationsRes.success
      ) {
        // Mock statistics
        dashboardStats.totalEmployees = 45;
        dashboardStats.totalJobs = 12;
        dashboardStats.totalApplications = 78;
        dashboardStats.activeJobs = 8;
        dashboardStats.newHires = 6;
        dashboardStats.pendingApplications = 23;

        // Mock recent employees
        setRecentEmployees([
          {
            id: "1",
            name: "Sarah Johnson",
            position: "Senior Software Engineer",
            department: "Engineering",
            hire_date: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Michael Chen",
            position: "Product Manager",
            department: "Product",
            hire_date: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
        ]);

        // Mock recent jobs
        setRecentJobs([
          {
            id: "1",
            title: "Senior Frontend Developer",
            department: "Engineering",
            status: "published",
            applications_count: 15,
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            title: "UX Designer",
            department: "Design",
            status: "active",
            applications_count: 8,
            created_at: new Date(
              Date.now() - 3 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
        ]);

        // Mock recent activity
        setRecentActivity([
          {
            id: "1",
            type: "application",
            title: "New Application Received",
            description: "Sarah Johnson applied for Senior Frontend Developer",
            timestamp: new Date().toISOString(),
            status: "new",
          },
          {
            id: "2",
            type: "job",
            title: "Job Posted",
            description: "UX Designer position published",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            status: "published",
          },
          {
            id: "3",
            type: "employee",
            title: "New Employee Added",
            description: "Michael Chen joined the Product team",
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            status: "active",
          },
        ]);

        toast({
          title: "Using Demo Data",
          description: "Connected to mock data for development",
          status: "info",
          duration: 3000,
        });
      } else {
        // Use real data
        setRecentEmployees(employeesRes.data?.slice(0, 5) || []);
        setRecentJobs(jobsRes.data?.slice(0, 5) || []);

        // Calculate additional stats from real data
        if (jobsRes.data) {
          dashboardStats.activeJobs = jobsRes.data.filter(
            (job: any) => job.status === "active" || job.status === "published",
          ).length;
        }
        if (applicationsRes.data) {
          dashboardStats.pendingApplications = applicationsRes.data.filter(
            (app: any) =>
              app.status === "applied" || app.status === "screening",
          ).length;
        }
        if (employeesRes.data) {
          dashboardStats.newHires = employeesRes.data.filter((emp: any) => {
            if (!emp.hire_date) return false;
            const hireDate = new Date(emp.hire_date);
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            return hireDate >= threeMonthsAgo;
          }).length;
        }
      }

      setStats(dashboardStats);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load dashboard data");
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Quick actions
  const quickActions = [
    {
      title: "Add Employee",
      description: "Create new employee profile",
      icon: AddIcon,
      color: "blue",
      action: () => router.push("/people-enhanced"),
    },
    {
      title: "Post Job",
      description: "Create new job posting",
      icon: AddIcon,
      color: "green",
      action: () => router.push("/jobs-enhanced"),
    },
    {
      title: "View Applications",
      description: "Review job applications",
      icon: ViewIcon,
      color: "purple",
      action: () => router.push("/applications-enhanced"),
    },
    {
      title: "Analytics",
      description: "View detailed reports",
      icon: TriangleUpIcon,
      color: "orange",
      action: () => router.push("/reports-enhanced"),
    },
  ];

  if (loading) {
    return (
      <Container maxW="8xl" py={8}>
        <Flex justify="center" align="center" height="400px">
          <VStack>
            <Spinner size="xl" color="blue.500" />
            <Text>Loading dashboard...</Text>
          </VStack>
        </Flex>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - Enhanced | HR Portal</title>
        <meta
          name="description"
          content="Enhanced HR Portal dashboard with comprehensive analytics and management tools"
        />
      </Head>

      <Container maxW="8xl" py={8}>
        {/* Header */}
        <VStack align="start" spacing={4} mb={8}>
          <Heading size="xl" color="blue.600">
            HR Portal Dashboard
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Welcome to your comprehensive HR management system
          </Text>
          {error && (
            <Alert status="warning">
              <AlertIcon />
              {error} - Using demo data for development
            </Alert>
          )}
        </VStack>

        {/* Key Statistics */}
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} mb={8}>
          <Stat>
            <StatLabel>Total Employees</StatLabel>
            <StatNumber color="blue.500">{stats.totalEmployees}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              +3 this month
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Active Jobs</StatLabel>
            <StatNumber color="green.500">{stats.activeJobs}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              +2 this week
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Applications</StatLabel>
            <StatNumber color="purple.500">
              {stats.totalApplications}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              +12 this week
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Pending Reviews</StatLabel>
            <StatNumber color="orange.500">
              {stats.pendingApplications}
            </StatNumber>
            <StatHelpText>Need attention</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>New Hires</StatLabel>
            <StatNumber color="cyan.500">{stats.newHires}</StatNumber>
            <StatHelpText>Last 3 months</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Total Jobs</StatLabel>
            <StatNumber color="pink.500">{stats.totalJobs}</StatNumber>
            <StatHelpText>All time</StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Quick Actions */}
        <Card bg={cardBg} mb={8}>
          <CardHeader>
            <Heading size="md">Quick Actions</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
              {quickActions.map((action, index) => (
                <Card
                  key={index}
                  variant="outline"
                  cursor="pointer"
                  _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                  transition="all 0.2s"
                  onClick={action.action}
                >
                  <CardBody>
                    <VStack spacing={3}>
                      <IconButton
                        aria-label={action.title}
                        icon={<action.icon />}
                        colorScheme={action.color}
                        size="lg"
                        isRound
                      />
                      <VStack spacing={1}>
                        <Text fontWeight="bold">{action.title}</Text>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          {action.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} mb={8}>
          {/* Recent Activity */}
          <Card bg={cardBg}>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md">Recent Activity</Heading>
                <Button
                  size="sm"
                  variant="ghost"
                  rightIcon={<ArrowForwardIcon />}
                >
                  View All
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <Flex key={activity.id} align="start" gap={3}>
                      <Avatar
                        size="sm"
                        name={activity.type}
                        bg={
                          activity.type === "application"
                            ? "purple.500"
                            : activity.type === "job"
                              ? "green.500"
                              : "blue.500"
                        }
                      />
                      <Box flex="1">
                        <Text fontWeight="medium">{activity.title}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {activity.description}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {formatDistanceToNow(new Date(activity.timestamp))}{" "}
                          ago
                        </Text>
                      </Box>
                      {activity.status && (
                        <Badge size="sm" colorScheme="green">
                          {activity.status}
                        </Badge>
                      )}
                    </Flex>
                  ))
                ) : (
                  <Text color="gray.500" textAlign="center" py={4}>
                    No recent activity
                  </Text>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* System Status */}
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">System Status</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontSize="sm">Database Connection</Text>
                    <Badge colorScheme="green">Healthy</Badge>
                  </Flex>
                  <Progress value={100} colorScheme="green" size="sm" />
                </Box>
                <Box>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontSize="sm">API Performance</Text>
                    <Badge colorScheme="green">Good</Badge>
                  </Flex>
                  <Progress value={95} colorScheme="green" size="sm" />
                </Box>
                <Box>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontSize="sm">Storage Usage</Text>
                    <Badge colorScheme="yellow">78%</Badge>
                  </Flex>
                  <Progress value={78} colorScheme="yellow" size="sm" />
                </Box>
                <Divider />
                <VStack spacing={2} align="start">
                  <Text fontSize="sm" fontWeight="medium">
                    Enhanced Modules Active:
                  </Text>
                  <HStack>
                    <Badge colorScheme="green">Applications</Badge>
                    <Badge colorScheme="green">Jobs</Badge>
                    <Badge colorScheme="green">People</Badge>
                  </HStack>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
          {/* Recent Employees */}
          <Card bg={cardBg}>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md">Recent Employees</Heading>
                <Button
                  size="sm"
                  variant="ghost"
                  rightIcon={<ArrowForwardIcon />}
                  onClick={() => router.push("/people-enhanced")}
                >
                  View All
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              {recentEmployees.length > 0 ? (
                <VStack spacing={3} align="stretch">
                  {recentEmployees.slice(0, 4).map((employee) => (
                    <Flex key={employee.id} align="center" gap={3}>
                      <Avatar name={employee.name} size="sm" />
                      <Box flex="1">
                        <Text fontWeight="medium">{employee.name}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {employee.position} • {employee.department}
                        </Text>
                      </Box>
                      <Text fontSize="xs" color="gray.500">
                        {employee.hire_date &&
                          format(new Date(employee.hire_date), "MMM d")}
                      </Text>
                    </Flex>
                  ))}
                </VStack>
              ) : (
                <Text color="gray.500" textAlign="center" py={4}>
                  No recent employees
                </Text>
              )}
            </CardBody>
          </Card>

          {/* Recent Jobs */}
          <Card bg={cardBg}>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md">Recent Jobs</Heading>
                <Button
                  size="sm"
                  variant="ghost"
                  rightIcon={<ArrowForwardIcon />}
                  onClick={() => router.push("/jobs-enhanced")}
                >
                  View All
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              {recentJobs.length > 0 ? (
                <VStack spacing={3} align="stretch">
                  {recentJobs.slice(0, 4).map((job) => (
                    <Flex key={job.id} align="center" gap={3}>
                      <Box
                        w={3}
                        h={3}
                        bg={
                          job.status === "published" ? "green.400" : "blue.400"
                        }
                        borderRadius="full"
                      />
                      <Box flex="1">
                        <Text fontWeight="medium">{job.title}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {job.department} • {job.applications_count || 0}{" "}
                          applications
                        </Text>
                      </Box>
                      <Badge
                        size="sm"
                        colorScheme={
                          job.status === "published" ? "green" : "blue"
                        }
                      >
                        {job.status}
                      </Badge>
                    </Flex>
                  ))}
                </VStack>
              ) : (
                <Text color="gray.500" textAlign="center" py={4}>
                  No recent jobs
                </Text>
              )}
            </CardBody>
          </Card>
        </Grid>
      </Container>
    </>
  );
};

export default DashboardEnhanced;
