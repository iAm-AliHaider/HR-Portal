import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardHeader,
  CardBody,
  Select,
  HStack,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  useColorModeValue,
  Link
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Application, Job, Interview, Offer } from '../../../packages/types';
import { getApplications } from '../../services/applications';
import { getJobs } from '../../services/jobs';
import { getUpcomingInterviews } from '../../services/interviews';
import { getOffers } from '../../services/offers';
import { formatDistanceToNow } from 'date-fns';

interface RecruitmentDashboardProps {
  orgId: string;
}

const RecruitmentDashboard = ({ orgId }: RecruitmentDashboardProps) => {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30days');
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch data in parallel
        const [applicationsData, jobsData, interviewsData, offersData] = await Promise.all([
          getApplications(orgId),
          getJobs(orgId),
          getUpcomingInterviews(orgId, 14), // Next 2 weeks
          getOffers(orgId)
        ]);
        
        setApplications(applicationsData);
        setJobs(jobsData);
        setInterviews(interviewsData);
        setOffers(offersData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [orgId]);

  // Filter data based on selected timeframe
  const getDateFilteredData = (data: any[], dateField: string) => {
    if (timeframe === 'all') {
      return data;
    }
    
    const now = new Date();
    let cutoffDate: Date;
    
    if (timeframe === '7days') {
      cutoffDate = new Date(now.setDate(now.getDate() - 7));
    } else if (timeframe === '30days') {
      cutoffDate = new Date(now.setDate(now.getDate() - 30));
    } else if (timeframe === '90days') {
      cutoffDate = new Date(now.setDate(now.getDate() - 90));
    } else {
      cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }
    
    return data.filter(item => new Date(item[dateField]) >= cutoffDate);
  };
  
  const filteredApplications = getDateFilteredData(applications, 'application_date');
  const openJobs = jobs.filter(job => job.status === 'published');
  
  // Calculate key metrics
  const totalApplications = filteredApplications.length;
  const newApplications = filteredApplications.filter(app => app.status === 'new').length;
  const interviewStage = filteredApplications.filter(app => app.status === 'interview').length;
  const offerStage = filteredApplications.filter(app => app.status === 'offered').length;
  const hiredCandidates = filteredApplications.filter(app => app.status === 'hired').length;
  const rejectedCandidates = filteredApplications.filter(app => app.status === 'rejected').length;
  
  // Calculate conversion rates
  const screeningToInterviewRate = totalApplications > 0 
    ? Math.round((interviewStage / totalApplications) * 100) 
    : 0;
  
  const interviewToOfferRate = interviewStage > 0 
    ? Math.round((offerStage / interviewStage) * 100) 
    : 0;
  
  const offerAcceptanceRate = offerStage > 0
    ? Math.round((hiredCandidates / offerStage) * 100)
    : 0;
  
  // Sort jobs by most applications
  const topJobs = [...jobs]
    .map(job => ({
      ...job,
      applicationCount: applications.filter(app => app.job_id === job.id).length
    }))
    .sort((a, b) => b.applicationCount - a.applicationCount)
    .slice(0, 5);
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  return (
    <Box>
      <Flex 
        justify="space-between" 
        align={{ base: "flex-start", sm: "center" }}
        direction={{ base: "column", sm: "row" }}
        mb={6}
        gap={{ base: 4, sm: 0 }}
      >
        <Heading size="lg">Recruitment Dashboard</Heading>
        
        <Select 
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          maxW="200px"
        >
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="90days">Last 90 days</option>
          <option value="1year">Last year</option>
          <option value="all">All time</option>
        </Select>
      </Flex>
      
      {/* Key metrics */}
      <Grid 
        templateColumns={{ 
          base: "1fr", 
          md: "repeat(2, 1fr)", 
          lg: "repeat(4, 1fr)" 
        }}
        gap={6}
        mb={8}
      >
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Total Applications</StatLabel>
              <StatNumber>{totalApplications}</StatNumber>
              <StatHelpText>
                {newApplications} new
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Open Positions</StatLabel>
              <StatNumber>{openJobs.length}</StatNumber>
              <StatHelpText>
                {jobs.length} total
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Candidates Hired</StatLabel>
              <StatNumber>{hiredCandidates}</StatNumber>
              <StatHelpText>
                {offerStage} offers sent
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Upcoming Interviews</StatLabel>
              <StatNumber>{interviews.length}</StatNumber>
              <StatHelpText>
                Next 14 days
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>
      
      {/* Conversion metrics */}
      <Heading size="md" mb={4}>Recruitment Funnel</Heading>
      <Grid 
        templateColumns={{ 
          base: "1fr", 
          md: "repeat(3, 1fr)"
        }}
        gap={6}
        mb={8}
      >
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Screen to Interview</StatLabel>
              <StatNumber>{screeningToInterviewRate}%</StatNumber>
              <StatHelpText>
                {interviewStage} of {totalApplications} applications
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Interview to Offer</StatLabel>
              <StatNumber>{interviewToOfferRate}%</StatNumber>
              <StatHelpText>
                {offerStage} of {interviewStage} interviewed
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Offer Acceptance</StatLabel>
              <StatNumber>{offerAcceptanceRate}%</StatNumber>
              <StatHelpText>
                {hiredCandidates} of {offerStage} offers
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>
      
      {/* Two-column layout for bottom sections */}
      <Grid 
        templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
        gap={6}
      >
        {/* Top Jobs */}
        <Card bg={cardBg} boxShadow="sm">
          <CardHeader pb={0}>
            <Heading size="md">Top Positions</Heading>
          </CardHeader>
          <CardBody>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Position</Th>
                  <Th>Department</Th>
                  <Th isNumeric>Applications</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {topJobs.map(job => (
                  <Tr key={job.id} _hover={{ bg: 'gray.50', cursor: 'pointer' }} onClick={() => router.push(`/jobs/${job.id}`)}>
                    <Td fontWeight="medium">{job.title}</Td>
                    <Td>{job.dept_id || 'N/A'}</Td>
                    <Td isNumeric>{job.applicationCount}</Td>
                    <Td>
                                            <Badge                         colorScheme={job.status === 'published' ? 'green' : 'gray'}                      >                        {job.status}                      </Badge>
                    </Td>
                  </Tr>
                ))}
                {topJobs.length === 0 && (
                  <Tr>
                    <Td colSpan={4} textAlign="center" py={4}>No job postings found</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
            
            <Box mt={4}>
              <Link as={NextLink} href="/jobs" color="blue.500">
                View all positions
              </Link>
            </Box>
          </CardBody>
        </Card>
        
        {/* Upcoming Interviews */}
        <Card bg={cardBg} boxShadow="sm">
          <CardHeader pb={0}>
            <Heading size="md">Upcoming Interviews</Heading>
          </CardHeader>
          <CardBody>
            {interviews.length > 0 ? (
              <VStack spacing={3} align="stretch">
                {interviews.map(interview => (
                  <Box 
                    key={interview.id} 
                    p={3}
                    borderRadius="md"
                    border="1px"
                    borderColor={borderColor}
                    _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                    onClick={() => router.push(`/interviews/${interview.id}`)}
                  >
                    <Flex justify="space-between" mb={1}>
                      <Text fontWeight="medium">{interview.title}</Text>
                      <Badge colorScheme="blue">{interview.type}</Badge>
                    </Flex>
                    <Text fontSize="sm" color="gray.600">
                      {formatDate(interview.scheduled_at)}
                    </Text>
                    {interview.application_id && (
                      <Link
                        as={NextLink}
                        href={`/applications/${interview.application_id}`}
                        fontSize="sm"
                        color="blue.500"
                        onClick={e => e.stopPropagation()}
                      >
                        View Application
                      </Link>
                    )}
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text py={4} textAlign="center">No upcoming interviews</Text>
            )}
            
            <Box mt={4}>
              <Link as={NextLink} href="/interviews" color="blue.500">
                View all interviews
              </Link>
            </Box>
          </CardBody>
        </Card>
      </Grid>
    </Box>
  );
};

export default RecruitmentDashboard; 
