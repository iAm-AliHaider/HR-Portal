import { useRouter } from "next/router";

import {
  Activity,
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  Database,
  FileText,
  Server,
  Settings,
  Shield,
  Users,
} from "lucide-react";

import { Card, CardGrid, PageLayout } from "@/components/layout/PageLayout";

import DebugLayout from "./_layout";

export default function DebugPage() {
  const router = useRouter();

  return (
    <DebugLayout>
      <PageLayout
        title="Debug & Diagnostics"
        description="Tools and utilities for debugging and testing the application"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Debug", href: "/debug" },
        ]}
      >
        <CardGrid columns={3}>
          <Card
            title="Supabase Admin"
            description="Manage database connections, view tables, and upload data"
            icon={<Server className="h-8 w-8" strokeWidth={1.5} />}
            onClick={() => router.push("/debug/supabase-admin")}
          />

          <Card
            title="Authentication"
            description="Test and debug authentication flows"
            icon={<Shield className="h-8 w-8" strokeWidth={1.5} />}
            onClick={() => router.push("/debug/auth")}
          />

          <Card
            title="Supabase Tests"
            description="Test all Supabase connections and functionality"
            icon={<Database className="h-8 w-8" strokeWidth={1.5} />}
            onClick={() => router.push("/debug/supabase-test")}
          />

          <Card
            title="User Management"
            description="View and manage test users"
            icon={<Users className="h-8 w-8" strokeWidth={1.5} />}
            onClick={() => router.push("/debug/users")}
          />

          <Card
            title="System Status"
            description="View system health and status"
            icon={<Activity className="h-8 w-8" strokeWidth={1.5} />}
            onClick={() => router.push("/debug/status")}
          />

          <Card
            title="Configuration"
            description="View and test application configuration"
            icon={<Settings className="h-8 w-8" strokeWidth={1.5} />}
            onClick={() => router.push("/debug/config")}
          />

          <Card
            title="Production Wizard"
            description="Step-by-step production configuration wizard"
            icon={<CheckCircle2 className="h-8 w-8" strokeWidth={1.5} />}
            onClick={() => router.push("/debug/production-wizard")}
          />

          <Card
            title="Production Check"
            description="Validate production readiness and configuration"
            icon={<AlertTriangle className="h-8 w-8" strokeWidth={1.5} />}
            onClick={() => router.push("/debug/production-check")}
          />

          <Card
            title="Logs"
            description="View application logs and events"
            icon={<FileText className="h-8 w-8" strokeWidth={1.5} />}
            onClick={() => router.push("/logs")}
          />

          <Card
            title="Quick System Status"
            description="Check the overall health of the system - includes database and API monitoring"
            icon={<Activity className="h-8 w-8" strokeWidth={1.5} />}
            onClick={() => router.push("/debug/status")}
          />
        </CardGrid>

        {/* Additional status link for testing */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
          <a
            href="/debug/status"
            data-testid="debug-status-link"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            View System Status
          </a>
        </div>
      </PageLayout>
    </DebugLayout>
  );
}
