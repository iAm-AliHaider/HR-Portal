import { useEffect, useState } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import { Box, Heading } from "@chakra-ui/react";
import { GetServerSideProps } from "next";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";

import ApplicationsList from "../../components/applications/ApplicationsList";
import { supabase } from "../../lib/supabase/client";

// Mock org ID for development
const DEFAULT_ORG_ID = "org1";

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default function ApplicationsPage() {
  const router = useRouter();
  const [orgId, setOrgId] = useState(DEFAULT_ORG_ID);
  const [viewMode, setViewMode] = useState<"applications" | "candidates">(
    "applications",
  );

  // Detect view mode from query parameter
  useEffect(() => {
    const view = router.query.view as string;
    if (view === "candidates") {
      setViewMode("candidates");
    } else {
      setViewMode("applications");
    }
  }, [router.query.view]);

  // In a real app, we'd fetch the user's org ID from supabase auth
  useEffect(() => {
    const fetchOrgId = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          // We would fetch the org_id from the user's profile or another table
          // For now, we'll use the default
          setOrgId(DEFAULT_ORG_ID);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchOrgId();
  }, []);

  // Determine page title based on view mode
  const pageTitle =
    viewMode === "candidates"
      ? "Candidates | HR Portal"
      : "Applications | HR Portal";
  const pageDescription =
    viewMode === "candidates"
      ? "View and manage candidate profiles and talent pool"
      : "View and manage job applications";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>

      <ModernDashboardLayout>
        <ApplicationsList orgId={orgId} viewMode={viewMode} />
      </ModernDashboardLayout>
    </>
  );
}
