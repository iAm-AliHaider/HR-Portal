import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Box, Container } from '@chakra-ui/react';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import RecruitmentDashboard from '../../components/dashboard/RecruitmentDashboard';
import { supabase } from '../../lib/supabase/client';
import { GetServerSideProps } from 'next';

// Mock org ID for development
const DEFAULT_ORG_ID = 'org1';


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function RecruitmentDashboardPage() {
  const [orgId, setOrgId] = useState(DEFAULT_ORG_ID);
  
  // In a real app, we'd fetch the user's org ID from supabase auth
  useEffect(() => {
    const fetchOrgId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // We would fetch the org_id from the user's profile or another table
          // For now, we'll use the default
          setOrgId(DEFAULT_ORG_ID);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchOrgId();
  }, []);

  return (
    <>
      <Head>
        <title>Recruitment Dashboard | HR Portal</title>
        <meta name="description" content="Recruitment analytics and metrics" />
      </Head>
      
      <ModernDashboardLayout>
        <Container maxW="container.xl" py={6}>
          <RecruitmentDashboard orgId={orgId} />
        </Container>
      </ModernDashboardLayout>
    </>
  );
} 
