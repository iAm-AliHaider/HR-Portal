import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  
  // Public pages that don't require authentication
  const publicPages = [
    '/login', 
    '/register', 
    '/forgot-password', 
    '/reset-password', 
    '/logout', 
    '/dev-entry',
    '/careers', 
    '/candidate',
    '/unauthorized',
    '/'
  ];
  
  // Skip auth for public pages, static assets, and API routes
  if (
    publicPages.some(page => url === page || url.startsWith(page + '/')) ||
    url.startsWith('/_next/') ||
    url.startsWith('/favicon.ico') ||
    url.startsWith('/public/') ||
    url.startsWith('/api/') ||
    url.includes('.')  // Skip files with extensions
  ) {
    return NextResponse.next();
  }
  
  // Always allow access in development mode or demo mode
  if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return NextResponse.next();
  }
  
  // Check for bypass parameters
  if (
    searchParams.get('bypass') === 'true' || 
    searchParams.get('mockBypass') === 'true'
  ) {
    return NextResponse.next();
  }
  
  // Production authentication logic
  try {
    // Handle specific protected routes
    const protectedRoutes = [
      '/dashboard',
      '/people',
      '/jobs',
      '/applications',
      '/interviews',
      '/offers',
      '/admin',
      '/reports',
      '/analytics',
      '/settings',
      '/employee',
      '/leave',
      '/loans',
      '/training',
      '/safety',
      '/facilities',
      '/expenses',
      '/compliance',
      '/recruitment',
      '/performance',
      '/payroll'
    ];
    
    // Check if this is a protected route
    const isProtectedRoute = protectedRoutes.some(route => 
      url.startsWith(route) || url === route
    );
    
    if (isProtectedRoute) {
      // In production without proper auth setup, redirect to login with return URL
      const returnUrl = encodeURIComponent(url + (request.nextUrl.search || ''));
      return NextResponse.redirect(new URL(`/login?returnUrl=${returnUrl}`, request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Fallback to login page with return URL
    const returnUrl = encodeURIComponent(url);
    return NextResponse.redirect(new URL(`/login?returnUrl=${returnUrl}`, request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public directory
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
} 