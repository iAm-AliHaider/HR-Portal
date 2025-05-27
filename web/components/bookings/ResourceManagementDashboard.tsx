import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
  IconButton,
  Select,
  Input,
  FormControl,
  FormLabel,
  Flex,
  Spacer,
  Alert,
  AlertIcon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  CardHeader,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Progress,
  Divider,
  Avatar,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ButtonGroup,
  InputGroup,
  InputLeftElement,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Textarea,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading
} from '@chakra-ui/react';
import {
  EditIcon,
  DeleteIcon,
  AddIcon,
  SearchIcon,
  SettingsIcon,
  ViewIcon,
  CheckIcon,
  WarningIcon,
  InfoIcon,
  CalendarIcon,
  TimeIcon
} from '@chakra-ui/icons';
import { format } from 'date-fns';
import { BookingService } from '../../services/booking';
import { MeetingRoom, Asset, RoomBooking, AssetBooking } from '../../../packages/types/hr';

interface ResourceManagementDashboardProps {
  orgId: string;
}

const ResourceManagementDashboard: React.FC<ResourceManagementDashboardProps> = ({ orgId }) => {
  const toast = useToast();
  const [meetingRooms, setMeetingRooms] = useState<MeetingRoom[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTab, setSelectedTab] = useState(0);

  // Modal states
  const { isOpen: isRoomModalOpen, onOpen: onRoomModalOpen, onClose: onRoomModalClose } = useDisclosure();
  const { isOpen: isAssetModalOpen, onOpen: onAssetModalOpen, onClose: onAssetModalClose } = useDisclosure();
  const [selectedRoom, setSelectedRoom] = useState<MeetingRoom | undefined>();
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>();

  // Form states
  const [roomForm, setRoomForm] = useState({
    name: '',
    description: '',
    location: '',
    building: '',
    floor: '',
    capacity: 4,
    equipment: [] as string[],
    amenities: [] as string[],
    is_active: true,
    hourly_rate: 0,
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    video_conference_enabled: false,
    accessibility_features: [] as string[],
    booking_rules: {
      min_duration: 30,
      max_duration: 480,
      advance_booking_hours: 2,
      max_advance_days: 30,
      requires_approval: false,
      business_hours_only: true,
      allowed_roles: ['admin', 'manager', 'hr', 'employee']
    }
  });

  const [assetForm, setAssetForm] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    model: '',
    serial_number: '',
    asset_tag: '',
    location: '',
    status: 'available' as 'available' | 'in_use' | 'maintenance' | 'retired',
    condition: 'excellent' as 'excellent' | 'good' | 'fair' | 'poor',
    purchase_date: '',
    warranty_expiry: '',
    specifications: {} as Record<string, any>,
    hourly_rate: 0,
    daily_rate: 0,
    responsible_person: '',
    maintenance_schedule: '',
    booking_rules: {
      max_duration_hours: 24,
      advance_booking_hours: 2,
      requires_approval: false,
      checkout_required: true,
      allowed_roles: ['admin', 'manager', 'employee']
    }
  });

  const [stats, setStats] = useState({
    totalRooms: 0,
    activeRooms: 0,
    totalAssets: 0,
    availableAssets: 0,
    roomUtilization: 0,
    assetUtilization: 0
  });

  useEffect(() => {
    loadData();
  }, [orgId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [roomsData, assetsData] = await Promise.all([
        BookingService.getMeetingRooms(orgId),
        BookingService.getAssets(orgId)
      ]);

      setMeetingRooms(roomsData);
      setAssets(assetsData);

      // Calculate statistics
      const activeRooms = roomsData.filter(room => room.is_active).length;
      const availableAssets = assetsData.filter(asset => asset.status === 'available').length;

      setStats({
        totalRooms: roomsData.length,
        activeRooms,
        totalAssets: assetsData.length,
        availableAssets,
        roomUtilization: roomsData.length > 0 ? Math.round((activeRooms / roomsData.length) * 100) : 0,
        assetUtilization: assetsData.length > 0 ? Math.round((availableAssets / assetsData.length) * 100) : 0
      });

    } catch (error) {
      console.error('Error loading resources:', error);
      toast({
        title: 'Error',
        description: 'Failed to load resource data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRooms = meetingRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && room.is_active) ||
                         (statusFilter === 'inactive' && !room.is_active);
    return matchesSearch && matchesStatus;
  });

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'green';
      case 'in_use': return 'blue';
      case 'maintenance': return 'yellow';
      case 'retired': return 'red';
      default: return 'gray';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'green';
      case 'good': return 'blue';
      case 'fair': return 'yellow';
      case 'poor': return 'red';
      default: return 'gray';
    }
  };

  const handleCreateRoom = () => {
    setSelectedRoom(undefined);
    setRoomForm({
      name: '',
      description: '',
      location: '',
      building: '',
      floor: '',
      capacity: 4,
      equipment: [],
      amenities: [],
      is_active: true,
      hourly_rate: 0,
      contact_person: '',
      contact_email: '',
      contact_phone: '',
      video_conference_enabled: false,
      accessibility_features: [],
      booking_rules: {
        min_duration: 30,
        max_duration: 480,
        advance_booking_hours: 2,
        max_advance_days: 30,
        requires_approval: false,
        business_hours_only: true,
        allowed_roles: ['admin', 'manager', 'hr', 'employee']
      }
    });
    onRoomModalOpen();
  };

  const handleEditRoom = (room: MeetingRoom) => {
    setSelectedRoom(room);
    setRoomForm({
      name: room.name,
      description: room.description || '',
      location: room.location,
      building: room.building || '',
      floor: room.floor || '',
      capacity: room.capacity,
      equipment: room.equipment || [],
      amenities: room.amenities || [],
      is_active: room.is_active,
      hourly_rate: room.hourly_rate || 0,
      contact_person: room.contact_person || '',
      contact_email: room.contact_email || '',
      contact_phone: room.contact_phone || '',
      video_conference_enabled: room.video_conference_enabled || false,
      accessibility_features: room.accessibility_features || [],
      booking_rules: {
        min_duration: room.booking_rules?.min_duration ?? 30,
        max_duration: room.booking_rules?.max_duration ?? 480,
        advance_booking_hours: room.booking_rules?.advance_booking_hours ?? 2,
        max_advance_days: room.booking_rules?.max_advance_days ?? 30,
        requires_approval: room.booking_rules?.requires_approval ?? false,
        business_hours_only: room.booking_rules?.business_hours_only ?? true,
        allowed_roles: room.booking_rules?.allowed_roles ?? ['admin', 'manager', 'hr', 'employee']
      }
    });
    onRoomModalOpen();
  };

  const handleCreateAsset = () => {
    setSelectedAsset(undefined);
    setAssetForm({
      name: '',
      description: '',
      category: '',
      brand: '',
      model: '',
      serial_number: '',
      asset_tag: '',
      location: '',
      status: 'available',
      condition: 'excellent',
      purchase_date: '',
      warranty_expiry: '',
      specifications: {},
      hourly_rate: 0,
      daily_rate: 0,
      responsible_person: '',
      maintenance_schedule: '',
      booking_rules: {
        max_duration_hours: 24,
        advance_booking_hours: 2,
        requires_approval: false,
        checkout_required: true,
        allowed_roles: ['admin', 'manager', 'employee']
      }
    });
    onAssetModalOpen();
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setAssetForm({
      name: asset.name,
      description: asset.description || '',
      category: asset.category,
      brand: asset.brand || '',
      model: asset.model || '',
      serial_number: asset.serial_number || '',
      asset_tag: asset.asset_tag || '',
      location: asset.location || '',
      status: asset.status as 'available' | 'in_use' | 'maintenance' | 'retired',
      condition: asset.condition as 'excellent' | 'good' | 'fair' | 'poor',
      purchase_date: asset.purchase_date || '',
      warranty_expiry: asset.warranty_expiry || '',
      specifications: asset.specifications || {},
      hourly_rate: asset.hourly_rate || 0,
      daily_rate: asset.daily_rate || 0,
      responsible_person: asset.responsible_person || '',
      maintenance_schedule: asset.maintenance_schedule || '',
      booking_rules: {
        max_duration_hours: asset.booking_rules?.max_duration_hours ?? 24,
        advance_booking_hours: asset.booking_rules?.advance_booking_hours ?? 2,
        requires_approval: asset.booking_rules?.requires_approval ?? false,
        checkout_required: asset.booking_rules?.checkout_required ?? true,
        allowed_roles: asset.booking_rules?.allowed_roles ?? ['admin', 'manager', 'employee']
      }
    });
    onAssetModalOpen();
  };

  const handleSaveRoom = async () => {
    try {
      const roomData = {
        ...roomForm,
        org_id: orgId
      };

      if (selectedRoom) {
        await BookingService.updateMeetingRoom(selectedRoom.id, roomData);
      } else {
        await BookingService.createMeetingRoom(roomData);
      }

      toast({
        title: 'Success',
        description: `Meeting room ${selectedRoom ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onRoomModalClose();
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${selectedRoom ? 'update' : 'create'} meeting room`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSaveAsset = async () => {
    try {
      const assetData = {
        ...assetForm,
        org_id: orgId
      };

      if (selectedAsset) {
        await BookingService.updateAsset(selectedAsset.id, assetData);
      } else {
        await BookingService.createAsset(assetData);
      }

      toast({
        title: 'Success',
        description: `Asset ${selectedAsset ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onAssetModalClose();
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${selectedAsset ? 'update' : 'create'} asset`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await BookingService.deleteMeetingRoom(roomId);
      toast({
        title: 'Success',
        description: 'Meeting room deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete meeting room',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    try {
      await BookingService.deleteAsset(assetId);
      toast({
        title: 'Success',
        description: 'Asset deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete asset',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const addEquipmentItem = (item: string) => {
    if (item && !roomForm.equipment.includes(item)) {
      setRoomForm(prev => ({
        ...prev,
        equipment: [...prev.equipment, item]
      }));
    }
  };

  const removeEquipmentItem = (item: string) => {
    setRoomForm(prev => ({
      ...prev,
      equipment: prev.equipment.filter(eq => eq !== item)
    }));
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Statistics Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Meeting Rooms</StatLabel>
              <StatNumber>{stats.totalRooms}</StatNumber>
              <StatHelpText>
                {stats.activeRooms} active
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Assets</StatLabel>
              <StatNumber>{stats.totalAssets}</StatNumber>
              <StatHelpText>
                {stats.availableAssets} available
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Room Utilization</StatLabel>
              <StatNumber>{stats.roomUtilization}%</StatNumber>
              <Progress value={stats.roomUtilization} colorScheme="blue" size="sm" mt={2} />
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Asset Availability</StatLabel>
              <StatNumber>{stats.assetUtilization}%</StatNumber>
              <Progress value={stats.assetUtilization} colorScheme="green" size="sm" mt={2} />
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Filters */}
      <Card>
        <CardBody>
          <Flex gap={4} wrap="wrap" align="end">
            <FormControl maxW="300px">
              <FormLabel fontSize="sm">Search</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <FormControl maxW="150px">
              <FormLabel fontSize="sm">Status</FormLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="available">Available</option>
                <option value="in_use">In Use</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </Select>
            </FormControl>

            <FormControl maxW="150px">
              <FormLabel fontSize="sm">Category</FormLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="laptop">Laptop</option>
                <option value="projector">Projector</option>
                <option value="camera">Camera</option>
                <option value="microphone">Microphone</option>
                <option value="tablet">Tablet</option>
                <option value="whiteboard">Whiteboard</option>
                <option value="lighting">Lighting</option>
                <option value="recording">Recording</option>
              </Select>
            </FormControl>

            <Spacer />

            <ButtonGroup>
              <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleCreateRoom}>
                Add Room
              </Button>
              <Button leftIcon={<AddIcon />} colorScheme="green" onClick={handleCreateAsset}>
                Add Asset
              </Button>
            </ButtonGroup>
          </Flex>
        </CardBody>
      </Card>

      {/* Resource Tables */}
      <Tabs index={selectedTab} onChange={setSelectedTab} variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>
            <HStack>
              <CalendarIcon />
              <Text>Meeting Rooms ({filteredRooms.length})</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <SettingsIcon />
              <Text>Assets ({filteredAssets.length})</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <Card>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Room</Th>
                      <Th>Location</Th>
                      <Th>Capacity</Th>
                      <Th>Equipment</Th>
                      <Th>Rate</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredRooms.map((room) => (
                      <Tr key={room.id}>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium">{room.name}</Text>
                            {room.description && (
                              <Text fontSize="sm" color="gray.500" noOfLines={2}>
                                {room.description}
                              </Text>
                            )}
                          </VStack>
                        </Td>
                        <Td>
                          <Text fontSize="sm">{room.location}</Text>
                        </Td>
                        <Td>{room.capacity} people</Td>
                        <Td>
                          <Wrap>
                            {room.equipment?.slice(0, 3).map((item, index) => (
                              <WrapItem key={index}>
                                <Tag size="sm" colorScheme="blue">
                                  <TagLabel>{item}</TagLabel>
                                </Tag>
                              </WrapItem>
                            ))}
                            {room.equipment && room.equipment.length > 3 && (
                              <WrapItem>
                                <Tag size="sm" colorScheme="gray">
                                  <TagLabel>+{room.equipment.length - 3} more</TagLabel>
                                </Tag>
                              </WrapItem>
                            )}
                          </Wrap>
                        </Td>
                        <Td>${room.hourly_rate || 0}/hr</Td>
                        <Td>
                          <Badge colorScheme={room.is_active ? 'green' : 'red'}>
                            {room.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </Td>
                        <Td>
                          <ButtonGroup size="sm" variant="ghost">
                            <IconButton
                              aria-label="Edit room"
                              icon={<EditIcon />}
                              onClick={() => handleEditRoom(room)}
                            />
                            <IconButton
                              aria-label="Delete room"
                              icon={<DeleteIcon />}
                              colorScheme="red"
                              onClick={() => handleDeleteRoom(room.id)}
                            />
                          </ButtonGroup>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Card>
          </TabPanel>

          <TabPanel px={0}>
            <Card>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Asset</Th>
                      <Th>Category</Th>
                      <Th>Location</Th>
                      <Th>Condition</Th>
                      <Th>Rate</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredAssets.map((asset) => (
                      <Tr key={asset.id}>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium">{asset.name}</Text>
                            {asset.brand && asset.model && (
                              <Text fontSize="sm" color="gray.500">
                                {asset.brand} {asset.model}
                              </Text>
                            )}
                          </VStack>
                        </Td>
                        <Td>
                          <Badge colorScheme="gray">{asset.category}</Badge>
                        </Td>
                        <Td>
                          <Text fontSize="sm">{asset.location}</Text>
                        </Td>
                        <Td>
                          <Badge colorScheme={getConditionColor(asset.condition)}>
                            {asset.condition}
                          </Badge>
                        </Td>
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="sm">${asset.hourly_rate || 0}/hr</Text>
                            <Text fontSize="xs" color="gray.500">
                              ${asset.daily_rate || 0}/day
                            </Text>
                          </VStack>
                        </Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(asset.status)}>
                            {asset.status.replace('_', ' ')}
                          </Badge>
                        </Td>
                        <Td>
                          <ButtonGroup size="sm" variant="ghost">
                            <IconButton
                              aria-label="Edit asset"
                              icon={<EditIcon />}
                              onClick={() => handleEditAsset(asset)}
                            />
                            <IconButton
                              aria-label="Delete asset"
                              icon={<DeleteIcon />}
                              colorScheme="red"
                              onClick={() => handleDeleteAsset(asset.id)}
                            />
                          </ButtonGroup>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Room Modal */}
      <Modal isOpen={isRoomModalOpen} onClose={onRoomModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedRoom ? 'Edit Meeting Room' : 'Add Meeting Room'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <HStack width="100%">
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={roomForm.name}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Conference Room A"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Capacity</FormLabel>
                  <NumberInput
                    value={roomForm.capacity}
                    onChange={(value) => setRoomForm(prev => ({ ...prev, capacity: parseInt(value) || 4 }))}
                    min={1}
                    max={100}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={roomForm.description}
                  onChange={(e) => setRoomForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the room"
                />
              </FormControl>

              <HStack width="100%">
                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input
                    value={roomForm.location}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Building A, Floor 2, Room 205"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Hourly Rate ($)</FormLabel>
                  <NumberInput
                    value={roomForm.hourly_rate}
                    onChange={(value) => setRoomForm(prev => ({ ...prev, hourly_rate: parseFloat(value) || 0 }))}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </HStack>

              <HStack width="100%">
                <FormControl>
                  <FormLabel>Building</FormLabel>
                  <Input
                    value={roomForm.building}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, building: e.target.value }))}
                    placeholder="Building A"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Floor</FormLabel>
                  <Input
                    value={roomForm.floor}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, floor: e.target.value }))}
                    placeholder="2"
                  />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Equipment</FormLabel>
                <Wrap>
                  {roomForm.equipment.map((item, index) => (
                    <WrapItem key={index}>
                      <Tag size="md" colorScheme="blue">
                        <TagLabel>{item}</TagLabel>
                        <TagCloseButton onClick={() => removeEquipmentItem(item)} />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
                <HStack mt={2}>
                  <Input
                    placeholder="Add equipment item"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addEquipmentItem(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={(e) => {
                      const input = e.currentTarget.parentElement?.querySelector('input');
                      if (input?.value) {
                        addEquipmentItem(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </HStack>
              </FormControl>

              <HStack width="100%">
                <FormControl>
                  <FormLabel>Contact Person</FormLabel>
                  <Input
                    value={roomForm.contact_person}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, contact_person: e.target.value }))}
                    placeholder="John Doe"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Contact Email</FormLabel>
                  <Input
                    value={roomForm.contact_email}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="john@company.com"
                  />
                </FormControl>
              </HStack>

              <HStack width="100%">
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Active</FormLabel>
                  <Switch
                    isChecked={roomForm.is_active}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Video Conference</FormLabel>
                  <Switch
                    isChecked={roomForm.video_conference_enabled}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, video_conference_enabled: e.target.checked }))}
                  />
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onRoomModalClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSaveRoom}>
              {selectedRoom ? 'Update' : 'Create'} Room
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Asset Modal */}
      <Modal isOpen={isAssetModalOpen} onClose={onAssetModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedAsset ? 'Edit Asset' : 'Add Asset'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <HStack width="100%">
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={assetForm.name}
                    onChange={(e) => setAssetForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="MacBook Pro 15"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={assetForm.category}
                    onChange={(e) => setAssetForm(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="">Select category</option>
                    <option value="laptop">Laptop</option>
                    <option value="projector">Projector</option>
                    <option value="camera">Camera</option>
                    <option value="microphone">Microphone</option>
                    <option value="tablet">Tablet</option>
                    <option value="whiteboard">Whiteboard</option>
                    <option value="lighting">Lighting</option>
                    <option value="recording">Recording</option>
                  </Select>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={assetForm.description}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the asset"
                />
              </FormControl>

              <HStack width="100%">
                <FormControl>
                  <FormLabel>Brand</FormLabel>
                  <Input
                    value={assetForm.brand}
                    onChange={(e) => setAssetForm(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder="Apple"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Model</FormLabel>
                  <Input
                    value={assetForm.model}
                    onChange={(e) => setAssetForm(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="MacBook Pro 15-inch"
                  />
                </FormControl>
              </HStack>

              <HStack width="100%">
                <FormControl>
                  <FormLabel>Serial Number</FormLabel>
                  <Input
                    value={assetForm.serial_number}
                    onChange={(e) => setAssetForm(prev => ({ ...prev, serial_number: e.target.value }))}
                    placeholder="C02ZN1JDMD6R"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Asset Tag</FormLabel>
                  <Input
                    value={assetForm.asset_tag}
                    onChange={(e) => setAssetForm(prev => ({ ...prev, asset_tag: e.target.value }))}
                    placeholder="LAPTOP-001"
                  />
                </FormControl>
              </HStack>

              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input
                  value={assetForm.location}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="IT Equipment Room, Building A"
                />
              </FormControl>

              <HStack width="100%">
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={assetForm.status}
                    onChange={(e) => setAssetForm(prev => ({ ...prev, status: e.target.value as any }))}
                  >
                    <option value="available">Available</option>
                    <option value="in_use">In Use</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="retired">Retired</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Condition</FormLabel>
                  <Select
                    value={assetForm.condition}
                    onChange={(e) => setAssetForm(prev => ({ ...prev, condition: e.target.value as any }))}
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </Select>
                </FormControl>
              </HStack>

              <HStack width="100%">
                <FormControl>
                  <FormLabel>Hourly Rate ($)</FormLabel>
                  <NumberInput
                    value={assetForm.hourly_rate}
                    onChange={(value) => setAssetForm(prev => ({ ...prev, hourly_rate: parseFloat(value) || 0 }))}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Daily Rate ($)</FormLabel>
                  <NumberInput
                    value={assetForm.daily_rate}
                    onChange={(value) => setAssetForm(prev => ({ ...prev, daily_rate: parseFloat(value) || 0 }))}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </HStack>

              <HStack width="100%">
                <FormControl>
                  <FormLabel>Purchase Date</FormLabel>
                  <Input
                    type="date"
                    value={assetForm.purchase_date}
                    onChange={(e) => setAssetForm(prev => ({ ...prev, purchase_date: e.target.value }))}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Warranty Expiry</FormLabel>
                  <Input
                    type="date"
                    value={assetForm.warranty_expiry}
                    onChange={(e) => setAssetForm(prev => ({ ...prev, warranty_expiry: e.target.value }))}
                  />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Responsible Person</FormLabel>
                <Input
                  value={assetForm.responsible_person}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, responsible_person: e.target.value }))}
                  placeholder="IT Admin"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Maintenance Schedule</FormLabel>
                <Input
                  value={assetForm.maintenance_schedule}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, maintenance_schedule: e.target.value }))}
                  placeholder="Monthly cleaning and updates"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAssetModalClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSaveAsset}>
              {selectedAsset ? 'Update' : 'Create'} Asset
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default ResourceManagementDashboard; 
