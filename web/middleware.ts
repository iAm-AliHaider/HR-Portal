import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
 
export async function middleware(request: NextRequest) {
  // Public pages that don't require authentication
  const publicPages = ['/login', '/register', '/forgot-password', '/reset-password', '/logout', '/dev-entry'];
  const url = request.nextUrl.pathname;
  
  // Skip auth for public pages, static assets, and API routes
  if (
    publicPages.some(page => url === page || url.startsWith(page + '/')) ||
    url.startsWith('/_next/') ||
    url.startsWith('/favicon.ico') ||
    url.startsWith('/public/')
  ) {
    return NextResponse.next();
  }
  
  // Check for bypass parameter or mock parameters (fallback auth)
  const searchParams = request.nextUrl.searchParams;
  if (
    searchParams.get('bypass') === 'true' || 
    searchParams.get('mockBypass') === 'true'
  ) {
    return NextResponse.next();
  }
  
  // Always bypass auth in development mode
  if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return NextResponse.next();
  }

  try {
    // Create a response to modify
    const res = NextResponse.next();
    
    // Create the Supabase middleware client
    const supabase = createMiddlewareClient({ req: request, res });
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    // If no session, redirect to login
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', url);
      return NextResponse.redirect(loginUrl);
    }
    
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    
    // In case of error, redirect to dev-entry page instead of login
    // This provides a more reliable fallback in production
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