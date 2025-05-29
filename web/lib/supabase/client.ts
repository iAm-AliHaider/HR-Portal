import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Initialize Supabase client with public environment variables
// or use provided values as fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tqtwdkobrzzrhrqdxprs.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTU0MTgsImV4cCI6MjA2Mzg3MTQxOH0.xM1V6pUAOIrALa8E1o8Ma8j7csavI2kPjIfS6RPu15s'
const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

// Singleton pattern to prevent multiple client instances
let supabaseInstance: SupabaseClient | null = null;

// Create Supabase client with improved configuration
function createSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false, // Prevent URL parsing issues
      flowType: 'pkce',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      // Reduce auth state change frequency
      storageKey: 'hr-portal-auth',
      debug: false, // Disable debug logs
    },
    global: {
      headers: {
        'X-Client-Info': 'hr-portal-web@1.0.0',
      },
    },
    // Minimal realtime to prevent conflicts
    realtime: {
      params: {
        eventsPerSecond: 1,
      },
      heartbeatIntervalMs: 60000, // Increased interval
      reconnectAfterMs: (tries: number) => Math.min(tries * 2000, 10000),
    },
    // Add database settings for better performance
    db: {
      schema: 'public'
    }
  });

  // Suppress console warnings in production
  if (process.env.NODE_ENV === 'production') {
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      const message = args.join(' ');
      if (message.includes('Multiple GoTrueClient instances') || 
          message.includes('supabase') && message.includes('detected')) {
        return; // Suppress Supabase warnings
      }
      originalConsoleWarn.apply(console, args);
    };
  }

  return supabaseInstance;
}

// Export the singleton instance
export const supabase = createSupabaseClient();

// Development logging for debugging
if (isDevelopment) {
  console.log('Supabase client initialized with URL:', supabaseUrl)
  console.log('Environment:', process.env.NODE_ENV)
  console.log('Client instance created:', !!supabaseInstance)
}

// Production-safe error handling
if (isProduction && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('Production deployment detected but NEXT_PUBLIC_SUPABASE_URL not set')
}

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  try {
    return !!(supabaseUrl && supabaseAnonKey && supabase);
  } catch (error) {
    console.error('Supabase configuration check failed:', error);
    return false;
  }
};

// Global type definition
declare global {
  const supabase: SupabaseClient
}

// Helper for tenant-aware queries with error handling
export const tenantClient = (tenantId: string) => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not properly configured');
    }
    return supabase.from('employees').select().eq('tenant_id', tenantId)
  } catch (error) {
    console.error('Tenant client error:', error)
    throw error
  }
}

// Cleanup function for testing/development
export const resetSupabaseClient = () => {
  if (isDevelopment) {
    supabaseInstance = null;
  }
}; 