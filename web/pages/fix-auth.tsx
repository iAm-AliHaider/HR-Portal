import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function FixAuthPage() {
  const router = useRouter();
  const { user, role, loading, error } = useAuth();
  const [fixes, setFixes] = useState<string[]>([]);

  const applyFixes = () => {
    const newFixes = [];

    // Clear localStorage auth data
    if (typeof window !== "undefined") {
      localStorage.removeItem("mockUserEmail");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      newFixes.push("Cleared localStorage auth data");
    }

    // Set demo user
    localStorage.setItem("mockUserEmail", "admin@company.com");
    newFixes.push("Set demo admin user");

    setFixes(newFixes);

    // Reload page after 2 seconds
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span>Authentication Fix</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            <p className="mb-2">Current Status:</p>
            <ul className="space-y-1">
              <li>• Loading: {loading ? "Yes" : "No"}</li>
              <li>• User: {user ? user.email : "None"}</li>
              <li>• Role: {role || "None"}</li>
              <li>• Error: {error || "None"}</li>
            </ul>
          </div>

          {fixes.length > 0 && (
            <div className="border rounded-lg p-3 bg-green-50">
              <h4 className="font-medium text-green-800 mb-2">
                Fixes Applied:
              </h4>
              <ul className="text-sm space-y-1">
                {fixes.map((fix, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>{fix}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <Button
              onClick={applyFixes}
              className="w-full"
              disabled={fixes.length > 0}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Fix Authentication Issues
            </Button>

            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
