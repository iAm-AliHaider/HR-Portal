import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Production environment validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

// Development fallback values for testing without database
const DEV_SUPABASE_URL = "https://placeholder.supabase.co";
const DEV_SUPABASE_ANON_KEY = "placeholder_anon_key_for_development_testing";

// Use fallback values in development if environment variables are missing
const finalSupabaseUrl = supabaseUrl || (isDevelopment ? DEV_SUPABASE_URL : "");
const finalSupabaseAnonKey =
  supabaseAnonKey || (isDevelopment ? DEV_SUPABASE_ANON_KEY : "");

// Validate required environment variables
if (!finalSupabaseUrl || !finalSupabaseAnonKey) {
  const missingVars = [];
  if (!finalSupabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!finalSupabaseAnonKey) missingVars.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (isProduction) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}. ` +
        "Please check your environment configuration.",
    );
  } else {
    console.warn(
      `⚠️ Missing environment variables in development: ${missingVars.join(", ")}. ` +
        "Using fallback values for testing. Please configure proper Supabase credentials for database functionality.",
    );
  }
}

// URL validation - skip for development fallback
if (
  finalSupabaseUrl !== DEV_SUPABASE_URL &&
  !finalSupabaseUrl.includes("supabase.co") &&
  !finalSupabaseUrl.includes("localhost")
) {
  throw new Error(
    "Invalid Supabase URL format. Must be a valid Supabase project URL.",
  );
}

// Global singleton to prevent multiple GoTrue clients - use a more robust approach
declare global {
  // eslint-disable-next-line no-var
  var __supabase: SupabaseClient | undefined;
  // eslint-disable-next-line no-var
  var __supabaseInitialized: boolean | undefined;
}

// Prevent multiple initialization attempts
if (typeof window !== "undefined" && !globalThis.__supabaseInitialized) {
  console.log("🔧 Initializing Supabase client singleton...");
}

// Singleton pattern to prevent multiple client instances
let supabaseInstance: SupabaseClient | null = null;

// Create Supabase client with production configuration
function createSupabaseClient(): SupabaseClient {
  // Check for existing global instance first (most important for hot reloads)
  if (typeof window !== "undefined" && globalThis.__supabase) {
    console.log("♻️ Reusing existing global Supabase client");
    return globalThis.__supabase;
  }

  // Check for existing module instance
  if (supabaseInstance) {
    console.log("♻️ Reusing existing module Supabase client");
    return supabaseInstance;
  }

  // Prevent concurrent initialization
  if (typeof window !== "undefined" && globalThis.__supabaseInitialized) {
    // Wait a bit and check again for the global instance
    if (globalThis.__supabase) {
      return globalThis.__supabase;
    }
  }

  try {
    console.log("🔧 Creating new Supabase client...");

    // Mark as initializing to prevent race conditions
    if (typeof window !== "undefined") {
      globalThis.__supabaseInitialized = true;
    }

    supabaseInstance = createClient(finalSupabaseUrl, finalSupabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        storage:
          typeof window !== "undefined" ? window.localStorage : undefined,
        storageKey: "hr-portal-auth",
        debug: isDevelopment,
      },
      global: {
        headers: {
          "X-Client-Info": "hr-portal-web@1.0.0",
          "X-Environment": process.env.NODE_ENV || "development",
        },
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
        heartbeatIntervalMs: 30000,
        reconnectAfterMs: (tries: number) => Math.min(tries * 1000, 5000),
      },
      db: {
        schema: "public",
      },
    });

    // Store globally for hot reloads and cross-module access
    if (typeof window !== "undefined") {
      globalThis.__supabase = supabaseInstance;
    }

    // Production error handling
    if (typeof window !== "undefined" && isProduction) {
      // Capture critical auth errors in production
      const originalAuthSignUp = supabaseInstance.auth.signUp;
      supabaseInstance.auth.signUp = async (...args) => {
        try {
          const result = await originalAuthSignUp.apply(
            supabaseInstance.auth,
            args,
          );
          if (result.error) {
            console.error("Auth Error during signUp:", result.error.message);
            // In production, you might want to send this to a monitoring service
          }
          return result;
        } catch (error) {
          console.error("Unexpected error during signUp:", error);
          throw error;
        }
      };
    }

    console.log("✅ Supabase client created successfully");
    return supabaseInstance;
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    // Reset initialization flag on error
    if (typeof window !== "undefined") {
      globalThis.__supabaseInitialized = false;
    }
    throw new Error(
      "Database connection failed. Please check your configuration.",
    );
  }
}

// Get the singleton instance
export const getSupabaseClient = () => {
  return createSupabaseClient();
};

// Export the singleton instance
export const supabase = createSupabaseClient();

// Development logging
if (isDevelopment) {
  console.log("Supabase client initialized with URL:", finalSupabaseUrl);
  console.log("Environment:", process.env.NODE_ENV);
}

// Production validation
if (isProduction) {
  console.log("HR Portal connected to production database");
}

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  try {
    return !!(finalSupabaseUrl && finalSupabaseAnonKey);
  } catch {
    return false;
  }
};

// Helper function to check database connection
export async function checkDatabaseConnection(): Promise<{
  success: boolean;
  duration: number;
  error?: string;
  details?: string;
}> {
  const start = performance.now();

  try {
    // Test with a simple, lightweight query
    const { data, error, count } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .limit(1);

    const duration = Math.round(performance.now() - start);

    if (error) {
      console.warn("Database connection test failed:", error.message);
      return {
        success: false,
        duration,
        error: error.message,
        details: `Connection test failed: ${error.code || "Unknown error"}`,
      };
    }

    return {
      success: true,
      duration,
      details: `Database accessible - ${count !== null ? count : "Unknown"} records in profiles table`,
    };
  } catch (error) {
    const duration = Math.round(performance.now() - start);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown connection error";

    console.warn("Database connection check exception:", errorMessage);

    return {
      success: false,
      duration,
      error: errorMessage,
      details: "Database connection check failed with exception",
    };
  }
}

// Enhanced table checker with better error handling
export async function checkTableAccess(): Promise<{
  accessible: number;
  total: number;
  tables: Array<{
    name: string;
    status: "accessible" | "error";
    error?: string;
  }>;
}> {
  const tables = [
    "profiles",
    "employees",
    "jobs",
    "applications",
    "leave_requests",
    "assets",
    "bookings",
    "incidents",
    "training_courses",
    "assets",
  ];

  const results = await Promise.allSettled(
    tables.map(async (tableName) => {
      try {
        const { error } = await supabase
          .from(tableName)
          .select("*", { count: "exact", head: true })
          .limit(1);

        if (error) {
          return {
            name: tableName,
            status: "error" as const,
            error: error.message,
          };
        }

        return { name: tableName, status: "accessible" as const };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        return {
          name: tableName,
          status: "error" as const,
          error: errorMessage,
        };
      }
    }),
  );

  const tableStatuses = results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      return {
        name: tables[index],
        status: "error" as const,
        error: "Promise rejected",
      };
    }
  });

  const accessible = tableStatuses.filter(
    (t) => t.status === "accessible",
  ).length;

  return {
    accessible,
    total: tables.length,
    tables: tableStatuses,
  };
}

// Global type definition
declare global {
  const supabase: SupabaseClient;
}

// Helper for tenant-aware queries with error handling
export const tenantClient = (tenantId: string) => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase not properly configured");
    }
    return supabase.from("employees").select().eq("tenant_id", tenantId);
  } catch (error) {
    console.error("Tenant client error:", error);
    throw error;
  }
};

// Production helper to validate user session
export const validateUserSession = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return { session, error: null };
  } catch (error) {
    return {
      session: null,
      error:
        error instanceof Error ? error.message : "Session validation failed",
    };
  }
};

// Cleanup function for development only
export const resetSupabaseClient = () => {
  if (isDevelopment) {
    supabaseInstance = null;
    if (typeof window !== "undefined") {
      globalThis.__supabase = undefined;
    }
    console.log("🔄 Supabase client reset for development");
  }
};
