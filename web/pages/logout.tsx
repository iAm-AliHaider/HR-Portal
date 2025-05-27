import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

export default function LogoutPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  
  useEffect(() => {
    const performLogout = async () => {
      await signOut();
      router.push('/login');
    };
    
    performLogout();
  }, [router, signOut]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-medium text-gray-700">Logging out...</h2>
        <p className="text-gray-500 mt-2">You will be redirected shortly.</p>
      </div>
    </div>
  );
} 