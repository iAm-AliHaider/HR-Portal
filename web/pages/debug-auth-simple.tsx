import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";

export default function DebugAuthSimple() {
  const [status, setStatus] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const addStatus = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setStatus((prev) => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[DEBUG AUTH] ${message}`);
  };

  useEffect(() => {
    const testAuth = async () => {
      addStatus("🔍 Starting simple auth debug...");

      try {
        // Test 1: Check if Supabase client is working
        addStatus("📡 Testing Supabase client connection...");
        const { data, error } = await supabase
          .from("profiles")
          .select("count")
          .limit(1);

        if (error) {
          addStatus(`❌ Client connection failed: ${error.message}`);
        } else {
          addStatus("✅ Client connection successful");
        }

        // Test 2: Check current session
        addStatus("👤 Checking current session...");
        const { data: session, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          addStatus(`❌ Session check failed: ${sessionError.message}`);
        } else if (session.session) {
          addStatus(
            `✅ Active session found for: ${session.session.user?.email}`,
          );
        } else {
          addStatus("ℹ️ No active session");
        }

        // Test 3: Check auth state listener
        addStatus("👂 Setting up auth state listener...");
        const { data: listener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            addStatus(`🔄 Auth state changed: ${event}`);
            if (session) {
              addStatus(`👤 User: ${session.user?.email}`);
            }
          },
        );

        // Test 4: Test login
        addStatus("🔐 Testing login with admin credentials...");
        const { data: loginData, error: loginError } =
          await supabase.auth.signInWithPassword({
            email: "admin@company.com",
            password: "admin123",
          });

        if (loginError) {
          addStatus(`❌ Login failed: ${loginError.message}`);
        } else {
          addStatus(`✅ Login successful for: ${loginData.user?.email}`);
        }

        // Cleanup
        setTimeout(() => {
          listener.subscription.unsubscribe();
          addStatus("🧹 Cleaned up auth listener");
        }, 5000);
      } catch (error: any) {
        addStatus(`💥 Unexpected error: ${error.message}`);
      } finally {
        setLoading(false);
        addStatus("🏁 Simple auth debug completed");
      }
    };

    testAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Simple Auth Debug
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Debug Log
          </h2>

          {loading && (
            <div className="flex items-center text-blue-600 mb-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Running auth tests...
            </div>
          )}

          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
            {status.map((msg, index) => (
              <div key={index} className="mb-1">
                {msg}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            <strong>What this test does:</strong>
            <ul className="list-disc ml-4 mt-2">
              <li>Tests basic Supabase client connection</li>
              <li>Checks for existing auth session</li>
              <li>Tests auth state listener setup</li>
              <li>Attempts login with admin credentials</li>
              <li>Monitors for multiple client instances</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
