import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with public environment variables
// or use provided values as fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tqtwdkobrzzrhrqdxprs.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTU0MTgsImV4cCI6MjA2Mzg3MTQxOH0.xM1V6pUAOIrALa8E1o8Ma8j7csavI2kPjIfS6RPu15s'
const isDevelopment = process.env.NODE_ENV === 'development'

// Create a Supabase client for the browser
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Development logging for debugging
if (isDevelopment) {
  console.log('Supabase client initialized with URL:', supabaseUrl)
  console.log('Environment:', process.env.NODE_ENV)
}

// Global type definition
declare global {
  const supabase: ReturnType<typeof createClient>
}

// Helper for tenant-aware queries
export const tenantClient = (tenantId: string) => 
  supabase.from('employees').select().eq('tenant_id', tenantId) 