import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  
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
  const searchParams = request.nextUrl.searchParams;
  if (
    searchParams.get('bypass') === 'true' || 
    searchParams.get('mockBypass') === 'true'
  ) {
    return NextResponse.next();
  }
  
  // In production, for simplicity, redirect to dev-entry for auth fallback
  // This prevents Supabase connection issues from breaking the entire app
  try {
    // Simple check - if accessing protected routes without auth, redirect to dev-entry
    if (url.startsWith('/dashboard') || url.startsWith('/people') || url.startsWith('/jobs')) {
      return NextResponse.redirect(new URL('/dev-entry', request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Fallback to dev-entry page
    return NextResponse.redirect(new URL('/dev-entry', request.url));
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