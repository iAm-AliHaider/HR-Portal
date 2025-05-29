import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import { 
  Users, 
  Briefcase, 
  BarChart3, 
  Calendar, 
  Building, 
  GraduationCap,
  Shield,
  Settings,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

const statsData = [
  {
    title: 'Total Employees',
    value: '1,234',
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'blue'
  },
  {
    title: 'Open Positions',
    value: '23',
    change: '+3',
    trend: 'up',
    icon: Briefcase,
    color: 'green'
  },
  {
    title: 'Pending Approvals',
    value: '8',
    change: '-2',
    trend: 'down',
    icon: Clock,
    color: 'yellow'
  },
  {
    title: 'This Month Hires',
    value: '15',
    change: '+5',
    trend: 'up',
    icon: TrendingUp,
    color: 'purple'
  }
];

const quickActions = [
  { name: 'Add Employee', href: '/people/add', icon: Users, color: 'blue' },
  { name: 'Post Job', href: '/jobs/new', icon: Briefcase, color: 'green' },
  { name: 'View Reports', href: '/reports', icon: BarChart3, color: 'purple' },
  { name: 'Manage Leave', href: '/leave', icon: Calendar, color: 'orange' },
];

const recentActivities = [
  { type: 'hire', message: 'John Doe joined as Software Engineer', time: '2 hours ago', status: 'success' },
  { type: 'leave', message: 'Sarah Wilson requested 3 days leave', time: '4 hours ago', status: 'pending' },
  { type: 'interview', message: 'Interview scheduled with Alex Johnson', time: '1 day ago', status: 'info' },
  { type: 'approval', message: 'Expense report approved for Team Lunch', time: '2 days ago', status: 'success' },
];

export default function ModernUIShowcase() {
  return (
    <>
      <Head>
        <title>Modern UI Showcase | HR Portal</title>
        <meta name="description" content="Modern UI showcase for HR Portal" />
      </Head>
      
      <ModernDashboardLayout 
        title="Modern UI Showcase" 
        subtitle="Experience the new beautiful and functional HR Portal interface"
        actions={
          <Button className="bg-blue-600 hover:bg-blue-700">
            Explore Features
          </Button>
        }
      >
        <div className="space-y-8">
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">🎉 Modern UI Upgrade Complete!</h3>
                <p className="text-green-700 mt-1">
                  Your HR Portal now features a beautiful, modern interface with enhanced navigation, 
                  better user experience, and all previous fixes maintained.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className={`text-3xl font-bold text-gray-900 mt-2${stat.trend === 'up' ? ' text-green-600' : ' text-red-600'}`}>
                        {stat.value}
                      </p>
                      <p className={`text-sm mt-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-${stat.color}-50`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
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
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className={`p-3 rounded-full bg-${action.color}-50 mb-3`}>
                        <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{action.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 p-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-50' :
                        activity.status === 'pending' ? 'bg-yellow-50' : 'bg-blue-50'
                      }`}>
                        {activity.status === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {activity.status === 'pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                        {activity.status === 'info' && <AlertCircle className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Modern UI Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Beautiful sidebar navigation with icons</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Responsive design for all devices</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Expandable menu sections</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Global search functionality</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Notification center</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">All previous fixes maintained</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Migration Status */}
          <Card>
            <CardHeader>
              <CardTitle>Migration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">✅ Migration Complete</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• All pages upgraded to ModernDashboardLayout</li>
                  <li>• Component fetch errors remain fixed</li>
                  <li>• Jobs page remains publicly accessible</li>
                  <li>• Authentication and routing working perfectly</li>
                  <li>• Enhanced user experience with modern design</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </ModernDashboardLayout>
    </>
  );
}