import { useEffect, useState } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import { Box, Heading, Container, Spinner, Flex } from "@chakra-ui/react";
import { GetServerSideProps } from "next";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";

import OfferForm from "../../../../components/offers/OfferForm";
import { getApplicationById } from "../../../../services/applications";

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default function NewOfferPage() {
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
            router.push("/applications");
          }
        } catch (error) {
          console.error("Error checking application:", error);
          router.push("/applications");
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkApplication();
  }, [applicationId, router]);

  if (isLoading) {
    return (
      <ModernDashboardLayout>
        <Flex justify="center" align="center" height="50vh">
          <Spinner size="xl" />
        </Flex>
      </ModernDashboardLayout>
    );
  }

  if (!applicationExists) {
    return null; // This will not render as the router will redirect
  }

  return (
    <>
      <Head>
        <title>Create Offer | HR Portal</title>
        <meta name="description" content="Create a job offer for a candidate" />
      </Head>

      <ModernDashboardLayout>
        <Container maxW="container.xl" py={6}>
          <Heading size="lg" mb={6}>
            Create Offer
          </Heading>
          <OfferForm applicationId={applicationId as string} />
        </Container>
      </ModernDashboardLayout>
    </>
  );
}
