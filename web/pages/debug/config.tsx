import React, { useState, useEffect } from "react";

import {
  Settings,
  Save,
  RotateCcw,
  Database,
  Server,
  Globe,
  Key,
} from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import DebugLayout from "./_layout";

type ConfigSection = {
  title: string;
  description: string;
  icon: React.ReactNode;
  items: ConfigItem[];
};

type ConfigItem = {
  key: string;
  value: string;
  description?: string;
  editable?: boolean;
  secret?: boolean;
  source?: string;
};

export default function ConfigurationPage() {
  const [configSections, setConfigSections] = useState<ConfigSection[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = () => {
    // Core settings
    const coreConfig: ConfigItem[] = [
      {
        key: "NODE_ENV",
        value: process.env.NODE_ENV || "development",
        description: "Current environment mode",
        source: "process.env",
      },
      {
        key: "APP_VERSION",
        value: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
        description: "Application version",
        source: "NEXT_PUBLIC_APP_VERSION",
      },
      {
        key: "DEBUG_MODE",
        value: process.env.NEXT_PUBLIC_DEBUG_MODE || "false",
        description: "Enable extended debug features",
        editable: true,
        source: "NEXT_PUBLIC_DEBUG_MODE",
      },
      {
        key: "DEPLOYMENT_REGION",
        value: process.env.NEXT_PUBLIC_DEPLOYMENT_REGION || "local",
        description: "Current deployment region",
        source: "NEXT_PUBLIC_DEPLOYMENT_REGION",
      },
    ];

    // API settings
    const apiConfig: ConfigItem[] = [
      {
        key: "API_URL",
        value: process.env.NEXT_PUBLIC_API_URL || window.location.origin,
        description: "Base URL for API requests",
        editable: true,
        source: "NEXT_PUBLIC_API_URL",
      },
      {
        key: "API_TIMEOUT",
        value: process.env.NEXT_PUBLIC_API_TIMEOUT || "30000",
        description: "API request timeout in milliseconds",
        editable: true,
        source: "NEXT_PUBLIC_API_TIMEOUT",
      },
      {
        key: "MOCK_API",
        value: process.env.NEXT_PUBLIC_MOCK_API || "false",
        description: "Use mock API responses",
        editable: true,
        source: "NEXT_PUBLIC_MOCK_API",
      },
    ];

    // Database settings
    const dbConfig: ConfigItem[] = [
      {
        key: "SUPABASE_URL",
        value: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        description: "Supabase instance URL",
        editable: false,
        secret: true,
        source: "NEXT_PUBLIC_SUPABASE_URL",
      },
      {
        key: "SUPABASE_ANON_KEY",
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        description: "Supabase anonymous key",
        editable: false,
        secret: true,
        source: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      },
      {
        key: "DB_CONNECTION_POOL",
        value: process.env.NEXT_PUBLIC_DB_CONNECTION_POOL || "10",
        description: "Database connection pool size",
        editable: true,
        source: "NEXT_PUBLIC_DB_CONNECTION_POOL",
      },
    ];

    // Feature flags
    const featureConfig: ConfigItem[] = [
      {
        key: "ENABLE_NOTIFICATIONS",
        value: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS || "true",
        description: "Enable in-app notifications",
        editable: true,
        source: "NEXT_PUBLIC_ENABLE_NOTIFICATIONS",
      },
      {
        key: "ENABLE_ANALYTICS",
        value: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS || "true",
        description: "Enable usage analytics",
        editable: true,
        source: "NEXT_PUBLIC_ENABLE_ANALYTICS",
      },
      {
        key: "ENABLE_ADVANCED_FEATURES",
        value: process.env.NEXT_PUBLIC_ENABLE_ADVANCED_FEATURES || "false",
        description: "Enable experimental features",
        editable: true,
        source: "NEXT_PUBLIC_ENABLE_ADVANCED_FEATURES",
      },
    ];

    // Set up initial edit values
    const initialEditValues: Record<string, string> = {};
    [...coreConfig, ...apiConfig, ...dbConfig, ...featureConfig].forEach(
      (item) => {
        if (item.editable) {
          initialEditValues[item.key] = item.value;
        }
      },
    );
    setEditValues(initialEditValues);

    // Create config sections
    setConfigSections([
      {
        title: "Core Configuration",
        description: "Base application settings",
        icon: <Settings className="h-5 w-5" />,
        items: coreConfig,
      },
      {
        title: "API Configuration",
        description: "API connection settings",
        icon: <Server className="h-5 w-5" />,
        items: apiConfig,
      },
      {
        title: "Database Configuration",
        description: "Database connection settings",
        icon: <Database className="h-5 w-5" />,
        items: dbConfig,
      },
      {
        title: "Feature Flags",
        description: "Toggle application features",
        icon: <Globe className="h-5 w-5" />,
        items: featureConfig,
      },
    ]);
  };

  const handleInputChange = (key: string, value: string) => {
    setEditValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleToggleChange = (key: string, checked: boolean) => {
    setEditValues((prev) => ({
      ...prev,
      [key]: checked ? "true" : "false",
    }));
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to localStorage or make API calls
    // For demo purposes, we just update the UI
    setConfigSections((prevSections) => {
      return prevSections.map((section) => ({
        ...section,
        items: section.items.map((item) => {
          if (item.editable && editValues[item.key] !== undefined) {
            return {
              ...item,
              value: editValues[item.key],
            };
          }
          return item;
        }),
      }));
    });

    setEditMode(false);
  };

  const handleResetChanges = () => {
    // Reset to current values
    const resetValues: Record<string, string> = {};
    configSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.editable) {
          resetValues[item.key] = item.value;
        }
      });
    });

    setEditValues(resetValues);
    setEditMode(false);
  };

  const formatValue = (value: string, secret: boolean = false) => {
    if (!value) return "Not set";
    if (secret)
      return (
        value.substring(0, 4) + "••••••••" + value.substring(value.length - 4)
      );
    return value;
  };

  return (
    <DebugLayout>
      <PageLayout
        title="Configuration"
        description="View and manage application settings"
        breadcrumbs={[
          { label: "Debug", href: "/debug" },
          { label: "Configuration", href: "/debug/config" },
        ]}
      >
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Application Configuration</h2>
          <div className="flex space-x-2">
            {editMode ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleResetChanges}
                  className="flex items-center"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  className="flex items-center"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setEditMode(true)}
                className="flex items-center"
              >
                <Settings className="mr-2 h-4 w-4" />
                Edit Config
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {configSections.map((section, index) => (
            <Card key={index}>
              <CardHeader className="bg-slate-50 pb-3">
                <div className="flex items-center">
                  {section.icon}
                  <div className="ml-2">
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="grid grid-cols-12 gap-4 py-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="col-span-4 md:col-span-3">
                        <div className="flex items-center">
                          <div>
                            <Label className="font-medium text-sm">
                              {item.key}
                            </Label>
                            {item.source && (
                              <div className="text-xs text-gray-500 mt-1">
                                {item.source}
                              </div>
                            )}
                          </div>

                          {item.secret && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              <Key className="h-3 w-3 mr-1" />
                              Secret
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="col-span-8 md:col-span-5">
                        {editMode && item.editable ? (
                          item.value === "true" || item.value === "false" ? (
                            <div className="flex items-center">
                              <Switch
                                id={`toggle-${item.key}`}
                                isChecked={editValues[item.key] === "true"}
                                onChange={(e) =>
                                  handleToggleChange(item.key, e.target.checked)
                                }
                              />
                              <Label
                                htmlFor={`toggle-${item.key}`}
                                className="ml-2"
                              >
                                {editValues[item.key] === "true"
                                  ? "Enabled"
                                  : "Disabled"}
                              </Label>
                            </div>
                          ) : (
                            <Input
                              value={editValues[item.key] || ""}
                              onChange={(e) =>
                                handleInputChange(item.key, e.target.value)
                              }
                              className="w-full"
                            />
                          )
                        ) : (
                          <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                            {formatValue(item.value, item.secret)}
                          </div>
                        )}
                      </div>

                      <div className="col-span-12 md:col-span-4">
                        {item.description && (
                          <p className="text-sm text-gray-500">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageLayout>
    </DebugLayout>
  );
}
