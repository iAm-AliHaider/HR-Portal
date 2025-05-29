import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import SimpleDashboardLayout from '@/components/layout/SimpleDashboardLayout';

export default function IncidentsIndexPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the safety incidents page
    router.replace('/safety/incidents');
  }, [router]);
  
  return (
    <SimpleDashboardLayout title="Incident Management" subtitle="Loading...">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    </SimpleDashboardLayout>
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
