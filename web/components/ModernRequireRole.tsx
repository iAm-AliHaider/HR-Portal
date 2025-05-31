import { useState, useEffect } from "react";

import { useRouter } from "next/router";

import { Loader2, AlertCircle, Shield, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useAuth } from "../hooks/useAuth";

import { mockAccounts } from "./ui/MockAccountInfo";

interface ModernRequireRoleProps {
  allowed: string[];
  children: React.ReactNode;
  fallbackToPublic?: boolean; // Allow public access as fallback
  showInlineError?: boolean; // Show error inline instead of full page
}

export function ModernRequireRole({
  allowed,
  children,
  fallbackToPublic = false,
  showInlineError = false,
}: ModernRequireRoleProps) {
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

  // Loading state with modern design
  if (loading || isChecking) {
    if (showInlineError) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Loading...
          </h2>
          <p className="text-gray-600">Checking authentication status</p>
        </div>
      </div>
    );
  }

  // Handle authentication errors with modern design
  if (error) {
    const errorContent = (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Authentication Error
        </h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="space-y-3">
          <Button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <User className="w-4 h-4 mr-2" />
            Go to Login
          </Button>
          {fallbackToPublic && (
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          )}
        </div>
      </div>
    );

    if (showInlineError) {
      return (
        <Card>
          <CardContent className="p-8">{errorContent}</CardContent>
        </Card>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {errorContent}
      </div>
    );
  }

  // Handle unauthenticated users
  if (!user) {
    // Fallback to public access if allowed
    if (fallbackToPublic) {
      return <>{children}</>;
    }

    // Only redirect on client-side
    if (typeof window !== "undefined") {
      router.replace("/login");
    }
    return null;
  }

  // Use mockRole in development if available
  const effectiveRole = isDevelopment && mockRole ? mockRole : role;

  // Check role permissions
  const hasPermission =
    allowed.includes(effectiveRole ?? "") || (isDevelopment && mockRole);

  if (!hasPermission) {
    const accessDeniedContent = (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
          <Shield className="h-8 w-8 text-yellow-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Current role:</span>{" "}
              {effectiveRole || "none"}
            </p>
            <p>
              <span className="font-medium">Required roles:</span>{" "}
              {allowed.join(", ")}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go to Dashboard
          </Button>
          {isDevelopment && (
            <Button
              onClick={() => router.push("/set-mock-auth")}
              variant="outline"
            >
              Set Mock Role
            </Button>
          )}
        </div>
      </div>
    );

    if (showInlineError) {
      return (
        <Card>
          <CardContent className="p-8">{accessDeniedContent}</CardContent>
        </Card>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {accessDeniedContent}
      </div>
    );
  }

  // User has permission, render children
  return <>{children}</>;
}
