import React from "react";

import {
  PermissionResource,
  PermissionAction,
} from "../../../packages/types/src/hr";
import {
  usePermissions,
  hasAnyPermission,
  hasAllPermissions,
} from "../../hooks/usePermissions";

interface PermissionGuardProps {
  children: React.ReactNode;
  resource?: PermissionResource;
  action?: PermissionAction;
  permissions?: string[]; // Array of permission IDs
  requireAll?: boolean; // If true, user must have ALL permissions. If false, ANY permission is sufficient
  fallback?: React.ReactNode; // What to render if permission is denied
  loading?: React.ReactNode; // What to render while checking permissions
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  resource,
  action,
  permissions = [],
  requireAll = false,
  fallback = null,
  loading: loadingComponent = null,
}) => {
  const { hasPermission, userPermissions, loading } = usePermissions();

  // Show loading state while permissions are being fetched
  if (loading) {
    return loadingComponent ? <>{loadingComponent}</> : null;
  }

  // Check single permission (resource + action)
  if (resource && action) {
    const hasAccess = hasPermission(resource, action);
    return hasAccess ? <>{children}</> : <>{fallback}</>;
  }

  // Check multiple permissions
  if (permissions.length > 0) {
    const hasAccess = requireAll
      ? hasAllPermissions(userPermissions, permissions)
      : hasAnyPermission(userPermissions, permissions);

    return hasAccess ? <>{children}</> : <>{fallback}</>;
  }

  // If no permissions specified, show children by default
  return <>{children}</>;
};

// Higher-order component for permission-based access
export function withPermissions<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions: {
    resource?: PermissionResource;
    action?: PermissionAction;
    permissions?: string[];
    requireAll?: boolean;
  },
) {
  return function ProtectedComponent(props: P) {
    return (
      <PermissionGuard
        resource={requiredPermissions.resource}
        action={requiredPermissions.action}
        permissions={requiredPermissions.permissions}
        requireAll={requiredPermissions.requireAll}
        fallback={
          <div className="flex items-center justify-center p-8 text-gray-500">
            <div className="text-center">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m0 0v2m0-2h2m-2 0H10m9-7V9a7 7 0 00-14 0v1M5 10h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z"
                />
              </svg>
              <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
              <p>You don't have permission to access this feature.</p>
            </div>
          </div>
        }
      >
        <Component {...props} />
      </PermissionGuard>
    );
  };
}

// Component for showing different content based on permissions
interface ConditionalRenderProps {
  children: React.ReactNode;
  ifPermissions?: string[];
  ifResource?: PermissionResource;
  ifAction?: PermissionAction;
  requireAll?: boolean;
  else?: React.ReactNode;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  ifPermissions = [],
  ifResource,
  ifAction,
  requireAll = false,
  else: elseComponent = null,
}) => {
  const { hasPermission, userPermissions } = usePermissions();

  let hasAccess = true;

  if (ifResource && ifAction) {
    hasAccess = hasPermission(ifResource, ifAction);
  } else if (ifPermissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(userPermissions, ifPermissions)
      : hasAnyPermission(userPermissions, ifPermissions);
  }

  return hasAccess ? <>{children}</> : <>{elseComponent}</>;
};

// Button component with permission checking
interface PermissionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  resource?: PermissionResource;
  action?: PermissionAction;
  permissions?: string[];
  requireAll?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export const PermissionButton: React.FC<PermissionButtonProps> = ({
  resource,
  action,
  permissions = [],
  requireAll = false,
  children,
  className = "",
  variant = "primary",
  disabled,
  ...props
}) => {
  const { hasPermission, userPermissions } = usePermissions();

  let hasAccess = true;

  if (resource && action) {
    hasAccess = hasPermission(resource, action);
  } else if (permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(userPermissions, permissions)
      : hasAnyPermission(userPermissions, permissions);
  }

  const baseClasses =
    "inline-flex items-center px-4 py-2 border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

  const variantClasses = {
    primary:
      "border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500",
    danger:
      "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
    ghost:
      "border-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
  };

  if (!hasAccess) {
    return null; // Don't render the button if no permission
  }

  return (
    <button
      {...props}
      disabled={disabled || !hasAccess}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Link component with permission checking
interface PermissionLinkProps {
  href: string;
  resource?: PermissionResource;
  action?: PermissionAction;
  permissions?: string[];
  requireAll?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const PermissionLink: React.FC<PermissionLinkProps> = ({
  href,
  resource,
  action,
  permissions = [],
  requireAll = false,
  children,
  className = "",
}) => {
  const { hasPermission, userPermissions } = usePermissions();

  let hasAccess = true;

  if (resource && action) {
    hasAccess = hasPermission(resource, action);
  } else if (permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(userPermissions, permissions)
      : hasAnyPermission(userPermissions, permissions);
  }

  if (!hasAccess) {
    return null; // Don't render the link if no permission
  }

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
};
