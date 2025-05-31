import React, { useState, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import {
  Home,
  User,
  Users,
  Calendar,
  FileText,
  Building,
  Briefcase,
  DollarSign,
  BookOpen,
  Award,
  Settings,
  Shield,
  Clock,
  CreditCard,
  Heart,
  BarChart2,
  Layers,
  BookOpen as Book,
  AlertTriangle,
  ThumbsUp,
  LogOut,
  ChevronDown,
  ChevronRight,
  X,
  Search,
  Star,
  Bookmark,
  Menu,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

// Type definitions
type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
};

type CategoryItem = {
  name: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  roleAccess?: string[];
  description?: string;
};

type NavCategory = {
  name: string;
  items: CategoryItem[];
  roleAccess?: string[]; // Roles that can access this category
  icon?: React.ReactNode;
};

// Main navigation items (always visible in the sidebar)
const mainNavItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <Home className="mr-3 h-4 w-4" />,
  },
  {
    name: "My Profile",
    href: "/employee/profile",
    icon: <User className="mr-3 h-4 w-4" />,
  },
  {
    name: "People Directory",
    href: "/people",
    icon: <Users className="mr-3 h-4 w-4" />,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: <Calendar className="mr-3 h-4 w-4" />,
    badge: "4",
  },
  {
    name: "Documents",
    href: "/documents",
    icon: <FileText className="mr-3 h-4 w-4" />,
    badge: "5",
  },
];

// Categories with their items - Simplified with minimal icons
const navCategories: NavCategory[] = [
  {
    name: "Employee Self-Service",
    icon: <User className="h-4 w-4 mr-3" />,
    items: [
      {
        name: "Request Panel",
        href: "/employee/request-panel",
        icon: <FileText className="mr-3 h-4 w-4" />,
        badge: "3",
        description: "Submit and track requests",
      },
      {
        name: "View Payslips",
        href: "/payslips",
        icon: <DollarSign className="mr-3 h-4 w-4" />,
        description: "Access your payment history",
      },
      {
        name: "Team Collaboration",
        href: "/employee/team-collaboration",
        icon: <Users className="mr-3 h-4 w-4" />,
        description: "Work with your team",
      },
      {
        name: "Wellness Tracker",
        href: "/employee/wellness-tracker",
        icon: <Heart className="mr-3 h-4 w-4" />,
        description: "Track your wellness goals",
      },
      {
        name: "Learning Portal",
        href: "/employee/learning-portal",
        icon: <Book className="mr-3 h-4 w-4" />,
        description: "Access learning materials",
      },
    ],
  },
  {
    name: "Time & Attendance",
    icon: <Clock className="h-4 w-4 mr-3" />,
    items: [
      {
        name: "Time Tracking",
        href: "/time-attendance",
        icon: <Clock className="mr-3 h-4 w-4" />,
        description: "Log your work hours",
      },
      {
        name: "Leave Dashboard",
        href: "/leave",
        icon: <Calendar className="mr-3 h-4 w-4" />,
        description: "Manage your leave requests",
      },
    ],
  },
  {
    name: "Payroll & Benefits",
    icon: <DollarSign className="h-4 w-4 mr-3" />,
    items: [
      {
        name: "Payroll Management",
        href: "/payroll",
        icon: <DollarSign className="mr-3 h-4 w-4" />,
        description: "View and manage payroll",
      },
      {
        name: "Benefits Administration",
        href: "/benefits",
        icon: <Shield className="mr-3 h-4 w-4" />,
        description: "Manage your benefits",
      },
      {
        name: "Expense Management",
        href: "/expenses",
        icon: <CreditCard className="mr-3 h-4 w-4" />,
        description: "Submit and track expenses",
      },
    ],
  },
  {
    name: "Loan Management",
    icon: <CreditCard className="h-4 w-4 mr-3" />,
    items: [
      {
        name: "Loan Dashboard",
        href: "/loans",
        icon: <CreditCard className="mr-3 h-4 w-4" />,
        description: "View and manage loans",
      },
    ],
  },
  {
    name: "Organization & Teams",
    icon: <Users className="h-4 w-4 mr-3" />,
    items: [
      {
        name: "Organization Chart",
        href: "/org-chart",
        icon: <Users className="mr-3 h-4 w-4" />,
        description: "View organizational structure",
      },
      {
        name: "Team Management",
        href: "/teams",
        icon: <Users className="mr-3 h-4 w-4" />,
        description: "Manage your team",
      },
      {
        name: "Performance",
        href: "/performance",
        icon: <Award className="mr-3 h-4 w-4" />,
        description: "View performance metrics",
      },
    ],
    roleAccess: ["admin", "hr_director", "hr_manager", "manager"],
  },
  {
    name: "Talent Management",
    icon: <Briefcase className="h-4 w-4 mr-3" />,
    items: [
      {
        name: "Recruitment",
        href: "/jobs",
        icon: <Briefcase className="mr-3 h-4 w-4" />,
        description: "Manage job openings",
      },
      {
        name: "Onboarding",
        href: "/onboarding",
        icon: <Users className="mr-3 h-4 w-4" />,
        description: "Manage new hires",
      },
      {
        name: "Offboarding",
        href: "/offboarding",
        icon: <Users className="mr-3 h-4 w-4" />,
        description: "Manage departing employees",
      },
    ],
    roleAccess: [
      "admin",
      "hr_director",
      "hr_manager",
      "recruiting_manager",
      "recruiter",
    ],
  },
  {
    name: "Learning & Development",
    icon: <BookOpen className="h-4 w-4 mr-3" />,
    items: [
      {
        name: "Training Management",
        href: "/training",
        icon: <BookOpen className="mr-3 h-4 w-4" />,
        description: "Manage training programs",
      },
      {
        name: "Compliance Training",
        href: "/compliance",
        icon: <Shield className="mr-3 h-4 w-4" />,
        description: "Mandatory training courses",
      },
      {
        name: "Skills Management",
        href: "/skills",
        icon: <Award className="mr-3 h-4 w-4" />,
        description: "Develop your skills",
      },
    ],
  },
  {
    name: "Workplace & Safety",
    icon: <Building className="h-4 w-4 mr-3" />,
    items: [
      {
        name: "Asset Management",
        href: "/assets",
        icon: <Layers className="mr-3 h-4 w-4" />,
        description: "Manage company assets",
      },
      {
        name: "Facilities Management",
        href: "/facilities",
        icon: <Building className="mr-3 h-4 w-4" />,
        description: "Manage office spaces",
      },
      {
        name: "Workplace Safety",
        href: "/safety",
        icon: <AlertTriangle className="mr-3 h-4 w-4" />,
        description: "Safety protocols and reporting",
      },
    ],
  },
  {
    name: "Reports & Analytics",
    icon: <BarChart2 className="h-4 w-4 mr-3" />,
    items: [
      {
        name: "HR Analytics",
        href: "/hr-analytics",
        icon: <BarChart2 className="mr-3 h-4 w-4" />,
        description: "Key HR metrics",
      },
      {
        name: "Workforce Reports",
        href: "/reports/workforce",
        icon: <Users className="mr-3 h-4 w-4" />,
        description: "Workforce analytics",
      },
      {
        name: "Compliance Reports",
        href: "/reports/compliance",
        icon: <Shield className="mr-3 h-4 w-4" />,
        description: "Compliance status",
      },
      {
        name: "Financial Reports",
        href: "/reports/financial",
        icon: <DollarSign className="mr-3 h-4 w-4" />,
        description: "Financial metrics",
      },
    ],
    roleAccess: ["admin", "hr_director", "hr_manager", "finance_manager"],
  },
  {
    name: "Administration",
    icon: <Settings className="h-4 w-4 mr-3" />,
    items: [
      {
        name: "Company Settings",
        href: "/settings/company",
        icon: <Building className="mr-3 h-4 w-4" />,
        description: "Manage company settings",
      },
      {
        name: "User Roles & Permissions",
        href: "/settings/roles",
        icon: <Shield className="mr-3 h-4 w-4" />,
        description: "Manage user access",
      },
      {
        name: "Workflow Management",
        href: "/settings/workflow-manager",
        icon: <Layers className="mr-3 h-4 w-4" />,
        description: "Configure workflows",
      },
      {
        name: "Policy Management",
        href: "/settings/policies",
        icon: <FileText className="mr-3 h-4 w-4" />,
        description: "Manage company policies",
      },
      {
        name: "System Logs",
        href: "/logs",
        icon: <FileText className="mr-3 h-4 w-4" />,
        description: "View system activity",
      },
    ],
    roleAccess: ["admin", "hr_director"],
  },
];

// Projects list with minimalist styling
const projects = [
  {
    name: "Q1 Hiring Drive",
    href: "/projects/q1-hiring",
    icon: <Briefcase className="mr-3 h-4 w-4" />,
    badge: "Active",
  },
  {
    name: "Engineering Expansion",
    href: "/projects/engineering-expansion",
    icon: <Users className="mr-3 h-4 w-4" />,
  },
  {
    name: "Remote Team Setup",
    href: "/projects/remote-team-setup",
    icon: <Building className="mr-3 h-4 w-4" />,
  },
  {
    name: "Intern Program 2024",
    href: "/projects/intern-program",
    icon: <BookOpen className="mr-3 h-4 w-4" />,
    badge: "New",
  },
];

// Favorites feature
const favorites = [
  {
    name: "Request Panel",
    href: "/employee/request-panel",
    icon: <FileText className="mr-3 h-4 w-4" />,
  },
  {
    name: "Leave Dashboard",
    href: "/leave",
    icon: <Calendar className="mr-3 h-4 w-4" />,
  },
];

export default function Sidebar({
  className,
  theme = "monochrome", // Changed default theme to monochrome
  isMobile = false,
  isOpen = true,
  onClose,
}: {
  className?: string;
  theme?: "monochrome" | "dark" | "light";
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const router = useRouter();
  const { user, role, logout } = useAuth();
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const currentPath = router.pathname;
    const newActiveCategories: string[] = [];

    navCategories.forEach((category) => {
      if (category.items.some((item) => isActiveLink(item.href))) {
        newActiveCategories.push(category.name);
      }
    });

    // Keep relevant sections open based on current path
    if (
      currentPath.startsWith("/loans") &&
      !newActiveCategories.includes("Loan Management")
    ) {
      newActiveCategories.push("Loan Management");
    }

    setActiveCategories(newActiveCategories);
  }, [router.pathname]);

  const isActiveLink = (href: string) => {
    return router.pathname === href || router.pathname.startsWith(`${href}/`);
  };

  const hasAccess = (itemRoles?: string[]) => {
    if (!itemRoles) return true; // No specific roles required
    if (!role) return false; // User has no role
    return itemRoles.includes(role) || role === "admin"; // Check if user's role is in the allowed list or if user is admin
  };

  // Updated theme classes for black and white minimalist style
  const getThemeClasses = () => {
    switch (theme) {
      case "dark":
        return {
          bg: "bg-black",
          text: "text-white",
          border: "border-zinc-800",
          accent: "text-zinc-400",
          hoverBg: "hover:bg-zinc-900",
          activeBg: "bg-zinc-900",
          muted: "text-zinc-500",
          button: "border-zinc-800 text-white hover:bg-zinc-900",
          buttonActive: "bg-zinc-800 text-white",
        };
      case "light":
        return {
          bg: "bg-white",
          text: "text-black",
          border: "border-zinc-200",
          accent: "text-zinc-600",
          hoverBg: "hover:bg-zinc-100",
          activeBg: "bg-zinc-100",
          muted: "text-zinc-500",
          button: "border-zinc-200 text-black hover:bg-zinc-100",
          buttonActive: "bg-zinc-100 text-black",
        };
      case "monochrome":
      default:
        return {
          bg: "bg-white",
          text: "text-zinc-900",
          border: "border-zinc-200",
          accent: "text-zinc-900",
          hoverBg: "hover:bg-zinc-100",
          activeBg: "bg-zinc-100",
          muted: "text-zinc-500",
          button: "border-zinc-200 text-zinc-900 hover:bg-zinc-100",
          buttonActive: "bg-zinc-900 text-white",
        };
    }
  };
  const themeClasses = getThemeClasses();

  if (!isOpen && isMobile) {
    return null;
  }

  const filteredCategories = navCategories.filter((category) => {
    if (!hasAccess(category.roleAccess)) return false;
    if (!searchQuery) return true;

    // Search in category name
    if (category.name.toLowerCase().includes(searchQuery.toLowerCase()))
      return true;

    // Search in category items
    return category.items.some(
      (item) =>
        hasAccess(item.roleAccess) &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  });

  return (
    <div
      className={cn(
        "flex flex-col h-full border-r transition-all duration-300 ease-in-out",
        themeClasses.bg,
        themeClasses.text,
        themeClasses.border,
        className,
        isMobile && "fixed inset-y-0 left-0 z-50 shadow-lg w-[260px]",
        !isOpen && isMobile && "hidden",
        !isMobile && "w-64",
      )}
    >
      {/* Header - Simplified, monochromatic */}
      <div
        className={cn(
          "p-4 border-b flex items-center justify-between",
          themeClasses.border,
        )}
      >
        <Link href="/dashboard">
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-8 h-8 bg-zinc-900 rounded-md flex items-center justify-center">
              <span className="text-white font-medium text-sm">HR</span>
            </div>
            <span
              className={cn(
                "text-lg font-medium transition-all duration-200",
                themeClasses.text,
              )}
            >
              HR Portal
            </span>
          </div>
        </Link>
        {isMobile && (
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-md transition-colors",
              themeClasses.hoverBg,
            )}
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search bar - Minimalist style */}
      <div className={cn("px-4 py-3 border-b", themeClasses.border)}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-10 pr-4 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-zinc-400",
              themeClasses.border,
              themeClasses.bg,
              themeClasses.text,
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <nav className="py-4 px-3">
          {/* Favorites Section */}
          {!searchQuery && (
            <div className="mb-6">
              <div className="flex items-center px-2 mb-2">
                <Star className={cn("h-4 w-4 mr-2", themeClasses.accent)} />
                <h3
                  className={cn(
                    "text-xs font-medium tracking-wider uppercase",
                    themeClasses.muted,
                  )}
                >
                  Favorites
                </h3>
              </div>
              <div className="space-y-1">
                {favorites.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    passHref
                    legacyBehavior
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={
                              isActiveLink(item.href) ? "default" : "ghost"
                            }
                            className={cn(
                              "w-full justify-start text-sm h-9 transition-all duration-200 rounded-md font-normal",
                              isActiveLink(item.href)
                                ? themeClasses.buttonActive
                                : themeClasses.button,
                              themeClasses.text,
                            )}
                            onClick={isMobile ? onClose : undefined}
                          >
                            {item.icon}
                            <span className="truncate">{item.name}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-zinc-900 text-white border-zinc-800 rounded-md py-1 px-2 text-xs">
                          <p>Quick access to {item.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Main Navigation Items */}
          {!searchQuery && (
            <div className="space-y-1 mb-6">
              <div className="px-2 mb-2">
                <h3
                  className={cn(
                    "text-xs font-medium tracking-wider uppercase",
                    themeClasses.muted,
                  )}
                >
                  Main Navigation
                </h3>
              </div>
              {mainNavItems.map((item) => (
                <Link key={item.name} href={item.href} passHref legacyBehavior>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            isActiveLink(item.href) ? "default" : "ghost"
                          }
                          className={cn(
                            "w-full justify-start transition-all duration-200 rounded-md text-sm h-9 font-normal",
                            isActiveLink(item.href)
                              ? themeClasses.buttonActive
                              : themeClasses.button,
                            themeClasses.text,
                          )}
                          onClick={isMobile ? onClose : undefined}
                        >
                          {item.icon}
                          {item.name}
                          {item.badge && (
                            <Badge
                              variant="outline"
                              className="ml-auto text-xs py-0 px-1.5 rounded-sm font-normal border-zinc-300"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-zinc-900 text-white border-zinc-800 rounded-md py-1 px-2 text-xs">
                        <p>Go to {item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Link>
              ))}
            </div>
          )}

          {/* Categories with Accordion - Minimalist styling */}
          <Accordion
            type="multiple"
            defaultValue={activeCategories}
            className="w-full"
          >
            {filteredCategories.map((category) => (
              <AccordionItem
                value={category.name}
                key={category.name}
                className={cn("border-b-0 mb-1", themeClasses.border)}
              >
                <AccordionTrigger
                  className={cn(
                    "py-2 px-3 text-sm font-medium rounded-md w-full justify-between transition-all",
                    themeClasses.hoverBg,
                    themeClasses.text,
                  )}
                >
                  <span className="flex items-center">
                    {category.icon}
                    {category.name}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-1">
                  <div className="space-y-1 pl-5">
                    {category.items
                      .filter((item) => hasAccess(item.roleAccess))
                      .filter(
                        (item) =>
                          !searchQuery ||
                          item.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
                      )
                      .map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          passHref
                          legacyBehavior
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={
                                    isActiveLink(item.href)
                                      ? "default"
                                      : "ghost"
                                  }
                                  className={cn(
                                    "w-full justify-start text-sm h-9 transition-all duration-200 rounded-md font-normal",
                                    isActiveLink(item.href)
                                      ? themeClasses.buttonActive
                                      : themeClasses.button,
                                    themeClasses.text,
                                  )}
                                  onClick={isMobile ? onClose : undefined}
                                >
                                  {item.icon ? (
                                    item.icon
                                  ) : (
                                    <div className="mr-3 h-4 w-4" />
                                  )}
                                  <span className="truncate">{item.name}</span>
                                  {item.badge && (
                                    <Badge
                                      variant="outline"
                                      className="ml-auto shrink-0 text-xs py-0 px-1.5 rounded-sm font-normal border-zinc-300"
                                    >
                                      {item.badge}
                                    </Badge>
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-zinc-900 text-white border-zinc-800 rounded-md py-1 px-2 text-xs">
                                <p>{item.description || item.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Link>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Projects Section */}
          {!searchQuery && (
            <div className="mt-6 px-2">
              <div className="flex items-center mb-2">
                <Bookmark className={cn("h-4 w-4 mr-2", themeClasses.accent)} />
                <h3
                  className={cn(
                    "text-xs font-medium tracking-wider uppercase",
                    themeClasses.muted,
                  )}
                >
                  Projects
                </h3>
              </div>
              <div className="space-y-1">
                {projects.map((project) => (
                  <Link
                    key={project.name}
                    href={project.href}
                    passHref
                    legacyBehavior
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-sm h-9 transition-all duration-200 rounded-md font-normal",
                        themeClasses.button,
                        themeClasses.text,
                      )}
                      onClick={isMobile ? onClose : undefined}
                    >
                      {project.icon || <Layers className="mr-3 h-4 w-4" />}
                      <span className="truncate">{project.name}</span>
                      {project.badge && (
                        <Badge
                          variant={
                            project.badge === "Active" ? "default" : "outline"
                          }
                          className={cn(
                            "ml-auto text-xs py-0 px-1.5 rounded-sm font-normal",
                            project.badge === "Active"
                              ? "bg-zinc-900 text-white"
                              : "border-zinc-300",
                          )}
                        >
                          {project.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </ScrollArea>

      {/* User Profile Section - Minimalist black and white */}
      <div className={cn("mt-auto p-4 border-t", themeClasses.border)}>
        {user && (
          <div className="flex items-center mb-2">
            <Avatar className="h-8 w-8 mr-2 border border-zinc-200">
              <AvatarImage src={user.avatar || ""} alt={user.email || "User"} />
              <AvatarFallback className="bg-zinc-100 text-zinc-900">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p
                className={cn(
                  "text-sm font-medium truncate",
                  themeClasses.text,
                )}
              >
                {user.name || user.email}
              </p>
              <p className={cn("text-xs truncate", themeClasses.muted)}>
                {role
                  ?.replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto rounded-md p-1"
              onClick={() => router.push("/employee/profile")}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        )}
        <Button
          variant="outline"
          className={cn(
            "w-full transition-all duration-200 rounded-md text-sm font-normal",
            themeClasses.button,
            themeClasses.text,
            themeClasses.border,
          )}
          onClick={logout}
          data-logout-button="true"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
