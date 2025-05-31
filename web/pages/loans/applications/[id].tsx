import React, { useState, useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import {
  ArrowLeft,
  Download,
  FileText,
  Check,
  X,
  AlertCircle,
  User,
  Calendar,
  DollarSign,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { GetServerSideProps } from "next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

// Define types for documents and timeline
interface LoanDocument {
  id: number;
  name: string;
  type: string;
  uploadDate: string;
}

interface TimelineEvent {
  date: string;
  action: string;
  actor: string;
}

// Define the loan application type
interface LoanApplication {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  position: string;
  joinDate: string;
  type: string;
  amount: number;
  term: number;
  purpose: string;
  repaymentMethod: string;
  applicationDate: string;
  status: string;
  approvedBy?: string;
  approvalDate?: string;
  interestRate?: string;
  monthlyPayment: number;
  documents: LoanDocument[];
  timeline: TimelineEvent[];
}

// Mock loan application data - would be fetched from API in real app
const mockApplicationData: Record<string, LoanApplication> = {
  "LN-2023-001": {
    id: "LN-2023-001",
    employeeName: "Alex Johnson",
    employeeId: "EMP-1024",
    department: "Marketing",
    position: "Marketing Specialist",
    joinDate: "2019-06-15",
    type: "Personal Loan",
    amount: 25000,
    term: 3, // years
    purpose:
      "Home renovation and repairs due to water damage in the bathroom and kitchen areas.",
    repaymentMethod: "Salary Deduction",
    applicationDate: "2023-11-15",
    status: "Approved",
    approvedBy: "Jane Smith",
    approvalDate: "2023-11-18",
    interestRate: "9.5%",
    monthlyPayment: 800.75,
    documents: [
      {
        id: 1,
        name: "Salary Statement.pdf",
        type: "salary_proof",
        uploadDate: "2023-11-15",
      },
      {
        id: 2,
        name: "ID Proof.pdf",
        type: "identity_proof",
        uploadDate: "2023-11-15",
      },
    ],
    timeline: [
      {
        date: "2023-11-15T10:30:00",
        action: "Application Submitted",
        actor: "Alex Johnson",
      },
      {
        date: "2023-11-16T14:15:00",
        action: "Documentation Verified",
        actor: "HR Team",
      },
      {
        date: "2023-11-17T09:45:00",
        action: "Finance Review Completed",
        actor: "Finance Department",
      },
      {
        date: "2023-11-18T11:20:00",
        action: "Application Approved",
        actor: "Jane Smith",
      },
    ],
  },
  "LN-2023-002": {
    id: "LN-2023-002",
    employeeName: "Jamie Smith",
    employeeId: "EMP-2156",
    department: "Engineering",
    position: "Senior Developer",
    joinDate: "2020-03-10",
    type: "Education Loan",
    amount: 75000,
    term: 5, // years
    purpose:
      "To pursue a part-time Masters degree in Computer Science to enhance skills relevant to current role.",
    repaymentMethod: "Bank Transfer",
    applicationDate: "2023-11-10",
    status: "Pending Approval",
    documents: [
      {
        id: 1,
        name: "University Admission Letter.pdf",
        type: "education_proof",
        uploadDate: "2023-11-10",
      },
      {
        id: 2,
        name: "Course Fee Structure.pdf",
        type: "fee_proof",
        uploadDate: "2023-11-10",
      },
      {
        id: 3,
        name: "Salary Statement.pdf",
        type: "salary_proof",
        uploadDate: "2023-11-10",
      },
    ],
    notes: "",
    timeline: [
      {
        date: "2023-11-10T15:45:00",
        action: "Application Submitted",
        actor: "Jamie Smith",
      },
      {
        date: "2023-11-12T10:30:00",
        action: "Documentation Verified",
        actor: "HR Team",
      },
      {
        date: "2023-11-14T14:20:00",
        action: "Pending Manager Approval",
        actor: "System",
      },
    ],
  },
  "LN-2023-003": {
    id: "LN-2023-003",
    employeeName: "Taylor Wilson",
    employeeId: "EMP-3201",
    department: "Operations",
    position: "Operations Coordinator",
    joinDate: "2021-08-22",
    type: "Emergency Loan",
    amount: 15000,
    term: 1, // year
    purpose:
      "Medical emergency - unexpected hospital expenses for dependent parent.",
    repaymentMethod: "Salary Deduction",
    applicationDate: "2023-11-08",
    status: "Under Review",
    documents: [
      {
        id: 1,
        name: "Medical Bills.pdf",
        type: "expense_proof",
        uploadDate: "2023-11-08",
      },
      {
        id: 2,
        name: "Hospital Report.pdf",
        type: "medical_proof",
        uploadDate: "2023-11-08",
      },
    ],
    notes:
      "Urgent approval requested due to nature of emergency. HR director suggested expedited process.",
    timeline: [
      {
        date: "2023-11-08T09:15:00",
        action: "Emergency Application Submitted",
        actor: "Taylor Wilson",
      },
      {
        date: "2023-11-08T11:30:00",
        action: "Initial Review Completed",
        actor: "HR Team",
      },
      {
        date: "2023-11-08T16:45:00",
        action: "Additional Documentation Requested",
        actor: "Finance Department",
      },
      {
        date: "2023-11-09T10:20:00",
        action: "Additional Documents Submitted",
        actor: "Taylor Wilson",
      },
      {
        date: "2023-11-09T14:30:00",
        action: "Under Final Review",
        actor: "Finance Manager",
      },
    ],
  },
  "LN-2023-004": {
    id: "LN-2023-004",
    employeeName: "Morgan Lee",
    employeeId: "EMP-4087",
    department: "Sales",
    position: "Regional Sales Manager",
    joinDate: "2018-04-15",
    type: "Home Loan",
    amount: 2500000,
    term: 20, // years
    purpose: "Purchase of primary residence in the city for family.",
    repaymentMethod: "Bank Transfer",
    applicationDate: "2023-11-01",
    status: "Documentation Required",
    documents: [
      {
        id: 1,
        name: "Property Details.pdf",
        type: "property_proof",
        uploadDate: "2023-11-01",
      },
      {
        id: 2,
        name: "Salary Statements.pdf",
        type: "salary_proof",
        uploadDate: "2023-11-01",
      },
    ],
    notes:
      "Additional documents requested: Property valuation report and legal clearance certificate.",
    timeline: [
      {
        date: "2023-11-01T13:20:00",
        action: "Application Submitted",
        actor: "Morgan Lee",
      },
      {
        date: "2023-11-03T15:45:00",
        action: "Initial Review Completed",
        actor: "HR Team",
      },
      {
        date: "2023-11-05T11:30:00",
        action: "Documentation Verification",
        actor: "Finance Department",
      },
      {
        date: "2023-11-06T14:15:00",
        action: "Additional Documentation Requested",
        actor: "Finance Manager",
      },
    ],
  },
  "LN-2023-005": {
    id: "LN-2023-005",
    employeeName: "Casey Brown",
    employeeId: "EMP-1587",
    department: "Customer Support",
    position: "Support Team Lead",
    joinDate: "2020-01-20",
    type: "Personal Loan",
    amount: 30000,
    term: 2, // years
    purpose:
      "Debt consolidation to simplify multiple ongoing loans and credit card payments.",
    repaymentMethod: "Salary Deduction",
    applicationDate: "2023-10-28",
    status: "Approved",
    approvedBy: "Michael Wong",
    approvalDate: "2023-11-05",
    interestRate: "10%",
    monthlyPayment: 1380.43,
    documents: [
      {
        id: 1,
        name: "Existing Loan Statements.pdf",
        type: "debt_proof",
        uploadDate: "2023-10-28",
      },
      {
        id: 2,
        name: "Credit Card Statements.pdf",
        type: "debt_proof",
        uploadDate: "2023-10-28",
      },
      {
        id: 3,
        name: "Salary Statement.pdf",
        type: "salary_proof",
        uploadDate: "2023-10-28",
      },
    ],
    notes: "Consolidating existing debts should improve financial stability.",
    timeline: [
      {
        date: "2023-10-28T11:15:00",
        action: "Application Submitted",
        actor: "Casey Brown",
      },
      {
        date: "2023-10-30T09:30:00",
        action: "Documentation Verified",
        actor: "HR Team",
      },
      {
        date: "2023-11-02T14:45:00",
        action: "Financial Analysis Completed",
        actor: "Finance Department",
      },
      {
        date: "2023-11-05T10:20:00",
        action: "Application Approved",
        actor: "Michael Wong",
      },
    ],
  },
};

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default function LoanApplicationDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, role } = useAuth();
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [approvalData, setApprovalData] = useState({
    decision: "",
    interestRate: "",
    approvalNotes: "",
    disbursementDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user has admin/finance rights
  const canApprove =
    role === "admin" || role === "hr_director" || role === "finance_manager";

  // Fetch application data when ID changes
  useEffect(() => {
    if (id && typeof id === "string") {
      setLoading(true);

      // Simulate API call
      setTimeout(() => {
        const appData = mockApplicationData[id];

        if (appData) {
          setApplication(appData);
        }

        setLoading(false);
      }, 500);
    }
  }, [id]);

  // Handle approval form changes
  const handleApprovalInputChange = (e) => {
    const { name, value } = e.target;
    setApprovalData({
      ...approvalData,
      [name]: value,
    });
  };

  // Handle approval/rejection
  const handleApprovalSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};
    if (!approvalData.decision) {
      newErrors.decision = "Please select a decision";
    }

    if (approvalData.decision === "approve") {
      if (!approvalData.interestRate) {
        newErrors.interestRate = "Please enter an interest rate";
      }
      if (!approvalData.disbursementDate) {
        newErrors.disbursementDate = "Please enter a disbursement date";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call - in real app, this would update the database
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update local state to reflect the change
      const updatedApplication = {
        ...application,
        status: approvalData.decision === "approve" ? "Approved" : "Rejected",
        approvedBy: user?.name || "Current User",
        approvalDate: new Date().toISOString().split("T")[0],
        interestRate: approvalData.interestRate
          ? `${approvalData.interestRate}%`
          : undefined,
        notes: approvalData.approvalNotes || application?.notes,
        timeline: [
          ...(application?.timeline || []),
          {
            date: new Date().toISOString(),
            action:
              approvalData.decision === "approve"
                ? "Application Approved"
                : "Application Rejected",
            actor: user?.name || "Current User",
          },
        ],
      };

      setApplication(updatedApplication);
      setShowApprovalForm(false);

      // Show success message
      alert(
        approvalData.decision === "approve"
          ? "Loan application has been approved successfully!"
          : "Loan application has been rejected.",
      );
    } catch (error) {
      console.error("Error processing application:", error);
      setErrors({
        form: "An error occurred while processing the application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format datetime for timeline
  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "Pending Approval":
        return (
          <Badge className="bg-blue-100 text-blue-800">Pending Approval</Badge>
        );
      case "Under Review":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
        );
      case "Documentation Required":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            Documentation Required
          </Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // If application data is not loaded yet
  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Application... | HR Portal</title>
        </Head>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  if (!application) {
    return (
      <>
        <Head>
          <title>Application Not Found | HR Portal</title>
        </Head>
        <div className="text-center py-12">
          <div className="bg-red-100 text-red-800 p-4 rounded-lg inline-flex items-center mb-6">
            <AlertCircle className="w-6 h-6 mr-2" />
            <span>Application not found</span>
          </div>
          <p className="text-gray-500 mb-6">
            The loan application you're looking for doesn't exist or you don't
            have permission to view it.
          </p>
          <Button onClick={() => router.push("/loans/applications")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Applications
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Loan Application {application.id} | HR Portal</title>
        <meta
          name="description"
          content={`Details for loan application ${application.id}`}
        />
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <button
              onClick={() => router.push("/loans/applications")}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back to Applications</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Loan Application: {application.id}
            </h1>
            <div className="flex items-center mt-2">
              <span className="text-gray-500 mr-3">{application.type}</span>
              {getStatusBadge(application.status)}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {application.status === "Additional Documents Required" && (
              <Button
                onClick={() =>
                  alert(
                    "Document upload functionality would be implemented here",
                  )
                }
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Documents
              </Button>
            )}

            {application.status === "Approved" && (
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/loans/repayment-schedule/${application.id}`)
                }
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                View Repayment Schedule
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Application Overview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Application Status</span>
                  {getStatusBadge(application.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center py-2 border-b">
                    <User className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium">
                        {application.employeeName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {application.employeeId}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Department</p>
                      <p className="text-sm font-medium">
                        {application.department}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Position</p>
                      <p className="text-sm font-medium">
                        {application.position}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Join Date</p>
                      <p className="text-sm font-medium">
                        {formatDate(application.joinDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Application Date</p>
                      <p className="text-sm font-medium">
                        {formatDate(application.applicationDate)}
                      </p>
                    </div>
                  </div>

                  {application.status === "Approved" && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-gray-500 mb-2">
                        Approval Information
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Approved By</p>
                          <p className="text-sm font-medium">
                            {application.approvedBy}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Approval Date</p>
                          <p className="text-sm font-medium">
                            {formatDate(application.approvalDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {application.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded: {formatDate(doc.uploadDate)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Loan Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Loan Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Loan Type</p>
                      <p className="text-sm font-medium">{application.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Loan Amount</p>
                      <p className="text-sm font-medium">
                        ₹{application.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Loan Term</p>
                      <p className="text-sm font-medium">
                        {application.term}{" "}
                        {application.term === 1 ? "year" : "years"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Repayment Method</p>
                      <p className="text-sm font-medium">
                        {application.repaymentMethod}
                      </p>
                    </div>

                    {application.interestRate && (
                      <>
                        <div>
                          <p className="text-xs text-gray-500">Interest Rate</p>
                          <p className="text-sm font-medium">
                            {application.interestRate}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">
                            Monthly Payment
                          </p>
                          <p className="text-sm font-medium">
                            ₹
                            {application.monthlyPayment.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-1">Loan Purpose</p>
                    <p className="text-sm">{application.purpose}</p>
                  </div>

                  {application.notes && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-gray-500 mb-1">Notes</p>
                      <p className="text-sm">{application.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Approval Form */}
            {showApprovalForm && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Application Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleApprovalSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Decision <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 space-y-2">
                        <div className="flex items-center">
                          <input
                            id="approve"
                            name="decision"
                            type="radio"
                            value="approve"
                            checked={approvalData.decision === "approve"}
                            onChange={handleApprovalInputChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                          />
                          <label
                            htmlFor="approve"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Approve
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="reject"
                            name="decision"
                            type="radio"
                            value="reject"
                            checked={approvalData.decision === "reject"}
                            onChange={handleApprovalInputChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                          />
                          <label
                            htmlFor="reject"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Reject
                          </label>
                        </div>
                        {errors.decision && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.decision}
                          </p>
                        )}
                      </div>
                    </div>

                    {approvalData.decision === "approve" && (
                      <>
                        <div>
                          <label
                            htmlFor="interestRate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Interest Rate (%){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              id="interestRate"
                              name="interestRate"
                              step="0.01"
                              min="0"
                              max="20"
                              className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                errors.interestRate ? "border-red-300" : ""
                              }`}
                              value={approvalData.interestRate}
                              onChange={handleApprovalInputChange}
                              placeholder="e.g., 9.5"
                            />
                            {errors.interestRate && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.interestRate}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="disbursementDate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Disbursement Date{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1">
                            <input
                              type="date"
                              id="disbursementDate"
                              name="disbursementDate"
                              className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                errors.disbursementDate ? "border-red-300" : ""
                              }`}
                              value={approvalData.disbursementDate}
                              onChange={handleApprovalInputChange}
                            />
                            {errors.disbursementDate && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.disbursementDate}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label
                        htmlFor="approvalNotes"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Notes
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="approvalNotes"
                          name="approvalNotes"
                          rows={3}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={approvalData.approvalNotes}
                          onChange={handleApprovalInputChange}
                          placeholder="Any notes regarding this decision"
                        />
                      </div>
                    </div>

                    {/* Form error */}
                    {errors.form && (
                      <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                          <div className="ml-3">
                            <p className="text-sm text-red-700">
                              {errors.form}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowApprovalForm(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : "Submit Decision"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Timeline */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Application Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute top-0 left-3 bottom-0 w-0.5 bg-gray-200" />

                  {/* Timeline events */}
                  <div className="space-y-6 ml-6">
                    {application.timeline.map((event, index) => (
                      <div key={index} className="relative">
                        {/* Timeline dot */}
                        <div className="absolute -left-9 mt-1.5 w-5 h-5 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center">
                          <span className="h-2.5 w-2.5 rounded-full bg-white" />
                        </div>

                        {/* Event details */}
                        <div className="mb-1">
                          <p className="text-sm font-medium">{event.action}</p>
                          <p className="text-xs text-gray-500">
                            By: {event.actor}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400">
                          {formatDateTime(event.date)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calculation Summary */}
            {application.status === "Approved" && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Loan Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <p className="text-sm">Principal Amount</p>
                      <p className="text-sm font-medium">
                        ₹{application.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <p className="text-sm">Interest Rate</p>
                      <p className="text-sm font-medium">
                        {application.interestRate}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <p className="text-sm">Loan Term</p>
                      <p className="text-sm font-medium">
                        {application.term}{" "}
                        {application.term === 1 ? "year" : "years"}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <p className="text-sm">Monthly Payment</p>
                      <p className="text-sm font-medium">
                        ₹
                        {application.monthlyPayment.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <p className="text-sm">Total Payments</p>
                      <p className="text-sm font-medium">
                        ₹
                        {(
                          application.monthlyPayment *
                          application.term *
                          12
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <p className="text-sm">Total Interest</p>
                      <p className="text-sm font-medium">
                        ₹
                        {(
                          application.monthlyPayment * application.term * 12 -
                          application.amount
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        router.push(
                          `/loans/repayment-schedule/${application.id}`,
                        )
                      }
                    >
                      View Repayment Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
