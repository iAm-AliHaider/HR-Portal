import React, { useState, useEffect } from "react";

import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Database,
  Lock,
  FileText,
  User,
  RefreshCw,
  Clock,
  ShieldCheck,
  Layers,
} from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

import DebugLayout from "./_layout";

// Type definition for test results
interface TestResult {
  name: string;
  status: "success" | "error" | "pending";
  message: string;
  duration?: number;
}

export default function SupabaseTestPage() {
  const { user, role } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastTestTime, setLastTestTime] = useState<string | null>(null);

  // Helper function to format duration
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  // Helper to add test result
  const addTestResult = (result: TestResult) => {
    setTestResults((prev) => [...prev, result]);
  };

  // Test Supabase configuration
  const testConfiguration = async () => {
    const startTime = performance.now();
    try {
      const configured = isSupabaseConfigured();
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      if (configured) {
        addTestResult({
          name: "Supabase Configuration",
          status: "success",
          message: "Supabase is properly configured",
          duration,
        });
      } else {
        addTestResult({
          name: "Supabase Configuration",
          status: "error",
          message: "Supabase is not properly configured",
          duration,
        });
      }
    } catch (error: any) {
      const endTime = performance.now();
      addTestResult({
        name: "Supabase Configuration",
        status: "error",
        message: `Error checking configuration: ${error.message || "Unknown error"}`,
        duration: Math.round(endTime - startTime),
      });
    }
  };

  // Test authentication
  const testAuthentication = async () => {
    const startTime = performance.now();
    try {
      const { data, error } = await supabase.auth.getSession();
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      if (error) {
        addTestResult({
          name: "Authentication",
          status: "error",
          message: `Error getting session: ${error.message}`,
          duration,
        });
        return;
      }

      if (data.session) {
        addTestResult({
          name: "Authentication",
          status: "success",
          message: `Active session found for user: ${data.session.user.email}`,
          duration,
        });
      } else {
        addTestResult({
          name: "Authentication",
          status: "error",
          message: "No active session found",
          duration,
        });
      }
    } catch (error: any) {
      const endTime = performance.now();
      addTestResult({
        name: "Authentication",
        status: "error",
        message: `Error testing authentication: ${error.message || "Unknown error"}`,
        duration: Math.round(endTime - startTime),
      });
    }
  };

  // Test database connection
  const testDatabase = async () => {
    const startTime = performance.now();
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("count")
        .limit(1);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      if (error) {
        addTestResult({
          name: "Database Connection",
          status: "error",
          message: `Error querying database: ${error.message}`,
          duration,
        });
        return;
      }

      addTestResult({
        name: "Database Connection",
        status: "success",
        message: "Successfully queried profiles table",
        duration,
      });
    } catch (error: any) {
      const endTime = performance.now();
      addTestResult({
        name: "Database Connection",
        status: "error",
        message: `Error testing database: ${error.message || "Unknown error"}`,
        duration: Math.round(endTime - startTime),
      });
    }
  };

  // Test specific tables
  const testTables = async () => {
    const tables = [
      "profiles",
      "employees",
      "departments",
      "jobs",
      "applications",
    ];

    for (const table of tables) {
      const startTime = performance.now();
      try {
        const { data, error } = await supabase
          .from(table)
          .select("count")
          .limit(1);
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);

        if (error) {
          addTestResult({
            name: `Table: ${table}`,
            status: "error",
            message: `Error querying ${table}: ${error.message}`,
            duration,
          });
        } else {
          addTestResult({
            name: `Table: ${table}`,
            status: "success",
            message: `Successfully queried ${table} table`,
            duration,
          });
        }
      } catch (error: any) {
        const endTime = performance.now();
        addTestResult({
          name: `Table: ${table}`,
          status: "error",
          message: `Error testing ${table}: ${error.message || "Unknown error"}`,
          duration: Math.round(endTime - startTime),
        });
      }
    }
  };

  // Test user profile retrieval
  const testUserProfile = async () => {
    if (!user) {
      addTestResult({
        name: "User Profile",
        status: "error",
        message: "No authenticated user found",
      });
      return;
    }

    const startTime = performance.now();
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      if (error) {
        addTestResult({
          name: "User Profile",
          status: "error",
          message: `Error retrieving profile: ${error.message}`,
          duration,
        });
        return;
      }

      addTestResult({
        name: "User Profile",
        status: "success",
        message: `Successfully retrieved profile for ${data.email || user.email}`,
        duration,
      });
    } catch (error: any) {
      const endTime = performance.now();
      addTestResult({
        name: "User Profile",
        status: "error",
        message: `Error testing profile retrieval: ${error.message || "Unknown error"}`,
        duration: Math.round(endTime - startTime),
      });
    }
  };

  // Test logout and login (partial - just logout functionality)
  const testLogout = async () => {
    const startTime = performance.now();
    try {
      // Just test the signOut function without actually signing out the current user
      const { error } = await supabase.auth.signOut({ scope: "others" });
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      if (error) {
        addTestResult({
          name: "Sign Out Functionality",
          status: "error",
          message: `Error during signOut test: ${error.message}`,
          duration,
        });
        return;
      }

      addTestResult({
        name: "Sign Out Functionality",
        status: "success",
        message: "Sign out API works correctly",
        duration,
      });
    } catch (error: any) {
      const endTime = performance.now();
      addTestResult({
        name: "Sign Out Functionality",
        status: "error",
        message: `Error testing sign out: ${error.message || "Unknown error"}`,
        duration: Math.round(endTime - startTime),
      });
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setIsLoading(true);
    setTestResults([]);

    try {
      await testConfiguration();
      await testAuthentication();
      await testDatabase();
      await testTables();
      await testUserProfile();
      await testLogout();

      setLastTestTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error running tests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Run tests on initial load
  useEffect(() => {
    runAllTests();
  }, []);

  // Get icon for test status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get icon for test type
  const getTestIcon = (testName: string) => {
    if (testName.includes("Configuration"))
      return <Layers className="h-4 w-4" />;
    if (testName.includes("Authentication"))
      return <Lock className="h-4 w-4" />;
    if (testName.includes("Database")) return <Database className="h-4 w-4" />;
    if (testName.includes("Table")) return <FileText className="h-4 w-4" />;
    if (testName.includes("Profile")) return <User className="h-4 w-4" />;
    if (testName.includes("Sign Out"))
      return <ShieldCheck className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  return (
    <DebugLayout>
      <PageLayout
        title="Supabase Connection Tests"
        description="Test and verify all Supabase connections and functionality"
        breadcrumbs={[
          { label: "Debug", href: "/debug" },
          { label: "Supabase Tests", href: "/debug/supabase-test" },
        ]}
      >
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-1">
              Supabase Connection Diagnostics
            </h2>
            <p className="text-gray-500">
              {lastTestTime
                ? `Last tested: ${lastTestTime}`
                : "Testing Supabase connections..."}
            </p>
          </div>
          <Button
            onClick={runAllTests}
            disabled={isLoading}
            className="flex items-center"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Run Tests
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {testResults.map((test, index) => (
            <Card key={index} className="p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getTestIcon(test.name)}
                  <h3 className="font-medium ml-2">{test.name}</h3>
                </div>
                <div className="flex items-center">
                  {test.duration && (
                    <span className="text-xs text-gray-500 mr-3">
                      {formatDuration(test.duration)}
                    </span>
                  )}
                  {getStatusIcon(test.status)}
                </div>
              </div>
              <p
                className={`mt-2 text-sm ${
                  test.status === "success"
                    ? "text-green-700"
                    : test.status === "error"
                      ? "text-red-700"
                      : "text-gray-700"
                }`}
              >
                {test.message}
              </p>
            </Card>
          ))}

          {testResults.length === 0 && isLoading && (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="mt-4 text-gray-500">Running tests...</p>
            </div>
          )}

          {testResults.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 mx-auto text-gray-400" />
              <p className="mt-4 text-gray-500">No test results available</p>
            </div>
          )}
        </div>
      </PageLayout>
    </DebugLayout>
  );
}
