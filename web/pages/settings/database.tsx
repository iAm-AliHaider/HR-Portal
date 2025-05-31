import React, { useState, useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import {
  Database,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Settings,
  Shield,
  Activity,
  ArrowLeft,
  Clock,
  HardDrive,
  Wifi,
  Eye,
  EyeOff,
} from "lucide-react";
import { GetServerSideProps } from "next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

// Database Settings Interface
interface DatabaseSettings {
  connection: {
    host: string;
    port: number;
    database: string;
    ssl: boolean;
    pool_size: number;
    timeout: number;
    max_connections: number;
  };
  backup: {
    enabled: boolean;
    frequency: "daily" | "weekly" | "monthly";
    retention_days: number;
    storage_location: string;
    compression: boolean;
    encryption: boolean;
    last_backup: string;
  };
  performance: {
    cache_enabled: boolean;
    cache_ttl: number;
    query_timeout: number;
    max_connections: number;
    slow_query_threshold: number;
    index_optimization: boolean;
  };
  monitoring: {
    slow_query_log: boolean;
    performance_metrics: boolean;
    error_tracking: boolean;
    health_checks: boolean;
    alert_thresholds: {
      cpu_usage: number;
      memory_usage: number;
      connection_count: number;
      response_time: number;
    };
  };
}

const DatabaseSettingsPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("connection");
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "testing"
  >("connected");
  const [showPassword, setShowPassword] = useState(false);
  const [lastTested, setLastTested] = useState<string>("");

  // Database settings state
  const [settings, setSettings] = useState<DatabaseSettings>({
    connection: {
      host: "localhost",
      port: 5432,
      database: "hr_portal",
      ssl: true,
      pool_size: 10,
      timeout: 30,
      max_connections: 100,
    },
    backup: {
      enabled: true,
      frequency: "daily",
      retention_days: 30,
      storage_location: "supabase-backup",
      compression: true,
      encryption: true,
      last_backup: "2024-01-20T02:00:00Z",
    },
    performance: {
      cache_enabled: true,
      cache_ttl: 3600,
      query_timeout: 30,
      max_connections: 100,
      slow_query_threshold: 1000,
      index_optimization: true,
    },
    monitoring: {
      slow_query_log: true,
      performance_metrics: true,
      error_tracking: true,
      health_checks: true,
      alert_thresholds: {
        cpu_usage: 80,
        memory_usage: 85,
        connection_count: 90,
        response_time: 2000,
      },
    },
  });

  // Connection stats (mock data)
  const connectionStats = {
    active_connections: 15,
    total_queries_today: 2456,
    avg_response_time: 145,
    cache_hit_ratio: 94.2,
    storage_used: "2.3 GB",
    storage_available: "47.7 GB",
  };

  // Recent activity (mock data)
  const recentActivity = [
    {
      time: "2024-01-20T10:30:00Z",
      event: "Database backup completed",
      status: "success",
    },
    {
      time: "2024-01-20T09:15:00Z",
      event: "Performance optimization started",
      status: "info",
    },
    {
      time: "2024-01-20T08:00:00Z",
      event: "Daily health check passed",
      status: "success",
    },
    {
      time: "2024-01-19T23:45:00Z",
      event: "Slow query detected: users table scan",
      status: "warning",
    },
  ];

  // Handle settings update
  const updateSetting = (
    category: keyof DatabaseSettings,
    field: string,
    value: any,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  // Handle nested settings update
  const updateNestedSetting = (
    category: keyof DatabaseSettings,
    parent: string,
    field: string,
    value: any,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [parent]: {
          ...(prev[category] as any)[parent],
          [field]: value,
        },
      },
    }));
  };

  // Test database connection
  const testConnection = async () => {
    setConnectionStatus("testing");

    try {
      // Simulate API call to test connection
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setConnectionStatus("connected");
      setLastTested(new Date().toISOString());
    } catch (error) {
      setConnectionStatus("disconnected");
    }
  };

  // Save settings
  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Database settings saved successfully!");
    } catch (error) {
      alert("Failed to save database settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check user permissions
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You need administrator privileges to access database settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Database Settings | HR System</title>
      </Head>

      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button
                variant="outline"
                onClick={() => router.push("/settings")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Settings
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Database className="h-6 w-6 mr-2" />
                  Database Settings
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage database connections, backups, and performance
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div
                  className={`h-3 w-3 rounded-full mr-2 ${
                    connectionStatus === "connected"
                      ? "bg-green-500"
                      : connectionStatus === "testing"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-gray-600">
                  {connectionStatus === "connected"
                    ? "Connected"
                    : connectionStatus === "testing"
                      ? "Testing..."
                      : "Disconnected"}
                </span>
              </div>
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {isSubmitting ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Wifi className="h-8 w-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">
                      Active Connections
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {connectionStats.active_connections}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">
                      Queries Today
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {connectionStats.total_queries_today.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-orange-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">
                      Avg Response
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {connectionStats.avg_response_time}ms
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-purple-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">
                      Cache Hit Ratio
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {connectionStats.cache_hit_ratio}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <HardDrive className="h-8 w-8 text-indigo-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">
                      Storage Used
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {connectionStats.storage_used}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Database className="h-8 w-8 text-teal-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">
                      Available
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {connectionStats.storage_available}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Settings */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} defaultValue="connection">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger
                  value="connection"
                  onClick={() => setActiveTab("connection")}
                >
                  Connection
                </TabsTrigger>
                <TabsTrigger
                  value="backup"
                  onClick={() => setActiveTab("backup")}
                >
                  Backup
                </TabsTrigger>
                <TabsTrigger
                  value="performance"
                  onClick={() => setActiveTab("performance")}
                >
                  Performance
                </TabsTrigger>
                <TabsTrigger
                  value="monitoring"
                  onClick={() => setActiveTab("monitoring")}
                >
                  Monitoring
                </TabsTrigger>
              </TabsList>

              {/* Connection Settings */}
              <TabsContent value="connection">
                <Card>
                  <CardHeader>
                    <CardTitle>Database Connection</CardTitle>
                    <CardDescription>
                      Configure database connection settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Host
                        </label>
                        <input
                          type="text"
                          value={settings.connection.host}
                          onChange={(e) =>
                            updateSetting("connection", "host", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="localhost"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Port
                        </label>
                        <input
                          type="number"
                          value={settings.connection.port}
                          onChange={(e) =>
                            updateSetting(
                              "connection",
                              "port",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="5432"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Database Name
                        </label>
                        <input
                          type="text"
                          value={settings.connection.database}
                          onChange={(e) =>
                            updateSetting(
                              "connection",
                              "database",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="hr_portal"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pool Size
                        </label>
                        <input
                          type="number"
                          value={settings.connection.pool_size}
                          onChange={(e) =>
                            updateSetting(
                              "connection",
                              "pool_size",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timeout (seconds)
                        </label>
                        <input
                          type="number"
                          value={settings.connection.timeout}
                          onChange={(e) =>
                            updateSetting(
                              "connection",
                              "timeout",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Connections
                        </label>
                        <input
                          type="number"
                          value={settings.connection.max_connections}
                          onChange={(e) =>
                            updateSetting(
                              "connection",
                              "max_connections",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="100"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="ssl"
                        checked={settings.connection.ssl}
                        onChange={(e) =>
                          updateSetting("connection", "ssl", e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="ssl"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Enable SSL Connection
                      </label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={testConnection}
                      disabled={connectionStatus === "testing"}
                      variant="outline"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {connectionStatus === "testing"
                        ? "Testing..."
                        : "Test Connection"}
                    </Button>
                    {lastTested && (
                      <span className="ml-4 text-sm text-gray-500">
                        Last tested: {new Date(lastTested).toLocaleString()}
                      </span>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Backup Settings */}
              <TabsContent value="backup">
                <Card>
                  <CardHeader>
                    <CardTitle>Backup Configuration</CardTitle>
                    <CardDescription>
                      Manage database backup settings and schedule
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="backup_enabled"
                        checked={settings.backup.enabled}
                        onChange={(e) =>
                          updateSetting("backup", "enabled", e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="backup_enabled"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Enable Automatic Backups
                      </label>
                    </div>

                    {settings.backup.enabled && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Backup Frequency
                            </label>
                            <select
                              value={settings.backup.frequency}
                              onChange={(e) =>
                                updateSetting(
                                  "backup",
                                  "frequency",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Retention (days)
                            </label>
                            <input
                              type="number"
                              value={settings.backup.retention_days}
                              onChange={(e) =>
                                updateSetting(
                                  "backup",
                                  "retention_days",
                                  parseInt(e.target.value),
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="30"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Storage Location
                            </label>
                            <input
                              type="text"
                              value={settings.backup.storage_location}
                              onChange={(e) =>
                                updateSetting(
                                  "backup",
                                  "storage_location",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="supabase-backup"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="compression"
                              checked={settings.backup.compression}
                              onChange={(e) =>
                                updateSetting(
                                  "backup",
                                  "compression",
                                  e.target.checked,
                                )
                              }
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label
                              htmlFor="compression"
                              className="ml-2 block text-sm text-gray-900"
                            >
                              Enable Compression
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="encryption"
                              checked={settings.backup.encryption}
                              onChange={(e) =>
                                updateSetting(
                                  "backup",
                                  "encryption",
                                  e.target.checked,
                                )
                              }
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label
                              htmlFor="encryption"
                              className="ml-2 block text-sm text-gray-900"
                            >
                              Encrypt Backups
                            </label>
                          </div>
                        </div>

                        {settings.backup.last_backup && (
                          <div className="bg-green-50 p-3 rounded-md">
                            <p className="text-sm text-green-800">
                              Last backup:{" "}
                              {new Date(
                                settings.backup.last_backup,
                              ).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Performance Settings */}
              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Optimization</CardTitle>
                    <CardDescription>
                      Configure database performance settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="cache_enabled"
                          checked={settings.performance.cache_enabled}
                          onChange={(e) =>
                            updateSetting(
                              "performance",
                              "cache_enabled",
                              e.target.checked,
                            )
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor="cache_enabled"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Enable Query Caching
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="index_optimization"
                          checked={settings.performance.index_optimization}
                          onChange={(e) =>
                            updateSetting(
                              "performance",
                              "index_optimization",
                              e.target.checked,
                            )
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor="index_optimization"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Automatic Index Optimization
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cache TTL (seconds)
                        </label>
                        <input
                          type="number"
                          value={settings.performance.cache_ttl}
                          onChange={(e) =>
                            updateSetting(
                              "performance",
                              "cache_ttl",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="3600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Query Timeout (seconds)
                        </label>
                        <input
                          type="number"
                          value={settings.performance.query_timeout}
                          onChange={(e) =>
                            updateSetting(
                              "performance",
                              "query_timeout",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Slow Query Threshold (ms)
                        </label>
                        <input
                          type="number"
                          value={settings.performance.slow_query_threshold}
                          onChange={(e) =>
                            updateSetting(
                              "performance",
                              "slow_query_threshold",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="1000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Connections
                        </label>
                        <input
                          type="number"
                          value={settings.performance.max_connections}
                          onChange={(e) =>
                            updateSetting(
                              "performance",
                              "max_connections",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="100"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Monitoring Settings */}
              <TabsContent value="monitoring">
                <Card>
                  <CardHeader>
                    <CardTitle>Database Monitoring</CardTitle>
                    <CardDescription>
                      Configure monitoring and alerting settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="slow_query_log"
                          checked={settings.monitoring.slow_query_log}
                          onChange={(e) =>
                            updateSetting(
                              "monitoring",
                              "slow_query_log",
                              e.target.checked,
                            )
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor="slow_query_log"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Enable Slow Query Logging
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="performance_metrics"
                          checked={settings.monitoring.performance_metrics}
                          onChange={(e) =>
                            updateSetting(
                              "monitoring",
                              "performance_metrics",
                              e.target.checked,
                            )
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor="performance_metrics"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Collect Performance Metrics
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="error_tracking"
                          checked={settings.monitoring.error_tracking}
                          onChange={(e) =>
                            updateSetting(
                              "monitoring",
                              "error_tracking",
                              e.target.checked,
                            )
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor="error_tracking"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Enable Error Tracking
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="health_checks"
                          checked={settings.monitoring.health_checks}
                          onChange={(e) =>
                            updateSetting(
                              "monitoring",
                              "health_checks",
                              e.target.checked,
                            )
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor="health_checks"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Enable Health Checks
                        </label>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Alert Thresholds
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CPU Usage (%)
                          </label>
                          <input
                            type="number"
                            value={
                              settings.monitoring.alert_thresholds.cpu_usage
                            }
                            onChange={(e) =>
                              updateNestedSetting(
                                "monitoring",
                                "alert_thresholds",
                                "cpu_usage",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="80"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Memory Usage (%)
                          </label>
                          <input
                            type="number"
                            value={
                              settings.monitoring.alert_thresholds.memory_usage
                            }
                            onChange={(e) =>
                              updateNestedSetting(
                                "monitoring",
                                "alert_thresholds",
                                "memory_usage",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="85"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Connection Count (%)
                          </label>
                          <input
                            type="number"
                            value={
                              settings.monitoring.alert_thresholds
                                .connection_count
                            }
                            onChange={(e) =>
                              updateNestedSetting(
                                "monitoring",
                                "alert_thresholds",
                                "connection_count",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="90"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Response Time (ms)
                          </label>
                          <input
                            type="number"
                            value={
                              settings.monitoring.alert_thresholds.response_time
                            }
                            onChange={(e) =>
                              updateNestedSetting(
                                "monitoring",
                                "alert_thresholds",
                                "response_time",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="2000"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Recent Activity */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={`h-2 w-2 rounded-full mt-2 ${
                          activity.status === "success"
                            ? "bg-green-500"
                            : activity.status === "warning"
                              ? "bg-yellow-500"
                              : activity.status === "error"
                                ? "bg-red-500"
                                : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          {activity.event}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.time).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Manual Backup
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Performance Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Optimize Indexes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Audit
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default DatabaseSettingsPage;
