import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function TestAuth() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[AUTH TEST] ${message}`);
  };

  const { user, role, loading, error, signIn, signOut } = useAuth();

  useEffect(() => {
    addLog("TestAuth component mounted");
    addLog(
      `Initial state - loading: ${loading}, user: ${user?.email || "null"}, role: ${role}, error: ${error}`,
    );
  }, []);

  useEffect(() => {
    addLog(
      `Auth state changed - loading: ${loading}, user: ${user?.email || "null"}, role: ${role}, error: ${error}`,
    );
  }, [user, role, loading, error]);

  const testLogin = async () => {
    addLog("Starting test login...");
    try {
      const result = await signIn("admin@company.com", "admin123");
      addLog(`Login result: ${JSON.stringify(result)}`);
    } catch (err) {
      addLog(`Login error: ${err}`);
    }
  };

  const testLogout = async () => {
    addLog("Starting test logout...");
    try {
      await signOut();
      addLog("Logout completed");
    } catch (err) {
      addLog(`Logout error: ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Auth Hook Debug Test</h1>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Auth State</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Loading:</strong> {loading ? "true" : "false"}
            </div>
            <div>
              <strong>User:</strong> {user?.email || "null"}
            </div>
            <div>
              <strong>Role:</strong> {role || "null"}
            </div>
            <div>
              <strong>Error:</strong> {error || "null"}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-x-4">
            <button
              onClick={testLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              Test Login (admin@company.com)
            </button>
            <button
              onClick={testLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={loading}
            >
              Test Logout
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
