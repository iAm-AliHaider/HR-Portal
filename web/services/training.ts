import { supabase } from "@/lib/supabase/client";

// Training types
export interface TrainingCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  org_id: string;
  created_at: string;
  updated_at: string;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  bio: string;
  expertise: string[];
  avatar?: string;
  rating: number;
  org_id: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  category_id: string;
  trainer_id?: string;
  duration_hours: number;
  max_participants: number;
  prerequisites: string[];
  learning_outcomes: string[];
  materials: string[];
  certificate_eligible: boolean;
  skill_level: "beginner" | "intermediate" | "advanced";
  is_active: boolean;
  thumbnail?: string;
  org_id: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingSession {
  id: string;
  course_id: string;
  trainer_id?: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  max_participants: number;
  current_enrollment: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  meeting_link?: string;
  materials?: string[];
  org_id: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingEnrollment {
  id: string;
  employee_id: string;
  session_id: string;
  course_id: string;
  enrollment_date: string;
  completion_date?: string;
  status: "enrolled" | "in_progress" | "completed" | "dropped" | "failed";
  progress_percentage: number;
  feedback?: string;
  certificate_issued?: boolean;
  org_id: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingAssessment {
  id: string;
  enrollment_id: string;
  course_id: string;
  employee_id: string;
  assessment_type: "quiz" | "assignment" | "practical" | "final_exam";
  score: number;
  max_score: number;
  passed: boolean;
  assessment_date: string;
  feedback?: string;
  org_id: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingCertificate {
  id: string;
  enrollment_id: string;
  employee_id: string;
  course_id: string;
  certificate_number: string;
  issue_date: string;
  expiry_date?: string;
  status: "valid" | "expired" | "revoked";
  pdf_url?: string;
  org_id: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingFeedback {
  id: string;
  enrollment_id: string;
  employee_id: string;
  session_id: string;
  course_rating: number;
  trainer_rating: number;
  content_quality: number;
  delivery_method: number;
  overall_satisfaction: number;
  comments?: string;
  recommendations?: string;
  would_recommend: boolean;
  org_id: string;
  created_at: string;
  updated_at: string;
}

// Enhanced type with relations
export interface EnhancedTrainingCourse extends TrainingCourse {
  category?: TrainingCategory;
  trainer?: Trainer;
  sessions?: TrainingSession[];
  enrollment_count?: number;
}

export interface EnhancedTrainingSession extends TrainingSession {
  course?: TrainingCourse;
  trainer?: Trainer;
  enrollments?: TrainingEnrollment[];
}

export interface EnhancedTrainingEnrollment extends TrainingEnrollment {
  session?: TrainingSession;
  course?: TrainingCourse;
  employee?: any;
}

// Helper function to check if Supabase is configured
function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(supabaseUrl && supabaseKey && supabase);
}

// Training Categories API
export const getTrainingCategories = async (
  orgId: string,
): Promise<TrainingCategory[]> => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Database not configured. Please check your environment settings.",
    );
  }

  try {
    const { data, error } = await supabase
      .from("training_categories")
      .select("*")
      .eq("org_id", orgId)
      .order("name");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching training categories:", error);
    throw new Error("Failed to load training categories");
  }
};

export const createTrainingCategory = async (
  category: Omit<TrainingCategory, "id" | "created_at" | "updated_at">,
): Promise<TrainingCategory> => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Database not configured. Please check your environment settings.",
    );
  }

  try {
    const { data, error } = await supabase
      .from("training_categories")
      .insert([category])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating training category:", error);
    throw new Error("Failed to create training category");
  }
};

// Training Courses API
export const getTrainingCourses = async (
  orgId: string,
  options?: {
    categoryId?: string;
    trainerId?: string;
    skillLevel?: string;
    isActive?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  },
): Promise<EnhancedTrainingCourse[]> => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Database not configured. Please check your environment settings.",
    );
  }

  try {
    let query = supabase
      .from("training_courses")
      .select(
        `
        *,
        training_categories(*),
        trainers(*),
        training_sessions(count)
      `,
      )
      .eq("org_id", orgId);

    if (options?.categoryId) {
      query = query.eq("category_id", options.categoryId);
    }
    if (options?.trainerId) {
      query = query.eq("trainer_id", options.trainerId);
    }
    if (options?.skillLevel) {
      query = query.eq("skill_level", options.skillLevel);
    }
    if (options?.isActive !== undefined) {
      query = query.eq("is_active", options.isActive);
    }
    if (options?.search) {
      query = query.or(
        `title.ilike.%${options.search}%,description.ilike.%${options.search}%`,
      );
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1,
      );
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((course) => ({
      ...course,
      category: course.training_categories,
      trainer: course.trainers,
      enrollment_count: course.training_sessions?.[0]?.count || 0,
    }));
  } catch (error) {
    console.error("Error fetching training courses:", error);
    throw new Error("Failed to load training courses");
  }
};

export const getTrainingCourse = async (
  courseId: string,
): Promise<EnhancedTrainingCourse | null> => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Database not configured. Please check your environment settings.",
    );
  }

  try {
    const { data, error } = await supabase
      .from("training_courses")
      .select(
        `
        *,
        training_categories(*),
        trainers(*),
        training_sessions(*)
      `,
      )
      .eq("id", courseId)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      ...data,
      category: data.training_categories,
      trainer: data.trainers,
      sessions: data.training_sessions,
    };
  } catch (error) {
    console.error("Error fetching training course:", error);
    throw new Error("Failed to load training course");
  }
};

export const createTrainingCourse = async (
  course: Omit<TrainingCourse, "id" | "created_at" | "updated_at">,
): Promise<TrainingCourse> => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Database not configured. Please check your environment settings.",
    );
  }

  try {
    const { data, error } = await supabase
      .from("training_courses")
      .insert([course])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating training course:", error);
    throw new Error("Failed to create training course");
  }
};

export const updateTrainingCourse = async (
  courseId: string,
  updates: Partial<TrainingCourse>,
): Promise<TrainingCourse> => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Database not configured. Please check your environment settings.",
    );
  }

  try {
    const { data, error } = await supabase
      .from("training_courses")
      .update(updates)
      .eq("id", courseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating training course:", error);
    throw new Error("Failed to update training course");
  }
};

// Trainers API
export const getTrainers = async (
  orgId: string,
  options?: {
    search?: string;
    expertise?: string;
    limit?: number;
    offset?: number;
  },
): Promise<Trainer[]> => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Database not configured. Please check your environment settings.",
    );
  }

  try {
    let query = supabase.from("trainers").select("*").eq("org_id", orgId);

    if (options?.search) {
      query = query.or(
        `name.ilike.%${options.search}%,bio.ilike.%${options.search}%`,
      );
    }
    if (options?.expertise) {
      query = query.contains("expertise", [options.expertise]);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1,
      );
    }

    query = query.order("name");

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching trainers:", error);
    throw new Error("Failed to load trainers");
  }
};

export const getTrainer = async (
  trainerId: string,
): Promise<Trainer | null> => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Database not configured. Please check your environment settings.",
    );
  }

  try {
    const { data, error } = await supabase
      .from("trainers")
      .select("*")
      .eq("id", trainerId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching trainer:", error);
    throw new Error("Failed to load trainer");
  }
};

export const createTrainer = async (
  trainer: Omit<Trainer, "id" | "created_at" | "updated_at">,
): Promise<Trainer> => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Database not configured. Please check your environment settings.",
    );
  }

  try {
    const { data, error } = await supabase
      .from("trainers")
      .insert([trainer])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating trainer:", error);
    throw new Error("Failed to create trainer");
  }
};

export const updateTrainer = async (
  trainerId: string,
  updates: Partial<Trainer>,
): Promise<Trainer> => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Database not configured. Please check your environment settings.",
    );
  }

  try {
    const { data, error } = await supabase
      .from("trainers")
      .update(updates)
      .eq("id", trainerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating trainer:", error);
    throw new Error("Failed to update trainer");
  }
};

// Additional training service functions would follow the same pattern...
// For brevity, I'm showing the key functions that remove mock data

export const getTrainingSessions = async (
  orgId: string,
  options?: {
    courseId?: string;
    trainerId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  },
): Promise<EnhancedTrainingSession[]> => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Database not configured. Please check your environment settings.",
    );
  }

  try {
    let query = supabase
      .from("training_sessions")
      .select(
        `
        *,
        training_courses(*),
        trainers(*),
        training_enrollments(count)
      `,
      )
      .eq("org_id", orgId);

    if (options?.courseId) {
      query = query.eq("course_id", options.courseId);
    }
    if (options?.trainerId) {
      query = query.eq("trainer_id", options.trainerId);
    }
    if (options?.status) {
      query = query.eq("status", options.status);
    }
    if (options?.startDate) {
      query = query.gte("start_date", options.startDate);
    }
    if (options?.endDate) {
      query = query.lte("end_date", options.endDate);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1,
      );
    }

    query = query.order("start_date", { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((session) => ({
      ...session,
      course: session.training_courses,
      trainer: session.trainers,
      enrollments: session.training_enrollments,
    }));
  } catch (error) {
    console.error("Error fetching training sessions:", error);
    throw new Error("Failed to load training sessions");
  }
};

// Create a TrainingService class with all methods
export class TrainingService {
  static async getCategories(orgId: string) {
    return getTrainingCategories(orgId);
  }

  static async getCourses(orgId: string, options?: any) {
    return getTrainingCourses(orgId, options);
  }

  static async getCourse(courseId: string) {
    return getTrainingCourse(courseId);
  }

  static async getSessions(orgId: string, options?: any) {
    return getTrainingSessions(orgId, options);
  }

  static async getTrainers(orgId: string, options?: any) {
    return getTrainers(orgId, options);
  }
}
