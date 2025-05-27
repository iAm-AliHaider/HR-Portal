import { 
  Permission, 
  Role, 
  PermissionContext, 
  PermissionAction, 
  PermissionResource,
  PermissionAuditLog,
  UserWithRoles,
  PermissionGroup,
  RoleTemplate
} from '../../packages/types/src/hr';

class PermissionService {
  private static instance: PermissionService;
  private permissionsCache: Map<string, Permission[]> = new Map();
  private rolesCache: Map<string, Role[]> = new Map();
  private auditQueue: PermissionAuditLog[] = [];

  static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  // Core permission definitions - this would normally come from database
  private getDefaultPermissions(): Permission[] {
    return [
      // Dashboard & General
      { 
        id: 'dashboard.read', 
        name: 'View Dashboard', 
        description: 'Access to main dashboard', 
        resource: 'dashboards', 
        action: 'read', 
        category: 'General' 
      },
      { 
        id: 'reports.read', 
        name: 'View Reports', 
        description: 'Access to reports and analytics', 
        resource: 'reports', 
        action: 'read', 
        category: 'Analytics' 
      },
      { 
        id: 'reports.export', 
        name: 'Export Reports', 
        description: 'Export reports and data', 
        resource: 'exports', 
        action: 'export', 
        category: 'Analytics',
        is_sensitive: true 
      },

      // User Management
      { 
        id: 'users.read', 
        name: 'View Users', 
        description: 'View user profiles and information', 
        resource: 'users', 
        action: 'read', 
        category: 'User Management' 
      },
      { 
        id: 'users.create', 
        name: 'Create Users', 
        description: 'Create new user accounts', 
        resource: 'users', 
        action: 'create', 
        category: 'User Management' 
      },
      { 
        id: 'users.update', 
        name: 'Update Users', 
        description: 'Edit user profiles and information', 
        resource: 'users', 
        action: 'update', 
        category: 'User Management' 
      },
      { 
        id: 'users.delete', 
        name: 'Delete Users', 
        description: 'Delete user accounts', 
        resource: 'users', 
        action: 'delete', 
        category: 'User Management',
        is_sensitive: true 
      },
      { 
        id: 'user_roles.assign', 
        name: 'Assign Roles', 
        description: 'Assign roles to users', 
        resource: 'user_roles', 
        action: 'assign', 
        category: 'User Management' 
      },

      // Employee Management
      { 
        id: 'employees.read', 
        name: 'View Employees', 
        description: 'View employee records and profiles', 
        resource: 'employees', 
        action: 'read', 
        category: 'HR Management' 
      },
      { 
        id: 'employees.create', 
        name: 'Create Employees', 
        description: 'Add new employee records', 
        resource: 'employees', 
        action: 'create', 
        category: 'HR Management' 
      },
      { 
        id: 'employees.update', 
        name: 'Update Employees', 
        description: 'Edit employee information', 
        resource: 'employees', 
        action: 'update', 
        category: 'HR Management' 
      },
      { 
        id: 'employees.delete', 
        name: 'Delete Employees', 
        description: 'Remove employee records', 
        resource: 'employees', 
        action: 'delete', 
        category: 'HR Management',
        is_sensitive: true 
      },

      // Recruitment
      { 
        id: 'jobs.read', 
        name: 'View Jobs', 
        description: 'View job postings', 
        resource: 'jobs', 
        action: 'read', 
        category: 'Recruitment' 
      },
      { 
        id: 'jobs.create', 
        name: 'Create Jobs', 
        description: 'Create new job postings', 
        resource: 'jobs', 
        action: 'create', 
        category: 'Recruitment' 
      },
      { 
        id: 'jobs.update', 
        name: 'Update Jobs', 
        description: 'Edit job postings', 
        resource: 'jobs', 
        action: 'update', 
        category: 'Recruitment' 
      },
      { 
        id: 'jobs.delete', 
        name: 'Delete Jobs', 
        description: 'Remove job postings', 
        resource: 'jobs', 
        action: 'delete', 
        category: 'Recruitment' 
      },
      { 
        id: 'applications.read', 
        name: 'View Applications', 
        description: 'View job applications', 
        resource: 'applications', 
        action: 'read', 
        category: 'Recruitment' 
      },
      { 
        id: 'applications.update', 
        name: 'Update Applications', 
        description: 'Update application status and notes', 
        resource: 'applications', 
        action: 'update', 
        category: 'Recruitment' 
      },
      { 
        id: 'interviews.read', 
        name: 'View Interviews', 
        description: 'View interview schedules', 
        resource: 'interviews', 
        action: 'read', 
        category: 'Recruitment' 
      },
      { 
        id: 'interviews.create', 
        name: 'Schedule Interviews', 
        description: 'Schedule new interviews', 
        resource: 'interviews', 
        action: 'create', 
        category: 'Recruitment' 
      },
      { 
        id: 'offers.read', 
        name: 'View Offers', 
        description: 'View job offers', 
        resource: 'offers', 
        action: 'read', 
        category: 'Recruitment' 
      },
      { 
        id: 'offers.create', 
        name: 'Create Offers', 
        description: 'Create job offers', 
        resource: 'offers', 
        action: 'create', 
        category: 'Recruitment' 
      },
      { 
        id: 'offers.approve', 
        name: 'Approve Offers', 
        description: 'Approve job offers', 
        resource: 'offers', 
        action: 'approve', 
        category: 'Recruitment' 
      },

      // Leave Management
      { 
        id: 'leave_requests.read', 
        name: 'View Leave Requests', 
        description: 'View leave requests', 
        resource: 'leave_requests', 
        action: 'read', 
        category: 'Time & Attendance' 
      },
      { 
        id: 'leave_requests.create', 
        name: 'Submit Leave Requests', 
        description: 'Submit leave requests', 
        resource: 'leave_requests', 
        action: 'create', 
        category: 'Time & Attendance' 
      },
      { 
        id: 'leave_requests.approve', 
        name: 'Approve Leave', 
        description: 'Approve or reject leave requests', 
        resource: 'leave_requests', 
        action: 'approve', 
        category: 'Time & Attendance' 
      },

      // Expense Management
      { 
        id: 'expense_claims.read', 
        name: 'View Expenses', 
        description: 'View expense claims', 
        resource: 'expense_claims', 
        action: 'read', 
        category: 'Finance' 
      },
      { 
        id: 'expense_claims.create', 
        name: 'Submit Expenses', 
        description: 'Submit expense claims', 
        resource: 'expense_claims', 
        action: 'create', 
        category: 'Finance' 
      },
      { 
        id: 'expense_claims.approve', 
        name: 'Approve Expenses', 
        description: 'Approve expense claims', 
        resource: 'expense_claims', 
        action: 'approve', 
        category: 'Finance' 
      },

      // Payroll & Compensation
      { 
        id: 'payroll.read', 
        name: 'View Payroll', 
        description: 'Access payroll information', 
        resource: 'payroll', 
        action: 'read', 
        category: 'Finance',
        is_sensitive: true 
      },
      { 
        id: 'payroll.update', 
        name: 'Manage Payroll', 
        description: 'Process and manage payroll', 
        resource: 'payroll', 
        action: 'update', 
        category: 'Finance',
        is_sensitive: true 
      },
      { 
        id: 'compensation.read', 
        name: 'View Compensation', 
        description: 'View salary and compensation data', 
        resource: 'compensation', 
        action: 'read', 
        category: 'Finance',
        is_sensitive: true 
      },
      { 
        id: 'compensation.update', 
        name: 'Manage Compensation', 
        description: 'Update salary and compensation', 
        resource: 'compensation', 
        action: 'update', 
        category: 'Finance',
        is_sensitive: true 
      },

      // Facilities & Assets
      { 
        id: 'meeting_rooms.read', 
        name: 'View Meeting Rooms', 
        description: 'View meeting room information', 
        resource: 'meeting_rooms', 
        action: 'read', 
        category: 'Facilities' 
      },
      { 
        id: 'meeting_rooms.create', 
        name: 'Manage Meeting Rooms', 
        description: 'Create and manage meeting rooms', 
        resource: 'meeting_rooms', 
        action: 'create', 
        category: 'Facilities' 
      },
      { 
        id: 'room_bookings.read', 
        name: 'View Room Bookings', 
        description: 'View room booking schedules', 
        resource: 'room_bookings', 
        action: 'read', 
        category: 'Facilities' 
      },
      { 
        id: 'room_bookings.create', 
        name: 'Book Rooms', 
        description: 'Create room bookings', 
        resource: 'room_bookings', 
        action: 'create', 
        category: 'Facilities' 
      },
      { 
        id: 'equipment.read', 
        name: 'View Equipment', 
        description: 'View equipment inventory', 
        resource: 'equipment', 
        action: 'read', 
        category: 'Facilities' 
      },
      { 
        id: 'equipment.create', 
        name: 'Manage Equipment', 
        description: 'Create and manage equipment', 
        resource: 'equipment', 
        action: 'create', 
        category: 'Facilities' 
      },

      // Performance & Development
      { 
        id: 'performance_reviews.read', 
        name: 'View Performance Reviews', 
        description: 'View performance reviews', 
        resource: 'performance_reviews', 
        action: 'read', 
        category: 'Performance' 
      },
      { 
        id: 'performance_reviews.create', 
        name: 'Create Performance Reviews', 
        description: 'Create and manage performance reviews', 
        resource: 'performance_reviews', 
        action: 'create', 
        category: 'Performance' 
      },
      { 
        id: 'training_courses.read', 
        name: 'View Training Courses', 
        description: 'View available training courses', 
        resource: 'training_courses', 
        action: 'read', 
        category: 'Development' 
      },
      { 
        id: 'training_courses.create', 
        name: 'Manage Training Courses', 
        description: 'Create and manage training courses', 
        resource: 'training_courses', 
        action: 'create', 
        category: 'Development' 
      },

      // System Administration
      { 
        id: 'system_settings.read', 
        name: 'View System Settings', 
        description: 'View system configuration', 
        resource: 'system_settings', 
        action: 'read', 
        category: 'Administration' 
      },
      { 
        id: 'system_settings.update', 
        name: 'Manage System Settings', 
        description: 'Configure system settings', 
        resource: 'system_settings', 
        action: 'update', 
        category: 'Administration',
        is_sensitive: true 
      },
      { 
        id: 'audit_logs.read', 
        name: 'View Audit Logs', 
        description: 'Access audit logs and system logs', 
        resource: 'audit_logs', 
        action: 'read', 
        category: 'Administration',
        is_sensitive: true 
      },
      { 
        id: 'user_permissions.manage', 
        name: 'Manage Permissions', 
        description: 'Manage user roles and permissions', 
        resource: 'user_permissions', 
        action: 'manage_settings', 
        category: 'Administration',
        is_sensitive: true 
      }
    ];
  }

  // Core role definitions - this would normally come from database
  private getDefaultRoles(): Role[] {
    return [
      {
        id: 'admin',
        org_id: 'default',
        name: 'Administrator',
        description: 'Full system access',
        permissions: ['*.*'],
        is_system_role: true,
        hierarchy_level: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system',
        user_count: 2
      },
      {
        id: 'hr_director',
        org_id: 'default',
        name: 'HR Director',
        description: 'Oversees all HR operations',
        permissions: [
          'dashboard.read', 'reports.read', 'reports.export',
          'users.read', 'users.create', 'users.update', 'user_roles.assign',
          'employees.*', 'jobs.*', 'applications.*', 'interviews.*', 'offers.*',
          'leave_requests.*', 'expenses.*', 'payroll.*', 'compliance.*',
          'performance.*', 'training.*', 'policies.update', 'settings.read', 'settings.update',
          'reports.export', 'dashboard.analytics'
        ],
        is_system_role: false,
        hierarchy_level: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system',
        user_count: 1
      },
      {
        id: 'hr_manager',
        org_id: 'default',
        name: 'HR Manager',
        description: 'Manages HR processes and policies',
        permissions: [
          'dashboard.read', 'reports.read', 
          'users.read', 'user_roles.assign',
          'employees.read', 'employees.create', 'employees.update',
          'jobs.read', 'jobs.create', 'jobs.update',
          'applications.read', 'applications.update',
          'interviews.read', 'interviews.create',
          'offers.read', 'offers.create',
          'leave_requests.read', 'leave_requests.approve',
          'expenses.read', 'expenses.approve',
          'compliance.read', 'compliance.update',
          'performance.read', 'performance.update',
          'training.read', 'training.create', 'training.update'
        ],
        is_system_role: false,
        hierarchy_level: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system',
        user_count: 2
      },
      {
        id: 'hr',
        org_id: 'default',
        name: 'HR Specialist',
        description: 'Handles HR tasks and employee records',
        permissions: [
          'dashboard.read', 'reports.read',
          'employees.read', 'employees.create', 'employees.update',
          'jobs.read',
          'applications.read',
          'interviews.read',
          'leave_requests.read',
          'compliance.read',
          'training.read'
        ],
        is_system_role: false,
        hierarchy_level: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system',
        user_count: 3
      },
      {
        id: 'recruiting_manager',
        org_id: 'default',
        name: 'Recruiting Manager',
        description: 'Manages recruitment processes',
        permissions: [
          'dashboard.read', 'reports.read',
          'jobs.*', 'applications.*', 'interviews.*', 'offers.*',
          'employees.read'
        ],
        is_system_role: false,
        hierarchy_level: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system',
        user_count: 1
      },
      {
        id: 'recruiter',
        org_id: 'default',
        name: 'Recruiter',
        description: 'Handles recruitment and hiring',
        permissions: [
          'dashboard.read',
          'jobs.read', 'jobs.create', 'jobs.update',
          'applications.read', 'applications.update',
          'interviews.read', 'interviews.create',
          'employees.read'
        ],
        is_system_role: false,
        hierarchy_level: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system',
        user_count: 2
      },
      {
        id: 'manager',
        org_id: 'default',
        name: 'Department Manager',
        description: 'Manages a department and team',
        permissions: [
          'dashboard.read', 'reports.read',
          'employees.read',
          'leave_requests.read', 'leave_requests.approve',
          'expenses.read', 'expenses.approve',
          'performance.read', 'performance.create', 'performance.update',
          'training.read'
        ],
        is_system_role: false,
        hierarchy_level: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system',
        user_count: 8
      },
      {
        id: 'team_lead',
        org_id: 'default',
        name: 'Team Lead',
        description: 'Leads a team within a department',
        permissions: [
          'dashboard.read',
          'employees.read',
          'leave_requests.read', 'leave_requests.approve',
          'expenses.read', 'expenses.approve',
          'performance.read', 'performance.create'
        ],
        is_system_role: false,
        hierarchy_level: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system',
        user_count: 5
      },
      {
        id: 'employee',
        org_id: 'default',
        name: 'Employee',
        description: 'Regular employee',
        permissions: [
          'dashboard.read',
          'profile.read', 'profile.update',
          'leave_requests.read', 'leave_requests.create',
          'expenses.read', 'expenses.create',
          'training.read'
        ],
        is_system_role: false,
        hierarchy_level: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system',
        user_count: 25
      },
      {
        id: 'payroll_admin',
        org_id: 'default',
        name: 'Payroll Administrator',
        description: 'Manages payroll and compensation',
        permissions: [
          'dashboard.read',
          'employees.read',
          'payroll.*',
          'reports.read', 'reports.export'
        ],
        is_system_role: false,
        hierarchy_level: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system',
        user_count: 2
      },
      {
        id: 'compliance_officer',
        org_id: 'default',
        name: 'Compliance Officer',
        description: 'Oversees compliance and policies',
        permissions: [
          'dashboard.read',
          'compliance.*',
          'policies.*',
          'reports.read'
        ],
        is_system_role: false,
        hierarchy_level: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system',
        user_count: 1
      },
      {
        id: 'facilities_manager',
        org_id: 'default',
        name: 'Facilities Manager',
        description: 'Manages workplace facilities',
        permissions: [
          'dashboard.read',
          'facilities.*',
          'assets.*',
          'reports.read'
        ],
        is_system_role: false,
        hierarchy_level: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system',
        user_count: 1
      },
      {
        id: 'safety_officer',
        org_id: 'default',
        name: 'Safety Officer',
        description: 'Manages workplace safety',
        permissions: [
          'dashboard.read',
          'safety.*',
          'incidents.*',
          'compliance.read',
          'reports.read'
        ],
        is_system_role: false,
        hierarchy_level: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system',
        user_count: 1
      }
    ];
  }

  // Core permission checking method
  async hasPermission(context: PermissionContext): Promise<{ allowed: boolean; reason?: string }> {
    try {
      const userPermissions = await this.getUserPermissions(context.user_id);
      const permissionKey = `${context.resource}.${context.action}`;
      
      const hasDirectPermission = userPermissions.some(p => p.id === permissionKey);
      
      if (hasDirectPermission) {
        await this.logPermissionCheck(context, 'allowed');
        return { allowed: true };
      }

      // Check for wildcard permissions (e.g., *.read, users.*)
      const hasWildcardPermission = userPermissions.some(p => {
        const [resource, action] = p.id.split('.');
        return (resource === '*' && action === context.action) ||
               (resource === context.resource && action === '*') ||
               (resource === '*' && action === '*');
      });

      if (hasWildcardPermission) {
        await this.logPermissionCheck(context, 'allowed', 'wildcard_permission');
        return { allowed: true };
      }

      await this.logPermissionCheck(context, 'denied', 'permission_not_found');
      return { allowed: false, reason: 'Insufficient permissions' };
    } catch (error) {
      console.error('Permission check error:', error);
      await this.logPermissionCheck(context, 'denied', 'system_error');
      return { allowed: false, reason: 'Permission check failed' };
    }
  }

  // Get user permissions (with caching)
  async getUserPermissions(userId: string): Promise<Permission[]> {
    if (this.permissionsCache.has(userId)) {
      return this.permissionsCache.get(userId)!;
    }

    // In a real implementation, this would fetch from database
    // For now, we'll use mock data
    const allPermissions = this.getDefaultPermissions();
    const userRoles = await this.getUserRoles(userId);
    
    const userPermissions = allPermissions.filter(permission => 
      userRoles.some(role => role.permissions.includes(permission.id))
    );

    this.permissionsCache.set(userId, userPermissions);
    return userPermissions;
  }

  // Get user roles
  async getUserRoles(userId: string): Promise<Role[]> {
    // Mock implementation - in real app, fetch from database
    const allRoles = this.getDefaultRoles();
    
    // For demo purposes, assign roles based on user email patterns
    if (userId.includes('admin') || userId === 'mock-dev-user') {
      return allRoles.filter(r => r.id === 'admin');
    } else if (userId.includes('manager')) {
      return allRoles.filter(r => r.id === 'manager');
    } else if (userId.includes('hr')) {
      return allRoles.filter(r => r.id === 'hr_specialist');
    }
    
    return allRoles.filter(r => r.id === 'employee');
  }

  // Get all available permissions
  async getAllPermissions(): Promise<Permission[]> {
    return this.getDefaultPermissions();
  }

  // Get all available roles
  async getAllRoles(): Promise<Role[]> {
    return this.getDefaultRoles();
  }

  // Get permission groups for organization
  async getPermissionGroups(): Promise<PermissionGroup[]> {
    const permissions = this.getDefaultPermissions();
    const groups: Record<string, PermissionGroup> = {};

    permissions.forEach(permission => {
      if (!groups[permission.category]) {
        groups[permission.category] = {
          id: permission.category.toLowerCase().replace(/ /g, '_'),
          name: permission.category,
          description: `Permissions related to ${permission.category}`,
          category: permission.category,
          permissions: [],
          icon: this.getCategoryIcon(permission.category),
          color: this.getCategoryColor(permission.category)
        };
      }
      groups[permission.category].permissions.push(permission.id);
    });

    return Object.values(groups);
  }

  // Helper method to get category icons
  private getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'General': '🏠',
      'User Management': '👥',
      'HR Management': '👤',
      'Recruitment': '🎯',
      'Time & Attendance': '⏰',
      'Finance': '💰',
      'Facilities': '🏢',
      'Performance': '📈',
      'Development': '🎓',
      'Analytics': '📊',
      'Administration': '⚙️'
    };
    return icons[category] || '📋';
  }

  // Helper method to get category colors
  private getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'General': 'blue',
      'User Management': 'purple',
      'HR Management': 'green',
      'Recruitment': 'orange',
      'Time & Attendance': 'teal',
      'Finance': 'red',
      'Facilities': 'indigo',
      'Performance': 'pink',
      'Development': 'yellow',
      'Analytics': 'cyan',
      'Administration': 'gray'
    };
    return colors[category] || 'gray';
  }

  // Log permission checks for audit
  private async logPermissionCheck(
    context: PermissionContext, 
    result: 'allowed' | 'denied', 
    reason?: string
  ): Promise<void> {
    const auditLog: PermissionAuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      org_id: 'default',
      user_id: context.user_id,
      action: 'permission_checked',
      resource: context.resource,
      resource_id: context.resource_id,
      permission_action: context.action,
      result,
      reason,
      context: context.additional_context || {},
      timestamp: new Date().toISOString()
    };

    this.auditQueue.push(auditLog);
    
    // In production, batch these and send to audit service
    if (this.auditQueue.length > 100) {
      await this.flushAuditQueue();
    }
  }

  // Flush audit queue
  private async flushAuditQueue(): Promise<void> {
    if (this.auditQueue.length === 0) return;
    
    // In production, send to audit service/database
    console.log('Flushing audit queue:', this.auditQueue.length, 'entries');
    this.auditQueue = [];
  }

  // Clear caches
  clearCache(): void {
    this.permissionsCache.clear();
    this.rolesCache.clear();
  }

  // Bulk permission check for UI efficiency
  async checkMultiplePermissions(
    userId: string, 
    checks: Array<{ resource: PermissionResource; action: PermissionAction }>
  ): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const check of checks) {
      const context: PermissionContext = {
        user_id: userId,
        resource: check.resource,
        action: check.action
      };
      
      const result = await this.hasPermission(context);
      const key = `${check.resource}.${check.action}`;
      results[key] = result.allowed;
    }
    
    return results;
  }
}

export const permissionService = PermissionService.getInstance();
export default permissionService; 