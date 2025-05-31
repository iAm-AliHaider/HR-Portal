import { useEffect } from "react";

import { useRouter } from "next/router";

import { useAuth } from "@/hooks/useAuth";

type RequireRoleProps = {
  roles: string[];
  children: React.ReactNode;
};

/**
 * Component that checks if the current user has the required role to access content
 */
export default function RequireRole({ roles, children }: RequireRoleProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until auth state is loaded
    if (!loading) {
      // If no user is logged in, redirect to login
      if (!user) {
        router.push("/login?returnUrl=" + encodeURIComponent(router.asPath));
        return;
      }

      // If user doesn't have required role, redirect to unauthorized page
      if (!roles.includes(role)) {
        router.push("/unauthorized");
      }
    }
  }, [user, role, loading, router, roles]);

  // Show nothing while checking authorization
  if (loading || !user || !roles.includes(role)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // User has required role, render children
  return <>{children}</>;
}
