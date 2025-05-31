import React, { useState } from "react";

import { useRouter } from "next/router";

import { GetServerSideProps } from "next";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const BenefitsAdministration = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const router = useRouter();
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showManagePlans, setShowManagePlans] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showOpenEnrollment, setShowOpenEnrollment] = useState(false);

  const benefitsMetrics = [
    {
      label: "Total Plans",
      value: "24",
      icon: "📋",
      color: "text-blue-600",
      trend: "up",
    },
    {
      label: "Enrolled Employees",
      value: "238",
      icon: "👥",
      color: "text-green-600",
      trend: "up",
    },
    {
      label: "Annual Cost",
      value: "$2.4M",
      icon: "💰",
      color: "text-orange-600",
      trend: "down",
    },
    {
      label: "Satisfaction Score",
      value: "4.6/5",
      icon: "⭐",
      color: "text-purple-600",
      trend: "up",
    },
  ];

  const benefitPlans = [
    {
      id: "plan-001",
      name: "Premium Health Insurance",
      type: "health",
      category: "Medical",
      provider: "BlueCross BlueShield",
      status: "active",
      enrollmentPeriod: "2024-01-01 to 2024-12-31",
      eligibleEmployees: 247,
      enrolledEmployees: 189,
      enrollmentRate: 76.5,
      monthlyPremium: {
        employee: 285.0,
        employerContribution: 450.0,
        total: 735.0,
      },
      coverage: {
        deductible: 1500,
        outOfPocketMax: 6000,
        coPayPrimary: 25,
        coPaySpecialist: 50,
        prescriptionCoverage: "Tier 1: $10, Tier 2: $25, Tier 3: $50",
      },
      dependentCoverage: true,
      waitingPeriod: "30 days",
      description: "Comprehensive health insurance with nationwide coverage",
    },
    {
      id: "plan-002",
      name: "Standard Dental Plan",
      type: "dental",
      category: "Dental",
      provider: "Delta Dental",
      status: "active",
      enrollmentPeriod: "2024-01-01 to 2024-12-31",
      eligibleEmployees: 247,
      enrolledEmployees: 142,
      enrollmentRate: 57.5,
      monthlyPremium: {
        employee: 45.0,
        employerContribution: 25.0,
        total: 70.0,
      },
      coverage: {
        preventive: "100%",
        basic: "80%",
        major: "50%",
        orthodontics: "50%",
        annualMaximum: 1500,
      },
      dependentCoverage: true,
      waitingPeriod: "0 days",
      description: "Comprehensive dental coverage including preventive care",
    },
    {
      id: "plan-003",
      name: "401(k) Retirement Plan",
      type: "retirement",
      category: "Retirement",
      provider: "Fidelity Investments",
      status: "active",
      enrollmentPeriod: "Immediate",
      eligibleEmployees: 247,
      enrolledEmployees: 198,
      enrollmentRate: 80.2,
      monthlyPremium: {
        employee: 0,
        employerContribution: 0,
        total: 0,
      },
      coverage: {
        employeeContribution: "Up to 15% of salary",
        employerMatch: "100% match up to 6%",
        vestingSchedule: "Immediate vesting",
        loanOption: "Available up to 50% of balance",
      },
      dependentCoverage: false,
      waitingPeriod: "90 days",
      description:
        "Tax-advantaged retirement savings plan with employer matching",
    },
    {
      id: "plan-004",
      name: "Life Insurance",
      type: "life",
      category: "Life & Disability",
      provider: "MetLife",
      status: "active",
      enrollmentPeriod: "2024-01-01 to 2024-12-31",
      eligibleEmployees: 247,
      enrolledEmployees: 221,
      enrollmentRate: 89.5,
      monthlyPremium: {
        employee: 12.0,
        employerContribution: 8.0,
        total: 20.0,
      },
      coverage: {
        basicLife: "2x annual salary",
        additionalLife: "Up to 5x annual salary",
        accidentalDeath: "Equal to life benefit",
        dependentLife: "Spouse: $10,000, Child: $5,000",
      },
      dependentCoverage: true,
      waitingPeriod: "30 days",
      description: "Basic and supplemental life insurance coverage",
    },
    {
      id: "plan-005",
      name: "Flexible Spending Account",
      type: "fsa",
      category: "Tax Advantage",
      provider: "WageWorks",
      status: "active",
      enrollmentPeriod: "2024-01-01 to 2024-12-31",
      eligibleEmployees: 247,
      enrolledEmployees: 76,
      enrollmentRate: 30.8,
      monthlyPremium: {
        employee: 0,
        employerContribution: 0,
        total: 0,
      },
      coverage: {
        healthcareFSA: "Up to $3,200 annually",
        dependentCareFSA: "Up to $5,000 annually",
        carryOver: "$610 max carryover",
        graceperiod: "2.5 months",
      },
      dependentCoverage: false,
      waitingPeriod: "0 days",
      description: "Pre-tax savings for healthcare and dependent care expenses",
    },
  ];

  const employeeBenefits = [
    {
      id: "emp-ben-001",
      employeeId: "EMP-2024-045",
      name: "Sarah Johnson",
      position: "Senior Developer",
      department: "Engineering",
      hireDate: "2022-03-15",
      eligibilityDate: "2022-04-14",
      enrolledPlans: [
        {
          planId: "plan-001",
          planName: "Premium Health Insurance",
          enrollmentDate: "2022-04-14",
          coverageLevel: "Employee + Spouse",
          monthlyPremium: 485.0,
          employeeContribution: 285.0,
          dependents: ["John Johnson (Spouse)"],
        },
        {
          planId: "plan-002",
          planName: "Standard Dental Plan",
          enrollmentDate: "2022-04-14",
          coverageLevel: "Employee + Family",
          monthlyPremium: 95.0,
          employeeContribution: 45.0,
          dependents: ["John Johnson (Spouse)", "Emma Johnson (Child)"],
        },
        {
          planId: "plan-003",
          planName: "401(k) Retirement Plan",
          enrollmentDate: "2022-04-14",
          coverageLevel: "Employee",
          monthlyPremium: 0,
          employeeContribution: 825.0,
          contributionPercentage: 10,
          employerMatch: 495.0,
        },
      ],
      totalMonthlyPremium: 580.0,
      totalEmployerContribution: 958.0,
      benefitsValue: 13896.0,
    },
    {
      id: "emp-ben-002",
      employeeId: "EMP-2024-032",
      name: "Michael Chen",
      position: "Sales Manager",
      department: "Sales",
      hireDate: "2023-01-10",
      eligibilityDate: "2023-02-09",
      enrolledPlans: [
        {
          planId: "plan-001",
          planName: "Premium Health Insurance",
          enrollmentDate: "2023-02-09",
          coverageLevel: "Employee Only",
          monthlyPremium: 735.0,
          employeeContribution: 285.0,
          dependents: [],
        },
        {
          planId: "plan-003",
          planName: "401(k) Retirement Plan",
          enrollmentDate: "2023-02-09",
          coverageLevel: "Employee",
          monthlyPremium: 0,
          employeeContribution: 595.83,
          contributionPercentage: 8.5,
          employerMatch: 425.0,
        },
        {
          planId: "plan-004",
          planName: "Life Insurance",
          enrollmentDate: "2023-02-09",
          coverageLevel: "Employee",
          monthlyPremium: 20.0,
          employeeContribution: 12.0,
          dependents: [],
        },
      ],
      totalMonthlyPremium: 297.0,
      totalEmployerContribution: 883.0,
      benefitsValue: 14196.0,
    },
  ];

  const benefitsClaims = [
    {
      id: "claim-001",
      employeeId: "EMP-2024-045",
      employeeName: "Sarah Johnson",
      planType: "health",
      planName: "Premium Health Insurance",
      claimNumber: "CLM-2024-001245",
      serviceDate: "2024-06-15",
      submissionDate: "2024-06-18",
      provider: "General Hospital",
      serviceDescription: "Annual Physical Examination",
      totalAmount: 450.0,
      coveredAmount: 425.0,
      patientResponsibility: 25.0,
      status: "approved",
      processedDate: "2024-06-20",
      paymentDate: "2024-06-22",
    },
    {
      id: "claim-002",
      employeeId: "EMP-2024-032",
      employeeName: "Michael Chen",
      planType: "dental",
      planName: "Standard Dental Plan",
      claimNumber: "CLM-2024-001246",
      serviceDate: "2024-06-12",
      submissionDate: "2024-06-14",
      provider: "Smile Dental Care",
      serviceDescription: "Dental Cleaning and Examination",
      totalAmount: 185.0,
      coveredAmount: 185.0,
      patientResponsibility: 0,
      status: "approved",
      processedDate: "2024-06-16",
      paymentDate: "2024-06-18",
    },
    {
      id: "claim-003",
      employeeId: "EMP-2024-058",
      employeeName: "Emily Rodriguez",
      planType: "health",
      planName: "Premium Health Insurance",
      claimNumber: "CLM-2024-001247",
      serviceDate: "2024-06-10",
      submissionDate: "2024-06-12",
      provider: "Urgent Care Center",
      serviceDescription: "Emergency Room Visit",
      totalAmount: 1250.0,
      coveredAmount: 1000.0,
      patientResponsibility: 250.0,
      status: "pending",
      processedDate: null,
      paymentDate: null,
    },
  ];

  const openEnrollment = {
    period: "Annual Open Enrollment 2025",
    startDate: "2024-11-01",
    endDate: "2024-11-30",
    effectiveDate: "2025-01-01",
    status: "upcoming",
    eligibleEmployees: 247,
    completedEnrollments: 0,
    pendingEnrollments: 0,
    changesAllowed: ["health", "dental", "vision", "fsa", "life"],
    communicationSchedule: [
      {
        date: "2024-10-01",
        type: "email",
        description: "Open enrollment announcement",
      },
      {
        date: "2024-10-15",
        type: "meeting",
        description: "Benefits fair and information sessions",
      },
      {
        date: "2024-11-15",
        type: "reminder",
        description: "Mid-enrollment reminder",
      },
      {
        date: "2024-11-25",
        type: "final_reminder",
        description: "Final deadline reminder",
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
      case "approved":
      case "enrolled":
        return "bg-green-100 text-green-800";
      case "pending":
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
      case "denied":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBenefitTypeIcon = (type) => {
    switch (type) {
      case "health":
        return "🏥";
      case "dental":
        return "🦷";
      case "vision":
        return "👁️";
      case "retirement":
        return "🏦";
      case "life":
        return "🛡️";
      case "disability":
        return "♿";
      case "fsa":
        return "💳";
      default:
        return "📋";
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Benefits Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {benefitsMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{metric.icon}</span>
                  <div>
                    <div className={`text-2xl font-bold ${metric.color}`}>
                      {metric.value}
                    </div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                  </div>
                </div>
                <div
                  className={`text-xs ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}
                >
                  {metric.trend === "up" ? "↗" : "↘"}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => setShowEnrollModal(true)}
            >
              <span className="text-2xl mb-1">📝</span>
              <span className="text-sm">Enroll Employee</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => setShowManagePlans(true)}
            >
              <span className="text-2xl mb-1">📋</span>
              <span className="text-sm">Manage Plans</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => setShowReports(true)}
            >
              <span className="text-2xl mb-1">📊</span>
              <span className="text-sm">View Reports</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => setShowOpenEnrollment(true)}
            >
              <span className="text-2xl mb-1">📅</span>
              <span className="text-sm">Open Enrollment</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Benefit Plans Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefitPlans.slice(0, 6).map((plan) => (
              <div key={plan.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">
                      {getBenefitTypeIcon(plan.type)}
                    </span>
                    <div>
                      <h3 className="font-medium">{plan.name}</h3>
                      <p className="text-sm text-gray-600">{plan.provider}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(plan.status)}`}
                  >
                    {plan.status.toUpperCase()}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">
                      Enrollment Rate
                    </span>
                    <span className="text-sm font-medium">
                      {plan.enrollmentRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${plan.enrollmentRate}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <div>
                    {plan.enrolledEmployees} / {plan.eligibleEmployees} enrolled
                  </div>
                  <div>Premium: ${plan.monthlyPremium.total}/month</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Open Enrollment & Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Open Enrollment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{openEnrollment.period}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(openEnrollment.startDate).toLocaleDateString()} -{" "}
                    {new Date(openEnrollment.endDate).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(openEnrollment.status)}`}
                >
                  {openEnrollment.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {openEnrollment.eligibleEmployees}
                  </div>
                  <div className="text-sm text-gray-600">
                    Eligible Employees
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {openEnrollment.completedEnrollments}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Communication Schedule</h4>
                <div className="space-y-1">
                  {openEnrollment.communicationSchedule
                    .slice(0, 3)
                    .map((comm, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{new Date(comm.date).toLocaleDateString()}</span>
                        <span className="text-gray-600">
                          {comm.description}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {benefitsClaims.slice(0, 4).map((claim) => (
                <div
                  key={claim.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{claim.employeeName}</div>
                    <div className="text-sm text-gray-600">
                      {claim.serviceDescription}
                    </div>
                    <div className="text-xs text-gray-500">
                      ${claim.totalAmount} •{" "}
                      {new Date(claim.serviceDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(claim.status)}`}
                  >
                    {claim.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPlans = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Benefit Plans</h2>
        <Button>Add New Plan</Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {benefitPlans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">
                    {getBenefitTypeIcon(plan.type)}
                  </span>
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {plan.category} • {plan.provider}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(plan.status)}`}
                >
                  {plan.status.toUpperCase()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{plan.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2">Enrollment Details</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Eligible:</span>{" "}
                      {plan.eligibleEmployees} employees
                    </div>
                    <div>
                      <span className="font-medium">Enrolled:</span>{" "}
                      {plan.enrolledEmployees} employees
                    </div>
                    <div>
                      <span className="font-medium">Rate:</span>{" "}
                      {plan.enrollmentRate}%
                    </div>
                    <div>
                      <span className="font-medium">Waiting Period:</span>{" "}
                      {plan.waitingPeriod}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Premium Structure</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Employee:</span> $
                      {plan.monthlyPremium.employee}/month
                    </div>
                    <div>
                      <span className="font-medium">Employer:</span> $
                      {plan.monthlyPremium.employerContribution}/month
                    </div>
                    <div>
                      <span className="font-medium">Total:</span> $
                      {plan.monthlyPremium.total}/month
                    </div>
                    <div>
                      <span className="font-medium">Dependents:</span>{" "}
                      {plan.dependentCoverage ? "Available" : "Not Available"}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Coverage Highlights</h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(plan.coverage)
                      .slice(0, 4)
                      .map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, " $1")}:
                          </span>{" "}
                          {String(value)}
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">
                    Enrollment Progress
                  </span>
                  <span className="text-sm font-medium">
                    {plan.enrollmentRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${plan.enrollmentRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedPlan(plan)}
                >
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Edit Plan
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  View Enrollees
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderEmployees = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Employee Benefits</h2>
        <div className="flex gap-2">
          <select className="border rounded-md px-3 py-2 text-sm">
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Sales</option>
            <option>Marketing</option>
            <option>HR</option>
          </select>
          <Button>Export Benefits Data</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {employeeBenefits.map((employee) => (
          <Card key={employee.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{employee.name}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {employee.position} • {employee.department}
                  </p>
                  <p className="text-xs text-gray-500">
                    ID: {employee.employeeId}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  View Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Hire Date:</span>
                    <div className="font-medium">
                      {new Date(employee.hireDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Eligibility Date:</span>
                    <div className="font-medium">
                      {new Date(employee.eligibilityDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Monthly Premium:</span>
                    <div className="font-medium">
                      ${employee.totalMonthlyPremium}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Annual Value:</span>
                    <div className="font-medium">
                      ${employee.benefitsValue.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">
                    Enrolled Plans ({employee.enrolledPlans.length})
                  </h4>
                  <div className="space-y-1">
                    {employee.enrolledPlans.map((plan, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-2">
                            {getBenefitTypeIcon(
                              plan.planId.includes("001")
                                ? "health"
                                : plan.planId.includes("002")
                                  ? "dental"
                                  : "retirement",
                            )}
                          </span>
                          <span>{plan.planName}</span>
                        </div>
                        <span className="font-medium">
                          ${plan.employeeContribution}/mo
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderClaims = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Benefits Claims</h2>
        <div className="flex gap-2">
          <select className="border rounded-md px-3 py-2 text-sm">
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Denied</option>
          </select>
          <Button>Export Claims</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Claim #</th>
                  <th className="text-left p-4">Employee</th>
                  <th className="text-left p-4">Plan</th>
                  <th className="text-left p-4">Service</th>
                  <th className="text-left p-4">Service Date</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {benefitsClaims.map((claim) => (
                  <tr key={claim.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium">{claim.claimNumber}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{claim.employeeName}</div>
                      <div className="text-sm text-gray-600">
                        {claim.employeeId}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">
                          {getBenefitTypeIcon(claim.planType)}
                        </span>
                        <span>{claim.planName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">
                        {claim.serviceDescription}
                      </div>
                      <div className="text-sm text-gray-600">
                        {claim.provider}
                      </div>
                    </td>
                    <td className="p-4">
                      {new Date(claim.serviceDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="font-medium">${claim.totalAmount}</div>
                      <div className="text-sm text-gray-600">
                        Covered: ${claim.coveredAmount}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(claim.status)}`}
                      >
                        {claim.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        {claim.status === "pending" && (
                          <Button size="sm" variant="outline">
                            Process
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEnrollment = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Open Enrollment</h2>
        <Button>Configure Enrollment</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{openEnrollment.period}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h4 className="font-medium mb-2">Enrollment Period</h4>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">Start Date:</span>{" "}
                  {new Date(openEnrollment.startDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">End Date:</span>{" "}
                  {new Date(openEnrollment.endDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Effective Date:</span>{" "}
                  {new Date(openEnrollment.effectiveDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span
                    className={`ml-1 px-2 py-1 rounded-full text-xs ${getStatusColor(openEnrollment.status)}`}
                  >
                    {openEnrollment.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Enrollment Progress</h4>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">Eligible Employees:</span>{" "}
                  {openEnrollment.eligibleEmployees}
                </div>
                <div>
                  <span className="font-medium">Completed:</span>{" "}
                  {openEnrollment.completedEnrollments}
                </div>
                <div>
                  <span className="font-medium">Pending:</span>{" "}
                  {openEnrollment.pendingEnrollments}
                </div>
                <div>
                  <span className="font-medium">Completion Rate:</span>{" "}
                  {(
                    (openEnrollment.completedEnrollments /
                      openEnrollment.eligibleEmployees) *
                    100
                  ).toFixed(1)}
                  %
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Available Changes</h4>
              <div className="flex flex-wrap gap-1">
                {openEnrollment.changesAllowed.map((change, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize"
                  >
                    {change}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Communication Schedule</h4>
            <div className="space-y-2">
              {openEnrollment.communicationSchedule.map((comm, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{comm.description}</div>
                      <div className="text-sm text-gray-600 capitalize">
                        {comm.type.replace("_", " ")}
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {new Date(comm.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ModernDashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Benefits Administration
          </h1>
          <p className="text-gray-600">
            Manage employee benefits, plans, enrollment, and claims
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { id: "dashboard", label: "Dashboard" },
            { id: "plans", label: "Benefit Plans" },
            { id: "employees", label: "Employee Benefits" },
            { id: "claims", label: "Claims" },
            { id: "enrollment", label: "Open Enrollment" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "plans" && renderPlans()}
        {activeTab === "employees" && renderEmployees()}
        {activeTab === "claims" && renderClaims()}
        {activeTab === "enrollment" && renderEnrollment()}

        {/* Plan Detail Modal */}
        {selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedPlan.name}</h2>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center">
                  <span className="text-4xl mr-4">
                    {getBenefitTypeIcon(selectedPlan.type)}
                  </span>
                  <div>
                    <h3 className="text-lg font-medium">
                      {selectedPlan.category}
                    </h3>
                    <p className="text-gray-600">{selectedPlan.description}</p>
                    <p className="text-sm text-gray-500">
                      Provider: {selectedPlan.provider}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Plan Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Status:</span>
                        <span
                          className={`ml-1 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedPlan.status)}`}
                        >
                          {selectedPlan.status.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Enrollment Period:</span>{" "}
                        {selectedPlan.enrollmentPeriod}
                      </div>
                      <div>
                        <span className="font-medium">Waiting Period:</span>{" "}
                        {selectedPlan.waitingPeriod}
                      </div>
                      <div>
                        <span className="font-medium">Dependent Coverage:</span>{" "}
                        {selectedPlan.dependentCoverage
                          ? "Available"
                          : "Not Available"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Enrollment Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Eligible Employees:</span>{" "}
                        {selectedPlan.eligibleEmployees}
                      </div>
                      <div>
                        <span className="font-medium">Enrolled Employees:</span>{" "}
                        {selectedPlan.enrolledEmployees}
                      </div>
                      <div>
                        <span className="font-medium">Enrollment Rate:</span>{" "}
                        {selectedPlan.enrollmentRate}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Premium Structure</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">
                          Employee Contribution:
                        </span>{" "}
                        ${selectedPlan.monthlyPremium.employee}/month
                      </div>
                      <div>
                        <span className="font-medium">
                          Employer Contribution:
                        </span>{" "}
                        ${selectedPlan.monthlyPremium.employerContribution}
                        /month
                      </div>
                      <div>
                        <span className="font-medium">Total Premium:</span> $
                        {selectedPlan.monthlyPremium.total}/month
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Coverage Details</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(selectedPlan.coverage).map(
                        ([key, value]) => (
                          <div key={key}>
                            <span className="font-medium capitalize">
                              {key.replace(/([A-Z])/g, " $1")}:
                            </span>{" "}
                            {String(value)}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button className="flex-1">Edit Plan</Button>
                <Button variant="outline" className="flex-1">
                  View Enrollees
                </Button>
                <Button variant="outline" className="flex-1">
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Employee Benefits Detail Modal */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {selectedEmployee.name} - Benefits Summary
                </h2>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Employee Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Employee ID:</span>{" "}
                        {selectedEmployee.employeeId}
                      </div>
                      <div>
                        <span className="font-medium">Position:</span>{" "}
                        {selectedEmployee.position}
                      </div>
                      <div>
                        <span className="font-medium">Department:</span>{" "}
                        {selectedEmployee.department}
                      </div>
                      <div>
                        <span className="font-medium">Hire Date:</span>{" "}
                        {new Date(
                          selectedEmployee.hireDate,
                        ).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Eligibility Date:</span>{" "}
                        {new Date(
                          selectedEmployee.eligibilityDate,
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Benefits Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Monthly Premium:</span> $
                        {selectedEmployee.totalMonthlyPremium}
                      </div>
                      <div>
                        <span className="font-medium">
                          Employer Contribution:
                        </span>{" "}
                        ${selectedEmployee.totalEmployerContribution}
                      </div>
                      <div>
                        <span className="font-medium">
                          Annual Benefits Value:
                        </span>{" "}
                        ${selectedEmployee.benefitsValue.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Enrolled Plans:</span>{" "}
                        {selectedEmployee.enrolledPlans.length}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Enrolled Plans</h4>
                  <div className="space-y-3">
                    {selectedEmployee.enrolledPlans.map((plan, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-medium">{plan.planName}</h5>
                            <p className="text-sm text-gray-600">
                              Coverage: {plan.coverageLevel}
                            </p>
                            <p className="text-xs text-gray-500">
                              Enrolled:{" "}
                              {new Date(
                                plan.enrollmentDate,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              ${plan.employeeContribution}/month
                            </div>
                            <div className="text-sm text-gray-600">
                              Employee cost
                            </div>
                          </div>
                        </div>

                        {plan.dependents && plan.dependents.length > 0 && (
                          <div>
                            <h6 className="text-sm font-medium mb-1">
                              Dependents:
                            </h6>
                            <div className="flex flex-wrap gap-1">
                              {plan.dependents.map((dependent, depIndex) => (
                                <span
                                  key={depIndex}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                >
                                  {dependent}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {plan.contributionPercentage && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Contribution:</span>{" "}
                            {plan.contributionPercentage}% of salary
                            {plan.employerMatch && (
                              <span className="text-gray-600">
                                {" "}
                                • Employer match: ${plan.employerMatch}/month
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button className="flex-1">Modify Benefits</Button>
                <Button variant="outline" className="flex-1">
                  View Claims
                </Button>
                <Button variant="outline" className="flex-1">
                  Generate Statement
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add placeholder modals for each action */}
        {showEnrollModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-8 rounded shadow">
              Enroll Employee Modal{" "}
              <button onClick={() => setShowEnrollModal(false)}>Close</button>
            </div>
          </div>
        )}
        {showManagePlans && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-8 rounded shadow">
              Manage Plans Modal{" "}
              <button onClick={() => setShowManagePlans(false)}>Close</button>
            </div>
          </div>
        )}
        {showReports && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-8 rounded shadow">
              View Reports Modal{" "}
              <button onClick={() => setShowReports(false)}>Close</button>
            </div>
          </div>
        )}
        {showOpenEnrollment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-8 rounded shadow">
              Open Enrollment Modal{" "}
              <button onClick={() => setShowOpenEnrollment(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </ModernDashboardLayout>
  );
};

export default BenefitsAdministration;

// Force server-side rendering to prevent SSR issues
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      timestamp: new Date().toISOString(),
    },
  };
};
