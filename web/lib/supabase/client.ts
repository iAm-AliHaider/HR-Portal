import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Production environment validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!supabaseAnonKey) missingVars.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  throw new Error(
    `Missing required environment variables: ${missingVars.join(", ")}. ` +
      "Please check your environment configuration.",
  );
}

// URL validation
if (
  !supabaseUrl.includes("supabase.co") &&
  !supabaseUrl.includes("localhost")
) {
  throw new Error(
    "Invalid Supabase URL format. Must be a valid Supabase project URL.",
  );
}

// Global singleton to prevent multiple GoTrue clients
declare global {
  var __supabase: SupabaseClient | undefined;
  var __supabaseAuthListeners: Set<any> | undefined;
}

// Initialize auth listeners tracking
if (typeof window !== "undefined" && !globalThis.__supabaseAuthListeners) {
  globalThis.__supabaseAuthListeners = new Set();
}

// Singleton pattern to prevent multiple client instances
let supabaseInstance: SupabaseClient | null = null;

// Create Supabase client with production configuration
function createSupabaseClient(): SupabaseClient {
  // Use global singleton in development to survive hot reloads
  if (isDevelopment && typeof window !== "undefined" && globalThis.__supabase) {
    console.log("♻️ Reusing existing Supabase client (hot reload)");
    return globalThis.__supabase;
  }

  if (supabaseInstance) {
    return supabaseInstance;
  }

  try {
    console.log("🔧 Creating new Supabase client...");
    
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
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

    // Store globally in development to survive hot reloads
    if (isDevelopment && typeof window !== "undefined") {
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
    throw new Error(
      "Database connection failed. Please check your configuration.",
    );
  }
}

// Enhanced auth listener management to prevent multiple listeners
export const createAuthListener = (callback: (event: string, session: any) => void) => {
  const client = getSupabaseClient();
  
  const { data: listener } = client.auth.onAuthStateChange(callback);
  
  // Track listener to prevent leaks
  if (typeof window !== "undefined" && globalThis.__supabaseAuthListeners) {
    globalThis.__supabaseAuthListeners.add(listener);
    
    // Clean up on page unload
    const cleanup = () => {
      listener.subscription.unsubscribe();
      globalThis.__supabaseAuthListeners?.delete(listener);
    };
    
    window.addEventListener('beforeunload', cleanup);
    
    // Return cleanup function
    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    };
  }
  
  return () => listener.subscription.unsubscribe();
};

// Cleanup function for development hot reloads
export const cleanupAuthListeners = () => {
  if (typeof window !== "undefined" && globalThis.__supabaseAuthListeners) {
    console.log(`🧹 Cleaning up ${globalThis.__supabaseAuthListeners.size} auth listeners`);
    globalThis.__supabaseAuthListeners.forEach(listener => {
      try {
        listener.subscription.unsubscribe();
      } catch (error) {
        console.warn("Error cleaning up auth listener:", error);
      }
    });
    globalThis.__supabaseAuthListeners.clear();
  }
};

// Get the singleton instance
export const getSupabaseClient = () => {
  return createSupabaseClient();
};

// Export the singleton instance
export const supabase = createSupabaseClient();

// Development logging
if (isDevelopment) {
  console.log("Supabase client initialized with URL:", supabaseUrl);
  console.log("Environment:", process.env.NODE_ENV);
  
  // Cleanup on hot reload
  if (typeof window !== "undefined") {
    // @ts-ignore
    if (module.hot) {
      // @ts-ignore
      module.hot.dispose(() => {
        cleanupAuthListeners();
      });
    }
  }
}

// Production validation
if (isProduction) {
  console.log("HR Portal connected to production database");
}

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  try {
    return !!(supabaseUrl && supabaseAnonKey && supabase);
  } catch (error) {
    console.error("Supabase configuration check failed:", error);
    return false;
  }
};

// Helper function to check database connection
export const checkDatabaseConnection = async () => {
  try {
    const startTime = Date.now();
    const { data, error } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);
    const duration = Date.now() - startTime;

    return {
      success: !error,
      duration,
      error: error ? error.message : null,
    };
  } catch (error) {
    return {
      success: false,
      duration: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

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
    cleanupAuthListeners();
    supabaseInstance = null;
    if (typeof window !== "undefined") {
      globalThis.__supabase = undefined;
    }
    console.log("🔄 Supabase client reset for development");
  }
};
