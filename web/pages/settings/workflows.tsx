import React, { useState, useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import { GetServerSideProps } from "next";

import { Button } from "@/components/ui/button";
import { shouldBypassAuth } from "@/lib/auth";

import {
  PermissionGuard,
  PermissionButton,
} from "../../components/ui/PermissionGuard";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";

// Enhanced workflow types
interface WorkflowStep {
  id: string;
  name: string;
  type:
    | "approval"
    | "notification"
    | "task"
    | "document"
    | "condition"
    | "automation"
    | "integration";
  assignee: string;
  assigneeType: "user" | "role" | "department" | "system";
  description?: string;
  autoAdvance: boolean;
  timeLimit?: number; // hours
  conditions?: WorkflowCondition[];
  actions?: WorkflowAction[];
  position: { x: number; y: number };
  connectedTo: string[];
  required: boolean;
  escalation?: EscalationRule;
}

interface WorkflowCondition {
  id: string;
  field: string;
  operator:
    | "equals"
    | "not_equals"
    | "greater_than"
    | "less_than"
    | "contains"
    | "in"
    | "exists";
  value: any;
  logicalOperator?: "AND" | "OR";
}

interface WorkflowAction {
  id: string;
  type:
    | "email"
    | "slack"
    | "webhook"
    | "update_field"
    | "create_task"
    | "assign_user";
  config: Record<string, any>;
}

interface EscalationRule {
  enabled: boolean;
  timeoutHours: number;
  escalateTo: string;
  escalationType: "user" | "role" | "department";
  notificationMessage?: string;
}

interface WorkflowTrigger {
  id: string;
  event: string;
  conditions: WorkflowCondition[];
  enabled: boolean;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  type:
    | "leave"
    | "expense"
    | "recruitment"
    | "onboarding"
    | "performance"
    | "policy"
    | "custom";
  status: "draft" | "active" | "archived";
  version: number;
  enabled: boolean;
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  variables: WorkflowVariable[];
  integrations: WorkflowIntegration[];
  policies: string[]; // Associated policy IDs
  created_at: string;
  updated_at: string;
  created_by: string;
  usage_count: number;
  avg_completion_time?: number; // in hours
}

interface WorkflowVariable {
  id: string;
  name: string;
  type: "string" | "number" | "boolean" | "date" | "object";
  defaultValue?: any;
  required: boolean;
  description?: string;
}

interface WorkflowIntegration {
  id: string;
  name: string;
  type: "email" | "slack" | "teams" | "webhook" | "api" | "database";
  config: Record<string, any>;
  enabled: boolean;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  workflow: Partial<Workflow>;
  tags: string[];
}

const WorkflowManagementPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const allowAccess = shouldBypassAuth(router.query);

  const [isLoading, setIsLoading] = useState(true);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "builder" | "settings" | "analytics"
  >("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Check if user has permission to manage workflows
  const canManageWorkflows =
    hasPermission("workflows", "manage_settings") ||
    hasPermission("system_settings", "update");

  // Redirect if no access
  useEffect(() => {
    if (!allowAccess && !canManageWorkflows) {
      router.push("/dashboard?error=insufficient_permissions");
    }
  }, [allowAccess, canManageWorkflows, router]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Mock data - in real implementation, fetch from API
      const mockWorkflows: Workflow[] = [
        {
          id: "wf_leave_approval",
          name: "Leave Request Approval",
          description:
            "Comprehensive leave request approval workflow with escalation",
          type: "leave",
          status: "active",
          version: 2,
          enabled: true,
          steps: [
            {
              id: "step_1",
              name: "Manager Review",
              type: "approval",
              assignee: "direct_manager",
              assigneeType: "role",
              description:
                "Direct manager reviews and approves/rejects leave request",
              autoAdvance: false,
              timeLimit: 48,
              position: { x: 100, y: 100 },
              connectedTo: ["step_2"],
              required: true,
              escalation: {
                enabled: true,
                timeoutHours: 72,
                escalateTo: "department_head",
                escalationType: "role",
                notificationMessage: "Leave request requires urgent attention",
              },
            },
            {
              id: "step_2",
              name: "HR Notification",
              type: "notification",
              assignee: "hr_team",
              assigneeType: "department",
              autoAdvance: true,
              position: { x: 300, y: 100 },
              connectedTo: ["step_3"],
              required: false,
            },
            {
              id: "step_3",
              name: "Calendar Update",
              type: "automation",
              assignee: "system",
              assigneeType: "system",
              autoAdvance: true,
              position: { x: 500, y: 100 },
              connectedTo: [],
              required: true,
            },
          ],
          triggers: [
            {
              id: "trigger_1",
              event: "leave_request_submitted",
              conditions: [],
              enabled: true,
            },
          ],
          variables: [
            {
              id: "var_1",
              name: "leave_duration",
              type: "number",
              required: true,
              description: "Duration of leave in days",
            },
            {
              id: "var_2",
              name: "leave_type",
              type: "string",
              required: true,
              description: "Type of leave (annual, sick, etc.)",
            },
          ],
          integrations: [
            {
              id: "int_1",
              name: "Email Notifications",
              type: "email",
              config: { smtp_server: "smtp.company.com" },
              enabled: true,
            },
            {
              id: "int_2",
              name: "Slack Notifications",
              type: "slack",
              config: { webhook_url: "https://hooks.slack.com/..." },
              enabled: true,
            },
          ],
          policies: ["policy_leave_entitlement", "policy_approval_hierarchy"],
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-20T15:30:00Z",
          created_by: "admin",
          usage_count: 247,
          avg_completion_time: 18.5,
        },
        {
          id: "wf_expense_approval",
          name: "Expense Report Approval",
          description: "Multi-stage expense approval with finance review",
          type: "expense",
          status: "active",
          version: 1,
          enabled: true,
          steps: [
            {
              id: "step_1",
              name: "Amount Validation",
              type: "condition",
              assignee: "system",
              assigneeType: "system",
              autoAdvance: true,
              conditions: [
                {
                  id: "cond_1",
                  field: "total_amount",
                  operator: "greater_than",
                  value: 1000,
                },
              ],
              position: { x: 100, y: 100 },
              connectedTo: ["step_2", "step_3"],
              required: true,
            },
            {
              id: "step_2",
              name: "Manager Approval",
              type: "approval",
              assignee: "direct_manager",
              assigneeType: "role",
              autoAdvance: false,
              timeLimit: 48,
              position: { x: 200, y: 50 },
              connectedTo: ["step_4"],
              required: true,
            },
            {
              id: "step_3",
              name: "Finance Approval",
              type: "approval",
              assignee: "finance_team",
              assigneeType: "department",
              autoAdvance: false,
              timeLimit: 72,
              position: { x: 200, y: 150 },
              connectedTo: ["step_4"],
              required: true,
            },
            {
              id: "step_4",
              name: "Payment Processing",
              type: "automation",
              assignee: "finance_system",
              assigneeType: "system",
              autoAdvance: true,
              position: { x: 400, y: 100 },
              connectedTo: [],
              required: true,
            },
          ],
          triggers: [
            {
              id: "trigger_1",
              event: "expense_report_submitted",
              conditions: [],
              enabled: true,
            },
          ],
          variables: [
            {
              id: "var_1",
              name: "total_amount",
              type: "number",
              required: true,
              description: "Total expense amount",
            },
            {
              id: "var_2",
              name: "expense_category",
              type: "string",
              required: true,
              description: "Category of expense",
            },
          ],
          integrations: [
            {
              id: "int_1",
              name: "Accounting System",
              type: "api",
              config: { api_endpoint: "https://api.accounting.com" },
              enabled: true,
            },
          ],
          policies: ["policy_expense_limits", "policy_receipt_requirements"],
          created_at: "2024-01-10T09:00:00Z",
          updated_at: "2024-01-18T11:20:00Z",
          created_by: "finance_admin",
          usage_count: 189,
          avg_completion_time: 32.1,
        },
        {
          id: "wf_policy_review",
          name: "Policy Review & Approval",
          description: "Workflow for reviewing and approving new policies",
          type: "policy",
          status: "active",
          version: 1,
          enabled: true,
          steps: [
            {
              id: "step_1",
              name: "Legal Review",
              type: "approval",
              assignee: "legal_team",
              assigneeType: "department",
              autoAdvance: false,
              timeLimit: 168, // 1 week
              position: { x: 100, y: 100 },
              connectedTo: ["step_2"],
              required: true,
            },
            {
              id: "step_2",
              name: "Management Approval",
              type: "approval",
              assignee: "c_level",
              assigneeType: "role",
              autoAdvance: false,
              timeLimit: 72,
              position: { x: 300, y: 100 },
              connectedTo: ["step_3"],
              required: true,
            },
            {
              id: "step_3",
              name: "Policy Publication",
              type: "automation",
              assignee: "policy_system",
              assigneeType: "system",
              autoAdvance: true,
              position: { x: 500, y: 100 },
              connectedTo: [],
              required: true,
            },
          ],
          triggers: [
            {
              id: "trigger_1",
              event: "policy_draft_submitted",
              conditions: [],
              enabled: true,
            },
          ],
          variables: [
            {
              id: "var_1",
              name: "policy_type",
              type: "string",
              required: true,
              description: "Type of policy (HR, Security, Finance, etc.)",
            },
            {
              id: "var_2",
              name: "urgency_level",
              type: "string",
              required: true,
              description: "Urgency level (low, medium, high, critical)",
            },
          ],
          integrations: [
            {
              id: "int_1",
              name: "Document Management",
              type: "api",
              config: { api_endpoint: "https://api.docmanager.com" },
              enabled: true,
            },
          ],
          policies: [],
          created_at: "2024-01-05T14:00:00Z",
          updated_at: "2024-01-25T10:15:00Z",
          created_by: "legal_admin",
          usage_count: 23,
          avg_completion_time: 168.2,
        },
      ];

      const mockTemplates: WorkflowTemplate[] = [
        {
          id: "template_1",
          name: "Simple Approval",
          description: "Basic two-step approval workflow",
          category: "General",
          workflow: {
            name: "Simple Approval Workflow",
            description: "Basic approval process",
            type: "custom",
            steps: [
              {
                id: "step_1",
                name: "Manager Approval",
                type: "approval",
                assignee: "manager",
                assigneeType: "role",
                autoAdvance: false,
                position: { x: 100, y: 100 },
                connectedTo: ["step_2"],
                required: true,
              },
              {
                id: "step_2",
                name: "Completion",
                type: "automation",
                assignee: "system",
                assigneeType: "system",
                autoAdvance: true,
                position: { x: 300, y: 100 },
                connectedTo: [],
                required: true,
              },
            ],
          },
          tags: ["approval", "simple", "general"],
        },
        {
          id: "template_2",
          name: "Multi-Stage Review",
          description: "Complex workflow with multiple review stages",
          category: "Advanced",
          workflow: {
            name: "Multi-Stage Review Workflow",
            description: "Multi-level review and approval process",
            type: "custom",
          },
          tags: ["complex", "review", "multi-stage"],
        },
      ];

      setWorkflows(mockWorkflows);
      setTemplates(mockTemplates);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkflow = () => {
    setIsCreating(true);
    setSelectedWorkflow(null);
    setActiveTab("builder");
  };

  const handleEditWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setIsEditing(true);
    setActiveTab("builder");
  };

  const handleToggleWorkflow = (workflowId: string) => {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === workflowId ? { ...w, enabled: !w.enabled } : w,
      ),
    );
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    const workflow = workflows.find((w) => w.id === workflowId);
    if (!workflow) return;

    if (
      !confirm(
        `Are you sure you want to delete the workflow "${workflow.name}"?`,
      )
    ) {
      return;
    }

    try {
      setWorkflows((prev) => prev.filter((w) => w.id !== workflowId));
      if (selectedWorkflow?.id === workflowId) {
        setSelectedWorkflow(null);
      }
      alert("Workflow deleted successfully!");
    } catch (error) {
      console.error("Error deleting workflow:", error);
      alert("Failed to delete workflow. Please try again.");
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      leave: "bg-blue-100 text-blue-800",
      expense: "bg-green-100 text-green-800",
      recruitment: "bg-purple-100 text-purple-800",
      onboarding: "bg-orange-100 text-orange-800",
      performance: "bg-pink-100 text-pink-800",
      policy: "bg-red-100 text-red-800",
      custom: "bg-gray-100 text-gray-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-yellow-100 text-yellow-800",
      active: "bg-green-100 text-green-800",
      archived: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStepTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      approval: "✅",
      notification: "📧",
      task: "📋",
      document: "📄",
      condition: "❓",
      automation: "⚙️",
      integration: "🔗",
    };
    return icons[type] || "📋";
  };

  // Filter workflows
  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || workflow.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || workflow.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  if (!allowAccess && !canManageWorkflows) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Workflow Management - HR Management</title>
        <meta
          name="description"
          content="Create and manage business process workflows"
        />
      </Head>

      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Workflow Management
            </h1>
            <p className="text-gray-600">
              Design and manage automated business processes
            </p>
          </div>
          <div className="flex space-x-3">
            <PermissionButton
              permissions={["workflows.create", "system_settings.update"]}
              onClick={handleCreateWorkflow}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Workflow
            </PermissionButton>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Workflows
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {workflows.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Workflows
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {workflows.filter((w) => w.status === "active").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Executions
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {workflows.reduce((sum, w) => sum + w.usage_count, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Avg Completion
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round(
                    workflows.reduce(
                      (sum, w) => sum + (w.avg_completion_time || 0),
                      0,
                    ) / workflows.length,
                  )}
                  h
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Button
            className="h-20 flex flex-col items-center justify-center"
            onClick={() =>
              alert("Creating new workflow with role assignments...")
            }
          >
            <span className="text-2xl mb-1">➕</span>
            <span className="text-sm">New Workflow</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => alert("Importing workflow templates...")}
          >
            <span className="text-2xl mb-1">📥</span>
            <span className="text-sm">Import Template</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => alert("Bulk assigning workflows to roles...")}
          >
            <span className="text-2xl mb-1">🔗</span>
            <span className="text-sm">Assign to Roles</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => alert("Analyzing workflow performance...")}
          >
            <span className="text-2xl mb-1">📊</span>
            <span className="text-sm">Analytics</span>
          </Button>
        </div>

        {/* Workflow Templates Quick Access */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">Quick Start Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">HR Workflows</h4>
              <p className="text-sm text-blue-600 mb-3">
                Leave approval, onboarding, performance reviews
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => alert("Creating HR workflow template...")}
                >
                  Create
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => alert("Browsing HR templates...")}
                >
                  Browse
                </Button>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">
                Compliance Workflows
              </h4>
              <p className="text-sm text-green-600 mb-3">
                Policy approval, audit processes, training assignments
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => alert("Creating compliance workflow...")}
                >
                  Create
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => alert("Viewing compliance templates...")}
                >
                  Browse
                </Button>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">
                Finance Workflows
              </h4>
              <p className="text-sm text-purple-600 mb-3">
                Expense approval, budget planning, procurement
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => alert("Creating finance workflow...")}
                >
                  Create
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => alert("Exploring finance templates...")}
                >
                  Browse
                </Button>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Workflows List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Workflows ({filteredWorkflows.length})
                  </h2>
                </div>

                {/* Filters */}
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Search workflows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <div className="grid grid-cols-1 gap-2">
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="leave">Leave</option>
                      <option value="expense">Expense</option>
                      <option value="recruitment">Recruitment</option>
                      <option value="onboarding">Onboarding</option>
                      <option value="performance">Performance</option>
                      <option value="policy">Policy</option>
                      <option value="custom">Custom</option>
                    </select>

                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredWorkflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      onClick={() => setSelectedWorkflow(workflow)}
                      className={`p-3 rounded-md cursor-pointer transition-colors border ${
                        selectedWorkflow?.id === workflow.id
                          ? "bg-blue-50 border-blue-200 shadow-sm"
                          : "bg-gray-50 hover:bg-gray-100 border-transparent"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900 text-sm">
                              {workflow.name}
                            </h3>
                            <span
                              className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded ${getTypeColor(workflow.type)}`}
                            >
                              {workflow.type}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            {workflow.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span
                              className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded ${getStatusColor(workflow.status)}`}
                            >
                              {workflow.status}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-400">
                                {workflow.steps.length} steps
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleWorkflow(workflow.id);
                                }}
                                className={`w-4 h-4 rounded-full ${workflow.enabled ? "bg-green-500" : "bg-gray-300"}`}
                                title={
                                  workflow.enabled ? "Enabled" : "Disabled"
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <PermissionGuard
                          permissions={[
                            "workflows.delete",
                            "system_settings.update",
                          ]}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteWorkflow(workflow.id);
                            }}
                            className="ml-2 text-red-400 hover:text-red-600 p-1"
                            title="Delete workflow"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </PermissionGuard>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Workflow Details */}
            <div className="lg:col-span-3">
              {selectedWorkflow ? (
                <div className="bg-white rounded-lg shadow-md">
                  {/* Tabs */}
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6">
                      {[
                        { id: "overview", name: "Overview", icon: "📋" },
                        { id: "builder", name: "Workflow Builder", icon: "🔧" },
                        { id: "settings", name: "Settings", icon: "⚙️" },
                        { id: "analytics", name: "Analytics", icon: "📊" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === tab.id
                              ? "border-blue-500 text-blue-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <span className="mr-2">{tab.icon}</span>
                          {tab.name}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="p-6">
                    {activeTab === "overview" && (
                      <div className="space-y-6">
                        {/* Workflow Header */}
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h2 className="text-xl font-semibold text-gray-900">
                                {selectedWorkflow.name}
                              </h2>
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getTypeColor(selectedWorkflow.type)}`}
                              >
                                {selectedWorkflow.type}
                              </span>
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getStatusColor(selectedWorkflow.status)}`}
                              >
                                {selectedWorkflow.status}
                              </span>
                            </div>
                            <p className="text-gray-600">
                              {selectedWorkflow.description}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <PermissionButton
                              permissions={[
                                "workflows.update",
                                "system_settings.update",
                              ]}
                              onClick={() =>
                                handleEditWorkflow(selectedWorkflow)
                              }
                              className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
                            >
                              Edit Workflow
                            </PermissionButton>
                          </div>
                        </div>

                        {/* Workflow Steps Overview */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Workflow Steps
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedWorkflow.steps.map((step, index) => (
                              <div
                                key={step.id}
                                className="bg-gray-50 p-4 rounded-lg"
                              >
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-lg">
                                        {getStepTypeIcon(step.type)}
                                      </span>
                                      <h4 className="font-medium text-gray-900">
                                        {step.name}
                                      </h4>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                      {step.description || `${step.type} step`}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>Assigned to: {step.assignee}</span>
                                  {step.timeLimit && (
                                    <span>Timeout: {step.timeLimit}h</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Usage Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <svg
                                  className="w-5 h-5 text-blue-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                  />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-blue-600">
                                  Usage Count
                                </p>
                                <p className="text-lg font-semibold text-blue-900">
                                  {selectedWorkflow.usage_count}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <svg
                                  className="w-5 h-5 text-green-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-green-600">
                                  Avg Completion
                                </p>
                                <p className="text-lg font-semibold text-green-900">
                                  {selectedWorkflow.avg_completion_time?.toFixed(
                                    1,
                                  )}
                                  h
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <svg
                                  className="w-5 h-5 text-purple-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                  />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-purple-600">
                                  Version
                                </p>
                                <p className="text-lg font-semibold text-purple-900">
                                  v{selectedWorkflow.version}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Associated Policies */}
                        {selectedWorkflow.policies.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">
                              Associated Policies
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedWorkflow.policies.map((policyId) => (
                                <span
                                  key={policyId}
                                  className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800"
                                >
                                  {policyId
                                    .replace("policy_", "")
                                    .replace("_", " ")
                                    .toUpperCase()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Integrations */}
                        {selectedWorkflow.integrations.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">
                              Integrations
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {selectedWorkflow.integrations.map(
                                (integration) => (
                                  <div
                                    key={integration.id}
                                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                                  >
                                    <div
                                      className={`w-3 h-3 rounded-full ${integration.enabled ? "bg-green-500" : "bg-red-500"}`}
                                    />
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        {integration.name}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {integration.type}
                                      </p>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "builder" && (
                      <div className="text-center py-12">
                        <div className="text-gray-400">
                          <svg
                            className="w-16 h-16 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                            />
                          </svg>
                          <h3 className="text-xl font-medium mb-2">
                            Workflow Builder
                          </h3>
                          <p className="text-gray-500 mb-4">
                            Visual workflow builder coming soon!
                          </p>
                          <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto">
                            <h4 className="font-medium text-blue-900 mb-2">
                              Planned Features:
                            </h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                              <li>• Drag & drop workflow designer</li>
                              <li>• Visual step connections</li>
                              <li>• Real-time validation</li>
                              <li>• Template library</li>
                              <li>• Condition editor</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "settings" && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Workflow Configuration
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Name
                                </label>
                                <p className="text-sm text-gray-900">
                                  {selectedWorkflow.name}
                                </p>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Type
                                </label>
                                <p className="text-sm text-gray-900">
                                  {selectedWorkflow.type}
                                </p>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Status
                                </label>
                                <p className="text-sm text-gray-900">
                                  {selectedWorkflow.status}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Version
                                </label>
                                <p className="text-sm text-gray-900">
                                  v{selectedWorkflow.version}
                                </p>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Created By
                                </label>
                                <p className="text-sm text-gray-900">
                                  {selectedWorkflow.created_by}
                                </p>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Last Updated
                                </label>
                                <p className="text-sm text-gray-900">
                                  {new Date(
                                    selectedWorkflow.updated_at,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Variables */}
                        {selectedWorkflow.variables.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                              Workflow Variables
                            </h3>
                            <div className="space-y-3">
                              {selectedWorkflow.variables.map((variable) => (
                                <div
                                  key={variable.id}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {variable.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {variable.description}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                                      {variable.type}
                                    </span>
                                    {variable.required && (
                                      <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">
                                        Required
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "analytics" && (
                      <div className="text-center py-12">
                        <div className="text-gray-400">
                          <svg
                            className="w-16 h-16 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          <h3 className="text-xl font-medium mb-2">
                            Workflow Analytics
                          </h3>
                          <p className="text-gray-500 mb-4">
                            Detailed analytics and reporting coming soon!
                          </p>
                          <div className="bg-purple-50 p-4 rounded-lg max-w-md mx-auto">
                            <h4 className="font-medium text-purple-900 mb-2">
                              Planned Analytics:
                            </h4>
                            <ul className="text-sm text-purple-800 space-y-1">
                              <li>• Completion time trends</li>
                              <li>• Step performance metrics</li>
                              <li>• Bottleneck identification</li>
                              <li>• Success rate tracking</li>
                              <li>• User adoption metrics</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="text-gray-400">
                    <svg
                      className="w-16 h-16 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <h3 className="text-xl font-medium mb-2">
                      Select a workflow to view details
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Choose a workflow from the list to view its configuration
                      and analytics.
                    </p>
                    <PermissionButton
                      permissions={[
                        "workflows.create",
                        "system_settings.update",
                      ]}
                      onClick={handleCreateWorkflow}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                      Create New Workflow
                    </PermissionButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default WorkflowManagementPage;
