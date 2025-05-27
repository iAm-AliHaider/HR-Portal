import React, { useState } from 'react';
import Sidebar from '../ui/Sidebar';
import Topbar from '../ui/Topbar';
import { useRouter } from 'next/router';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  theme?: 'light' | 'dark' | 'purple';
  actions?: React.ReactNode;
}

export default function DashboardLayout({ 
  children, 
  title, 
  subtitle,
  theme = 'light',
  actions
}: DashboardLayoutProps) {
  const router = useRouter();
  
  // Get current route for breadcrumbs
  const currentPath = router.pathname;

  // Get background color based on theme
  const getBackgroundColor = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-800';
      case 'purple':
        return 'bg-indigo-800';
      case 'light':
      default:
        return 'bg-gray-100';
    }
  };
  
  return (
    <div className={`${getBackgroundColor()} min-h-screen flex p-4`}>
      <div className="flex-shrink-0">
        <Sidebar theme={theme} />
      </div>
      <div className="flex-1 ml-4 flex flex-col rounded-2xl overflow-hidden bg-white">
        <Topbar theme={theme} />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mb-6">
            {(title || actions) && (
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                {title && (
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
                  </div>
                )}
                {actions && (
                  <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                    {actions}
                  </div>
                )}
              </div>
            )}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
} 
