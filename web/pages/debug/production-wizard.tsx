import React, { useEffect, useState } from "react";

import {
    AlertTriangle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Copy,
    Database,
    Download,
    ExternalLink,
    Eye,
    EyeOff,
    Globe,
    Mail,
    RefreshCw,
    Settings,
    Shield,
    XCircle,
} from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SupabaseAdminManager } from "@/lib/supabase/admin-utils";

import DebugLayout from "./_layout";

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "pending" | "in-progress" | "completed" | "error";
}

interface ConfigField {
  key: string;
  label: string;
  value: string;
  type: "text" | "password" | "email" | "url" | "select" | "textarea";
  required: boolean;
  placeholder?: string;
  description?: string;
  options?: string[];
  validation?: (value: string) => string | null;
}

interface ValidationResult {
  field: string;
  status: "success" | "warning" | "error";
  message: string;
}

export default function ProductionWizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [configData, setConfigData] = useState<Record<string, string>>({});
  const [validations, setValidations] = useState<ValidationResult[]>([]);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  const steps: WizardStep[] = [
    {
      id: "supabase",
      title: "Supabase Configuration",
      description: "Configure your production Supabase database",
      icon: <Database className="h-5 w-5" />,
      status: "pending",
    },
    {
      id: "environment",
      title: "Environment Settings",
      description: "Set up production environment variables",
      icon: <Settings className="h-5 w-5" />,
      status: "pending",
    },
    {
      id: "security",
      title: "Security Configuration",
      description: "Configure authentication and security settings",
      icon: <Shield className="h-5 w-5" />,
      status: "pending",
    },
    {
      id: "features",
      title: "Feature Configuration",
      description: "Enable/disable features for production",
      icon: <Globe className="h-5 w-5" />,
      status: "pending",
    },
    {
      id: "email",
      title: "Email & Notifications",
      description: "Configure email service and notifications",
      icon: <Mail className="h-5 w-5" />,
      status: "pending",
    },
    {
      id: "review",
      title: "Review & Deploy",
      description: "Review configuration and generate deployment files",
      icon: <CheckCircle2 className="h-5 w-5" />,
      status: "pending",
    },
  ];

  const stepConfigurations: Record<string, ConfigField[]> = {
    supabase: [
      {
        key: "NEXT_PUBLIC_SUPABASE_URL",
        label: "Supabase URL",
        value: "",
        type: "url",
        required: true,
        placeholder: "https://your-project.supabase.co",
        description: "Your Supabase project URL",
        validation: (value) => {
          if (!value.includes("supabase.co")) {
            return "Must be a valid Supabase URL";
          }
          if (!value.startsWith("https://")) {
            return "URL must use HTTPS";
          }
          return null;
        },
      },
      {
        key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        label: "Supabase Anonymous Key",
        value: "",
        type: "password",
        required: true,
        placeholder: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        description: "Your Supabase anonymous/public key",
        validation: (value) => {
          if (!value.startsWith("eyJ")) {
            return "Must be a valid JWT token";
          }
          if (value.length < 100) {
            return "Token appears to be too short";
          }
          return null;
        },
      },
      {
        key: "SUPABASE_SERVICE_ROLE_KEY",
        label: "Supabase Service Role Key",
        value: "",
        type: "password",
        required: false,
        placeholder: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        description: "Service role key for admin operations (optional)",
        validation: (value) => {
          if (value && !value.startsWith("eyJ")) {
            return "Must be a valid JWT token";
          }
          return null;
        },
      },
    ],
    environment: [
      {
        key: "NODE_ENV",
        label: "Environment",
        value: "production",
        type: "select",
        required: true,
        options: ["development", "production"],
        description: "Application environment mode",
      },
      {
        key: "NEXT_PUBLIC_APP_URL",
        label: "Application URL",
        value: "",
        type: "url",
        required: true,
        placeholder: "https://your-domain.com",
        description: "Your production domain URL",
        validation: (value) => {
          if (value.includes("localhost")) {
            return "Should not use localhost in production";
          }
          if (!value.startsWith("https://")) {
            return "Production URL should use HTTPS";
          }
          return null;
        },
      },
      {
        key: "NEXT_PUBLIC_APP_NAME",
        label: "Application Name",
        value: "HR Portal",
        type: "text",
        required: true,
        placeholder: "HR Portal",
        description: "Display name for your application",
      },
    ],
    security: [
      {
        key: "NEXTAUTH_SECRET",
        label: "NextAuth Secret",
        value: "",
        type: "password",
        required: true,
        placeholder: "Generate a secure random string",
        description: "Secret for NextAuth.js session encryption",
        validation: (value) => {
          if (value.length < 32) {
            return "Should be at least 32 characters long";
          }
          return null;
        },
      },
      {
        key: "JWT_SECRET",
        label: "JWT Secret",
        value: "",
        type: "password",
        required: true,
        placeholder: "Generate a secure random string",
        description: "Secret for JWT token signing",
        validation: (value) => {
          if (value.length < 32) {
            return "Should be at least 32 characters long";
          }
          return null;
        },
      },
      {
        key: "ENCRYPTION_KEY",
        label: "Encryption Key",
        value: "",
        type: "password",
        required: false,
        placeholder: "32-character encryption key",
        description: "Key for encrypting sensitive data",
        validation: (value) => {
          if (value && value.length !== 32) {
            return "Must be exactly 32 characters";
          }
          return null;
        },
      },
    ],
    features: [
      {
        key: "NEXT_PUBLIC_ENABLE_AUTH",
        label: "Enable Authentication",
        value: "true",
        type: "select",
        required: true,
        options: ["true", "false"],
        description: "Enable user authentication",
      },
      {
        key: "NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION",
        label: "Require Email Verification",
        value: "true",
        type: "select",
        required: true,
        options: ["true", "false"],
        description: "Require users to verify their email",
      },
      {
        key: "NEXT_PUBLIC_ENABLE_DEBUG_ROUTES",
        label: "Enable Debug Routes",
        value: "false",
        type: "select",
        required: true,
        options: ["true", "false"],
        description: "Enable debug pages (should be false in production)",
      },
      {
        key: "NEXT_PUBLIC_ENABLE_MOCK_DATA",
        label: "Enable Mock Data",
        value: "false",
        type: "select",
        required: true,
        options: ["true", "false"],
        description: "Use mock data (should be false in production)",
      },
      {
        key: "NEXT_PUBLIC_ENABLE_FALLBACK_AUTH",
        label: "Enable Fallback Auth",
        value: "false",
        type: "select",
        required: true,
        options: ["true", "false"],
        description: "Enable fallback authentication (should be false in production)",
      },
    ],
    email: [
      {
        key: "NEXT_PUBLIC_SUPPORT_EMAIL",
        label: "Support Email",
        value: "",
        type: "email",
        required: true,
        placeholder: "support@yourcompany.com",
        description: "Email address for user support",
        validation: (value) => {
          if (value.includes("yourcompany.com")) {
            return "Please use your actual domain";
          }
          return null;
        },
      },
      {
        key: "NEXT_PUBLIC_FROM_EMAIL",
        label: "From Email",
        value: "",
        type: "email",
        required: true,
        placeholder: "noreply@yourcompany.com",
        description: "Email address for system notifications",
        validation: (value) => {
          if (value.includes("yourcompany.com")) {
            return "Please use your actual domain";
          }
          return null;
        },
      },
      {
        key: "SMTP_HOST",
        label: "SMTP Host",
        value: "",
        type: "text",
        required: false,
        placeholder: "smtp.gmail.com",
        description: "SMTP server hostname (optional)",
      },
      {
        key: "SMTP_PORT",
        label: "SMTP Port",
        value: "587",
        type: "text",
        required: false,
        placeholder: "587",
        description: "SMTP server port",
      },
    ],
  };

  useEffect(() => {
    // Initialize config data with default values
    const initialData: Record<string, string> = {};
    Object.values(stepConfigurations).flat().forEach((field) => {
      if (field.value) {
        initialData[field.key] = field.value;
      }
    });
    setConfigData(initialData);
  }, []);

  const validateStep = (stepId: string): ValidationResult[] => {
    const fields = stepConfigurations[stepId] || [];
    const results: ValidationResult[] = [];

    fields.forEach((field) => {
      const value = configData[field.key] || "";
      
      if (field.required && !value.trim()) {
        results.push({
          field: field.key,
          status: "error",
          message: `${field.label} is required`,
        });
        return;
      }

      if (value && field.validation) {
        const error = field.validation(value);
        if (error) {
          results.push({
            field: field.key,
            status: "error",
            message: error,
          });
          return;
        }
      }

      if (value) {
        results.push({
          field: field.key,
          status: "success",
          message: `${field.label} is valid`,
        });
      }
    });

    return results;
  };

  const testSupabaseConnection = async () => {
    setLoading(true);
    try {
      const url = configData["NEXT_PUBLIC_SUPABASE_URL"];
      const anonKey = configData["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
      
      if (!url || !anonKey) {
        throw new Error("URL and anonymous key are required");
      }

      const adminManager = new SupabaseAdminManager({
        url,
        anonKey,
        serviceKey: configData["SUPABASE_SERVICE_ROLE_KEY"],
      });

      const result = await adminManager.testConnection();
      setTestResults(prev => ({
        ...prev,
        supabase: result
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        supabase: {
          success: false,
          message: error instanceof Error ? error.message : "Unknown error"
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const generateSecret = (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleFieldChange = (key: string, value: string) => {
    setConfigData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const nextStep = () => {
    const currentStepId = steps[currentStep].id;
    const stepValidations = validateStep(currentStepId);
    setValidations(stepValidations);
    
    const hasErrors = stepValidations.some(v => v.status === "error");
    if (!hasErrors) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const generateEnvFile = (): string => {
    let content = "# Production Environment Configuration\n";
    content += "# Generated by HR Portal Production Wizard\n";
    content += `# Generated on: ${new Date().toISOString()}\n\n`;

    Object.entries(stepConfigurations).forEach(([section, fields]) => {
      content += `# === ${section.charAt(0).toUpperCase() + section.slice(1)} Configuration ===\n`;
      fields.forEach(field => {
        const value = configData[field.key] || "";
        content += `${field.key}=${value}\n`;
      });
      content += "\n";
    });

    return content;
  };

  const downloadEnvFile = () => {
    const content = generateEnvFile();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".env.production";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderField = (field: ConfigField) => {
    const value = configData[field.key] || "";
    const validation = validations.find(v => v.field === field.key);
    const isSecret = field.type === "password";
    const showSecret = showSecrets[field.key];

    return (
      <div key={field.key} className="space-y-2">
        <Label htmlFor={field.key} className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        <div className="relative">
          {field.type === "select" ? (
            <Select 
              value={value} 
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
            >
              {field.options?.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          ) : field.type === "textarea" ? (
            <Textarea
              id={field.key}
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="min-h-[100px]"
            />
          ) : (
            <div className="flex gap-2">
              <Input
                id={field.key}
                type={isSecret && !showSecret ? "password" : "text"}
                value={value}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className={validation?.status === "error" ? "border-red-500" : ""}
              />
              
              {isSecret && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSecrets(prev => ({
                    ...prev,
                    [field.key]: !prev[field.key]
                  }))}
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              )}
              
              {(field.key.includes("SECRET") || field.key.includes("KEY")) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleFieldChange(field.key, generateSecret())}
                >
                  Generate
                </Button>
              )}
            </div>
          )}
        </div>

        {field.description && (
          <p className="text-xs text-gray-500">{field.description}</p>
        )}

        {validation && (
          <div className={`flex items-center gap-1 text-xs ${
            validation.status === "error" ? "text-red-600" :
            validation.status === "warning" ? "text-yellow-600" :
            "text-green-600"
          }`}>
            {validation.status === "error" && <XCircle className="h-3 w-3" />}
            {validation.status === "warning" && <AlertTriangle className="h-3 w-3" />}
            {validation.status === "success" && <CheckCircle2 className="h-3 w-3" />}
            {validation.message}
          </div>
        )}
      </div>
    );
  };

  const currentStepData = steps[currentStep];
  const currentFields = stepConfigurations[currentStepData?.id] || [];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <DebugLayout>
      <PageLayout
        title="Production Configuration Wizard"
        description="Step-by-step guide to configure your HR Portal for production deployment"
        breadcrumbs={[
          { label: "Debug", href: "/debug" },
          { label: "Production Wizard", href: "/debug/production-wizard" },
        ]}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Progress Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {currentStepData?.title || "Production Setup"}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentStepData?.description}
                  </p>
                </div>
                <Badge variant="outline">
                  Step {currentStep + 1} of {steps.length}
                </Badge>
              </div>
              <Progress value={progress} className="mt-4" />
            </CardHeader>
          </Card>

          {/* Steps Navigation */}
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  index === currentStep
                    ? "border-blue-500 bg-blue-50"
                    : index < currentStep
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {step.icon}
                  {index < currentStep && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </div>
                <div className="text-xs font-medium">{step.title}</div>
              </button>
            ))}
          </div>

          {/* Current Step Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentStepData?.icon}
                {currentStepData?.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStepData?.id === "review" ? (
                /* Review Step */
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <h3 className="text-lg font-semibold">Configuration Summary</h3>
                    
                    {Object.entries(stepConfigurations).map(([section, fields]) => (
                      <Card key={section}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base capitalize">{section} Configuration</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-2">
                            {fields.map(field => (
                              <div key={field.key} className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">{field.label}</span>
                                <span className="text-sm font-mono">
                                  {field.type === "password" ? "●●●●●●●●" : configData[field.key] || "Not set"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Generated Environment File</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-xs overflow-x-auto">
                          {generateEnvFile()}
                        </pre>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button onClick={downloadEnvFile} size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download .env.production
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(generateEnvFile())}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy to Clipboard
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Configuration Steps */
                <div className="space-y-4">
                  {currentFields.map(renderField)}
                  
                  {/* Special test button for Supabase step */}
                  {currentStepData?.id === "supabase" && (
                    <div className="border-t pt-4">
                      <Button 
                        onClick={testSupabaseConnection}
                        disabled={loading}
                        variant="outline"
                        size="sm"
                      >
                        {loading ? (
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Database className="h-4 w-4 mr-1" />
                        )}
                        Test Connection
                      </Button>
                      
                      {testResults.supabase && (
                        <div className={`mt-2 p-3 rounded-lg ${
                          testResults.supabase.success 
                            ? "bg-green-50 border border-green-200" 
                            : "bg-red-50 border border-red-200"
                        }`}>
                          <div className="flex items-center gap-2">
                            {testResults.supabase.success ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className={`text-sm ${
                              testResults.supabase.success ? "text-green-800" : "text-red-800"
                            }`}>
                              {testResults.supabase.message}
                            </span>
                          </div>
                          {testResults.supabase.latency && (
                            <p className="text-xs text-gray-600 mt-1">
                              Latency: {testResults.supabase.latency}ms
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            {currentStep === steps.length - 1 ? (
              <Button onClick={downloadEnvFile}>
                <Download className="h-4 w-4 mr-1" />
                Download Configuration
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Helpful Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <a
                  href="/debug/production-check"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Production Readiness Check
                </a>
                <a
                  href="https://supabase.com/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-4 w-4" />
                  Supabase Documentation
                </a>
                <a
                  href="/debug/supabase-admin"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <Database className="h-4 w-4" />
                  Database Admin Panel
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    </DebugLayout>
  );
} 