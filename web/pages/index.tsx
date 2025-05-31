import { useEffect } from "react";

import { useRouter } from "next/router";

import { GetServerSideProps } from "next";

import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { user, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Check for bypass parameter for direct access to pages
      if (router.query.bypass === "true") {
        // Allow access without authentication
        return; // Don't redirect if bypassing auth
      }

      // Check for return URL from login
      const returnUrl = router.query.returnUrl as string;

      if (user) {
        // User is logged in
        if (returnUrl && returnUrl.startsWith("/")) {
          // Redirect to the original requested page
          router.replace(decodeURIComponent(returnUrl));
        } else {
          // Default redirect based on role
          switch (role) {
            case "admin":
            case "hr":
            case "manager":
              router.replace("/dashboard");
              break;
            case "employee":
              router.replace("/employee/dashboard");
              break;
            case "candidate":
              router.replace("/candidate/dashboard");
              break;
            default:
              router.replace("/dashboard");
          }
        }
      } else {
        // User is not logged in
        if (returnUrl && returnUrl.startsWith("/")) {
          // Redirect to login with return URL
          router.replace(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
        } else {
          // In development mode, redirect to the dev entry page
          if (process.env.NODE_ENV === "development") {
            router.replace("/dev-entry");
          } else {
            // Default to careers page for non-authenticated users
            router.replace("/careers");
          }
        }
      }
    }
  }, [user, loading, role, router]);

  // Show loading state while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3d91] mx-auto mb-6"></div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">HR Portal</h1>
        <p className="text-gray-600">Redirecting...</p>
        <div className="mt-4 space-x-4">
          <a href="/careers" className="text-blue-600 hover:underline">
            Careers
          </a>
          <a href="/login" className="text-blue-600 hover:underline">
            HR Login
          </a>
          <a href="/dev-entry" className="text-blue-600 hover:underline">
            Dev Entry
          </a>
        </div>
      </div>
    </div>
  );
}

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};
