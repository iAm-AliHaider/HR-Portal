import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
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
  InputGroup, 
  InputLeftElement,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  Divider,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react';
import {
  SearchIcon,
  CalendarIcon,
  SettingsIcon,
  AddIcon,
  ViewIcon,
  EditIcon,
  ExternalLinkIcon,
  DownloadIcon,
  ChatIcon,
  CheckIcon,
  CloseIcon,
  WarningIcon,
  EmailIcon,
  CopyIcon
} from '@chakra-ui/icons';
import { format, formatDistanceToNow } from 'date-fns';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Application, User, Job, Offer } from '../../packages/types';

// Extended types for better typing
interface ApplicationWithDetails extends Application {
  candidate?: User;
  job?: Job;
}

interface NegotiationNote {
  id: string;
  date: string;
  note: string;
  type: 'salary' | 'benefits' | 'start_date' | 'other';
  user: string;
}

// Mock data with proper types
const MOCK_OFFERS: Offer[] = [
  {
    id: 'offer1',
    org_id: 'org1',
    application_id: 'app1',
    candidate_id: 'cand1',
    job_id: 'job1',
    status: 'sent',
    salary: {
      amount: 120000,
      currency: 'USD',
      period: 'yearly'
    },
    benefits: ['Health Insurance', '401k', 'PTO', 'Remote Work'],
    start_date: '2024-02-15T08:00:00Z',
    expiration_date: '2024-02-03T23:59:59Z',
    created_at: '2024-01-20T08:00:00Z',
    created_by: 'user1',
    notes: 'Standard offer package for Senior Frontend Developer'
  },
  {
    id: 'offer2',
    org_id: 'org1',
    application_id: 'app2',
    candidate_id: 'cand2',
    job_id: 'job2',
    status: 'accepted',
    salary: {
      amount: 95000,
      currency: 'USD',
      period: 'yearly'
    },
    benefits: ['Health Insurance', 'Dental', 'Vision', 'Stock Options'],
    start_date: '2024-02-01T08:00:00Z',
    expiration_date: '2024-01-29T23:59:59Z',
    created_at: '2024-01-15T08:00:00Z',
    created_by: 'user1',
    accepted_at: '2024-01-22T14:30:00Z',
    notes: 'Accepted with minor salary negotiation'
  }
];

const MOCK_APPLICATIONS: ApplicationWithDetails[] = [
  {
    id: 'app1',
    org_id: 'org1',
    job_id: 'job1',
    user_id: 'cand1',
    status: 'offered',
    application_date: '2024-01-10T08:00:00Z',
    created_at: '2024-01-10T08:00:00Z',
    candidate: {
      id: 'cand1',
      org_id: 'org1',
      email: 'alice.johnson@email.com',
      full_name: 'Alice Johnson',
      role: 'candidate',
      status: 'candidate',
      created_at: '2024-01-05T08:00:00Z',
      phone: '(555) 123-4567',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612d5ca?w=150',
      skills: ['React', 'TypeScript', 'Node.js']
    },
    job: {
      id: 'job1',
      org_id: 'org1',
      title: 'Senior Frontend Developer',
      status: 'published',
      created_at: '2024-01-01T08:00:00Z',
      location: 'San Francisco',
      job_type: 'full_time',
      poster_id: 'user1'
    }
  },
  {
    id: 'app2',
    org_id: 'org1',
    job_id: 'job2',
    user_id: 'cand2',
    status: 'hired',
    application_date: '2024-01-08T08:00:00Z',
    created_at: '2024-01-08T08:00:00Z',
    candidate: {
      id: 'cand2',
      org_id: 'org1',
      email: 'bob.smith@email.com',
      full_name: 'Bob Smith',
      role: 'candidate',
      status: 'candidate',
      created_at: '2024-01-03T08:00:00Z',
      phone: '(555) 234-5678',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      skills: ['Python', 'Django', 'PostgreSQL']
    },
    job: {
      id: 'job2',
      org_id: 'org1',
      title: 'Backend Engineer',
      status: 'published',
      created_at: '2024-01-01T08:00:00Z',
      location: 'Remote',
      job_type: 'remote',
      poster_id: 'user1'
    }
  }
];

type ViewMode = 'cards' | 'table';

const OffersPage = () => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  // Modal states
  const { isOpen: isNegotiateOpen, onOpen: onNegotiateOpen, onClose: onNegotiateClose } = useDisclosure();
  const { isOpen: isWithdrawOpen, onOpen: onWithdrawOpen, onClose: onWithdrawClose } = useDisclosure();
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  
  // State
  const [offers, setOffers] = useState<Offer[]>(MOCK_OFFERS);
  const [applications, setApplications] = useState<ApplicationWithDetails[]>(MOCK_APPLICATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('offer_date');
  
  // Form states
  const [negotiationNote, setNegotiationNote] = useState('');
  const [negotiationType, setNegotiationType] = useState<'salary' | 'benefits' | 'start_date' | 'other'>('salary');
  const [withdrawalReason, setWithdrawalReason] = useState('');

  // Filter and sort offers
  const filteredOffers = offers.filter(offer => {
    const application = applications.find(app => app.id === offer.application_id);
    
    const matchesSearch = 
      searchTerm === '' || 
      (application?.candidate?.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (application?.job?.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || offer.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Offer statistics
  const stats = {
    total: offers.length,
    pending: offers.filter(o => o.status === 'sent' || o.status === 'pending_approval').length,
    accepted: offers.filter(o => o.status === 'accepted').length,
    declined: offers.filter(o => o.status === 'rejected').length,
    avgSalary: Math.round(offers.reduce((sum, o) => sum + o.salary.amount, 0) / offers.length)
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'gray';
      case 'sent': return 'blue';
      case 'pending_approval': return 'orange';
      case 'accepted': return 'green';
      case 'rejected': return 'red';
      case 'negotiating': return 'yellow';
      case 'expired': return 'red';
      default: return 'gray';
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getApplication = (applicationId: string) => {
    return applications.find(app => app.id === applicationId);
  };

  const handleNegotiate = (offer: Offer) => {
    setSelectedOffer(offer);
    onNegotiateOpen();
  };

  const handleWithdraw = (offer: Offer) => {
    setSelectedOffer(offer);
    onWithdrawOpen();
  };

  const handleViewDetails = (offer: Offer) => {
    setSelectedOffer(offer);
    onDetailsOpen();
  };

  const handleSubmitNegotiation = () => {
    if (!selectedOffer || !negotiationNote.trim()) return;
    
    // Store negotiation note in the offer notes field
    const updatedNote = selectedOffer.notes 
      ? `${selectedOffer.notes}\n\n[${negotiationType}] ${new Date().toISOString()}: ${negotiationNote}`
      : `[${negotiationType}] ${new Date().toISOString()}: ${negotiationNote}`;
    
    const updatedOffers = offers.map(offer => 
      offer.id === selectedOffer.id 
        ? { 
            ...offer, 
            notes: updatedNote,
            negotiation_notes: negotiationNote
          }
        : offer
    );
    
    setOffers(updatedOffers);
    
    toast({
      title: 'Negotiation note added',
      description: 'The negotiation note has been saved and candidate will be notified.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    onNegotiateClose();
    setNegotiationNote('');
  };

  const handleWithdrawOffer = () => {
    if (!selectedOffer) return;
    
    const updatedOffers = offers.map(offer => 
      offer.id === selectedOffer.id 
        ? { 
            ...offer, 
            status: 'rejected' as Offer['status'], // Use 'rejected' as there's no 'withdrawn' status
            notes: offer.notes ? `${offer.notes}\n\nWithdrawn: ${withdrawalReason}` : `Withdrawn: ${withdrawalReason}`,
            rejected_at: new Date().toISOString()
          }
        : offer
    );
    
    setOffers(updatedOffers);
    
    toast({
      title: 'Offer withdrawn',
      description: 'The job offer has been withdrawn and candidate has been notified.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    onWithdrawClose();
    setWithdrawalReason('');
  };

  // Offer Card Component
  const OfferCard = ({ offer }: { offer: Offer }) => {
    const application = getApplication(offer.application_id);
    const daysUntilExpiry = getDaysUntilExpiry(offer.expiration_date);
    const isExpiringSoon = daysUntilExpiry <= 3 && daysUntilExpiry > 0;
    const isExpired = daysUntilExpiry <= 0;
    
    return (
      <Card
        bg={cardBg}
        borderColor={borderColor}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        transition="all 0.2s"
        _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
        borderLeft={isExpiringSoon ? '4px solid' : '1px solid'}
        borderLeftColor={isExpiringSoon ? 'orange.500' : isExpired ? 'red.500' : borderColor}
      >
        <CardHeader pb={2}>
          <Flex justify="space-between" align="flex-start" mb={2}>
            <Box flex="1">
              <Heading size="sm" mb={1}>
                {application?.candidate?.full_name}
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={2}>
                {application?.job?.title}
              </Text>
              <HStack spacing={2} mb={2}>
                <Badge colorScheme={getStatusColor(offer.status)} variant="subtle">
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </Badge>
                {isExpiringSoon && (
                  <Badge colorScheme="orange" variant="subtle">
                    Expires in {daysUntilExpiry} days
                  </Badge>
                )}
                {isExpired && (
                  <Badge colorScheme="red" variant="subtle">
                    Expired
                  </Badge>
                )}
              </HStack>
            </Box>
            <Menu>
              <MenuButton as={IconButton} icon={<SettingsIcon />} variant="ghost" size="sm" />
              <MenuList>
                <MenuItem icon={<ViewIcon />} onClick={() => handleViewDetails(offer)}>
                  View Details
                </MenuItem>
                <MenuItem icon={<EditIcon />}>
                  Edit Offer
                </MenuItem>
                <MenuItem icon={<CopyIcon />}>
                  Duplicate Offer
                </MenuItem>
                <MenuItem icon={<EmailIcon />}>
                  Send Reminder
                </MenuItem>
                <Divider />
                {offer.status === 'sent' && (
                  <MenuItem icon={<ChatIcon />} onClick={() => handleNegotiate(offer)}>
                    Add Negotiation Note
                  </MenuItem>
                )}
                <MenuItem icon={<CloseIcon />} color="red.500" onClick={() => handleWithdraw(offer)}>
                  Withdraw Offer
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </CardHeader>
        
        <CardBody pt={0}>
          <VStack align="stretch" spacing={3}>
            <Box>
              <Text fontSize="lg" fontWeight="bold" color="green.600">
                {formatCurrency(offer.salary.amount, offer.salary.currency)}
                <Text as="span" fontSize="sm" color="gray.500" ml={1}>
                  /{offer.salary.period === 'yearly' ? 'year' : offer.salary.period}
                </Text>
              </Text>
            </Box>
            
            <HStack justify="space-between">
              <VStack align="flex-start" spacing={0}>
                <Text fontSize="xs" color="gray.500">Offer Date</Text>
                <Text fontSize="sm">{formatDate(offer.created_at)}</Text>
              </VStack>
              <VStack align="flex-end" spacing={0}>
                <Text fontSize="xs" color="gray.500">Start Date</Text>
                <Text fontSize="sm">{formatDate(offer.start_date)}</Text>
              </VStack>
            </HStack>
            
            {offer.benefits && offer.benefits.length > 0 && (
              <Box>
                <Text fontSize="xs" color="gray.500" mb={1}>Benefits</Text>
                <Wrap>
                  {offer.benefits.slice(0, 3).map((benefit, index) => (
                    <WrapItem key={index}>
                      <Tag size="sm" colorScheme="blue" variant="subtle">
                        <TagLabel>{benefit}</TagLabel>
                      </Tag>
                    </WrapItem>
                  ))}
                  {offer.benefits.length > 3 && (
                    <WrapItem>
                      <Tag size="sm" variant="outline">
                        <TagLabel>+{offer.benefits.length - 3} more</TagLabel>
                      </Tag>
                    </WrapItem>
                  )}
                </Wrap>
              </Box>
            )}
            
            {(isExpiringSoon || isExpired) && (
              <Alert status={isExpired ? "error" : "warning"} size="sm" borderRadius="md">
                <AlertIcon />
                <AlertDescription fontSize="xs">
                  {isExpired ? 'This offer has expired' : `Expires ${formatDistanceToNow(new Date(offer.expiration_date), { addSuffix: true })}`}
                </AlertDescription>
              </Alert>
            )}
          </VStack>
        </CardBody>
        
        <CardFooter pt={0}>
          <HStack spacing={2} width="100%">
            <Button 
              size="sm" 
              variant="outline" 
              leftIcon={<ViewIcon />}
              onClick={() => handleViewDetails(offer)}
            >
              View Details
            </Button>
            
            {offer.status === 'sent' && (
              <Button
                size="sm"
                colorScheme="blue"
                leftIcon={<ChatIcon />}
                onClick={() => handleNegotiate(offer)}
              >
                Negotiate
              </Button>
            )}
            
            {application?.candidate && (
              <Button
                size="sm"
                variant="outline"
                leftIcon={<ExternalLinkIcon />}
                onClick={() => router.push(`/applications/${offer.application_id}`)}
              >
                View Application
              </Button>
            )}
          </HStack>
        </CardFooter>
      </Card>
    );
  };

  return (
    <>
      <Head>
        <title>Job Offers | HR Portal</title>
        <meta name="description" content="Manage job offers and negotiations" />
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
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>Offers</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            {/* Header */}
            <Flex justify="space-between" align="center" mb={6}>
              <Box>
                <Heading size="lg">Job Offers Management</Heading>
                <Text color="gray.600">{filteredOffers.length} of {offers.length} offers</Text>
              </Box>
              
              <ButtonGroup spacing={2}>
                <Button variant="outline" leftIcon={<DownloadIcon />}>
                  Export Offers
                </Button>
                <Button 
                  colorScheme="blue" 
                  leftIcon={<AddIcon />}
                  onClick={() => router.push('/applications')}
                >
                  Create Offer
                </Button>
              </ButtonGroup>
            </Flex>

            {/* Statistics Cards */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Total Offers</StatLabel>
                <StatNumber fontSize="xl">{stats.total}</StatNumber>
              </Stat>
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Pending</StatLabel>
                <StatNumber fontSize="xl" color="orange.500">{stats.pending}</StatNumber>
              </Stat>
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Accepted</StatLabel>
                <StatNumber fontSize="xl" color="green.500">{stats.accepted}</StatNumber>
              </Stat>
              <Stat bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="xs">Avg Salary</StatLabel>
                <StatNumber fontSize="xl">{formatCurrency(stats.avgSalary)}</StatNumber>
              </Stat>
            </SimpleGrid>

            {/* Filters */}
            <Card mb={6} bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4} mb={4}>
                  <GridItem colSpan={{ base: 1, lg: 2 }}>
                    <InputGroup>
                      <InputLeftElement>
                        <SearchIcon color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder="Search candidates, positions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </GridItem>
                  
                  <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="pending_approval">Pending Approval</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="expired">Expired</option>
                  </Select>
                  
                  <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="offer_date">Sort by Offer Date</option>
                    <option value="expiration_date">Sort by Expiry Date</option>
                    <option value="salary_amount">Sort by Salary</option>
                    <option value="status">Sort by Status</option>
                  </Select>
                </Grid>
                
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.500">
                    Showing {filteredOffers.length} of {offers.length} offers
                  </Text>
                  
                  <HStack spacing={2}>
                    <Text fontSize="sm" color="gray.500">View:</Text>
                    <ButtonGroup isAttached size="sm">
                      <Button
                        variant={viewMode === 'cards' ? 'solid' : 'outline'}
                        onClick={() => setViewMode('cards')}
                      >
                        Cards
                      </Button>
                      <Button
                        variant={viewMode === 'table' ? 'solid' : 'outline'}
                        onClick={() => setViewMode('table')}
                      >
                        Table
                      </Button>
                    </ButtonGroup>
                  </HStack>
                </Flex>
              </CardBody>
            </Card>

            {/* Content */}
            {isLoading ? (
              <Flex justify="center" align="center" py={20}>
                <VStack spacing={4}>
                  <Spinner size="xl" />
                  <Text>Loading offers...</Text>
                </VStack>
              </Flex>
            ) : filteredOffers.length === 0 ? (
              <Alert status="info" borderRadius="lg">
                <AlertIcon />
                <AlertTitle>No offers found!</AlertTitle>
                <AlertDescription>
                  {offers.length === 0 
                    ? "No job offers have been created yet. Create your first offer!"
                    : "Try adjusting your filters to see more offers."
                  }
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {viewMode === 'cards' && (
                  <Grid 
                    templateColumns={{ 
                      base: "1fr", 
                      md: "repeat(2, 1fr)", 
                      lg: "repeat(3, 1fr)"
                    }} 
                    gap={6}
                  >
                    {filteredOffers.map(offer => (
                      <OfferCard key={offer.id} offer={offer} />
                    ))}
                  </Grid>
                )}

                {viewMode === 'table' && (
                  <Card bg={cardBg} borderColor={borderColor}>
                    <CardBody p={0}>
                      <Box overflowX="auto">
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Candidate</Th>
                              <Th>Position</Th>
                              <Th>Salary</Th>
                              <Th>Status</Th>
                              <Th>Offer Date</Th>
                              <Th>Expiry</Th>
                              <Th>Actions</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {filteredOffers.map(offer => {
                              const application = getApplication(offer.application_id);
                              return (
                                <Tr key={offer.id}>
                                  <Td>
                                    <HStack>
                                      <Avatar size="sm" name={application?.candidate?.full_name} src={application?.candidate?.avatar_url} />
                                      <Box>
                                        <Text fontWeight="medium" fontSize="sm">{application?.candidate?.full_name}</Text>
                                        <Text fontSize="xs" color="gray.500">{application?.candidate?.email}</Text>
                                      </Box>
                                    </HStack>
                                  </Td>
                                  <Td>
                                    <Text fontSize="sm">{application?.job?.title}</Text>
                                  </Td>
                                  <Td>
                                    <Text fontSize="sm" fontWeight="medium">
                                      {formatCurrency(offer.salary.amount, offer.salary.currency)}
                                    </Text>
                                  </Td>
                                  <Td>
                                    <Badge colorScheme={getStatusColor(offer.status)} variant="subtle">
                                      {offer.status}
                                    </Badge>
                                  </Td>
                                  <Td>
                                    <Text fontSize="sm">{formatDate(offer.created_at)}</Text>
                                  </Td>
                                  <Td>
                                    <Text fontSize="sm">{formatDate(offer.expiration_date)}</Text>
                                  </Td>
                                  <Td>
                                    <Menu>
                                      <MenuButton as={IconButton} icon={<SettingsIcon />} variant="ghost" size="sm" />
                                      <MenuList>
                                        <MenuItem icon={<ViewIcon />} onClick={() => handleViewDetails(offer)}>
                                          View Details
                                        </MenuItem>
                                        <MenuItem icon={<EditIcon />}>
                                          Edit Offer
                                        </MenuItem>
                                      </MenuList>
                                    </Menu>
                                  </Td>
                                </Tr>
                              );
                            })}
                          </Tbody>
                        </Table>
                      </Box>
                    </CardBody>
                  </Card>
                )}
              </>
            )}
          </Container>
        </Box>

        {/* Negotiation Modal */}
        <Modal isOpen={isNegotiateOpen} onClose={onNegotiateClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Negotiation Note</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedOffer && (
                <VStack spacing={4}>
                  <Box width="100%">
                    <Text fontSize="sm" color="gray.500" mb={2}>
                      Candidate: {getApplication(selectedOffer.application_id)?.candidate?.full_name}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Current Offer: {formatCurrency(selectedOffer.salary.amount, selectedOffer.salary.currency)}
                    </Text>
                  </Box>
                  
                  <FormControl>
                    <FormLabel>Negotiation Type</FormLabel>
                    <Select value={negotiationType} onChange={(e) => setNegotiationType(e.target.value as any)}>
                      <option value="salary">Salary</option>
                      <option value="benefits">Benefits</option>
                      <option value="start_date">Start Date</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Negotiation Note</FormLabel>
                    <Textarea
                      value={negotiationNote}
                      onChange={(e) => setNegotiationNote(e.target.value)}
                      placeholder="Describe the negotiation point or counter-offer..."
                      rows={4}
                    />
                  </FormControl>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onNegotiateClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleSubmitNegotiation}>
                Add Note
              </Button>
            </ModalFooter>
          </ModalContent>
            </Modal>

        {/* Withdraw Modal */}
        <Modal isOpen={isWithdrawOpen} onClose={onWithdrawClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Withdraw Offer</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Alert status="warning" mb={4}>
                <AlertIcon />
                <AlertTitle>This action cannot be undone!</AlertTitle>
                <AlertDescription>
                  The candidate will be notified that the offer has been withdrawn.
                </AlertDescription>
              </Alert>
              
              <FormControl>
                <FormLabel>Reason for Withdrawal</FormLabel>
                <Textarea
                  value={withdrawalReason}
                  onChange={(e) => setWithdrawalReason(e.target.value)}
                  placeholder="Provide a reason for withdrawing this offer..."
                  rows={3}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onWithdrawClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleWithdrawOffer}>
                Withdraw Offer
              </Button>
            </ModalFooter>
          </ModalContent>
            </Modal>

        {/* Details Modal */}
        <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Offer Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedOffer && (
                <VStack spacing={6} align="stretch">
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={1}>Candidate</Text>
                      <Text fontWeight="medium">{getApplication(selectedOffer.application_id)?.candidate?.full_name}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={1}>Position</Text>
                      <Text fontWeight="medium">{getApplication(selectedOffer.application_id)?.job?.title}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={1}>Salary</Text>
                      <Text fontWeight="medium" fontSize="lg" color="green.600">
                        {formatCurrency(selectedOffer.salary.amount, selectedOffer.salary.currency)}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={1}>Status</Text>
                      <Badge colorScheme={getStatusColor(selectedOffer.status)} variant="subtle">
                        {selectedOffer.status}
                      </Badge>
                    </Box>
                  </SimpleGrid>
                  
                  <Divider />
                  
                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={2}>Benefits Package</Text>
                    <Wrap>
                      {selectedOffer.benefits.map((benefit, index) => (
                        <WrapItem key={index}>
                          <Tag colorScheme="blue" variant="subtle">
                            <TagLabel>{benefit}</TagLabel>
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </Box>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onDetailsClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </DashboardLayout>
    </>
  );
};

export default OffersPage; 
