import {
  AddIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
  InfoIcon,
  SearchIcon,
  SettingsIcon,
  ViewIcon,
  WarningIcon,
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
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

// Enhanced Database Service
import { AssetsService, EmployeeService } from "../lib/database/services";

// Types
interface Asset {
  id: string;
  name: string;
  asset_tag: string;
  category: string;
  type: string;
  serial_number?: string;
  manufacturer?: string;
  model?: string;
  purchase_date?: string;
  purchase_price?: number;
  warranty_expiry?: string;
  status: string;
  condition: string;
  location?: string;
  assigned_to?: string;
  assigned_date?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  employee?: any;
}

interface AssetFormData {
  name: string;
  asset_tag: string;
  category: string;
  type: string;
  serial_number: string;
  manufacturer: string;
  model: string;
  purchase_date: string;
  purchase_price: number;
  warranty_expiry: string;
  status: string;
  condition: string;
  location: string;
  assigned_to: string;
  notes: string;
}

const AssetsEnhanced: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.900");

  // State
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
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

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState<AssetFormData>({
    name: "",
    asset_tag: "",
    category: "",
    type: "",
    serial_number: "",
    manufacturer: "",
    model: "",
    purchase_date: "",
    purchase_price: 0,
    warranty_expiry: "",
    status: "available",
    condition: "new",
    location: "",
    assigned_to: "",
    notes: "",
  });

  const deleteRef = React.useRef<HTMLButtonElement>(null);

  // Status colors
  const statusColors: Record<string, string> = {
    available: "green",
    assigned: "blue",
    maintenance: "yellow",
    retired: "gray",
    lost: "red",
    damaged: "orange",
  };

  // Condition colors
  const conditionColors: Record<string, string> = {
    new: "green",
    excellent: "blue",
    good: "cyan",
    fair: "yellow",
    poor: "orange",
    damaged: "red",
  };

  // Asset categories
  const categories = [
    "IT Equipment",
    "Office Furniture",
    "Vehicles",
    "Machinery",
    "Tools",
    "Software",
    "Mobile Devices",
    "Audio/Visual",
    "Safety Equipment",
    "Other",
  ];

  // Asset statuses
  const statuses = [
    { value: "available", label: "Available" },
    { value: "assigned", label: "Assigned" },
    { value: "maintenance", label: "Maintenance" },
    { value: "retired", label: "Retired" },
    { value: "lost", label: "Lost" },
    { value: "damaged", label: "Damaged" },
  ];

  // Asset conditions
  const conditions = [
    { value: "new", label: "New" },
    { value: "excellent", label: "Excellent" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" },
    { value: "damaged", label: "Damaged" },
  ];

  // Load data
  const loadAssets = useCallback(async () => {
    try {
      setLoading(true);

      const response = await AssetsService.getAll({
        page: currentPage,
        limit: 12,
        orderBy: "created_at",
        ascending: false,
      });

      if (response.success && response.data) {
        setAssets(response.data);
        setTotalPages(Math.ceil((response.count || 0) / 12));
      } else {
        // Fallback to mock data for development
        const mockAssets: Asset[] = [
          {
            id: "1",
            name: "MacBook Pro 16-inch",
            asset_tag: "COMP-001",
            category: "IT Equipment",
            type: "Laptop",
            serial_number: "MBP16-2024-001",
            manufacturer: "Apple",
            model: "MacBook Pro 16-inch M3",
            purchase_date: "2024-01-15",
            purchase_price: 3499,
            warranty_expiry: "2027-01-15",
            status: "assigned",
            condition: "excellent",
            location: "Engineering Dept",
            assigned_to: "emp1",
            assigned_date: "2024-01-20",
            notes: "Primary development machine",
            created_at: new Date().toISOString(),
            employee: {
              id: "emp1",
              name: "Sarah Johnson",
              email: "sarah.johnson@company.com",
              department: "Engineering",
            },
          },
          {
            id: "2",
            name: "Dell Monitor 27-inch",
            asset_tag: "MON-002",
            category: "IT Equipment",
            type: "Monitor",
            serial_number: "DEL27-2024-002",
            manufacturer: "Dell",
            model: "UltraSharp U2723QE",
            purchase_date: "2024-02-01",
            purchase_price: 599,
            warranty_expiry: "2027-02-01",
            status: "available",
            condition: "new",
            location: "Storage Room A",
            notes: "Backup monitor for engineering team",
            created_at: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
          {
            id: "3",
            name: "Office Chair - Ergonomic",
            asset_tag: "FURN-003",
            category: "Office Furniture",
            type: "Chair",
            manufacturer: "Herman Miller",
            model: "Aeron Chair",
            purchase_date: "2023-12-15",
            purchase_price: 1395,
            warranty_expiry: "2035-12-15",
            status: "assigned",
            condition: "good",
            location: "Office Floor 2",
            assigned_to: "emp2",
            assigned_date: "2023-12-20",
            notes: "Executive office chair",
            created_at: new Date(
              Date.now() - 14 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            employee: {
              id: "emp2",
              name: "Michael Chen",
              email: "michael.chen@company.com",
              department: "Product",
            },
          },
          {
            id: "4",
            name: "iPhone 15 Pro",
            asset_tag: "MOB-004",
            category: "Mobile Devices",
            type: "Smartphone",
            serial_number: "IP15-2024-004",
            manufacturer: "Apple",
            model: "iPhone 15 Pro 256GB",
            purchase_date: "2024-03-01",
            purchase_price: 999,
            warranty_expiry: "2025-03-01",
            status: "maintenance",
            condition: "fair",
            location: "IT Service Center",
            notes: "Screen replacement in progress",
            created_at: new Date(
              Date.now() - 21 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
        ];

        setAssets(mockAssets);
        setTotalPages(1);

        toast({
          title: "Using Demo Data",
          description: "Connected to mock data for development",
          status: "info",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error loading assets:", error);
      toast({
        title: "Error",
        description: "Failed to load assets",
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

  const loadStats = useCallback(async () => {
    try {
      // Calculate stats from current assets
      const stats = {
        total: assets.length,
        available: assets.filter((a) => a.status === "available").length,
        assigned: assets.filter((a) => a.status === "assigned").length,
        maintenance: assets.filter((a) => a.status === "maintenance").length,
        total_value: assets.reduce(
          (sum, a) => sum + (a.purchase_price || 0),
          0,
        ),
        categories: [...new Set(assets.map((a) => a.category))].length,
      };
      setStats(stats);
    } catch (error) {
      console.error("Error calculating stats:", error);
    }
  }, [assets]);

  useEffect(() => {
    loadAssets();
    loadEmployees();
  }, [loadAssets, loadEmployees]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Filter assets
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.asset_tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.serial_number || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (asset.manufacturer || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (asset.model || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || asset.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || asset.status === statusFilter;
    const matchesCondition =
      conditionFilter === "all" || asset.condition === conditionFilter;

    return (
      matchesSearch && matchesCategory && matchesStatus && matchesCondition
    );
  });

  // Handlers
  const handleCreateAsset = async () => {
    try {
      const response = await AssetsService.create(formData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Asset created successfully",
          status: "success",
          duration: 3000,
        });
        onCreateClose();
        resetForm();
        loadAssets();
      } else {
        throw new Error(response.error || "Failed to create asset");
      }
    } catch (error) {
      console.error("Error creating asset:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create asset",
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleUpdateAsset = async () => {
    if (!selectedAsset) return;

    try {
      const response = await AssetsService.update(selectedAsset.id, formData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Asset updated successfully",
          status: "success",
          duration: 3000,
        });
        onEditClose();
        resetForm();
        loadAssets();
      } else {
        throw new Error(response.error || "Failed to update asset");
      }
    } catch (error) {
      console.error("Error updating asset:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update asset",
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleDeleteAsset = async () => {
    if (!selectedAsset) return;

    try {
      const response = await AssetsService.delete(selectedAsset.id);

      if (response.success) {
        toast({
          title: "Success",
          description: "Asset deleted successfully",
          status: "success",
          duration: 3000,
        });
        onDeleteClose();
        setSelectedAsset(null);
        loadAssets();
      } else {
        throw new Error(response.error || "Failed to delete asset");
      }
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete asset",
        status: "error",
        duration: 5000,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      asset_tag: "",
      category: "",
      type: "",
      serial_number: "",
      manufacturer: "",
      model: "",
      purchase_date: "",
      purchase_price: 0,
      warranty_expiry: "",
      status: "available",
      condition: "new",
      location: "",
      assigned_to: "",
      notes: "",
    });
  };

  const openEditModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setFormData({
      name: asset.name,
      asset_tag: asset.asset_tag,
      category: asset.category,
      type: asset.type,
      serial_number: asset.serial_number || "",
      manufacturer: asset.manufacturer || "",
      model: asset.model || "",
      purchase_date: asset.purchase_date || "",
      purchase_price: asset.purchase_price || 0,
      warranty_expiry: asset.warranty_expiry || "",
      status: asset.status,
      condition: asset.condition,
      location: asset.location || "",
      assigned_to: asset.assigned_to || "",
      notes: asset.notes || "",
    });
    onEditOpen();
  };

  const openViewModal = (asset: Asset) => {
    setSelectedAsset(asset);
    onViewOpen();
  };

  const openDeleteDialog = (asset: Asset) => {
    setSelectedAsset(asset);
    onDeleteOpen();
  };

  const isWarrantyExpiring = (warrantyDate: string): boolean => {
    if (!warrantyDate) return false;
    const warranty = new Date(warrantyDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return warranty <= threeMonthsFromNow;
  };

  return (
    <>
      <Head>
        <title>Asset Management - Enhanced | HR Portal</title>
        <meta
          name="description"
          content="Enhanced asset management with full CRUD operations and lifecycle tracking"
        />
      </Head>

      <Container maxW="8xl" py={8}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="lg" color="blue.600">
              Asset Management
            </Heading>
            <Text color="gray.600" mt={2}>
              Track and manage company assets, equipment, and resources
            </Text>
          </Box>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onCreateOpen}
            size="lg"
          >
            Add Asset
          </Button>
        </Flex>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} mb={8}>
          <Stat>
            <StatLabel>Total Assets</StatLabel>
            <StatNumber color="blue.500">{stats.total || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Available</StatLabel>
            <StatNumber color="green.500">{stats.available || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Assigned</StatLabel>
            <StatNumber color="blue.500">{stats.assigned || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Maintenance</StatLabel>
            <StatNumber color="yellow.500">{stats.maintenance || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Total Value</StatLabel>
            <StatNumber color="purple.500">
              ${(stats.total_value || 0).toLocaleString()}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Categories</StatLabel>
            <StatNumber color="cyan.500">{stats.categories || 0}</StatNumber>
          </Stat>
        </SimpleGrid>

        {/* Filters */}
        <Card bg={cardBg} mb={6}>
          <CardBody>
            <Grid
              templateColumns={{ base: "1fr", md: "2fr 1fr 1fr 1fr" }}
              gap={4}
            >
              <InputGroup>
                <InputLeftElement>
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </Select>
              <Select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
              >
                <option value="all">All Conditions</option>
                {conditions.map((condition) => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </Select>
            </Grid>
          </CardBody>
        </Card>

        {/* Assets Grid */}
        {loading ? (
          <Flex justify="center" align="center" height="400px">
            <VStack>
              <Spinner size="xl" color="blue.500" />
              <Text>Loading assets...</Text>
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
              {filteredAssets.map((asset) => (
                <Card
                  key={asset.id}
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  position="relative"
                >
                  {asset.warranty_expiry &&
                    isWarrantyExpiring(asset.warranty_expiry) && (
                      <Box position="absolute" top={2} right={2} zIndex={1}>
                        <Badge colorScheme="orange" variant="solid">
                          <WarningIcon mr={1} />
                          Warranty Expiring
                        </Badge>
                      </Box>
                    )}
                  <CardHeader pb={2}>
                    <Flex justify="space-between" align="start">
                      <VStack align="start" spacing={1}>
                        <Heading size="md">{asset.name}</Heading>
                        <Text fontSize="sm" color="gray.600">
                          {asset.asset_tag} • {asset.category}
                        </Text>
                        <HStack>
                          <Badge colorScheme={statusColors[asset.status]}>
                            {asset.status.toUpperCase()}
                          </Badge>
                          <Badge
                            variant="outline"
                            colorScheme={conditionColors[asset.condition]}
                          >
                            {asset.condition.toUpperCase()}
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
                          <MenuItem
                            icon={<ViewIcon />}
                            onClick={() => openViewModal(asset)}
                          >
                            View Details
                          </MenuItem>
                          <MenuItem
                            icon={<EditIcon />}
                            onClick={() => openEditModal(asset)}
                          >
                            Edit Asset
                          </MenuItem>
                          <MenuDivider />
                          <MenuItem
                            icon={<SettingsIcon />}
                            onClick={() => {
                              /* Handle maintenance */
                            }}
                          >
                            Maintenance Log
                          </MenuItem>
                          <MenuDivider />
                          <MenuItem
                            icon={<DeleteIcon />}
                            onClick={() => openDeleteDialog(asset)}
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
                      {asset.manufacturer && asset.model && (
                        <Text fontSize="sm" color="gray.600">
                          {asset.manufacturer} {asset.model}
                        </Text>
                      )}

                      {asset.serial_number && (
                        <HStack>
                          <Text fontSize="sm" fontWeight="medium">
                            S/N:
                          </Text>
                          <Text fontSize="sm">{asset.serial_number}</Text>
                        </HStack>
                      )}

                      {asset.purchase_price && (
                        <HStack>
                          <Text fontSize="sm" fontWeight="medium">
                            Value:
                          </Text>
                          <Text fontSize="sm" color="green.600">
                            ${asset.purchase_price.toLocaleString()}
                          </Text>
                        </HStack>
                      )}

                      {asset.location && (
                        <HStack>
                          <InfoIcon color="gray.500" />
                          <Text fontSize="sm">{asset.location}</Text>
                        </HStack>
                      )}

                      {asset.assigned_to && asset.employee && (
                        <HStack>
                          <Text fontSize="sm">
                            Assigned to <strong>{asset.employee.name}</strong>
                          </Text>
                        </HStack>
                      )}

                      {asset.purchase_date && (
                        <HStack>
                          <CalendarIcon color="gray.500" />
                          <Text fontSize="sm">
                            Purchased{" "}
                            {format(
                              new Date(asset.purchase_date),
                              "MMM d, yyyy",
                            )}
                          </Text>
                        </HStack>
                      )}

                      {asset.warranty_expiry && (
                        <HStack>
                          <Text fontSize="sm" color="gray.500">
                            Warranty expires{" "}
                            {format(
                              new Date(asset.warranty_expiry),
                              "MMM d, yyyy",
                            )}
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
          size="2xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {isCreateOpen ? "Add New Asset" : "Edit Asset"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Asset Name</FormLabel>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="MacBook Pro 16-inch"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Asset Tag</FormLabel>
                    <Input
                      value={formData.asset_tag}
                      onChange={(e) =>
                        setFormData({ ...formData, asset_tag: e.target.value })
                      }
                      placeholder="COMP-001"
                    />
                  </FormControl>
                </Grid>

                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Type</FormLabel>
                    <Input
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      placeholder="Laptop"
                    />
                  </FormControl>
                </Grid>

                <Grid templateColumns="1fr 1fr 1fr" gap={4} w="full">
                  <FormControl>
                    <FormLabel>Manufacturer</FormLabel>
                    <Input
                      value={formData.manufacturer}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          manufacturer: e.target.value,
                        })
                      }
                      placeholder="Apple"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Model</FormLabel>
                    <Input
                      value={formData.model}
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                      placeholder="MacBook Pro M3"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Serial Number</FormLabel>
                    <Input
                      value={formData.serial_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          serial_number: e.target.value,
                        })
                      }
                      placeholder="MBP16-2024-001"
                    />
                  </FormControl>
                </Grid>

                <Grid templateColumns="1fr 1fr 1fr" gap={4} w="full">
                  <FormControl>
                    <FormLabel>Purchase Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          purchase_date: e.target.value,
                        })
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Purchase Price</FormLabel>
                    <NumberInput
                      value={formData.purchase_price}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          purchase_price: Number(value),
                        })
                      }
                    >
                      <NumberInputField placeholder="0" />
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Warranty Expiry</FormLabel>
                    <Input
                      type="date"
                      value={formData.warranty_expiry}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          warranty_expiry: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid templateColumns="1fr 1fr 1fr" gap={4} w="full">
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Condition</FormLabel>
                    <Select
                      value={formData.condition}
                      onChange={(e) =>
                        setFormData({ ...formData, condition: e.target.value })
                      }
                    >
                      {conditions.map((condition) => (
                        <option key={condition.value} value={condition.value}>
                          {condition.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Location</FormLabel>
                    <Input
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="Office Floor 2"
                    />
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel>Assigned To</FormLabel>
                  <Select
                    value={formData.assigned_to}
                    onChange={(e) =>
                      setFormData({ ...formData, assigned_to: e.target.value })
                    }
                  >
                    <option value="">Not Assigned</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} - {emp.department}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Notes</FormLabel>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Additional notes about this asset..."
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
                onClick={isCreateOpen ? handleCreateAsset : handleUpdateAsset}
                isDisabled={
                  !formData.name || !formData.asset_tag || !formData.category
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
            <ModalHeader>Asset Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedAsset && (
                <VStack align="start" spacing={4}>
                  <Grid templateColumns="1fr 1fr" gap={6} w="full">
                    <VStack align="start" spacing={3}>
                      <Text fontWeight="bold">Asset Information</Text>
                      <Text>Name: {selectedAsset.name}</Text>
                      <Text>Tag: {selectedAsset.asset_tag}</Text>
                      <Text>Category: {selectedAsset.category}</Text>
                      <Text>Type: {selectedAsset.type}</Text>
                      {selectedAsset.serial_number && (
                        <Text>Serial: {selectedAsset.serial_number}</Text>
                      )}
                      <HStack>
                        <Text>Status:</Text>
                        <Badge colorScheme={statusColors[selectedAsset.status]}>
                          {selectedAsset.status.toUpperCase()}
                        </Badge>
                      </HStack>
                      <HStack>
                        <Text>Condition:</Text>
                        <Badge
                          colorScheme={conditionColors[selectedAsset.condition]}
                        >
                          {selectedAsset.condition.toUpperCase()}
                        </Badge>
                      </HStack>
                    </VStack>

                    <VStack align="start" spacing={3}>
                      <Text fontWeight="bold">Purchase Details</Text>
                      {selectedAsset.manufacturer && (
                        <Text>Manufacturer: {selectedAsset.manufacturer}</Text>
                      )}
                      {selectedAsset.model && (
                        <Text>Model: {selectedAsset.model}</Text>
                      )}
                      {selectedAsset.purchase_date && (
                        <Text>
                          Purchased:{" "}
                          {format(
                            new Date(selectedAsset.purchase_date),
                            "MMM d, yyyy",
                          )}
                        </Text>
                      )}
                      {selectedAsset.purchase_price && (
                        <Text>
                          Price: $
                          {selectedAsset.purchase_price.toLocaleString()}
                        </Text>
                      )}
                      {selectedAsset.warranty_expiry && (
                        <Text>
                          Warranty:{" "}
                          {format(
                            new Date(selectedAsset.warranty_expiry),
                            "MMM d, yyyy",
                          )}
                        </Text>
                      )}
                    </VStack>
                  </Grid>

                  <Divider />

                  {selectedAsset.location && (
                    <>
                      <Text fontWeight="bold">Location</Text>
                      <Text>{selectedAsset.location}</Text>
                    </>
                  )}

                  {selectedAsset.assigned_to && selectedAsset.employee && (
                    <>
                      <Text fontWeight="bold">Assignment</Text>
                      <Text>Assigned to: {selectedAsset.employee.name}</Text>
                      <Text>
                        Department: {selectedAsset.employee.department}
                      </Text>
                      {selectedAsset.assigned_date && (
                        <Text>
                          Assigned:{" "}
                          {format(
                            new Date(selectedAsset.assigned_date),
                            "MMM d, yyyy",
                          )}
                        </Text>
                      )}
                    </>
                  )}

                  {selectedAsset.notes && (
                    <>
                      <Divider />
                      <Text fontWeight="bold">Notes</Text>
                      <Text>{selectedAsset.notes}</Text>
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

        {/* Delete Confirmation */}
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={deleteRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Asset
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete the asset{" "}
                <strong>{selectedAsset?.name}</strong> (
                {selectedAsset?.asset_tag})? This action cannot be undone.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={deleteRef} onClick={onDeleteClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleDeleteAsset} ml={3}>
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

export default AssetsEnhanced;
