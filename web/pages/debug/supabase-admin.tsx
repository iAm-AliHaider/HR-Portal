import React, { useState, useEffect, useRef } from "react";

import {
  Database,
  Upload,
  Download,
  RefreshCw,
  Eye,
  Settings,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  SupabaseAdminManager,
  DatabaseCredentials,
  TableInfo,
  UploadTemplate,
  defaultCredentials,
} from "@/lib/supabase/admin-utils";

import DebugLayout from "./_layout";

export default function SupabaseAdminPage() {
  const [credentials, setCredentials] =
    useState<DatabaseCredentials>(defaultCredentials);
  const [adminManager, setAdminManager] = useState<SupabaseAdminManager | null>(
    null,
  );
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    message: string;
    latency?: number;
  } | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableTotal, setTableTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [uploadTemplate, setUploadTemplate] = useState<UploadTemplate | null>(
    null,
  );
  const [uploadData, setUploadData] = useState<string>("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [allTemplates, setAllTemplates] = useState<UploadTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);

  // Setup Wizard State
  const [currentStep, setCurrentStep] = useState(1);
  const [setupProgress, setSetupProgress] = useState(0);
  const [setupStatus, setSetupStatus] = useState<{
    [key: string]: "pending" | "completed" | "error";
  }>({});
  const [stepData, setStepData] = useState<{ [key: string]: string }>({});

  // Setup steps configuration
  const setupSteps = [
    {
      id: "company",
      title: "Company Information",
      description: "Basic company details and settings",
      template: "Company Settings",
      required: true,
      fields: ["name", "industry", "size", "address", "phone", "email"],
      sampleData: {
        name: "Your Company Inc.",
        industry: "Technology",
        size: "Medium (50-200 employees)",
        address: "123 Business Ave, City, State 12345",
        phone: "+1-555-123-4567",
        email: "info@yourcompany.com",
        website: "https://yourcompany.com",
        timezone: "America/New_York",
        currency: "USD",
      },
    },
    {
      id: "departments",
      title: "Departments",
      description: "Organizational departments and structure",
      template: "Departments",
      required: true,
      fields: ["name", "description", "budget", "location"],
      sampleData: [
        {
          name: "Engineering",
          description: "Software development and engineering",
          budget: 500000,
          location: "Building A, Floor 3",
        },
        {
          name: "Human Resources",
          description: "HR management and employee relations",
          budget: 200000,
          location: "Building A, Floor 1",
        },
        {
          name: "Sales",
          description: "Sales and business development",
          budget: 300000,
          location: "Building B, Floor 2",
        },
      ],
    },
    {
      id: "roles",
      title: "Job Roles",
      description: "Employee roles and position definitions",
      template: "Roles",
      required: true,
      fields: ["name", "description", "level"],
      sampleData: [
        {
          name: "Software Engineer",
          description: "Software development role",
          level: "mid",
          permissions: '["read", "write"]',
        },
        {
          name: "Senior Software Engineer",
          description: "Senior software development role",
          level: "senior",
          permissions: '["read", "write", "review"]',
        },
        {
          name: "HR Manager",
          description: "Human resources management",
          level: "manager",
          permissions: '["read", "write", "manage"]',
        },
      ],
    },
    {
      id: "employees",
      title: "Employee Data",
      description: "Import your existing employee information",
      template: "Employees",
      required: true,
      fields: [
        "employee_id",
        "first_name",
        "last_name",
        "email",
        "department",
        "position",
      ],
      sampleData: [
        {
          employee_id: "EMP001",
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@company.com",
          department: "Engineering",
          position: "Software Engineer",
          hire_date: "2024-01-15",
          status: "active",
        },
        {
          employee_id: "EMP002",
          first_name: "Jane",
          last_name: "Smith",
          email: "jane.smith@company.com",
          department: "Human Resources",
          position: "HR Manager",
          hire_date: "2023-06-01",
          status: "active",
        },
      ],
    },
    {
      id: "leave_types",
      title: "Leave Types",
      description: "Configure your leave policies and types",
      template: "Leave Types",
      required: true,
      fields: ["name", "description", "default_days"],
      sampleData: [
        {
          name: "Annual Leave",
          description: "Yearly vacation leave",
          default_days: 25,
          requires_approval: true,
          color: "#4F46E5",
        },
        {
          name: "Sick Leave",
          description: "Medical leave",
          default_days: 10,
          requires_approval: false,
          color: "#EF4444",
        },
        {
          name: "Personal Leave",
          description: "Personal time off",
          default_days: 5,
          requires_approval: true,
          color: "#10B981",
        },
      ],
    },
    {
      id: "optional",
      title: "Optional Data",
      description: "Additional data to enhance your HR system",
      template: null,
      required: false,
      options: [
        {
          name: "Skills",
          template: "Skills",
          description: "Employee skills and competencies",
        },
        {
          name: "Training Categories",
          template: "Training Categories",
          description: "Training and development categories",
        },
        {
          name: "Meeting Rooms",
          template: "Meeting Rooms",
          description: "Conference rooms and facilities",
        },
        {
          name: "Equipment Inventory",
          template: "Equipment Inventory",
          description: "Company equipment and assets",
        },
      ],
    },
  ];

  // Load all templates
  const loadAllTemplates = async () => {
    if (!adminManager) return;

    try {
      setTemplatesLoading(true);
      console.log("Loading all templates...");

      // First try to get all templates (predefined + dynamic)
      const allTemplates = await adminManager.getAllTemplates();
      console.log(
        `Successfully loaded ${allTemplates.length} templates:`,
        allTemplates.map((t) => t.name),
      );
      setAllTemplates(allTemplates);

      if (allTemplates.length === 0) {
        // If no templates loaded, fall back to predefined only
        console.log("No templates found, loading predefined templates");
        const predefinedTemplates = adminManager.getUploadTemplates();
        console.log(
          `Loaded ${predefinedTemplates.length} predefined templates`,
        );
        setAllTemplates(predefinedTemplates);
      }
    } catch (error) {
      console.error("Failed to load all templates:", error);
      // Fallback to predefined templates only
      try {
        const predefinedTemplates = adminManager.getUploadTemplates();
        console.log(
          `Fallback: loaded ${predefinedTemplates.length} predefined templates`,
        );
        setAllTemplates(predefinedTemplates);
      } catch (fallbackError) {
        console.error(
          "Failed to load even predefined templates:",
          fallbackError,
        );
        setAllTemplates([]);
      }
    } finally {
      setTemplatesLoading(false);
    }
  };

  const templates = allTemplates;

  // Test database connection
  const testConnection = async () => {
    setLoading(true);
    setConnectionStatus(null);
    setConnected(false);
    setAdminManager(null);
    setTables([]);
    setAllTemplates([]);

    try {
      console.log("Testing connection with credentials:", {
        url: credentials.url,
        hasAnonKey: !!credentials.anonKey,
        hasServiceKey: !!credentials.serviceKey,
        hasPassword: !!credentials.password,
      });

      const manager = new SupabaseAdminManager(credentials);
      const result = await manager.testConnection();
      setConnectionStatus(result);

      if (result.success) {
        setAdminManager(manager);
        setConnected(true);

        // Initialize service client for admin operations
        const serviceInitialized = await manager.initializeServiceClient();
        console.log("Service client initialized:", serviceInitialized);

        // Load tables first
        await loadTables(manager);

        // Load templates after successful connection and table loading
        try {
          console.log("Loading templates after connection...");
          setTemplatesLoading(true);

          // First get predefined templates (these should always work)
          const predefinedTemplates = manager.getUploadTemplates();
          console.log(
            `Loaded ${predefinedTemplates.length} predefined templates`,
          );

          // Try to get dynamic templates if service client is available
          let allTemplates = [...predefinedTemplates];
          if (serviceInitialized) {
            try {
              const dynamicTemplates = await manager.getDynamicTemplates();
              console.log(
                `Loaded ${dynamicTemplates.length} dynamic templates`,
              );
              allTemplates = [...predefinedTemplates, ...dynamicTemplates];
            } catch (dynamicError) {
              console.warn(
                "Failed to load dynamic templates, using predefined only:",
                dynamicError,
              );
            }
          }

          setAllTemplates(allTemplates);
          console.log(`Total templates available: ${allTemplates.length}`);
        } catch (templateError) {
          console.error("Failed to load templates:", templateError);
          // Fallback to basic predefined templates
          const fallbackTemplates = manager.getUploadTemplates();
          setAllTemplates(fallbackTemplates);
          console.log(`Using fallback: ${fallbackTemplates.length} templates`);
        } finally {
          setTemplatesLoading(false);
        }
      } else {
        setConnected(false);
        setAdminManager(null);
      }
    } catch (error: any) {
      console.error("Connection test error:", error);
      setConnectionStatus({
        success: false,
        message: `Connection failed: ${error.message}`,
      });
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Load database tables
  const loadTables = async (manager?: SupabaseAdminManager) => {
    const mgr = manager || adminManager;
    if (!mgr) return;

    try {
      setLoading(true);
      const tablesData = await mgr.getTables();
      setTables(tablesData);
    } catch (error: any) {
      console.error("Failed to load tables:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load table data
  const loadTableData = async (tableName: string) => {
    if (!adminManager) return;

    try {
      setLoading(true);
      const offset = (currentPage - 1) * pageSize;
      const result = await adminManager.getTableData(
        tableName,
        pageSize,
        offset,
      );
      setTableData(result.data);
      setTableTotal(result.total);
      setSelectedTable(tableName);
    } catch (error: any) {
      console.error("Failed to load table data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setUploadData(text);
    };
    reader.readAsText(file);
  };

  // Process upload
  const processUpload = async () => {
    if (!adminManager || !uploadTemplate) return;

    try {
      setLoading(true);
      setUploadProgress(0);
      setUploadStatus(null);

      // Parse data
      const parsedData = adminManager.parseCSV(uploadData);
      setUploadProgress(25);

      // Validate data
      const validation = adminManager.validateUploadData(
        parsedData,
        uploadTemplate,
      );
      setUploadProgress(50);

      if (!validation.valid) {
        setUploadStatus({
          success: false,
          message: `Validation failed: ${validation.errors.join(", ")}`,
        });
        return;
      }

      setUploadProgress(75);

      // Upload data
      const result = await adminManager.uploadData(
        uploadTemplate.table,
        parsedData,
      );
      setUploadProgress(100);
      setUploadStatus(result);

      if (result.success) {
        // Refresh table data if viewing the uploaded table
        if (selectedTable === uploadTemplate.table) {
          await loadTableData(selectedTable);
        }
        // Clear upload form
        setUploadData("");
        setUploadFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error: any) {
      setUploadStatus({
        success: false,
        message: `Upload failed: ${error.message}`,
      });
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  // Download template
  const downloadTemplate = (template: UploadTemplate) => {
    if (!adminManager) return;

    const csv = adminManager.generateCSVTemplate(template);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.name.toLowerCase()}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Setup Wizard Functions
  const downloadSetupTemplate = (stepId: string) => {
    const step = setupSteps.find((s) => s.id === stepId);
    if (!step || !step.template || !adminManager) return;

    const template = templates.find((t) => t.name === step.template);
    if (template) {
      downloadTemplate(template);
    }
  };

  const processSetupUpload = async (stepId: string, data: string) => {
    const step = setupSteps.find((s) => s.id === stepId);
    if (!step || !step.template || !adminManager) return;

    const template = templates.find((t) => t.name === step.template);
    if (!template) return;

    try {
      setLoading(true);
      setSetupStatus((prev) => ({ ...prev, [stepId]: "pending" }));

      // Parse and validate data
      const parsedData = adminManager.parseCSV(data);
      const validation = adminManager.validateUploadData(parsedData, template);

      if (!validation.valid) {
        setSetupStatus((prev) => ({ ...prev, [stepId]: "error" }));
        return { success: false, message: validation.errors.join(", ") };
      }

      // Upload data
      const result = await adminManager.uploadData(template.table, parsedData);

      if (result.success) {
        setSetupStatus((prev) => ({ ...prev, [stepId]: "completed" }));
        // Update progress
        const completedSteps = Object.values({
          ...setupStatus,
          [stepId]: "completed",
        }).filter((status) => status === "completed").length;
        setSetupProgress(
          (completedSteps / setupSteps.filter((s) => s.required).length) * 100,
        );
      } else {
        setSetupStatus((prev) => ({ ...prev, [stepId]: "error" }));
      }

      return result;
    } catch (error: any) {
      setSetupStatus((prev) => ({ ...prev, [stepId]: "error" }));
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < setupSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateSetupSampleCSV = (stepId: string) => {
    const step = setupSteps.find((s) => s.id === stepId);
    if (!step || !step.template || !adminManager) return "";

    const template = templates.find((t) => t.name === step.template);
    if (!template) return "";

    // Create custom sample data if provided in step
    if (step.sampleData && Array.isArray(step.sampleData)) {
      const headers = template.columns.join(",");
      const sampleRows = step.sampleData
        .map((row) =>
          template.columns.map((col) => String(row[col] || "")).join(","),
        )
        .join("\n");
      return `${headers}\n${sampleRows}`;
    } else if (step.sampleData && typeof step.sampleData === "object") {
      const headers = template.columns.join(",");
      const sampleRow = template.columns
        .map((col) => String(step.sampleData[col] || ""))
        .join(",");
      return `${headers}\n${sampleRow}`;
    }

    return adminManager.generateCSVTemplate(template);
  };

  // Auto-connect on mount
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <DebugLayout>
      <PageLayout
        title="Supabase Admin Panel"
        description="Manage database connections, view tables, and upload data"
        breadcrumbs={[
          { label: "Debug", href: "/debug" },
          { label: "Supabase Admin", href: "/debug/supabase-admin" },
        ]}
      >
        <div className="space-y-6">
          {/* Connection Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="url">Supabase URL</Label>
                  <Input
                    id="url"
                    value={credentials.url}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        url: e.target.value,
                      }))
                    }
                    placeholder="https://your-project.supabase.co"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Database Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password || ""}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Your database password"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="anonKey">Anonymous Key</Label>
                <Textarea
                  id="anonKey"
                  value={credentials.anonKey}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      anonKey: e.target.value,
                    }))
                  }
                  placeholder="Your Supabase anonymous key"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="serviceKey">Service Role Key (Optional)</Label>
                <Textarea
                  id="serviceKey"
                  value={credentials.serviceKey || ""}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      serviceKey: e.target.value,
                    }))
                  }
                  placeholder="Your Supabase service role key (for admin operations)"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-4">
                <Button onClick={testConnection} disabled={loading}>
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Settings className="h-4 w-4" />
                  )}
                  {loading ? "Testing..." : "Test Connection"}
                </Button>

                {connectionStatus && (
                  <div className="flex items-center gap-2">
                    {connectionStatus.success ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                    <span
                      className={
                        connectionStatus.success
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    >
                      {connectionStatus.message}
                    </span>
                    {connectionStatus.latency && (
                      <Badge variant="outline">
                        {connectionStatus.latency}ms
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {connected && (
            <Tabs defaultValue="setup" className="space-y-6">
              <TabsList>
                <TabsTrigger value="setup">
                  <Settings className="h-4 w-4 mr-2" />
                  Setup Wizard
                </TabsTrigger>
                <TabsTrigger value="tables">
                  <Database className="h-4 w-4 mr-2" />
                  Database Tables
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Data
                </TabsTrigger>
              </TabsList>

              {/* Setup Wizard Tab */}
              <TabsContent value="setup" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      HR Portal Setup Wizard
                    </CardTitle>
                    <div className="text-sm text-gray-600">
                      Get your HR Portal up and running by uploading essential
                      company data in the correct order.
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Setup Progress</span>
                        <span>{Math.round(setupProgress)}% Complete</span>
                      </div>
                      <Progress value={setupProgress} className="h-2" />
                    </div>

                    {/* Step Navigation */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        {setupSteps.map((step, index) => (
                          <div
                            key={step.id}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                              currentStep === index + 1
                                ? "bg-blue-100 text-blue-700"
                                : setupStatus[step.id] === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : setupStatus[step.id] === "error"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                            onClick={() => setCurrentStep(index + 1)}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                setupStatus[step.id] === "completed"
                                  ? "bg-green-500 text-white"
                                  : setupStatus[step.id] === "error"
                                    ? "bg-red-500 text-white"
                                    : currentStep === index + 1
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-300 text-gray-600"
                              }`}
                            >
                              {setupStatus[step.id] === "completed"
                                ? "✓"
                                : setupStatus[step.id] === "error"
                                  ? "✗"
                                  : index + 1}
                            </div>
                            <span className="hidden md:block font-medium">
                              {step.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Current Step Content */}
                    {setupSteps[currentStep - 1] && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xl font-semibold">
                                {setupSteps[currentStep - 1].title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {setupSteps[currentStep - 1].description}
                              </p>
                            </div>
                            {setupSteps[currentStep - 1].required && (
                              <Badge variant="destructive">Required</Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {setupSteps[currentStep - 1].template ? (
                            <>
                              {/* Download Template Section */}
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <Download className="h-4 w-4" />
                                  Step 1: Download Template
                                </h4>
                                <p className="text-sm text-gray-600 mb-3">
                                  Download the CSV template, fill it with your
                                  company data, and upload it below.
                                </p>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() =>
                                      downloadSetupTemplate(
                                        setupSteps[currentStep - 1].id,
                                      )
                                    }
                                    size="sm"
                                    variant="outline"
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download {
                                      setupSteps[currentStep - 1].title
                                    }{" "}
                                    Template
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      const csv = generateSetupSampleCSV(
                                        setupSteps[currentStep - 1].id,
                                      );
                                      if (csv) {
                                        const blob = new Blob([csv], {
                                          type: "text/csv",
                                        });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = url;
                                        a.download = `${setupSteps[currentStep - 1].id}_sample.csv`;
                                        a.click();
                                        URL.revokeObjectURL(url);
                                      }
                                    }}
                                    size="sm"
                                    variant="ghost"
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Download Sample Data
                                  </Button>
                                </div>
                              </div>

                              {/* Upload Section */}
                              <div className="bg-green-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <Upload className="h-4 w-4" />
                                  Step 2: Upload Your Data
                                </h4>
                                <div className="space-y-3">
                                  <div>
                                    <Label
                                      htmlFor={`setup-file-${setupSteps[currentStep - 1].id}`}
                                    >
                                      Choose CSV File
                                    </Label>
                                    <Input
                                      id={`setup-file-${setupSteps[currentStep - 1].id}`}
                                      type="file"
                                      accept=".csv"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onload = (e) => {
                                            const data = e.target
                                              ?.result as string;
                                            setStepData((prev) => ({
                                              ...prev,
                                              [setupSteps[currentStep - 1].id]:
                                                data,
                                            }));
                                          };
                                          reader.readAsText(file);
                                        }
                                      }}
                                    />
                                  </div>

                                  <div>
                                    <Label
                                      htmlFor={`setup-data-${setupSteps[currentStep - 1].id}`}
                                    >
                                      Or Paste CSV Data
                                    </Label>
                                    <Textarea
                                      id={`setup-data-${setupSteps[currentStep - 1].id}`}
                                      value={
                                        stepData[
                                          setupSteps[currentStep - 1].id
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        setStepData((prev) => ({
                                          ...prev,
                                          [setupSteps[currentStep - 1].id]:
                                            e.target.value,
                                        }))
                                      }
                                      placeholder="Paste your CSV data here..."
                                      rows={6}
                                    />
                                  </div>

                                  <Button
                                    onClick={async () => {
                                      const result = await processSetupUpload(
                                        setupSteps[currentStep - 1].id,
                                        stepData[
                                          setupSteps[currentStep - 1].id
                                        ] || "",
                                      );
                                      if (result?.success) {
                                        // Auto-advance to next step if this was successful and required
                                        if (
                                          setupSteps[currentStep - 1]
                                            .required &&
                                          currentStep < setupSteps.length
                                        ) {
                                          setTimeout(() => nextStep(), 1000);
                                        }
                                      }
                                    }}
                                    disabled={
                                      !stepData[
                                        setupSteps[currentStep - 1].id
                                      ] || loading
                                    }
                                    className="w-full"
                                  >
                                    {loading ? (
                                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    ) : setupStatus[
                                        setupSteps[currentStep - 1].id
                                      ] === "completed" ? (
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                    ) : (
                                      <Upload className="h-4 w-4 mr-2" />
                                    )}
                                    {loading
                                      ? "Uploading..."
                                      : setupStatus[
                                            setupSteps[currentStep - 1].id
                                          ] === "completed"
                                        ? "Completed"
                                        : `Upload ${setupSteps[currentStep - 1].title}`}
                                  </Button>
                                </div>
                              </div>

                              {/* Status Display */}
                              {setupStatus[setupSteps[currentStep - 1].id] && (
                                <div
                                  className={`p-3 rounded border ${
                                    setupStatus[
                                      setupSteps[currentStep - 1].id
                                    ] === "completed"
                                      ? "border-green-200 bg-green-50 text-green-800"
                                      : setupStatus[
                                            setupSteps[currentStep - 1].id
                                          ] === "error"
                                        ? "border-red-200 bg-red-50 text-red-800"
                                        : "border-blue-200 bg-blue-50 text-blue-800"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {setupStatus[
                                      setupSteps[currentStep - 1].id
                                    ] === "completed" && (
                                      <CheckCircle2 className="h-4 w-4" />
                                    )}
                                    {setupStatus[
                                      setupSteps[currentStep - 1].id
                                    ] === "error" && (
                                      <AlertTriangle className="h-4 w-4" />
                                    )}
                                    <span className="font-medium">
                                      {setupStatus[
                                        setupSteps[currentStep - 1].id
                                      ] === "completed"
                                        ? "Data uploaded successfully!"
                                        : setupStatus[
                                              setupSteps[currentStep - 1].id
                                            ] === "error"
                                          ? "Upload failed. Please check your data format."
                                          : "Processing..."}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            /* Optional Step - Multiple Templates */
                            <div className="space-y-4">
                              <p className="text-sm text-gray-600">
                                These are optional enhancements you can add
                                later. Select any that apply to your
                                organization:
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {setupSteps[currentStep - 1].options?.map(
                                  (option) => (
                                    <Card
                                      key={option.name}
                                      className="cursor-pointer hover:shadow-md transition-shadow"
                                    >
                                      <CardContent className="p-4">
                                        <h4 className="font-medium mb-2">
                                          {option.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                          {option.description}
                                        </p>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            const template = templates.find(
                                              (t) => t.name === option.template,
                                            );
                                            if (template)
                                              downloadTemplate(template);
                                          }}
                                        >
                                          <Download className="h-4 w-4 mr-2" />
                                          Download Template
                                        </Button>
                                      </CardContent>
                                    </Card>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-6">
                      <Button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        variant="outline"
                      >
                        Previous
                      </Button>
                      <div className="flex gap-2">
                        {currentStep < setupSteps.length ? (
                          <Button onClick={nextStep}>Next Step</Button>
                        ) : (
                          <Button
                            onClick={() => {
                              alert(
                                "Setup completed! Your HR Portal is ready to use.",
                              );
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Complete Setup
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tables Tab */}
              <TabsContent value="tables" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Database Tables ({tables.length})</span>
                      <Button
                        onClick={() => loadTables()}
                        disabled={loading}
                        size="sm"
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                        />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tables.map((table) => (
                        <Card
                          key={table.name}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">{table.name}</h3>
                              <Badge variant="outline">
                                {table.rowCount} rows
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              {table.columns.length} columns
                            </p>
                            <Button
                              size="sm"
                              onClick={() => loadTableData(table.name)}
                              disabled={loading}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Data
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Table Data Display */}
                {selectedTable && tableData.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Table: {selectedTable}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {tableTotal} total rows
                          </span>
                          <Button
                            onClick={() => loadTableData(selectedTable)}
                            disabled={loading}
                            size="sm"
                          >
                            <RefreshCw
                              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                            />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {Object.keys(tableData[0] || {}).map((column) => (
                                <TableHead key={column}>{column}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tableData.map((row, index) => (
                              <TableRow key={index}>
                                {Object.values(row).map(
                                  (value: any, cellIndex) => (
                                    <TableCell
                                      key={cellIndex}
                                      className="max-w-xs truncate"
                                    >
                                      {typeof value === "object"
                                        ? JSON.stringify(value)
                                        : String(value)}
                                    </TableCell>
                                  ),
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-600">
                          Showing {(currentPage - 1) * pageSize + 1} to{" "}
                          {Math.min(currentPage * pageSize, tableTotal)} of{" "}
                          {tableTotal} rows
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setCurrentPage((prev) => Math.max(1, prev - 1));
                              loadTableData(selectedTable);
                            }}
                            disabled={currentPage === 1 || loading}
                          >
                            Previous
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setCurrentPage((prev) => prev + 1);
                              loadTableData(selectedTable);
                            }}
                            disabled={
                              currentPage * pageSize >= tableTotal || loading
                            }
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Upload Tab */}
              <TabsContent value="upload" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Template Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Upload Templates
                        <Button
                          onClick={loadAllTemplates}
                          disabled={!adminManager || templatesLoading}
                          size="sm"
                          variant="outline"
                        >
                          <RefreshCw
                            className={`h-4 w-4 ${templatesLoading ? "animate-spin" : ""}`}
                          />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Available Templates ({templates.length})</Label>
                        <Select
                          value={uploadTemplate?.name || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              setUploadTemplate(null);
                              setUploadData("");
                              return;
                            }
                            const template = templates.find(
                              (t) => t.name === value,
                            );
                            setUploadTemplate(template || null);
                            setUploadData("");
                          }}
                          placeholder={
                            templatesLoading
                              ? "Loading templates..."
                              : "Select a template"
                          }
                        >
                          <SelectItem value="">
                            {templatesLoading
                              ? "Loading templates..."
                              : "Select a template"}
                          </SelectItem>
                          {templates.map((template) => (
                            <SelectItem
                              key={template.name}
                              value={template.name}
                            >
                              {template.name} - {template.table}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>

                      {/* Download All Templates Section */}
                      {templates.length > 0 && (
                        <div className="space-y-2">
                          <Label>Download Templates (Bulk)</Label>
                          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                            {templates.slice(0, 10).map((template) => (
                              <Button
                                key={template.name}
                                onClick={() => downloadTemplate(template)}
                                size="sm"
                                variant="ghost"
                                className="text-xs justify-start"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                {template.name}
                              </Button>
                            ))}
                          </div>
                          {templates.length > 10 && (
                            <p className="text-xs text-gray-500">
                              Showing first 10 templates. Select individual
                              templates above to download others.
                            </p>
                          )}
                        </div>
                      )}

                      {uploadTemplate && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">
                              {uploadTemplate.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {uploadTemplate.description}
                            </p>
                            <div className="text-sm">
                              <strong>Table:</strong> {uploadTemplate.table}
                            </div>
                            <div className="text-sm">
                              <strong>Required Fields:</strong>{" "}
                              {uploadTemplate.requiredFields.join(", ")}
                            </div>
                          </div>

                          <Button
                            onClick={() => downloadTemplate(uploadTemplate)}
                            size="sm"
                            variant="outline"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Template
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* File Upload */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Data</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="file">Choose CSV File</Label>
                        <Input
                          id="file"
                          type="file"
                          accept=".csv"
                          onChange={handleFileUpload}
                          ref={fileInputRef}
                        />
                        {uploadFile && (
                          <p className="text-sm text-gray-600 mt-1">
                            Selected: {uploadFile.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="data">Or Paste CSV Data</Label>
                        <Textarea
                          id="data"
                          value={uploadData}
                          onChange={(e) => setUploadData(e.target.value)}
                          placeholder="Paste your CSV data here..."
                          rows={8}
                        />
                      </div>

                      {uploadProgress > 0 && (
                        <div>
                          <Label>Upload Progress</Label>
                          <Progress value={uploadProgress} className="mt-1" />
                        </div>
                      )}

                      {uploadStatus && (
                        <div
                          className={`p-3 rounded border ${uploadStatus.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                        >
                          <p
                            className={
                              uploadStatus.success
                                ? "text-green-800"
                                : "text-red-800"
                            }
                          >
                            {uploadStatus.message}
                          </p>
                        </div>
                      )}

                      <Button
                        onClick={processUpload}
                        disabled={
                          !uploadTemplate || !uploadData.trim() || loading
                        }
                        className="w-full"
                      >
                        {loading ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        {loading ? "Uploading..." : "Upload Data"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Template Preview */}
                {uploadTemplate && (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Template Preview - {uploadTemplate.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {uploadTemplate.columns.map((column) => (
                                <TableHead key={column}>
                                  {column}
                                  {uploadTemplate.requiredFields.includes(
                                    column,
                                  ) && (
                                    <span className="text-red-500 ml-1">*</span>
                                  )}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {uploadTemplate.sampleData.map((row, index) => (
                              <TableRow key={index}>
                                {uploadTemplate.columns.map((column) => (
                                  <TableCell key={column}>
                                    {String(row[column] || "")}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </PageLayout>
    </DebugLayout>
  );
}
