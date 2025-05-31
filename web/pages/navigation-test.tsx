import React, { useState } from "react";

import Head from "next/head";
import Link from "next/link";

import { CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// All navigation links to test
const allNavigationLinks = [
  // Dashboard
  { category: "Dashboard", name: "Main Dashboard", href: "/dashboard" },

  // People
  { category: "People", name: "All Employees", href: "/people" },
  { category: "People", name: "Add Employee", href: "/people/add" },
  { category: "People", name: "Employee Profile", href: "/employee/profile" },
  { category: "People", name: "Organization Chart", href: "/org-chart" },
  { category: "People", name: "Teams", href: "/teams" },
  { category: "People", name: "Onboarding", href: "/onboarding" },
  { category: "People", name: "Offboarding", href: "/offboarding" },

  // Recruitment
  { category: "Recruitment", name: "Job Openings", href: "/jobs" },
  { category: "Recruitment", name: "Applications", href: "/applications" },
  { category: "Recruitment", name: "Interviews", href: "/interviews" },
  { category: "Recruitment", name: "Offers", href: "/offers" },
  {
    category: "Recruitment",
    name: "Recruitment Analytics",
    href: "/recruitment/analytics",
  },
  { category: "Recruitment", name: "Careers Page", href: "/careers" },

  // Leave & Time
  { category: "Leave & Time", name: "My Leave", href: "/leave" },
  {
    category: "Leave & Time",
    name: "Leave Approvals",
    href: "/leave/approvals",
  },
  { category: "Leave & Time", name: "Leave Calendar", href: "/leave/calendar" },
  {
    category: "Leave & Time",
    name: "Time & Attendance",
    href: "/time-attendance",
  },
  { category: "Leave & Time", name: "Calendar", href: "/calendar" },

  // Learning & Development
  {
    category: "Learning & Development",
    name: "Training Courses",
    href: "/training",
  },
  {
    category: "Learning & Development",
    name: "Learning Portal",
    href: "/learning",
  },
  {
    category: "Learning & Development",
    name: "Employee Learning",
    href: "/employee/learning-portal",
  },
  {
    category: "Learning & Development",
    name: "Skills Management",
    href: "/skills",
  },
  {
    category: "Learning & Development",
    name: "Performance",
    href: "/performance",
  },

  // Finance & Payroll
  { category: "Finance & Payroll", name: "Payroll", href: "/payroll" },
  { category: "Finance & Payroll", name: "Payslips", href: "/payslips" },
  { category: "Finance & Payroll", name: "Benefits", href: "/benefits" },
  { category: "Finance & Payroll", name: "Expenses", href: "/expenses" },
  { category: "Finance & Payroll", name: "Loans", href: "/loans" },
  { category: "Finance & Payroll", name: "Assets", href: "/assets" },

  // Employee Experience
  {
    category: "Employee Experience",
    name: "Request Panel",
    href: "/employee/request-panel",
  },
  { category: "Employee Experience", name: "Requests", href: "/requests" },
  {
    category: "Employee Experience",
    name: "Wellness Tracker",
    href: "/employee/wellness-tracker",
  },
  {
    category: "Employee Experience",
    name: "Team Collaboration",
    href: "/employee/team-collaboration",
  },
  {
    category: "Employee Experience",
    name: "Recognition",
    href: "/recognition",
  },
  {
    category: "Employee Experience",
    name: "Employee Surveys",
    href: "/employee-surveys",
  },

  // Workflows & Tasks
  { category: "Workflows & Tasks", name: "Workflows", href: "/workflows" },
  { category: "Workflows & Tasks", name: "Tasks", href: "/tasks" },
  { category: "Workflows & Tasks", name: "Approvals", href: "/approvals" },
  {
    category: "Workflows & Tasks",
    name: "Role & Workflow Mgmt",
    href: "/role-workflow-management",
  },
  {
    category: "Workflows & Tasks",
    name: "Onboarding Tasks",
    href: "/onboarding-tasks",
  },

  // Reports & Analytics
  {
    category: "Reports & Analytics",
    name: "HR Analytics",
    href: "/hr-analytics",
  },
  {
    category: "Reports & Analytics",
    name: "Financial Reports",
    href: "/reports/financial",
  },
  {
    category: "Reports & Analytics",
    name: "Workforce Reports",
    href: "/reports/workforce",
  },
  {
    category: "Reports & Analytics",
    name: "Compliance Reports",
    href: "/reports/compliance",
  },
  {
    category: "Reports & Analytics",
    name: "Recruitment Reports",
    href: "/recruitment/reports",
  },
  { category: "Reports & Analytics", name: "All Reports", href: "/reports" },

  // Facilities & Safety
  { category: "Facilities & Safety", name: "Facilities", href: "/facilities" },
  { category: "Facilities & Safety", name: "Room Bookings", href: "/bookings" },
  {
    category: "Facilities & Safety",
    name: "Safety Management",
    href: "/safety",
  },
  {
    category: "Facilities & Safety",
    name: "Equipment",
    href: "/facilities/equipment",
  },
  { category: "Facilities & Safety", name: "Incidents", href: "/incidents" },

  // Compliance & Documents
  {
    category: "Compliance & Documents",
    name: "Compliance",
    href: "/compliance",
  },
  { category: "Compliance & Documents", name: "Documents", href: "/documents" },
  {
    category: "Compliance & Documents",
    name: "Exit Management",
    href: "/exit-management",
  },
  {
    category: "Compliance & Documents",
    name: "Grievances",
    href: "/grievances",
  },

  // Administration
  { category: "Administration", name: "Admin Panel", href: "/admin" },
  {
    category: "Administration",
    name: "User Management",
    href: "/admin/user-management",
  },
  { category: "Administration", name: "Settings", href: "/settings" },
  { category: "Administration", name: "Logs", href: "/logs" },
  {
    category: "Administration",
    name: "Setup Validation",
    href: "/setup-validation",
  },
];

export default function NavigationTest() {
  const [testedLinks, setTestedLinks] = useState<Record<string, boolean>>({});

  const groupedLinks = allNavigationLinks.reduce(
    (groups, link) => {
      if (!groups[link.category]) {
        groups[link.category] = [];
      }
      groups[link.category].push(link);
      return groups;
    },
    {} as Record<string, typeof allNavigationLinks>,
  );

  const handleLinkTest = (href: string) => {
    setTestedLinks((prev) => ({ ...prev, [href]: true }));
  };

  return (
    <>
      <Head>
        <title>Navigation Test | HR Portal</title>
        <meta
          name="description"
          content="Test all navigation links and routing"
        />
      </Head>

      <ModernDashboardLayout
        title="Navigation Test"
        subtitle="Verify all navigation links and routing work correctly"
        actions={
          <div className="flex space-x-2">
            <Button onClick={() => setTestedLinks({})} variant="outline">
              Reset Tests
            </Button>
            <Button>
              {Object.keys(testedLinks).length}/{allNavigationLinks.length}{" "}
              Tested
            </Button>
          </div>
        }
      >
        <div className="space-y-8">
          {/* Navigation Status */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">
                🧭 Navigation System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {allNavigationLinks.length}
                  </div>
                  <div className="text-sm text-blue-800">
                    Total Navigation Links
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {Object.keys(groupedLinks).length}
                  </div>
                  <div className="text-sm text-green-800">
                    Navigation Categories
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {Object.keys(testedLinks).length}
                  </div>
                  <div className="text-sm text-purple-800">Links Tested</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Categories */}
          {Object.entries(groupedLinks).map(([category, links]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>{category}</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {links.length} links
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {links.map((link) => (
                    <div
                      key={link.href}
                      className="flex items-center space-x-2"
                    >
                      <Link
                        href={link.href}
                        onClick={() => handleLinkTest(link.href)}
                        className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex-1"
                      >
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                        <span className="flex-1">{link.name}</span>
                        {testedLinks[link.href] && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Testing Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Click each link to test
                    </h4>
                    <p className="text-sm text-gray-600">
                      Each link will open in the same tab and mark as tested
                      when clicked
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Check for routing issues
                    </h4>
                    <p className="text-sm text-gray-600">
                      Verify each page loads correctly and displays the expected
                      content
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Use browser back button
                    </h4>
                    <p className="text-sm text-gray-600">
                      Return to this page after testing each link to continue
                      testing
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access Demo Pages */}
          <Card>
            <CardHeader>
              <CardTitle>🚀 Quick Access - Demo Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/ui-demo" className="block">
                  <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-medium text-gray-900">
                      UI Demo
                    </span>
                  </div>
                </Link>
                <Link href="/modern-ui-showcase" className="block">
                  <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-medium text-gray-900">
                      UI Showcase
                    </span>
                  </div>
                </Link>
                <Link href="/set-mock-auth" className="block">
                  <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-medium text-gray-900">
                      Mock Auth
                    </span>
                  </div>
                </Link>
                <Link href="/dashboard" className="block">
                  <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-medium text-gray-900">
                      Dashboard
                    </span>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </ModernDashboardLayout>
    </>
  );
}
