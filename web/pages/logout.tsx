import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase/client';

export default function LogoutPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const performLogout = async () => {
      try {
        // Start with a direct Supabase signOut as a first attempt
        await supabase.auth.signOut();
        
        // Then use our auth hook's signOut for complete cleanup
        await signOut();
        
        // If we're still on this page after 3 seconds, force redirect
        setTimeout(() => {
          if (window.location.pathname.includes('logout')) {
            console.log('Logout timeout reached, forcing redirect');
            window.location.href = '/login';
          }
        }, 3000);
      } catch (err) {
        console.error('Logout error:', err);
        setError('An error occurred during logout. Redirecting to login page...');
        
        // Even on error, redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    };
    
    performLogout();
  }, [router, signOut]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-medium text-gray-700">Logging out...</h2>
        <p className="text-gray-500 mt-2">You will be redirected shortly.</p>
        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}
      </div>
    </div>
  );
} 
