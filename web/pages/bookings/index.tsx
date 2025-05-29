import { useEffect } from 'react';
import { useRouter } from 'next/router';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import { GetServerSideProps } from 'next';

export default function BookingsIndexPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the equipment booking page
    router.replace('/facilities/equipment');
  }, [router]);
  
  return (
    <ModernDashboardLayout title="Equipment Booking" subtitle="Loading...">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    </ModernDashboardLayout>
  );
}

// Force server-side rendering to prevent SSR issues
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      timestamp: new Date().toISOString(),
    },
  };
}; 
