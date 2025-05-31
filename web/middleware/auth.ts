import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Development mode fallback - skip auth in development
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Redirect unauthenticated users
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Verify tenant access
    try {
      const { data: user } = await supabase
        .from("profiles")
        .select("tenant_id")
        .eq("id", session.user.id)
        .single();

      if (!user) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // Store tenant ID in headers for downstream use
      req.headers.set("x-tenant-id", user.tenant_id);
      return res;
    } catch (error) {
      console.error("Authentication middleware error:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch (error) {
    console.error("Supabase client error:", error);
    // In case of any errors with Supabase, we'll allow access in development
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
