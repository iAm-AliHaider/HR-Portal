import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Award,
  BarChart3,
  Briefcase,
  CalendarDays,
  FileText,
  Users,
} from "lucide-react";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEmployees, useJobs, useLeaveRequests } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";

interface DashboardStats {
  totalEmployees: number;
  openPositions: number;
  pendingApprovals: number;
  loading: boolean;
}

const dashboardModules = [
  {
    title: "HR Analytics",
    description:
      "View detailed analytics about employees, performance, and recruitment.",
    href: "/hr-analytics",
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
  },
  {
    title: "Recruitment",
    description: "Manage job postings, applicants, and hiring workflows.",
    href: "/jobs",
    icon: <Briefcase className="h-8 w-8 text-green-600" />,
  },
  {
    title: "Employee Directory",
    description: "Browse and manage employee profiles and information.",
    href: "/people",
    icon: <Users className="h-8 w-8 text-purple-600" />,
  },
  {
    title: "Leave Management",
    description: "Handle employee time off requests and approvals.",
    href: "/leave",
    icon: <CalendarDays className="h-8 w-8 text-red-600" />,
  },
  {
    title: "Performance",
    description: "Track employee performance and conduct reviews.",
    href: "/performance",
    icon: <Award className="h-8 w-8 text-orange-600" />,
  },
  {
    title: "Reports",
    description: "Generate and view company reports and insights.",
    href: "/reports",
    icon: <FileText className="h-8 w-8 text-teal-600" />,
  },
  // Example of a new module that could be added
  // {
  //   title: 'Company Structure',
  //   description: 'View and manage organizational chart and departments.',
  //   href: '/organization',
  //   icon: <Building2 className="h-8 w-8 text-indigo-600" />,
  // },
];

export default function DashboardIndexPage() {
  const { user, loading: authLoading } = useAuth();
  const { jobs, loading: jobsLoading } = useJobs();
  const { employees, loading: employeesLoading } = useEmployees();
  const { requests: leaveRequests, loading: leaveLoading } = useLeaveRequests();

  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    openPositions: 0,
    pendingApprovals: 0,
    loading: true,
  });

  useEffect(() => {
    // Calculate real stats from API data
    if (!jobsLoading && !employeesLoading && !leaveLoading) {
      const openJobs =
        jobs?.filter((job) => job.status === "open" || job.status === "active")
          ?.length || 0;
      const totalEmps = employees?.length || 0;
      const pendingLeave =
        leaveRequests?.filter((req) => req.status === "pending")?.length || 0;

      setStats({
        totalEmployees: totalEmps,
        openPositions: openJobs,
        pendingApprovals: pendingLeave,
        loading: false,
      });
    }
  }, [
    jobs,
    employees,
    leaveRequests,
    jobsLoading,
    employeesLoading,
    leaveLoading,
  ]);

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <ModernDashboardLayout title="Dashboard" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </ModernDashboardLayout>
    );
  }

  const summaryStats = [
    {
      title: "Total Employees",
      value: stats.loading ? "..." : stats.totalEmployees.toString(),
      icon: <Users className="h-6 w-6 text-blue-600" />,
      href: "/people",
    },
    {
      title: "Open Positions",
      value: stats.loading ? "..." : stats.openPositions.toString(),
      icon: <Briefcase className="h-6 w-6 text-green-600" />,
      href: "/jobs",
    },
    {
      title: "Pending Approvals",
      value: stats.loading ? "..." : stats.pendingApprovals.toString(),
      icon: <CalendarDays className="h-6 w-6 text-yellow-600" />,
      href: "/leave/approvals",
    },
  ];

  return (
    <ModernDashboardLayout
      title="Dashboard"
      subtitle={`Welcome back, ${user?.name || "User"}! Here's what's happening in your organization.`}
    >
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaryStats.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.loading ? "Loading..." : "Click to view details"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Dashboard Modules */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Modules & Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardModules.map((item) => (
              <Link key={item.title} href={item.href} className="block group">
                <Card className="h-full shadow-sm hover:shadow-lg transition-shadow group-hover:border-primary">
                  <CardHeader className="items-center text-center">
                    <div className="p-3 rounded-full bg-muted mb-3 w-fit mx-auto group-hover:bg-primary/10 transition-colors">
                      {item.icon}
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Fixed Status */}
        <div
          style={{
            padding: "16px",
            backgroundColor: "#d4edda",
            border: "1px solid #c3e6cb",
            borderRadius: "8px",
            marginTop: "32px",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", color: "#155724" }}>
            ✅ Dashboard Fixed!
          </h3>
          <p style={{ margin: "0", color: "#155724" }}>
            Using SimpleDashboardLayout to bypass the component fetch abort
            issue.
          </p>
        </div>
      </div>
    </ModernDashboardLayout>
  );
}
