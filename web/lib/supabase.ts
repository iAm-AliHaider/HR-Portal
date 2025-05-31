import { createClient } from "@supabase/supabase-js";

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create a single supabase client for the entire app
export let supabase: ReturnType<typeof createClient>;

try {
  // Only create a real client if the URL is provided
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    // Create a mock client when credentials are not available
    // This prevents the app from crashing when env vars aren't set
    console.warn("Supabase URL or key not provided. Using mock client.");
    supabase = {
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
        eq: () => ({ data: null, error: null }),
        neq: () => ({ data: null, error: null }),
        gt: () => ({ data: null, error: null }),
        gte: () => ({ data: null, error: null }),
        lt: () => ({ data: null, error: null }),
        lte: () => ({ data: null, error: null }),
        order: () => ({ data: null, error: null }),
        single: () => ({ data: null, error: null }),
      }),
      auth: {
        signIn: () =>
          Promise.resolve({ user: null, session: null, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({
          data: null,
          error: null,
          unsubscribe: () => {},
        }),
      },
    } as any;
  }
} catch (error) {
  console.error("Error initializing Supabase client:", error);
  // Fallback to mock client
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      // Add other methods as needed
    }),
  } as any;
}

// Helper function for error handling
export const handleSupabaseError = (error: any) => {
  console.error("Supabase error:", error);
  return { error: error.message || "An unexpected error occurred" };
};
