// Enhanced Database Service Layer for HR Portal
// Provides comprehensive CRUD operations with Supabase integration

import { supabase } from "../supabase/client";

// Enhanced Types for Database Operations
export interface DatabaseResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
  count?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  orderBy?: string;
  ascending?: boolean;
}

export interface FilterParams {
  column: string;
  operator:
    | "eq"
    | "neq"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "like"
    | "ilike"
    | "in";
  value: any;
}

// Enhanced Employee/Profile Operations
export class EmployeeService {
  static async getAll(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    try {
      let query = supabase.from("profiles").select(`
          *,
          department:departments(name),
          manager:profiles!manager_id(name, email),
          skills:employee_skills(
            skill:skills(name, category),
            proficiency_level
          )
        `);

      // Apply filters with proper type handling
      if (filters) {
        filters.forEach((filter) => {
          switch (filter.operator) {
            case "eq":
              query = query.eq(filter.column, filter.value);
              break;
            case "neq":
              query = query.neq(filter.column, filter.value);
              break;
            case "gt":
              query = query.gt(filter.column, filter.value);
              break;
            case "gte":
              query = query.gte(filter.column, filter.value);
              break;
            case "lt":
              query = query.lt(filter.column, filter.value);
              break;
            case "lte":
              query = query.lte(filter.column, filter.value);
              break;
            case "like":
              query = query.like(filter.column, filter.value);
              break;
            case "ilike":
              query = query.ilike(filter.column, filter.value);
              break;
            case "in":
              query = query.in(filter.column, filter.value);
              break;
          }
        });
      }

      // Apply pagination and ordering
      if (pagination) {
        const {
          page,
          limit,
          orderBy = "created_at",
          ascending = false,
        } = pagination;
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        query = query.order(orderBy, { ascending }).range(start, end);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching employees:", error);
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true, count };
    } catch (err) {
      console.error("Exception in getAll employees:", err);
      return { data: null, error: "Failed to fetch employees", success: false };
    }
  }

  static async getById(id: string): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          *,
          department:departments(name, description),
          manager:profiles!manager_id(name, email),
          skills:employee_skills(
            skill:skills(name, category),
            proficiency_level
          ),
          leave_balances(
            *,
            leave_type:leave_types(name, color)
          )
        `,
        )
        .eq("id", id)
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to fetch employee", success: false };
    }
  }

  static async create(employee: any): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert([
          {
            name: employee.name,
            email: employee.email,
            department: employee.department,
            position: employee.position,
            phone: employee.phone,
            employee_id: employee.employee_id,
            hire_date: employee.hire_date,
            manager_id: employee.manager_id,
            role: employee.role || "employee",
          },
        ])
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to create employee", success: false };
    }
  }

  static async update(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to update employee", success: false };
    }
  }

  static async delete(id: string): Promise<DatabaseResponse<boolean>> {
    try {
      const { error } = await supabase.from("profiles").delete().eq("id", id);

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: true, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to delete employee", success: false };
    }
  }

  static async search(query: string): Promise<DatabaseResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .or(
          `name.ilike.%${query}%,email.ilike.%${query}%,position.ilike.%${query}%`,
        )
        .limit(20);

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Search failed", success: false };
    }
  }
}

// Enhanced Jobs Service
export class JobsService {
  static async getAll(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    try {
      let query = supabase.from("jobs").select(`
          *,
          hiring_manager:profiles!hiring_manager_id(name, email),
          applications_count:applications(count)
        `);

      if (filters) {
        filters.forEach((filter) => {
          switch (filter.operator) {
            case "eq":
              query = query.eq(filter.column, filter.value);
              break;
            case "neq":
              query = query.neq(filter.column, filter.value);
              break;
            case "gt":
              query = query.gt(filter.column, filter.value);
              break;
            case "gte":
              query = query.gte(filter.column, filter.value);
              break;
            case "lt":
              query = query.lt(filter.column, filter.value);
              break;
            case "lte":
              query = query.lte(filter.column, filter.value);
              break;
            case "like":
              query = query.like(filter.column, filter.value);
              break;
            case "ilike":
              query = query.ilike(filter.column, filter.value);
              break;
            case "in":
              query = query.in(filter.column, filter.value);
              break;
          }
        });
      }

      if (pagination) {
        const {
          page,
          limit,
          orderBy = "created_at",
          ascending = false,
        } = pagination;
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        query = query.order(orderBy, { ascending }).range(start, end);
      }

      const { data, error, count } = await query;

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true, count };
    } catch (err) {
      return { data: null, error: "Failed to fetch jobs", success: false };
    }
  }

  static async create(job: any): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .insert([
          {
            title: job.title,
            department: job.department,
            location: job.location,
            description: job.description,
            requirements: job.requirements,
            salary_range: job.salary_range,
            employment_type: job.employment_type,
            status: job.status || "draft",
            posting_date: job.posting_date,
            closing_date: job.closing_date,
            hiring_manager_id: job.hiring_manager_id,
          },
        ])
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to create job", success: false };
    }
  }

  static async update(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to update job", success: false };
    }
  }

  static async delete(id: string): Promise<DatabaseResponse<boolean>> {
    try {
      const { error } = await supabase.from("jobs").delete().eq("id", id);

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: true, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to delete job", success: false };
    }
  }
}

// Enhanced Leave Management Service
export class LeaveService {
  static async getRequests(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    try {
      let query = supabase.from("leave_requests").select(`
          *,
          employee:profiles!employee_id(name, email, department),
          leave_type:leave_types(name, color),
          approver:profiles!approver_id(name, email)
        `);

      if (filters) {
        filters.forEach((filter) => {
          switch (filter.operator) {
            case "eq":
              query = query.eq(filter.column, filter.value);
              break;
            case "neq":
              query = query.neq(filter.column, filter.value);
              break;
            case "gt":
              query = query.gt(filter.column, filter.value);
              break;
            case "gte":
              query = query.gte(filter.column, filter.value);
              break;
            case "lt":
              query = query.lt(filter.column, filter.value);
              break;
            case "lte":
              query = query.lte(filter.column, filter.value);
              break;
            case "like":
              query = query.like(filter.column, filter.value);
              break;
            case "ilike":
              query = query.ilike(filter.column, filter.value);
              break;
            case "in":
              query = query.in(filter.column, filter.value);
              break;
          }
        });
      }

      if (pagination) {
        const {
          page,
          limit,
          orderBy = "created_at",
          ascending = false,
        } = pagination;
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        query = query.order(orderBy, { ascending }).range(start, end);
      }

      const { data, error, count } = await query;

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true, count };
    } catch (err) {
      return {
        data: null,
        error: "Failed to fetch leave requests",
        success: false,
      };
    }
  }

  static async createRequest(
    leaveRequest: any,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .insert([
          {
            employee_id: leaveRequest.employee_id,
            leave_type_id: leaveRequest.leave_type_id,
            start_date: leaveRequest.start_date,
            end_date: leaveRequest.end_date,
            days: leaveRequest.days,
            reason: leaveRequest.reason,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to create leave request",
        success: false,
      };
    }
  }

  static async approveRequest(
    id: string,
    approver_id: string,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .update({
          status: "approved",
          approver_id,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to approve leave request",
        success: false,
      };
    }
  }

  static async rejectRequest(
    id: string,
    approver_id: string,
    rejection_reason: string,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .update({
          status: "rejected",
          approver_id,
          rejection_reason,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to reject leave request",
        success: false,
      };
    }
  }
}

// Enhanced Assets Service
export class AssetsService {
  static async getAll(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    try {
      let query = supabase.from("assets").select("*");

      if (filters) {
        filters.forEach((filter) => {
          switch (filter.operator) {
            case "eq":
              query = query.eq(filter.column, filter.value);
              break;
            case "neq":
              query = query.neq(filter.column, filter.value);
              break;
            case "gt":
              query = query.gt(filter.column, filter.value);
              break;
            case "gte":
              query = query.gte(filter.column, filter.value);
              break;
            case "lt":
              query = query.lt(filter.column, filter.value);
              break;
            case "lte":
              query = query.lte(filter.column, filter.value);
              break;
            case "like":
              query = query.like(filter.column, filter.value);
              break;
            case "ilike":
              query = query.ilike(filter.column, filter.value);
              break;
            case "in":
              query = query.in(filter.column, filter.value);
              break;
          }
        });
      }

      if (pagination) {
        const {
          page,
          limit,
          orderBy = "created_at",
          ascending = false,
        } = pagination;
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        query = query.order(orderBy, { ascending }).range(start, end);
      }

      const { data, error, count } = await query;

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true, count };
    } catch (err) {
      return { data: null, error: "Failed to fetch assets", success: false };
    }
  }

  static async create(asset: any): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("assets")
        .insert([
          {
            name: asset.name,
            description: asset.description,
            category: asset.category,
            brand: asset.brand,
            model: asset.model,
            serial_number: asset.serial_number,
            asset_tag: asset.asset_tag,
            location: asset.location,
            status: asset.status || "available",
            condition: asset.condition || "good",
            purchase_date: asset.purchase_date,
            warranty_expiry: asset.warranty_expiry,
            specifications: asset.specifications || {},
            responsible_person: asset.responsible_person,
          },
        ])
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to create asset", success: false };
    }
  }

  static async update(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("assets")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to update asset", success: false };
    }
  }

  static async delete(id: string): Promise<DatabaseResponse<boolean>> {
    try {
      const { error } = await supabase.from("assets").delete().eq("id", id);

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: true, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to delete asset", success: false };
    }
  }
}

// Enhanced Analytics and Reporting Service
export class AnalyticsService {
  static async getDashboardStats(): Promise<DatabaseResponse<any>> {
    try {
      const [employees, jobs, leaveRequests, assets] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, department, role", { count: "exact", head: true }),
        supabase
          .from("jobs")
          .select("id, status", { count: "exact", head: true }),
        supabase
          .from("leave_requests")
          .select("id, status", { count: "exact", head: true }),
        supabase
          .from("assets")
          .select("id, status", { count: "exact", head: true }),
      ]);

      const stats = {
        total_employees: employees.count || 0,
        active_jobs: jobs.count || 0,
        pending_leave_requests: leaveRequests.count || 0,
        total_assets: assets.count || 0,
      };

      return { data: stats, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to fetch dashboard stats",
        success: false,
      };
    }
  }

  static async getEmployeesByDepartment(): Promise<DatabaseResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("department")
        .not("department", "is", null);

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      // Group by department
      const departmentCounts = data.reduce((acc: any, emp: any) => {
        acc[emp.department] = (acc[emp.department] || 0) + 1;
        return acc;
      }, {});

      const result = Object.entries(departmentCounts).map(
        ([department, count]) => ({
          department,
          count,
        }),
      );

      return { data: result, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to fetch department analytics",
        success: false,
      };
    }
  }

  static async getLeaveAnalytics(): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase.from("leave_requests").select(`
          status,
          days,
          leave_type:leave_types(name)
        `);

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      const analytics = {
        total_requests: data.length,
        approved: data.filter((req) => req.status === "approved").length,
        pending: data.filter((req) => req.status === "pending").length,
        rejected: data.filter((req) => req.status === "rejected").length,
        total_days_requested: data.reduce(
          (sum, req) => sum + (req.days || 0),
          0,
        ),
      };

      return { data: analytics, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to fetch leave analytics",
        success: false,
      };
    }
  }
}

// Enhanced Authentication Service
export class AuthService {
  static async getCurrentUser(): Promise<DatabaseResponse<any>> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return { data: null, error: "No authenticated user", success: false };
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        return { data: null, error: profileError.message, success: false };
      }

      return { data: { ...user, profile }, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to get current user",
        success: false,
      };
    }
  }

  static async signIn(
    email: string,
    password: string,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Sign in failed", success: false };
    }
  }

  static async signUp(
    email: string,
    password: string,
    userData: any,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Sign up failed", success: false };
    }
  }

  static async signOut(): Promise<DatabaseResponse<boolean>> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: true, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Sign out failed", success: false };
    }
  }
}

// Export all services
export {
  AnalyticsService,
  AssetsService,
  AuthService,
  EmployeeService,
  JobsService,
  LeaveService,
};
