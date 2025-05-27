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
  ChevronRight
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
};

type NavCategory = {
  name: string;
  items: CategoryItem[];
  roleAccess?: string[]; // Roles that can access this category
};

// Main navigation items (always visible in the sidebar)
const mainNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: <Home className="mr-2 h-4 w-4" /> },
  { name: 'My Profile', href: '/employee/profile', icon: <User className="mr-2 h-4 w-4" /> },
  { name: 'People Directory', href: '/people', icon: <Users className="mr-2 h-4 w-4" /> },
  { name: 'Calendar', href: '/calendar', icon: <Calendar className="mr-2 h-4 w-4" />, badge: "4" },
  { name: 'Documents', href: '/documents', icon: <FileText className="mr-2 h-4 w-4" />, badge: "5" },
];

// Categories with their items
const navCategories: NavCategory[] = [
  {
    name: 'Employee Self-Service',
    items: [
      { name: 'Request Panel', href: '/employee/request-panel', icon: <FileText className="mr-2 h-4 w-4" /> },
      { name: 'View Payslips', href: '/payslips' },
      { name: 'Team Collaboration', href: '/employee/team-collaboration', icon: <Users className="mr-2 h-4 w-4" /> },
      { name: 'Wellness Tracker', href: '/employee/wellness-tracker', icon: <Heart className="mr-2 h-4 w-4" /> },
      { name: 'Learning Portal', href: '/employee/learning-portal', icon: <Book className="mr-2 h-4 w-4" /> },
      { name: 'Employee Surveys', href: '/employee-surveys' },
    ]
  },
  {
    name: 'Time & Attendance',
    items: [
      { name: 'Time Tracking', href: '/time-attendance', icon: <Clock className="mr-2 h-4 w-4" /> },
      { name: 'Leave Dashboard', href: '/leave' },
      { name: 'Leave Calendar', href: '/leave/calendar' },
      { name: 'Approve Requests', href: '/leave/approvals' },
    ]
  },
  {
    name: 'Payroll & Benefits',
    items: [
      { name: 'Payroll Management', href: '/payroll', icon: <DollarSign className="mr-2 h-4 w-4" /> },
      { name: 'Benefits Administration', href: '/benefits' },
      { name: 'Expense Management', href: '/expenses' },
    ]
  },
  {
    name: 'Loan Management',
    items: [
      { name: 'Loan Dashboard', href: '/loans', icon: <CreditCard className="mr-2 h-4 w-4" /> },
      { name: 'Apply for Loan', href: '/loans/apply', icon: <FileText className="mr-2 h-4 w-4" /> },
      { name: 'My Applications', href: '/loans/applications', icon: <FileText className="mr-2 h-4 w-4" /> },
      { name: 'Admin Dashboard', href: '/loans/management', icon: <DollarSign className="mr-2 h-4 w-4" />, roleAccess: ['admin', 'hr_manager', 'finance_manager'] },
      { name: 'Repayment Schedule', href: '/loans/repayment-schedule', icon: <Calendar className="mr-2 h-4 w-4" /> },
      { name: 'Program Settings', href: '/loans/settings', icon: <Settings className="mr-2 h-4 w-4" />, roleAccess: ['admin', 'hr_director', 'finance_manager'] },
    ]
  },
  {
    name: 'Organization & Teams',
    items: [
      { name: 'Organization Chart', href: '/org-chart' },
      { name: 'Team Management', href: '/teams' },
      { name: 'Performance', href: '/performance', icon: <Award className="mr-2 h-4 w-4" /> },
    ],
    roleAccess: ['admin', 'hr_director', 'hr_manager', 'manager']
  },
  {
    name: 'Talent Management',
    items: [
      { name: 'Recruitment', href: '/jobs', icon: <Briefcase className="mr-2 h-4 w-4" /> },
      { name: 'Applications', href: '/applications' },
      { name: 'Interviews', href: '/interviews' },
      { name: 'Job Offers', href: '/offers' },
      { name: 'Onboarding', href: '/onboarding' },
      { name: 'Offboarding', href: '/offboarding' },
    ],
    roleAccess: ['admin', 'hr_director', 'hr_manager', 'recruiting_manager', 'recruiter']
  },
  {
    name: 'Learning & Development',
    items: [
      { name: 'Training Management', href: '/training' },
      { name: 'Compliance Training', href: '/compliance' },
      { name: 'Skills Management', href: '/skills' },
    ]
  },
  {
    name: 'Workplace & Safety',
    items: [
      { name: 'Asset Management', href: '/assets' },
      { name: 'Meeting Rooms', href: '/facilities/rooms' },
      { name: 'Equipment Booking', href: '/facilities/equipment' },
      { name: 'Workplace Safety', href: '/safety', icon: <ShieldAlert className="mr-2 h-4 w-4" /> },
      { name: 'Facilities Reports', href: '/facilities/reports' },
    ]
  },
  {
    name: 'Reports & Analytics',
    items: [
      { name: 'HR Analytics', href: '/hr-analytics', icon: <BarChart className="mr-2 h-4 w-4" /> },
      { name: 'Workforce Reports', href: '/reports/workforce' },
      { name: 'Compliance Reports', href: '/reports/compliance' },
      { name: 'Financial Reports', href: '/reports/financial' },
    ],
    roleAccess: ['admin', 'hr_director', 'hr_manager', 'finance_manager']
  },
  {
    name: 'Administration',
    items: [
      { name: 'Company Settings', href: '/settings/company' },
      { name: 'General Settings', href: '/settings/general' },
      { name: 'User Roles & Permissions', href: '/settings/roles' },
      { name: 'Workflow Management', href: '/settings/workflows' },
      { name: 'Role-Workflow Integration', href: '/role-workflow-management' },
      { name: 'Policy Management', href: '/settings/policies' },
      { name: 'Security Settings', href: '/settings/security' },
      { name: 'Integrations', href: '/settings/integrations' },
      { name: 'Notifications', href: '/settings/notifications' },
      { name: 'System Logs', href: '/logs' },
    ],
    roleAccess: ['admin', 'hr_director']
  }
];

// Projects list (Consider if this needs to be part of the Accordion or a separate section)
const projects = [
  { name: 'Q1 Hiring Drive', href: '/projects/q1-hiring' },
  { name: 'Engineering Expansion', href: '/projects/engineering-expansion' },
  { name: 'Remote Team Setup', href: '/projects/remote-team-setup' },
  { name: 'Intern Program 2024', href: '/projects/intern-program' },
];

export default function Sidebar({ 
  className, 
  theme = 'light', // theme prop might need different handling with shadcn
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
  const { user, role, logout } = useAuth(); // Added logout from useAuth
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  useEffect(() => {
    const currentPath = router.pathname;
    const newActiveCategories: string[] = [];
    
    navCategories.forEach(category => {
      if (category.items.some(item => isActiveLink(item.href))) {
        newActiveCategories.push(category.name);
      }
    });
    // For loan management, always keep it open if any loan page is active
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
  
  // Theme classes - adapt as needed for shadcn
  const getThemeClasses = () => {
    // shadcn/ui primarily uses CSS variables for theming. 
    // This function might become simpler or integrated differently.
    // For now, let's keep it for potential custom background or text colors if needed.
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-slate-900', // Example shadcn dark background
          text: 'text-slate-50',
          border: 'border-slate-700',
          accent: 'text-blue-400', // Example accent for dark theme
          hoverBg: 'hover:bg-slate-800',
          activeBg: 'bg-slate-700', // Example active background for dark theme
        };
      case 'purple':
        return {
          bg: 'bg-purple-700', // Example purple theme
          text: 'text-purple-50',
          border: 'border-purple-600',
          accent: 'text-yellow-300',
          hoverBg: 'hover:bg-purple-600',
          activeBg: 'bg-purple-500',
        };
      case 'light':
      default:
        return {
          bg: 'bg-white', // shadcn default light background
          text: 'text-slate-900',
          border: 'border-slate-200',
          accent: 'text-blue-600', // Example accent for light theme
          hoverBg: 'hover:bg-slate-100',
          activeBg: 'bg-slate-200', // Example active background for light theme
        };
    }
  };
  const themeClasses = getThemeClasses();

  if (!isOpen && isMobile) {
    return null;
  }

  return (
    <div 
      className={cn(
        "flex flex-col h-full w-64 border-r", 
        themeClasses.bg, 
        themeClasses.text, 
        themeClasses.border,
        className,
        isMobile && "fixed inset-y-0 left-0 z-50 shadow-lg",
        !isOpen && isMobile && "hidden" // Hide if not open on mobile
      )}
    >
      <div className={cn("p-4 border-b", themeClasses.border)}>
        <Link href="/dashboard">
          <div className="flex items-center space-x-2 cursor-pointer">
            <Building className={cn("h-8 w-8", themeClasses.accent)} />
            <span className={cn("text-xl font-bold", themeClasses.text)}>HR Portal</span>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1">
        <nav className="py-4 px-2">
          <div className="space-y-1 mb-4">
            {mainNavItems.map((item) => (
              <Link key={item.name} href={item.href} passHref legacyBehavior>
                <Button
                  variant={isActiveLink(item.href) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActiveLink(item.href) ? themeClasses.activeBg + ' ' + themeClasses.text : themeClasses.hoverBg,
                    themeClasses.text
                  )}
                  onClick={isMobile ? onClose : undefined}
                >
                  {item.icon}
                  {item.name}
                  {item.badge && <Badge variant="secondary" className="ml-auto">{item.badge}</Badge>}
                </Button>
              </Link>
            ))}
          </div>

          <Accordion 
            type="multiple" 
            value={activeCategories}
            onValueChange={setActiveCategories}
            className="w-full"
          >
            {navCategories.filter(category => hasAccess(category.roleAccess)).map((category) => (
              <AccordionItem value={category.name} key={category.name} className={cn("border-b-0", themeClasses.border)}>
                <AccordionTrigger 
                  className={cn(
                    "py-2 px-2 text-sm font-medium rounded-md w-full justify-between",
                    themeClasses.hoverBg,
                    themeClasses.text
                  )}
                >
                  <span className="flex items-center">
                    {/* Placeholder for category icon if needed in future */}
                    {category.name}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-0">
                  <div className="space-y-1 pl-4">
                    {category.items.filter(item => hasAccess(item.roleAccess)).map((item) => (
                      <Link key={item.name} href={item.href} passHref legacyBehavior>
                        <Button
                          variant={isActiveLink(item.href) ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start text-sm h-9",
                             isActiveLink(item.href) ? themeClasses.activeBg + ' ' + themeClasses.text : themeClasses.hoverBg,
                             themeClasses.text
                          )}
                          onClick={isMobile ? onClose : undefined}
                        >
                          {item.icon ? item.icon : <div className="mr-2 h-4 w-4" /> /* Placeholder for items without icons */}
                          {item.name}
                          {item.badge && <Badge variant="secondary" className="ml-auto">{item.badge}</Badge>}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Projects Section (Example: can be another accordion or a plain list) */}
          <div className="mt-6 px-2">
            <h3 className={cn("mb-2 text-xs font-semibold tracking-wider uppercase", themeClasses.text === 'text-slate-50' || themeClasses.text === 'text-purple-50' ? 'text-gray-400' : 'text-gray-500')}>
              Projects
            </h3>
            <div className="space-y-1">
              {projects.map((project) => (
                 <Link key={project.name} href={project.href} passHref legacyBehavior>
                    <Button
                      variant="ghost"
                      className={cn("w-full justify-start text-sm h-9", themeClasses.hoverBg, themeClasses.text)}
                      onClick={isMobile ? onClose : undefined}
                    >
                      <Layers className="mr-2 h-4 w-4" /> {/* Example Icon */}
                      {project.name}
                    </Button>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </ScrollArea>

      <div className={cn("mt-auto p-4 border-t", themeClasses.border)}>
        {user && (
          <div className="flex items-center mb-2">
            {/* Basic Avatar Placeholder */}
            <div className={cn("w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2", themeClasses.activeBg)}>
              <User className={cn("h-4 w-4", themeClasses.text)} />
            </div>
            <div>
              <p className={cn("text-sm font-medium", themeClasses.text)}>{user.email}</p>
              <p className={cn("text-xs", themeClasses.text === 'text-slate-50' || themeClasses.text === 'text-purple-50' ? 'text-gray-400' : 'text-gray-500' )}>{role}</p>
            </div>
          </div>
        )}
        <Button variant="outline" className={cn("w-full", themeClasses.hoverBg, themeClasses.text, themeClasses.border)} onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
} 
