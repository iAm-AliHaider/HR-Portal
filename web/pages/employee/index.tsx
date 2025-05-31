import React from "react";

import Head from "next/head";
import Link from "next/link";

import {
  User,
  Heart,
  Users,
  GraduationCap,
  FileText,
  ArrowRight,
} from "lucide-react";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const employeeServices = [
  {
    title: "My Profile",
    description: "View and update your personal information",
    icon: User,
    href: "/employee/profile",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Wellness Tracker",
    description: "Track your health and wellness goals",
    icon: Heart,
    href: "/employee/wellness-tracker",
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Team Collaboration",
    description: "Connect and collaborate with your team",
    icon: Users,
    href: "/employee/team-collaboration",
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Learning Portal",
    description: "Access training courses and learning materials",
    icon: GraduationCap,
    href: "/employee/learning-portal",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "Request Panel",
    description: "Submit requests and track their status",
    icon: FileText,
    href: "/employee/request-panel",
    color: "bg-orange-50 text-orange-600",
  },
];

export default function EmployeeIndexPage() {
  return (
    <>
      <Head>
        <title>Employee Portal | HR Management</title>
        <meta
          name="description"
          content="Access all employee services and resources"
        />
      </Head>

      <ModernDashboardLayout
        title="Employee Portal"
        subtitle="Access your personal workspace and resources"
      >
        <div className="space-y-8">
          {/* Welcome Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">
                Welcome to Your Employee Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 mb-4">
                Your one-stop destination for all employee services, resources,
                and tools. Manage your profile, track wellness goals,
                collaborate with teammates, and more.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">5</div>
                  <div className="text-sm text-blue-800">
                    Services Available
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    24/7
                  </div>
                  <div className="text-sm text-purple-800">Access Anytime</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    100%
                  </div>
                  <div className="text-sm text-green-800">Self-Service</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employeeServices.map((service) => (
              <Card
                key={service.href}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${service.color}`}>
                      <service.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link href={service.href}>
                    <Button className="w-full group">
                      Access Service
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/leave"
                  className="text-center p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="text-sm font-medium">Leave Requests</div>
                </Link>
                <Link
                  href="/payslips"
                  className="text-center p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="text-sm font-medium">Pay Slips</div>
                </Link>
                <Link
                  href="/benefits"
                  className="text-center p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="text-sm font-medium">Benefits</div>
                </Link>
                <Link
                  href="/directory"
                  className="text-center p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="text-sm font-medium">Directory</div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </ModernDashboardLayout>
    </>
  );
}
