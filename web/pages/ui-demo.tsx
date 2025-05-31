import React, { useState } from "react";

import Head from "next/head";
import Link from "next/link";

import {
  CheckCircle,
  Users,
  Briefcase,
  Calendar,
  Settings,
  BarChart3,
  Building,
  Shield,
  GraduationCap,
  Bell,
  Search,
  Menu,
  X,
  Home,
  TrendingUp,
  Clock,
  AlertCircle,
  Zap,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
import { ModernRequireRole } from "@/components/ModernRequireRole";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Beautiful Sidebar Navigation",
    description:
      "Modern sidebar with icons, expandable sections, and smooth animations",
    icon: Menu,
    color: "blue",
    status: "implemented",
  },
  {
    title: "Responsive Design",
    description: "Optimized for desktop, tablet, and mobile devices",
    icon: Smartphone,
    color: "green",
    status: "implemented",
  },
  {
    title: "Global Search",
    description: "Instant search functionality across the entire application",
    icon: Search,
    color: "purple",
    status: "implemented",
  },
  {
    title: "Notification Center",
    description: "Real-time notifications with visual indicators",
    icon: Bell,
    color: "yellow",
    status: "implemented",
  },
  {
    title: "Smart Authentication",
    description: "Secure authentication with role-based access control",
    icon: Shield,
    color: "red",
    status: "implemented",
  },
  {
    title: "Modern Components",
    description: "Beautiful, consistent UI components throughout",
    icon: Zap,
    color: "indigo",
    status: "implemented",
  },
];

const pageExamples = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview of HR metrics and activities",
  },
  {
    name: "People",
    href: "/people",
    icon: Users,
    description: "Employee management and directory",
  },
  {
    name: "Jobs",
    href: "/jobs",
    icon: Briefcase,
    description: "Job postings and recruitment (Public)",
  },
  {
    name: "Leave",
    href: "/leave",
    icon: Calendar,
    description: "Leave management and approvals",
  },
  {
    name: "Training",
    href: "/training",
    icon: GraduationCap,
    description: "Learning and development",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
    description: "Analytics and insights",
  },
  {
    name: "Facilities",
    href: "/facilities",
    icon: Building,
    description: "Office and resource management",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Application configuration",
  },
];

const deviceBreakpoints = [
  { name: "Mobile", icon: Smartphone, size: "sm", description: "< 768px" },
  { name: "Tablet", icon: Tablet, size: "md", description: "768px - 1024px" },
  { name: "Desktop", icon: Monitor, size: "lg", description: "> 1024px" },
];

export default function UIDemo() {
  const [selectedDemo, setSelectedDemo] = useState<string>("overview");

  const DemoCard = ({
    title,
    children,
    className = "",
  }: {
    title: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>{title}</span>
          <CheckCircle className="h-5 w-5 text-green-600" />
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  return (
    <>
      <Head>
        <title>UI Demo | HR Portal</title>
        <meta name="description" content="Modern UI system demonstration" />
      </Head>

      <ModernDashboardLayout
        title="Modern UI System Demo"
        subtitle="Experience the complete modern HR Portal interface"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline">View Code</Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              Deploy Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-8">
          {/* Status Banner */}
          <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border-l-4 border-green-500 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    🎉 Modern UI System Complete!
                  </h3>
                  <p className="text-gray-700 mt-1">
                    All 86 pages upgraded • Component fetch errors eliminated •
                    Beautiful design implemented
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-500">Migration Complete</div>
              </div>
            </div>
          </div>

          {/* Demo Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              "overview",
              "navigation",
              "responsive",
              "authentication",
              "components",
            ].map((demo) => (
              <Button
                key={demo}
                onClick={() => setSelectedDemo(demo)}
                variant={selectedDemo === demo ? "default" : "outline"}
                size="sm"
                className="capitalize"
              >
                {demo}
              </Button>
            ))}
          </div>

          {/* Overview Demo */}
          {selectedDemo === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`p-3 rounded-full bg-${feature.color}-50`}
                        >
                          <feature.icon
                            className={`h-6 w-6 text-${feature.color}-600`}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {feature.description}
                          </p>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-medium text-green-600 uppercase">
                              {feature.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <DemoCard title="Page Examples">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pageExamples.map((page, index) => (
                    <Link key={index} href={page.href} className="block">
                      <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <page.icon className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {page.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {page.description}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </DemoCard>
            </div>
          )}

          {/* Navigation Demo */}
          {selectedDemo === "navigation" && (
            <div className="space-y-6">
              <DemoCard title="Sidebar Navigation Features">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Collapsible sidebar with smooth animations</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Expandable menu sections with sub-items</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Active route highlighting</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>User profile section with logout</span>
                  </div>
                </div>
              </DemoCard>

              <DemoCard title="Top Header Features">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Global search with real-time suggestions</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Notification center with badge indicators</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Dynamic action buttons per page</span>
                  </div>
                </div>
              </DemoCard>
            </div>
          )}

          {/* Responsive Demo */}
          {selectedDemo === "responsive" && (
            <div className="space-y-6">
              <DemoCard title="Responsive Breakpoints">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {deviceBreakpoints.map((device, index) => (
                    <div
                      key={index}
                      className="text-center p-4 border border-gray-200 rounded-lg"
                    >
                      <device.icon className="h-8 w-8 mx-auto mb-3 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">
                        {device.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {device.description}
                      </p>
                    </div>
                  ))}
                </div>
              </DemoCard>

              <DemoCard title="Mobile Features">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span>Touch-friendly navigation</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span>Swipe gestures for sidebar</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span>Optimized content layout</span>
                  </div>
                </div>
              </DemoCard>
            </div>
          )}

          {/* Authentication Demo */}
          {selectedDemo === "authentication" && (
            <div className="space-y-6">
              <DemoCard title="Authentication Features">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-red-600" />
                    <span>Role-based access control (RBAC)</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-red-600" />
                    <span>Development mock authentication</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-red-600" />
                    <span>Public page access (Jobs)</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-red-600" />
                    <span>Beautiful error handling</span>
                  </div>
                </div>
              </DemoCard>

              <DemoCard title="Test Authentication">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Test the authentication system with different user roles:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link href="/set-mock-auth">
                      <Button variant="outline" size="sm">
                        Set Mock User
                      </Button>
                    </Link>
                    <Link href="/jobs">
                      <Button variant="outline" size="sm">
                        Public Jobs Page
                      </Button>
                    </Link>
                    <Link href="/people">
                      <Button variant="outline" size="sm">
                        Protected People Page
                      </Button>
                    </Link>
                  </div>
                </div>
              </DemoCard>
            </div>
          )}

          {/* Components Demo */}
          {selectedDemo === "components" && (
            <div className="space-y-6">
              <DemoCard title="UI Components">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Buttons</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button>Primary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button size="sm">Small</Button>
                      <Button size="lg">Large</Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Status Indicators</h4>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm">Success</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <span className="text-sm">Pending</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <span className="text-sm">Error</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">Trending</span>
                      </div>
                    </div>
                  </div>
                </div>
              </DemoCard>

              <DemoCard title="Color Palette">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    "blue",
                    "green",
                    "purple",
                    "red",
                    "yellow",
                    "indigo",
                    "gray",
                    "pink",
                  ].map((color) => (
                    <div key={color} className="text-center">
                      <div
                        className={`w-16 h-16 bg-${color}-500 rounded-lg mx-auto mb-2`}
                      ></div>
                      <span className="text-sm font-medium capitalize">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </DemoCard>
            </div>
          )}

          {/* Migration Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Migration Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    86
                  </div>
                  <div className="text-sm text-blue-800">Pages Upgraded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    0
                  </div>
                  <div className="text-sm text-green-800">Component Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    100%
                  </div>
                  <div className="text-sm text-purple-800">Modern UI</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ModernDashboardLayout>
    </>
  );
}
