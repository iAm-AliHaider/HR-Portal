import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  Heading,
  Text,
  Button,
  Grid,
  Flex,
  Badge,
  Input,
  Select,
  Card,
  CardBody,
  CardHeader,
  useToast,
  HStack,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  AvatarGroup,
  Container,
  useColorModeValue,
  ButtonGroup,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  InputGroup,
  InputLeftElement,
  Center,
  NumberInput,
  NumberInputField
} from '@chakra-ui/react';
import {
  SearchIcon,
  AddIcon,
  ViewIcon,
  EditIcon,
  SettingsIcon,
  DownloadIcon,
  EmailIcon
} from '@chakra-ui/icons';
import { format } from 'date-fns';
import DashboardLayout from '../components/layout/DashboardLayout';
import { GetServerSideProps } from 'next';

// Enhanced interfaces for teams
interface EnhancedTeam {
  id: string;
  org_id: string;
  name: string;
  supervisor_id: string;
  supervisor_name?: string;
  member_count: number;
  department: string;
  location?: string;
  budget?: number;
  performance_score?: number;
  projects_count?: number;
  created_at: string;
  description?: string;
  status: 'active' | 'inactive' | 'forming' | 'restructuring';
}

// Mock data
const MOCK_TEAMS: EnhancedTeam[] = [
  {
    id: 'team1',
    org_id: 'org1',
    name: 'Engineering Team',
    supervisor_id: 'u4',
    supervisor_name: 'Diana Wong',
    member_count: 8,
    department: 'Engineering',
    location: 'San Francisco',
    budget: 250000,
    performance_score: 87,
    projects_count: 12,
    created_at: '2023-01-15T08:00:00Z',
    description: 'Core development team responsible for product engineering and technical innovation',
    status: 'active'
  },
  {
    id: 'team2',
    org_id: 'org1',
    name: 'Sales Team',
    supervisor_id: 'u6',
    supervisor_name: 'Frank Miller',
    member_count: 6,
    department: 'Sales',
    location: 'New York',
    budget: 180000,
    performance_score: 92,
    projects_count: 8,
    created_at: '2023-02-01T08:00:00Z',
    description: 'Dynamic sales team focused on revenue growth and customer acquisition',
    status: 'active'
  },
  {
    id: 'team3',
    org_id: 'org1',
    name: 'Marketing Team',
    supervisor_id: 'u7',
    supervisor_name: 'Sarah Chen',
    member_count: 5,
    department: 'Marketing',
    location: 'Chicago',
    budget: 120000,
    performance_score: 78,
    projects_count: 15,
    created_at: '2023-03-10T08:00:00Z',
    description: 'Creative marketing team driving brand awareness and customer engagement',
    status: 'active'
  },
  {
    id: 'team4',
    org_id: 'org1',
    name: 'HR Team',
    supervisor_id: 'u1',
    supervisor_name: 'Alice Johnson',
    member_count: 3,
    department: 'Human Resources',
    location: 'New York',
    budget: 90000,
    performance_score: 85,
    projects_count: 6,
    created_at: '2023-01-01T08:00:00Z',
    description: 'People operations team ensuring employee satisfaction and organizational growth',
    status: 'active'
  },
  {
    id: 'team5',
    org_id: 'org1',
    name: 'Product Team',
    supervisor_id: 'u8',
    supervisor_name: 'Michael Rodriguez',
    member_count: 4,
    department: 'Product',
    location: 'San Francisco',
    budget: 150000,
    performance_score: 82,
    projects_count: 10,
    created_at: '2023-04-15T08:00:00Z',
    description: 'Product strategy and design team shaping user experience and product direction',
    status: 'forming'
  }
];

const TeamsPage = () => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  
  // State
  const [teams, setTeams] = useState<EnhancedTeam[]>(MOCK_TEAMS);
  const [selectedTab, setSelectedTab] = useState(0);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<EnhancedTeam | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Modal states
  const { isOpen: isTeamOpen, onOpen: onTeamOpen, onClose: onTeamClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

  // Statistics
  const stats = {
    totalTeams: teams.length,
    activeTeams: teams.filter(t => t.status === 'active').length,
    totalMembers: teams.reduce((sum, team) => sum + team.member_count, 0),
    avgPerformance: Math.round(teams.reduce((sum, team) => sum + (team.performance_score || 0), 0) / teams.length),
    totalBudget: teams.reduce((sum, team) => sum + (team.budget || 0), 0)
  };

  // Filter teams
  const filteredTeams = teams.filter(team => {
    const matchesSearch = !searchTerm || 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'all' || team.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || team.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'gray';
      case 'forming': return 'blue';
      case 'restructuring': return 'orange';
      default: return 'gray';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'green';
    if (score >= 80) return 'blue';
    if (score >= 70) return 'yellow';
    return 'red';
  };

  const handleViewTeam = (team: EnhancedTeam) => {
    setSelectedTeam(team);
    onTeamOpen();
  };

  const getDepartments = () => {
    return Array.from(new Set(teams.map(team => team.department)));
  };

  return (
    <>
      <Head>
        <title>Teams Management | HR Portal</title>
        <meta name="description" content="Comprehensive team management and organization system" />
      </Head>
      
      <DashboardLayout>
        <Box bg={bgColor} minH="100vh" pb={8}>
          <Container maxW="full" py={6}>
            {/* Breadcrumb */}
            <Breadcrumb mb={6} fontSize="sm">
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => router.push('/dashboard')}>
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink>HR Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>Teams</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            {/* Header */}
            <Flex justify="space-between" align="center" mb={6}>
              <Box>
                <Heading size="lg">Teams Management</Heading>
                <Text color="gray.600">Organize and manage teams across your organization</Text>
              </Box>
              
              <ButtonGroup spacing={2}>
                <Button variant="outline" leftIcon={<DownloadIcon />}>
                  Export Data
                </Button>
                <Button 
                  colorScheme="blue" 
                  leftIcon={<AddIcon />}
                  onClick={onCreateOpen}
                >
                  Create Team
                </Button>
              </ButtonGroup>
            </Flex>

            {/* Statistics Cards */}
            <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4} mb={6}>
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Total Teams</StatLabel>
                <StatNumber fontSize="xl">{stats.totalTeams}</StatNumber>
                <StatHelpText>All departments</StatHelpText>
              </Stat>
              
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Active Teams</StatLabel>
                <StatNumber fontSize="xl" color="green.500">{stats.activeTeams}</StatNumber>
                <StatHelpText>Currently operational</StatHelpText>
              </Stat>
              
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Total Members</StatLabel>
                <StatNumber fontSize="xl" color="blue.500">{stats.totalMembers}</StatNumber>
                <StatHelpText>Across all teams</StatHelpText>
              </Stat>
              
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Avg Performance</StatLabel>
                <StatNumber fontSize="xl" color={getPerformanceColor(stats.avgPerformance)}>{stats.avgPerformance}%</StatNumber>
                <StatHelpText>Team performance</StatHelpText>
              </Stat>
              
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Total Budget</StatLabel>
                <StatNumber fontSize="lg">{formatCurrency(stats.totalBudget)}</StatNumber>
                <StatHelpText>Combined budgets</StatHelpText>
              </Stat>
            </SimpleGrid>

            {/* Filters */}
            <Card bg={cardBg} borderColor={borderColor} mb={6}>
              <CardBody>
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={4}>
                  <InputGroup>
                    <InputLeftElement>
                      <SearchIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search teams..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                  
                  <Select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
                    <option value="all">All Departments</option>
                    {getDepartments().map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </Select>
                  
                  <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="forming">Forming</option>
                    <option value="restructuring">Restructuring</option>
                  </Select>
                </Grid>
                
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.500">
                    {filteredTeams.length} of {teams.length} teams
                  </Text>
                  <ButtonGroup isAttached size="sm">
                    <Button 
                      variant={viewMode === 'grid' ? 'solid' : 'outline'} 
                      onClick={() => setViewMode('grid')}
                    >
                      Grid
                    </Button>
                    <Button 
                      variant={viewMode === 'table' ? 'solid' : 'outline'} 
                      onClick={() => setViewMode('table')}
                    >
                      Table
                    </Button>
                  </ButtonGroup>
                </Flex>
              </CardBody>
            </Card>

            {/* Teams Display */}
            {viewMode === 'grid' ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {filteredTeams.map((team) => (
                  <Card key={team.id} bg={cardBg} borderColor={borderColor} _hover={{ shadow: 'lg' }}>
                    <CardHeader>
                      <Flex justify="space-between" align="start">
                        <Box>
                          <Heading size="sm">{team.name}</Heading>
                          <Text fontSize="sm" color="gray.500" mt={1}>{team.department}</Text>
                        </Box>
                        <Badge colorScheme={getStatusColor(team.status)} variant="subtle">
                          {team.status}
                        </Badge>
                      </Flex>
                    </CardHeader>
                    <CardBody pt={0}>
                      <Text fontSize="sm" color="gray.600" mb={4} noOfLines={2}>
                        {team.description}
                      </Text>
                      
                      <VStack spacing={3} align="stretch">
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.500">Members</Text>
                          <Text fontSize="sm">{team.member_count}</Text>
                        </HStack>
                        
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.500">Supervisor</Text>
                          <Text fontSize="sm" fontWeight="medium">{team.supervisor_name}</Text>
                        </HStack>
                        
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.500">Performance</Text>
                          <Badge colorScheme={getPerformanceColor(team.performance_score || 0)} variant="subtle">
                            {team.performance_score}%
                          </Badge>
                        </HStack>
                        
                        {team.budget && (
                          <HStack justify="space-between">
                            <Text fontSize="sm" color="gray.500">Budget</Text>
                            <Text fontSize="sm" fontWeight="medium">{formatCurrency(team.budget)}</Text>
                          </HStack>
                        )}
                        
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.500">Projects</Text>
                          <Text fontSize="sm">{team.projects_count}</Text>
                        </HStack>
                      </VStack>
                      
                      <ButtonGroup spacing={2} mt={4} size="sm">
                        <Button variant="outline" leftIcon={<ViewIcon />} onClick={() => handleViewTeam(team)}>
                          View Details
                        </Button>
                        <Menu>
                          <MenuButton as={IconButton} icon={<SettingsIcon />} variant="ghost" size="sm" />
                          <MenuList>
                            <MenuItem icon={<EditIcon />}>
                              Edit Team
                            </MenuItem>
                            <MenuItem icon={<EmailIcon />}>
                              Message Team
                            </MenuItem>
                            <MenuItem icon={<DownloadIcon />}>
                              Export Data
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </ButtonGroup>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            ) : (
              <Card bg={cardBg} borderColor={borderColor}>
                <CardBody p={0}>
                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Team</Th>
                          <Th>Department</Th>
                          <Th>Members</Th>
                          <Th>Supervisor</Th>
                          <Th>Performance</Th>
                          <Th>Status</Th>
                          <Th>Budget</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredTeams.map((team) => (
                          <Tr key={team.id} _hover={{ bg: hoverBg }}>
                            <Td>
                              <HStack spacing={3}>
                                <Avatar size="sm" name={team.name} />
                                <Box>
                                  <Text fontWeight="medium">{team.name}</Text>
                                  <Text fontSize="sm" color="gray.500" noOfLines={1}>{team.description}</Text>
                                </Box>
                              </HStack>
                            </Td>
                            <Td>{team.department}</Td>
                            <Td>{team.member_count}</Td>
                            <Td>{team.supervisor_name}</Td>
                            <Td>
                              <Badge colorScheme={getPerformanceColor(team.performance_score || 0)} variant="subtle">
                                {team.performance_score}%
                              </Badge>
                            </Td>
                            <Td>
                              <Badge colorScheme={getStatusColor(team.status)} variant="subtle">
                                {team.status}
                              </Badge>
                            </Td>
                            <Td>{team.budget ? formatCurrency(team.budget) : 'N/A'}</Td>
                            <Td>
                              <Menu>
                                <MenuButton as={IconButton} icon={<SettingsIcon />} variant="ghost" size="sm" />
                                <MenuList>
                                  <MenuItem icon={<ViewIcon />} onClick={() => handleViewTeam(team)}>
                                    View Details
                                  </MenuItem>
                                  <MenuItem icon={<EditIcon />}>
                                    Edit Team
                                  </MenuItem>
                                  <MenuItem icon={<EmailIcon />}>
                                    Message Team
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </CardBody>
              </Card>
            )}
          </Container>
        </Box>

        {/* Team Details Modal */}
        <Modal isOpen={isTeamOpen} onClose={onTeamClose} size="4xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedTeam?.name} - Team Details
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedTeam && (
                <VStack spacing={6} align="stretch">
                  <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4}>
                    <Stat textAlign="center">
                      <StatLabel>Members</StatLabel>
                      <StatNumber>{selectedTeam.member_count}</StatNumber>
                    </Stat>
                    <Stat textAlign="center">
                      <StatLabel>Performance</StatLabel>
                      <StatNumber color={getPerformanceColor(selectedTeam.performance_score || 0)}>
                        {selectedTeam.performance_score}%
                      </StatNumber>
                    </Stat>
                    <Stat textAlign="center">
                      <StatLabel>Projects</StatLabel>
                      <StatNumber>{selectedTeam.projects_count}</StatNumber>
                    </Stat>
                    <Stat textAlign="center">
                      <StatLabel>Budget</StatLabel>
                      <StatNumber fontSize="lg">{selectedTeam.budget ? formatCurrency(selectedTeam.budget) : 'N/A'}</StatNumber>
                    </Stat>
                  </Grid>

                  <Box>
                    <Text fontWeight="medium" mb={2}>Description</Text>
                    <Text color="gray.600">{selectedTeam.description}</Text>
                  </Box>

                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                    <Box>
                      <Text fontWeight="medium" mb={2}>Team Information</Text>
                      <VStack spacing={2} align="stretch">
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.500">Department:</Text>
                          <Text fontSize="sm">{selectedTeam.department}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.500">Location:</Text>
                          <Text fontSize="sm">{selectedTeam.location}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.500">Supervisor:</Text>
                          <Text fontSize="sm">{selectedTeam.supervisor_name}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.500">Status:</Text>
                          <Badge colorScheme={getStatusColor(selectedTeam.status)} variant="subtle">
                            {selectedTeam.status}
                          </Badge>
                        </Flex>
                      </VStack>
                    </Box>

                    <Box>
                      <Text fontWeight="medium" mb={2}>Performance Metrics</Text>
                      <VStack spacing={2} align="stretch">
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.500">Overall Score:</Text>
                          <Text fontSize="sm">{selectedTeam.performance_score}%</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.500">Active Projects:</Text>
                          <Text fontSize="sm">{selectedTeam.projects_count}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize="sm" color="gray.500">Team Size:</Text>
                          <Text fontSize="sm">{selectedTeam.member_count} members</Text>
                        </Flex>
                      </VStack>
                    </Box>
                  </Grid>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <ButtonGroup spacing={2}>
                <Button variant="ghost" onClick={onTeamClose}>
                  Close
                </Button>
                <Button colorScheme="blue">
                  Edit Team
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Create Team Modal */}
        <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Team</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Team Name</FormLabel>
                  <Input placeholder="Enter team name" />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Department</FormLabel>
                  <Select placeholder="Select department">
                    {getDepartments().map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea placeholder="Describe the team..." rows={3} />
                </FormControl>
                
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                  <FormControl>
                    <FormLabel>Location</FormLabel>
                    <Input placeholder="Team location" />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Budget</FormLabel>
                    <NumberInput>
                      <NumberInputField placeholder="0" />
                    </NumberInput>
                  </FormControl>
                </Grid>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <ButtonGroup spacing={2}>
                <Button variant="ghost" onClick={onCreateClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue">
                  Create Team
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </DashboardLayout>
    </>
  );
};

export default TeamsPage;

// Force server-side rendering to prevent SSR issues
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      timestamp: new Date().toISOString(),
    },
  };
}; 
