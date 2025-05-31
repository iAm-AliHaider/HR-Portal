import { useRouter } from "next/router";

import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Database,
    FileText,
    Server,
    Settings,
    Shield,
    Users
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
        </CardGrid>
      </PageLayout>
    </DebugLayout>
  );
}
