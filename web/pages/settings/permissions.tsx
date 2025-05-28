import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import { PermissionGuard, PermissionButton } from '../../components/ui/PermissionGuard';
import { shouldBypassAuth } from '@/lib/auth';
import { permissionService } from '../../services/permissionService';
import {
  Permission,
  PermissionResource,
  PermissionAction, 
  PermissionGroup 
} from '../../../packages/types/src/hr';
import { GetServerSideProps } from 'next';

interface CustomPermission extends Permission {
  isCustom: boolean;
  createdBy: string;
  createdAt: string;
  module?: string;
  dependencies?: string[];
}

interface NewPermissionForm {
  name: string;
  description: string;
  resource: PermissionResource | string;
  action: PermissionAction | string;
  category: string;
  module: string;
  is_sensitive: boolean;
  dependencies: string[];
}

const PermissionsManagePage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const allowAccess = shouldBypassAuth(router.query);
  
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<CustomPermission[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<CustomPermission | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [showCustomOnly, setShowCustomOnly] = useState(false);
  
  const [newPermission, setNewPermission] = useState<NewPermissionForm>({
    name: '',
    description: '',
    resource: '',
    action: '',
    category: 'General',
    module: 'core',
    is_sensitive: false,
    dependencies: []
  });

  // Check if user has permission to manage permissions
  const canManagePermissions = hasPermission('user_permissions', 'manage_settings');

  // Redirect if no access
  useEffect(() => {
    if (!allowAccess && !canManagePermissions) {
      router.push('/dashboard?error=insufficient_permissions');
    }
  }, [allowAccess, canManagePermissions, router]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [permissionsData, groupsData] = await Promise.all([
        permissionService.getAllPermissions(),
        permissionService.getPermissionGroups()
      ]);
      
      // Add custom flag to permissions
      const enhancedPermissions: CustomPermission[] = permissionsData.map(p => ({
        ...p,
        isCustom: p.id.startsWith('custom_'),
        createdBy: p.id.startsWith('custom_') ? 'admin' : 'system',
        createdAt: new Date().toISOString(),
        module: getPermissionModule(p.category)
      }));
      
      setPermissions(enhancedPermissions);
      setPermissionGroups(groupsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissionModule = (category: string): string => {
    const moduleMap: Record<string, string> = {
      'General': 'core',
      'User Management': 'auth',
      'HR Management': 'hr',
      'Recruitment': 'recruitment',
      'Time & Attendance': 'time',
      'Finance': 'finance',
      'Facilities': 'facilities',
      'Performance': 'performance',
      'Development': 'training',
      'Analytics': 'reports',
      'Administration': 'admin'
    };
    return moduleMap[category] || 'custom';
  };

  const handleCreatePermission = async () => {
    if (!newPermission.name.trim() || !newPermission.resource || !newPermission.action) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const permissionId = `custom_${newPermission.resource}.${newPermission.action}`;
      
      const customPermission: CustomPermission = {
        id: permissionId,
        name: newPermission.name,
        description: newPermission.description,
        resource: newPermission.resource as PermissionResource,
        action: newPermission.action as PermissionAction,
        category: newPermission.category,
        is_sensitive: newPermission.is_sensitive,
        isCustom: true,
        createdBy: user?.id || 'unknown',
        createdAt: new Date().toISOString(),
        module: newPermission.module,
        dependencies: newPermission.dependencies
      };

      setPermissions(prev => [...prev, customPermission]);
      setIsCreating(false);
      setNewPermission({
        name: '',
        description: '',
        resource: '',
        action: '',
        category: 'General',
        module: 'core',
        is_sensitive: false,
        dependencies: []
      });
      
      alert('Permission created successfully!');
    } catch (error) {
      console.error('Error creating permission:', error);
      alert('Failed to create permission. Please try again.');
    }
  };

  const handleDeletePermission = async (permissionId: string) => {
    const permission = permissions.find(p => p.id === permissionId);
    if (!permission) return;

    if (!permission.isCustom) {
      alert('System permissions cannot be deleted');
      return;
    }

    if (!confirm(`Are you sure you want to delete the permission "${permission.name}"?`)) {
      return;
    }

    try {
      setPermissions(prev => prev.filter(p => p.id !== permissionId));
      if (selectedPermission?.id === permissionId) {
        setSelectedPermission(null);
      }
      alert('Permission deleted successfully!');
    } catch (error) {
      console.error('Error deleting permission:', error);
      alert('Failed to delete permission. Please try again.');
    }
  };

  // Filter permissions based on search and filters
  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || permission.category === selectedCategory;
    const matchesModule = selectedModule === 'all' || permission.module === selectedModule;
    const matchesCustom = !showCustomOnly || permission.isCustom;
    
    return matchesSearch && matchesCategory && matchesModule && matchesCustom;
  });

  // Get unique categories and modules
  const categories = Array.from(new Set(permissions.map(p => p.category)));
  const modules = Array.from(new Set(permissions.map(p => p.module || 'core')));

  // Available resources and actions for new permissions
  const availableResources = [
    'users', 'employees', 'departments', 'jobs', 'applications', 'interviews', 'offers',
    'leave_requests', 'expense_claims', 'payroll', 'benefits', 'meeting_rooms', 'equipment',
    'training_courses', 'performance_reviews', 'documents', 'reports', 'system_settings',
    'workflows', 'policies', 'compliance_records', 'audit_logs'
  ];

  const availableActions = [
    'create', 'read', 'update', 'delete', 'approve', 'reject', 'submit', 'assign',
    'export', 'import', 'archive', 'restore', 'view_details', 'view_list', 'view_reports',
    'manage_settings', 'bulk_edit', 'bulk_delete'
  ];

  if (!allowAccess && !canManagePermissions) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Permissions Management - HR Management</title>
        <meta name="description" content="Create and manage system permissions" />
      </Head>
      
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Permissions Management</h1>
            <p className="text-gray-600">Create and manage system permissions and access controls</p>
          </div>
          <div className="flex space-x-3">
            <PermissionButton
              resource="user_permissions"
              action="manage_settings"
              onClick={() => setIsCreating(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Permission
            </PermissionButton>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Permissions</p>
                <p className="text-2xl font-semibold text-gray-900">{permissions.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Custom Permissions</p>
                <p className="text-2xl font-semibold text-gray-900">{permissions.filter(p => p.isCustom).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sensitive Permissions</p>
                <p className="text-2xl font-semibold text-gray-900">{permissions.filter(p => p.is_sensitive).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-semibold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Permissions List */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Permissions ({filteredPermissions.length})</h2>
                  <button
                    onClick={() => setShowCustomOnly(!showCustomOnly)}
                    className={`text-xs px-2 py-1 rounded ${showCustomOnly ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {showCustomOnly ? 'Show All' : 'Custom Only'}
                  </button>
                </div>

                {/* Filters */}
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Search permissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    
                    <select
                      value={selectedModule}
                      onChange={(e) => setSelectedModule(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Modules</option>
                      {modules.map(module => (
                        <option key={module} value={module}>{module}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredPermissions.map((permission) => (
                    <div
                      key={permission.id}
                      onClick={() => setSelectedPermission(permission)}
                      className={`p-3 rounded-md cursor-pointer transition-colors border ${
                        selectedPermission?.id === permission.id 
                          ? 'bg-blue-50 border-blue-200 shadow-sm' 
                          : 'bg-gray-50 hover:bg-gray-100 border-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900 text-sm">{permission.name}</h3>
                            {permission.is_sensitive && (
                              <span className="inline-flex px-1.5 py-0.5 text-xs font-semibold rounded bg-red-100 text-red-800">
                                Sensitive
                              </span>
                            )}
                            {permission.isCustom && (
                              <span className="inline-flex px-1.5 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800">
                                Custom
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-1">{permission.description}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-400 font-mono">{permission.id}</p>
                            <span className="text-xs text-gray-500">{permission.category}</span>
                          </div>
                        </div>
                        <PermissionGuard resource="user_permissions" action="manage_settings">
                          {permission.isCustom && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePermission(permission.id);
                              }}
                              className="ml-2 text-red-400 hover:text-red-600 p-1"
                              title="Delete permission"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </PermissionGuard>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Permission Details & Creation */}
            <div className="xl:col-span-2">
              {isCreating ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Create New Permission</h2>
                    <button
                      onClick={() => setIsCreating(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Permission Name*</label>
                        <input
                          type="text"
                          value={newPermission.name}
                          onChange={(e) => setNewPermission(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter permission name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={newPermission.description}
                          onChange={(e) => setNewPermission(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder="Enter permission description"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resource*</label>
                        <select
                          value={newPermission.resource}
                          onChange={(e) => setNewPermission(prev => ({ ...prev, resource: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select resource</option>
                          {availableResources.map(resource => (
                            <option key={resource} value={resource}>{resource}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Action*</label>
                        <select
                          value={newPermission.action}
                          onChange={(e) => setNewPermission(prev => ({ ...prev, action: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select action</option>
                          {availableActions.map(action => (
                            <option key={action} value={action}>{action}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={newPermission.category}
                          onChange={(e) => setNewPermission(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                        <select
                          value={newPermission.module}
                          onChange={(e) => setNewPermission(prev => ({ ...prev, module: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="core">Core</option>
                          <option value="auth">Authentication</option>
                          <option value="hr">HR Management</option>
                          <option value="recruitment">Recruitment</option>
                          <option value="time">Time & Attendance</option>
                          <option value="finance">Finance</option>
                          <option value="facilities">Facilities</option>
                          <option value="performance">Performance</option>
                          <option value="training">Training</option>
                          <option value="reports">Reports</option>
                          <option value="admin">Administration</option>
                          <option value="workflows">Workflows</option>
                          <option value="policies">Policies</option>
                          <option value="compliance">Compliance</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_sensitive"
                          checked={newPermission.is_sensitive}
                          onChange={(e) => setNewPermission(prev => ({ ...prev, is_sensitive: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="is_sensitive" className="text-sm font-medium text-gray-700">
                          Sensitive Permission
                        </label>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Permission Preview</h4>
                        <p className="text-sm text-blue-800 font-mono">
                          {newPermission.resource && newPermission.action 
                            ? `custom_${newPermission.resource}.${newPermission.action}`
                            : 'custom_[resource].[action]'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setIsCreating(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreatePermission}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Create Permission
                    </button>
                  </div>
                </div>
              ) : selectedPermission ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Permission Details</h2>
                    <div className="flex items-center space-x-2">
                      {selectedPermission.isCustom && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                          Custom Permission
                        </span>
                      )}
                      {selectedPermission.is_sensitive && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">
                          Sensitive
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <p className="text-sm text-gray-900">{selectedPermission.name}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <p className="text-sm text-gray-900">{selectedPermission.description}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Permission ID</label>
                        <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">{selectedPermission.id}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resource</label>
                        <p className="text-sm text-gray-900">{selectedPermission.resource}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                        <p className="text-sm text-gray-900">{selectedPermission.action}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <p className="text-sm text-gray-900">{selectedPermission.category}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                        <p className="text-sm text-gray-900">{selectedPermission.module || 'core'}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                        <p className="text-sm text-gray-900">
                          {selectedPermission.isCustom 
                            ? `${new Date(selectedPermission.createdAt).toLocaleDateString()} by ${selectedPermission.createdBy}`
                            : 'System permission'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedPermission.dependencies && selectedPermission.dependencies.length > 0 && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dependencies</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedPermission.dependencies.map((dep, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <h4 className="text-sm font-medium text-yellow-800 mb-2">Usage Information</h4>
                    <p className="text-sm text-yellow-700">
                      This permission can be assigned to roles in the Role Management interface. 
                      Use it to control access to specific features and actions within the application.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h3 className="text-xl font-medium mb-2">Select a permission to view details</h3>
                    <p className="text-gray-500 mb-4">Choose a permission from the list to view its details and configuration.</p>
                    <PermissionButton
                      resource="user_permissions"
                      action="manage_settings"
                      onClick={() => setIsCreating(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                      Create New Permission
                    </PermissionButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default PermissionsManagePage; 
