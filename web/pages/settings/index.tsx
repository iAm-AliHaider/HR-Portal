import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { shouldBypassAuth } from '@/lib/auth';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';

const SettingsPage = () => {
  const router = useRouter();
  const { user, role } = useAuth();
  const allowAccess = shouldBypassAuth(router.query);
  const [isLoading, setIsLoading] = useState(true);

  // Ensure user has access to this page
  useEffect(() => {
    if (!allowAccess && !['employee', 'manager', 'admin'].includes(role)) {
      router.push('/login?redirect=/settings');
    }
  }, [allowAccess, role, router]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const settingsCategories = [
    {
      name: 'General',
      description: 'System preferences and general configuration',
      href: '/settings/general',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-blue-500',
      access: ['employee', 'manager', 'admin']
    },
    {
      name: 'Company Profile',
      description: 'Manage company information and branding',
      href: '/settings/company',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'bg-purple-500',
      access: ['admin']
    },
    {
      name: 'User Management',
      description: 'Manage user accounts and permissions',
      href: '/settings/users',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'bg-green-500',
      access: ['admin', 'manager']
    },
    {
      name: 'Roles & Permissions',
      description: 'Configure roles and access controls',
      href: '/settings/roles',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'bg-yellow-500',
      access: ['admin']
    },
    {
      name: 'Security',
      description: 'Security policies and access controls',
      href: '/settings/security',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      color: 'bg-red-500',
      access: ['admin']
    },
    {
      name: 'Integrations',
      description: 'Third-party integrations and API connections',
      href: '/settings/integrations',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      color: 'bg-indigo-500',
      access: ['admin']
    },
    {
      name: 'Notifications',
      description: 'Configure email and system notifications',
      href: '/settings/notifications',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v2H4zm0-4h8v2H4zm0-4h8v2H4zm0-4h8v2H4zM4 3h8v2H4z" />
        </svg>
      ),
      color: 'bg-pink-500',
      access: ['employee', 'manager', 'admin']
    },
    {
      name: 'Workflows',
      description: 'Configure business processes and approval workflows',
      href: '/settings/workflows',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'bg-teal-500',
      access: ['admin', 'manager']
    }
  ];

  const getVisibleSettings = () => {
    return settingsCategories.filter(setting => 
      setting.access.includes(role)
    );
  };

  if (!allowAccess && !['employee', 'manager', 'admin'].includes(role)) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Settings" subtitle="Manage your application settings and configuration">
      <Head>
        <title>Settings - HR Management</title>
        <meta name="description" content="Manage application settings and configuration" />
      </Head>
      
      <div className="p-4 md:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getVisibleSettings().map((setting) => (
              <Link
                key={setting.name}
                href={setting.href}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${setting.color} text-white mr-4`}>
                    {setting.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{setting.name}</h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{setting.description}</p>
                <div className="mt-4 flex items-center text-blue-600">
                  <span className="text-sm font-medium">Configure</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow text-left">
              <div className="text-sm font-medium text-gray-900">Export Data</div>
              <div className="text-xs text-gray-500">Download system data</div>
            </button>
            <button className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow text-left">
              <div className="text-sm font-medium text-gray-900">System Backup</div>
              <div className="text-xs text-gray-500">Create backup</div>
            </button>
            <button className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow text-left">
              <div className="text-sm font-medium text-gray-900">Clear Cache</div>
              <div className="text-xs text-gray-500">Refresh system cache</div>
            </button>
            <button className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow text-left">
              <div className="text-sm font-medium text-gray-900">System Status</div>
              <div className="text-xs text-gray-500">View system health</div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage; 
