import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';
import SimpleDashboardLayout from '@/components/layout/SimpleDashboardLayout';
import { supabase } from '../../lib/supabase/client';

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  raw_user_meta_data?: any;
  email_confirmed_at?: string;
}

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  department?: string;
  position?: string;
  created_at: string;
}

interface UnlinkedUser {
  auth_user: AuthUser;
  profile: Profile | null;
}

export default function UserManagementPage() {
  const { user, role } = useAuth();
  const router = useRouter();
  const [unlinkedUsers, setUnlinkedUsers] = useState<UnlinkedUser[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [linkingMode, setLinkingMode] = useState<{ userId: string; mode: 'create' | 'link' } | null>(null);
  const [linkForm, setLinkForm] = useState({
    firstName: '',
    lastName: '',
    role: 'employee',
    department: '',
    position: '',
    existingProfileId: ''
  });

  // Ensure admin access
  useEffect(() => {
    if (role !== 'admin') {
      router.push('/dashboard');
    }
  }, [role, router]);

  // Load data
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // In development mode, simulate data
      if (process.env.NODE_ENV === 'development') {
        // Mock unlinked users
        const mockUnlinkedUsers: UnlinkedUser[] = [
          {
            auth_user: {
              id: 'auth-user-1',
              email: 'newuser@example.com',
              created_at: new Date().toISOString(),
              raw_user_meta_data: { full_name: 'New User' },
              email_confirmed_at: new Date().toISOString()
            },
            profile: null
          },
          {
            auth_user: {
              id: 'auth-user-2',
              email: 'candidate@example.com',
              created_at: new Date().toISOString(),
              raw_user_meta_data: { full_name: 'John Candidate' },
              email_confirmed_at: new Date().toISOString()
            },
            profile: null
          }
        ];

        // Mock profiles
        const mockProfiles: Profile[] = [
          {
            id: 'profile-1',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@company.com',
            role: 'employee',
            department: 'Engineering',
            position: 'Developer',
            created_at: new Date().toISOString()
          },
          {
            id: 'profile-2',
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@company.com',
            role: 'manager',
            department: 'HR',
            position: 'HR Manager',
            created_at: new Date().toISOString()
          }
        ];

        setUnlinkedUsers(mockUnlinkedUsers);
        setProfiles(mockProfiles);
        setLoading(false);
        return;
      }

      // Production mode - load from Supabase
      // This would require admin access to auth.users table
      // For now, we'll use a simplified approach with profiles table only
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error loading profiles:', profilesError);
      } else {
        setProfiles(profilesData || []);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (userId: string) => {
    setProcessing(userId);
    try {
      const response = await fetch('/api/admin/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          firstName: linkForm.firstName,
          lastName: linkForm.lastName,
          role: linkForm.role,
          department: linkForm.department,
          position: linkForm.position
        })
      });

      if (response.ok) {
        alert('Profile created successfully!');
        loadUserData();
        setLinkingMode(null);
        resetLinkForm();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Failed to create profile');
    } finally {
      setProcessing(null);
    }
  };

  const handleLinkProfile = async (userId: string) => {
    setProcessing(userId);
    try {
      const response = await fetch('/api/admin/link-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          profileId: linkForm.existingProfileId
        })
      });

      if (response.ok) {
        alert('Profile linked successfully!');
        loadUserData();
        setLinkingMode(null);
        resetLinkForm();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error linking profile:', error);
      alert('Failed to link profile');
    } finally {
      setProcessing(null);
    }
  };

  const resetLinkForm = () => {
    setLinkForm({
      firstName: '',
      lastName: '',
      role: 'employee',
      department: '',
      position: '',
      existingProfileId: ''
    });
  };

  const startLinking = (userId: string, mode: 'create' | 'link') => {
    setLinkingMode({ userId, mode });
    resetLinkForm();
  };

  if (role !== 'admin') {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <SimpleDashboardLayout>
      <Head>
        <title>User Management - HR Portal</title>
      </Head>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage user accounts and profile linking</p>
          </div>
          <button
            onClick={loadUserData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Unlinked Users Section */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Unlinked Authentication Users</h2>
                <p className="text-sm text-gray-600">Users who have authentication accounts but no employee profiles</p>
              </div>
              
              <div className="p-6">
                {unlinkedUsers.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No unlinked users found</p>
                ) : (
                  <div className="space-y-4">
                    {unlinkedUsers.map((unlinkedUser) => (
                      <div key={unlinkedUser.auth_user.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{unlinkedUser.auth_user.email}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                unlinkedUser.auth_user.email_confirmed_at 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {unlinkedUser.auth_user.email_confirmed_at ? 'Verified' : 'Unverified'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Created: {new Date(unlinkedUser.auth_user.created_at).toLocaleDateString()}
                            </p>
                            {unlinkedUser.auth_user.raw_user_meta_data && (
                              <p className="text-sm text-gray-600">
                                Metadata: {JSON.stringify(unlinkedUser.auth_user.raw_user_meta_data)}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => startLinking(unlinkedUser.auth_user.id, 'create')}
                              className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700"
                              disabled={processing === unlinkedUser.auth_user.id}
                            >
                              Create Profile
                            </button>
                            <button
                              onClick={() => startLinking(unlinkedUser.auth_user.id, 'link')}
                              className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                              disabled={processing === unlinkedUser.auth_user.id}
                            >
                              Link Existing
                            </button>
                          </div>
                        </div>

                        {/* Linking Form */}
                        {linkingMode?.userId === unlinkedUser.auth_user.id && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            {linkingMode.mode === 'create' ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                  type="text"
                                  placeholder="First Name"
                                  value={linkForm.firstName}
                                  onChange={(e) => setLinkForm({...linkForm, firstName: e.target.value})}
                                  className="border border-gray-300 rounded px-3 py-2"
                                />
                                <input
                                  type="text"
                                  placeholder="Last Name"
                                  value={linkForm.lastName}
                                  onChange={(e) => setLinkForm({...linkForm, lastName: e.target.value})}
                                  className="border border-gray-300 rounded px-3 py-2"
                                />
                                <select
                                  value={linkForm.role}
                                  onChange={(e) => setLinkForm({...linkForm, role: e.target.value})}
                                  className="border border-gray-300 rounded px-3 py-2"
                                >
                                  <option value="employee">Employee</option>
                                  <option value="manager">Manager</option>
                                  <option value="hr">HR</option>
                                  <option value="admin">Admin</option>
                                  <option value="recruiter">Recruiter</option>
                                </select>
                                <input
                                  type="text"
                                  placeholder="Department"
                                  value={linkForm.department}
                                  onChange={(e) => setLinkForm({...linkForm, department: e.target.value})}
                                  className="border border-gray-300 rounded px-3 py-2"
                                />
                                <input
                                  type="text"
                                  placeholder="Position"
                                  value={linkForm.position}
                                  onChange={(e) => setLinkForm({...linkForm, position: e.target.value})}
                                  className="border border-gray-300 rounded px-3 py-2 md:col-span-2"
                                />
                                <div className="md:col-span-2 flex gap-2">
                                  <button
                                    onClick={() => handleCreateProfile(unlinkedUser.auth_user.id)}
                                    disabled={!linkForm.firstName || !linkForm.lastName}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                                  >
                                    Create Profile
                                  </button>
                                  <button
                                    onClick={() => setLinkingMode(null)}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <select
                                  value={linkForm.existingProfileId}
                                  onChange={(e) => setLinkForm({...linkForm, existingProfileId: e.target.value})}
                                  className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
                                >
                                  <option value="">Select existing profile</option>
                                  {profiles.map((profile) => (
                                    <option key={profile.id} value={profile.id}>
                                      {profile.first_name} {profile.last_name} ({profile.email})
                                    </option>
                                  ))}
                                </select>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleLinkProfile(unlinkedUser.auth_user.id)}
                                    disabled={!linkForm.existingProfileId}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                                  >
                                    Link Profile
                                  </button>
                                  <button
                                    onClick={() => setLinkingMode(null)}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* All Profiles Section */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">All Employee Profiles</h2>
                <p className="text-sm text-gray-600">Complete list of employee profiles in the system</p>
              </div>
              
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Role</th>
                        <th className="px-4 py-2 text-left">Department</th>
                        <th className="px-4 py-2 text-left">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profiles.map((profile) => (
                        <tr key={profile.id} className="border-t border-gray-200">
                          <td className="px-4 py-2">{profile.first_name} {profile.last_name}</td>
                          <td className="px-4 py-2">{profile.email}</td>
                          <td className="px-4 py-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {profile.role}
                            </span>
                          </td>
                          <td className="px-4 py-2">{profile.department || 'N/A'}</td>
                          <td className="px-4 py-2">{new Date(profile.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SimpleDashboardLayout>
  );
} 