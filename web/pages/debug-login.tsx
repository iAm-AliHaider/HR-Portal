import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase/client";

export default function DebugLoginPage() {
  const [email, setEmail] = useState("admin@company.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const router = useRouter();
  const { user, signIn, role } = useAuth();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setDebugLogs(prev => [...prev, logMessage]);
  };

  useEffect(() => {
    addLog(`🔍 Debug login page loaded`);
    addLog(`📊 Initial auth state - User: ${user?.email || 'None'}, Role: ${role || 'None'}`);
  }, []);

  useEffect(() => {
    if (user) {
      addLog(`✅ User detected in useEffect: ${user.email}`);
      addLog(`🚀 Attempting navigation to /dashboard`);
      
      // Immediate navigation
      router.replace('/dashboard');
    }
  }, [user, router]);

  const handleTestLogin = async () => {
    setError(null);
    setLoading(true);
    addLog(`🔑 Starting login for: ${email}`);

    try {
      const result = await signIn(email, password);
      addLog(`📋 SignIn result: ${JSON.stringify(result)}`);
      
      if (result.success) {
        addLog(`✅ Login successful! Waiting for user state to update...`);
        
        // Check if user state updates
        let attempts = 0;
        const checkUserState = () => {
          attempts++;
          addLog(`🔍 Check #${attempts} - User state: ${user?.email || 'Still null'}`);
          
          if (user) {
            addLog(`✅ User state updated! Navigating...`);
            router.replace('/dashboard');
          } else if (attempts < 10) {
            setTimeout(checkUserState, 500);
          } else {
            addLog(`❌ User state never updated after 5 seconds`);
            addLog(`🚨 Force navigating to dashboard...`);
            router.replace('/dashboard');
          }
        };
        
        setTimeout(checkUserState, 100);
      } else {
        addLog(`❌ Login failed: ${result.error}`);
        setError(result.error || "Login failed");
      }
    } catch (err: any) {
      addLog(`❌ Login exception: ${err.message}`);
      setError("Login error occurred");
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setDebugLogs([]);
  };

  const resetAuthState = () => {
    addLog("🔄 Resetting authentication state...");
    
    // Clear all storage
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
      addLog("✅ Cleared localStorage and sessionStorage");
      
      // Sign out from Supabase
      supabase.auth.signOut().then(() => {
        addLog("✅ Signed out from Supabase");
        addLog("🔄 Reloading page in 2 seconds...");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }).catch((err) => {
        addLog(`❌ Sign out error: ${err.message}`);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Head>
        <title>Debug Login | HR Portal</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔧 Debug Login Page</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Login Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Login Test</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <button
                onClick={handleTestLogin}
                disabled={loading}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Testing Login..." : "🔑 Test Login"}
              </button>
              
              {error && (
                <div className="bg-red-50 border border-red-200 p-3 rounded text-red-700">
                  {error}
                </div>
              )}
            </div>
            
            {/* Current State */}
            <div className="mt-6 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold mb-2">Current Auth State:</h3>
              <p><strong>User:</strong> {user?.email || "Not logged in"}</p>
              <p><strong>Role:</strong> {role || "None"}</p>
              <p><strong>Name:</strong> {user?.name || "None"}</p>
            </div>
          </div>

          {/* Debug Logs */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Debug Logs</h2>
              <button
                onClick={clearLogs}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
              >
                Clear
              </button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {debugLogs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded text-sm font-mono ${
                    log.includes('❌') ? 'bg-red-50 text-red-700' :
                    log.includes('✅') ? 'bg-green-50 text-green-700' :
                    log.includes('🚀') ? 'bg-blue-50 text-blue-700' :
                    'bg-gray-50 text-gray-700'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Manual Navigation */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Manual Navigation Test</h2>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              🚀 router.push('/dashboard')
            </button>
            <button
              onClick={() => router.replace('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              🔄 router.replace('/dashboard')
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              🌐 window.location.href = '/dashboard'
            </button>
          </div>
        </div>

        {/* Auth State Reset */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🔧 Auth Troubleshooting</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              If you're experiencing navigation issues, this may be due to multiple GoTrue clients. 
              Use the reset button to clear all authentication state.
            </p>
            <button
              onClick={resetAuthState}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              🗑️ Reset Auth State & Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 