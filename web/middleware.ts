import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/login",
  "/register",
  "/careers",
  "/forgot-password",
  "/api/auth",
  "/debug",
];

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/people",
  "/jobs",
  "/leave",
  "/assets",
  "/requests",
  "/settings",
  "/admin",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all routes in development mode for testing
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // Allow public routes and API routes
  if (
    isPublicRoute ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isProtectedRoute) {
    // Check for authentication token in cookies
    const token = request.cookies.get("supabase-auth-token");

    if (!token) {
      // Redirect to login with return URL
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
