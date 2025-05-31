import React, { useState } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import { GetServerSideProps } from "next";

import { shouldBypassAuth } from "@/lib/auth";

import { PermissionGuard } from "../../components/ui/PermissionGuard";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";

const RBACGuidePage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const allowAccess = shouldBypassAuth(router.query);
  const [activeSection, setActiveSection] = useState("overview");

  // Check if user has permission to access RBAC guide
  const canAccessGuide =
    hasPermission("user_permissions", "manage_settings") ||
    hasPermission("system_settings", "read");

  // Redirect if no access
  React.useEffect(() => {
    if (!allowAccess && !canAccessGuide) {
      router.push("/dashboard?error=insufficient_permissions");
    }
  }, [allowAccess, canAccessGuide, router]);

  const sections = [
    { id: "overview", name: "Overview", icon: "📋" },
    { id: "features", name: "Key Features", icon: "🎯" },
    { id: "permissions", name: "Permissions", icon: "🔐" },
    { id: "roles", name: "Roles", icon: "👥" },
    { id: "implementation", name: "Implementation", icon: "🔧" },
    { id: "components", name: "UI Components", icon: "🧩" },
    { id: "security", name: "Security", icon: "🛡️" },
    { id: "examples", name: "Examples", icon: "💡" },
  ];

  const permissionCategories = {
    General: ["dashboard.read", "reports.read", "reports.export"],
    "User Management": [
      "users.read",
      "users.create",
      "users.update",
      "users.delete",
      "user_roles.assign",
    ],
    "HR Management": [
      "employees.read",
      "employees.create",
      "employees.update",
      "employees.delete",
    ],
    Recruitment: [
      "jobs.read",
      "jobs.create",
      "applications.read",
      "interviews.create",
      "offers.approve",
    ],
    "Time & Attendance": [
      "leave_requests.read",
      "leave_requests.create",
      "leave_requests.approve",
    ],
    Finance: [
      "expense_claims.read",
      "expense_claims.approve",
      "payroll.read",
      "compensation.update",
    ],
    Facilities: [
      "meeting_rooms.read",
      "room_bookings.create",
      "equipment.read",
    ],
    Performance: ["performance_reviews.read", "training_courses.read"],
    Administration: [
      "system_settings.update",
      "audit_logs.read",
      "user_permissions.manage",
    ],
  };

  const builtInRoles = [
    {
      name: "Super Administrator",
      level: 1,
      desc: "Full system access",
      color: "bg-red-100 text-red-800",
    },
    {
      name: "Administrator",
      level: 2,
      desc: "Organization admin",
      color: "bg-red-100 text-red-800",
    },
    {
      name: "Manager",
      level: 3,
      desc: "Department management",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      name: "HR Specialist",
      level: 4,
      desc: "HR-specific permissions",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      name: "Team Lead",
      level: 5,
      desc: "Limited management",
      color: "bg-gray-100 text-gray-800",
    },
    {
      name: "Employee",
      level: 6,
      desc: "Basic access rights",
      color: "bg-gray-100 text-gray-800",
    },
  ];

  if (!allowAccess && !canAccessGuide) {
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
        <title>RBAC System Guide - HR Management</title>
        <meta
          name="description"
          content="Comprehensive guide to Role-Based Access Control system"
        />
      </Head>

      <div className="flex h-full">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white shadow-md border-r">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              RBAC Guide
            </h2>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    activeSection === section.id
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="mr-3">{section.icon}</span>
                  {section.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-4xl">
            {activeSection === "overview" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    HR Portal RBAC System
                  </h1>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">✅</span>
                      <div>
                        <h3 className="text-lg font-semibold text-green-900">
                          System Complete
                        </h3>
                        <p className="text-green-700">
                          Enterprise-grade role-based access control with
                          comprehensive permissions and audit logging.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3">
                      📊 System Stats
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Permissions:</span>
                        <span className="font-medium">60+</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Permission Categories:</span>
                        <span className="font-medium">11</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Built-in Roles:</span>
                        <span className="font-medium">6</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hierarchy Levels:</span>
                        <span className="font-medium">6</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3">
                      🔧 Key Components
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>• PermissionGuard - Conditional rendering</div>
                      <div>• PermissionButton - Smart buttons</div>
                      <div>• usePermissions - React hook</div>
                      <div>• Role Management - Full CRUD interface</div>
                      <div>• Audit Logging - Comprehensive tracking</div>
                      <div>• Type Safety - Full TypeScript support</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    🚀 Quick Start
                  </h3>
                  <div className="space-y-2 text-blue-800">
                    <div>
                      1. Navigate to{" "}
                      <strong>Settings → Roles & Permissions</strong> to manage
                      roles
                    </div>
                    <div>
                      2. Use <strong>PermissionGuard</strong> components to
                      protect UI elements
                    </div>
                    <div>
                      3. Check <strong>usePermissions</strong> hook for dynamic
                      permission checking
                    </div>
                    <div>
                      4. Review <strong>Implementation</strong> section for code
                      examples
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "features" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  Key Features
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <span className="mr-2">🔐</span>
                      Advanced Permission System
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• 60+ granular permissions</li>
                      <li>• Resource-action based (users.create)</li>
                      <li>• Sensitive permission marking</li>
                      <li>• Wildcard support (*.*)</li>
                      <li>• Context-aware checks</li>
                    </ul>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <span className="mr-2">👥</span>
                      Hierarchical Roles
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• 6 hierarchy levels</li>
                      <li>• System vs custom roles</li>
                      <li>• Role inheritance support</li>
                      <li>• Default role assignment</li>
                      <li>• User count tracking</li>
                    </ul>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <span className="mr-2">🧩</span>
                      UI Components
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• PermissionGuard wrapper</li>
                      <li>• PermissionButton component</li>
                      <li>• usePermissions hook</li>
                      <li>• Enhanced roles page</li>
                      <li>• Real-time permission checks</li>
                    </ul>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <span className="mr-2">🛡️</span>
                      Security & Audit
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Automatic audit logging</li>
                      <li>• Permission check tracking</li>
                      <li>• IP address & user agent</li>
                      <li>• Batch audit processing</li>
                      <li>• Sensitive operation protection</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "permissions" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  Permission Categories
                </h1>

                <div className="space-y-4">
                  {Object.entries(permissionCategories).map(
                    ([category, permissions]) => (
                      <div
                        key={category}
                        className="bg-white border rounded-lg p-6"
                      >
                        <h3 className="text-lg font-semibold mb-3">
                          {category}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {permissions.map((permission) => (
                            <div
                              key={permission}
                              className="bg-gray-50 px-3 py-2 rounded text-sm font-mono flex items-center"
                            >
                              {permission.includes("delete") ||
                              permission.includes("payroll") ||
                              permission.includes("compensation") ||
                              permission.includes("system_settings") ? (
                                <span
                                  className="w-2 h-2 bg-red-500 rounded-full mr-2"
                                  title="Sensitive"
                                ></span>
                              ) : (
                                <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                              )}
                              {permission}
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <span className="text-yellow-600 mr-2">⚠️</span>
                    <div>
                      <h4 className="font-semibold text-yellow-800">
                        Sensitive Permissions
                      </h4>
                      <p className="text-yellow-700 text-sm">
                        Red indicators mark sensitive permissions that require
                        special attention for security.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "roles" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  Built-in Roles
                </h1>

                <div className="space-y-4">
                  {builtInRoles.map((role) => (
                    <div
                      key={role.name}
                      className="bg-white border rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">{role.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${role.color}`}
                          >
                            Level {role.level}
                          </span>
                          {role.level <= 2 && (
                            <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                              System
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{role.desc}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Hierarchy:</span>
                          <div className="text-gray-600">
                            {role.level === 1
                              ? "Highest - Full system control"
                              : role.level === 2
                                ? "High - Organization admin"
                                : role.level <= 4
                                  ? "Medium - Department level"
                                  : "Standard - Limited access"}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Typical Users:</span>
                          <div className="text-gray-600">
                            {role.level === 1
                              ? "1-2 users"
                              : role.level === 2
                                ? "2-5 users"
                                : role.level === 3
                                  ? "5-15 users"
                                  : role.level === 4
                                    ? "3-10 users"
                                    : role.level === 5
                                      ? "10-25 users"
                                      : "50+ users"}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Key Permissions:</span>
                          <div className="text-gray-600">
                            {role.level === 1
                              ? "All permissions"
                              : role.level === 2
                                ? "Most except system settings"
                                : role.level === 3
                                  ? "Management + approvals"
                                  : role.level === 4
                                    ? "HR-specific functions"
                                    : role.level === 5
                                      ? "Team management"
                                      : "Basic employee access"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "implementation" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  Implementation Guide
                </h1>

                <div className="space-y-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      File Structure
                    </h3>
                    <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                      <div>
                        ├── packages/types/src/hr.ts # RBAC type definitions
                      </div>
                      <div>
                        ├── web/services/permissionService.ts # Core permission
                        service
                      </div>
                      <div>
                        ├── web/hooks/usePermissions.ts # React permission hooks
                      </div>
                      <div>
                        ├── web/components/ui/PermissionGuard.tsx # Permission
                        UI components
                      </div>
                      <div>
                        ├── web/pages/settings/roles.tsx # Role management
                        interface
                      </div>
                      <div>
                        └── web/components/ui/Sidebar.tsx # Navigation with
                        permissions
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Core Service</h3>
                    <p className="text-gray-600 mb-4">
                      The PermissionService is the heart of the RBAC system:
                    </p>
                    <div className="bg-gray-50 p-4 rounded">
                      <code className="text-sm">
                        <div>{/* Import the service */}</div>
                        <div>
                          import {"{"} permissionService {"}"} from
                          '@/services/permissionService';
                        </div>
                        <br />
                        <div>{/* Check permission */}</div>
                        <div>
                          const result = await permissionService.hasPermission(
                          {"{"}
                        </div>
                        <div>&nbsp;&nbsp;user_id: 'user-123',</div>
                        <div>&nbsp;&nbsp;resource: 'users',</div>
                        <div>&nbsp;&nbsp;action: 'create'</div>
                        <div>{"}"});</div>
                      </code>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Integration Steps
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold mr-3">
                          1
                        </span>
                        <div>
                          <div className="font-medium">Import Components</div>
                          <div className="text-gray-600 text-sm">
                            Import PermissionGuard or usePermissions hook
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold mr-3">
                          2
                        </span>
                        <div>
                          <div className="font-medium">Wrap Components</div>
                          <div className="text-gray-600 text-sm">
                            Use PermissionGuard around protected elements
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold mr-3">
                          3
                        </span>
                        <div>
                          <div className="font-medium">Define Permissions</div>
                          <div className="text-gray-600 text-sm">
                            Specify resource and action for access control
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold mr-3">
                          4
                        </span>
                        <div>
                          <div className="font-medium">Test Access</div>
                          <div className="text-gray-600 text-sm">
                            Verify permissions work as expected
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "components" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  UI Components
                </h1>

                <div className="space-y-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      PermissionGuard
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Conditionally renders content based on user permissions.
                    </p>
                    <div className="bg-gray-50 p-4 rounded">
                      <code className="text-sm">
                        <div>
                          &lt;PermissionGuard resource="users"
                          action="create"&gt;
                        </div>
                        <div>
                          &nbsp;&nbsp;&lt;button&gt;Create User&lt;/button&gt;
                        </div>
                        <div>&lt;/PermissionGuard&gt;</div>
                      </code>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      PermissionButton
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Smart button that only renders if user has required
                      permissions.
                    </p>
                    <div className="bg-gray-50 p-4 rounded">
                      <code className="text-sm">
                        <div>&lt;PermissionButton</div>
                        <div>&nbsp;&nbsp;resource="users"</div>
                        <div>&nbsp;&nbsp;action="delete"</div>
                        <div>&nbsp;&nbsp;variant="danger"</div>
                        <div>
                          &nbsp;&nbsp;onClick={"{"}handleDelete{"}"}
                        </div>
                        <div>&gt;</div>
                        <div>&nbsp;&nbsp;Delete User</div>
                        <div>&lt;/PermissionButton&gt;</div>
                      </code>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      usePermissions Hook
                    </h3>
                    <p className="text-gray-600 mb-4">
                      React hook for dynamic permission checking in components.
                    </p>
                    <div className="bg-gray-50 p-4 rounded">
                      <code className="text-sm">
                        <div>
                          const {"{"} hasPermission, userPermissions, loading{" "}
                          {"}"} = usePermissions();
                        </div>
                        <br />
                        <div>
                          const canEdit = hasPermission('users', 'update');
                        </div>
                        <div>
                          const canDelete = hasPermission('users', 'delete');
                        </div>
                      </code>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Higher-Order Component
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Protect entire components with permission requirements.
                    </p>
                    <div className="bg-gray-50 p-4 rounded">
                      <code className="text-sm">
                        <div>
                          const ProtectedAdmin = withPermissions(AdminPanel,{" "}
                          {"{"}
                        </div>
                        <div>
                          &nbsp;&nbsp;permissions: ['system_settings.update'],
                        </div>
                        <div>&nbsp;&nbsp;requireAll: true</div>
                        <div>{"}"});</div>
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "security" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  Security Features
                </h1>

                <div className="space-y-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <span className="mr-2">📊</span>
                      Audit Logging
                    </h3>
                    <p className="text-gray-600 mb-4">
                      All permission checks are automatically logged for
                      security and compliance.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>User ID & Action:</span>
                        <span className="font-mono text-gray-600">
                          user-123 → users.delete
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Result & Reason:</span>
                        <span className="font-mono text-gray-600">
                          denied → insufficient_permissions
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Context:</span>
                        <span className="font-mono text-gray-600">
                          IP: 192.168.1.1, Resource: user-456
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <span className="mr-2">⚠️</span>
                      Sensitive Operations
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Critical permissions are specially marked and protected.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">
                          Protected Operations
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• Delete operations</li>
                          <li>• Financial data access</li>
                          <li>• System configuration</li>
                          <li>• User management</li>
                          <li>• Data export</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Security Measures</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Enhanced logging</li>
                          <li>• Additional confirmations</li>
                          <li>• Restricted role assignment</li>
                          <li>• Audit trail requirements</li>
                          <li>• Multi-level approval</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <span className="mr-2">🔒</span>
                      Context-Aware Checks
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Permissions can include additional security constraints.
                    </p>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="font-medium text-sm">
                          Resource Ownership
                        </div>
                        <div className="text-sm text-gray-600">
                          Users can only edit their own records
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="font-medium text-sm">
                          Department Restrictions
                        </div>
                        <div className="text-sm text-gray-600">
                          Access limited to specific departments
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="font-medium text-sm">
                          Time-based Access
                        </div>
                        <div className="text-sm text-gray-600">
                          Permissions valid only during business hours
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "examples" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  Code Examples
                </h1>

                <div className="space-y-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Basic Permission Check
                    </h3>
                    <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                      <div className="text-green-600">
                        {/* Simple permission guard */}
                      </div>
                      <div>
                        &lt;PermissionGuard resource="users" action="create"&gt;
                      </div>
                      <div>
                        &nbsp;&nbsp;&lt;button&gt;Create User&lt;/button&gt;
                      </div>
                      <div>&lt;/PermissionGuard&gt;</div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Multiple Permissions
                    </h3>
                    <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                      <div className="text-green-600">
                        {/* Require ANY of the permissions */}
                      </div>
                      <div>
                        &lt;PermissionGuard permissions={"{"}['users.create',
                        'employees.create']{"}"}&gt;
                      </div>
                      <div>
                        &nbsp;&nbsp;&lt;button&gt;Add Person&lt;/button&gt;
                      </div>
                      <div>&lt;/PermissionGuard&gt;</div>
                      <br />
                      <div className="text-green-600">
                        {/* Require ALL permissions */}
                      </div>
                      <div>&lt;PermissionGuard</div>
                      <div>
                        &nbsp;&nbsp;permissions={"{"}['payroll.read',
                        'compensation.read']{"}"}
                      </div>
                      <div>
                        &nbsp;&nbsp;requireAll={"{"}true{"}"}
                      </div>
                      <div>&gt;</div>
                      <div>&nbsp;&nbsp;&lt;SalaryComponent /&gt;</div>
                      <div>&lt;/PermissionGuard&gt;</div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Hook Usage</h3>
                    <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                      <div className="text-green-600">
                        {/* Use the hook for dynamic checks */}
                      </div>
                      <div>function UserManagement() {"{"}</div>
                      <div>
                        &nbsp;&nbsp;const {"{"} hasPermission {"}"} =
                        usePermissions();
                      </div>
                      <br />
                      <div>
                        &nbsp;&nbsp;const canCreate = hasPermission('users',
                        'create');
                      </div>
                      <div>
                        &nbsp;&nbsp;const canDelete = hasPermission('users',
                        'delete');
                      </div>
                      <br />
                      <div>&nbsp;&nbsp;return (</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&lt;div&gt;</div>
                      <div>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"{"}canCreate &&
                        &lt;button&gt;Create&lt;/button&gt;{"}"}
                      </div>
                      <div>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"{"}canDelete &&
                        &lt;button&gt;Delete&lt;/button&gt;{"}"}
                      </div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;</div>
                      <div>&nbsp;&nbsp;);</div>
                      <div>{"}"}</div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Programmatic Checking
                    </h3>
                    <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                      <div className="text-green-600">
                        {/* Direct service usage */}
                      </div>
                      <div>
                        const result = await permissionService.hasPermission(
                        {"{"}
                      </div>
                      <div>&nbsp;&nbsp;user_id: 'user-123',</div>
                      <div>&nbsp;&nbsp;resource: 'payroll',</div>
                      <div>&nbsp;&nbsp;action: 'read',</div>
                      <div>&nbsp;&nbsp;resource_id: 'payroll-456'</div>
                      <div>{"}"});</div>
                      <br />
                      <div>if (result.allowed) {"{"}</div>
                      <div>
                        &nbsp;&nbsp;
                        <span className="text-green-600">
                          {/* User has permission */}
                        </span>
                      </div>
                      <div>
                        {"}"} else {"{"}
                      </div>
                      <div>
                        &nbsp;&nbsp;console.log('Denied:', result.reason);
                      </div>
                      <div>{"}"}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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

export default RBACGuidePage;
