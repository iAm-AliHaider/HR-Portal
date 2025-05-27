import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  User, Bell, Calendar, FileText, DollarSign, BookOpen, 
  Award, Clock, FileCheck, Briefcase, Heart, CheckSquare,
  CreditCard, TrendingUp, Users, MessageSquare, Clipboard,
  HelpCircle, Settings, RefreshCw, Gift, BarChart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export default function EmployeeDashboard() {
  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, title: 'Team Meeting', date: '2023-12-05 10:00 AM', type: 'meeting' },
    { id: 2, title: 'Performance Review', date: '2023-12-12 02:00 PM', type: 'review' },
    { id: 3, title: 'Holiday Party', date: '2023-12-22 06:00 PM', type: 'event' },
    { id: 4, title: 'Training Deadline', date: '2023-12-15 11:59 PM', type: 'deadline' },
  ]);

  const [pendingRequests, setPendingRequests] = useState([
    { id: 'REQ-2023-045', type: 'Leave', status: 'Pending', submittedDate: '2023-11-28' },
    { id: 'REQ-2023-051', type: 'Equipment', status: 'Pending', submittedDate: '2023-11-30' },
  ]);

  const [quickActions, setQuickActions] = useState([
    { id: 1, title: 'Request Panel', icon: <FileText className="h-5 w-5" />, url: '/employee/request-panel', color: 'bg-blue-50 text-blue-600' },
    { id: 2, title: 'View Payslips', icon: <DollarSign className="h-5 w-5" />, url: '/payslips', color: 'bg-green-50 text-green-600' },
    { id: 3, title: 'Update Profile', icon: <User className="h-5 w-5" />, url: '/employee/profile', color: 'bg-purple-50 text-purple-600' },
    { id: 4, title: 'Submit Expense', icon: <CreditCard className="h-5 w-5" />, url: '/expenses', color: 'bg-yellow-50 text-yellow-600' },
    { id: 5, title: 'Log Time', icon: <Clock className="h-5 w-5" />, url: '/time-attendance', color: 'bg-red-50 text-red-600' },
    { id: 6, title: 'View Benefits', icon: <Heart className="h-5 w-5" />, url: '/benefits', color: 'bg-pink-50 text-pink-600' },
  ]);

  const [announcements, setAnnouncements] = useState([
    { 
      id: 1, 
      title: 'New Benefits Package', 
      content: 'We\'re excited to announce updates to our benefits package starting January 1st.', 
      date: '2023-11-28',
      priority: 'high'
    },
    { 
      id: 2, 
      title: 'Holiday Schedule', 
      content: 'Please review the upcoming holiday schedule and time-off policies.', 
      date: '2023-11-25',
      priority: 'medium'
    },
    { 
      id: 3, 
      title: 'Office Maintenance', 
      content: 'The west wing will be undergoing maintenance from Dec 10-12.', 
      date: '2023-11-20',
      priority: 'low'
    },
  ]);

  const getEventBadge = (type) => {
    switch (type) {
      case 'meeting':
        return <Badge className="bg-blue-100 text-blue-800">Meeting</Badge>;
      case 'review':
        return <Badge className="bg-purple-100 text-purple-800">Review</Badge>;
      case 'event':
        return <Badge className="bg-green-100 text-green-800">Event</Badge>;
      case 'deadline':
        return <Badge className="bg-red-100 text-red-800">Deadline</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{type}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{priority}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Head>
        <title>Employee Dashboard | HR Portal</title>
        <meta name="description" content="Employee self-service dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="container px-4 sm:px-6 mx-auto py-6 space-y-6 max-w-full lg:max-w-7xl">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Welcome, Alex!</h1>
              <p className="text-blue-100">Tuesday, December 5, 2023</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="secondary" className="bg-white text-blue-800 hover:bg-blue-50">
                <User className="h-4 w-4 mr-2" />
                My Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div>
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {quickActions.map(action => (
              <Link href={action.url} key={action.id}>
                <div className={`${action.color} rounded-lg p-4 flex flex-col items-center justify-center h-24 cursor-pointer hover:shadow-md transition-shadow`}>
                  {action.icon}
                  <span className="mt-2 text-center text-sm font-medium">{action.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Announcements */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Company Announcements</CardTitle>
              <CardDescription>Latest updates from the organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map(announcement => (
                  <div key={announcement.id} className="p-4 border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{announcement.title}</h3>
                      {getPriorityBadge(announcement.priority)}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{announcement.content}</p>
                    <div className="text-gray-500 text-xs">
                      Posted on {formatDate(announcement.date)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">View All Announcements</Button>
            </CardFooter>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your schedule for the next few weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex justify-between p-3 border-b last:border-0">
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="ml-2">
                          {getEventBadge(event.type)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">View Calendar</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Self-Service Modules Grid */}
        <div>
          <h2 className="text-lg font-medium mb-4">Self-Service Modules</h2>
          <Tabs defaultValue="work">
            <TabsList className="mb-4 overflow-x-auto w-full">
              <TabsTrigger value="work">Work & Career</TabsTrigger>
              <TabsTrigger value="pay">Pay & Benefits</TabsTrigger>
              <TabsTrigger value="time">Time & Leave</TabsTrigger>
              <TabsTrigger value="learning">Learning & Development</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
            </TabsList>
            
            <TabsContent value="work">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Link href="/performance">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Performance</CardTitle>
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">View your performance reviews, goals and achievements</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/tasks">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Tasks</CardTitle>
                        <CheckSquare className="h-5 w-5 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Manage your work tasks and track progress</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/skills">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Skills</CardTitle>
                        <Award className="h-5 w-5 text-purple-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Update your skills profile and find skill gaps</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="pay">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Link href="/payslips">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Payslips</CardTitle>
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">View and download your salary statements</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/benefits">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Benefits</CardTitle>
                        <Heart className="h-5 w-5 text-red-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Manage your benefits and insurance coverage</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/expenses">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Expenses</CardTitle>
                        <CreditCard className="h-5 w-5 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Submit and track expense reimbursements</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="time">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Link href="/leave">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Leave Management</CardTitle>
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Request time off and view leave balances</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/time-attendance">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Time & Attendance</CardTitle>
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Track working hours and manage timesheets</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/calendar">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Calendar</CardTitle>
                        <Calendar className="h-5 w-5 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">View and manage your work schedule</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="learning">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Link href="/employee/learning-portal">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Learning Portal</CardTitle>
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Access courses and training materials</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/training">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Training</CardTitle>
                        <RefreshCw className="h-5 w-5 text-purple-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Register for upcoming training sessions</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/certifications">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Certifications</CardTitle>
                        <Award className="h-5 w-5 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Track your professional certifications</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="personal">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Link href="/employee/profile">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>My Profile</CardTitle>
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">View and update your personal information</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/employee/team-collaboration">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Team Collaboration</CardTitle>
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Connect and collaborate with your team</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/documents">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Documents</CardTitle>
                        <FileCheck className="h-5 w-5 text-purple-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Access important documents and forms</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/employee/wellness-tracker">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Wellness Tracker</CardTitle>
                        <Heart className="h-5 w-5 text-red-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Track and improve your wellbeing</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Pending Requests */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>Status of your recent requests</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingRequests.length > 0 ? (
              <div className="space-y-3">
                {pendingRequests.map(request => (
                  <div key={request.id} className="flex justify-between p-3 border rounded-md">
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">{request.id}</h4>
                        <Badge className="ml-2 bg-yellow-100 text-yellow-800">Pending</Badge>
                      </div>
                      <p className="text-sm text-gray-500">{request.type} - Submitted on {formatDate(request.submittedDate)}</p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 text-gray-500">
                <CheckSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p>You don't have any pending requests.</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" onClick={() => window.location.href = '/employee/request-panel'}>View All Requests</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
} 
