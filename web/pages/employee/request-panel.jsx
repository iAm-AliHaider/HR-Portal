import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Select,
  FormControl,
  FormLabel,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react';
import { supabase } from '../../lib/supabase/client';
import DashboardLayout from '../../components/layout/DashboardLayout';
import RequestCard from '../../components/requests/RequestCard';
import RequestFormHandler from '../../components/requests/RequestFormHandler';

export default function RequestPanel() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [requests, setRequests] = useState([]);
  const [requestTypes, setRequestTypes] = useState([]);
  const [selectedRequestType, setSelectedRequestType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTypes, setLoadingTypes] = useState(true);

  // Fetch user's requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        const { data, error } = await supabase
          .from('requests')
          .select(`
            id,
            title,
            description,
            status,
            created_at,
            request_type_id,
            request_types(name)
          `)
          .eq('employee_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setRequests(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Fetch request types
  useEffect(() => {
    const fetchRequestTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('request_types')
          .select('id, name, description, category_id, request_categories(name)')
          .order('name');
          
        if (error) throw error;
        
        setRequestTypes(data);
        setLoadingTypes(false);
      } catch (err) {
        console.error('Error fetching request types:', err);
        setLoadingTypes(false);
      }
    };

    fetchRequestTypes();
  }, []);

  // Filter requests by status
  const pendingRequests = requests.filter(req => req.status === 'pending');
  const approvedRequests = requests.filter(req => req.status === 'approved');
  const rejectedRequests = requests.filter(req => req.status === 'rejected');

  const handleNewRequest = () => {
    setSelectedRequestType('');
    onOpen();
  };

  const handleRequestTypeChange = (e) => {
    setSelectedRequestType(e.target.value);
  };

  const handleSubmit = async (formData) => {
    // This will be handled by the RequestFormHandler component
    onClose();
    // Refresh requests after submission
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;
    
    const { data, error } = await supabase
      .from('requests')
      .select(`
        id,
        title,
        description,
        status,
        created_at,
        request_type_id,
        request_types(name)
      `)
      .eq('employee_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error refreshing requests:', error);
      return;
    }
    
    setRequests(data);
  };

  // Group request types by category
  const groupedTypes = {};
  requestTypes.forEach(type => {
    const category = type.request_categories?.name || 'Other';
    if (!groupedTypes[category]) {
      groupedTypes[category] = [];
    }
    groupedTypes[category].push(type);
  });

  return (
    <DashboardLayout>
      <Container maxW="container.xl" py={5}>
        <HStack justify="space-between" mb={6}>
          <Box>
            <Heading size="lg">Request Panel</Heading>
            <Text color="gray.600">Manage and track your requests</Text>
          </Box>
          <Button colorScheme="blue" onClick={handleNewRequest}>
            New Request
          </Button>
        </HStack>

        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>All Requests</Tab>
            <Tab>Pending</Tab>
            <Tab>Approved</Tab>
            <Tab>Rejected</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {isLoading ? (
                <Box textAlign="center" py={10}>
                  <Spinner size="xl" />
                </Box>
              ) : requests.length === 0 ? (
                <Box textAlign="center" py={10}>
                  <Text>No requests found. Create a new request to get started.</Text>
                </Box>
              ) : (
                <VStack spacing={4} align="stretch">
                  {requests.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </VStack>
              )}
            </TabPanel>

            <TabPanel>
              {isLoading ? (
                <Box textAlign="center" py={10}>
                  <Spinner size="xl" />
                </Box>
              ) : pendingRequests.length === 0 ? (
                <Box textAlign="center" py={10}>
                  <Text>No pending requests found.</Text>
                </Box>
              ) : (
                <VStack spacing={4} align="stretch">
                  {pendingRequests.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </VStack>
              )}
            </TabPanel>

            <TabPanel>
              {isLoading ? (
                <Box textAlign="center" py={10}>
                  <Spinner size="xl" />
                </Box>
              ) : approvedRequests.length === 0 ? (
                <Box textAlign="center" py={10}>
                  <Text>No approved requests found.</Text>
                </Box>
              ) : (
                <VStack spacing={4} align="stretch">
                  {approvedRequests.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </VStack>
              )}
            </TabPanel>

            <TabPanel>
              {isLoading ? (
                <Box textAlign="center" py={10}>
                  <Spinner size="xl" />
                </Box>
              ) : rejectedRequests.length === 0 ? (
                <Box textAlign="center" py={10}>
                  <Text>No rejected requests found.</Text>
                </Box>
              ) : (
                <VStack spacing={4} align="stretch">
                  {rejectedRequests.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </VStack>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Request Form Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedRequestType ? `New ${selectedRequestType}` : 'Create New Request'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {!selectedRequestType ? (
                <FormControl>
                  <FormLabel>Select Request Type</FormLabel>
                  {loadingTypes ? (
                    <Spinner />
                  ) : (
                    <Select 
                      placeholder="Select request type" 
                      onChange={handleRequestTypeChange}
                    >
                      {Object.entries(groupedTypes).map(([category, types]) => (
                        <optgroup label={category} key={category}>
                          {types.map(type => (
                            <option key={type.id} value={type.name}>
                              {type.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </Select>
                  )}
                </FormControl>
              ) : (
                <RequestFormHandler 
                  requestType={selectedRequestType}
                  onSubmit={handleSubmit}
                  onCancel={onClose}
                />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </DashboardLayout>
  );
} 