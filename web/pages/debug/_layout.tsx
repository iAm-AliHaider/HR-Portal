import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import DebugSidebar from '@/components/ui/DebugSidebar';
import Topbar from '@/components/ui/Topbar';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

interface DebugLayoutProps {
  children: React.ReactNode;
}

export default function DebugLayout({ children }: DebugLayoutProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [authTimeout, setAuthTimeout] = React.useState(false);

  // Only render after component is mounted to prevent hydration errors
  useEffect(() => {
    setMounted(true);
    
    // Handle authentication timeouts
    const handleAuthTimeout = (event: any) => {
      if (event?.detail?.message?.includes('Authentication timeout reached')) {
        console.log('Debug mode: Handling auth timeout gracefully');
        setAuthTimeout(true);
      }
    };
    
    // Listen for console warnings about auth timeouts
    window.addEventListener('unhandledrejection', handleAuthTimeout);
    window.addEventListener('error', handleAuthTimeout);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleAuthTimeout);
      window.removeEventListener('error', handleAuthTimeout);
    };
  }, []);

  if (!mounted) {
    // Return a placeholder during SSR/hydration
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex flex-col h-screen overflow-auto">
          <div className="animate-pulse p-6 bg-gray-100 w-full h-16"></div>
          <main className="flex-1 p-6">
            <div className="animate-pulse p-6 bg-gray-100 w-full h-full rounded"></div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<DebugErrorFallback />}>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <DebugSidebar 
          isMobile={false} 
          onClose={() => setMobileMenuOpen(false)}
        />
        
        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <DebugSidebar 
            isMobile={true} 
            onClose={() => setMobileMenuOpen(false)}
          />
        )}
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen overflow-auto">
          <Topbar 
            theme="light" 
            onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

// Fallback component for when errors occur
function DebugErrorFallback() {
  const router = useRouter();
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col h-screen overflow-auto">
        <div className="p-6 bg-red-50 border-b border-red-200">
          <h1 className="text-xl font-semibold text-red-700">Debug Interface Error</h1>
        </div>
        <main className="flex-1 p-6">
          <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md border border-red-200 mt-8">
            <h2 className="text-xl font-semibold mb-4">An error occurred in the debug interface</h2>
            <p className="mb-6">
              There was a problem loading this debug page. This could be due to authentication
              issues or an API connection problem.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => router.reload()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Reload Page
              </button>
              <button
                onClick={() => router.push('/debug')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
              >
                Return to Debug Home
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 