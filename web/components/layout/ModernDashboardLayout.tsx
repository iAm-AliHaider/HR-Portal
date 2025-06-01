import React, { useEffect, useState } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  BarChart3,
  Bell,
  Briefcase,
  Building,
  Calendar,
  ChevronDown,
  DollarSign,
  GraduationCap,
  Heart,
  Home,
  LogOut,
  Menu,
  Search,
  Settings,
  Shield,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

interface ModernDashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  subItems?: { name: string; href: string }[];
}

const navigationItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "People",
    href: "/people",
    icon: Users,
    subItems: [
      { name: "All Employees", href: "/people" },
      { name: "Add Employee", href: "/people/add" },
      { name: "Employee Profile", href: "/employee/profile" },
      { name: "Organization Chart", href: "/org-chart" },
      { name: "Teams", href: "/teams" },
      { name: "Onboarding", href: "/onboarding" },
      { name: "Offboarding", href: "/offboarding" },
    ],
  },
  {
    name: "Recruitment",
    href: "/jobs",
    icon: Briefcase,
    subItems: [
      { name: "Job Openings", href: "/jobs" },
      { name: "Applications", href: "/applications" },
      { name: "Interviews", href: "/interviews" },
      { name: "Offers", href: "/offers" },
      { name: "Recruitment Analytics", href: "/recruitment/analytics" },
      { name: "Careers Page", href: "/careers" },
    ],
  },
  {
    name: "Leave & Time",
    href: "/leave",
    icon: Calendar,
    subItems: [
      { name: "My Leave", href: "/leave" },
      { name: "Leave Approvals", href: "/leave/approvals" },
      { name: "Leave Calendar", href: "/leave/calendar" },
      { name: "Time & Attendance", href: "/time-attendance" },
      { name: "Calendar", href: "/calendar" },
    ],
  },
  {
    name: "Learning & Development",
    href: "/training",
    icon: GraduationCap,
    subItems: [
      { name: "Training Courses", href: "/training" },
      { name: "Learning Portal", href: "/learning" },
      { name: "Employee Learning", href: "/employee/learning-portal" },
      { name: "Skills Management", href: "/skills" },
      { name: "Performance", href: "/performance" },
    ],
  },
  {
    name: "Finance & Payroll",
    href: "/payroll",
    icon: DollarSign,
    subItems: [
      { name: "Payroll", href: "/payroll" },
      { name: "Payslips", href: "/payslips" },
      { name: "Benefits", href: "/benefits" },
      { name: "Expenses", href: "/expenses" },
      { name: "Loans", href: "/loans" },
      { name: "Assets", href: "/assets" },
    ],
  },
  {
    name: "Employee Experience",
    href: "/requests",
    icon: Heart,
    subItems: [
      { name: "Request Panel", href: "/employee/request-panel" },
      { name: "Requests", href: "/requests" },
      { name: "Wellness Tracker", href: "/employee/wellness-tracker" },
      { name: "Team Collaboration", href: "/employee/team-collaboration" },
      { name: "Recognition", href: "/recognition" },
      { name: "Employee Surveys", href: "/employee-surveys" },
    ],
  },
  {
    name: "Workflows & Tasks",
    href: "/workflows",
    icon: Zap,
    subItems: [
      { name: "Workflows", href: "/workflows" },
      { name: "Tasks", href: "/tasks" },
      { name: "Approvals", href: "/approvals" },
      { name: "Role & Workflow Mgmt", href: "/role-workflow-management" },
      { name: "Onboarding Tasks", href: "/onboarding-tasks" },
    ],
  },
  {
    name: "Reports & Analytics",
    href: "/reports",
    icon: BarChart3,
    subItems: [
      { name: "HR Analytics", href: "/hr-analytics" },
      { name: "Financial Reports", href: "/reports/financial" },
      { name: "Workforce Reports", href: "/reports/workforce" },
      { name: "Compliance Reports", href: "/reports/compliance" },
      { name: "Recruitment Reports", href: "/recruitment/reports" },
      { name: "All Reports", href: "/reports" },
    ],
  },
  {
    name: "Facilities & Safety",
    href: "/facilities",
    icon: Building,
    subItems: [
      { name: "Facilities", href: "/facilities" },
      { name: "Room Bookings", href: "/bookings" },
      { name: "Safety Management", href: "/safety" },
      { name: "Equipment", href: "/facilities/equipment" },
      { name: "Incidents", href: "/incidents" },
    ],
  },
  {
    name: "Compliance & Documents",
    href: "/compliance",
    icon: Shield,
    subItems: [
      { name: "Compliance", href: "/compliance" },
      { name: "Documents", href: "/documents" },
      { name: "Exit Management", href: "/exit-management" },
      { name: "Grievances", href: "/grievances" },
    ],
  },
  {
    name: "Administration",
    href: "/admin",
    icon: Settings,
    subItems: [
      { name: "Admin Panel", href: "/admin" },
      { name: "User Management", href: "/admin/user-management" },
      { name: "Settings", href: "/settings" },
      { name: "Workflow Manager", href: "/settings/workflow-manager" },
      { name: "Eligibility Manager", href: "/settings/eligibility-manager" },
      { name: "Logs", href: "/logs" },
      { name: "Setup Validation", href: "/setup-validation" },
    ],
  },
];

export default function ModernDashboardLayout({
  children,
  title,
  subtitle,
  actions,
}: ModernDashboardLayoutProps) {
  const router = useRouter();
  const { user, loading, error, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Handle authentication redirect - moved to the top to follow hooks rules
  useEffect(() => {
    if (!loading && !user) {
      // Only redirect on client-side and if not already on login page
      if (typeof window !== "undefined" && router.pathname !== "/login") {
        console.log("User not authenticated, redirecting to login...");
        router.replace(`/login?returnUrl=${encodeURIComponent(router.asPath)}`);
      }
    }
  }, [user, loading, router]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    const handleRouteChange = () => {
      setSidebarOpen(false);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((item) => item !== itemName)
        : [...prev, itemName],
    );
  };

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return router.pathname === "/dashboard" || router.pathname === "/";
    }
    return router.pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
      // Force redirect to login even if signOut fails
      router.push("/login");
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <>
        <Head>
          <title>{title ? `${title} | HR Portal` : "HR Portal"}</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <Head>
          <title>Error | HR Portal</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Authentication Error
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  // Don't render anything if user is not authenticated (redirect will happen)
  if (!user) {
    return (
      <>
        <Head>
          <title>Redirecting... | HR Portal</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-gray-600">Redirecting to login...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{title ? `${title} | HR Portal` : "HR Portal"}</title>
        <meta name="description" content="Modern HR Portal Dashboard" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>

      <div className="min-h-screen bg-gray-50 flex overflow-hidden">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:z-0
        `}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HR</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Portal</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => (
              <div key={item.name}>
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg
                        ${
                          isActiveRoute(item.href)
                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon size={18} />
                        <span>{item.name}</span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`transform transition-transform ${
                          expandedItems.includes(item.name) ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedItems.includes(item.name) && (
                      <div className="mt-1 ml-6 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`
                              block px-3 py-2 text-sm rounded-lg
                              ${
                                router.pathname === subItem.href
                                  ? "bg-blue-50 text-blue-700 font-medium"
                                  : "text-gray-600 hover:bg-gray-100"
                              }
                            `}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg
                      ${
                        isActiveRoute(item.href)
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <item.icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "user@company.com"}
                </p>
                {user?.role && (
                  <p className="text-xs text-blue-600 truncate capitalize">
                    {user.role}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="mt-2 w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Top Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
            <div className="flex items-center justify-between h-16 px-3 sm:px-6">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                  aria-label="Open sidebar"
                >
                  <Menu size={20} />
                </button>

                {/* Search Bar */}
                <div className="hidden md:block relative w-full max-w-xs lg:max-w-md">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Notifications */}
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 relative"
                  aria-label="View notifications"
                >
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Actions - Wrap in a scrollable container on small screens */}
                {actions && (
                  <div className="flex overflow-x-auto items-center space-x-2 max-w-[180px] sm:max-w-none">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            {/* Page Header */}
            {(title || subtitle) && (
              <div className="px-4 sm:px-6 pt-6 pb-4">
                {title && (
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-base sm:text-lg text-gray-600 break-words">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Page Content */}
            <div className="px-4 sm:px-6 pb-6 w-full">
              <div className="max-w-full overflow-x-auto">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
