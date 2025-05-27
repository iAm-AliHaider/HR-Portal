import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string | null;
  created_at: string;
}

export default function FixRolesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { user, role } = useAuth();
  const router = useRouter();

  // Only allow admin access
  useEffect(() => {
    if (user && role && role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, role, router]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, role, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        setMessage('Error fetching profiles: ' + error.message);
      } else {
        setProfiles(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setMessage('Unexpected error fetching profiles');
    } finally {
      setLoading(false);
    }
  };

  const fixRole = async (profileId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileId);

      if (error) {
        setMessage('Error updating role: ' + error.message);
      } else {
        setMessage(`Successfully updated role to ${newRole}`);
        fetchProfiles(); // Refresh the list
      }
    } catch (err) {
      console.error('Error updating role:', err);
      setMessage('Unexpected error updating role');
    }
  };

  const fixAllNullRoles = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'employee' })
        .is('role', null);

      if (error) {
        setMessage('Error fixing null roles: ' + error.message);
      } else {
        setMessage('Successfully fixed all null roles');
        fetchProfiles();
      }
    } catch (err) {
      console.error('Error fixing null roles:', err);
      setMessage('Unexpected error fixing null roles');
    }
  };

  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Head>
        <title>Fix User Roles - Admin Utility</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fix User Roles</h1>
              <p className="text-gray-600">Admin utility to check and fix user role assignments</p>
            </div>
            <button
              onClick={fixAllNullRoles}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Fix All Null Roles
            </button>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-md ${
              message.includes('Error') || message.includes('error') 
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading profiles...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {profiles.map((profile) => (
                    <tr key={profile.id} className={profile.role === null ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {profile.first_name} {profile.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{profile.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${profile.role === null ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                          {profile.role || 'NULL'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <select
                          onChange={(e) => e.target.value && fixRole(profile.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                          defaultValue=""
                        >
                          <option value="">Set Role...</option>
                          <option value="admin">Admin</option>
                          <option value="hr">HR</option>
                          <option value="manager">Manager</option>
                          <option value="recruiter">Recruiter</option>
                          <option value="employee">Employee</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-500">
            <p><strong>Total profiles:</strong> {profiles.length}</p>
            <p><strong>Profiles with null roles:</strong> {profiles.filter(p => p.role === null).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
