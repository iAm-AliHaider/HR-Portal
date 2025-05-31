import React, { useState, useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import {
  ChartPie,
  CreditCard,
  Users,
  Settings,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  BarChart,
  Eye,
  FileText,
  User,
} from "lucide-react";
import { GetServerSideProps } from "next";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

// Mock analytics data
const LOAN_ANALYTICS = {
  totalActive: 42,
  totalAmount: 4250000,
  totalPending: 8,
  totalOverdue: 3,
  monthlyDisbursement: 560000,
  monthlyRepayment: 380000,
  approvalRate: 87,
  popularTypes: [
    { type: "Personal Loan", count: 18, amount: 1580000 },
    { type: "Education Loan", count: 12, amount: 1200000 },
    { type: "Home Loan", count: 8, amount: 1200000 },
    { type: "Emergency Loan", count: 4, amount: 270000 },
  ],
  recentActivity: [
    {
      id: "LN-2023-042",
      employee: "Riley Morgan",
      action: "Application Submitted",
      date: "2023-03-15T10:30:00",
      type: "Personal Loan",
    },
    {
      id: "LN-2023-041",
      employee: "Casey Brown",
      action: "Loan Approved",
      date: "2023-03-14T16:15:00",
      type: "Education Loan",
    },
    {
      id: "LN-2023-039",
      employee: "Alex Johnson",
      action: "Payment Received",
      date: "2023-03-14T09:45:00",
      type: "Personal Loan",
    },
    {
      id: "LN-2023-037",
      employee: "Taylor Wilson",
      action: "Application Rejected",
      date: "2023-03-13T14:20:00",
      type: "Home Loan",
    },
    {
      id: "LN-2023-036",
      employee: "Jamie Smith",
      action: "Documents Uploaded",
      date: "2023-03-13T11:10:00",
      type: "Emergency Loan",
    },
  ],
  monthlyStats: [
    { month: "Jan", applications: 12, approvals: 10, disbursements: 8 },
    { month: "Feb", applications: 15, approvals: 13, disbursements: 11 },
    { month: "Mar", applications: 10, approvals: 8, disbursements: 7 },
  ],
};

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default function LoanManagementDashboard() {
  const router = useRouter();
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [applications, setApplications] = useState([]);
  const [userLoans, setUserLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has admin rights
  const isAdmin =
    role === "admin" || role === "hr_director" || role === "finance_manager";

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Check if user has access
  if (!isAdmin) {
    return (
      <ModernDashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Restricted
          </h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the loan management dashboard.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </ModernDashboardLayout>
    );
  }

  // Load applications and loans data
  useEffect(() => {
    if (activeTab === "applications") {
      loadApplications();
    } else if (activeTab === "my-loans") {
      loadUserLoans();
    }
  }, [activeTab]);

  // Load loan applications
  const loadApplications = async () => {
    if (!isAdmin) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/loans?type=applications");
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        // Fallback mock data
        const mockApps = [
          {
            id: "LN-2024-001",
            employee_name: "John Smith",
            loan_type: "Personal Loan",
            amount: 50000,
            status: "pending",
            application_date: "2024-01-15",
          },
          {
            id: "LN-2024-002",
            employee_name: "Sarah Johnson",
            loan_type: "Education Loan",
            amount: 100000,
            status: "approved",
            application_date: "2024-01-10",
          },
        ];
        setApplications(mockApps);
      }
    } catch (error) {
      console.error("Error loading applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load user loans
  const loadUserLoans = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/loans?type=user-loans");
      if (response.ok) {
        const data = await response.json();
        setUserLoans(data);
      } else {
        // Fallback mock data
        const mockLoans = [
          {
            id: "LN-2024-001",
            loan_type: "Personal Loan",
            amount: 50000,
            status: "active",
            disbursement_date: "2024-01-20",
            remaining_balance: 45000,
            monthly_emi: 2250,
          },
        ];
        setUserLoans(mockLoans);
      }
    } catch (error) {
      console.error("Error loading user loans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModernDashboardLayout>
      <Head>
        <title>Loan Management Dashboard | HR Portal</title>
        <meta
          name="description"
          content="Admin dashboard for loan management"
        />
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Loan Management Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Overview and management of the company loan program
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ChartPie className="h-4 w-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "applications"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <CreditCard className="h-4 w-4" />
              Applications
            </button>
            <button
              onClick={() => setActiveTab("my-loans")}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "my-loans"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <User className="h-4 w-4" />
              My Loans
            </button>
            <button
              onClick={() => setActiveTab("repayments")}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "repayments"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Repayments
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Settings className="h-4 w-4" />
              Program Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Active Loans
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {LOAN_ANALYTICS.totalActive}
                        </p>
                      </div>
                      <div className="p-2 bg-green-100 rounded-full">
                        <CreditCard className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">+4%</span>
                      <span className="text-gray-500 ml-1">
                        from last month
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Total Amount
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {formatCurrency(LOAN_ANALYTICS.totalAmount)}
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-full">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">+12%</span>
                      <span className="text-gray-500 ml-1">
                        from last month
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Pending Applications
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {LOAN_ANALYTICS.totalPending}
                        </p>
                      </div>
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      <ArrowDownRight className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">-2</span>
                      <span className="text-gray-500 ml-1">from last week</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Overdue Payments
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {LOAN_ANALYTICS.totalOverdue}
                        </p>
                      </div>
                      <div className="p-2 bg-red-100 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      <ArrowUpRight className="w-4 h-4 text-red-500 mr-1" />
                      <span className="text-red-500 font-medium">+1</span>
                      <span className="text-gray-500 ml-1">
                        from last month
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Disbursement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">
                          {formatCurrency(LOAN_ANALYTICS.monthlyDisbursement)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">This month</p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <ArrowUpRight className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Repayment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">
                          {formatCurrency(LOAN_ANALYTICS.monthlyRepayment)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">This month</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <ArrowDownRight className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Approval Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">
                          {LOAN_ANALYTICS.approvalRate}%
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Last 30 days
                        </p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full">
                        <CheckCircle className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Popular Loan Types & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Popular Loan Types</CardTitle>
                    <CardDescription>
                      Distribution of active loans by type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {LOAN_ANALYTICS.popularTypes.map((type, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full mr-2 bg-${["blue", "green", "purple", "yellow"][index]}-500`}
                            ></div>
                            <span className="text-sm font-medium">
                              {type.type}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                              {type.count} loans
                            </span>
                            <span className="text-sm font-medium">
                              {formatCurrency(type.amount)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push("/loans/settings")}
                      >
                        Manage Loan Types
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest loan program activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {LOAN_ANALYTICS.recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-start"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {activity.action}
                            </p>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <span>{activity.id}</span>
                              <span>•</span>
                              <span>{activity.employee}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            {formatDate(activity.date)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push("/loans/applications")}
                      >
                        View All Applications
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Applications Tab */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Loan Applications
                  </h2>
                  <p className="text-gray-600">
                    Review and manage employee loan applications
                  </p>
                </div>
                <Button
                  onClick={loadApplications}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Refresh Applications
                </Button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600">
                    Loading applications...
                  </span>
                </div>
              ) : applications.length > 0 ? (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Application ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Employee
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Loan Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date Applied
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {app.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {app.employee_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {app.loan_type}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(app.amount)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge
                                  className={
                                    app.status === "approved"
                                      ? "bg-green-100 text-green-800"
                                      : app.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : app.status === "rejected"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {app.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(app.application_date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    router.push(`/loans/applications/${app.id}`)
                                  }
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Applications Found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      There are currently no loan applications to review.
                    </p>
                    <Button onClick={() => router.push("/loans/applications")}>
                      View All Applications
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* My Loans Tab */}
          {activeTab === "my-loans" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    My Active Loans
                  </h2>
                  <p className="text-gray-600">
                    View and manage your personal loans
                  </p>
                </div>
                <Button
                  onClick={loadUserLoans}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Refresh Loans
                </Button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600">
                    Loading your loans...
                  </span>
                </div>
              ) : userLoans.length > 0 ? (
                <div className="grid gap-6">
                  {userLoans.map((loan) => (
                    <Card key={loan.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {loan.loan_type}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Loan ID: {loan.id}
                            </p>
                          </div>
                          <Badge
                            className={
                              loan.status === "active"
                                ? "bg-green-100 text-green-800"
                                : loan.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : loan.status === "overdue"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                            }
                          >
                            {loan.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-gray-500">
                              Total Amount
                            </span>
                            <p className="font-semibold">
                              {formatCurrency(loan.amount)}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">
                              Remaining Balance
                            </span>
                            <p className="font-semibold">
                              {formatCurrency(loan.remaining_balance)}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">
                              Monthly EMI
                            </span>
                            <p className="font-semibold">
                              {formatCurrency(loan.monthly_emi)}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">
                              Disbursed On
                            </span>
                            <p className="font-semibold">
                              {formatDate(loan.disbursement_date)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex-1 mr-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Repayment Progress</span>
                              <span>
                                {Math.round(
                                  ((loan.amount - loan.remaining_balance) /
                                    loan.amount) *
                                    100,
                                )}
                                %
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${((loan.amount - loan.remaining_balance) / loan.amount) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/loans/repayment-schedule/${loan.id}`,
                                )
                              }
                            >
                              View Schedule
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/loans/${loan.id}`)}
                            >
                              Loan Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Active Loans
                    </h3>
                    <p className="text-gray-600 mb-4">
                      You don't have any active loans at the moment.
                    </p>
                    <Button onClick={() => router.push("/loans")}>
                      Explore Loan Options
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Repayments Tab */}
          {activeTab === "repayments" && (
            <Card>
              <CardHeader>
                <CardTitle>Loan Repayments</CardTitle>
                <CardDescription>
                  Monitor loan repayment schedules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    To manage loan repayments, navigate to the dedicated
                    repayment schedule page:
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => router.push("/loans/repayment-schedule")}
                      className="flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      View Repayment Schedules
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("overview")}
                      className="flex items-center gap-2"
                    >
                      <ChartPie className="w-4 h-4" />
                      Back to Overview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Loan Program Settings</CardTitle>
                <CardDescription>
                  Configure the company loan program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    To manage loan program settings, navigate to the dedicated
                    settings page:
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => router.push("/loans/settings")}
                      className="flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Manage Loan Settings
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("overview")}
                      className="flex items-center gap-2"
                    >
                      <ChartPie className="w-4 h-4" />
                      Back to Overview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ModernDashboardLayout>
  );
}
