import React, { useState, useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import {
  Link,
  Save,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  Settings,
  Mail,
  Calendar,
  DollarSign,
  Cloud,
  Shield,
  ArrowLeft,
  RefreshCw,
  Eye,
  EyeOff,
  Zap,
  Webhook,
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

// Integration Settings Interface
interface IntegrationSettings {
  email: {
    provider: "gmail" | "outlook" | "sendgrid" | "ses";
    smtp_host: string;
    smtp_port: number;
    username: string;
    password: string;
    from_email: string;
    from_name: string;
    templates: EmailTemplate[];
    enabled: boolean;
  };
  calendar: {
    provider: "google" | "outlook" | "exchange";
    api_key: string;
    sync_enabled: boolean;
    default_calendar: string;
    webhook_url: string;
    enabled: boolean;
  };
  payroll: {
    provider: "adp" | "paychex" | "gusto" | "custom";
    api_endpoint: string;
    credentials: PayrollCredentials;
    sync_frequency: string;
    last_sync: string;
    enabled: boolean;
  };
  storage: {
    provider: "aws" | "azure" | "gcp" | "supabase";
    bucket_name: string;
    access_key: string;
    secret_key: string;
    region: string;
    public_url: string;
    enabled: boolean;
  };
  sso: {
    enabled: boolean;
    provider: "okta" | "azure_ad" | "google" | "saml";
    domain: string;
    client_id: string;
    client_secret: string;
    redirect_url: string;
    certificate: string;
  };
  webhooks: {
    enabled: boolean;
    endpoints: WebhookEndpoint[];
    security: {
      signature_validation: boolean;
      secret_key: string;
    };
  };
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: "welcome" | "password_reset" | "leave_approval" | "notification";
  enabled: boolean;
}

interface PayrollCredentials {
  username: string;
  password: string;
  company_id: string;
  api_version: string;
}

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  enabled: boolean;
  last_triggered: string;
}

const IntegrationsSettingsPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  const [showPasswords, setShowPasswords] = useState<{
    [key: string]: boolean;
  }>({});
  const [testResults, setTestResults] = useState<{ [key: string]: string }>({});

  // Integration settings state
  const [settings, setSettings] = useState<IntegrationSettings>({
    email: {
      provider: "sendgrid",
      smtp_host: "smtp.sendgrid.net",
      smtp_port: 587,
      username: "apikey",
      password: "",
      from_email: "noreply@company.com",
      from_name: "HR Portal",
      templates: [
        {
          id: "1",
          name: "Welcome Email",
          subject: "Welcome to our company!",
          type: "welcome",
          enabled: true,
        },
        {
          id: "2",
          name: "Password Reset",
          subject: "Reset your password",
          type: "password_reset",
          enabled: true,
        },
        {
          id: "3",
          name: "Leave Approval",
          subject: "Leave request update",
          type: "leave_approval",
          enabled: true,
        },
      ],
      enabled: true,
    },
    calendar: {
      provider: "google",
      api_key: "",
      sync_enabled: true,
      default_calendar: "primary",
      webhook_url: "https://your-domain.com/api/webhooks/calendar",
      enabled: false,
    },
    payroll: {
      provider: "adp",
      api_endpoint: "https://api.adp.com/hr/v2",
      credentials: {
        username: "",
        password: "",
        company_id: "",
        api_version: "v2",
      },
      sync_frequency: "weekly",
      last_sync: "2024-01-15T00:00:00Z",
      enabled: false,
    },
    storage: {
      provider: "supabase",
      bucket_name: "hr-documents",
      access_key: "",
      secret_key: "",
      region: "us-east-1",
      public_url: "",
      enabled: true,
    },
    sso: {
      enabled: false,
      provider: "google",
      domain: "company.com",
      client_id: "",
      client_secret: "",
      redirect_url: "https://your-domain.com/auth/callback",
      certificate: "",
    },
    webhooks: {
      enabled: true,
      endpoints: [
        {
          id: "1",
          name: "Slack Notifications",
          url: "https://hooks.slack.com/services/...",
          events: ["employee.created", "leave.approved"],
          enabled: true,
          last_triggered: "2024-01-20T10:30:00Z",
        },
      ],
      security: {
        signature_validation: true,
        secret_key: "webhook_secret_key_123",
      },
    },
  });

  // Integration status (mock data)
  const integrationStatus = {
    email: {
      connected: true,
      last_test: "2024-01-20T09:00:00Z",
      messages_sent: 156,
    },
    calendar: { connected: false, last_test: null, events_synced: 0 },
    payroll: { connected: false, last_test: null, records_synced: 0 },
    storage: {
      connected: true,
      last_test: "2024-01-20T08:30:00Z",
      files_stored: 1245,
    },
    sso: { connected: false, last_test: null, users_authenticated: 0 },
  };

  // Handle settings update
  const updateSetting = (
    category: keyof IntegrationSettings,
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
    category: keyof IntegrationSettings,
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

  // Toggle password visibility
  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Test integration connection
  const testConnection = async (integration: string) => {
    setTestResults((prev) => ({ ...prev, [integration]: "testing" }));

    try {
      // Simulate API call to test connection
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setTestResults((prev) => ({ ...prev, [integration]: "success" }));
    } catch (error) {
      setTestResults((prev) => ({ ...prev, [integration]: "error" }));
    }
  };

  // Save settings
  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Integration settings saved successfully!");
    } catch (error) {
      alert("Failed to save integration settings");
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
            You need administrator privileges to access integration settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Integration Settings | HR System</title>
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
                  <Link className="h-6 w-6 mr-2" />
                  Integration Settings
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage third-party integrations and API connections
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {isSubmitting ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>

          {/* Integration Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="h-8 w-8 text-blue-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-xs text-gray-500">
                        {integrationStatus.email.messages_sent} sent
                      </p>
                    </div>
                  </div>
                  <div
                    className={`h-3 w-3 rounded-full ${integrationStatus.email.connected ? "bg-green-500" : "bg-red-500"}`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-orange-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">
                        Calendar
                      </p>
                      <p className="text-xs text-gray-500">
                        {integrationStatus.calendar.events_synced} events
                      </p>
                    </div>
                  </div>
                  <div
                    className={`h-3 w-3 rounded-full ${integrationStatus.calendar.connected ? "bg-green-500" : "bg-red-500"}`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">
                        Payroll
                      </p>
                      <p className="text-xs text-gray-500">
                        {integrationStatus.payroll.records_synced} records
                      </p>
                    </div>
                  </div>
                  <div
                    className={`h-3 w-3 rounded-full ${integrationStatus.payroll.connected ? "bg-green-500" : "bg-red-500"}`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Cloud className="h-8 w-8 text-purple-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">
                        Storage
                      </p>
                      <p className="text-xs text-gray-500">
                        {integrationStatus.storage.files_stored} files
                      </p>
                    </div>
                  </div>
                  <div
                    className={`h-3 w-3 rounded-full ${integrationStatus.storage.connected ? "bg-green-500" : "bg-red-500"}`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-8 w-8 text-indigo-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">SSO</p>
                      <p className="text-xs text-gray-500">
                        {integrationStatus.sso.users_authenticated} users
                      </p>
                    </div>
                  </div>
                  <div
                    className={`h-3 w-3 rounded-full ${integrationStatus.sso.connected ? "bg-green-500" : "bg-red-500"}`}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Settings */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} defaultValue="email">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger
                  value="email"
                  onClick={() => setActiveTab("email")}
                >
                  Email
                </TabsTrigger>
                <TabsTrigger
                  value="calendar"
                  onClick={() => setActiveTab("calendar")}
                >
                  Calendar
                </TabsTrigger>
                <TabsTrigger
                  value="payroll"
                  onClick={() => setActiveTab("payroll")}
                >
                  Payroll
                </TabsTrigger>
                <TabsTrigger
                  value="storage"
                  onClick={() => setActiveTab("storage")}
                >
                  Storage
                </TabsTrigger>
                <TabsTrigger value="sso" onClick={() => setActiveTab("sso")}>
                  SSO
                </TabsTrigger>
                <TabsTrigger
                  value="webhooks"
                  onClick={() => setActiveTab("webhooks")}
                >
                  Webhooks
                </TabsTrigger>
              </TabsList>

              {/* Email Settings */}
              <TabsContent value="email">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Email Integration</CardTitle>
                        <CardDescription>
                          Configure email service provider and templates
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="email_enabled"
                          checked={settings.email.enabled}
                          onChange={(e) =>
                            updateSetting("email", "enabled", e.target.checked)
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor="email_enabled"
                          className="text-sm text-gray-900"
                        >
                          Enable Email Integration
                        </label>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Provider
                        </label>
                        <select
                          value={settings.email.provider}
                          onChange={(e) =>
                            updateSetting("email", "provider", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="sendgrid">SendGrid</option>
                          <option value="ses">Amazon SES</option>
                          <option value="gmail">Gmail</option>
                          <option value="outlook">Outlook</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Host
                        </label>
                        <input
                          type="text"
                          value={settings.email.smtp_host}
                          onChange={(e) =>
                            updateSetting("email", "smtp_host", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="smtp.sendgrid.net"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Port
                        </label>
                        <input
                          type="number"
                          value={settings.email.smtp_port}
                          onChange={(e) =>
                            updateSetting(
                              "email",
                              "smtp_port",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="587"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={settings.email.username}
                          onChange={(e) =>
                            updateSetting("email", "username", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="apikey"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password/API Key
                        </label>
                        <div className="relative">
                          <input
                            type={
                              showPasswords.email_password ? "text" : "password"
                            }
                            value={settings.email.password}
                            onChange={(e) =>
                              updateSetting("email", "password", e.target.value)
                            }
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter API key"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              togglePasswordVisibility("email_password")
                            }
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPasswords.email_password ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          From Email
                        </label>
                        <input
                          type="email"
                          value={settings.email.from_email}
                          onChange={(e) =>
                            updateSetting("email", "from_email", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="noreply@company.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          From Name
                        </label>
                        <input
                          type="text"
                          value={settings.email.from_name}
                          onChange={(e) =>
                            updateSetting("email", "from_name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="HR Portal"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Email Templates
                      </h4>
                      <div className="space-y-2">
                        {settings.email.templates.map((template) => (
                          <div
                            key={template.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={template.enabled}
                                onChange={(e) => {
                                  const updatedTemplates =
                                    settings.email.templates.map((t) =>
                                      t.id === template.id
                                        ? { ...t, enabled: e.target.checked }
                                        : t,
                                    );
                                  updateSetting(
                                    "email",
                                    "templates",
                                    updatedTemplates,
                                  );
                                }}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {template.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {template.subject}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={template.enabled ? "solid" : "outline"}
                            >
                              {template.enabled ? "Active" : "Disabled"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => testConnection("email")}
                      disabled={testResults.email === "testing"}
                      variant="outline"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {testResults.email === "testing"
                        ? "Testing..."
                        : "Test Connection"}
                    </Button>
                    {testResults.email && testResults.email !== "testing" && (
                      <span
                        className={`ml-4 text-sm ${testResults.email === "success" ? "text-green-600" : "text-red-600"}`}
                      >
                        {testResults.email === "success"
                          ? "✓ Connection successful"
                          : "✗ Connection failed"}
                      </span>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Calendar Settings */}
              <TabsContent value="calendar">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Calendar Integration</CardTitle>
                        <CardDescription>
                          Sync events with external calendar services
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="calendar_enabled"
                          checked={settings.calendar.enabled}
                          onChange={(e) =>
                            updateSetting(
                              "calendar",
                              "enabled",
                              e.target.checked,
                            )
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor="calendar_enabled"
                          className="text-sm text-gray-900"
                        >
                          Enable Calendar Integration
                        </label>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Calendar Provider
                        </label>
                        <select
                          value={settings.calendar.provider}
                          onChange={(e) =>
                            updateSetting(
                              "calendar",
                              "provider",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="google">Google Calendar</option>
                          <option value="outlook">Outlook Calendar</option>
                          <option value="exchange">Exchange Server</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          API Key
                        </label>
                        <div className="relative">
                          <input
                            type={
                              showPasswords.calendar_api ? "text" : "password"
                            }
                            value={settings.calendar.api_key}
                            onChange={(e) =>
                              updateSetting(
                                "calendar",
                                "api_key",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter API key"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              togglePasswordVisibility("calendar_api")
                            }
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPasswords.calendar_api ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Calendar
                        </label>
                        <input
                          type="text"
                          value={settings.calendar.default_calendar}
                          onChange={(e) =>
                            updateSetting(
                              "calendar",
                              "default_calendar",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Webhook URL
                        </label>
                        <input
                          type="url"
                          value={settings.calendar.webhook_url}
                          onChange={(e) =>
                            updateSetting(
                              "calendar",
                              "webhook_url",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://your-domain.com/api/webhooks/calendar"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sync_enabled"
                        checked={settings.calendar.sync_enabled}
                        onChange={(e) =>
                          updateSetting(
                            "calendar",
                            "sync_enabled",
                            e.target.checked,
                          )
                        }
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="sync_enabled"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Enable Two-way Sync
                      </label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => testConnection("calendar")}
                      disabled={testResults.calendar === "testing"}
                      variant="outline"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {testResults.calendar === "testing"
                        ? "Testing..."
                        : "Test Connection"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Continue with other tabs... */}
              <TabsContent value="payroll">
                <Card>
                  <CardHeader>
                    <CardTitle>Payroll Integration</CardTitle>
                    <CardDescription>
                      Connect with payroll systems for automated data sync
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Payroll integration configuration will be available
                        here.
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Coming soon...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="storage">
                <Card>
                  <CardHeader>
                    <CardTitle>Cloud Storage Integration</CardTitle>
                    <CardDescription>
                      Configure cloud storage for file management
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Storage integration configuration will be available
                        here.
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Coming soon...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sso">
                <Card>
                  <CardHeader>
                    <CardTitle>Single Sign-On (SSO)</CardTitle>
                    <CardDescription>
                      Configure SSO authentication providers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        SSO configuration will be available here.
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Coming soon...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="webhooks">
                <Card>
                  <CardHeader>
                    <CardTitle>Webhook Configuration</CardTitle>
                    <CardDescription>
                      Manage webhook endpoints and event subscriptions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Webhook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Webhook configuration will be available here.
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Coming soon...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Integration Status */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Connection Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(integrationStatus).map(([key, status]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600 capitalize">
                        {key}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`h-2 w-2 rounded-full ${status.connected ? "bg-green-500" : "bg-red-500"}`}
                        />
                        <span
                          className={`text-xs ${status.connected ? "text-green-600" : "text-red-600"}`}
                        >
                          {status.connected ? "Connected" : "Disconnected"}
                        </span>
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
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync All
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Test All Connections
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Export Config
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="h-4 w-4 mr-2" />
                  Integration Logs
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

export default IntegrationsSettingsPage;
