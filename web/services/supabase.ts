// Supabase client configuration
// This is a placeholder for production deployment

import { createClient } from '@supabase/supabase-js';

// Environment variable validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

// Create Supabase client with proper error handling
const createSupabaseClient = () => {
  // Development mode - use mock client
  if (process.env.NODE_ENV === 'development' && (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-ref'))) {
    console.log('🔄 Using mock Supabase client for development');
    return createMockClient();
  }

  // Production mode - validate environment variables
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    throw new Error('Missing required Supabase environment variables');
  }

  console.log('✅ Connecting to Supabase:', supabaseUrl);
  
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'X-Client-Info': 'hr-portal-web'
      }
    }
  });
};

// Mock client for development
const createMockClient = () => {
  const mockResponse = { data: null, error: null };
  
  return {
    from: (table: string) => ({
      select: (columns?: string) => {
        const queryBuilder: any = Promise.resolve({ data: [], error: null });
        queryBuilder.order = () => queryBuilder;
        queryBuilder.single = () => Promise.resolve({ data: null, error: null });
        queryBuilder.eq = () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: null })
          })
        });
        return queryBuilder;
      },
      insert: (data: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data: { id: 'mock-id', ...data }, error: null })
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: () => Promise.resolve({ data: { ...data }, error: null })
          })
        })
      }),
      upsert: (data: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data: { id: 'mock-id', ...data }, error: null })
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ data: null, error: null })
      })
    }),
    storage: {
      from: (bucket: string) => ({
        upload: (path: string, file: File) => Promise.resolve({ 
          data: { path: `mock/${path}` }, 
          error: null 
        }),
        getPublicUrl: (path: string) => ({ 
          data: { publicUrl: `/storage/${bucket}/${path}` } 
        }),
        remove: (paths: string[]) => Promise.resolve({ data: null, error: null }),
        list: () => Promise.resolve({ data: [], error: null })
      })
    },
    auth: {
      signUp: (credentials: any) => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: (credentials: any) => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: (callback: any) => ({ data: { subscription: { unsubscribe: () => {} } } })
    }
  } as any;
};

// Export the configured client
export const supabase = createSupabaseClient();

// Database utilities
export const withErrorHandling = async <T>(
  operation: () => Promise<{ data: T; error: any }>
): Promise<{ data: T | null; error: string | null }> => {
  try {
    const { data, error } = await operation();
    
    if (error) {
      console.error('Database error:', error);
      return { data: null, error: error.message || 'Database operation failed' };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

// Connection health check
export const checkConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('employees').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
};

export default supabase;

// For production deployment, replace the above with:
// import { createClient } from '@supabase/supabase-js'
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// export const supabase = createClient(supabaseUrl, supabaseKey) 