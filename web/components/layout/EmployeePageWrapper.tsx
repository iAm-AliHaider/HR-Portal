import React from "react";

import ModernDashboardLayout from "./ModernDashboardLayout";

interface EmployeePageWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

/**
 * Employee Page Wrapper
 * Ensures proper layout for employee pages without double sidebar/header
 */
export const EmployeePageWrapper: React.FC<EmployeePageWrapperProps> = ({
  children,
  title = "Employee Portal",
  subtitle = "Access your employee information and services",
}) => {
  // Check if we're already inside a layout context
  const isInsideLayout =
    typeof window !== "undefined" &&
    document.querySelector('[data-layout="modern-dashboard"]');

  if (isInsideLayout) {
    // If already inside layout, just return children
    return <>{children}</>;
  }

  // Otherwise, wrap with layout
  return (
    <ModernDashboardLayout title={title} subtitle={subtitle}>
      {children}
    </ModernDashboardLayout>
  );
};

export default EmployeePageWrapper;
