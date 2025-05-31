import { useState, useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import {
  SearchIcon,
  CalendarIcon,
  DownloadIcon,
  SettingsIcon,
  AddIcon,
  ViewIcon,
  InfoIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  TriangleUpIcon,
  TriangleDownIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  Flex,
  Badge,
  Input,
  Select,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Spinner,
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
  Wrap,
  WrapItem,
  Tooltip,
  Divider,
  Center,
  Link,
} from "@chakra-ui/react";
import { format, subDays, subMonths, subWeeks } from "date-fns";
import { GetServerSideProps } from "next";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";

// Mock data interfaces
interface RecruitmentMetrics {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplications: number;
  interviewsScheduled: number;
  interviewsCompleted: number;
  offersExtended: number;
  offerAcceptances: number;
  hires: number;
  averageTimeToHire: number;
  costPerHire: number;
  sourceEffectiveness: SourceMetric[];
  departmentMetrics: DepartmentMetric[];
  timeToFillTrend: TimeToFillData[];
  applicationStatusDistribution: StatusDistribution[];
  salaryAnalysis: SalaryAnalysis;
}

interface SourceMetric {
  source: string;
  applications: number;
  hires: number;
  conversionRate: number;
  cost: number;
}

interface DepartmentMetric {
  department: string;
  openJobs: number;
  applications: number;
  interviews: number;
  hires: number;
  averageTimeToHire: number;
}

interface TimeToFillData {
  month: string;
  days: number;
}

interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

interface SalaryAnalysis {
  averageSalary: number;
  medianSalary: number;
  salaryRange: {
    min: number;
    max: number;
  };
  departmentSalaries: {
    department: string;
    average: number;
  }[];
}

// Mock data
const MOCK_METRICS: RecruitmentMetrics = {
  totalJobs: 45,
  activeJobs: 18,
  totalApplications: 1247,
  newApplications: 89,
  interviewsScheduled: 156,
  interviewsCompleted: 134,
  offersExtended: 23,
  offerAcceptances: 18,
  hires: 15,
  averageTimeToHire: 28,
  costPerHire: 4250,
  sourceEffectiveness: [
    {
      source: "LinkedIn",
      applications: 423,
      hires: 8,
      conversionRate: 1.9,
      cost: 3200,
    },
    {
      source: "Indeed",
      applications: 298,
      hires: 4,
      conversionRate: 1.3,
      cost: 1800,
    },
    {
      source: "Company Website",
      applications: 245,
      hires: 2,
      conversionRate: 0.8,
      cost: 500,
    },
    {
      source: "Employee Referral",
      applications: 156,
      hires: 5,
      conversionRate: 3.2,
      cost: 2500,
    },
    {
      source: "Glassdoor",
      applications: 125,
      hires: 1,
      conversionRate: 0.8,
      cost: 1200,
    },
  ],
  departmentMetrics: [
    {
      department: "Engineering",
      openJobs: 8,
      applications: 456,
      interviews: 67,
      hires: 6,
      averageTimeToHire: 32,
    },
    {
      department: "Product",
      openJobs: 3,
      applications: 234,
      interviews: 34,
      hires: 3,
      averageTimeToHire: 25,
    },
    {
      department: "Design",
      openJobs: 2,
      applications: 189,
      interviews: 28,
      hires: 2,
      averageTimeToHire: 22,
    },
    {
      department: "Marketing",
      openJobs: 3,
      applications: 198,
      interviews: 18,
      hires: 3,
      averageTimeToHire: 18,
    },
    {
      department: "Sales",
      openJobs: 2,
      applications: 170,
      interviews: 13,
      hires: 1,
      averageTimeToHire: 35,
    },
  ],
  timeToFillTrend: [
    { month: "Oct", days: 31 },
    { month: "Nov", days: 28 },
    { month: "Dec", days: 35 },
    { month: "Jan", days: 25 },
    { month: "Feb", days: 28 },
    { month: "Mar", days: 22 },
  ],
  applicationStatusDistribution: [
    { status: "New", count: 423, percentage: 34 },
    { status: "Screening", count: 298, percentage: 24 },
    { status: "Interview", count: 245, percentage: 20 },
    { status: "Offer", count: 156, percentage: 12 },
    { status: "Hired", count: 89, percentage: 7 },
    { status: "Rejected", count: 36, percentage: 3 },
  ],
  salaryAnalysis: {
    averageSalary: 95000,
    medianSalary: 88000,
    salaryRange: {
      min: 45000,
      max: 180000,
    },
    departmentSalaries: [
      { department: "Engineering", average: 115000 },
      { department: "Product", average: 105000 },
      { department: "Design", average: 85000 },
      { department: "Marketing", average: 75000 },
      { department: "Sales", average: 70000 },
    ],
  },
};

type DateRange = "7d" | "30d" | "90d" | "1y";
type ReportType =
  | "overview"
  | "sources"
  | "departments"
  | "performance"
  | "compensation";

const ReportsPage = () => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.900");

  // State
  const [metrics, setMetrics] = useState<RecruitmentMetrics>(MOCK_METRICS);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [reportType, setReportType] = useState<ReportType>("overview");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Calculate metrics
  const conversionRate =
    metrics.totalApplications > 0
      ? Math.round((metrics.hires / metrics.totalApplications) * 100 * 100) /
        100
      : 0;

  const offerAcceptanceRate =
    metrics.offersExtended > 0
      ? Math.round(
          (metrics.offerAcceptances / metrics.offersExtended) * 100 * 100,
        ) / 100
      : 0;

  const interviewToOfferRate =
    metrics.interviewsCompleted > 0
      ? Math.round(
          (metrics.offersExtended / metrics.interviewsCompleted) * 100 * 100,
        ) / 100
      : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDateRangeLabel = (range: DateRange) => {
    switch (range) {
      case "7d":
        return "Last 7 days";
      case "30d":
        return "Last 30 days";
      case "90d":
        return "Last 90 days";
      case "1y":
        return "Last 12 months";
      default:
        return "Last 30 days";
    }
  };

  const exportReport = () => {
    toast({
      title: "Report exported",
      description: "Your recruitment report has been downloaded.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Key Metrics Cards
  const KeyMetricsCards = () => (
    <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} mb={6}>
      <Stat
        bg={cardBg}
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <StatLabel fontSize="xs">Total Applications</StatLabel>
        <StatNumber fontSize="xl">
          {metrics.totalApplications.toLocaleString()}
        </StatNumber>
        <StatHelpText>
          <StatArrow type="increase" />+{metrics.newApplications} this period
        </StatHelpText>
      </Stat>

      <Stat
        bg={cardBg}
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <StatLabel fontSize="xs">Active Jobs</StatLabel>
        <StatNumber fontSize="xl">{metrics.activeJobs}</StatNumber>
        <StatHelpText>of {metrics.totalJobs} total jobs</StatHelpText>
      </Stat>

      <Stat
        bg={cardBg}
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <StatLabel fontSize="xs">Interviews</StatLabel>
        <StatNumber fontSize="xl">{metrics.interviewsScheduled}</StatNumber>
        <StatHelpText>{metrics.interviewsCompleted} completed</StatHelpText>
      </Stat>

      <Stat
        bg={cardBg}
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <StatLabel fontSize="xs">Offers Extended</StatLabel>
        <StatNumber fontSize="xl">{metrics.offersExtended}</StatNumber>
        <StatHelpText>{offerAcceptanceRate}% acceptance rate</StatHelpText>
      </Stat>

      <Stat
        bg={cardBg}
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <StatLabel fontSize="xs">Hires</StatLabel>
        <StatNumber fontSize="xl" color="green.500">
          {metrics.hires}
        </StatNumber>
        <StatHelpText>{conversionRate}% conversion rate</StatHelpText>
      </Stat>

      <Stat
        bg={cardBg}
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <StatLabel fontSize="xs">Avg Time to Hire</StatLabel>
        <StatNumber fontSize="xl">{metrics.averageTimeToHire}</StatNumber>
        <StatHelpText>days</StatHelpText>
      </Stat>
    </SimpleGrid>
  );

  // Application Status Distribution
  const ApplicationStatusChart = () => (
    <Card bg={cardBg} borderColor={borderColor}>
      <CardHeader>
        <Heading size="md">Application Status Distribution</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          {metrics.applicationStatusDistribution.map((status, index) => (
            <Box key={status.status}>
              <Flex justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="medium">
                  {status.status}
                </Text>
                <HStack spacing={2}>
                  <Text fontSize="sm" color="gray.500">
                    {status.count}
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {status.percentage}%
                  </Text>
                </HStack>
              </Flex>
              <Progress
                value={status.percentage}
                colorScheme={
                  index === 0
                    ? "blue"
                    : index === 1
                      ? "orange"
                      : index === 2
                        ? "yellow"
                        : index === 3
                          ? "purple"
                          : index === 4
                            ? "green"
                            : "red"
                }
                size="sm"
                borderRadius="md"
              />
            </Box>
          ))}
        </VStack>
      </CardBody>
    </Card>
  );

  // Source Effectiveness Table
  const SourceEffectivenessTable = () => (
    <Card bg={cardBg} borderColor={borderColor}>
      <CardHeader>
        <Heading size="md">Source Effectiveness</Heading>
      </CardHeader>
      <CardBody p={0}>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Source</Th>
                <Th isNumeric>Applications</Th>
                <Th isNumeric>Hires</Th>
                <Th isNumeric>Conversion Rate</Th>
                <Th isNumeric>Cost per Hire</Th>
                <Th isNumeric>ROI</Th>
              </Tr>
            </Thead>
            <Tbody>
              {metrics.sourceEffectiveness.map((source) => (
                <Tr key={source.source}>
                  <Td fontWeight="medium">{source.source}</Td>
                  <Td isNumeric>{source.applications}</Td>
                  <Td isNumeric>{source.hires}</Td>
                  <Td isNumeric>
                    <Badge
                      colorScheme={
                        source.conversionRate > 2
                          ? "green"
                          : source.conversionRate > 1
                            ? "yellow"
                            : "red"
                      }
                      variant="subtle"
                    >
                      {source.conversionRate}%
                    </Badge>
                  </Td>
                  <Td isNumeric>{formatCurrency(source.cost)}</Td>
                  <Td isNumeric>
                    <Badge
                      colorScheme={
                        source.cost < 3000
                          ? "green"
                          : source.cost < 4000
                            ? "yellow"
                            : "red"
                      }
                      variant="outline"
                    >
                      {source.cost < 3000
                        ? "High"
                        : source.cost < 4000
                          ? "Medium"
                          : "Low"}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </Card>
  );

  // Department Performance
  const DepartmentPerformance = () => (
    <Card bg={cardBg} borderColor={borderColor}>
      <CardHeader>
        <Heading size="md">Department Performance</Heading>
      </CardHeader>
      <CardBody p={0}>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Department</Th>
                <Th isNumeric>Open Jobs</Th>
                <Th isNumeric>Applications</Th>
                <Th isNumeric>Interviews</Th>
                <Th isNumeric>Hires</Th>
                <Th isNumeric>Avg Time to Hire</Th>
                <Th isNumeric>Conversion Rate</Th>
              </Tr>
            </Thead>
            <Tbody>
              {metrics.departmentMetrics.map((dept) => {
                const conversionRate =
                  dept.applications > 0
                    ? Math.round((dept.hires / dept.applications) * 100 * 100) /
                      100
                    : 0;
                return (
                  <Tr key={dept.department}>
                    <Td fontWeight="medium">{dept.department}</Td>
                    <Td isNumeric>{dept.openJobs}</Td>
                    <Td isNumeric>{dept.applications}</Td>
                    <Td isNumeric>{dept.interviews}</Td>
                    <Td isNumeric>{dept.hires}</Td>
                    <Td isNumeric>{dept.averageTimeToHire} days</Td>
                    <Td isNumeric>
                      <Badge
                        colorScheme={
                          conversionRate > 2
                            ? "green"
                            : conversionRate > 1
                              ? "yellow"
                              : "red"
                        }
                        variant="subtle"
                      >
                        {conversionRate}%
                      </Badge>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </Card>
  );

  // Salary Analysis
  const SalaryAnalysisCard = () => (
    <Card bg={cardBg} borderColor={borderColor}>
      <CardHeader>
        <Heading size="md">Compensation Analysis</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <SimpleGrid columns={3} spacing={4}>
            <Stat textAlign="center">
              <StatLabel fontSize="xs">Average Salary</StatLabel>
              <StatNumber fontSize="lg" color="green.500">
                {formatCurrency(metrics.salaryAnalysis.averageSalary)}
              </StatNumber>
            </Stat>
            <Stat textAlign="center">
              <StatLabel fontSize="xs">Median Salary</StatLabel>
              <StatNumber fontSize="lg">
                {formatCurrency(metrics.salaryAnalysis.medianSalary)}
              </StatNumber>
            </Stat>
            <Stat textAlign="center">
              <StatLabel fontSize="xs">Salary Range</StatLabel>
              <StatNumber fontSize="sm">
                {formatCurrency(metrics.salaryAnalysis.salaryRange.min)} -{" "}
                {formatCurrency(metrics.salaryAnalysis.salaryRange.max)}
              </StatNumber>
            </Stat>
          </SimpleGrid>

          <Divider />

          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={3}>
              Average Salary by Department
            </Text>
            <VStack spacing={3} align="stretch">
              {metrics.salaryAnalysis.departmentSalaries.map((dept) => (
                <Flex
                  key={dept.department}
                  justify="space-between"
                  align="center"
                >
                  <Text fontSize="sm">{dept.department}</Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {formatCurrency(dept.average)}
                  </Text>
                </Flex>
              ))}
            </VStack>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );

  // Performance Indicators
  const PerformanceIndicators = () => (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
      <Card bg={cardBg} borderColor={borderColor} p={4}>
        <VStack spacing={2}>
          <Text fontSize="xs" color="gray.500">
            Conversion Rate
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="blue.500">
            {conversionRate}%
          </Text>
          <Text fontSize="xs" color="green.500">
            <ChevronUpIcon boxSize={3} /> +0.5% vs last period
          </Text>
        </VStack>
      </Card>

      <Card bg={cardBg} borderColor={borderColor} p={4}>
        <VStack spacing={2}>
          <Text fontSize="xs" color="gray.500">
            Offer Acceptance
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="green.500">
            {offerAcceptanceRate}%
          </Text>
          <Text fontSize="xs" color="green.500">
            <ChevronUpIcon boxSize={3} /> +2.1% vs last period
          </Text>
        </VStack>
      </Card>

      <Card bg={cardBg} borderColor={borderColor} p={4}>
        <VStack spacing={2}>
          <Text fontSize="xs" color="gray.500">
            Interview to Offer
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="purple.500">
            {interviewToOfferRate}%
          </Text>
          <Text fontSize="xs" color="red.500">
            <ChevronDownIcon boxSize={3} /> -1.2% vs last period
          </Text>
        </VStack>
      </Card>

      <Card bg={cardBg} borderColor={borderColor} p={4}>
        <VStack spacing={2}>
          <Text fontSize="xs" color="gray.500">
            Cost per Hire
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="orange.500">
            {formatCurrency(metrics.costPerHire)}
          </Text>
          <Text fontSize="xs" color="green.500">
            <ChevronDownIcon boxSize={3} /> -$350 vs last period
          </Text>
        </VStack>
      </Card>
    </SimpleGrid>
  );

  return (
    <>
      <Head>
        <title>Recruitment Reports | HR Portal</title>
        <meta
          name="description"
          content="Recruitment analytics and reporting dashboard"
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
                <BreadcrumbLink>Recruitment</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>Reports</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            {/* Header */}
            <Flex justify="space-between" align="center" mb={6}>
              <Box>
                <Heading size="lg">Recruitment Analytics</Heading>
                <Text color="gray.600">
                  Data-driven insights for your recruitment process
                </Text>
              </Box>

              <HStack spacing={3}>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as DateRange)}
                  width="auto"
                  size="sm"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last 12 months</option>
                </Select>

                <ButtonGroup spacing={2}>
                  <Button
                    variant="outline"
                    leftIcon={<DownloadIcon />}
                    onClick={exportReport}
                  >
                    Export Report
                  </Button>
                  <Button
                    colorScheme="blue"
                    leftIcon={<AddIcon />}
                    onClick={() => router.push("/jobs/new")}
                  >
                    Post New Job
                  </Button>
                </ButtonGroup>
              </HStack>
            </Flex>

            {/* Date Range Info */}
            <Alert status="info" mb={6} borderRadius="lg">
              <AlertIcon />
              <AlertTitle>Showing data for:</AlertTitle>
              <AlertDescription>
                {getDateRangeLabel(dateRange)} (
                {format(new Date(), "MMM d, yyyy")})
              </AlertDescription>
            </Alert>

            {/* Key Metrics */}
            <KeyMetricsCards />

            {/* Performance Indicators */}
            <PerformanceIndicators />

            {/* Reports Tabs */}
            <Tabs>
              <TabList mb={6}>
                <Tab>Overview</Tab>
                <Tab>Source Analysis</Tab>
                <Tab>Department Performance</Tab>
                <Tab>Compensation</Tab>
                <Tab>Trends</Tab>
              </TabList>

              <TabPanels>
                {/* Overview Tab */}
                <TabPanel p={0}>
                  <Grid
                    templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
                    gap={6}
                  >
                    <ApplicationStatusChart />
                    <VStack spacing={6}>
                      <Card bg={cardBg} borderColor={borderColor} width="100%">
                        <CardHeader>
                          <Heading size="sm">Quick Actions</Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={3} align="stretch">
                            <Button
                              variant="outline"
                              leftIcon={<ViewIcon />}
                              onClick={() => router.push("/applications")}
                            >
                              Review Applications
                            </Button>
                            <Button
                              variant="outline"
                              leftIcon={<CalendarIcon />}
                              onClick={() => router.push("/interviews")}
                            >
                              Schedule Interviews
                            </Button>
                            <Button
                              variant="outline"
                              leftIcon={<ExternalLinkIcon />}
                              onClick={() => router.push("/offers")}
                            >
                              Manage Offers
                            </Button>
                            <Button
                              variant="outline"
                              leftIcon={<AddIcon />}
                              onClick={() => router.push("/jobs/new")}
                            >
                              Post New Job
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>

                      <Card bg={cardBg} borderColor={borderColor} width="100%">
                        <CardHeader>
                          <Heading size="sm">Recent Activity</Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={3} align="stretch">
                            <Text fontSize="xs" color="gray.500">
                              Today
                            </Text>
                            <HStack justify="space-between">
                              <Text fontSize="sm">New applications</Text>
                              <Badge colorScheme="blue">+12</Badge>
                            </HStack>
                            <HStack justify="space-between">
                              <Text fontSize="sm">Interviews scheduled</Text>
                              <Badge colorScheme="green">+5</Badge>
                            </HStack>
                            <HStack justify="space-between">
                              <Text fontSize="sm">Offers extended</Text>
                              <Badge colorScheme="purple">+2</Badge>
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    </VStack>
                  </Grid>
                </TabPanel>

                {/* Source Analysis Tab */}
                <TabPanel p={0}>
                  <SourceEffectivenessTable />
                </TabPanel>

                {/* Department Performance Tab */}
                <TabPanel p={0}>
                  <DepartmentPerformance />
                </TabPanel>

                {/* Compensation Tab */}
                <TabPanel p={0}>
                  <SalaryAnalysisCard />
                </TabPanel>

                {/* Trends Tab */}
                <TabPanel p={0}>
                  <Card bg={cardBg} borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Recruitment Trends</Heading>
                    </CardHeader>
                    <CardBody>
                      <Center py={20}>
                        <VStack spacing={4}>
                          <Text color="gray.500">Time to Fill Trend Chart</Text>
                          <Text fontSize="sm" color="gray.400">
                            Advanced charts and trends visualization coming
                            soon...
                          </Text>
                          <Button variant="outline" size="sm">
                            View Historical Data
                          </Button>
                        </VStack>
                      </Center>
                    </CardBody>
                  </Card>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Container>
        </Box>
      </ModernDashboardLayout>
    </>
  );
};

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default ReportsPage;
