import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import {
  Users,
  Settings,
  Shield,
  FileText,
  Building,
  Server,
  Database,
  Layers,
  AlertTriangle,
  CreditCard,
  BarChart2,
  Download,
  Lock,
  Mail,
} from "lucide-react";

import { PageLayout, StatsCard, CardGrid, EmptyState } from "@/components/layout/PageLayout";

// Types for the administration page
interface AdminSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const AdminPage = () => {
  const router = useRouter();
  const { user, role } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");

  // Check if user has admin access
  if (role !== "admin" && role !== "hr_director") {
    return (
      <EmptyState
        title="Access Restricted"
        description="You do not have permission to access the Administration section."
        actionLabel="Return to Dashboard"
        onAction={() => router.push("/dashboard")}
      />
    );
  }

  // Admin sections
  const adminSections: AdminSection[] = [
    {
      id: "user-management",
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: <Users className="h-6 w-6" />,
      path: "/admin/user-management",
    },
    {
      id: "company-settings",
      title: "Company Settings",
      description: "Configure organization details and branding",
      icon: <Building className="h-6 w-6" />,
      path: "/settings/company",
    },
    {
      id: "roles-permissions",
      title: "Roles & Permissions",
      description: "Set up role-based access controls",
      icon: <Shield className="h-6 w-6" />,
      path: "/settings/roles",
    },
    {
      id: "workflow-manager",
      title: "Workflow Manager",
      description: "Configure automated workflows and processes",
      icon: <Layers className="h-6 w-6" />,
      path: "/settings/workflow-manager",
    },
    {
      id: "system-logs",
      title: "System Logs",
      description: "Review activity and audit trails",
      icon: <FileText className="h-6 w-6" />,
      path: "/logs",
    },
    {
      id: "integrations",
      title: "Integrations",
      description: "Connect external systems and services",
      icon: <Server className="h-6 w-6" />,
      path: "/settings/integrations",
    },
    {
      id: "data-management",
      title: "Data Management",
      description: "Import, export, and manage system data",
      icon: <Database className="h-6 w-6" />,
      path: "/settings/data-management",
    },
    {
      id: "security",
      title: "Security Settings",
      description: "Configure security policies and controls",
      icon: <Lock className="h-6 w-6" />,
      path: "/settings/security",
    },
    {
      id: "policy-management",
      title: "Policy Management",
      description: "Manage company policies and compliance",
      icon: <FileText className="h-6 w-6" />,
      path: "/settings/policies",
    }
  ];

  return (
    <PageLayout
      title="Administration"
      description="Manage system settings, users, and configurations"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Administration" },
      ]}
    >
      {/* System Stats */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4 text-zinc-900">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value="124"
            description="Active user accounts"
          />
          <StatsCard
            title="Custom Workflows"
            value="18"
            description="Active automated processes"
          />
          <StatsCard
            title="System Health"
            value="99.8%"
            description="Uptime this month"
          />
          <StatsCard
            title="Storage Used"
            value="23.4 GB"
            description="Of 50 GB allocated"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4 text-zinc-900">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => router.push('/admin/user-management')}
            className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
          >
            <Users className="w-4 h-4 mr-2" />
            Add User
          </button>
          <button 
            onClick={() => router.push('/settings/roles')}
            className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
          >
            <Shield className="w-4 h-4 mr-2" />
            Manage Roles
          </button>
          <button 
            onClick={() => router.push('/settings/security')}
            className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
          >
            <Lock className="w-4 h-4 mr-2" />
            Security Settings
          </button>
          <button 
            className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Backup Data
          </button>
        </div>
      </div>

      {/* Admin Sections */}
      <div>
        <h2 className="text-lg font-medium mb-4 text-zinc-900">Administration Modules</h2>
        <CardGrid>
          {adminSections.map((section) => (
            <div
              key={section.id}
              className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(section.path)}
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-md bg-zinc-100 flex items-center justify-center mr-3 text-zinc-900">
                  {section.icon}
                </div>
                <h3 className="text-lg font-medium text-zinc-900">{section.title}</h3>
              </div>
              <p className="text-sm text-zinc-500">{section.description}</p>
            </div>
          ))}
        </CardGrid>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-zinc-900">Recent System Activity</h2>
          <button className="text-sm text-zinc-500 hover:text-zinc-900">View all</button>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b border-zinc-200 bg-zinc-50">
            <div className="flex items-center text-sm text-zinc-900">
              <span className="w-32 font-medium">Time</span>
              <span className="w-32 font-medium">User</span>
              <span className="flex-1 font-medium">Action</span>
            </div>
          </div>
          <div className="divide-y divide-zinc-200">
            {[
              { time: "2 mins ago", user: "Admin", action: "Updated user role for John Smith" },
              { time: "1 hour ago", user: "System", action: "Scheduled backup completed successfully" },
              { time: "3 hours ago", user: "Diana Wong", action: "Modified workflow for leave approvals" },
              { time: "Yesterday", user: "System", action: "User account synced with directory service" },
              { time: "2 days ago", user: "Admin", action: "Added new custom field to employee profiles" },
            ].map((item, i) => (
              <div key={i} className="p-4">
                <div className="flex items-center text-sm">
                  <span className="w-32 text-zinc-500">{item.time}</span>
                  <span className="w-32 font-medium text-zinc-900">{item.user}</span>
                  <span className="flex-1 text-zinc-700">{item.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminPage; 