/**
 * Redirect utilities for the HR Portal application
 * Centralizes all redirect logic to ensure consistency
 */

import { NextRouter } from "next/router";

export type UserRole =
  | "admin"
  | "hr"
  | "manager"
  | "employee"
  | "candidate"
  | "recruiter"
  | string;

/**
 * Get the default dashboard path based on user role
 */
export function getDefaultDashboardPath(role?: UserRole | null): string {
  if (!role) return "/dashboard";

  switch (role.toLowerCase()) {
    case "admin":
    case "hr":
    case "hr_director":
    case "hr_manager":
    case "manager":
    case "team_lead":
    case "recruiter":
    case "recruiting_manager":
      return "/dashboard";

    case "employee":
      return "/employee/dashboard";

    case "candidate":
      return "/candidate/dashboard";

    default:
      return "/dashboard";
  }
}

/**
 * Get the login path with return URL
 */
export function getLoginPath(returnUrl?: string): string {
  if (returnUrl && returnUrl.startsWith("/") && returnUrl !== "/login") {
    return `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  }
  return "/login";
}

/**
 * Get the careers/public path for unauthenticated users
 */
export function getPublicPath(): string {
  return "/careers";
}

/**
 * Check if a path is public (doesn't require authentication)
 */
export function isPublicPath(path: string): boolean {
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/logout",
    "/dev-entry",
    "/careers",
    "/candidate",
    "/unauthorized",
  ];

  const publicPathPrefixes = [
    "/careers/",
    "/candidate/",
    "/api/",
    "/_next/",
    "/public/",
  ];

  // Check exact matches
  if (publicPaths.includes(path)) {
    return true;
  }

  // Check prefix matches
  return publicPathPrefixes.some((prefix) => path.startsWith(prefix));
}

/**
 * Check if a path requires authentication
 */
export function requiresAuth(path: string): boolean {
  return !isPublicPath(path) && !path.includes(".");
}

/**
 * Get the appropriate redirect path for a user after login
 */
export function getPostLoginRedirect(
  user: any,
  role?: UserRole | null,
  returnUrl?: string,
): string {
  // If there's a specific return URL, use it
  if (returnUrl && returnUrl.startsWith("/") && returnUrl !== "/login") {
    return decodeURIComponent(returnUrl);
  }

  // Otherwise, use role-based default
  return getDefaultDashboardPath(role);
}

/**
 * Handle redirect after successful login
 */
export async function handlePostLoginRedirect(
  router: NextRouter,
  user: any,
  role?: UserRole | null,
  returnUrl?: string,
): Promise<void> {
  const redirectPath = getPostLoginRedirect(user, role, returnUrl);
  await router.replace(redirectPath);
}

/**
 * Handle redirect for unauthenticated users
 */
export async function handleUnauthenticatedRedirect(
  router: NextRouter,
  currentPath?: string,
): Promise<void> {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (isDevelopment) {
    await router.replace("/dev-entry");
  } else if (currentPath && requiresAuth(currentPath)) {
    await router.replace(getLoginPath(currentPath));
  } else {
    await router.replace(getPublicPath());
  }
}

/**
 * Handle unauthorized access (user logged in but lacks permission)
 */
export async function handleUnauthorizedAccess(
  router: NextRouter,
  requiredRole?: string,
): Promise<void> {
  await router.replace("/unauthorized");
}

/**
 * Redirect to appropriate page based on user state
 */
export async function redirectBasedOnAuth(
  router: NextRouter,
  user: any,
  role?: UserRole | null,
  currentPath?: string,
  loading?: boolean,
): Promise<void> {
  if (loading) return;

  const returnUrl = router.query.returnUrl as string;

  if (user) {
    // User is authenticated
    if (currentPath === "/login" || currentPath === "/") {
      await handlePostLoginRedirect(router, user, role, returnUrl);
    }
    // If on a valid page, stay there
  } else {
    // User is not authenticated
    if (currentPath && requiresAuth(currentPath)) {
      await handleUnauthenticatedRedirect(router, currentPath);
    } else if (currentPath === "/") {
      await handleUnauthenticatedRedirect(router);
    }
  }
}

/**
 * Get breadcrumb path for a given route
 */
export function getBreadcrumbPath(
  path: string,
): Array<{ label: string; href: string }> {
  const segments = path.split("/").filter(Boolean);
  const breadcrumbs: Array<{ label: string; href: string }> = [
    { label: "Home", href: "/" },
  ];

  let currentPath = "";

  for (const segment of segments) {
    currentPath += `/${segment}`;

    // Convert segment to readable label
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumbs.push({
      label,
      href: currentPath,
    });
  }

  return breadcrumbs;
}

/**
 * Check if current user has permission for a specific role
 */
export function hasRole(
  userRole?: string | null,
  requiredRole?: string | string[],
): boolean {
  if (!userRole || !requiredRole) return false;

  const normalizedUserRole = userRole.toLowerCase();

  if (Array.isArray(requiredRole)) {
    return requiredRole.some(
      (role) => role.toLowerCase() === normalizedUserRole,
    );
  }

  return requiredRole.toLowerCase() === normalizedUserRole;
}

/**
 * Check if current user has admin privileges
 */
export function isAdmin(userRole?: string | null): boolean {
  return hasRole(userRole, ["admin", "hr_director"]);
}

/**
 * Check if current user has HR privileges
 */
export function isHR(userRole?: string | null): boolean {
  return hasRole(userRole, ["admin", "hr", "hr_director", "hr_manager"]);
}

/**
 * Check if current user has manager privileges
 */
export function isManager(userRole?: string | null): boolean {
  return hasRole(userRole, [
    "admin",
    "hr",
    "hr_director",
    "hr_manager",
    "manager",
    "team_lead",
  ]);
}
