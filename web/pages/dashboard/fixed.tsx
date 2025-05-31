import React from "react";

import Link from "next/link";

// Icons imported individually to avoid potential tree-shaking issues
import { Users } from "lucide-react";
import { Briefcase } from "lucide-react";
import { BarChart3 } from "lucide-react";
import { CalendarDays } from "lucide-react";
import { Award } from "lucide-react";
import { FileText } from "lucide-react";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Fixed Dashboard - Rewritten to avoid the component fetch abort error
export default function DashboardFixed() {
  // Move data outside of render to avoid potential issues
  const stats = [
    {
      title: "Total Employees",
      value: "156",
      icon: React.createElement(Users, { className: "h-6 w-6 text-blue-600" }),
    },
    {
      title: "Open Positions",
      value: "12",
      icon: React.createElement(Briefcase, {
        className: "h-6 w-6 text-green-600",
      }),
    },
    {
      title: "Pending Approvals",
      value: "8",
      icon: React.createElement(CalendarDays, {
        className: "h-6 w-6 text-yellow-600",
      }),
    },
  ];

  const modules = [
    {
      title: "HR Analytics",
      description:
        "View detailed analytics about employees, performance, and recruitment.",
      href: "/hr-analytics",
      icon: React.createElement(BarChart3, {
        className: "h-8 w-8 text-blue-600",
      }),
    },
    {
      title: "Recruitment",
      description: "Manage job postings, applicants, and hiring workflows.",
      href: "/jobs",
      icon: React.createElement(Briefcase, {
        className: "h-8 w-8 text-green-600",
      }),
    },
    {
      title: "Employee Directory",
      description: "Browse and manage employee profiles and information.",
      href: "/people",
      icon: React.createElement(Users, {
        className: "h-8 w-8 text-purple-600",
      }),
    },
    {
      title: "Leave Management",
      description: "Handle employee time off requests and approvals.",
      href: "/leave",
      icon: React.createElement(CalendarDays, {
        className: "h-8 w-8 text-red-600",
      }),
    },
    {
      title: "Performance",
      description: "Track employee performance and conduct reviews.",
      href: "/performance",
      icon: React.createElement(Award, {
        className: "h-8 w-8 text-orange-600",
      }),
    },
    {
      title: "Reports",
      description: "Generate and view company reports and insights.",
      href: "/reports",
      icon: React.createElement(FileText, {
        className: "h-8 w-8 text-teal-600",
      }),
    },
  ];

  return (
    <ModernDashboardLayout
      title="Dashboard"
      subtitle="Welcome to your HR Portal dashboard"
    >
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={`stat-${index}`}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Modules */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Modules & Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((item, index) => (
              <Link
                key={`module-${index}`}
                href={item.href}
                className="block group"
              >
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

        {/* Status indicator */}
        <div
          style={{
            padding: "10px",
            backgroundColor: "#d4edda",
            border: "1px solid #c3e6cb",
            borderRadius: "5px",
          }}
        >
          <p>
            <strong>✅ Fixed Dashboard:</strong> This version should work
            without the "Abort fetching component" error!
          </p>
        </div>
      </div>
    </ModernDashboardLayout>
  );
}
