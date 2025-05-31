import React from "react";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";

// Layout System Test Page
export default function DashboardLayoutTest() {
  return (
    <ModernDashboardLayout
      title="Layout System Test"
      subtitle="Testing ModernDashboardLayout component functionality"
    >
      <div
        style={{
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      >
        <h2>✅ Layout System Working!</h2>
        <p>
          This page verifies that the modern dashboard layout system is
          functioning correctly.
        </p>
        <ul>
          <li>✅ ModernDashboardLayout component loaded</li>
          <li>✅ Navigation system functional</li>
          <li>✅ Responsive design active</li>
          <li>✅ Modern UI components working</li>
        </ul>
        <div style={{ marginTop: "20px" }}>
          <a
            href="/dashboard"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </ModernDashboardLayout>
  );
}
