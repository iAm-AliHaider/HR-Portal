import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // In development mode, redirect to the dev entry page
      if (process.env.NODE_ENV === 'development') {
        router.replace('/dev-entry');
        return;
      }
      
      // Check for bypass parameter for direct access to pages
      if (router.query.bypass === 'true') {
        // Allow access without authentication 
        return; // Don't redirect if bypassing auth
      }
      
      if (user) {
        // User is logged in, redirect to dashboard
        router.replace('/dashboard');
      } else {
        // User is not logged in, redirect to public careers page
        router.replace('/careers');
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3d91] mx-auto mb-6"></div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">HR Portal</h1>
        <p className="text-gray-600">Redirecting...</p>
        <div className="mt-4 space-x-4">
          <a href="/careers" className="text-blue-600 hover:underline">Careers</a>
          <a href="/login" className="text-blue-600 hover:underline">HR Login</a>
        </div>
      </div>
    </div>
  );
} 