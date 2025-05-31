import { useState } from "react";

import { useRouter } from "next/router";

import {
  Settings,
  Building,
  Users,
  FileText,
  Bell,
  Shield,
  Mail,
  DollarSign,
  Briefcase,
  Globe,
  Server,
  Database,
  Lock,
  Layers,
  Info,
  Calendar,
  HardDrive,
} from "lucide-react";

import { PageLayout, CardGrid, Card } from "@/components/layout/PageLayout";
import { useAuth } from "@/hooks/useAuth";

// Define types for settings categories
interface SettingCategory {
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  access?: string[];
  isNew?: boolean;
}

const SettingsPage = () => {
  const router = useRouter();
  const { user, role } = useAuth();

  // Define settings categories with their access permissions
  const settingsCategories: SettingCategory[] = [
    {
      name: "Company Settings",
      description:
        "Configure organization details, branding, and global settings",
      href: "/settings/company",
      icon: <Building strokeWidth={1.5} />,
      access: ["admin", "hr_director"],
    },
    {
      name: "User Roles & Permissions",
      description: "Manage user roles, access controls, and permissions",
      href: "/settings/roles",
      icon: <Shield strokeWidth={1.5} />,
      access: ["admin", "hr_director"],
    },
    {
      name: "Workflow Management",
      description: "Configure approval workflows and business processes",
      href: "/settings/workflow-manager",
      icon: <Layers strokeWidth={1.5} />,
      access: ["admin", "hr_director", "hr_manager"],
    },
    {
      name: "Notifications",
      description: "Configure email templates and notification preferences",
      href: "/settings/notifications",
      icon: <Bell strokeWidth={1.5} />,
      access: ["admin", "hr_director", "hr_manager"],
    },
    {
      name: "Policy Management",
      description: "Manage company policies and compliance documents",
      href: "/settings/policies",
      icon: <FileText strokeWidth={1.5} />,
      access: ["admin", "hr_director", "hr_manager", "compliance_manager"],
    },
    {
      name: "Payroll Settings",
      description: "Configure payroll calculations, taxes, and compliance",
      href: "/settings/payroll",
      icon: <DollarSign strokeWidth={1.5} />,
      access: ["admin", "hr_director", "finance_manager"],
    },
    {
      name: "User Management",
      description: "Manage user accounts and permissions",
      href: "/admin/user-management",
      icon: <Users strokeWidth={1.5} />,
      access: ["admin", "hr_director"],
    },
    {
      name: "Security Settings",
      description: "Configure security policies and access controls",
      href: "/settings/security",
      icon: <Lock strokeWidth={1.5} />,
      access: ["admin"],
    },
    {
      name: "Integrations",
      description: "Connect with third-party services and applications",
      href: "/settings/integrations",
      icon: <Server strokeWidth={1.5} />,
      access: ["admin"],
      isNew: true,
    },
    {
      name: "Data Management",
      description: "Manage data imports, exports, and retention policies",
      href: "/settings/data-management",
      icon: <Database strokeWidth={1.5} />,
      access: ["admin"],
    },
    {
      name: "Internationalization",
      description: "Configure language, date formats, and regional settings",
      href: "/settings/internationalization",
      icon: <Globe strokeWidth={1.5} />,
      access: ["admin", "hr_director"],
    },
    {
      name: "System Logs",
      description: "View system activity and audit trails",
      href: "/logs",
      icon: <FileText strokeWidth={1.5} />,
      access: ["admin"],
    },
  ];

  // Filter settings based on user role
  const filteredSettings = settingsCategories.filter((category) => {
    if (!category.access) return true;
    return category.access.includes(role || "") || role === "admin";
  });

  return (
    <PageLayout
      title="Settings"
      description="Configure system settings and preferences"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Settings" },
      ]}
    >
      <CardGrid columns={3}>
        {filteredSettings.map((category) => (
          <Card
            key={category.name}
            title={category.name}
            description={category.description}
            icon={category.icon}
            onClick={() => router.push(category.href)}
          >
            {category.isNew && (
              <span className="absolute top-4 right-4 bg-zinc-900 text-white text-xs px-2 py-0.5 rounded-full">
                NEW
              </span>
            )}
          </Card>
        ))}
      </CardGrid>

      {/* System Information Section */}
      <div className="mt-12 rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <Info className="h-5 w-5 mr-2 text-zinc-700" strokeWidth={1.5} />
          <h2 className="text-lg font-medium text-zinc-900">
            System Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-zinc-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-zinc-700 mb-3 flex items-center">
              <Settings className="h-4 w-4 mr-2" strokeWidth={1.5} />
              Application
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500">Version</span>
                <span className="text-sm font-medium">1.5.3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500">Environment</span>
                <span className="text-sm font-medium">Production</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500">Last Updated</span>
                <span className="text-sm font-medium">May 31, 2023</span>
              </div>
            </div>
          </div>
          <div className="border border-zinc-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-zinc-700 mb-3 flex items-center">
              <Database className="h-4 w-4 mr-2" strokeWidth={1.5} />
              Database
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500">Status</span>
                <span className="text-sm font-medium text-green-600">
                  Healthy
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500">Last Backup</span>
                <span className="text-sm font-medium">Today, 4:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500">Storage Used</span>
                <span className="text-sm font-medium">1.2 GB of 5 GB</span>
              </div>
            </div>
          </div>
          <div className="border border-zinc-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-zinc-700 mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2" strokeWidth={1.5} />
              Maintenance
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500">Next Scheduled</span>
                <span className="text-sm font-medium">Jun 15, 2023</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500">Downtime</span>
                <span className="text-sm font-medium">30 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500">Last Maintenance</span>
                <span className="text-sm font-medium">May 15, 2023</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
