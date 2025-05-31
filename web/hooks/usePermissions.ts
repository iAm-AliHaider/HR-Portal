import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { permissionService } from "../services/permissionService";
import {
  Permission,
  PermissionResource,
  PermissionAction,
  PermissionContext,
} from "../../packages/types/src/hr";

interface UsePermissionsReturn {
  hasPermission: (
    resource: PermissionResource,
    action: PermissionAction,
    resourceId?: string,
  ) => boolean;
  checkPermission: (
    resource: PermissionResource,
    action: PermissionAction,
    resourceId?: string,
  ) => Promise<boolean>;
  userPermissions: Permission[];
  loading: boolean;
  error: string | null;
  refreshPermissions: () => Promise<void>;
}

export function usePermissions(): UsePermissionsReturn {
  const { user, role } = useAuth();
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [permissionCache, setPermissionCache] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDevelopment = process.env.NODE_ENV === "development";

  // Load user permissions on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      loadUserPermissions();
    } else {
      setUserPermissions([]);
      setPermissionCache({});
      setLoading(false);
    }
  }, [user?.id]);

  const loadUserPermissions = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const permissions = await permissionService.getUserPermissions(user.id);
      setUserPermissions(permissions);
    } catch (err) {
      setError("Failed to load user permissions");
      console.error("Error loading permissions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Development mode: admin roles should have all permissions
  const hasAdminPermissionInDevMode = useCallback(
    (resource: string, action: string): boolean => {
      if (!isDevelopment) return false;

      // Admin and director roles have all permissions in dev mode
      if (role === "admin" || role === "hr_director") {
        return true;
      }

      // HR roles have HR-related permissions in dev mode
      if (
        (role === "hr" || role === "hr_manager") &&
        (resource.includes("employee") ||
          resource.includes("hr") ||
          resource.includes("user") ||
          resource.includes("workflow"))
      ) {
        return true;
      }

      // Managers have team and workflow permissions in dev mode
      if (
        role === "manager" &&
        (resource.includes("team") ||
          resource.includes("approval") ||
          resource.includes("workflow"))
      ) {
        return true;
      }

      return false;
    },
    [isDevelopment, role],
  );

  // Synchronous permission check using cached permissions
  const hasPermission = useCallback(
    (
      resource: PermissionResource,
      action: PermissionAction,
      resourceId?: string,
    ): boolean => {
      if (!user?.id) return false;

      // Development mode permission checks take precedence
      if (isDevelopment && hasAdminPermissionInDevMode(resource, action)) {
        return true;
      }

      const permissionKey = `${resource}.${action}`;

      // Check cache first
      if (permissionCache[permissionKey] !== undefined) {
        return permissionCache[permissionKey];
      }

      // Check direct permission
      const hasDirectPermission = userPermissions.some(
        (p) => p.id === permissionKey,
      );

      if (hasDirectPermission) {
        setPermissionCache((prev) => ({ ...prev, [permissionKey]: true }));
        return true;
      }

      // Check wildcard permissions
      const hasWildcardPermission = userPermissions.some((p) => {
        const [pResource, pAction] = p.id.split(".");
        return (
          (pResource === "*" && pAction === action) ||
          (pResource === resource && pAction === "*") ||
          (pResource === "*" && pAction === "*")
        );
      });

      const result = hasWildcardPermission;
      setPermissionCache((prev) => ({ ...prev, [permissionKey]: result }));
      return result;
    },
    [
      user?.id,
      userPermissions,
      permissionCache,
      isDevelopment,
      hasAdminPermissionInDevMode,
    ],
  );

  // Asynchronous permission check with full context
  const checkPermission = useCallback(
    async (
      resource: PermissionResource,
      action: PermissionAction,
      resourceId?: string,
    ): Promise<boolean> => {
      if (!user?.id) return false;

      // Development mode permission checks take precedence
      if (isDevelopment && hasAdminPermissionInDevMode(resource, action)) {
        return true;
      }

      const context: PermissionContext = {
        user_id: user.id,
        resource,
        action,
        resource_id: resourceId,
      };

      try {
        const result = await permissionService.hasPermission(context);
        return result.allowed;
      } catch (err) {
        console.error("Permission check error:", err);
        return false;
      }
    },
    [user?.id, isDevelopment, hasAdminPermissionInDevMode],
  );

  const refreshPermissions = useCallback(async () => {
    setPermissionCache({}); // Clear cache
    await loadUserPermissions();
  }, [user?.id]);

  return {
    hasPermission,
    checkPermission,
    userPermissions,
    loading,
    error,
    refreshPermissions,
  };
}

// Hook for checking multiple permissions at once
export function useMultiplePermissions(
  checks: Array<{ resource: PermissionResource; action: PermissionAction }>,
): Record<string, boolean> {
  const { hasPermission } = usePermissions();
  const [results, setResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const newResults: Record<string, boolean> = {};

    checks.forEach(({ resource, action }) => {
      const key = `${resource}.${action}`;
      newResults[key] = hasPermission(resource, action);
    });

    setResults(newResults);
  }, [checks, hasPermission]);

  return results;
}

// Hook for admin-only access
export function useAdminAccess(): { isAdmin: boolean; loading: boolean } {
  const { hasPermission, loading } = usePermissions();

  const isAdmin =
    hasPermission("system_settings", "update") ||
    hasPermission("user_permissions", "manage_settings");

  return { isAdmin, loading };
}

// Component wrapper for permission-based rendering
export function hasAnyPermission(
  userPermissions: Permission[],
  requiredPermissions: string[],
): boolean {
  return requiredPermissions.some((required) =>
    userPermissions.some((p) => p.id === required),
  );
}

export function hasAllPermissions(
  userPermissions: Permission[],
  requiredPermissions: string[],
): boolean {
  return requiredPermissions.every((required) =>
    userPermissions.some((p) => p.id === required),
  );
}
