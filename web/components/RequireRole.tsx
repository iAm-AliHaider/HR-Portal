import { useState, useEffect } from "react";

import { useRouter } from "next/router";

import { useAuth } from "../hooks/useAuth";

import { mockAccounts } from "./ui/MockAccountInfo";

export function RequireRole({
  allowed,
  children,
}: {
  allowed: string[];
  children: React.ReactNode;
}) {
  const { user, role, loading, error } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [mockRole, setMockRole] = useState<string | null>(null);
  const isDevelopment = process.env.NODE_ENV === "development";

  useEffect(() => {
    // Give the auth state time to load
    if (!loading) {
      setIsChecking(false);
    }

    // In development, check localStorage for mock role
    if (isDevelopment) {
      const storedEmail = localStorage.getItem("mockUserEmail");
      if (storedEmail) {
        const matchedAccount = mockAccounts.find(
          (account) => account.email === storedEmail,
        );
        if (matchedAccount) {
          setMockRole(matchedAccount.role);
        }
      }
    }
  }, [loading, isDevelopment]);

  // Store mock user email on first login for development
  useEffect(() => {
    if (isDevelopment && user?.email) {
      const matchedAccount = mockAccounts.find(
        (account) => account.email === user.email,
      );
      if (matchedAccount) {
        localStorage.setItem("mockUserEmail", user.email);
        setMockRole(matchedAccount.role);
      }
    }
  }, [user, isDevelopment]);

  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p>{error}</p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!user) {
    // Only redirect on client-side
    if (typeof window !== "undefined") {
      router.replace("/login");
    }
    return null;
  }

  // Use mockRole in development if available
  const effectiveRole = isDevelopment && mockRole ? mockRole : role;

  // Always allow access in development mode if using a mock account
  if (!allowed.includes(effectiveRole ?? "") && !(isDevelopment && mockRole)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-2">
            Current role: {effectiveRole || "none"}
          </p>
          <p className="text-sm text-gray-600">
            Required roles: {allowed.join(", ")}
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
