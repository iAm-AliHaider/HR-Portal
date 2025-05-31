import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import { supabase } from '../../lib/supabase/client';
import { PlusIcon, DownloadIcon, SearchIcon, FilterIcon, UserPlusIcon, MailIcon, TrashIcon, LockIcon } from 'lucide-react';
import { PageLayout, StatsCard, DataTable, TableHeader, TableHeaderCell, TableCell, SearchFilterBar, UserAvatar, StatusBadge } from '@/components/layout/PageLayout';

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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  createdAt: string;
}

export default function UserManagementPage() {
  const { user, role } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Ensure admin access
  useEffect(() => {
    if (role !== 'admin') {
      router.push('/dashboard');
    }
  }, [role, router]);

  // Load user data
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch from an API
        // For demo, using mock data
        const mockUsers: User[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@company.com',
            role: 'admin',
            department: 'Executive',
            status: 'active',
            lastLogin: '2023-05-30T15:24:33Z',
            createdAt: '2023-01-01T09:00:00Z'
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@company.com',
            role: 'manager',
            department: 'HR',
            status: 'active',
            lastLogin: '2023-05-29T10:15:00Z',
            createdAt: '2023-01-15T09:00:00Z'
          },
          {
            id: '3',
            name: 'Robert Johnson',
            email: 'robert.johnson@company.com',
            role: 'employee',
            department: 'Engineering',
            status: 'inactive',
            lastLogin: '2023-05-01T08:30:00Z',
            createdAt: '2023-02-01T09:00:00Z'
          },
          {
            id: '4',
            name: 'Alice Brown',
            email: 'alice.brown@company.com',
            role: 'employee',
            department: 'Marketing',
            status: 'pending',
            createdAt: '2023-05-25T09:00:00Z'
          },
          {
            id: '5',
            name: 'Michael Wilson',
            email: 'michael.wilson@company.com',
            role: 'manager',
            department: 'Sales',
            status: 'active',
            lastLogin: '2023-05-30T09:45:00Z',
            createdAt: '2023-03-01T09:00:00Z'
          },
          {
            id: '6',
            name: 'Emily Davis',
            email: 'emily.davis@company.com',
            role: 'employee',
            department: 'Customer Support',
            status: 'active',
            lastLogin: '2023-05-29T16:20:00Z',
            createdAt: '2023-03-15T09:00:00Z'
          },
          {
            id: '7',
            name: 'David Martinez',
            email: 'david.martinez@company.com',
            role: 'employee',
            department: 'Engineering',
            status: 'active',
            lastLogin: '2023-05-30T11:10:00Z',
            createdAt: '2023-04-01T09:00:00Z'
          },
          {
            id: '8',
            name: 'Sarah Taylor',
            email: 'sarah.taylor@company.com',
            role: 'employee',
            department: 'Finance',
            status: 'pending',
            createdAt: '2023-05-28T09:00:00Z'
          }
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle user actions
  const handleUserAction = (userId: string, action: string) => {
    // In a real app, this would call the appropriate API endpoint
    console.log(`Action ${action} on user ${userId}`);
    alert(`${action} user with ID: ${userId}`);
  };

  const inviteUser = () => {
    setShowInviteModal(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (role !== 'admin') {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <PageLayout
      title="User Management"
      description="Manage user accounts and access permissions"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Administration", href: "/admin" },
        { label: "User Management" },
      ]}
      actionButton={{
        label: "Add User",
        onClick: inviteUser,
        icon: <UserPlusIcon className="h-4 w-4" />,
      }}
      secondaryButton={{
        label: "Export Users",
        onClick: () => alert("Export users functionality would be implemented here"),
        icon: <DownloadIcon className="h-4 w-4" />,
      }}
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Users"
          value={users.length}
          description="User accounts"
        />
        <StatsCard
          title="Active Users"
          value={users.filter(u => u.status === 'active').length}
          description="Currently active"
        />
        <StatsCard
          title="Pending Users"
          value={users.filter(u => u.status === 'pending').length}
          description="Awaiting activation"
        />
        <StatsCard
          title="Inactive Users"
          value={users.filter(u => u.status === 'inactive').length}
          description="Deactivated accounts"
        />
      </div>

      {/* Filters */}
      <SearchFilterBar>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 text-zinc-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
        </div>
        
        <div className="w-full md:w-48">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
        </div>
        
        <div className="w-full md:w-48">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </SearchFilterBar>

      {/* Users Table */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-zinc-500">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
          </div>
        ) : (
          <DataTable>
            <TableHeader>
              <TableHeaderCell>User</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Department</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Last Login</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableHeader>
            <tbody className="divide-y divide-zinc-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50">
                  <TableCell>
                    <UserAvatar
                      name={user.name}
                      email={user.email}
                    />
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-sm ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                      'bg-zinc-100 text-zinc-800'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                  <TableCell className="text-zinc-500">
                    {formatDate(user.lastLogin)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUserAction(user.id, 'edit')}
                        className="text-zinc-500 hover:text-zinc-900"
                        title="Edit User"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, 'reset-password')}
                        className="text-zinc-500 hover:text-zinc-900"
                        title="Reset Password"
                      >
                        <LockIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, 'email')}
                        className="text-zinc-500 hover:text-zinc-900"
                        title="Send Email"
                      >
                        <MailIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, 'delete')}
                        className="text-zinc-500 hover:text-red-600"
                        title="Delete User"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </div>
    </PageLayout>
  );
} 