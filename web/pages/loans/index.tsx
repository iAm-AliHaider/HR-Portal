import React, { useState, useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import {
  ArrowUpRight,
  ClipboardList,
  Calendar,
  DollarSign,
  TrendingUp,
  CreditCard,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus,
} from "lucide-react";
import { GetServerSideProps } from "next";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
import LoanApplicationDialog from "@/components/loans/LoanApplicationDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default function LoansManagementPage() {
  const router = useRouter();
  const { user, role } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoanApplicationDialog, setShowLoanApplicationDialog] =
    useState(false);

  // State for API data
  const [loanPrograms, setLoanPrograms] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingRepayments, setUpcomingRepayments] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_applications: 0,
    pending_applications: 0,
    approved_applications: 0,
    rejected_applications: 0,
    disbursed_applications: 0,
    total_disbursed: 0,
  });

  const isAdmin =
    role === "admin" ||
    role === "hr_director" ||
    role === "hr_manager" ||
    role === "finance_manager";

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load all dashboard data
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadLoanPrograms(),
        loadRecentApplications(),
        loadUpcomingRepayments(),
        isAdmin && loadAnalytics(),
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load loan programs
  const loadLoanPrograms = async () => {
    try {
      const response = await fetch("/api/loans?type=settings");
      if (response.ok) {
        const data = await response.json();
        setLoanPrograms(data.loan_types || []);
      } else {
        // Fallback data
        setLoanPrograms([
          {
            id: "personal",
            name: "Personal Loan",
            interest_rate_min: 8.5,
            interest_rate_max: 12.0,
            max_amount: 200000,
            min_amount: 10000,
            max_term_months: 60,
            min_term_months: 6,
            eligibility_criteria: "All permanent employees",
          },
          {
            id: "education",
            name: "Education Loan",
            interest_rate_min: 7.5,
            interest_rate_max: 9.5,
            max_amount: 500000,
            min_amount: 25000,
            max_term_months: 120,
            min_term_months: 12,
            eligibility_criteria: "Employees with >2 years tenure",
          },
          {
            id: "emergency",
            name: "Emergency Loan",
            interest_rate_min: 6.0,
            interest_rate_max: 8.0,
            max_amount: 50000,
            min_amount: 5000,
            max_term_months: 24,
            min_term_months: 3,
            eligibility_criteria: "All employees eligible",
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading loan programs:", error);
    }
  };

  // Load recent applications
  const loadRecentApplications = async () => {
    try {
      const response = await fetch("/api/loans?type=applications&limit=5");
      if (response.ok) {
        const data = await response.json();
        setRecentApplications(data);
      }
    } catch (error) {
      console.error("Error loading recent applications:", error);
    }
  };

  // Load upcoming repayments
  const loadUpcomingRepayments = async () => {
    try {
      const response = await fetch("/api/loans?type=repayments&limit=5");
      if (response.ok) {
        const data = await response.json();
        setUpcomingRepayments(data);
      }
    } catch (error) {
      console.error("Error loading repayments:", error);
    }
  };

  // Load analytics (admin only)
  const loadAnalytics = async () => {
    if (!isAdmin) return;

    try {
      const response = await fetch("/api/loans?type=analytics");
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
  };

  const handleNewLoanApplication = () => {
    setShowLoanApplicationDialog(true);
  };

  const handleViewApplication = (id: string) => {
    router.push(`/loans/applications/${id}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "disbursed":
        return <Badge className="bg-blue-100 text-blue-800">Disbursed</Badge>;
      case "under_review":
        return (
          <Badge className="bg-purple-100 text-purple-800">Under Review</Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <ModernDashboardLayout>
      <Head>
        <title>Loan Management | HR Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Loan Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage employee loans, applications, and repayments
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={loadDashboardData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              onClick={handleNewLoanApplication}
              className="flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Apply for Loan
            </Button>
            {isAdmin && (
              <Button
                variant="outline"
                onClick={() => router.push("/loans/settings")}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Loan Settings
              </Button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedTab("overview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab("applications")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === "applications"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setSelectedTab("my-loans")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === "my-loans"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              My Loans
            </button>
            {isAdmin && (
              <button
                onClick={() => setSelectedTab("management")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "management"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Management
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {selectedTab === "overview" && (
            <>
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Active Loans
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.approved_applications || 0}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <CreditCard className="w-5 h-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Disbursed Amount
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(analytics.total_disbursed || 0)}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <DollarSign className="w-5 h-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Pending Applications
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.pending_applications || 0}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <Clock className="w-5 h-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Total Applications
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.total_applications || 0}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Calendar className="w-5 h-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Rejected
                        </p>
                        <p className="text-2xl font-bold text-red-600">
                          {analytics.rejected_applications || 0}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Loan Programs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Available Loan Programs</span>
                    {isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/loans/settings")}
                      >
                        Manage Programs
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-gray-600">
                        Loading loan programs...
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {loanPrograms.map((program) => (
                        <div
                          key={program.id}
                          className="border rounded-lg p-4 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold">
                              {program.name}
                            </h3>
                            <Badge className="bg-blue-100 text-blue-800">
                              {program.interest_rate_min}%-
                              {program.interest_rate_max}%
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div>
                              <span className="text-gray-500">
                                Amount Range:
                              </span>
                            </div>
                            <div>
                              {formatCurrency(program.min_amount)} -{" "}
                              {formatCurrency(program.max_amount)}
                            </div>
                            <div>
                              <span className="text-gray-500">Term:</span>
                            </div>
                            <div>
                              {program.min_term_months}-
                              {program.max_term_months} months
                            </div>
                            <div>
                              <span className="text-gray-500">
                                Eligibility:
                              </span>
                            </div>
                            <div>{program.eligibility_criteria}</div>
                          </div>
                          <div className="mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowLoanApplicationDialog(true)}
                            >
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Recent Applications</span>
                    <Button
                      variant="link"
                      onClick={() => router.push("/loans/applications")}
                      className="text-blue-600"
                    >
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-gray-600">
                        Loading applications...
                      </span>
                    </div>
                  ) : recentApplications.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              ID
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              Employee
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              Type
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              Amount
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              Date
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              Status
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentApplications.map((app) => (
                            <tr
                              key={app.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">{app.id}</td>
                              <td className="py-3 px-4">
                                {app.employee_name || "N/A"}
                              </td>
                              <td className="py-3 px-4">{app.loan_type}</td>
                              <td className="py-3 px-4">
                                {formatCurrency(app.amount)}
                              </td>
                              <td className="py-3 px-4">
                                {formatDate(app.application_date)}
                              </td>
                              <td className="py-3 px-4">
                                {getStatusBadge(app.status)}
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewApplication(app.id)}
                                >
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No recent applications found</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Repayments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Upcoming Repayments</span>
                    <Button
                      variant="link"
                      onClick={() => router.push("/loans/repayment-schedule")}
                      className="text-blue-600"
                    >
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-gray-600">
                        Loading repayments...
                      </span>
                    </div>
                  ) : upcomingRepayments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              Payment ID
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              Loan ID
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              Amount
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              Due Date
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              Status
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingRepayments.map((payment) => (
                            <tr
                              key={payment.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">{payment.id}</td>
                              <td className="py-3 px-4">{payment.loan_id}</td>
                              <td className="py-3 px-4">
                                {formatCurrency(payment.amount)}
                              </td>
                              <td className="py-3 px-4">
                                {formatDate(payment.due_date)}
                              </td>
                              <td className="py-3 px-4">
                                {getStatusBadge(payment.status)}
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    router.push(
                                      `/loans/repayment-schedule/${payment.loan_id}`,
                                    )
                                  }
                                >
                                  Details
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No upcoming repayments found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {selectedTab === "applications" && (
            <Card>
              <CardHeader>
                <CardTitle>Loan Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-6 text-gray-500">
                  Applications tab content will be displayed here. You'll be
                  able to view all loan applications, filter them by status, and
                  manage them.
                </p>
                <div className="flex justify-center">
                  <Button onClick={() => router.push("/loans/applications")}>
                    View All Applications
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === "my-loans" && (
            <Card>
              <CardHeader>
                <CardTitle>My Active Loans</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-6 text-gray-500">
                  My Loans tab content will be displayed here. You'll be able to
                  view your active loans, repayment schedules, and make
                  payments.
                </p>
                <div className="flex justify-center">
                  <Button onClick={() => router.push("/loans/my-loans")}>
                    View My Loans
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === "management" && (
            <Card>
              <CardHeader>
                <CardTitle>Loan Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-6 text-gray-500">
                  Management tab content will be displayed here. You'll be able
                  to approve/reject applications, manage loan programs, and view
                  reports.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => router.push("/loans/management")}>
                    View Management Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/loans/applications")}
                  >
                    Manage Applications
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Loan Application Dialog */}
      <LoanApplicationDialog
        isOpen={showLoanApplicationDialog}
        onClose={() => setShowLoanApplicationDialog(false)}
        onSuccess={(applicationData) => {
          // Handle successful application submission
          console.log("Loan application submitted:", applicationData);
          setShowLoanApplicationDialog(false);
          // Refresh data
          loadDashboardData();
          // Show success message
          alert(
            "Loan application submitted successfully! You will be notified about the status soon.",
          );
        }}
      />
    </ModernDashboardLayout>
  );
}
