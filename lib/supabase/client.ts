import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Initialize Supabase client with public environment variables
// or use dummy values in development to prevent errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key-for-development'
const isDevelopment = process.env.NODE_ENV === 'development'

// Create a Supabase client for the browser
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

// In development mode, override specific auth methods to always succeed
if (isDevelopment) {
  // Override the auth methods in development
  supabase.auth.getSession = async () => ({
    data: {
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        expires_at: Date.now() + 3600000,
        token_type: 'bearer',
        user: {
          id: 'mock-dev-user-id',
          email: 'dev@example.com',
          role: 'admin',
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          app_metadata: { role: 'admin' },
          user_metadata: {}
        }
      }
    },
    error: null
  } as any); // Use 'as any' to bypass strict typing in development
  
  // Add additional overrides as needed
}

// Helper for tenant-aware queries
export const tenantClient = (tenantId: string) => 
  supabase.from('employees').select().eq('tenant_id', tenantId) 