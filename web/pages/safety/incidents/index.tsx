import { useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function SafetyIncidentsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main safety page with the incidents tab pre-selected
    router.replace('/safety?tab=incidents');
  }, [router]);
  
  return (
    <DashboardLayout title="Safety Incidents" subtitle="Loading...">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    </DashboardLayout>
  );
} 
