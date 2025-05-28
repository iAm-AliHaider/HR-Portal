import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Box, Heading, Container, Spinner, Flex } from '@chakra-ui/react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import InterviewForm from '../../../../components/interviews/InterviewForm';
import { getApplicationById } from '../../../../services/applications';
import { GetServerSideProps } from 'next';


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function NewInterviewPage() {
  const router = useRouter();
  const { id: applicationId } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [applicationExists, setApplicationExists] = useState(false);

  useEffect(() => {
    const checkApplication = async () => {
      if (applicationId) {
        try {
          setIsLoading(true);
          const application = await getApplicationById(applicationId as string);
          if (application) {
            setApplicationExists(true);
          } else {
            // Application doesn't exist, redirect
            router.push('/applications');
          }
        } catch (error) {
          console.error('Error checking application:', error);
          router.push('/applications');
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkApplication();
  }, [applicationId, router]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <Flex justify="center" align="center" height="50vh">
          <Spinner size="xl" />
        </Flex>
      </DashboardLayout>
    );
  }

  if (!applicationExists) {
    return null; // This will not render as the router will redirect
  }

  return (
    <>
      <Head>
        <title>Schedule Interview | HR Portal</title>
        <meta name="description" content="Schedule an interview with a candidate" />
      </Head>
      
      <DashboardLayout>
        <Container maxW="container.xl" py={6}>
          <Heading size="lg" mb={6}>Schedule Interview</Heading>
          <InterviewForm applicationId={applicationId as string} />
        </Container>
      </DashboardLayout>
    </>
  );
} 