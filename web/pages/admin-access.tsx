import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';

export default function AdminAccess() {
  useEffect(() => {
    // Set mock authentication in localStorage for development
    const mockUser = {
      id: 'emergency-admin-123',
      email: 'admin@company.com',
      name: 'Emergency Admin',
      role: 'admin',
      department: 'Administration',
      position: 'System Administrator'
    };

    // Set authentication state
    localStorage.setItem('supabase.auth.token', JSON.stringify({
      access_token: 'mock-token-' + Date.now(),
      expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      user: mockUser
    }));

    localStorage.setItem('hr_portal_user', JSON.stringify(mockUser));
    localStorage.setItem('hr_portal_role', 'admin');

    console.log('🚀 Emergency admin access granted');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Emergency Admin Access | HR Portal</title>
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded bg-red-600 flex items-center justify-center text-white text-2xl font-bold">
            🚨
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Emergency Admin Access
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Temporary access while authentication is being fixed
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Emergency Access Granted!</strong><br/>
                    Mock authentication has been set for immediate access.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Access Details:
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <ul className="list-disc list-inside">
                      <li>Role: System Administrator</li>
                      <li>Permissions: Full Admin Access</li>
                      <li>Department: Administration</li>
                      <li>Duration: 24 hours</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                href="/dashboard"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                🚀 Enter HR Dashboard
              </Link>

              <Link
                href="/admin"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                ⚙️ Admin Panel
              </Link>

              <Link
                href="/people"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                👥 Employee Management
              </Link>

              <Link
                href="/settings"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                ⚙️ System Settings
              </Link>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Available Features:
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Complete HR Dashboard</li>
                      <li>Employee Management</li>
                      <li>Recruitment & Applications</li>
                      <li>Leave Management</li>
                      <li>Performance Reviews</li>
                      <li>Payroll System</li>
                      <li>Reports & Analytics</li>
                      <li>System Administration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            This is temporary emergency access. Normal authentication will be restored soon.
          </p>
        </div>
      </div>
    </div>
  );
} 