import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";

import {
  AlertTriangle,
  Activity,
  Server,
  BarChart3,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

interface LoggingSettings {
  level: "debug" | "info" | "warn" | "error";
  retention_days: number;
  external_logging: boolean;
  log_aggregation_service: string;
}

interface PerformanceTarget {
  metric: string;
  threshold: number;
  unit: string;
  enabled: boolean;
}

interface PerformanceSettings {
  monitoring_enabled: boolean;
  metrics_collection: boolean;
  alerting_enabled: boolean;
  performance_targets: PerformanceTarget[];
}

interface HealthCheck {
  name: string;
  endpoint: string;
  timeout: number;
  enabled: boolean;
  status: "healthy" | "unhealthy" | "unknown";
  last_check: string;
}

interface HealthCheckSettings {
  database_check: boolean;
  api_check: boolean;
  storage_check: boolean;
  external_service_checks: HealthCheck[];
}

interface AnalyticsSettings {
  user_analytics: boolean;
  performance_analytics: boolean;
  business_analytics: boolean;
  retention_days: number;
}

interface MonitoringSettings {
  logging: LoggingSettings;
  performance: PerformanceSettings;
  health_checks: HealthCheckSettings;
  analytics: AnalyticsSettings;
}

export default function MonitoringSettings() {
  const router = useRouter();
  const { user } = useAuth();
  const [testStatus, setTestStatus] = useState<{
    [key: string]: "idle" | "testing" | "success" | "error";
  }>({});
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());

  // Mock monitoring settings data
  const [settings, setSettings] = useState<MonitoringSettings>({
    logging: {
      level: "info",
      retention_days: 30,
      external_logging: false,
      log_aggregation_service: "local",
    },
    performance: {
      monitoring_enabled: true,
      metrics_collection: true,
      alerting_enabled: true,
      performance_targets: [
        { metric: "Response Time", threshold: 500, unit: "ms", enabled: true },
        { metric: "CPU Usage", threshold: 80, unit: "%", enabled: true },
        { metric: "Memory Usage", threshold: 85, unit: "%", enabled: true },
        { metric: "Disk Usage", threshold: 90, unit: "%", enabled: true },
        { metric: "Error Rate", threshold: 1, unit: "%", enabled: true },
        {
          metric: "Throughput",
          threshold: 1000,
          unit: "req/min",
          enabled: true,
        },
      ],
    },
    health_checks: {
      database_check: true,
      api_check: true,
      storage_check: true,
      external_service_checks: [
        {
          name: "Email Service",
          endpoint: "smtp.gmail.com:587",
          timeout: 5000,
          enabled: true,
          status: "healthy",
          last_check: "2024-01-15T14:30:00Z",
        },
        {
          name: "Payment Gateway",
          endpoint: "api.stripe.com",
          timeout: 3000,
          enabled: true,
          status: "healthy",
          last_check: "2024-01-15T14:29:45Z",
        },
        {
          name: "File Storage",
          endpoint: "s3.amazonaws.com",
          timeout: 5000,
          enabled: false,
          status: "unknown",
          last_check: "Never",
        },
        {
          name: "Auth Provider",
          endpoint: "auth0.com",
          timeout: 3000,
          enabled: true,
          status: "unhealthy",
          last_check: "2024-01-15T14:25:30Z",
        },
      ],
    },
    analytics: {
      user_analytics: true,
      performance_analytics: true,
      business_analytics: false,
      retention_days: 365,
    },
  });

  // System metrics (mock data)
  const systemMetrics = {
    uptime: "99.9%",
    avg_response_time: "245ms",
    active_users: 1247,
    error_rate: "0.12%",
    cpu_usage: "65%",
    memory_usage: "72%",
    disk_usage: "45%",
    total_requests: 45678,
  };

  // Monitoring status overview
  const monitoringStatus = {
    logging:
      settings.logging.retention_days > 0 && settings.logging.level
        ? "healthy"
        : "warning",
    performance:
      settings.performance.monitoring_enabled &&
      settings.performance.metrics_collection
        ? "healthy"
        : "error",
    health_checks:
      settings.health_checks.database_check && settings.health_checks.api_check
        ? "healthy"
        : "warning",
    analytics:
      settings.analytics.user_analytics ||
      settings.analytics.performance_analytics
        ? "healthy"
        : "warning",
  };

  // Role permission check
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleTestMonitoring = async (component: string) => {
    setTestStatus({ ...testStatus, [component]: "testing" });

    // Simulate monitoring test
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      setTestStatus({
        ...testStatus,
        [component]: success ? "success" : "error",
      });
    }, 2000);
  };

  const handleSaveSettings = async () => {
    try {
      // TODO: Replace with actual API call
      console.log("Saving monitoring settings:", settings);
      setLastUpdated(new Date().toISOString());
      alert("Monitoring settings saved successfully!");
    } catch (error) {
      console.error("Failed to save monitoring settings:", error);
      alert("Failed to save monitoring settings");
    }
  };

  const handleRefreshMetrics = () => {
    setLastUpdated(new Date().toISOString());
    // In real implementation, this would fetch fresh metrics
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "unhealthy":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return (
          <Badge variant="solid" className="bg-green-100 text-green-800">
            Healthy
          </Badge>
        );
      case "warning":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-700"
          >
            Warning
          </Badge>
        );
      case "error":
        return (
          <Badge variant="outline" className="border-red-500 text-red-700">
            Error
          </Badge>
        );
      case "unhealthy":
        return (
          <Badge variant="outline" className="border-red-500 text-red-700">
            Unhealthy
          </Badge>
        );
      case "unknown":
        return <Badge variant="outline">Unknown</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You need admin privileges to access monitoring settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-6 h-6" />
            Monitoring Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Configure system monitoring, logging, and performance tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefreshMetrics}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            onClick={handleSaveSettings}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  System Uptime
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {systemMetrics.uptime}
                </p>
              </div>
              <Server className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Response Time
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {systemMetrics.avg_response_time}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {systemMetrics.active_users.toLocaleString()}
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Error Rate</p>
                <p className="text-2xl font-bold text-orange-600">
                  {systemMetrics.error_rate}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monitoring Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Logging</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(monitoringStatus.logging)}
                  {getStatusBadge(monitoringStatus.logging)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Performance</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(monitoringStatus.performance)}
                  {getStatusBadge(monitoringStatus.performance)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Health Checks
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(monitoringStatus.health_checks)}
                  {getStatusBadge(monitoringStatus.health_checks)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Analytics</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(monitoringStatus.analytics)}
                  {getStatusBadge(monitoringStatus.analytics)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logging" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="logging">Logging</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="health-checks">Health Checks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="logging" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Log Configuration</CardTitle>
                <CardDescription>
                  Configure logging levels and retention policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="log-level">Log Level</Label>
                  <select
                    id="log-level"
                    value={settings.logging.level}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        logging: {
                          ...settings.logging,
                          level: e.target.value as any,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="debug">Debug</option>
                    <option value="info">Info</option>
                    <option value="warn">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="retention-days">
                    Retention Period (Days)
                  </Label>
                  <Input
                    id="retention-days"
                    type="number"
                    value={settings.logging.retention_days}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        logging: {
                          ...settings.logging,
                          retention_days: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Logs older than {settings.logging.retention_days} days will
                    be automatically deleted
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.logging.external_logging}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          logging: {
                            ...settings.logging,
                            external_logging: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <Label>Enable External Logging</Label>
                </div>

                {settings.logging.external_logging && (
                  <div>
                    <Label htmlFor="log-service">Log Aggregation Service</Label>
                    <select
                      id="log-service"
                      value={settings.logging.log_aggregation_service}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          logging: {
                            ...settings.logging,
                            log_aggregation_service: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="local">Local Only</option>
                      <option value="elasticsearch">Elasticsearch</option>
                      <option value="splunk">Splunk</option>
                      <option value="datadog">Datadog</option>
                      <option value="newrelic">New Relic</option>
                    </select>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Log Statistics</CardTitle>
                <CardDescription>
                  Current logging activity and storage usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-600">
                      Today's Logs
                    </p>
                    <p className="text-2xl font-bold text-blue-600">2,543</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-600">
                      Error Logs
                    </p>
                    <p className="text-2xl font-bold text-red-600">12</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-600">
                      Storage Used
                    </p>
                    <p className="text-2xl font-bold text-orange-600">1.2GB</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-600">
                      Avg Log Size
                    </p>
                    <p className="text-2xl font-bold text-purple-600">156KB</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Recent Log Entries
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-green-600">[INFO]</span>
                      <span className="text-gray-600">
                        User login successful
                      </span>
                      <span className="text-gray-400">2m ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600">[DEBUG]</span>
                      <span className="text-gray-600">
                        Database query executed
                      </span>
                      <span className="text-gray-400">5m ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-red-600">[ERROR]</span>
                      <span className="text-gray-600">
                        Failed to send email
                      </span>
                      <span className="text-gray-400">12m ago</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleTestMonitoring("logging")}
                  disabled={testStatus.logging === "testing"}
                  className="w-full"
                >
                  {testStatus.logging === "testing"
                    ? "Testing..."
                    : "Test Logging"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Monitoring</CardTitle>
                <CardDescription>
                  Configure performance metrics and alerting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.performance.monitoring_enabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          performance: {
                            ...settings.performance,
                            monitoring_enabled: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <Label>Enable Performance Monitoring</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.performance.metrics_collection}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          performance: {
                            ...settings.performance,
                            metrics_collection: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <Label>Enable Metrics Collection</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.performance.alerting_enabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          performance: {
                            ...settings.performance,
                            alerting_enabled: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <Label>Enable Performance Alerting</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current System Metrics</CardTitle>
                <CardDescription>
                  Real-time system performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-600">
                      CPU Usage
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {systemMetrics.cpu_usage}
                    </p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-600">
                      Memory Usage
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {systemMetrics.memory_usage}
                    </p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-600">
                      Disk Usage
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {systemMetrics.disk_usage}
                    </p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-600">
                      Total Requests
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {systemMetrics.total_requests.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Targets</CardTitle>
              <CardDescription>
                Configure alert thresholds for performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings.performance.performance_targets.map(
                  (target, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={target.enabled}
                              onChange={(e) => {
                                const updatedTargets = [
                                  ...settings.performance.performance_targets,
                                ];
                                updatedTargets[index] = {
                                  ...target,
                                  enabled: e.target.checked,
                                };
                                setSettings({
                                  ...settings,
                                  performance: {
                                    ...settings.performance,
                                    performance_targets: updatedTargets,
                                  },
                                });
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                          <span className="font-medium">{target.metric}</span>
                        </div>
                        <Badge variant="outline">{target.unit}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Alert Threshold</Label>
                          <Input
                            type="number"
                            value={target.threshold}
                            onChange={(e) => {
                              const updatedTargets = [
                                ...settings.performance.performance_targets,
                              ];
                              updatedTargets[index] = {
                                ...target,
                                threshold: parseFloat(e.target.value),
                              };
                              setSettings({
                                ...settings,
                                performance: {
                                  ...settings.performance,
                                  performance_targets: updatedTargets,
                                },
                              });
                            }}
                          />
                        </div>
                        <div className="flex items-end">
                          <Badge
                            variant="solid"
                            className="bg-blue-100 text-blue-800"
                          >
                            Alert when &gt; {target.threshold} {target.unit}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health-checks" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health Checks</CardTitle>
                <CardDescription>
                  Configure internal system health monitoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.health_checks.database_check}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          health_checks: {
                            ...settings.health_checks,
                            database_check: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <Label>Database Health Check</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.health_checks.api_check}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          health_checks: {
                            ...settings.health_checks,
                            api_check: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <Label>API Health Check</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.health_checks.storage_check}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          health_checks: {
                            ...settings.health_checks,
                            storage_check: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <Label>Storage Health Check</Label>
                </div>

                <Button
                  onClick={() => handleTestMonitoring("health-checks")}
                  disabled={testStatus["health-checks"] === "testing"}
                  className="w-full"
                >
                  {testStatus["health-checks"] === "testing"
                    ? "Testing..."
                    : "Run Health Checks"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>External Service Health</CardTitle>
                <CardDescription>
                  Monitor external service dependencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {settings.health_checks.external_service_checks.map(
                    (service, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={service.enabled}
                                onChange={(e) => {
                                  const updatedServices = [
                                    ...settings.health_checks
                                      .external_service_checks,
                                  ];
                                  updatedServices[index] = {
                                    ...service,
                                    enabled: e.target.checked,
                                  };
                                  setSettings({
                                    ...settings,
                                    health_checks: {
                                      ...settings.health_checks,
                                      external_service_checks: updatedServices,
                                    },
                                  });
                                }}
                                className="sr-only peer"
                              />
                              <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                            <span className="font-medium">{service.name}</span>
                          </div>
                          {getStatusBadge(service.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {service.endpoint}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Timeout: {service.timeout}ms</span>
                          <span>
                            Last check:{" "}
                            {service.last_check === "Never"
                              ? "Never"
                              : new Date(service.last_check).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Configuration</CardTitle>
                <CardDescription>
                  Configure data collection and analytics tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.analytics.user_analytics}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          analytics: {
                            ...settings.analytics,
                            user_analytics: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <Label>User Analytics</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.analytics.performance_analytics}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          analytics: {
                            ...settings.analytics,
                            performance_analytics: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <Label>Performance Analytics</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.analytics.business_analytics}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          analytics: {
                            ...settings.analytics,
                            business_analytics: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <Label>Business Analytics</Label>
                </div>

                <div>
                  <Label htmlFor="analytics-retention">
                    Data Retention (Days)
                  </Label>
                  <Input
                    id="analytics-retention"
                    type="number"
                    value={settings.analytics.retention_days}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        analytics: {
                          ...settings.analytics,
                          retention_days: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Analytics data retention:{" "}
                    {Math.floor(settings.analytics.retention_days / 365)}{" "}
                    year(s)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analytics Summary</CardTitle>
                <CardDescription>
                  Current analytics data collection status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-600">
                      Data Points
                    </p>
                    <p className="text-2xl font-bold text-blue-600">127K</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-600">
                      Storage Used
                    </p>
                    <p className="text-2xl font-bold text-purple-600">580MB</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-600">
                      Active Trackers
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {
                        [
                          settings.analytics.user_analytics,
                          settings.analytics.performance_analytics,
                          settings.analytics.business_analytics,
                        ].filter(Boolean).length
                      }
                    </p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-600">
                      Last Updated
                    </p>
                    <p className="text-sm font-bold text-orange-600">
                      {new Date(lastUpdated).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleTestMonitoring("analytics")}
                  disabled={testStatus.analytics === "testing"}
                  className="w-full"
                >
                  {testStatus.analytics === "testing"
                    ? "Testing..."
                    : "Test Analytics"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Monitoring Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Logs
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Performance Report
            </Button>
            <Button variant="outline" size="sm">
              <Server className="w-4 h-4 mr-2" />
              System Status
            </Button>
            <Button variant="outline" size="sm">
              <AlertTriangle className="w-4 h-4 mr-2" />
              View Alerts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
