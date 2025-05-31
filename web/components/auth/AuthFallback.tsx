import React from "react";

import Link from "next/link";

import { Lock, User, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthFallbackProps {
  title?: string;
  message?: string;
  showLoginButton?: boolean;
}

export default function AuthFallback({
  title = "Authentication Required",
  message = "This page requires authentication to access all features.",
  showLoginButton = true,
}: AuthFallbackProps) {
  return (
    <div className="p-4 md:p-6 flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{message}</p>

          {showLoginButton && (
            <div className="space-y-3">
              <Link href="/login">
                <Button className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:underline"
                >
                  Register here
                </Link>
              </p>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-400">
              You can still browse public content without signing in.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
