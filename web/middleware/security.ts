import { NextResponse } from "next/server";

export const securityHeaders = () => {
  const res = NextResponse.next();
  res.headers.set("Content-Security-Policy", "default-src 'self'");
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains",
  );
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  return res;
};
