// Supabase client configuration
// This is a placeholder for production deployment

import { createClient } from '@supabase/supabase-js';

// Production-ready Supabase configuration with your actual credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tqtwdkobrzzrhrqdxprs.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTU0MTgsImV4cCI6MjA2Mzg3MTQxOH0.xM1V6pUAOIrALa8E1o8Ma8j7csavI2kPjIfS6RPu15s';
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Validate configuration
if (!supabaseUrl.startsWith('https://')) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid HTTPS URL');
}

if (!supabaseAnonKey || supabaseAnonKey.length < 100) {
  console.warn('Supabase anon key appears to be missing or invalid');
}

// Type definitions for better TypeScript support
export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string;
          email: string;
          name: string;
          position: string;
          department: string;
          status: string;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['employees']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['employees']['Insert']>;
      };
      leave_requests: {
        Row: {
          id: string;
          employee_id: string;
          employee_name: string;
          type: string;
          start_date: string;
          end_date: string;
          days: number;
          status: string;
          reason: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['leave_requests']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['leave_requests']['Insert']>;
      };
      training_courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          duration: number;
          instructor: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['training_courses']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['training_courses']['Insert']>;
      };
      // Add more table types as needed
    };
  };
}

// Create Supabase client with production-ready configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'hr-portal@1.0.0',
      'X-Environment': process.env.NODE_ENV || 'development'
    },
  },
  // Enhanced configuration for production
  realtime: {
    params: {
      eventsPerSecond: isProduction ? 2 : 10,
    },
  },
  // Database connection settings
  db: {
    schema: 'public',
  },
});

// Environment-specific logging
if (isDevelopment) {
  console.log('✅ Supabase client initialized');
  console.log('📍 URL:', supabaseUrl);
  console.log('🔑 Key configured:', supabaseAnonKey ? 'Yes' : 'No');
  console.log('🌍 Environment:', process.env.NODE_ENV);
}

// Health check function
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) throw error;
    return { connected: true, message: 'Supabase connection successful' };
  } catch (error) {
    return { 
      connected: false, 
      message: `Supabase connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

// Enhanced error logging for production
if (isProduction) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      console.log('✅ User signed in:', session?.user?.email);
    } else if (event === 'SIGNED_OUT') {
      console.log('🔓 User signed out');
    } else if (event === 'TOKEN_REFRESHED') {
      console.log('🔄 Auth token refreshed');
    }
  });
}

// Export types for better TypeScript support
export type { User, Session } from '@supabase/supabase-js';

// Helper function for admin operations (server-side only)
export const createAdminClient = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations');
  }
  
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export default supabase;

// For production deployment, replace the above with:
// import { createClient } from '@supabase/supabase-js'
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// export const supabase = createClient(supabaseUrl, supabaseKey) 