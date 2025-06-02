import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home,
  Users,
  Briefcase,
  Calendar,
  Package,
  FileText,
  Settings,
  Activity
} from 'lucide-react';

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  testId?: string;
}

const navigationItems: NavigationItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <Home className="h-4 w-4" />,
    testId: 'nav-dashboard'
  },
  {
    href: '/people',
    label: 'People',
    icon: <Users className="h-4 w-4" />,
    testId: 'nav-people'
  },
  {
    href: '/jobs',
    label: 'Jobs',
    icon: <Briefcase className="h-4 w-4" />,
    testId: 'nav-jobs'
  },
  {
    href: '/leave',
    label: 'Leave',
    icon: <Calendar className="h-4 w-4" />,
    testId: 'nav-leave'
  },
  {
    href: '/assets',
    label: 'Assets',
    icon: <Package className="h-4 w-4" />,
    testId: 'nav-assets'
  },
  {
    href: '/requests',
    label: 'Requests',
    icon: <FileText className="h-4 w-4" />,
    testId: 'nav-requests'
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: <Settings className="h-4 w-4" />,
    testId: 'nav-settings'
  },
  {
    href: '/debug/status',
    label: 'System Status',
    icon: <Activity className="h-4 w-4" />,
    testId: 'nav-debug-status'
  }
];

interface MainNavigationProps {
  className?: string;
}

export function MainNavigation({ className = '' }: MainNavigationProps) {
  const router = useRouter();

  return (
    <nav className={`space-y-1 ${className}`} role="navigation" data-testid="main-navigation">
      {navigationItems.map((item) => {
        const isActive = router.pathname === item.href ||
                        (item.href !== '/dashboard' && router.pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            data-testid={item.testId}
            className={`
              flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `.trim()}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export { navigationItems };