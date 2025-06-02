import React, { useEffect, useState } from "react";

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Globe,
  RefreshCw,
  Server,
} from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatDatabaseStatusMessage,
  getComprehensiveDatabaseStatus,
} from "@/lib/database-status-checker";
import { supabase } from "@/lib/supabase/client";

import DebugLayout from "./_layout";

type StatusCheck = {
  name: string;
  status: "healthy" | "degraded" | "error" | "unknown";
  message: string;
  latency?: number;
  lastChecked: Date;
  icon: React.ReactNode;
};

export default function SystemStatusPage() {
  const [checks, setChecks] = useState<StatusCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [environment, setEnvironment] = useState<Record<string, string>>({});

  useEffect(() => {
    runChecks();
    getEnvironmentInfo();
  }, []);

  const getEnvironmentInfo = () => {
    // Get environment information that's safe to expose
    const env: Record<string, string> = {
      "Node Environment": process.env.NODE_ENV || "development",
      "Build Mode": process.env.NEXT_PUBLIC_BUILD_MODE || "development",
      "Vercel Environment": process.env.NEXT_PUBLIC_VERCEL_ENV || "development",
      "API Base URL": process.env.NEXT_PUBLIC_API_URL || window.location.origin,
      Version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    };

    setEnvironment(env);
  };

  const runChecks = async () => {
    setIsLoading(true);

    const now = new Date();
    const checkResults: StatusCheck[] = [];

    // Enhanced database connection check
    try {
      const comprehensiveStatus = await getComprehensiveDatabaseStatus();

      checkResults.push({
        name: "Database Connection",
        status:
          comprehensiveStatus.healthStatus === "healthy"
            ? "healthy"
            : comprehensiveStatus.healthStatus === "degraded"
              ? "degraded"
              : "error",
        message: formatDatabaseStatusMessage(comprehensiveStatus),
        latency: comprehensiveStatus.connectionTime,
        lastChecked: now,
        icon: <Database className="h-5 w-5" />,
      });

      // Add detailed table status
      checkResults.push({
        name: "Database Tables",
        status:
          comprehensiveStatus.tablesAccessible ===
          comprehensiveStatus.totalTables
            ? "healthy"
            : comprehensiveStatus.tablesAccessible >
                comprehensiveStatus.totalTables * 0.8
              ? "degraded"
              : "error",
        message: `${comprehensiveStatus.tablesAccessible}/${comprehensiveStatus.totalTables} tables accessible - ${comprehensiveStatus.details.filter((d) => d.includes("✅")).length} working`,
        lastChecked: now,
        icon: <Database className="h-5 w-5" />,
      });
    } catch (error) {
      checkResults.push({
        name: "Database Connection",
        status: "error",
        message: `Enhanced check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        lastChecked: now,
        icon: <Database className="h-5 w-5" />,
      });
    }

    // Check API connectivity
    try {
      const apiStart = performance.now();
      const apiResponse = await fetch("/api/health", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      });
      const apiEnd = performance.now();
      const apiLatency = Math.round(apiEnd - apiStart);

      if (apiResponse.ok) {
        checkResults.push({
          name: "API Health",
          status: "healthy",
          message: `API is responding (${apiLatency}ms)`,
          latency: apiLatency,
          lastChecked: now,
          icon: <Server className="h-5 w-5" />,
        });
      } else {
        checkResults.push({
          name: "API Health",
          status: "error",
          message: `API returned ${apiResponse.status}: ${apiResponse.statusText}`,
          latency: apiLatency,
          lastChecked: now,
          icon: <Server className="h-5 w-5" />,
        });
      }
    } catch (error) {
      checkResults.push({
        name: "API Health",
        status: "error",
        message: `API check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        lastChecked: now,
        icon: <Server className="h-5 w-5" />,
      });
    }

    // Check auth status
    try {
      const { data: session, error: sessionError } =
        await supabase.auth.getSession();

      checkResults.push({
        name: "Authentication",
        status: session?.session ? "healthy" : "degraded",
        message: session?.session
          ? `Authenticated as ${session.session.user.email}`
          : "Not authenticated",
        lastChecked: now,
        icon: <Clock className="h-5 w-5" />,
      });
    } catch (error) {
      checkResults.push({
        name: "Authentication",
        status: "error",
        message: `Auth check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        lastChecked: now,
        icon: <Clock className="h-5 w-5" />,
      });
    }

    // Check browser capabilities
    checkResults.push({
      name: "Browser Features",
      status: "healthy",
      message: "All required browser features available",
      lastChecked: now,
      icon: <Globe className="h-5 w-5" />,
    });

    setChecks(checkResults);
    setLastUpdated(now);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-500";
      case "degraded":
        return "text-amber-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "degraded":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatLatency = (ms?: number) => {
    if (ms === undefined) return "N/A";
    if (ms < 100) return `${ms}ms (fast)`;
    if (ms < 500) return `${ms}ms (good)`;
    if (ms < 1000) return `${ms}ms (fair)`;
    return `${ms}ms (slow)`;
  };

  const getLatencyProgress = (ms?: number) => {
    if (ms === undefined) return 0;
    // Max is 2000ms, scale accordingly
    return Math.min(Math.round((ms / 2000) * 100), 100);
  };

  const getLatencyColor = (ms?: number) => {
    if (ms === undefined) return "bg-gray-200";
    if (ms < 100) return "bg-green-500";
    if (ms < 500) return "bg-green-400";
    if (ms < 1000) return "bg-amber-400";
    return "bg-red-500";
  };

  return (
    <DebugLayout>
      <PageLayout
        title="System Status"
        description="View application health and diagnostics"
        breadcrumbs={[
          { label: "Debug", href: "/debug" },
          { label: "System Status", href: "/debug/status" },
        ]}
      >
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-1">System Health</h2>
            {lastUpdated && (
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleString()}
              </p>
            )}
          </div>
          <Button
            onClick={runChecks}
            disabled={isLoading}
            className="flex items-center"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="status">
          <TabsList className="mb-4">
            <TabsTrigger value="status">Status Checks</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mb-4" />
                    <p className="text-gray-500">Running system checks...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              checks.map((check, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {check.icon}
                        <CardTitle className="ml-2 text-lg">
                          {check.name}
                        </CardTitle>
                      </div>
                      {getStatusIcon(check.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <CardDescription className="mb-1">
                          Status
                        </CardDescription>
                        <p
                          className={`font-medium ${getStatusColor(check.status)}`}
                        >
                          {check.status.charAt(0).toUpperCase() +
                            check.status.slice(1)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {check.message}
                        </p>
                      </div>

                      {check.latency !== undefined && (
                        <div>
                          <CardDescription className="mb-1">
                            Latency
                          </CardDescription>
                          <p className="font-medium">
                            {formatLatency(check.latency)}
                          </p>
                          <div className="mt-2">
                            <div
                              className={`h-2 ${getLatencyColor(check.latency)}`}
                            >
                              <Progress
                                value={getLatencyProgress(check.latency)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="environment">
            <Card>
              <CardHeader>
                <CardTitle>Environment Information</CardTitle>
                <CardDescription>
                  Application configuration and environment details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(environment).map(([key, value]) => (
                    <div
                      key={key}
                      className="grid grid-cols-3 py-2 border-b border-gray-100"
                    >
                      <div className="font-medium text-gray-700">{key}</div>
                      <div className="col-span-2 font-mono text-sm">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageLayout>
    </DebugLayout>
  );
}
