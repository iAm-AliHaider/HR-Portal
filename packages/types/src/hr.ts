export type OfferStatus = 
  | 'draft' 
  | 'pending_approval' 
  | 'approved' 
  | 'rejected'
  | 'sent' 
  | 'accepted' 
  | 'declined'
  | 'negotiating'
  | 'expired'
  | 'withdrawn'
  | 'pending'; // for backward compatibility

export type ApplicationStatus = 
  | 'new' 
  | 'screening' 
  | 'interview' 
  | 'assessment' 
  | 'shortlisted' 
  | 'offered' 
  | 'hired' 
  | 'rejected' 
  | 'withdrawn'
  | 'declined'; // For declined offers

export type Offer = {
  id: string;
  org_id: string;
  application_id?: string;
  job_id: string;
  candidate_id: string;
  status: OfferStatus;
  position_title: string;
  salary: {
    amount: number;
    currency: string;
    period: 'yearly' | 'monthly' | 'hourly';
  };
  equity?: string | {
    amount: number;
    type: 'options' | 'rsus' | 'shares';
    vesting_schedule?: string;
  };
  bonus?: {
    amount: number;
    currency: string;
    description?: string;
  } | {
    amount: string | number;
    currency: string;
    type: 'signing' | 'performance' | 'retention';
    conditions?: string;
  }[];
  start_date: string;
  expiration_date: string;
  benefits: string[];
  created_at: string;
  created_by: string;
  approved_by?: string;
  approval_date?: string;
  rejected_by?: string;
  rejection_date?: string;
  rejection_reason?: string;
  sent_at?: string;
  accepted_at?: string;
  declined_at?: string;
  decline_reason?: string;
  withdrawn_at?: string;
  withdraw_reason?: string;
  submitted_at?: string;
  deadline_extended?: boolean;
  notes?: string;
  candidate_notes?: string;
};

// Facilities & Resource Management Types
export interface MeetingRoom {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  location: string;
  building?: string;
  floor?: string;
  capacity: number;
  equipment: string[];
  amenities: string[];
  hourly_rate?: number;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  video_conference_enabled?: boolean;
  accessibility_features: string[];
  booking_rules?: {
    min_duration: number;
    max_duration: number;
    advance_booking_hours: number;
    max_advance_days: number;
    requires_approval: boolean;
    business_hours_only: boolean;
  };
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Asset {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  category: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  asset_tag?: string;
  location: string;
  status: 'available' | 'in_use' | 'maintenance' | 'retired';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  purchase_date?: string;
  warranty_expiry?: string;
  specifications: Record<string, any>;
  hourly_rate?: number;
  daily_rate?: number;
  responsible_person?: string;
  maintenance_schedule?: string;
  booking_rules?: {
    max_duration_hours: number;
    advance_booking_hours: number;
    requires_approval: boolean;
    checkout_required: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

export interface RoomBooking {
  id: string;
  org_id: string;
  room_id: string;
  booked_by: string;
  booking_type: 'meeting' | 'interview' | 'training' | 'event' | 'other';
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  attendees?: string[];
  notes?: string;
  room?: MeetingRoom;
  created_at?: string;
  updated_at?: string;
}

export interface AssetBooking {
  id: string;
  org_id: string;
  asset_id: string;
  booked_by: string;
  booking_type: 'training' | 'project' | 'presentation' | 'development' | 'other';
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  checkout_location?: string;
  return_location?: string;
  notes?: string;
  asset?: Asset;
  created_at?: string;
  updated_at?: string;
}

export interface BookingConflict {
  id: string;
  org_id: string;
  resource_type: 'room' | 'asset';
  resource_id: string;
  conflicting_bookings: string[];
  conflict_type: 'overlap' | 'double_booking' | 'maintenance' | 'unavailable';
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  resolution_notes?: string;
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
}

// =====================
// RBAC & Permissions System
// =====================

export type PermissionAction = 
  | 'create' | 'read' | 'update' | 'delete' 
  | 'approve' | 'reject' | 'submit' | 'assign' 
  | 'export' | 'import' | 'archive' | 'restore'
  | 'view_details' | 'view_list' | 'view_reports'
  | 'manage_settings' | 'bulk_edit' | 'bulk_delete';

export type PermissionResource = 
  // User Management
  | 'users' | 'user_profiles' | 'user_roles' | 'user_permissions'
  // HR Core
  | 'employees' | 'departments' | 'positions' | 'org_chart'
  // Recruitment
  | 'jobs' | 'applications' | 'candidates' | 'interviews' | 'offers'
  // Performance & Development
  | 'performance_reviews' | 'goals' | 'training_courses' | 'certifications'
  // Time & Attendance
  | 'timesheets' | 'attendance' | 'leave_requests' | 'leave_balances'
  // Payroll & Benefits
  | 'payroll' | 'benefits' | 'compensation' | 'expense_claims'
  // Facilities & Assets
  | 'meeting_rooms' | 'equipment' | 'room_bookings' | 'asset_bookings'
  // Compliance & Documents
  | 'documents' | 'policies' | 'compliance_records' | 'workflows'
  // Reports & Analytics
  | 'reports' | 'analytics' | 'dashboards' | 'exports'
  // System Administration
  | 'system_settings' | 'audit_logs' | 'integrations' | 'backups';

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: PermissionResource;
  action: PermissionAction;
  category: string;
  is_sensitive?: boolean; // For sensitive operations like delete, export sensitive data
  conditions?: PermissionCondition[]; // Additional constraints
}

export interface PermissionCondition {
  type: 'ownership' | 'department' | 'time_window' | 'approval_required' | 'custom';
  field?: string;
  operator?: 'equals' | 'not_equals' | 'in' | 'not_in' | 'greater_than' | 'less_than';
  value?: any;
  description: string;
}

export interface Role {
  id: string;
  org_id: string;
  name: string;
  description: string;
  permissions: string[]; // Permission IDs
  is_system_role: boolean; // Cannot be deleted/modified
  is_default?: boolean; // Default role for new users
  hierarchy_level: number; // For role hierarchy (1 = highest, 10 = lowest)
  inherits_from?: string[]; // Role IDs that this role inherits permissions from
  conditions?: RoleCondition[];
  created_at: string;
  updated_at: string;
  created_by: string;
  user_count?: number;
}

export interface RoleCondition {
  type: 'department_restriction' | 'time_based' | 'ip_restriction' | 'custom';
  field?: string;
  value?: any;
  description: string;
}

export interface UserRole {
  id: string;
  org_id: string;
  user_id: string;
  role_id: string;
  assigned_by: string;
  assigned_at: string;
  expires_at?: string;
  is_active: boolean;
  conditions?: UserRoleCondition[];
}

export interface UserRoleCondition {
  type: 'temporary' | 'project_based' | 'location_based' | 'custom';
  value?: any;
  expires_at?: string;
  description: string;
}

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  permissions: string[];
  icon?: string;
  color?: string;
}

// Enhanced User with RBAC
export interface UserWithRoles {
  id: string;
  email: string;
  full_name: string;
  roles: Role[];
  permissions: Permission[];
  effective_permissions: string[]; // Computed permissions including inherited
  is_admin: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

// Permission Check Context
export interface PermissionContext {
  user_id: string;
  resource: PermissionResource;
  action: PermissionAction;
  resource_id?: string;
  resource_data?: any;
  department_id?: string;
  additional_context?: Record<string, any>;
}

// Audit Logging for Permissions
export interface PermissionAuditLog {
  id: string;
  org_id: string;
  user_id: string;
  action: 'permission_granted' | 'permission_denied' | 'role_assigned' | 'role_removed' | 'permission_checked';
  resource: PermissionResource;
  resource_id?: string;
  permission_action: PermissionAction;
  result: 'allowed' | 'denied';
  reason?: string;
  context: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

// Role Templates for different organization types
export interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  organization_type: 'startup' | 'small_business' | 'enterprise' | 'non_profit' | 'government';
  roles: Omit<Role, 'id' | 'org_id' | 'created_at' | 'updated_at' | 'created_by'>[];
  permission_groups: PermissionGroup[];
} 