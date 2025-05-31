import React, { useState, useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import { GetServerSideProps } from "next";

import { shouldBypassAuth } from "@/lib/auth";

import {
  Permission,
  Role,
  PermissionGroup,
} from "../../../packages/types/src/hr";
import {
  PermissionGuard,
  PermissionButton,
} from "../../components/ui/PermissionGuard";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import { permissionService } from "../../services/permissionService";

interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
  hierarchy_level: number;
}

const RolesPermissionsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const allowAccess = shouldBypassAuth(router.query);

  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>(
    [],
  );
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showSensitiveOnly, setShowSensitiveOnly] = useState(false);

  const [newRole, setNewRole] = useState<RoleFormData>({
    name: "",
    description: "",
    permissions: [],
    hierarchy_level: 6,
  });

  // Check if user has permission to manage roles
  const canManageRoles = hasPermission("user_permissions", "manage_settings");

  // Redirect if no access
  useEffect(() => {
    if (!allowAccess && !canManageRoles) {
      router.push("/dashboard?error=insufficient_permissions");
    }
  }, [allowAccess, canManageRoles, router]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [rolesData, permissionsData, groupsData] = await Promise.all([
        permissionService.getAllRoles(),
        permissionService.getAllPermissions(),
        permissionService.getPermissionGroups(),
      ]);

      setRoles(rolesData);
      setPermissions(permissionsData);
      setPermissionGroups(groupsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleCreateRole = () => {
    setIsCreating(true);
    setSelectedRole(null);
    setIsEditing(false);
    setNewRole({
      name: "",
      description: "",
      permissions: [],
      hierarchy_level: 6,
    });
  };

  const handlePermissionToggle = (permissionId: string) => {
    if (isCreating) {
      setNewRole((prev) => ({
        ...prev,
        permissions: prev.permissions.includes(permissionId)
          ? prev.permissions.filter((p) => p !== permissionId)
          : [...prev.permissions, permissionId],
      }));
    } else if (selectedRole && isEditing) {
      const updatedPermissions = selectedRole.permissions.includes(permissionId)
        ? selectedRole.permissions.filter((p) => p !== permissionId)
        : [...selectedRole.permissions, permissionId];

      setSelectedRole({ ...selectedRole, permissions: updatedPermissions });
    }
  };

  const handleSaveRole = async () => {
    if (!selectedRole) return;

    try {
      // In a real app, this would make an API call
      setRoles((prev) =>
        prev.map((r) => (r.id === selectedRole.id ? selectedRole : r)),
      );
      setIsEditing(false);

      // Show success notification
      alert("Role updated successfully!");
    } catch (error) {
      console.error("Error saving role:", error);
      alert("Failed to save role. Please try again.");
    }
  };

  const handleCreateNewRole = async () => {
    if (!newRole.name.trim()) {
      alert("Please enter a role name");
      return;
    }

    try {
      const roleData: Role = {
        id: `role_${Date.now()}`,
        org_id: "default",
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions,
        is_system_role: false,
        hierarchy_level: newRole.hierarchy_level,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: user?.id || "unknown",
        user_count: 0,
      };

      setRoles((prev) => [...prev, roleData]);
      setIsCreating(false);
      setSelectedRole(roleData);

      alert("Role created successfully!");
    } catch (error) {
      console.error("Error creating role:", error);
      alert("Failed to create role. Please try again.");
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return;

    if (role.is_system_role) {
      alert("System roles cannot be deleted");
      return;
    }

    if (role.user_count && role.user_count > 0) {
      if (
        !confirm(
          `This role is assigned to ${role.user_count} users. Are you sure you want to delete it?`,
        )
      ) {
        return;
      }
    }

    try {
      setRoles((prev) => prev.filter((r) => r.id !== roleId));
      if (selectedRole?.id === roleId) {
        setSelectedRole(null);
      }
      alert("Role deleted successfully!");
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("Failed to delete role. Please try again.");
    }
  };

  // Filter permissions based on search and category
  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch =
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || permission.category === selectedCategory;
    const matchesSensitive = !showSensitiveOnly || permission.is_sensitive;

    return matchesSearch && matchesCategory && matchesSensitive;
  });

  // Group filtered permissions by category
  const groupedFilteredPermissions = filteredPermissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>,
  );

  // Get unique categories
  const categories = Array.from(new Set(permissions.map((p) => p.category)));

  const currentPermissions = isCreating
    ? newRole.permissions
    : selectedRole?.permissions || [];

  if (!allowAccess && !canManageRoles) {
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
        <title>Roles & Permissions - HR Management</title>
        <meta name="description" content="Manage user roles and permissions" />
      </Head>

      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Roles & Permissions
            </h1>
            <p className="text-gray-600">
              Configure user roles and access controls
            </p>
          </div>
          <div className="flex space-x-3">
            <PermissionButton
              resource="user_permissions"
              action="manage_settings"
              onClick={handleCreateRole}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create New Role
            </PermissionButton>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Roles List */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Roles ({roles.length})
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      onClick={() => handleRoleSelect(role)}
                      className={`p-3 rounded-md cursor-pointer transition-colors border ${
                        selectedRole?.id === role.id
                          ? "bg-blue-50 border-blue-200 shadow-sm"
                          : "bg-gray-50 hover:bg-gray-100 border-transparent"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">
                            {role.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {role.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-400">
                              {role.user_count || 0} users
                            </p>
                            <div className="flex items-center space-x-1">
                              {role.is_system_role && (
                                <span className="inline-flex px-1.5 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800">
                                  System
                                </span>
                              )}
                              <span
                                className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded ${
                                  role.hierarchy_level <= 2
                                    ? "bg-red-100 text-red-800"
                                    : role.hierarchy_level <= 4
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                L{role.hierarchy_level}
                              </span>
                            </div>
                          </div>
                        </div>
                        <PermissionGuard
                          resource="user_permissions"
                          action="manage_settings"
                        >
                          {!role.is_system_role && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRole(role.id);
                              }}
                              className="ml-2 text-red-400 hover:text-red-600 p-1"
                              title="Delete role"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
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

            {/* Role Details & Permissions */}
            <div className="xl:col-span-3">
              {selectedRole || isCreating ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      {isCreating ? (
                        <div className="space-y-3">
                          <h2 className="text-lg font-semibold">
                            Create New Role
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role Name
                              </label>
                              <input
                                type="text"
                                value={newRole.name}
                                onChange={(e) =>
                                  setNewRole((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter role name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hierarchy Level
                              </label>
                              <select
                                value={newRole.hierarchy_level}
                                onChange={(e) =>
                                  setNewRole((prev) => ({
                                    ...prev,
                                    hierarchy_level: parseInt(e.target.value),
                                  }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value={1}>Level 1 (Highest)</option>
                                <option value={2}>Level 2</option>
                                <option value={3}>Level 3</option>
                                <option value={4}>Level 4</option>
                                <option value={5}>Level 5</option>
                                <option value={6}>Level 6 (Lowest)</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              value={newRole.description}
                              onChange={(e) =>
                                setNewRole((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={2}
                              placeholder="Enter role description"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <h2 className="text-lg font-semibold">
                            {selectedRole.name}
                          </h2>
                          <p className="text-gray-600">
                            {selectedRole.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-500">
                              {selectedRole.user_count || 0} users assigned
                            </span>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                                selectedRole.hierarchy_level <= 2
                                  ? "bg-red-100 text-red-800"
                                  : selectedRole.hierarchy_level <= 4
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              Hierarchy Level {selectedRole.hierarchy_level}
                            </span>
                            {selectedRole.is_system_role && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                                System Role
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {isCreating ? (
                        <>
                          <button
                            onClick={() => setIsCreating(false)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleCreateNewRole}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                          >
                            Create Role
                          </button>
                        </>
                      ) : (
                        <>
                          {!isEditing ? (
                            <PermissionButton
                              resource="user_permissions"
                              action="manage_settings"
                              onClick={() => setIsEditing(true)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                              Edit Permissions
                            </PermissionButton>
                          ) : (
                            <>
                              <button
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSaveRole}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                              >
                                Save Changes
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Permission Search & Filters */}
                  <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Search permissions..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All Categories</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={showSensitiveOnly}
                            onChange={(e) =>
                              setShowSensitiveOnly(e.target.checked)
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            Sensitive only
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Permissions by Category */}
                  <div className="space-y-6 max-h-96 overflow-y-auto">
                    {Object.entries(groupedFilteredPermissions).map(
                      ([category, categoryPermissions]) => (
                        <div key={category}>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-md font-medium text-gray-900 flex items-center">
                              {permissionGroups.find(
                                (g) => g.category === category,
                              )?.icon && (
                                <span className="mr-2">
                                  {
                                    permissionGroups.find(
                                      (g) => g.category === category,
                                    )?.icon
                                  }
                                </span>
                              )}
                              {category}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {
                                categoryPermissions.filter((p) =>
                                  currentPermissions.includes(p.id),
                                ).length
                              }
                              /{categoryPermissions.length}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {categoryPermissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="text-sm font-medium text-gray-900">
                                      {permission.name}
                                    </h4>
                                    {permission.is_sensitive && (
                                      <span className="inline-flex px-1.5 py-0.5 text-xs font-semibold rounded bg-red-100 text-red-800">
                                        Sensitive
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {permission.description}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {permission.resource}.{permission.action}
                                  </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer ml-3">
                                  <input
                                    type="checkbox"
                                    checked={currentPermissions.includes(
                                      permission.id,
                                    )}
                                    onChange={() =>
                                      handlePermissionToggle(permission.id)
                                    }
                                    disabled={!isEditing && !isCreating}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  {/* Permission Summary */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                      Permission Summary
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Total: </span>
                        <span className="font-medium">
                          {currentPermissions.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700">Sensitive: </span>
                        <span className="font-medium">
                          {
                            currentPermissions.filter(
                              (p) =>
                                permissions.find((perm) => perm.id === p)
                                  ?.is_sensitive,
                            ).length
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700">Categories: </span>
                        <span className="font-medium">
                          {
                            new Set(
                              currentPermissions
                                .map(
                                  (p) =>
                                    permissions.find((perm) => perm.id === p)
                                      ?.category,
                                )
                                .filter(Boolean),
                            ).size
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700">Level: </span>
                        <span className="font-medium">
                          {isCreating
                            ? newRole.hierarchy_level
                            : selectedRole?.hierarchy_level}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="text-gray-400">
                    <svg
                      className="w-16 h-16 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <h3 className="text-xl font-medium mb-2">
                      Select a role to manage permissions
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Choose a role from the list to view and edit its
                      permissions, or create a new role.
                    </p>
                    <PermissionButton
                      resource="user_permissions"
                      action="manage_settings"
                      onClick={handleCreateRole}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                      Create New Role
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
    props: {},
  };
};

export default RolesPermissionsPage;
