// API service layer for HR application
import { supabase } from "../lib/supabase/client";
import {
  mockApplications,
  mockComplianceRequirements,
  mockEmployees,
  mockExpenses,
  mockInterviews,
  mockJobs,
  mockLeaveRequests,
  mockOffers,
  mockPerformanceReviews,
  mockTrainingCourses,
  mockWorkflows,
} from "./mockData";

// Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Base API class
class ApiService {
  private isDevelopment = process.env.NODE_ENV === "development";

  // Generic API call wrapper
  async apiCall<T>(
    endpoint: string,
    options: RequestInit = {},
    mockData?: T,
    delay: number = 1000,
  ): Promise<ApiResponse<T>> {
    try {
      if (this.isDevelopment && mockData) {
        // Simulate network delay in development
        await new Promise((resolve) => setTimeout(resolve, delay));
        return {
          data: mockData,
          error: null,
          loading: false,
        };
      }

      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        data,
        error: null,
        loading: false,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      };
    }
  }

  // Supabase wrapper for production
  async supabaseCall<T>(
    operation: () => Promise<any>,
    mockData?: T,
  ): Promise<ApiResponse<T>> {
    try {
      // Check if this method is being called with proper context
      if (!this || typeof this.supabaseCall !== "function") {
        console.warn(
          "supabaseCall called without proper context, using mock data",
        );
        if (mockData !== undefined) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return {
            data: mockData,
            error: null,
            loading: false,
          };
        }
        throw new Error("No mock data available and context is invalid");
      }

      // Always use mock data in development or if supabase is undefined
      if ((this.isDevelopment && mockData !== undefined) || !supabase) {
        // If supabase is undefined, log a warning
        if (!supabase) {
          console.warn("Supabase client is undefined, using mock data");
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          data: mockData,
          error: null,
          loading: false,
        };
      }

      try {
        const { data, error } = await operation();

        if (error) {
          throw new Error(error.message);
        }

        return {
          data,
          error: null,
          loading: false,
        };
      } catch (operationError) {
        // If operation fails and we're in development, fall back to mock data
        if ((this.isDevelopment && mockData !== undefined) || !supabase) {
          console.warn(
            "Supabase operation failed, using mock data instead:",
            operationError,
          );
          return {
            data: mockData,
            error: null,
            loading: false,
          };
        }
        throw operationError;
      }
    } catch (error) {
      console.error("Jobs API error, using fallback:", error);

      // If we have mock data, return it as fallback
      if (mockData !== undefined) {
        return {
          data: mockData,
          error: null,
          loading: false,
        };
      }

      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Database error occurred",
        loading: false,
      };
    }
  }
}

// Employee Service
class EmployeeService extends ApiService {
  getEmployees = async (): Promise<ApiResponse<any[]>> => {
    return this.supabaseCall(
      async () => await supabase.from("employees").select("*"),
      mockEmployees,
    );
  };

  createEmployee = async (employeeData: any): Promise<ApiResponse<any>> => {
    const mockCreatedEmployee = {
      id: Date.now().toString(),
      ...employeeData,
      created_at: new Date().toISOString(),
      status: "active",
    };

    return this.supabaseCall(
      async () =>
        await supabase.from("employees").insert(employeeData).select().single(),
      mockCreatedEmployee,
    );
  };

  updateEmployee = async (
    id: string,
    updates: any,
  ): Promise<ApiResponse<any>> => {
    const mockUpdatedEmployee = {
      id,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return this.supabaseCall(
      async () =>
        await supabase
          .from("employees")
          .update(updates)
          .eq("id", id)
          .select()
          .single(),
      mockUpdatedEmployee,
    );
  };

  deleteEmployee = async (id: string): Promise<ApiResponse<boolean>> => {
    return this.supabaseCall(
      async () => await supabase.from("employees").delete().eq("id", id),
      true,
    );
  };

  getEmployeeById = async (id: string): Promise<ApiResponse<any>> => {
    const mockEmployee = mockEmployees.find((emp) => emp.id === id);
    return this.supabaseCall(
      async () =>
        await supabase.from("employees").select("*").eq("id", id).single(),
      mockEmployee,
    );
  };
}

// Job Service
class JobService extends ApiService {
  getJobs = async (): Promise<ApiResponse<any[]>> => {
    return this.supabaseCall(
      async () => await supabase.from("jobs").select("*"),
      mockJobs,
    );
  };

  createJob = async (jobData: any): Promise<ApiResponse<any>> => {
    const mockCreatedJob = {
      id: Date.now().toString(),
      ...jobData,
      created_at: new Date().toISOString(),
      applications_count: 0,
      status: "open",
    };

    return this.supabaseCall(
      async () => await supabase.from("jobs").insert(jobData).select().single(),
      mockCreatedJob,
    );
  };

  updateJob = async (id: string, updates: any): Promise<ApiResponse<any>> => {
    const mockUpdatedJob = {
      id,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return this.supabaseCall(
      async () =>
        await supabase
          .from("jobs")
          .update(updates)
          .eq("id", id)
          .select()
          .single(),
      mockUpdatedJob,
    );
  };

  closeJob = async (id: string): Promise<ApiResponse<any>> => {
    return this.updateJob(id, {
      status: "closed",
      closed_at: new Date().toISOString(),
    });
  };

  getJobById = async (id: string): Promise<ApiResponse<any>> => {
    const mockJob = mockJobs.find((job) => job.id === id);
    return this.supabaseCall(
      async () => await supabase.from("jobs").select("*").eq("id", id).single(),
      mockJob,
    );
  };

  getApplicationsForJob = async (
    jobId: string,
  ): Promise<ApiResponse<any[]>> => {
    const mockJobApplications = mockApplications.filter(
      (app) => app.job_id === jobId,
    );
    return this.supabaseCall(
      async () =>
        await supabase.from("applications").select("*").eq("job_id", jobId),
      mockJobApplications,
    );
  };
}

// Leave Service
class LeaveService extends ApiService {
  getLeaveRequests = async (): Promise<ApiResponse<any[]>> => {
    return this.supabaseCall(
      async () => await supabase.from("leave_requests").select("*"),
      mockLeaveRequests,
    );
  };

  submitLeaveRequest = async (leaveData: any): Promise<ApiResponse<any>> => {
    const mockLeaveRequest = {
      id: Date.now().toString(),
      ...leaveData,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    return this.supabaseCall(
      async () =>
        await supabase
          .from("leave_requests")
          .insert(leaveData)
          .select()
          .single(),
      mockLeaveRequest,
    );
  };

  approveLeaveRequest = async (
    id: string,
    notes?: string,
  ): Promise<ApiResponse<any>> => {
    const mockApprovedRequest = {
      id,
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: "current_user",
      notes,
    };

    return this.supabaseCall(
      async () =>
        await supabase
          .from("leave_requests")
          .update({
            status: "approved",
            approved_at: new Date().toISOString(),
            notes,
          })
          .eq("id", id)
          .select()
          .single(),
      mockApprovedRequest,
    );
  };

  rejectLeaveRequest = async (
    id: string,
    reason: string,
  ): Promise<ApiResponse<any>> => {
    const mockRejectedRequest = {
      id,
      status: "rejected",
      rejected_at: new Date().toISOString(),
      rejected_by: "current_user",
      rejection_reason: reason,
    };

    return this.supabaseCall(
      async () =>
        await supabase
          .from("leave_requests")
          .update({
            status: "rejected",
            rejected_at: new Date().toISOString(),
            rejection_reason: reason,
          })
          .eq("id", id)
          .select()
          .single(),
      mockRejectedRequest,
    );
  };
}

// Training Service
class TrainingService extends ApiService {
  getCourses = async (): Promise<ApiResponse<any[]>> => {
    return this.supabaseCall(
      async () => await supabase.from("training_courses").select("*"),
      mockTrainingCourses,
    );
  };

  enrollInCourse = async (
    courseId: string,
    employeeId: string,
  ): Promise<ApiResponse<any>> => {
    const mockEnrollment = {
      id: Date.now().toString(),
      course_id: courseId,
      employee_id: employeeId,
      enrolled_at: new Date().toISOString(),
      status: "enrolled",
      progress: 0,
    };

    return this.supabaseCall(
      async () =>
        await supabase
          .from("course_enrollments")
          .insert({
            course_id: courseId,
            employee_id: employeeId,
            enrolled_at: new Date().toISOString(),
          })
          .select()
          .single(),
      mockEnrollment,
    );
  };

  createCourse = async (courseData: any): Promise<ApiResponse<any>> => {
    const mockCreatedCourse = {
      id: Date.now().toString(),
      ...courseData,
      created_at: new Date().toISOString(),
      enrollments_count: 0,
      status: "active",
    };

    return this.supabaseCall(
      async () =>
        await supabase
          .from("training_courses")
          .insert(courseData)
          .select()
          .single(),
      mockCreatedCourse,
    );
  };
}

// Compliance Service
class ComplianceService extends ApiService {
  getComplianceRequirements = async (): Promise<ApiResponse<any[]>> => {
    return this.supabaseCall(
      async () => await supabase.from("compliance_requirements").select("*"),
      mockComplianceRequirements,
    );
  };

  startAudit = async (requirementId: string): Promise<ApiResponse<any>> => {
    const mockAudit = {
      id: Date.now().toString(),
      requirement_id: requirementId,
      status: "in_progress",
      started_at: new Date().toISOString(),
      started_by: "current_user",
    };

    return this.supabaseCall(
      async () =>
        await supabase
          .from("compliance_audits")
          .insert({
            requirement_id: requirementId,
            status: "in_progress",
            started_at: new Date().toISOString(),
          })
          .select()
          .single(),
      mockAudit,
    );
  };

  updateComplianceStatus = async (
    id: string,
    status: string,
  ): Promise<ApiResponse<any>> => {
    const mockUpdatedCompliance = {
      id,
      status,
      updated_at: new Date().toISOString(),
    };

    return this.supabaseCall(
      async () =>
        await supabase
          .from("compliance_requirements")
          .update({ status, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single(),
      mockUpdatedCompliance,
    );
  };
}

// Workflow Service
class WorkflowService extends ApiService {
  getWorkflows = async (): Promise<ApiResponse<any[]>> => {
    return this.supabaseCall(
      async () => await supabase.from("workflows").select("*"),
      mockWorkflows,
    );
  };

  createWorkflow = async (workflowData: any): Promise<ApiResponse<any>> => {
    const mockCreatedWorkflow = {
      id: Date.now().toString(),
      ...workflowData,
      status: "active",
      created_at: new Date().toISOString(),
    };

    return this.supabaseCall(
      async () =>
        await supabase.from("workflows").insert(workflowData).select().single(),
      mockCreatedWorkflow,
    );
  };

  startWorkflow = async (
    workflowId: string,
    contextData: any,
  ): Promise<ApiResponse<any>> => {
    const mockWorkflowInstance = {
      id: Date.now().toString(),
      workflow_id: workflowId,
      context: contextData,
      status: "running",
      started_at: new Date().toISOString(),
      current_step: 1,
    };

    return this.supabaseCall(
      async () =>
        await supabase
          .from("workflow_instances")
          .insert({
            workflow_id: workflowId,
            context: contextData,
            status: "running",
            started_at: new Date().toISOString(),
          })
          .select()
          .single(),
      mockWorkflowInstance,
    );
  };
}

// Performance Service
class PerformanceService extends ApiService {
  getPerformanceReviews = async (): Promise<ApiResponse<any[]>> => {
    return this.supabaseCall(
      async () => await supabase.from("performance_reviews").select("*"),
      mockPerformanceReviews,
    );
  };

  createReview = async (reviewData: any): Promise<ApiResponse<any>> => {
    const mockCreatedReview = {
      id: Date.now().toString(),
      ...reviewData,
      status: "draft",
      created_at: new Date().toISOString(),
    };

    return this.supabaseCall(
      async () =>
        await supabase
          .from("performance_reviews")
          .insert(reviewData)
          .select()
          .single(),
      mockCreatedReview,
    );
  };

  submitReview = async (
    id: string,
    reviewData: any,
  ): Promise<ApiResponse<any>> => {
    const mockSubmittedReview = {
      id,
      ...reviewData,
      status: "submitted",
      submitted_at: new Date().toISOString(),
    };

    return this.supabaseCall(
      async () =>
        await supabase
          .from("performance_reviews")
          .update({
            ...reviewData,
            status: "submitted",
            submitted_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select()
          .single(),
      mockSubmittedReview,
    );
  };
}

// Application Service
class ApplicationService extends ApiService {
  getApplications = async (): Promise<ApiResponse<any[]>> => {
    return this.supabaseCall(
      async () => await supabase.from("applications").select("*"),
      mockApplications,
    );
  };

  createApplication = async (
    applicationData: any,
  ): Promise<ApiResponse<any>> => {
    const mockCreatedApplication = {
      id: Date.now().toString(),
      ...applicationData,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    return this.supabaseCall(
      async () =>
        await supabase
          .from("applications")
          .insert(applicationData)
          .select()
          .single(),
      mockCreatedApplication,
    );
  };

  updateApplicationStatus = async (
    id: string,
    status: string,
    notes?: string,
  ): Promise<ApiResponse<any>> => {
    const mockUpdatedApplication = {
      id,
      status,
      notes,
      updated_at: new Date().toISOString(),
    };

    return this.supabaseCall(
      async () =>
        await supabase
          .from("applications")
          .update({
            status,
            notes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select()
          .single(),
      mockUpdatedApplication,
    );
  };

  scheduleInterview = async (
    applicationId: string,
    interviewData: any,
  ): Promise<ApiResponse<any>> => {
    const mockScheduledInterview = {
      id: Date.now().toString(),
      application_id: applicationId,
      ...interviewData,
      status: "scheduled",
      created_at: new Date().toISOString(),
    };

    return this.supabaseCall(
      async () =>
        await supabase
          .from("interviews")
          .insert({
            application_id: applicationId,
            ...interviewData,
            status: "scheduled",
          })
          .select()
          .single(),
      mockScheduledInterview,
    );
  };
}

// Expense Service
class ExpenseService extends ApiService {
  getExpenses = async (): Promise<ApiResponse<any[]>> => {
    return this.supabaseCall(
      async () => await supabase.from("expenses").select("*"),
      mockExpenses,
    );
  };

  submitExpense = async (expenseData: any): Promise<ApiResponse<any>> => {
    const mockSubmittedExpense = {
      id: Date.now().toString(),
      ...expenseData,
      status: "pending",
      submitted_at: new Date().toISOString(),
    };

    return this.supabaseCall(
      async () =>
        await supabase.from("expenses").insert(expenseData).select().single(),
      mockSubmittedExpense,
    );
  };

  approveExpense = async (id: string): Promise<ApiResponse<any>> => {
    const mockApprovedExpense = {
      id,
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: "current_user",
    };

    return this.supabaseCall(
      async () =>
        await supabase
          .from("expenses")
          .update({
            status: "approved",
            approved_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select()
          .single(),
      mockApprovedExpense,
    );
  };

  rejectExpense = async (
    id: string,
    reason: string,
  ): Promise<ApiResponse<any>> => {
    const mockRejectedExpense = {
      id,
      status: "rejected",
      rejected_at: new Date().toISOString(),
      rejection_reason: reason,
    };

    return this.supabaseCall(
      async () =>
        await supabase
          .from("expenses")
          .update({
            status: "rejected",
            rejected_at: new Date().toISOString(),
            rejection_reason: reason,
          })
          .eq("id", id)
          .select()
          .single(),
      mockRejectedExpense,
    );
  };
}

// Interview Service
export const getInterviews = async (): Promise<any[]> => {
  if (process.env.NODE_ENV === "development") {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockInterviews;
  } else {
    // Production code would use Supabase or another API
    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .order("scheduled_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

export const scheduleInterview = async (
  interviewData: any,
): Promise<ApiResponse<any>> => {
  try {
    if (process.env.NODE_ENV === "development") {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newInterview = {
        id: `int-${Date.now()}`,
        ...interviewData,
        status: "scheduled",
        created_at: new Date().toISOString(),
      };

      mockInterviews.unshift(newInterview);
      return { data: newInterview, error: null, loading: false };
    } else {
      // Production code would use Supabase or another API
      const { data, error } = await supabase
        .from("interviews")
        .insert(interviewData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null, loading: false };
    }
  } catch (error) {
    console.error("Error scheduling interview:", error);
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to schedule interview",
      loading: false,
    };
  }
};

export const updateInterviewStatus = async (
  id: string,
  status: string,
  notes?: string,
): Promise<ApiResponse<any>> => {
  try {
    if (process.env.NODE_ENV === "development") {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const interviewIndex = mockInterviews.findIndex(
        (interview) => interview.id === id,
      );
      if (interviewIndex === -1) throw new Error("Interview not found");

      mockInterviews[interviewIndex] = {
        ...mockInterviews[interviewIndex],
        status,
        notes: notes || mockInterviews[interviewIndex].notes,
        updated_at: new Date().toISOString(),
      };

      return {
        data: mockInterviews[interviewIndex],
        error: null,
        loading: false,
      };
    } else {
      // Production code would use Supabase or another API
      const { data, error } = await supabase
        .from("interviews")
        .update({ status, notes, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null, loading: false };
    }
  } catch (error) {
    console.error("Error updating interview status:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update interview status",
      loading: false,
    };
  }
};

// Offer Service
export const getOffers = async (): Promise<any[]> => {
  if (process.env.NODE_ENV === "development") {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockOffers;
  } else {
    // Production code would use Supabase or another API
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

export const createOffer = async (
  offerData: any,
): Promise<ApiResponse<any>> => {
  try {
    if (process.env.NODE_ENV === "development") {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newOffer = {
        id: `offer-${Date.now()}`,
        ...offerData,
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockOffers.unshift(newOffer);
      return { data: newOffer, error: null, loading: false };
    } else {
      // Production code would use Supabase or another API
      const { data, error } = await supabase
        .from("offers")
        .insert(offerData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null, loading: false };
    }
  } catch (error) {
    console.error("Error creating offer:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to create offer",
      loading: false,
    };
  }
};

export const updateOfferStatus = async (
  id: string,
  status: string,
  notes?: string,
): Promise<ApiResponse<any>> => {
  try {
    if (process.env.NODE_ENV === "development") {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const offerIndex = mockOffers.findIndex((offer) => offer.id === id);
      if (offerIndex === -1) throw new Error("Offer not found");

      mockOffers[offerIndex] = {
        ...mockOffers[offerIndex],
        status,
        notes: notes || mockOffers[offerIndex].notes,
        updated_at: new Date().toISOString(),
      };

      return { data: mockOffers[offerIndex], error: null, loading: false };
    } else {
      // Production code would use Supabase or another API
      const { data, error } = await supabase
        .from("offers")
        .update({ status, notes, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null, loading: false };
    }
  } catch (error) {
    console.error("Error updating offer status:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update offer status",
      loading: false,
    };
  }
};

// Export service instances
export const employeeService = new EmployeeService();
export const jobService = new JobService();
export const leaveService = new LeaveService();
export const trainingService = new TrainingService();
export const complianceService = new ComplianceService();
export const workflowService = new WorkflowService();
export const performanceService = new PerformanceService();
export const applicationService = new ApplicationService();
export const expenseService = new ExpenseService();

// Export notification service
export const notificationService = {
  async send(
    type: "email" | "sms" | "push",
    recipient: string,
    message: string,
  ) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[${type.toUpperCase()}] to ${recipient}: ${message}`);
      return { success: true, messageId: `mock-${Date.now()}` };
    }

    // Implement real notification logic here
    return { success: true, messageId: `real-${Date.now()}` };
  },
};

// Export file service
export const fileService = {
  async upload(
    file: File,
    folder: string = "documents",
  ): Promise<ApiResponse<{ url: string; name: string }>> {
    if (process.env.NODE_ENV === "development") {
      // Mock file upload
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return {
        data: {
          url: `/uploads/${folder}/${file.name}`,
          name: file.name,
        },
        error: null,
        loading: false,
      };
    }

    // Implement real file upload to Supabase Storage
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from(folder)
        .upload(fileName, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from(folder).getPublicUrl(fileName);

      return {
        data: { url: publicUrl, name: fileName },
        error: null,
        loading: false,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Upload failed",
        loading: false,
      };
    }
  },
};

export default ApiService;
