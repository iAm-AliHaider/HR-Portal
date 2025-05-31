import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';

export type RealUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: string;
  position?: string;
  created_at: string;
}

interface RealUserInfoProps {
  onSelect?: (user: RealUser) => void;
  filterRoles?: string[];
}

export default function RealUserInfo({ onSelect, filterRoles }: RealUserInfoProps) {
  const [users, setUsers] = useState<RealUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name, role, department, position, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users');
        return;
      }

      if (data) {
        setUsers(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const displayUsers = filterRoles 
    ? users.filter(user => filterRoles.includes(user.role))
    : users;

  if (loading) {
    return (
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">System Users</h2>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">System Users</h2>
        <div className="text-center py-4">
          <p className="text-sm text-red-600">{error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (displayUsers.length === 0) {
    return (
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">System Users</h2>
        <p className="text-sm text-gray-500">No users found. Please sign up to create your first account.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">System Users</h2>
      <p className="text-sm text-gray-500 mb-4">Available user accounts in the system</p>
      
      <div className="space-y-3">
        {displayUsers.map((user) => (
          <div 
            key={user.id}
            onClick={() => onSelect && onSelect(user)}
            className="p-3 bg-white rounded border border-gray-200 hover:border-blue-400 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{user.name || 'User'}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                  {user.role}
                </span>
                {user.department && (
                  <span className="text-xs text-gray-500 mt-1">{user.department}</span>
                )}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 flex justify-between">
              <span>ID: {user.id.slice(0, 8)}...</span>
              <span className="italic">{user.position}</span>
            </div>
            <div className="mt-1 text-xs text-gray-600">
              Joined: {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-xs text-yellow-800">
          <strong>Test Accounts:</strong> Use the accounts created during setup:
          <br />• admin@company.com (password: admin123)
          <br />• hr@company.com (password: hr123)
          <br />• employee@company.com (password: employee123)
        </p>
      </div>
    </div>
  );
} 