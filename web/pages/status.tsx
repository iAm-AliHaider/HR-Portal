import Link from "next/link";
import { useEffect, useState } from "react";

const StatusPage = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch("/api/health-new");
        if (response.ok) {
          const data = await response.json();
          setHealthData(data);
        } else {
          setError("Health check failed");
        }
      } catch (err) {
        setError("Failed to fetch health data");
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            System Status
          </h1>
          <p className="text-gray-600">
            Real-time status of HR Portal services
          </p>
          <div className="mt-4">
            <Link
              href="/dashboard-modern"
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading system status...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {healthData && (
          <div className="space-y-6">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Overall Status
                </h2>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    healthData.status === "healthy"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {healthData.status?.toUpperCase()}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Environment</p>
                  <p className="font-medium">{healthData.environment}</p>
                </div>
                <div>
                  <p className="text-gray-500">Uptime</p>
                  <p className="font-medium">
                    {Math.floor(healthData.uptime / 60)} minutes
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Last Check</p>
                  <p className="font-medium">
                    {new Date(healthData.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Version</p>
                  <p className="font-medium">1.0.0</p>
                </div>
              </div>
            </div>

            {/* Services Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Services
              </h2>
              <div className="space-y-3">
                {Object.entries(healthData.services || {}).map(
                  ([service, status]) => (
                    <div
                      key={service}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium capitalize">{service}</span>
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          status === "running" ||
                          status === "active" ||
                          status === "available"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {String(status).toUpperCase()}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Database Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Database
              </h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Connection Status</span>
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      healthData.database?.status === "connected"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {healthData.database?.status?.toUpperCase()}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {healthData.database?.message}
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Access
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/dashboard-modern"
                  className="p-3 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="text-blue-600 font-medium">Dashboard</div>
                </Link>
                <Link
                  href="/people-modern"
                  className="p-3 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <div className="text-green-600 font-medium">People</div>
                </Link>
                <Link
                  href="/jobs-modern"
                  className="p-3 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <div className="text-purple-600 font-medium">Jobs</div>
                </Link>
                <Link
                  href="/leave-modern"
                  className="p-3 text-center bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
                >
                  <div className="text-yellow-600 font-medium">Leave</div>
                </Link>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPage;
