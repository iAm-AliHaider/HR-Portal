import React, { useEffect, useState } from 'react';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import { GetServerSideProps } from 'next';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { shouldBypassAuth } from '@/lib/auth';

interface SettingsLayoutWrapperProps {
  children: React.ReactNode;
}

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};

export default function SettingsLayoutWrapper({ children }: SettingsLayoutWrapperProps) {
  const { user, role, loading: authLoading } = useAuth();
  const router = useRouter();
  const allowAccess = shouldBypassAuth(router.query);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set a timeout to prevent infinite loading state
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    if (!authLoading) {
      setIsLoading(false);
      
      // Redirect if user doesn't have access
      if (!allowAccess && !['employee', 'manager', 'admin'].includes(role)) {
        router.push('/login');
      }
    }

    return () => clearTimeout(loadingTimeout);
  }, [authLoading, allowAccess, role, router]);

  // Show loading state while authentication is in progress
  if (isLoading) {
    return (
      <ModernDashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading settings...</p>
          </div>
        </div>
      </ModernDashboardLayout>
    );
  }

  return (
    <ModernDashboardLayout>
      {children}
    </ModernDashboardLayout>
  );
} 
