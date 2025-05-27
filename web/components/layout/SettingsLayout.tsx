import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface SettingsLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  theme?: 'light' | 'dark' | 'purple';
}

export default function SettingsLayout({ 
  children, 
  title, 
  subtitle,
  theme = 'light'
}: SettingsLayoutProps) {
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
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-6">
          {title && (
            <div className="mt-4">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
            </div>
          )}
        </div>
        {children}
      </main>
    </div>
  );
} 
