import {
  AddIcon,
  AttachmentIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  InfoIcon,
  SearchIcon,
  TimeIcon,
  ViewIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import {
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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagLabel,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

// Types
interface ComplianceDocument {
  id: string;
  title: string;
  category: string;
  type: string;
  version: string;
  description: string;
  file_path?: string;
  file_size?: number;
  file_type?: string;
  status: string;
  owner_id: string;
  department: string;
  compliance_area: string;
  effective_date: string;
  expiry_date?: string;
  review_date?: string;
  last_reviewed?: string;
  approval_status: string;
  approved_by?: string;
  approval_date?: string;
  mandatory: boolean;
  created_at: string;
  updated_at?: string;
  tags?: string[];
  related_regulations?: string[];
  audit_trail?: AuditEntry[];
}

interface CompliancePolicy {
  id: string;
  title: string;
  description: string;
  category: string;
  compliance_framework: string;
  status: string;
  priority: string;
  owner_id: string;
  department: string;
  effective_date: string;
  review_frequency: string;
  next_review_date: string;
  last_updated: string;
  approved_by?: string;
  approval_date?: string;
  mandatory_training: boolean;
  related_documents?: string[];
  requirements?: PolicyRequirement[];
  audit_schedule?: string;
}

interface PolicyRequirement {
  id: string;
  title: string;
  description: string;
  compliance_level: string;
  due_date?: string;
  assigned_to?: string;
  status: string;
  evidence_required: boolean;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  user_id: string;
  user_name: string;
  details: string;
  old_values?: any;
  new_values?: any;
}

interface ComplianceFormData {
  title: string;
  category: string;
  type: string;
  description: string;
  department: string;
  compliance_area: string;
  effective_date: string;
  expiry_date: string;
  mandatory: boolean;
  tags: string;
}

const ComplianceEnhanced: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.900");

  // State
  const [documents, setDocuments] = useState<ComplianceDocument[]>([]);
  const [policies, setPolicies] = useState<CompliancePolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<any>({});
  const [activeTab, setActiveTab] = useState(0);

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

  const [selectedDocument, setSelectedDocument] =
    useState<ComplianceDocument | null>(null);
  const [formData, setFormData] = useState<ComplianceFormData>({
    title: "",
    category: "",
    type: "",
    description: "",
    department: "",
    compliance_area: "",
    effective_date: "",
    expiry_date: "",
    mandatory: false,
    tags: "",
  });

  const deleteRef = React.useRef<HTMLButtonElement>(null);

  // Status colors
  const statusColors: Record<string, string> = {
    active: "green",
    draft: "blue",
    under_review: "yellow",
    expired: "red",
    archived: "gray",
    pending_approval: "orange",
  };

  // Priority colors
  const priorityColors: Record<string, string> = {
    low: "green",
    medium: "yellow",
    high: "orange",
    critical: "red",
  };

  // Categories
  const documentCategories = [
    "Policy",
    "Procedure",
    "Form",
    "Contract",
    "Certificate",
    "Training Material",
    "Regulation",
    "Audit Report",
    "Risk Assessment",
    "Incident Report",
  ];

  const complianceAreas = [
    "Data Protection (GDPR)",
    "Health & Safety (OSHA)",
    "Employment Law",
    "Financial Compliance (SOX)",
    "Environmental (ISO 14001)",
    "Quality Management (ISO 9001)",
    "Information Security (ISO 27001)",
    "Anti-Bribery & Corruption",
    "Equal Opportunity",
    "Workplace Safety",
  ];

  const departments = [
    "Human Resources",
    "Legal",
    "Finance",
    "IT Security",
    "Operations",
    "Quality Assurance",
    "Risk Management",
    "Compliance",
    "Audit",
  ];

  // Load data
  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);

      // Mock compliance documents data for development
      const mockDocuments: ComplianceDocument[] = [
        {
          id: "doc1",
          title: "GDPR Data Protection Policy",
          category: "Policy",
          type: "Regulatory Policy",
          version: "2.1",
          description:
            "Comprehensive data protection policy compliance with GDPR regulations",
          status: "active",
          owner_id: "emp1",
          department: "Legal",
          compliance_area: "Data Protection (GDPR)",
          effective_date: "2024-01-01",
          expiry_date: "2025-01-01",
          review_date: "2024-07-01",
          last_reviewed: "2024-06-15",
          approval_status: "approved",
          approved_by: "Legal Director",
          approval_date: "2023-12-20",
          mandatory: true,
          created_at: new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          tags: ["GDPR", "Data Protection", "Privacy", "Mandatory"],
          related_regulations: ["GDPR Article 5", "GDPR Article 6"],
          file_path: "/documents/gdpr-policy-v2.1.pdf",
          file_size: 2048576,
          file_type: "application/pdf",
        },
        {
          id: "doc2",
          title: "Workplace Safety Procedures",
          category: "Procedure",
          type: "Safety Manual",
          version: "1.5",
          description:
            "Standard operating procedures for workplace safety and emergency response",
          status: "active",
          owner_id: "emp2",
          department: "Human Resources",
          compliance_area: "Health & Safety (OSHA)",
          effective_date: "2024-03-01",
          review_date: "2024-12-01",
          approval_status: "approved",
          approved_by: "HR Director",
          approval_date: "2024-02-20",
          mandatory: true,
          created_at: new Date(
            Date.now() - 60 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          tags: ["Safety", "Emergency", "OSHA", "Mandatory"],
          related_regulations: ["OSHA 1926", "OSHA 1910"],
          file_path: "/documents/safety-procedures-v1.5.pdf",
          file_size: 5242880,
          file_type: "application/pdf",
        },
        {
          id: "doc3",
          title: "Code of Conduct",
          category: "Policy",
          type: "Corporate Policy",
          version: "3.0",
          description: "Employee code of conduct and ethical guidelines",
          status: "under_review",
          owner_id: "emp3",
          department: "Human Resources",
          compliance_area: "Employment Law",
          effective_date: "2024-06-01",
          review_date: "2024-12-15",
          approval_status: "pending_approval",
          mandatory: true,
          created_at: new Date(
            Date.now() - 15 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          tags: ["Ethics", "Conduct", "Employee Relations"],
          file_path: "/documents/code-of-conduct-v3.0-draft.pdf",
          file_size: 1024000,
          file_type: "application/pdf",
        },
        {
          id: "doc4",
          title: "Financial Controls Assessment",
          category: "Audit Report",
          type: "SOX Compliance Report",
          version: "Q4-2024",
          description:
            "Quarterly financial controls assessment for SOX compliance",
          status: "draft",
          owner_id: "emp4",
          department: "Finance",
          compliance_area: "Financial Compliance (SOX)",
          effective_date: "2024-10-01",
          review_date: "2025-01-15",
          approval_status: "pending_approval",
          mandatory: false,
          created_at: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          tags: ["SOX", "Financial Controls", "Audit", "Quarterly"],
          related_regulations: ["SOX Section 302", "SOX Section 404"],
          file_path: "/documents/sox-assessment-q4-2024.xlsx",
          file_size: 512000,
          file_type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        {
          id: "doc5",
          title: "Cybersecurity Training Certificate",
          category: "Certificate",
          type: "Training Completion",
          version: "2024",
          description:
            "Annual cybersecurity awareness training completion certificate",
          status: "active",
          owner_id: "emp5",
          department: "IT Security",
          compliance_area: "Information Security (ISO 27001)",
          effective_date: "2024-01-15",
          expiry_date: "2025-01-15",
          approval_status: "approved",
          approved_by: "CISO",
          approval_date: "2024-01-10",
          mandatory: true,
          created_at: new Date(
            Date.now() - 45 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          tags: ["Cybersecurity", "Training", "ISO 27001", "Certificate"],
          file_path: "/documents/cybersecurity-cert-2024.pdf",
          file_size: 256000,
          file_type: "application/pdf",
        },
      ];

      setDocuments(mockDocuments);
      setTotalPages(1);

      toast({
        title: "Using Demo Data",
        description: "Connected to mock compliance data for development",
        status: "info",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error loading documents:", error);
      toast({
        title: "Error",
        description: "Failed to load compliance documents",
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, toast]);

  const loadStats = useCallback(async () => {
    try {
      // Calculate stats from current documents
      const today = new Date();
      const expiringDocuments = documents.filter((doc) => {
        if (!doc.expiry_date) return false;
        const expiryDate = new Date(doc.expiry_date);
        const thirtyDaysFromNow = new Date(
          today.getTime() + 30 * 24 * 60 * 60 * 1000,
        );
        return (
          isAfter(expiryDate, today) && isBefore(expiryDate, thirtyDaysFromNow)
        );
      });

      const reviewNeeded = documents.filter((doc) => {
        if (!doc.review_date) return false;
        const reviewDate = new Date(doc.review_date);
        return isBefore(reviewDate, today);
      });

      const stats = {
        total_documents: documents.length,
        active: documents.filter((doc) => doc.status === "active").length,
        draft: documents.filter((doc) => doc.status === "draft").length,
        under_review: documents.filter((doc) => doc.status === "under_review")
          .length,
        expired: documents.filter((doc) => doc.status === "expired").length,
        pending_approval: documents.filter(
          (doc) => doc.approval_status === "pending_approval",
        ).length,
        mandatory: documents.filter((doc) => doc.mandatory).length,
        expiring_soon: expiringDocuments.length,
        review_needed: reviewNeeded.length,
        compliance_rate:
          documents.length > 0
            ? (documents.filter(
                (doc) =>
                  doc.status === "active" && doc.approval_status === "approved",
              ).length /
                documents.length) *
              100
            : 0,
      };
      setStats(stats);
    } catch (error) {
      console.error("Error calculating stats:", error);
    }
  }, [documents]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.compliance_area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesCategory =
      categoryFilter === "all" || doc.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handlers
  const handleCreateDocument = async () => {
    try {
      // Mock document creation
      const newDocument: ComplianceDocument = {
        id: `doc_${Date.now()}`,
        ...formData,
        version: "1.0",
        status: "draft",
        owner_id: "current_user",
        approval_status: "pending_approval",
        created_at: new Date().toISOString(),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      setDocuments((prev) => [newDocument, ...prev]);

      toast({
        title: "Success",
        description: "Compliance document created successfully",
        status: "success",
        duration: 3000,
      });
      onCreateClose();
      resetForm();
    } catch (error) {
      console.error("Error creating document:", error);
      toast({
        title: "Error",
        description: "Failed to create compliance document",
        status: "error",
        duration: 5000,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      type: "",
      description: "",
      department: "",
      compliance_area: "",
      effective_date: "",
      expiry_date: "",
      mandatory: false,
      tags: "",
    });
  };

  const openViewModal = (document: ComplianceDocument) => {
    setSelectedDocument(document);
    onViewOpen();
  };

  const getFileIcon = (fileType?: string): React.ReactNode => {
    if (!fileType) return <AttachmentIcon />;
    if (fileType.includes("pdf")) return <AttachmentIcon color="red.500" />;
    if (fileType.includes("excel") || fileType.includes("spreadsheet"))
      return <AttachmentIcon color="green.500" />;
    if (fileType.includes("word") || fileType.includes("document"))
      return <AttachmentIcon color="blue.500" />;
    return <AttachmentIcon />;
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "Unknown size";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const isExpiringSoon = (document: ComplianceDocument): boolean => {
    if (!document.expiry_date) return false;
    const today = new Date();
    const expiryDate = new Date(document.expiry_date);
    const thirtyDaysFromNow = new Date(
      today.getTime() + 30 * 24 * 60 * 60 * 1000,
    );
    return (
      isAfter(expiryDate, today) && isBefore(expiryDate, thirtyDaysFromNow)
    );
  };

  const isReviewNeeded = (document: ComplianceDocument): boolean => {
    if (!document.review_date) return false;
    const today = new Date();
    const reviewDate = new Date(document.review_date);
    return isBefore(reviewDate, today);
  };

  return (
    <>
      <Head>
        <title>Compliance & Document Management - Enhanced | HR Portal</title>
        <meta
          name="description"
          content="Enhanced compliance and document management with policy tracking and audit trails"
        />
      </Head>

      <Container maxW="8xl" py={8}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="lg" color="blue.600">
              Compliance & Document Management
            </Heading>
            <Text color="gray.600" mt={2}>
              Manage policies, documents, and regulatory compliance requirements
            </Text>
          </Box>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onCreateOpen}
            size="lg"
          >
            New Document
          </Button>
        </Flex>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 4, lg: 8 }} spacing={4} mb={8}>
          <Stat>
            <StatLabel>Total Documents</StatLabel>
            <StatNumber color="blue.500">
              {stats.total_documents || 0}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Active</StatLabel>
            <StatNumber color="green.500">{stats.active || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Under Review</StatLabel>
            <StatNumber color="yellow.500">
              {stats.under_review || 0}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Pending Approval</StatLabel>
            <StatNumber color="orange.500">
              {stats.pending_approval || 0}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Mandatory</StatLabel>
            <StatNumber color="purple.500">{stats.mandatory || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Expiring Soon</StatLabel>
            <StatNumber color="red.500">{stats.expiring_soon || 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Review Needed</StatLabel>
            <StatNumber color="orange.500">
              {stats.review_needed || 0}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Compliance Rate</StatLabel>
            <StatNumber color="green.500">
              {(stats.compliance_rate || 0).toFixed(0)}%
            </StatNumber>
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
                  placeholder="Search documents, policies, and compliance areas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                title="Filter by category"
              >
                <option value="all">All Categories</option>
                {documentCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                title="Filter by status"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="under_review">Under Review</option>
                <option value="expired">Expired</option>
                <option value="archived">Archived</option>
              </Select>
            </Grid>
          </CardBody>
        </Card>

        {/* Documents Grid */}
        {loading ? (
          <Flex justify="center" align="center" height="400px">
            <VStack>
              <Spinner size="xl" color="blue.500" />
              <Text>Loading compliance documents...</Text>
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
            {filteredDocuments.map((document) => (
              <Card
                key={document.id}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                position="relative"
              >
                {(isExpiringSoon(document) || isReviewNeeded(document)) && (
                  <Box position="absolute" top={2} right={2} zIndex={1}>
                    <Badge colorScheme="red" variant="solid">
                      <WarningIcon mr={1} />
                      {isExpiringSoon(document)
                        ? "Expiring Soon"
                        : "Review Needed"}
                    </Badge>
                  </Box>
                )}
                <CardHeader pb={2}>
                  <Flex justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <Heading
                        size="md"
                        pr={
                          isExpiringSoon(document) || isReviewNeeded(document)
                            ? 24
                            : 0
                        }
                      >
                        {document.title}
                      </Heading>
                      <Text fontSize="sm" color="gray.600">
                        {document.category} • {document.compliance_area}
                      </Text>
                      <HStack>
                        <Badge colorScheme={statusColors[document.status]}>
                          {document.status.replace("_", " ").toUpperCase()}
                        </Badge>
                        <Badge
                          colorScheme={
                            document.approval_status === "approved"
                              ? "green"
                              : "orange"
                          }
                          variant="outline"
                        >
                          {document.approval_status
                            .replace("_", " ")
                            .toUpperCase()}
                        </Badge>
                        {document.mandatory && (
                          <Tag size="sm" colorScheme="red">
                            <TagLabel>Mandatory</TagLabel>
                          </Tag>
                        )}
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
                          onClick={() => openViewModal(document)}
                        >
                          View Details
                        </MenuItem>
                        <MenuItem icon={<EditIcon />}>Edit Document</MenuItem>
                        <MenuItem icon={<DownloadIcon />}>Download</MenuItem>
                        <MenuDivider />
                        <MenuItem icon={<CheckIcon />} color="green.500">
                          Approve
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem icon={<DeleteIcon />} color="red.500">
                          Archive
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack align="start" spacing={3}>
                    <Text fontSize="sm" color="gray.600" noOfLines={3}>
                      {document.description}
                    </Text>

                    <HStack>
                      <CalendarIcon color="gray.500" />
                      <Text fontSize="sm">
                        Effective:{" "}
                        {format(
                          new Date(document.effective_date),
                          "MMM d, yyyy",
                        )}
                      </Text>
                    </HStack>

                    {document.expiry_date && (
                      <HStack>
                        <TimeIcon color="gray.500" />
                        <Text fontSize="sm">
                          Expires:{" "}
                          {format(
                            new Date(document.expiry_date),
                            "MMM d, yyyy",
                          )}
                        </Text>
                      </HStack>
                    )}

                    {document.review_date && (
                      <HStack>
                        <InfoIcon color="gray.500" />
                        <Text fontSize="sm">
                          Review Due:{" "}
                          {format(
                            new Date(document.review_date),
                            "MMM d, yyyy",
                          )}
                        </Text>
                      </HStack>
                    )}

                    <Text fontSize="sm">
                      <strong>Department:</strong> {document.department}
                    </Text>

                    <Text fontSize="sm">
                      <strong>Version:</strong> {document.version}
                    </Text>

                    {document.file_path && (
                      <HStack>
                        {getFileIcon(document.file_type)}
                        <Text fontSize="sm" color="blue.500">
                          {formatFileSize(document.file_size)}
                        </Text>
                      </HStack>
                    )}

                    {/* Tags */}
                    {document.tags && document.tags.length > 0 && (
                      <HStack flexWrap="wrap" spacing={1}>
                        {document.tags.slice(0, 3).map((tag, index) => (
                          <Tag key={index} size="sm" variant="outline">
                            <TagLabel>{tag}</TagLabel>
                          </Tag>
                        ))}
                        {document.tags.length > 3 && (
                          <Text fontSize="xs" color="gray.400">
                            +{document.tags.length - 3} more
                          </Text>
                        )}
                      </HStack>
                    )}

                    <Text fontSize="xs" color="gray.500">
                      Created{" "}
                      {formatDistanceToNow(new Date(document.created_at))} ago
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}

        {/* Create Modal */}
        <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Compliance Document</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Policy or Document Title"
                  />
                </FormControl>

                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      title="Select category"
                    >
                      <option value="">Select Category</option>
                      {documentCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Type</FormLabel>
                    <Input
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      placeholder="Document Type"
                    />
                  </FormControl>
                </Grid>

                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief description of the document"
                    rows={3}
                  />
                </FormControl>

                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Department</FormLabel>
                    <Select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      title="Select department"
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
                    <FormLabel>Compliance Area</FormLabel>
                    <Select
                      value={formData.compliance_area}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          compliance_area: e.target.value,
                        })
                      }
                      title="Select compliance area"
                    >
                      <option value="">Select Compliance Area</option>
                      {complianceAreas.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Effective Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.effective_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          effective_date: e.target.value,
                        })
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Expiry Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expiry_date: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <Input
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="GDPR, Privacy, Mandatory"
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="mandatory" mb="0">
                    Mandatory Document
                  </FormLabel>
                  <Input
                    id="mandatory"
                    type="checkbox"
                    checked={formData.mandatory}
                    onChange={(e) =>
                      setFormData({ ...formData, mandatory: e.target.checked })
                    }
                    w="auto"
                    ml={2}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={onCreateClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleCreateDocument}
                isDisabled={
                  !formData.title ||
                  !formData.category ||
                  !formData.description ||
                  !formData.department ||
                  !formData.compliance_area ||
                  !formData.effective_date
                }
              >
                Create Document
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* View Modal */}
        <Modal isOpen={isViewOpen} onClose={onViewClose} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Document Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedDocument && (
                <Tabs>
                  <TabList>
                    <Tab>Overview</Tab>
                    <Tab>Compliance</Tab>
                    <Tab>Audit Trail</Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <VStack align="start" spacing={4}>
                        <Grid templateColumns="1fr 1fr" gap={6} w="full">
                          <VStack align="start" spacing={3}>
                            <Text fontWeight="bold">Document Information</Text>
                            <Text>Title: {selectedDocument.title}</Text>
                            <Text>Category: {selectedDocument.category}</Text>
                            <Text>Type: {selectedDocument.type}</Text>
                            <Text>Version: {selectedDocument.version}</Text>
                            <Text>
                              Department: {selectedDocument.department}
                            </Text>
                            <HStack>
                              <Text>Status:</Text>
                              <Badge
                                colorScheme={
                                  statusColors[selectedDocument.status]
                                }
                              >
                                {selectedDocument.status
                                  .replace("_", " ")
                                  .toUpperCase()}
                              </Badge>
                            </HStack>
                            <HStack>
                              <Text>Mandatory:</Text>
                              <Badge
                                colorScheme={
                                  selectedDocument.mandatory ? "red" : "green"
                                }
                              >
                                {selectedDocument.mandatory ? "Yes" : "No"}
                              </Badge>
                            </HStack>
                          </VStack>

                          <VStack align="start" spacing={3}>
                            <Text fontWeight="bold">Dates & Approval</Text>
                            <Text>
                              Effective:{" "}
                              {format(
                                new Date(selectedDocument.effective_date),
                                "MMM d, yyyy",
                              )}
                            </Text>
                            {selectedDocument.expiry_date && (
                              <Text>
                                Expires:{" "}
                                {format(
                                  new Date(selectedDocument.expiry_date),
                                  "MMM d, yyyy",
                                )}
                              </Text>
                            )}
                            {selectedDocument.review_date && (
                              <Text>
                                Review Due:{" "}
                                {format(
                                  new Date(selectedDocument.review_date),
                                  "MMM d, yyyy",
                                )}
                              </Text>
                            )}
                            <HStack>
                              <Text>Approval Status:</Text>
                              <Badge
                                colorScheme={
                                  selectedDocument.approval_status ===
                                  "approved"
                                    ? "green"
                                    : "orange"
                                }
                              >
                                {selectedDocument.approval_status
                                  .replace("_", " ")
                                  .toUpperCase()}
                              </Badge>
                            </HStack>
                            {selectedDocument.approved_by && (
                              <Text>
                                Approved By: {selectedDocument.approved_by}
                              </Text>
                            )}
                          </VStack>
                        </Grid>

                        <Divider />

                        <Box w="full">
                          <Text fontWeight="bold" mb={2}>
                            Description
                          </Text>
                          <Text color="gray.600">
                            {selectedDocument.description}
                          </Text>
                        </Box>

                        {selectedDocument.tags &&
                          selectedDocument.tags.length > 0 && (
                            <Box w="full">
                              <Text fontWeight="bold" mb={2}>
                                Tags
                              </Text>
                              <HStack flexWrap="wrap" spacing={2}>
                                {selectedDocument.tags.map((tag, index) => (
                                  <Tag key={index} colorScheme="blue">
                                    <TagLabel>{tag}</TagLabel>
                                  </Tag>
                                ))}
                              </HStack>
                            </Box>
                          )}
                      </VStack>
                    </TabPanel>

                    <TabPanel>
                      <VStack align="start" spacing={4}>
                        <Text fontWeight="bold">Compliance Information</Text>
                        <Text>
                          <strong>Compliance Area:</strong>{" "}
                          {selectedDocument.compliance_area}
                        </Text>

                        {selectedDocument.related_regulations && (
                          <Box w="full">
                            <Text fontWeight="bold" mb={2}>
                              Related Regulations
                            </Text>
                            <VStack align="start" spacing={1}>
                              {selectedDocument.related_regulations.map(
                                (regulation, index) => (
                                  <Text
                                    key={index}
                                    fontSize="sm"
                                    color="blue.600"
                                  >
                                    • {regulation}
                                  </Text>
                                ),
                              )}
                            </VStack>
                          </Box>
                        )}

                        {selectedDocument.file_path && (
                          <Box w="full">
                            <Text fontWeight="bold" mb={2}>
                              File Information
                            </Text>
                            <HStack>
                              {getFileIcon(selectedDocument.file_type)}
                              <VStack align="start" spacing={0}>
                                <Text fontSize="sm">
                                  {selectedDocument.file_path.split("/").pop()}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  {formatFileSize(selectedDocument.file_size)}
                                </Text>
                              </VStack>
                            </HStack>
                          </Box>
                        )}
                      </VStack>
                    </TabPanel>

                    <TabPanel>
                      <VStack align="start" spacing={4}>
                        <Text fontWeight="bold">Document Timeline</Text>
                        <Box w="full">
                          <VStack align="start" spacing={3}>
                            <HStack>
                              <Box
                                w="3"
                                h="3"
                                bg="blue.400"
                                borderRadius="full"
                              />
                              <Text fontSize="sm">
                                Document created on{" "}
                                {format(
                                  new Date(selectedDocument.created_at),
                                  "MMM d, yyyy",
                                )}
                              </Text>
                            </HStack>
                            <HStack>
                              <Box
                                w="3"
                                h="3"
                                bg="green.400"
                                borderRadius="full"
                              />
                              <Text fontSize="sm">
                                Effective from{" "}
                                {format(
                                  new Date(selectedDocument.effective_date),
                                  "MMM d, yyyy",
                                )}
                              </Text>
                            </HStack>
                            {selectedDocument.approval_date && (
                              <HStack>
                                <Box
                                  w="3"
                                  h="3"
                                  bg="purple.400"
                                  borderRadius="full"
                                />
                                <Text fontSize="sm">
                                  Approved on{" "}
                                  {format(
                                    new Date(selectedDocument.approval_date),
                                    "MMM d, yyyy",
                                  )}
                                </Text>
                              </HStack>
                            )}
                            {selectedDocument.expiry_date && (
                              <HStack>
                                <Box
                                  w="3"
                                  h="3"
                                  bg="orange.400"
                                  borderRadius="full"
                                />
                                <Text fontSize="sm">
                                  Expires on{" "}
                                  {format(
                                    new Date(selectedDocument.expiry_date),
                                    "MMM d, yyyy",
                                  )}
                                </Text>
                              </HStack>
                            )}
                          </VStack>
                        </Box>
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onViewClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </>
  );
};

export default ComplianceEnhanced;
