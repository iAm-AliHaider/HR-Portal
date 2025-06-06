import React, { useState, useEffect } from "react";

import Head from "next/head";

import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure as useDrawerDisclosure,
} from "@chakra-ui/react";
import {
  FileText,
  Clock,
  Check,
  X,
  AlertCircle,
  Filter,
  Search,
  Plus,
  Calendar,
  Laptop,
  CreditCard,
  Briefcase,
  Book,
  HardDrive,
  FileCheck,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Download,
  MessageSquare,
  Users,
  Car,
  DollarSign,
  Heart,
} from "lucide-react";
import { GetServerSideProps } from "next";

import DynamicRequestForm from "@/components/employee/DynamicRequestForm";
import EmployeeInfoPanel from "@/components/employee/EmployeeInfoPanel";
import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion-fixed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDisclosure } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Import the new components

// Expand RequestFormData
interface RequestFormData {
  // Employee info
  employeeName?: string;
  employeeEmail?: string;
  department?: string;
  manager?: string;
  phone?: string;
  location?: string;

  // Leave request fields
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  returnDate?: string;
  totalDays?: string;
  reason?: string;
  handoverNotes?: string;

  // Equipment request fields
  equipmentType?: string;
  urgency?: string;
  specifications?: string;
  costCenter?: string;
  project?: string;

  // Generic fields
  title?: string;
  description?: string;
  dateNeeded?: string;
  priority?: string;
  attachments?: FileList | null;
  justification?: string;
  additionalApprovers?: string;
  customFields?: Record<string, string>;
  comments?: string;

  // Allow dynamic fields
  [key: string]: any;
}

interface FormErrors {
  [key: string]: string;
}

// Add interfaces for workflow and eligibility
interface WorkflowStep {
  stepNumber: number;
  stepName: string;
  approverType: string;
  approverName?: string;
  estimatedTime?: string;
  isRequired: boolean;
}

interface EligibilityRequirement {
  name: string;
  description: string;
  isMet: boolean;
  metReason?: string;
  notMetReason?: string;
}

interface RequestType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description?: string;
  fields?: string[];
  workflow?: WorkflowStep[];
  eligibility?: EligibilityRequirement[];
}

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default function RequestPanel() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = ["all", "pending", "approved", "rejected"][activeTabIndex];
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedRequestType, setSelectedRequestType] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFormData: RequestFormData = {
    employeeName: "",
    employeeEmail: "",
    department: "",
    manager: "",
    phone: "",
    location: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    returnDate: "",
    totalDays: "",
    reason: "",
    handoverNotes: "",
    equipmentType: "",
    urgency: "",
    specifications: "",
    costCenter: "",
    project: "",
    title: "",
    description: "",
    dateNeeded: "",
    priority: "",
    attachments: undefined,
    justification: "",
    additionalApprovers: "",
    customFields: {},
    comments: "",
  };
  const [formData, setFormData] = useState<RequestFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "form">("select");
  const newRequestDrawer = useDrawerDisclosure();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [showEligibility, setShowEligibility] = useState(false);
  const [eligibilityMet, setEligibilityMet] = useState(true);

  // Request types grouped by category
  const requestTypes = {
    timeAndLeave: [
      {
        id: "leave",
        name: "Leave/Time-off Request",
        icon: <Calendar className="h-4 w-4" />,
      },
      {
        id: "remote",
        name: "Remote Work Request",
        icon: <Laptop className="h-4 w-4" />,
      },
      {
        id: "overtime",
        name: "Overtime Approval",
        icon: <Clock className="h-4 w-4" />,
      },
      {
        id: "shift",
        name: "Shift Change Request",
        icon: <Clock className="h-4 w-4" />,
      },
      {
        id: "time-adjustment",
        name: "Time Adjustment Request",
        icon: <Clock className="h-4 w-4" />,
      },
      {
        id: "wfh",
        name: "Work From Home Request",
        icon: <Laptop className="h-4 w-4" />,
      },
      {
        id: "comp-off",
        name: "Compensatory Off Request",
        icon: <Calendar className="h-4 w-4" />,
      },
    ],
    financeAndBenefits: [
      {
        id: "expense",
        name: "Expense Reimbursement",
        icon: <CreditCard className="h-4 w-4" />,
      },
      {
        id: "loan",
        name: "Salary Advance/Loan Request",
        icon: <CreditCard className="h-4 w-4" />,
      },
      {
        id: "benefits",
        name: "Benefits Change Request",
        icon: <Users className="h-4 w-4" />,
      },
      {
        id: "compensation",
        name: "Compensation Review Request",
        icon: <CreditCard className="h-4 w-4" />,
      },
      {
        id: "tax",
        name: "Tax Document Request",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        id: "payslip",
        name: "Payslip Request",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        id: "salary-revision",
        name: "Salary Revision Request",
        icon: <DollarSign className="h-4 w-4" />,
      },
      {
        id: "bonus",
        name: "Bonus/Incentive Request",
        icon: <DollarSign className="h-4 w-4" />,
      },
    ],
    equipmentAndResources: [
      {
        id: "equipment",
        name: "Office Equipment Request",
        icon: <HardDrive className="h-4 w-4" />,
      },
      {
        id: "software",
        name: "Software/License Request",
        icon: <HardDrive className="h-4 w-4" />,
      },
      {
        id: "access",
        name: "Access Permission Request",
        icon: <FileCheck className="h-4 w-4" />,
      },
      {
        id: "workspace",
        name: "Workspace Modification Request",
        icon: <Briefcase className="h-4 w-4" />,
      },
      {
        id: "parking",
        name: "Parking Spot Request",
        icon: <Car className="h-4 w-4" />,
      },
      {
        id: "id-card",
        name: "ID Card Request",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        id: "stationary",
        name: "Stationary Request",
        icon: <FileText className="h-4 w-4" />,
      },
    ],
    careerAndDevelopment: [
      {
        id: "training",
        name: "Training Program Enrollment",
        icon: <Book className="h-4 w-4" />,
      },
      {
        id: "conference",
        name: "Conference/Event Attendance",
        icon: <Users className="h-4 w-4" />,
      },
      {
        id: "mentorship",
        name: "Mentorship Program Request",
        icon: <Users className="h-4 w-4" />,
      },
      {
        id: "job",
        name: "Internal Job Application",
        icon: <Briefcase className="h-4 w-4" />,
      },
      {
        id: "education",
        name: "Education Assistance Request",
        icon: <Book className="h-4 w-4" />,
      },
      {
        id: "certification",
        name: "Certification Request",
        icon: <Book className="h-4 w-4" />,
      },
      {
        id: "promotion",
        name: "Promotion Request",
        icon: <Briefcase className="h-4 w-4" />,
      },
      {
        id: "transfer",
        name: "Department Transfer Request",
        icon: <Briefcase className="h-4 w-4" />,
      },
    ],
    administrative: [
      {
        id: "document",
        name: "Document/Certificate Request",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        id: "travel",
        name: "Travel Authorization",
        icon: <Car className="h-4 w-4" />,
      },
      {
        id: "namechange",
        name: "Business Card/Name Change",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        id: "exception",
        name: "Policy Exception Request",
        icon: <AlertCircle className="h-4 w-4" />,
      },
      {
        id: "grievance",
        name: "Grievance/Complaint",
        icon: <AlertCircle className="h-4 w-4" />,
      },
      {
        id: "reference",
        name: "Reference Letter Request",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        id: "employment-verification",
        name: "Employment Verification Request",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        id: "resignation",
        name: "Resignation Request",
        icon: <FileText className="h-4 w-4" />,
      },
    ],
    healthAndWellness: [
      {
        id: "medical-leave",
        name: "Medical Leave Request",
        icon: <Heart className="h-4 w-4" />,
      },
      {
        id: "medical-reimbursement",
        name: "Medical Reimbursement",
        icon: <Heart className="h-4 w-4" />,
      },
      {
        id: "insurance-claim",
        name: "Insurance Claim",
        icon: <Heart className="h-4 w-4" />,
      },
      {
        id: "wellness-program",
        name: "Wellness Program Enrollment",
        icon: <Heart className="h-4 w-4" />,
      },
      {
        id: "gym-membership",
        name: "Gym Membership Request",
        icon: <Heart className="h-4 w-4" />,
      },
    ],
  };

  // Load requests on component mount
  useEffect(() => {
    loadRequests();
    loadCurrentUser();
  }, []);

  // Load the current user data
  const loadCurrentUser = async () => {
    try {
      // Try to fetch user data from API
      const response = await fetch("/api/me");
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
      } else {
        // Mock user data for development
        setCurrentUser({
          id: "user-1",
          name: "John Doe",
          email: "john.doe@company.com",
          department: "Engineering",
          manager: "Sarah Johnson",
          managerEmail: "sarah.johnson@company.com",
          position: "Senior Developer",
          phone: "+1234567890",
          location: "New York Office",
          costCenter: "ENG-1234",
          joinDate: "2020-03-15",
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  // Auto-fill form with user data when selected request type changes
  useEffect(() => {
    if (currentUser && selectedRequestType) {
      setFormData((prev) => ({
        ...prev,
        employeeName: currentUser.name,
        employeeEmail: currentUser.email,
        department: currentUser.department,
        manager: currentUser.manager,
        phone: currentUser.phone,
        location: currentUser.location,
        costCenter: currentUser.costCenter,
      }));
    }
  }, [currentUser, selectedRequestType]);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      // Try production API first, fallback to mock data
      const response = await fetch("/api/requests");
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        // Fallback to mock data
        setRequests([
          {
            id: "REQ-2023-001",
            type: "leave",
            category: "timeAndLeave",
            title: "Annual Leave Request",
            description: "Requesting annual leave for a family vacation",
            status: "approved",
            submittedDate: "2023-11-15",
            decisionDate: "2023-11-17",
            approver: "Sarah Johnson",
            details: {
              startDate: "2023-12-20",
              endDate: "2023-12-27",
              returnDate: "2023-12-28",
              totalDays: 5,
              leaveType: "Annual Leave",
              comments: "Family vacation planned during the holidays",
            },
          },
          {
            id: "REQ-2023-002",
            type: "equipment",
            category: "equipmentAndResources",
            title: "Laptop Upgrade Request",
            description:
              "Requesting a laptop upgrade due to performance issues",
            status: "pending",
            submittedDate: "2023-11-28",
            approver: "Michael Chen",
            details: {
              equipmentType: "Laptop",
              reason:
                "Current laptop is over 3 years old and experiencing significant performance issues",
              specifications:
                "Prefer 16GB RAM, 512GB SSD, and dedicated graphics card",
              urgency: "Medium",
              additionalInfo:
                "Current laptop model is XPS 13, purchased in 2020",
            },
          },
          // ... other mock requests ...
        ]);
      }
    } catch (error) {
      console.error("Error loading requests:", error);
      // Use mock data as fallback
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter requests based on active tab, search query, and filters
  const filteredRequests = requests.filter((request) => {
    // Filter by tab
    if (activeTab !== "all" && request.status !== activeTab) return false;

    // Filter by search query
    if (
      searchQuery &&
      !request.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !request.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    // Filter by status
    if (statusFilter !== "all" && request.status !== statusFilter) return false;

    // Filter by category
    if (categoryFilter !== "all" && request.category !== categoryFilter)
      return false;

    // Filter by date (simplified for demo)
    if (dateFilter === "last7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const requestDate = new Date(request.submittedDate);
      if (requestDate < sevenDaysAgo) return false;
    } else if (dateFilter === "last30days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const requestDate = new Date(request.submittedDate);
      if (requestDate < thirtyDaysAgo) return false;
    }

    return true;
  });

  // Get status badge based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // Get icon based on request type
  const getRequestTypeIcon = (type) => {
    // Flatten all request types into a single array
    const allTypes = Object.values(requestTypes).flat();
    // Find the matching type
    const requestType = allTypes.find((t) => t.id === type);
    return requestType ? requestType.icon : <FileText className="h-4 w-4" />;
  };

  // Get category name from category id
  const getCategoryName = (categoryId) => {
    switch (categoryId) {
      case "timeAndLeave":
        return "Time & Leave";
      case "financeAndBenefits":
        return "Finance & Benefits";
      case "equipmentAndResources":
        return "Equipment & Resources";
      case "careerAndDevelopment":
        return "Career & Development";
      case "administrative":
        return "Administrative";
      default:
        return categoryId;
    }
  };

  // Format date string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle opening request details
  const handleOpenRequestDetails = (request) => {
    setSelectedRequest(request);
    setIsDetailDialogOpen(true);
  };

  // Handle initiating a new request
  const handleInitiateRequest = (typeId) => {
    // Flatten all request types into a single array
    const allTypes = Object.values(requestTypes).flat();
    // Find the selected request type
    const requestType = allTypes.find((t) => t.id === typeId);
    setSelectedRequestType(requestType);
  };

  // Get workflow steps for a request type
  const getWorkflowSteps = (typeId: string): WorkflowStep[] => {
    // These would be fetched from a workflow configuration in a real implementation
    const workflowMap = {
      leave: [
        {
          stepNumber: 1,
          stepName: "Initial Submission",
          approverType: "System",
          isRequired: true,
        },
        {
          stepNumber: 2,
          stepName: "Manager Approval",
          approverType: "Manager",
          approverName: currentUser?.manager,
          estimatedTime: "1-2 business days",
          isRequired: true,
        },
        {
          stepNumber: 3,
          stepName: "HR Verification",
          approverType: "HR",
          estimatedTime: "1 business day",
          isRequired: true,
        },
      ],
      remote: [
        {
          stepNumber: 1,
          stepName: "Initial Submission",
          approverType: "System",
          isRequired: true,
        },
        {
          stepNumber: 2,
          stepName: "Manager Approval",
          approverType: "Manager",
          approverName: currentUser?.manager,
          estimatedTime: "1 business day",
          isRequired: true,
        },
      ],
      equipment: [
        {
          stepNumber: 1,
          stepName: "Initial Submission",
          approverType: "System",
          isRequired: true,
        },
        {
          stepNumber: 2,
          stepName: "Manager Approval",
          approverType: "Manager",
          approverName: currentUser?.manager,
          estimatedTime: "1-2 business days",
          isRequired: true,
        },
        {
          stepNumber: 3,
          stepName: "IT Department Approval",
          approverType: "IT Department",
          estimatedTime: "1-3 business days",
          isRequired: true,
        },
        {
          stepNumber: 4,
          stepName: "Procurement Processing",
          approverType: "Procurement",
          estimatedTime: "3-5 business days",
          isRequired: false,
        },
      ],
      training: [
        {
          stepNumber: 1,
          stepName: "Initial Submission",
          approverType: "System",
          isRequired: true,
        },
        {
          stepNumber: 2,
          stepName: "Manager Approval",
          approverType: "Manager",
          approverName: currentUser?.manager,
          estimatedTime: "1-2 business days",
          isRequired: true,
        },
        {
          stepNumber: 3,
          stepName: "Budget Approval",
          approverType: "Finance",
          estimatedTime: "2-3 business days",
          isRequired: currentUser?.costCenter ? true : false,
        },
        {
          stepNumber: 4,
          stepName: "HR Processing",
          approverType: "HR",
          estimatedTime: "1-2 business days",
          isRequired: true,
        },
      ],
    };

    return (
      workflowMap[typeId] || [
        {
          stepNumber: 1,
          stepName: "Initial Submission",
          approverType: "System",
          isRequired: true,
        },
        {
          stepNumber: 2,
          stepName: "Manager Approval",
          approverType: "Manager",
          approverName: currentUser?.manager,
          estimatedTime: "1-2 business days",
          isRequired: true,
        },
      ]
    );
  };

  // Check eligibility for a request type
  const checkEligibility = (typeId: string) => {
    // This would be fetched from an eligibility service in a real implementation
    const eligibilityMap = {
      leave: [
        {
          name: "Employment Duration",
          description: "Must be employed for at least 90 days",
          isMet: true,
          metReason: "Employed since " + currentUser?.joinDate,
        },
        {
          name: "Leave Balance",
          description: "Must have sufficient leave balance",
          isMet: true,
          metReason: "15 days available",
        },
        {
          name: "Prior Notice",
          description:
            "Request must be made at least 2 weeks in advance for planned leave",
          isMet: true,
        },
      ],
      remote: [
        {
          name: "Position Eligibility",
          description: "Role must be eligible for remote work",
          isMet: true,
          metReason: "Your role is eligible for remote work",
        },
        {
          name: "Manager Approval",
          description: "Your manager must pre-approve remote work",
          isMet: true,
        },
      ],
      equipment: [
        {
          name: "Budget Availability",
          description: "Department must have available budget",
          isMet: true,
          metReason: "Budget available for equipment requests",
        },
        {
          name: "Replacement Cycle",
          description: "Equipment must be due for replacement",
          isMet: true,
          metReason: "Last equipment provided > 24 months ago",
        },
      ],
      training: [
        {
          name: "Budget Availability",
          description: "Department must have training budget",
          isMet: true,
          metReason: "Training budget available",
        },
        {
          name: "Position Relevance",
          description: "Training must be relevant to current role",
          isMet: true,
        },
        {
          name: "Manager Approval",
          description: "Your manager must pre-approve training requests",
          isMet: true,
        },
      ],
      conference: [
        {
          name: "Budget Availability",
          description: "Department must have conference budget",
          isMet: false,
          notMetReason: "Conference budget exhausted for current quarter",
        },
        {
          name: "Business Justification",
          description: "Must provide clear business justification",
          isMet: true,
        },
      ],
    };

    const eligibility = eligibilityMap[typeId] || [
      {
        name: "Employment Status",
        description: "Must be an active employee",
        isMet: true,
        metReason: "You are an active employee",
      },
    ];

    // Check if any requirements are not met
    const allRequirementsMet = eligibility.every((req) => req.isMet);
    setEligibilityMet(allRequirementsMet);

    return eligibility;
  };

  // Get fields to display for a specific request type
  const getFormFieldsForRequestType = (typeId: string): string[] => {
    // Define which fields should be shown for each request type
    const fieldMap = {
      leave: [
        "leaveType",
        "startDate",
        "endDate",
        "returnDate",
        "totalDays",
        "reason",
        "handoverNotes",
      ],
      remote: ["startDate", "endDate", "location", "reason"],
      equipment: [
        "equipmentType",
        "specifications",
        "dateNeeded",
        "urgency",
        "reason",
        "costCenter",
      ],
      expense: [
        "expenseDate",
        "expenseType",
        "amount",
        "description",
        "costCenter",
        "attachments",
      ],
      training: [
        "trainingType",
        "provider",
        "startDate",
        "endDate",
        "cost",
        "justification",
        "costCenter",
      ],
      conference: [
        "conferenceName",
        "location",
        "startDate",
        "endDate",
        "cost",
        "justification",
        "costCenter",
      ],
      travel: [
        "destination",
        "purpose",
        "startDate",
        "endDate",
        "transportationType",
        "estimatedCost",
        "costCenter",
      ],
    };

    return (
      fieldMap[typeId] || [
        "title",
        "description",
        "dateNeeded",
        "priority",
        "justification",
      ]
    );
  };

  // Render form fields based on the selected request type
  const renderDynamicFormFields = () => {
    if (!selectedRequestType) return null;

    const fields = getFormFieldsForRequestType(selectedRequestType.id);

    return (
      <div className="space-y-4">
        {fields.map((field) => {
          switch (field) {
            case "leaveType":
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Leave Type*</label>
                  <Select
                    value={formData.leaveType ?? ""}
                    onChange={(e) =>
                      handleFormChange("leaveType", e.target.value)
                    }
                  >
                    <SelectTrigger
                      className={formErrors.leaveType ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="personal">Personal Leave</SelectItem>
                      <SelectItem value="bereavement">
                        Bereavement Leave
                      </SelectItem>
                      <SelectItem value="maternity">Maternity Leave</SelectItem>
                      <SelectItem value="paternity">Paternity Leave</SelectItem>
                      <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.leaveType && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.leaveType}
                    </p>
                  )}
                </div>
              );
            case "startDate":
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Start Date*</label>
                  <Input
                    type="date"
                    value={formData.startDate ?? ""}
                    onChange={(e) =>
                      handleFormChange("startDate", e.target.value)
                    }
                    className={formErrors.startDate ? "border-red-500" : ""}
                  />
                  {formErrors.startDate && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.startDate}
                    </p>
                  )}
                </div>
              );
            case "endDate":
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">End Date*</label>
                  <Input
                    type="date"
                    value={formData.endDate ?? ""}
                    onChange={(e) =>
                      handleFormChange("endDate", e.target.value)
                    }
                    className={formErrors.endDate ? "border-red-500" : ""}
                  />
                  {formErrors.endDate && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.endDate}
                    </p>
                  )}
                </div>
              );
            case "returnDate":
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Return Date</label>
                  <Input
                    type="date"
                    value={formData.returnDate ?? ""}
                    onChange={(e) =>
                      handleFormChange("returnDate", e.target.value)
                    }
                  />
                </div>
              );
            case "totalDays":
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Total Days</label>
                  <Input
                    type="number"
                    value={formData.totalDays ?? ""}
                    onChange={(e) =>
                      handleFormChange("totalDays", e.target.value)
                    }
                    readOnly
                    min="0"
                    step="0.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This is calculated automatically from start and end dates
                  </p>
                </div>
              );
            case "reason":
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Reason*</label>
                  <Textarea
                    placeholder="Please provide details"
                    value={formData.reason ?? ""}
                    onChange={(e) => handleFormChange("reason", e.target.value)}
                    className={formErrors.reason ? "border-red-500" : ""}
                  />
                  {formErrors.reason && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.reason}
                    </p>
                  )}
                </div>
              );
            case "handoverNotes":
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Handover Notes</label>
                  <Textarea
                    placeholder="Tasks to be handled during your absence"
                    value={formData.handoverNotes ?? ""}
                    onChange={(e) =>
                      handleFormChange("handoverNotes", e.target.value)
                    }
                  />
                </div>
              );
            case "equipmentType":
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Equipment Type*</label>
                  <Select
                    value={formData.equipmentType ?? ""}
                    onChange={(e) =>
                      handleFormChange("equipmentType", e.target.value)
                    }
                  >
                    <SelectTrigger
                      className={
                        formErrors.equipmentType ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select equipment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="desktop">Desktop</SelectItem>
                      <SelectItem value="monitor">Monitor</SelectItem>
                      <SelectItem value="keyboard">Keyboard</SelectItem>
                      <SelectItem value="mouse">Mouse</SelectItem>
                      <SelectItem value="headset">Headset</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.equipmentType && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.equipmentType}
                    </p>
                  )}
                </div>
              );
            case "specifications":
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Specifications</label>
                  <Textarea
                    placeholder="Describe the specifications needed"
                    value={formData.specifications ?? ""}
                    onChange={(e) =>
                      handleFormChange("specifications", e.target.value)
                    }
                  />
                </div>
              );
            case "urgency":
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Urgency*</label>
                  <Select
                    value={formData.urgency ?? ""}
                    onChange={(e) =>
                      handleFormChange("urgency", e.target.value)
                    }
                  >
                    <SelectTrigger
                      className={formErrors.urgency ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Within 4 weeks</SelectItem>
                      <SelectItem value="medium">
                        Medium - Within 2 weeks
                      </SelectItem>
                      <SelectItem value="high">High - Within 1 week</SelectItem>
                      <SelectItem value="critical">
                        Critical - Within 48 hours
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.urgency && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.urgency}
                    </p>
                  )}
                </div>
              );
            case "dateNeeded":
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Date Needed</label>
                  <Input
                    type="date"
                    value={formData.dateNeeded ?? ""}
                    onChange={(e) =>
                      handleFormChange("dateNeeded", e.target.value)
                    }
                  />
                </div>
              );
            case "title":
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Title*</label>
                  <Input
                    placeholder="Enter request title"
                    value={formData.title ?? ""}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    className={formErrors.title ? "border-red-500" : ""}
                  />
                  {formErrors.title && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.title}
                    </p>
                  )}
                </div>
              );
            case "description":
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Description*</label>
                  <Textarea
                    placeholder="Please provide details"
                    value={formData.description ?? ""}
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
                    className={formErrors.description ? "border-red-500" : ""}
                  />
                  {formErrors.description && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.description}
                    </p>
                  )}
                </div>
              );
            case "priority":
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={formData.priority ?? ""}
                    onChange={(e) =>
                      handleFormChange("priority", e.target.value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              );
            case "justification":
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Justification*</label>
                  <Textarea
                    placeholder="Why is this request necessary?"
                    value={formData.justification ?? ""}
                    onChange={(e) =>
                      handleFormChange("justification", e.target.value)
                    }
                    className={formErrors.justification ? "border-red-500" : ""}
                  />
                  {formErrors.justification && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.justification}
                    </p>
                  )}
                </div>
              );
            case "attachments":
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Attachments</label>
                  <Input
                    type="file"
                    onChange={(e) =>
                      handleFormChange("attachments", e.target.files)
                    }
                    multiple
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted formats: PDF, JPG, PNG (max 5MB)
                  </p>
                </div>
              );
            case "costCenter":
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Cost Center</label>
                  <Input
                    placeholder="Enter cost center"
                    value={formData.costCenter ?? ""}
                    onChange={(e) =>
                      handleFormChange("costCenter", e.target.value)
                    }
                  />
                </div>
              );
            default:
              // Handle custom fields
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">
                    {field.replace(/([A-Z])/g, " $1").trim()}*
                  </label>
                  <Input
                    placeholder={`Enter ${field
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                      .toLowerCase()}`}
                    value={formData[field] ?? ""}
                    onChange={(e) => handleFormChange(field, e.target.value)}
                    className={formErrors[field] ? "border-red-500" : ""}
                  />
                  {formErrors[field] && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors[field]}
                    </p>
                  )}
                </div>
              );
          }
        })}
      </div>
    );
  };

  // Show workflow steps for the current request type
  const renderWorkflowSteps = () => {
    if (!selectedRequestType) return null;

    const workflow = getWorkflowSteps(selectedRequestType.id);

    return (
      <div className="border rounded-md p-4 bg-gray-50 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">Approval Workflow</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowWorkflow(!showWorkflow)}
          >
            {showWorkflow ? "Hide" : "Show"}
          </Button>
        </div>

        {showWorkflow && (
          <div className="space-y-4">
            {workflow.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  {step.stepNumber}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{step.stepName}</div>
                  <div className="text-sm text-gray-500">
                    Approver: {step.approverName || step.approverType}
                    {step.estimatedTime && (
                      <span> • Estimated time: {step.estimatedTime}</span>
                    )}
                    {!step.isRequired && <span> • (Optional)</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Show eligibility requirements for the current request type
  const renderEligibilityRequirements = () => {
    if (!selectedRequestType) return null;

    const eligibility = checkEligibility(selectedRequestType.id);

    return (
      <div className="border rounded-md p-4 bg-gray-50 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">Eligibility Check</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEligibility(!showEligibility)}
          >
            {showEligibility ? "Hide" : "Show"}
          </Button>
        </div>

        {!eligibilityMet && (
          <div className="bg-red-100 text-red-800 p-2 rounded mb-2">
            You do not meet all eligibility requirements for this request type.
          </div>
        )}

        {showEligibility && (
          <div className="space-y-3">
            {eligibility.map((req, index) => (
              <div key={index} className="flex items-start">
                {req.isMet ? (
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <X className="h-5 w-5 text-red-500 mr-2" />
                )}
                <div className="flex-1">
                  <div className="font-medium">{req.name}</div>
                  <div className="text-sm text-gray-500">{req.description}</div>
                  {req.isMet && req.metReason && (
                    <div className="text-sm text-green-600">
                      {req.metReason}
                    </div>
                  )}
                  {!req.isMet && req.notMetReason && (
                    <div className="text-sm text-red-600">
                      {req.notMetReason}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Update the validateForm function to handle dynamic fields
  const validateForm = () => {
    const errors: FormErrors = {};

    if (!selectedRequestType) {
      return false;
    }

    // Get required fields for this request type
    const fields = getFormFieldsForRequestType(selectedRequestType.id);

    // Validate each field
    fields.forEach((field) => {
      // Skip validation for certain fields
      if (
        [
          "totalDays",
          "returnDate",
          "handoverNotes",
          "specifications",
          "attachments",
        ].includes(field)
      ) {
        return;
      }

      if (!formData[field]) {
        errors[field] =
          `${field.replace(/([A-Z])/g, " $1").trim()} is required`;
      }
    });

    // Specific validations for date fields
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        errors.endDate = "End date must be after start date";
      }
    }

    // Check eligibility
    if (!eligibilityMet) {
      errors._general =
        "You do not meet the eligibility requirements for this request type";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission with proper validation and API integration
  const handleSubmitRequest = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const requestData = {
        type: selectedRequestType.id,
        category: getCategoryByType(selectedRequestType.id),
        title: formData.title ?? getDefaultTitle(selectedRequestType.id),
        description: formData.description ?? formData.reason,
        details: formData,
        priority: (formData.priority ?? formData.urgency) || "medium",
        submittedDate: new Date().toISOString().split("T")[0],
        status: "pending",
        approver: getApproverByType(selectedRequestType.id),
      };

      // Try production API first
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const newRequest = await response.json();
        setRequests((prev) => [newRequest, ...prev]);

        // Send notification to approver
        await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "new_request_notification",
            to: getApproverEmail(selectedRequestType.id),
            requestData: newRequest,
          }),
        });

        alert(
          "Request submitted successfully! Your approver has been notified.",
        );
      } else {
        // Fallback: Add to local state (mock mode)
        const mockRequest = {
          ...requestData,
          id: `REQ-${new Date().getFullYear()}-${String(requests.length + 1).padStart(3, "0")}`,
        };
        setRequests((prev) => [mockRequest, ...prev]);
        alert("Request submitted successfully! (Demo mode)");
      }

      newRequestDrawer.onClose();
      setSelectedRequestType(null);
      setFormData(initialFormData);
      setFormErrors({});
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Error submitting request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions for form logic
  const getCategoryByType = (typeId) => {
    for (const [category, types] of Object.entries(requestTypes)) {
      if (types.some((type) => type.id === typeId)) {
        return category;
      }
    }
    return "administrative";
  };

  const getDefaultTitle = (typeId) => {
    const allTypes = Object.values(requestTypes).flat();
    const type = allTypes.find((t) => t.id === typeId);
    return type?.name || "New Request";
  };

  const getApproverByType = (typeId) => {
    const approverMap = {
      leave: "Sarah Johnson",
      remote: "Sarah Johnson",
      overtime: "Department Head",
      equipment: "IT Department",
      software: "IT Department",
      access: "Security Team",
      training: "HR Department",
      expense: "Finance Department",
      document: "HR Department",
      travel: "Manager",
    };
    return approverMap[typeId] || "Department Head";
  };

  const getApproverEmail = (typeId) => {
    const emailMap = {
      leave: "sarah.johnson@company.com",
      remote: "sarah.johnson@company.com",
      overtime: "depthead@company.com",
      equipment: "it@company.com",
      software: "it@company.com",
      access: "security@company.com",
      training: "hr@company.com",
      expense: "finance@company.com",
      document: "hr@company.com",
      travel: "manager@company.com",
    };
    return emailMap[typeId] || "manager@company.com";
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev: RequestFormData) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <ModernDashboardLayout
      title="Request Panel"
      subtitle="Manage and track your requests"
    >
      <Head>
        <title>Request Panel | HR Portal</title>
        <meta name="description" content="Submit and track requests" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Request Panel</h1>
            <p className="text-gray-600">
              Submit and track your approval requests
            </p>
          </div>

          <Button
            onClick={() => {
              newRequestDrawer.onOpen();
              setStep("select");
              setDialogError(null);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search requests..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="timeAndLeave">Time & Leave</SelectItem>
                  <SelectItem value="financeAndBenefits">
                    Finance & Benefits
                  </SelectItem>
                  <SelectItem value="equipmentAndResources">
                    Equipment & Resources
                  </SelectItem>
                  <SelectItem value="careerAndDevelopment">
                    Career & Development
                  </SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="last90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests Tabs */}
        <Tabs
          defaultIndex={activeTabIndex}
          onChange={(index) => setActiveTabIndex(index)}
        >
          <TabsList className="mb-4">
            <TabsTrigger>All Requests</TabsTrigger>
            <TabsTrigger>Pending Requests</TabsTrigger>
            <TabsTrigger>Approved Requests</TabsTrigger>
            <TabsTrigger>Rejected Requests</TabsTrigger>
          </TabsList>

          {["all", "pending", "approved", "rejected"].map((tab, index) => (
            <TabsContent
              key={tab}
              display={activeTabIndex === index ? "block" : "none"}
            >
              {filteredRequests.length > 0 ? (
                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <Card key={request.id} className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded">
                              {getRequestTypeIcon(request.type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{request.title}</h3>
                                {getStatusBadge(request.status)}
                              </div>
                              <p className="text-sm text-gray-500">
                                {request.id} • Submitted on{" "}
                                {formatDate(request.submittedDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {getCategoryName(request.category)}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenRequestDetails(request)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>

                        <div className="mt-3 text-gray-600 text-sm">
                          {request.description}
                        </div>

                        <div className="mt-3 flex justify-between items-center text-sm">
                          <div className="text-gray-500">
                            {request.status === "pending" ? (
                              <span>
                                Pending approval from {request.approver}
                              </span>
                            ) : request.status === "approved" ? (
                              <span>
                                Approved by {request.approver} on{" "}
                                {formatDate(request.decisionDate)}
                              </span>
                            ) : request.status === "rejected" ? (
                              <span>
                                Rejected by {request.approver} on{" "}
                                {formatDate(request.decisionDate)}
                              </span>
                            ) : null}
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleOpenRequestDetails(request)
                                }
                              >
                                View Details
                              </DropdownMenuItem>
                              {request.status === "pending" && (
                                <DropdownMenuItem>
                                  Cancel Request
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>Download PDF</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Requests Found
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {searchQuery ||
                    statusFilter !== "all" ||
                    categoryFilter !== "all" ||
                    dateFilter !== "all"
                      ? "No requests match your current filters. Try adjusting your search criteria."
                      : "You haven't submitted any requests yet. Create a new request to get started."}
                  </p>
                  {(searchQuery ||
                    statusFilter !== "all" ||
                    categoryFilter !== "all" ||
                    dateFilter !== "all") && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                        setCategoryFilter("all");
                        setDateFilter("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* New Request Drawer */}
      <Drawer
        isOpen={newRequestDrawer.isOpen}
        placement="right"
        onClose={newRequestDrawer.onClose}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            {selectedRequestType
              ? `New ${selectedRequestType.name}`
              : "New Request"}
          </DrawerHeader>
          <DrawerBody>
            {/* Stepper/Progress Indicator */}
            <div className="flex items-center mb-4">
              <div
                className={`flex-1 text-center py-2 rounded ${step === "select" ? "bg-blue-100 text-blue-700 font-semibold" : "bg-gray-100 text-gray-500"}`}
              >
                1. Select Type
              </div>
              <div className="w-8 h-1 bg-gray-200 mx-2 rounded" />
              <div
                className={`flex-1 text-center py-2 rounded ${step === "form" ? "bg-blue-100 text-blue-700 font-semibold" : "bg-gray-100 text-gray-500"}`}
              >
                2. Fill Form
              </div>
            </div>

            {/* Error Banner */}
            {dialogError && (
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4 text-center">
                {dialogError}
              </div>
            )}

            {/* Step 1: Select Request Type */}
            {step === "select" && !selectedRequestType && (
              <div className="mt-4">
                <p className="mb-2 text-gray-700">
                  Choose the type of request you want to submit:
                </p>
                <Accordion
                  type="single"
                  collapsible
                  defaultValue="timeAndLeave"
                >
                  {Object.entries(requestTypes).map(([category, types]) => (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger className="text-lg font-medium">
                        {getCategoryName(category)}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                          {types.map((type) => (
                            <div
                              key={type.id}
                              className={`p-3 border rounded-md hover:bg-blue-50 cursor-pointer transition ${selectedRequestType?.id === type.id ? "border-blue-500 bg-blue-50" : ""}`}
                              onClick={() => {
                                setSelectedRequestType(type);
                                setStep("form");
                                setDialogError(null);
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded">
                                  {type.icon}
                                </div>
                                <div>
                                  <h3 className="font-medium">{type.name}</h3>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      newRequestDrawer.onClose();
                      setDialogError(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Fill Form */}
            {step === "form" && selectedRequestType && (
              <div className="mt-4 space-y-6">
                {/* Employee Information Panel */}
                <EmployeeInfoPanel employee={currentUser || {}} />

                {/* Dynamic Request Form */}
                <DynamicRequestForm
                  requestType={selectedRequestType}
                  formData={formData}
                  formErrors={formErrors}
                  onChange={handleFormChange}
                  currentUser={currentUser}
                />
              </div>
            )}
          </DrawerBody>
          <DrawerFooter>
            <div className="w-full flex justify-between">
              <div>
                {selectedRequestType && (
                  <Button variant="outline" className="text-red-600">
                    Cancel Request
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                {step === "form" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedRequestType(null);
                      setStep("select");
                      setDialogError(null);
                    }}
                  >
                    Back
                  </Button>
                )}
                {step === "form" && (
                  <Button
                    onClick={async () => {
                      try {
                        await handleSubmitRequest();
                      } catch (e) {
                        setDialogError(
                          "Failed to submit request. Please try again.",
                        );
                      }
                    }}
                  >
                    Submit Request
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => {
                    newRequestDrawer.onClose();
                    setSelectedRequestType(null);
                    setStep("select");
                    setDialogError(null);
                    setFormData(initialFormData);
                    setFormErrors({});
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog
          isOpen={isDetailDialogOpen}
          onClose={() => setIsDetailDialogOpen(false)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
              <DialogDescription>
                {selectedRequest.id} • {selectedRequest.title}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-lg">
                      {selectedRequest.title}
                    </h3>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                  <p className="text-sm text-gray-500">
                    Submitted on {formatDate(selectedRequest.submittedDate)}
                  </p>
                </div>
                <Badge variant="outline">
                  {getCategoryName(selectedRequest.category)}
                </Badge>
              </div>

              <div className="border-t border-b py-4">
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-600">{selectedRequest.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Request Details</h4>
                <div className="bg-gray-50 rounded-md p-4 space-y-3">
                  {Object.entries(selectedRequest.details).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="font-medium">
                          {typeof value === "boolean"
                            ? value
                              ? "Yes"
                              : "No"
                            : String(value)}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Status Information</h4>
                <div className="bg-gray-50 rounded-md p-4">
                  {selectedRequest.status === "pending" ? (
                    <div className="flex items-center text-yellow-600">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>
                        Pending approval from {selectedRequest.approver}
                      </span>
                    </div>
                  ) : selectedRequest.status === "approved" ? (
                    <div className="flex items-center text-green-600">
                      <Check className="h-5 w-5 mr-2" />
                      <span>
                        Approved by {selectedRequest.approver} on{" "}
                        {formatDate(selectedRequest.decisionDate)}
                      </span>
                    </div>
                  ) : selectedRequest.status === "rejected" ? (
                    <div className="space-y-2">
                      <div className="flex items-center text-red-600">
                        <X className="h-5 w-5 mr-2" />
                        <span>
                          Rejected by {selectedRequest.approver} on{" "}
                          {formatDate(selectedRequest.decisionDate)}
                        </span>
                      </div>
                      {selectedRequest.rejectionReason && (
                        <div className="mt-2 pl-7">
                          <p className="text-gray-600">
                            Reason: {selectedRequest.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <div className="w-full flex justify-between">
                <div>
                  {selectedRequest.status === "pending" && (
                    <Button variant="outline" className="text-red-600">
                      Cancel Request
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </ModernDashboardLayout>
  );
}
