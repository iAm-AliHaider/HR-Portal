import { useEffect } from 'react';
import { useRouter } from 'next/router';
import SimpleDashboardLayout from '@/components/layout/SimpleDashboardLayout';
import { GetServerSideProps } from 'next';


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function SafetyChecksPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main safety page with the checks tab pre-selected
    router.replace('/safety?tab=checks');
  }, [router]);
  
  return (
    <SimpleDashboardLayout title="Safety Checks" subtitle="Loading...">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    </SimpleDashboardLayout>
  );
} 
