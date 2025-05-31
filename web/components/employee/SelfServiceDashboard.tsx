import React, { useState, useEffect } from "react";

import { Badge } from "@chakra-ui/react";
import {
  Calendar,
  FileText,
  Clock,
  User,
  BookOpen,
  DollarSign,
  Settings,
  Bell,
  TrendingUp,
} from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  priority: "high" | "medium" | "low";
  category: "leave" | "documents" | "learning" | "finance" | "profile";
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface EmployeeStats {
  leaveBalance: number;
  pendingRequests: number;
  completedCourses: number;
  upcomingDeadlines: number;
  documentsToReview: number;
  goalProgress: number;
}

const SelfServiceDashboard: React.FC = () => {
  const [stats, setStats] = useState<EmployeeStats>({
    leaveBalance: 18,
    pendingRequests: 2,
    completedCourses: 5,
    upcomingDeadlines: 3,
    documentsToReview: 1,
    goalProgress: 75,
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Leave Request Approved",
      message: "Your vacation leave for June 15-19 has been approved",
      type: "success",
      timestamp: "2024-01-15T10:30:00Z",
      read: false,
      actionUrl: "/leave/requests",
    },
    {
      id: "2",
      title: "New Course Available",
      message: "Advanced React Development course is now available",
      type: "info",
      timestamp: "2024-01-14T14:20:00Z",
      read: false,
      actionUrl: "/learning",
    },
    {
      id: "3",
      title: "Goal Review Due",
      message: "Your Q1 goals review is due in 3 days",
      type: "warning",
      timestamp: "2024-01-13T09:15:00Z",
      read: false,
      actionUrl: "/goals",
    },
  ]);

  const quickActions: QuickAction[] = [
    {
      id: "request-leave",
      title: "Request Leave",
      description: "Submit a new leave request",
      icon: <Calendar className="h-5 w-5" />,
      href: "/leave/request",
      priority: "high",
      category: "leave",
    },
    {
      id: "submit-expense",
      title: "Submit Expense",
      description: "Report business expenses",
      icon: <DollarSign className="h-5 w-5" />,
      href: "/expenses/new",
      priority: "high",
      category: "finance",
    },
    {
      id: "view-payslips",
      title: "View Payslips",
      description: "Access your salary statements",
      icon: <FileText className="h-5 w-5" />,
      href: "/payslips",
      priority: "medium",
      category: "finance",
    },
    {
      id: "update-profile",
      title: "Update Profile",
      description: "Edit personal information",
      icon: <User className="h-5 w-5" />,
      href: "/profile",
      priority: "medium",
      category: "profile",
    },
    {
      id: "browse-courses",
      title: "Browse Courses",
      description: "Explore learning opportunities",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/learning",
      priority: "medium",
      category: "learning",
    },
    {
      id: "view-documents",
      title: "My Documents",
      description: "Access employment documents",
      icon: <FileText className="h-5 w-5" />,
      href: "/documents",
      priority: "low",
      category: "documents",
    },
  ];

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="text-blue-100">
          Here's what's happening with your work today.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leave Balance</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.leaveBalance}
                </p>
                <p className="text-xs text-gray-500">days remaining</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-amber-600">
                  {stats.pendingRequests}
                </p>
                <p className="text-xs text-gray-500">awaiting approval</p>
              </div>
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Courses Completed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.completedCourses}
                </p>
                <p className="text-xs text-gray-500">this quarter</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Goal Progress</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.goalProgress}%
                </p>
                <p className="text-xs text-gray-500">of Q1 goals</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <a
                    key={action.id}
                    href={action.href}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          {action.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {action.description}
                        </p>
                        {action.priority === "high" && (
                          <Badge variant="destructive" className="mt-2">
                            Priority
                          </Badge>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      notification.read
                        ? "bg-gray-50"
                        : getNotificationColor(notification.type)
                    }`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-medium">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(notification.timestamp)}
                    </p>
                  </div>
                ))}
                {notifications.length > 5 && (
                  <Button variant="outline" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Completed "React Hooks" course</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Submitted expense report</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Updated emergency contact</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Goal Review</p>
                  <p className="text-xs text-gray-500">Q1 performance goals</p>
                </div>
                <Badge variant="destructive">3 days</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Certification Renewal</p>
                  <p className="text-xs text-gray-500">
                    AWS Solutions Architect
                  </p>
                </div>
                <Badge variant="outline">2 weeks</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Annual Training</p>
                  <p className="text-xs text-gray-500">Security Awareness</p>
                </div>
                <Badge variant="outline">1 month</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SelfServiceDashboard;
