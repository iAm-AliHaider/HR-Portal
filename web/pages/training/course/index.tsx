import { useEffect } from "react";

import { useRouter } from "next/router";

import { GetServerSideProps } from "next";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default function TrainingCourseIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the training page with the course tab selected
    router.replace("/training?tab=courses");
  }, [router]);

  return (
    <ModernDashboardLayout title="Training Courses" subtitle="Loading...">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    </ModernDashboardLayout>
  );
}
