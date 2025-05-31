import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
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
  BarChart,
  Layers,
  Book,
  ShieldAlert,
  ThumbsUp,
  LogOut,
  ChevronDown,
  ChevronRight,
  X,
  Search,
  Bell,
  Bookmark,
  Star,
  Coffee
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  { name: 'Dashboard', href: '/dashboard', icon: <Home className="mr-2 h-4 w-4" /> },
  { name: 'My Profile', href: '/employee/profile', icon: <User className="mr-2 h-4 w-4" /> },
  { name: 'People Directory', href: '/people', icon: <Users className="mr-2 h-4 w-4" /> },
  { name: 'Calendar', href: '/calendar', icon: <Calendar className="mr-2 h-4 w-4" />, badge: "4" },
  { name: 'Documents', href: '/documents', icon: <FileText className="mr-2 h-4 w-4" />, badge: "5" },
];

// Categories with their items - Updated with icons and better organization
const navCategories: NavCategory[] = [
  {
    name: 'Employee Self-Service',
    icon: <User className="h-4 w-4 mr-2" />,
    items: [
      { name: 'Request Panel', href: '/employee/request-panel', icon: <FileText className="mr-2 h-4 w-4" />, badge: "3", description: "Submit and track requests" },
      { name: 'View Payslips', href: '/payslips', icon: <DollarSign className="mr-2 h-4 w-4" />, description: "Access your payment history" },
      { name: 'Team Collaboration', href: '/employee/team-collaboration', icon: <Users className="mr-2 h-4 w-4" />, description: "Work with your team" },
      { name: 'Wellness Tracker', href: '/employee/wellness-tracker', icon: <Heart className="mr-2 h-4 w-4" />, description: "Track your wellness goals" },
      { name: 'Learning Portal', href: '/employee/learning-portal', icon: <Book className="mr-2 h-4 w-4" />, description: "Access learning materials" },
      { name: 'Employee Surveys', href: '/employee-surveys', icon: <ThumbsUp className="mr-2 h-4 w-4" />, description: "Provide feedback" },
    ]
  },
  {
    name: 'Time & Attendance',
    icon: <Clock className="h-4 w-4 mr-2" />,
    items: [
      { name: 'Time Tracking', href: '/time-attendance', icon: <Clock className="mr-2 h-4 w-4" />, description: "Log your work hours" },
      { name: 'Leave Dashboard', href: '/leave', icon: <Calendar className="mr-2 h-4 w-4" />, description: "Manage your leave requests" },
    ]
  },
  {
    name: 'Payroll & Benefits',
    icon: <DollarSign className="h-4 w-4 mr-2" />,
    items: [
      { name: 'Payroll Management', href: '/payroll', icon: <DollarSign className="mr-2 h-4 w-4" />, description: "View and manage payroll" },
      { name: 'Benefits Administration', href: '/benefits', icon: <Shield className="mr-2 h-4 w-4" />, description: "Manage your benefits" },
      { name: 'Expense Management', href: '/expenses', icon: <CreditCard className="mr-2 h-4 w-4" />, description: "Submit and track expenses" },
    ]
  },
  {
    name: 'Loan Management',
    icon: <CreditCard className="h-4 w-4 mr-2" />,
    items: [
      { name: 'Loan Dashboard', href: '/loans', icon: <CreditCard className="mr-2 h-4 w-4" />, description: "View and manage loans" },
    ]
  },
  {
    name: 'Organization & Teams',
    icon: <Users className="h-4 w-4 mr-2" />,
    items: [
      { name: 'Organization Chart', href: '/org-chart', icon: <Users className="mr-2 h-4 w-4" />, description: "View organizational structure" },
      { name: 'Team Management', href: '/teams', icon: <Users className="mr-2 h-4 w-4" />, description: "Manage your team" },
      { name: 'Performance', href: '/performance', icon: <Award className="mr-2 h-4 w-4" />, description: "View performance metrics" },
    ],
    roleAccess: ['admin', 'hr_director', 'hr_manager', 'manager']
  },
  {
    name: 'Talent Management',
    icon: <Briefcase className="h-4 w-4 mr-2" />,
    items: [
      { name: 'Recruitment', href: '/jobs', icon: <Briefcase className="mr-2 h-4 w-4" />, description: "Manage job openings" },
      { name: 'Onboarding', href: '/onboarding', icon: <Users className="mr-2 h-4 w-4" />, description: "Manage new hires" },
      { name: 'Offboarding', href: '/offboarding', icon: <Users className="mr-2 h-4 w-4" />, description: "Manage departing employees" },
    ],
    roleAccess: ['admin', 'hr_director', 'hr_manager', 'recruiting_manager', 'recruiter']
  },
  {
    name: 'Learning & Development',
    icon: <BookOpen className="h-4 w-4 mr-2" />,
    items: [
      { name: 'Training Management', href: '/training', icon: <BookOpen className="mr-2 h-4 w-4" />, description: "Manage training programs" },
      { name: 'Compliance Training', href: '/compliance', icon: <Shield className="mr-2 h-4 w-4" />, description: "Mandatory training courses" },
      { name: 'Skills Management', href: '/skills', icon: <Award className="mr-2 h-4 w-4" />, description: "Develop your skills" },
    ]
  },
  {
    name: 'Workplace & Safety',
    icon: <Building className="h-4 w-4 mr-2" />,
    items: [
      { name: 'Asset Management', href: '/assets', icon: <Layers className="mr-2 h-4 w-4" />, description: "Manage company assets" },
      { name: 'Facilities Management', href: '/facilities', icon: <Building className="mr-2 h-4 w-4" />, description: "Manage office spaces" },
      { name: 'Workplace Safety', href: '/safety', icon: <ShieldAlert className="mr-2 h-4 w-4" />, description: "Safety protocols and reporting" },
    ]
  },
  {
    name: 'Reports & Analytics',
    icon: <BarChart className="h-4 w-4 mr-2" />,
    items: [
      { name: 'HR Analytics', href: '/hr-analytics', icon: <BarChart className="mr-2 h-4 w-4" />, description: "Key HR metrics" },
      { name: 'Workforce Reports', href: '/reports/workforce', icon: <Users className="mr-2 h-4 w-4" />, description: "Workforce analytics" },
      { name: 'Compliance Reports', href: '/reports/compliance', icon: <Shield className="mr-2 h-4 w-4" />, description: "Compliance status" },
      { name: 'Financial Reports', href: '/reports/financial', icon: <DollarSign className="mr-2 h-4 w-4" />, description: "Financial metrics" },
    ],
    roleAccess: ['admin', 'hr_director', 'hr_manager', 'finance_manager']
  },
  {
    name: 'Administration',
    icon: <Settings className="h-4 w-4 mr-2" />,
    items: [
      { name: 'Company Settings', href: '/settings/company', icon: <Building className="mr-2 h-4 w-4" />, description: "Manage company settings" },
      { name: 'User Roles & Permissions', href: '/settings/roles', icon: <Shield className="mr-2 h-4 w-4" />, description: "Manage user access" },
      { name: 'Workflow Management', href: '/settings/workflow-manager', icon: <Layers className="mr-2 h-4 w-4" />, description: "Configure workflows" },
      { name: 'Policy Management', href: '/settings/policies', icon: <FileText className="mr-2 h-4 w-4" />, description: "Manage company policies" },
      { name: 'System Logs', href: '/logs', icon: <FileText className="mr-2 h-4 w-4" />, description: "View system activity" },
    ],
    roleAccess: ['admin', 'hr_director']
  }
];

// Projects list with improved metadata
const projects = [
  { name: 'Q1 Hiring Drive', href: '/projects/q1-hiring', icon: <Briefcase className="mr-2 h-4 w-4" />, badge: "Active" },
  { name: 'Engineering Expansion', href: '/projects/engineering-expansion', icon: <Users className="mr-2 h-4 w-4" /> },
  { name: 'Remote Team Setup', href: '/projects/remote-team-setup', icon: <Building className="mr-2 h-4 w-4" /> },
  { name: 'Intern Program 2024', href: '/projects/intern-program', icon: <BookOpen className="mr-2 h-4 w-4" />, badge: "New" },
];

// Favorites feature
const favorites = [
  { name: 'Request Panel', href: '/employee/request-panel', icon: <FileText className="mr-2 h-4 w-4" /> },
  { name: 'Leave Dashboard', href: '/leave', icon: <Calendar className="mr-2 h-4 w-4" /> },
];

export default function Sidebar({ 
  className, 
  theme = 'light',
  isMobile = false,
  isOpen = true,
  onClose
}: { 
  className?: string, 
  theme?: 'light' | 'dark' | 'purple',
  isMobile?: boolean,
  isOpen?: boolean,
  onClose?: () => void
}) {
  const router = useRouter();
  const { user, role, logout } = useAuth();
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const currentPath = router.pathname;
    const newActiveCategories: string[] = [];
    
    navCategories.forEach(category => {
      if (category.items.some(item => isActiveLink(item.href))) {
        newActiveCategories.push(category.name);
      }
    });
    
    // Keep relevant sections open based on current path
    if (currentPath.startsWith('/loans') && !newActiveCategories.includes('Loan Management')) {
      newActiveCategories.push('Loan Management');
    }

    setActiveCategories(newActiveCategories);
  }, [router.pathname]);
  
  const isActiveLink = (href: string) => {
    return router.pathname === href || router.pathname.startsWith(`${href}/`);
  };

  const hasAccess = (itemRoles?: string[]) => {
    if (!itemRoles) return true; // No specific roles required
    if (!role) return false; // User has no role
    return itemRoles.includes(role) || role === 'admin'; // Check if user's role is in the allowed list or if user is admin
  };
  
  // Theme classes
  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-slate-900',
          text: 'text-slate-50',
          border: 'border-slate-800',
          accent: 'text-blue-400',
          hoverBg: 'hover:bg-slate-800',
          activeBg: 'bg-slate-700',
          muted: 'text-slate-400',
        };
      case 'purple':
        return {
          bg: 'bg-purple-700',
          text: 'text-purple-50',
          border: 'border-purple-600',
          accent: 'text-yellow-300',
          hoverBg: 'hover:bg-purple-600',
          activeBg: 'bg-purple-500',
          muted: 'text-purple-300',
        };
      case 'light':
      default:
        return {
          bg: 'bg-white',
          text: 'text-slate-900',
          border: 'border-slate-200',
          accent: 'text-blue-600',
          hoverBg: 'hover:bg-slate-50',
          activeBg: 'bg-slate-100',
          muted: 'text-slate-500',
        };
    }
  };
  const themeClasses = getThemeClasses();

  if (!isOpen && isMobile) {
    return null;
  }

  const filteredCategories = navCategories.filter(category => {
    if (!hasAccess(category.roleAccess)) return false;
    if (!searchQuery) return true;
    
    // Search in category name
    if (category.name.toLowerCase().includes(searchQuery.toLowerCase())) return true;
    
    // Search in category items
    return category.items.some(item => 
      hasAccess(item.roleAccess) && 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        isMobile && "fixed inset-y-0 left-0 z-50 shadow-lg w-[280px]",
        !isOpen && isMobile && "hidden",
        !isMobile && "w-64"
      )}
    >
      {/* Header */}
      <div className={cn("p-4 border-b flex items-center justify-between", themeClasses.border)}>
        <Link href="/dashboard">
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center group-hover:shadow-md transition-all duration-200">
              <span className="text-white font-bold text-sm">HR</span>
            </div>
            <span className={cn("text-xl font-bold transition-all duration-200", themeClasses.text)}>
              HR Portal
            </span>
          </div>
        </Link>
        {isMobile && (
          <button
            onClick={onClose}
            className={cn("p-2 rounded-full hover:bg-gray-100 transition-colors", themeClasses.hoverBg)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search bar */}
      <div className={cn("px-4 py-2 border-b", themeClasses.border)}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-10 pr-4 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500",
              themeClasses.border,
              themeClasses.bg,
              themeClasses.text
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                <h3 className={cn("text-xs font-semibold tracking-wider uppercase", themeClasses.muted)}>
                  Favorites
                </h3>
              </div>
              <div className="space-y-1">
                {favorites.map((item) => (
                  <Link key={item.name} href={item.href} passHref legacyBehavior>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isActiveLink(item.href) ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start text-sm h-9 transition-all duration-200",
                              isActiveLink(item.href) 
                                ? themeClasses.activeBg + ' ' + themeClasses.text 
                                : themeClasses.hoverBg,
                              themeClasses.text
                            )}
                            onClick={isMobile ? onClose : undefined}
                          >
                            {item.icon}
                            <span className="truncate">{item.name}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
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
                <h3 className={cn("text-xs font-semibold tracking-wider uppercase", themeClasses.muted)}>
                  Main Navigation
                </h3>
              </div>
              {mainNavItems.map((item) => (
                <Link key={item.name} href={item.href} passHref legacyBehavior>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isActiveLink(item.href) ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start transition-all duration-200",
                            isActiveLink(item.href) 
                              ? themeClasses.activeBg + ' ' + themeClasses.text 
                              : themeClasses.hoverBg,
                            themeClasses.text
                          )}
                          onClick={isMobile ? onClose : undefined}
                        >
                          {item.icon}
                          {item.name}
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto text-xs py-0 px-1.5">
                              {item.badge}
                            </Badge>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Go to {item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Link>
              ))}
            </div>
          )}

          {/* Categories with Accordion */}
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
                    themeClasses.text
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
                      .filter(item => hasAccess(item.roleAccess))
                      .filter(item => !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((item) => (
                        <Link key={item.name} href={item.href} passHref legacyBehavior>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={isActiveLink(item.href) ? "secondary" : "ghost"}
                                  className={cn(
                                    "w-full justify-start text-sm h-9 transition-all duration-200",
                                    isActiveLink(item.href) 
                                      ? themeClasses.activeBg + ' ' + themeClasses.text 
                                      : themeClasses.hoverBg,
                                    themeClasses.text
                                  )}
                                  onClick={isMobile ? onClose : undefined}
                                >
                                  {item.icon ? item.icon : <div className="mr-2 h-4 w-4" />}
                                  <span className="truncate">{item.name}</span>
                                  {item.badge && (
                                    <Badge variant="secondary" className="ml-auto shrink-0 text-xs py-0 px-1.5">
                                      {item.badge}
                                    </Badge>
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
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
                <h3 className={cn("text-xs font-semibold tracking-wider uppercase", themeClasses.muted)}>
                  Projects
                </h3>
              </div>
              <div className="space-y-1">
                {projects.map((project) => (
                  <Link key={project.name} href={project.href} passHref legacyBehavior>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-sm h-9 transition-all duration-200", 
                        themeClasses.hoverBg, 
                        themeClasses.text
                      )}
                      onClick={isMobile ? onClose : undefined}
                    >
                      {project.icon || <Layers className="mr-2 h-4 w-4" />}
                      <span className="truncate">{project.name}</span>
                      {project.badge && (
                        <Badge 
                          variant={project.badge === 'Active' ? "default" : "secondary"} 
                          className="ml-auto text-xs py-0 px-1.5"
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

      {/* User Profile Section */}
      <div className={cn("mt-auto p-4 border-t", themeClasses.border)}>
        {user && (
          <div className="flex items-center mb-2">
            <Avatar className="h-9 w-9 mr-2">
              <AvatarImage src={user.avatarUrl || ''} alt={user.email || 'User'} />
              <AvatarFallback className={cn(themeClasses.activeBg)}>
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className={cn("text-sm font-medium truncate", themeClasses.text)}>
                {user.displayName || user.email}
              </p>
              <p className={cn("text-xs truncate", themeClasses.muted)}>
                {role?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto rounded-full"
              onClick={() => router.push('/employee/profile')}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        )}
        <Button 
          variant="outline" 
          className={cn(
            "w-full transition-all duration-200", 
            themeClasses.hoverBg, 
            themeClasses.text, 
            themeClasses.border
          )} 
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
