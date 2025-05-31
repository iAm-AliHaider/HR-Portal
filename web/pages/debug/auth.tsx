import React, { useState, useEffect } from "react";

import Head from "next/head";

import { GetServerSideProps } from "next";

import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase/client";

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default function AuthDebugPage() {
  const { user, role, loading, error } = useAuth();
  const [sessionData, setSessionData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [authUserData, setAuthUserData] = useState<any>(null);
  const [debugLoading, setDebugLoading] = useState(true);

  useEffect(() => {
    const fetchDebugData = async () => {
      try {
        // Get current session
        const { data: session, error: sessionError } =
          await supabase.auth.getSession();
        setSessionData({ data: session, error: sessionError });

        // Get auth user
        const { data: authUser, error: authUserError } =
          await supabase.auth.getUser();
        setAuthUserData({ data: authUser, error: authUserError });

        // If we have a user, get their profile
        if (authUser.user) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authUser.user.id)
            .single();
          setProfileData({ data: profile, error: profileError });
        }
      } catch (err) {
        console.error("Debug fetch error:", err);
      } finally {
        setDebugLoading(false);
      }
    };

    fetchDebugData();
  }, []);

  const handleManualSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Manual sign out error:", error);
      } else {
        console.log("Manual sign out successful");
        window.location.reload();
      }
    } catch (err) {
      console.error("Manual sign out exception:", err);
    }
  };

  const handleClearStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log("Storage cleared");
      window.location.reload();
    } catch (err) {
      console.error("Storage clear error:", err);
    }
  };

  const handleTestRoleUpdate = async () => {
    if (!authUserData?.data?.user?.id) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", authUserData.data.user.id);

      if (error) {
        console.error("Role update error:", error);
      } else {
        console.log("Role updated to admin");
        window.location.reload();
      }
    } catch (err) {
      console.error("Role update exception:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Head>
        <title>Authentication Debug - HR Portal</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Authentication Debug
          </h1>

          <div className="space-y-6">
            {/* Current Auth State */}
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">
                Current Auth State (useAuth hook)
              </h2>
              <div className="space-y-2">
                <p>
                  <strong>Loading:</strong> {loading ? "true" : "false"}
                </p>
                <p>
                  <strong>Error:</strong> {error || "none"}
                </p>
                <p>
                  <strong>User:</strong>{" "}
                  {user ? JSON.stringify(user, null, 2) : "null"}
                </p>
                <p>
                  <strong>Role:</strong> {role || "null"}
                </p>
              </div>
            </div>

            {/* Session Data */}
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Supabase Session</h2>
              {debugLoading ? (
                <p>Loading...</p>
              ) : (
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(sessionData, null, 2)}
                </pre>
              )}
            </div>

            {/* Auth User Data */}
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Auth User Data</h2>
              {debugLoading ? (
                <p>Loading...</p>
              ) : (
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(authUserData, null, 2)}
                </pre>
              )}
            </div>

            {/* Profile Data */}
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Profile Data</h2>
              {debugLoading ? (
                <p>Loading...</p>
              ) : (
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(profileData, null, 2)}
                </pre>
              )}
            </div>

            {/* Debug Actions */}
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Debug Actions</h2>
              <div className="space-x-4">
                <button
                  onClick={handleManualSignOut}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Manual Sign Out
                </button>
                <button
                  onClick={handleClearStorage}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
                >
                  Clear Storage
                </button>
                <button
                  onClick={handleTestRoleUpdate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  disabled={!authUserData?.data?.user?.id}
                >
                  Set Role to Admin
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Reload Page
                </button>
              </div>
            </div>

            {/* Environment Info */}
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Environment Info</h2>
              <div className="space-y-2">
                <p>
                  <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
                </p>
                <p>
                  <strong>Supabase URL:</strong>{" "}
                  {process.env.NEXT_PUBLIC_SUPABASE_URL}
                </p>
                <p>
                  <strong>Anon Key:</strong>{" "}
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                    ? "Present"
                    : "Missing"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
