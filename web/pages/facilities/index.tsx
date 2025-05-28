import { useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { GetServerSideProps } from 'next';


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function FacilitiesIndexPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the facilities rooms page by default
    router.replace('/facilities/rooms');
  }, [router]);
  
  return (
    <DashboardLayout title="Facilities Management" subtitle="Loading...">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    </DashboardLayout>
  );
}
 
