import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';
import Sidebar from '../ui/Sidebar';
import Topbar from '../ui/Topbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { user, loading, error } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatches by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle authentication in useEffect to prevent SSR issues
  useEffect(() => {
    if (!loading && !user && isMounted) {
      // In production, redirect with a delay to prevent hydration issues
      const isProduction = process.env.NODE_ENV === 'production';
      const delay = isProduction ? 1000 : 0;
      
      setTimeout(() => {
        router.push('/login');
      }, delay);
    }
  }, [user, loading, router, isMounted]);

  // Show loading state while checking auth or before mount
  if (loading || !isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Authentication Error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated (with SSR safety)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>{title ? `${title} | HR Portal` : 'HR Portal'}</title>
          <meta name="description" content="HR Portal Dashboard" />
        </Head>
        
        {/* Layout structure */}
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="hidden lg:flex lg:flex-shrink-0">
            <div className="flex flex-col w-64">
              <Sidebar />
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top bar */}
            <Topbar />
            
            {/* Main content */}
            <main className="flex-1 overflow-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {(title || subtitle) && (
                  <div className="mb-8">
                    {title && (
                      <h1 className="text-2xl font-bold text-gray-900">
                        {title}
                      </h1>
                    )}
                    {subtitle && (
                      <p className="mt-1 text-sm text-gray-600">
                        {subtitle}
                      </p>
                    )}
                  </div>
                )}
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
} 
