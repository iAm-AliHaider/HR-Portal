import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import Link from 'next/link';
import {
  Users,
  Briefcase,
  BarChart3,
  UserSquare,
  CalendarDays,
  Award,
  FileText,
  Building2,
  Activity
} from 'lucide-react';

const summaryStats = [
  { title: 'Total Employees', value: '156', icon: <Users className="h-6 w-6 text-blue-600" /> },
  { title: 'Open Positions', value: '12', icon: <Briefcase className="h-6 w-6 text-green-600" /> },
  { title: 'Pending Approvals', value: '8', icon: <CalendarDays className="h-6 w-6 text-yellow-600" /> },
];

const dashboardModules = [
  {
    title: 'HR Analytics',
    description: 'View detailed analytics about employees, performance, and recruitment.',
    href: '/hr-analytics',
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
  },
  {
    title: 'Recruitment',
    description: 'Manage job postings, applicants, and hiring workflows.',
    href: '/jobs',
    icon: <Briefcase className="h-8 w-8 text-green-600" />,
  },
  {
    title: 'Employee Directory',
    description: 'Browse and manage employee profiles and information.',
    href: '/people',
    icon: <Users className="h-8 w-8 text-purple-600" />,
  },
  {
    title: 'Leave Management',
    description: 'Handle employee time off requests and approvals.',
    href: '/leave',
    icon: <CalendarDays className="h-8 w-8 text-red-600" />,
  },
  {
    title: 'Performance',
    description: 'Track employee performance and conduct reviews.',
    href: '/performance',
    icon: <Award className="h-8 w-8 text-orange-600" />,
  },
  {
    title: 'Reports',
    description: 'Generate and view company reports and insights.',
    href: '/reports',
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
  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome to your HR Portal dashboard">
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaryStats.map((stat) => (
            <Card key={stat.title} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                {stat.icon} 
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
              </CardContent>
            </Card>
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
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 