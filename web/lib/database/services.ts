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

// Helper function to apply filters
function applyFilters(query: any, filters?: FilterParams[]) {
  if (!filters) return query;

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

  return query;
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
          manager:profiles!manager_id(name, email)
        `);

      query = applyFilters(query, filters);

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
          manager:profiles!manager_id(name, email)
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
          hiring_manager:profiles!hiring_manager_id(name, email)
        `);

      query = applyFilters(query, filters);

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
  /**
   * Get all leave requests with filtering and pagination
   */
  static async getRequests(
    pagination: PaginationParams,
    filters: FilterParams[] = [],
  ): Promise<DatabaseResponse<any[]>> {
    try {
      let query = supabase.from("leave_requests").select(`
          *,
          employee:employees(id, name, email, department, position),
          leave_type:leave_types(id, name, days_per_year, requires_approval),
          approver:employees!approver_id(id, name, email)
        `);

      // Apply filters
      filters.forEach((filter) => {
        query = applyFilters(query, filter);
      });

      // Apply pagination and ordering
      const { data, error, count } = await query
        .order(pagination.orderBy || "created_at", {
          ascending: pagination.ascending ?? false,
        })
        .range(
          (pagination.page - 1) * pagination.limit,
          pagination.page * pagination.limit - 1,
        );

      if (error) {
        console.error("Error fetching leave requests:", error);
        return { success: false, error: error.message, data: null };
      }

      return {
        success: true,
        data: data || [],
        error: null,
        count: count || 0,
      };
    } catch (error) {
      console.error("Unexpected error in LeaveService.getRequests:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        data: null,
      };
    }
  }

  /**
   * Get leave request by ID
   */
  static async getById(id: string): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .select(
          `
          *,
          employee:employees(id, name, email, department, position),
          leave_type:leave_types(id, name, days_per_year, requires_approval),
          approver:employees!approver_id(id, name, email)
        `,
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching leave request:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error in LeaveService.getById:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Create new leave request
   */
  static async create(leaveData: any): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .insert([
          {
            ...leaveData,
            status: "pending",
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating leave request:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error in LeaveService.create:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Update leave request
   */
  static async update(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating leave request:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error in LeaveService.update:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Delete leave request
   */
  static async delete(id: string): Promise<DatabaseResponse<boolean>> {
    try {
      const { error } = await supabase
        .from("leave_requests")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting leave request:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data: true };
    } catch (error) {
      console.error("Unexpected error in LeaveService.delete:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Approve leave request
   */
  static async approve(
    id: string,
    approverId: string,
    comments?: string,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .update({
          status: "approved",
          approver_id: approverId,
          approval_date: new Date().toISOString(),
          approver_comments: comments,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error approving leave request:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error in LeaveService.approve:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Reject leave request
   */
  static async reject(
    id: string,
    approverId: string,
    comments?: string,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .update({
          status: "rejected",
          approver_id: approverId,
          approval_date: new Date().toISOString(),
          approver_comments: comments,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error rejecting leave request:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error in LeaveService.reject:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get leave types
   */
  static async getLeaveTypes(): Promise<DatabaseResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from("leave_types")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching leave types:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Unexpected error in LeaveService.getLeaveTypes:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get leave balance for employee
   */
  static async getLeaveBalance(
    employeeId: string,
  ): Promise<DatabaseResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from("leave_balances")
        .select(
          `
          *,
          leave_type:leave_types(id, name, days_per_year)
        `,
        )
        .eq("employee_id", employeeId);

      if (error) {
        console.error("Error fetching leave balance:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Unexpected error in LeaveService.getLeaveBalance:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get leave statistics
   */
  static async getLeaveStats(): Promise<DatabaseResponse<any>> {
    try {
      const { data: requests, error } = await supabase
        .from("leave_requests")
        .select("status, days, created_at");

      if (error) {
        console.error("Error fetching leave stats:", error);
        return { success: false, error: error.message };
      }

      const stats = {
        total_requests: requests?.length || 0,
        pending_requests:
          requests?.filter((r) => r.status === "pending").length || 0,
        approved_requests:
          requests?.filter((r) => r.status === "approved").length || 0,
        rejected_requests:
          requests?.filter((r) => r.status === "rejected").length || 0,
        total_days_requested:
          requests?.reduce((sum, r) => sum + (r.days || 0), 0) || 0,
        approved_days:
          requests
            ?.filter((r) => r.status === "approved")
            .reduce((sum, r) => sum + (r.days || 0), 0) || 0,
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error("Unexpected error in LeaveService.getLeaveStats:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Search leave requests
   */
  static async search(
    query: string,
    pagination: PaginationParams,
  ): Promise<DatabaseResponse<any[]>> {
    try {
      const { data, error, count } = await supabase
        .from("leave_requests")
        .select(
          `
          *,
          employee:employees(id, name, email, department),
          leave_type:leave_types(id, name)
        `,
        )
        .or(
          `employee.name.ilike.%${query}%,leave_type.name.ilike.%${query}%,status.ilike.%${query}%`,
        )
        .order(pagination.orderBy || "created_at", {
          ascending: pagination.ascending ?? false,
        })
        .range(
          (pagination.page - 1) * pagination.limit,
          pagination.page * pagination.limit - 1,
        );

      if (error) {
        console.error("Error searching leave requests:", error);
        return { success: false, error: error.message };
      }

      return {
        success: true,
        data: data || [],
        count: count || 0,
      };
    } catch (error) {
      console.error("Unexpected error in LeaveService.search:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
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

      query = applyFilters(query, filters);

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
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase
          .from("leave_requests")
          .select("id", { count: "exact", head: true }),
        supabase.from("assets").select("id", { count: "exact", head: true }),
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
      const { data, error } = await supabase
        .from("leave_requests")
        .select("status, days");

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

// Enhanced Applications Management Service
export class ApplicationsService {
  static async getAll(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    try {
      let query = supabase.from("applications").select(`
          *,
          job:jobs(id, title, department, location, status),
          candidate:profiles!applicant_id(id, name, email, phone),
          stage:job_stages(id, name, description, order_index),
          reviews:application_reviews(
            id, reviewer_id, score, notes, created_at,
            reviewer:profiles(name, email)
          )
        `);

      query = applyFilters(query, filters);

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
        error: "Failed to fetch applications",
        success: false,
      };
    }
  }

  static async getById(id: string): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          *,
          job:jobs(id, title, department, location, status, description, requirements),
          candidate:profiles!applicant_id(id, name, email, phone, department, position),
          stage:job_stages(id, name, description, order_index),
          reviews:application_reviews(
            id, reviewer_id, score, notes, feedback, created_at,
            reviewer:profiles(name, email)
          ),
          interviews:interviews(
            id, scheduled_at, duration, type, location, status,
            interviewer:profiles(name, email)
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
      return {
        data: null,
        error: "Failed to fetch application",
        success: false,
      };
    }
  }

  static async create(application: any): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("applications")
        .insert([
          {
            job_id: application.job_id,
            applicant_id: application.applicant_id,
            candidate_name: application.candidate_name,
            candidate_email: application.candidate_email,
            candidate_phone: application.candidate_phone,
            resume_url: application.resume_url,
            cover_letter_url: application.cover_letter_url,
            status: application.status || "applied",
            stage_id: application.stage_id,
            source: application.source || "website",
            salary_expectation: application.salary_expectation,
            availability_date: application.availability_date,
            years_experience: application.years_experience,
            skills: application.skills || [],
            education: application.education || [],
            work_experience: application.work_experience || [],
            custom_fields: application.custom_fields || {},
            notes: application.notes,
          },
        ])
        .select(
          `
          *,
          job:jobs(id, title, department),
          candidate:profiles!applicant_id(id, name, email)
        `,
        )
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to create application",
        success: false,
      };
    }
  }

  static async update(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("applications")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select(
          `
          *,
          job:jobs(id, title, department),
          candidate:profiles!applicant_id(id, name, email)
        `,
        )
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to update application",
        success: false,
      };
    }
  }

  static async delete(id: string): Promise<DatabaseResponse<boolean>> {
    try {
      const { error } = await supabase
        .from("applications")
        .delete()
        .eq("id", id);

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: true, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to delete application",
        success: false,
      };
    }
  }

  static async updateStatus(
    id: string,
    status: string,
    notes?: string,
  ): Promise<DatabaseResponse<any>> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (notes) {
        updateData.status_notes = notes;
      }

      const { data, error } = await supabase
        .from("applications")
        .update(updateData)
        .eq("id", id)
        .select(
          `
          *,
          job:jobs(id, title, department),
          candidate:profiles!applicant_id(id, name, email)
        `,
        )
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to update application status",
        success: false,
      };
    }
  }

  static async moveToStage(
    id: string,
    stage_id: string,
    notes?: string,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("applications")
        .update({
          stage_id,
          stage_notes: notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select(
          `
          *,
          job:jobs(id, title, department),
          candidate:profiles!applicant_id(id, name, email),
          stage:job_stages(id, name, description)
        `,
        )
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to move application to stage",
        success: false,
      };
    }
  }

  static async addReview(
    application_id: string,
    reviewer_id: string,
    score: number,
    notes: string,
    feedback?: string,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("application_reviews")
        .insert([
          {
            application_id,
            reviewer_id,
            score,
            notes,
            feedback,
          },
        ])
        .select(
          `
          *,
          reviewer:profiles(name, email),
          application:applications(id, candidate_name)
        `,
        )
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to add review", success: false };
    }
  }

  static async search(query: string): Promise<DatabaseResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          *,
          job:jobs(id, title, department),
          candidate:profiles!applicant_id(id, name, email)
        `,
        )
        .or(
          `candidate_name.ilike.%${query}%,candidate_email.ilike.%${query}%,job.title.ilike.%${query}%`,
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

  static async getByJob(job_id: string): Promise<DatabaseResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          *,
          job:jobs(id, title, department),
          candidate:profiles!applicant_id(id, name, email),
          stage:job_stages(id, name, description)
        `,
        )
        .eq("job_id", job_id)
        .order("created_at", { ascending: false });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to fetch applications for job",
        success: false,
      };
    }
  }

  static async getByCandidate(
    candidate_id: string,
  ): Promise<DatabaseResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          *,
          job:jobs(id, title, department, location),
          stage:job_stages(id, name, description)
        `,
        )
        .eq("applicant_id", candidate_id)
        .order("created_at", { ascending: false });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to fetch candidate applications",
        success: false,
      };
    }
  }

  static async getApplicationStats(): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("status, created_at");

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      const stats = {
        total: data.length,
        applied: data.filter((app) => app.status === "applied").length,
        screening: data.filter((app) => app.status === "screening").length,
        interview: data.filter((app) => app.status === "interview").length,
        offer: data.filter((app) => app.status === "offer").length,
        hired: data.filter((app) => app.status === "hired").length,
        rejected: data.filter((app) => app.status === "rejected").length,
        this_month: data.filter((app) => {
          const appDate = new Date(app.created_at);
          const now = new Date();
          return (
            appDate.getMonth() === now.getMonth() &&
            appDate.getFullYear() === now.getFullYear()
          );
        }).length,
      };

      return { data: stats, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to fetch application statistics",
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

// ===== NEW COMPREHENSIVE FEATURES =====

// Team Management Service
export class TeamsService {
  static async getAll(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    try {
      let query = supabase.from("teams").select(`
        *,
        team_lead:profiles!team_lead_id(name, email),
        department:departments(name),
        members:team_members(
          id,
          role,
          joined_at,
          member:profiles(name, email, position)
        )
      `);

      query = applyFilters(query, filters);

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
      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true, count };
    } catch (err) {
      return { data: null, error: "Failed to fetch teams", success: false };
    }
  }

  static async getById(id: string): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("teams")
        .select(
          `
          *,
          team_lead:profiles!team_lead_id(name, email, position),
          department:departments(name, description),
          members:team_members(
            id, role, joined_at, permissions,
            member:profiles(name, email, position, phone)
          ),
          projects:projects(id, name, status, priority),
          team_goals:team_goals(id, title, status, target_date),
          performance_metrics:team_performance(*)
        `,
        )
        .eq("id", id)
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to fetch team", success: false };
    }
  }

  static async create(team: any): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("teams")
        .insert([
          {
            name: team.name,
            description: team.description,
            team_lead_id: team.team_lead_id,
            department_id: team.department_id,
            team_type: team.team_type,
            status: team.status || "active",
            goals: team.goals,
            budget: team.budget,
            max_members: team.max_members,
            created_by: team.created_by,
          },
        ])
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to create team", success: false };
    }
  }

  static async update(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("teams")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to update team", success: false };
    }
  }

  static async delete(id: string): Promise<DatabaseResponse<boolean>> {
    try {
      const { error } = await supabase.from("teams").delete().eq("id", id);
      if (error) return { data: null, error: error.message, success: false };
      return { data: true, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to delete team", success: false };
    }
  }

  static async addMember(
    teamId: string,
    memberId: string,
    role: string,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .insert([
          {
            team_id: teamId,
            member_id: memberId,
            role: role,
            joined_at: new Date().toISOString(),
            permissions: ["read", "collaborate"],
          },
        ])
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to add team member", success: false };
    }
  }

  static async removeMember(
    teamId: string,
    memberId: string,
  ): Promise<DatabaseResponse<boolean>> {
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("team_id", teamId)
        .eq("member_id", memberId);

      if (error) return { data: null, error: error.message, success: false };
      return { data: true, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to remove team member",
        success: false,
      };
    }
  }

  static async getTeamPerformance(
    teamId: string,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("team_performance")
        .select("*")
        .eq("team_id", teamId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data: data || {}, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to fetch team performance",
        success: false,
      };
    }
  }
}

// Project Management Service
export class ProjectsService {
  static async getAll(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    try {
      let query = supabase.from("projects").select(`
        *,
        project_manager:profiles!project_manager_id(name, email),
        team:teams(name, description),
        tasks:project_tasks(id, title, status, priority, assignee_id),
        milestones:project_milestones(id, title, status, due_date)
      `);

      query = applyFilters(query, filters);

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
      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true, count };
    } catch (err) {
      return { data: null, error: "Failed to fetch projects", success: false };
    }
  }

  static async getById(id: string): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          *,
          project_manager:profiles!project_manager_id(name, email, position),
          team:teams(name, description, members:team_members(member:profiles(name, email))),
          tasks:project_tasks(
            id, title, description, status, priority,
            assignee:profiles(name, email), due_date, progress
          ),
          milestones:project_milestones(id, title, description, status, due_date, completion_date),
          resources:project_resources(*),
          time_tracking:project_time_entries(*)
        `,
        )
        .eq("id", id)
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to fetch project", success: false };
    }
  }

  static async create(project: any): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            name: project.name,
            description: project.description,
            project_manager_id: project.project_manager_id,
            team_id: project.team_id,
            status: project.status || "planning",
            priority: project.priority || "medium",
            start_date: project.start_date,
            end_date: project.end_date,
            budget: project.budget,
            client: project.client,
            project_type: project.project_type,
            created_by: project.created_by,
          },
        ])
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to create project", success: false };
    }
  }

  static async update(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to update project", success: false };
    }
  }

  static async delete(id: string): Promise<DatabaseResponse<boolean>> {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) return { data: null, error: error.message, success: false };
      return { data: true, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to delete project", success: false };
    }
  }

  static async addTask(
    projectId: string,
    task: any,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("project_tasks")
        .insert([
          {
            project_id: projectId,
            title: task.title,
            description: task.description,
            assignee_id: task.assignee_id,
            status: task.status || "todo",
            priority: task.priority || "medium",
            due_date: task.due_date,
            estimated_hours: task.estimated_hours,
            created_by: task.created_by,
          },
        ])
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to add task", success: false };
    }
  }

  static async updateTask(
    taskId: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("project_tasks")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", taskId)
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to update task", success: false };
    }
  }

  static async getProjectAnalytics(
    projectId: string,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase.rpc("get_project_analytics", {
        project_id: projectId,
      });

      if (error) return { data: null, error: error.message, success: false };
      return { data: data || {}, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to fetch project analytics",
        success: false,
      };
    }
  }
}

// Meeting Room Booking Service
export class MeetingRoomsService {
  static async getRooms(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    try {
      let query = supabase.from("meeting_rooms").select(`
        *,
        location:office_locations(name, address),
        amenities:room_amenities(*),
        current_booking:room_bookings(
          id, start_time, end_time,
          organizer:profiles(name, email)
        )
      `);

      query = applyFilters(query, filters);

      if (pagination) {
        const { page, limit, orderBy = "name", ascending = true } = pagination;
        const start = (page - 1) * limit;
        const end = start + limit - 1;
        query = query.order(orderBy, { ascending }).range(start, end);
      }

      const { data, error, count } = await query;
      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true, count };
    } catch (err) {
      return {
        data: null,
        error: "Failed to fetch meeting rooms",
        success: false,
      };
    }
  }

  static async getAvailableRooms(
    startTime: string,
    endTime: string,
    capacity?: number,
  ): Promise<DatabaseResponse<any[]>> {
    try {
      const { data, error } = await supabase.rpc("get_available_rooms", {
        start_time: startTime,
        end_time: endTime,
        min_capacity: capacity || 1,
      });

      if (error) return { data: null, error: error.message, success: false };
      return { data: data || [], error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to fetch available rooms",
        success: false,
      };
    }
  }

  static async createBooking(booking: any): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("room_bookings")
        .insert([
          {
            room_id: booking.room_id,
            organizer_id: booking.organizer_id,
            title: booking.title,
            description: booking.description,
            start_time: booking.start_time,
            end_time: booking.end_time,
            attendees: booking.attendees,
            booking_type: booking.booking_type || "meeting",
            status: booking.status || "confirmed",
            recurring_pattern: booking.recurring_pattern,
            catering_required: booking.catering_required || false,
            av_equipment: booking.av_equipment || [],
            internal_notes: booking.internal_notes,
          },
        ])
        .select(
          `
          *,
          room:meeting_rooms(name, capacity, location),
          organizer:profiles(name, email)
        `,
        )
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to create booking", success: false };
    }
  }

  static async getBookings(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    try {
      let query = supabase.from("room_bookings").select(`
        *,
        room:meeting_rooms(name, capacity, floor, building),
        organizer:profiles(name, email),
        attendee_profiles:booking_attendees(
          attendee:profiles(name, email)
        )
      `);

      query = applyFilters(query, filters);

      if (pagination) {
        const {
          page,
          limit,
          orderBy = "start_time",
          ascending = true,
        } = pagination;
        const start = (page - 1) * limit;
        const end = start + limit - 1;
        query = query.order(orderBy, { ascending }).range(start, end);
      }

      const { data, error, count } = await query;
      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true, count };
    } catch (err) {
      return { data: null, error: "Failed to fetch bookings", success: false };
    }
  }

  static async updateBooking(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("room_bookings")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to update booking", success: false };
    }
  }

  static async cancelBooking(
    id: string,
    reason?: string,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("room_bookings")
        .update({
          status: "cancelled",
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to cancel booking", success: false };
    }
  }
}

// Equipment Booking Service
export class EquipmentBookingService {
  static async getEquipment(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    try {
      let query = supabase.from("bookable_equipment").select(`
        *,
        category:equipment_categories(name, description),
        location:office_locations(name, building),
        current_booking:equipment_bookings(
          id, start_date, end_date,
          borrower:profiles(name, email)
        ),
        maintenance_records:equipment_maintenance(*)
      `);

      query = applyFilters(query, filters);

      if (pagination) {
        const { page, limit, orderBy = "name", ascending = true } = pagination;
        const start = (page - 1) * limit;
        const end = start + limit - 1;
        query = query.order(orderBy, { ascending }).range(start, end);
      }

      const { data, error, count } = await query;
      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true, count };
    } catch (err) {
      return { data: null, error: "Failed to fetch equipment", success: false };
    }
  }

  static async createBooking(booking: any): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("equipment_bookings")
        .insert([
          {
            equipment_id: booking.equipment_id,
            borrower_id: booking.borrower_id,
            purpose: booking.purpose,
            start_date: booking.start_date,
            end_date: booking.end_date,
            status: booking.status || "pending",
            pickup_location: booking.pickup_location,
            return_location: booking.return_location,
            special_instructions: booking.special_instructions,
            approved_by: booking.approved_by,
          },
        ])
        .select(
          `
          *,
          equipment:bookable_equipment(name, model, category),
          borrower:profiles(name, email, department)
        `,
        )
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to create equipment booking",
        success: false,
      };
    }
  }

  static async getBookings(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    try {
      let query = supabase.from("equipment_bookings").select(`
        *,
        equipment:bookable_equipment(name, model, category, serial_number),
        borrower:profiles(name, email, department),
        approved_by_user:profiles!approved_by(name, email)
      `);

      query = applyFilters(query, filters);

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
      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true, count };
    } catch (err) {
      return {
        data: null,
        error: "Failed to fetch equipment bookings",
        success: false,
      };
    }
  }

  static async updateBooking(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("equipment_bookings")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to update equipment booking",
        success: false,
      };
    }
  }

  static async returnEquipment(
    bookingId: string,
    condition: string,
    notes?: string,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("equipment_bookings")
        .update({
          status: "returned",
          return_condition: condition,
          return_notes: notes,
          actual_return_date: new Date().toISOString(),
        })
        .eq("id", bookingId)
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to return equipment",
        success: false,
      };
    }
  }
}

// Business Travel Service
export class BusinessTravelService {
  static async getTravelRequests(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    try {
      let query = supabase.from("travel_requests").select(`
        *,
        traveler:profiles!traveler_id(name, email, department),
        approved_by_user:profiles!approved_by(name, email),
        bookings:travel_bookings(*),
        expenses:travel_expenses(*)
      `);

      query = applyFilters(query, filters);

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
      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true, count };
    } catch (err) {
      return {
        data: null,
        error: "Failed to fetch travel requests",
        success: false,
      };
    }
  }

  static async createTravelRequest(
    request: any,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("travel_requests")
        .insert([
          {
            traveler_id: request.traveler_id,
            purpose: request.purpose,
            destination: request.destination,
            departure_date: request.departure_date,
            return_date: request.return_date,
            estimated_cost: request.estimated_cost,
            travel_type: request.travel_type || "business",
            priority: request.priority || "medium",
            status: request.status || "pending",
            accommodation_required: request.accommodation_required || false,
            transportation_type: request.transportation_type,
            project_id: request.project_id,
            client_meeting: request.client_meeting || false,
            dietary_requirements: request.dietary_requirements,
            emergency_contact: request.emergency_contact,
            additional_notes: request.additional_notes,
          },
        ])
        .select(
          `
          *,
          traveler:profiles(name, email, department)
        `,
        )
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to create travel request",
        success: false,
      };
    }
  }

  static async updateTravelRequest(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("travel_requests")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to update travel request",
        success: false,
      };
    }
  }

  static async approveTravelRequest(
    id: string,
    approverId: string,
    budget?: number,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("travel_requests")
        .update({
          status: "approved",
          approved_by: approverId,
          approved_at: new Date().toISOString(),
          approved_budget: budget,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to approve travel request",
        success: false,
      };
    }
  }

  static async addTravelBooking(
    requestId: string,
    booking: any,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("travel_bookings")
        .insert([
          {
            travel_request_id: requestId,
            booking_type: booking.booking_type,
            provider: booking.provider,
            confirmation_number: booking.confirmation_number,
            cost: booking.cost,
            booking_details: booking.booking_details,
            check_in_date: booking.check_in_date,
            check_out_date: booking.check_out_date,
            cancellation_policy: booking.cancellation_policy,
          },
        ])
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to add travel booking",
        success: false,
      };
    }
  }

  static async addTravelExpense(
    requestId: string,
    expense: any,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("travel_expenses")
        .insert([
          {
            travel_request_id: requestId,
            category: expense.category,
            amount: expense.amount,
            currency: expense.currency || "USD",
            date: expense.date,
            description: expense.description,
            receipt_url: expense.receipt_url,
            reimbursable: expense.reimbursable || true,
            status: expense.status || "pending",
          },
        ])
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to add travel expense",
        success: false,
      };
    }
  }
}

// Chat System Service
export class ChatService {
  static async getChannels(userId: string): Promise<DatabaseResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from("chat_channels")
        .select(
          `
          *,
          members:channel_members(
            id, role, joined_at,
            user:profiles(name, email, avatar_url)
          ),
          last_message:chat_messages(
            id, content, sent_at,
            sender:profiles(name, email)
          )
        `,
        )
        .eq("members.user_id", userId)
        .order("updated_at", { ascending: false });

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to fetch chat channels",
        success: false,
      };
    }
  }

  static async createChannel(channel: any): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("chat_channels")
        .insert([
          {
            name: channel.name,
            description: channel.description,
            type: channel.type || "group",
            created_by: channel.created_by,
            is_private: channel.is_private || false,
            team_id: channel.team_id,
            project_id: channel.project_id,
          },
        ])
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to create chat channel",
        success: false,
      };
    }
  }

  static async getMessages(
    channelId: string,
    pagination?: PaginationParams,
  ): Promise<DatabaseResponse<any[]>> {
    try {
      let query = supabase
        .from("chat_messages")
        .select(
          `
          *,
          sender:profiles(name, email, avatar_url),
          replies:message_replies(
            id, content, sent_at,
            sender:profiles(name, email)
          ),
          reactions:message_reactions(
            id, emoji, user_id,
            user:profiles(name)
          ),
          attachments:message_attachments(*)
        `,
        )
        .eq("channel_id", channelId);

      if (pagination) {
        const {
          page,
          limit,
          orderBy = "sent_at",
          ascending = false,
        } = pagination;
        const start = (page - 1) * limit;
        const end = start + limit - 1;
        query = query.order(orderBy, { ascending }).range(start, end);
      } else {
        query = query.order("sent_at", { ascending: false }).limit(50);
      }

      const { data, error, count } = await query;
      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true, count };
    } catch (err) {
      return { data: null, error: "Failed to fetch messages", success: false };
    }
  }

  static async sendMessage(message: any): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert([
          {
            channel_id: message.channel_id,
            sender_id: message.sender_id,
            content: message.content,
            message_type: message.message_type || "text",
            parent_message_id: message.parent_message_id,
            mentioned_users: message.mentioned_users || [],
            priority: message.priority || "normal",
          },
        ])
        .select(
          `
          *,
          sender:profiles(name, email, avatar_url)
        `,
        )
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to send message", success: false };
    }
  }

  static async addChannelMember(
    channelId: string,
    userId: string,
    role: string = "member",
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("channel_members")
        .insert([
          {
            channel_id: channelId,
            user_id: userId,
            role: role,
            joined_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to add channel member",
        success: false,
      };
    }
  }

  static async addReaction(
    messageId: string,
    userId: string,
    emoji: string,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("message_reactions")
        .insert([
          {
            message_id: messageId,
            user_id: userId,
            emoji: emoji,
          },
        ])
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to add reaction", success: false };
    }
  }
}

// Comprehensive Request Panel Service
export class RequestPanelService {
  static async getAllRequests(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    try {
      let query = supabase.from("unified_requests").select(`
        *,
        requester:profiles!requester_id(name, email, department),
        approved_by_user:profiles!approved_by(name, email),
        related_employee:profiles!related_employee_id(name, email)
      `);

      query = applyFilters(query, filters);

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
      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true, count };
    } catch (err) {
      return { data: null, error: "Failed to fetch requests", success: false };
    }
  }

  static async createRequest(request: any): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("unified_requests")
        .insert([
          {
            requester_id: request.requester_id,
            request_type: request.request_type,
            title: request.title,
            description: request.description,
            priority: request.priority || "medium",
            status: request.status || "pending",
            category: request.category,
            subcategory: request.subcategory,
            related_employee_id: request.related_employee_id,
            department: request.department,
            expected_completion_date: request.expected_completion_date,
            business_justification: request.business_justification,
            estimated_cost: request.estimated_cost,
            attachments: request.attachments || [],
            custom_fields: request.custom_fields || {},
            requires_approval: request.requires_approval || true,
            approval_workflow: request.approval_workflow || "standard",
          },
        ])
        .select(
          `
          *,
          requester:profiles(name, email, department)
        `,
        )
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to create request", success: false };
    }
  }

  static async updateRequest(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("unified_requests")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to update request", success: false };
    }
  }

  static async approveRequest(
    id: string,
    approverId: string,
    comments?: string,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("unified_requests")
        .update({
          status: "approved",
          approved_by: approverId,
          approved_at: new Date().toISOString(),
          approval_comments: comments,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to approve request", success: false };
    }
  }

  static async getRequestsByType(
    type: string,
  ): Promise<DatabaseResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from("unified_requests")
        .select(
          `
          *,
          requester:profiles(name, email, department)
        `,
        )
        .eq("request_type", type)
        .order("created_at", { ascending: false });

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to fetch requests by type",
        success: false,
      };
    }
  }

  static async getRequestAnalytics(): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase.rpc("get_request_analytics");
      if (error) return { data: null, error: error.message, success: false };
      return { data: data || {}, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: "Failed to fetch request analytics",
        success: false,
      };
    }
  }

  static async addRequestComment(
    requestId: string,
    comment: any,
  ): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("request_comments")
        .insert([
          {
            request_id: requestId,
            commenter_id: comment.commenter_id,
            content: comment.content,
            comment_type: comment.comment_type || "general",
            is_internal: comment.is_internal || false,
          },
        ])
        .select(
          `
          *,
          commenter:profiles(name, email)
        `,
        )
        .single();

      if (error) return { data: null, error: error.message, success: false };
      return { data, error: null, success: true };
    } catch (err) {
      return { data: null, error: "Failed to add comment", success: false };
    }
  }
}
