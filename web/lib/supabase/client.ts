import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with public environment variables
// or use provided values as fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tqtwdkobrzzrhrqdxprs.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTU0MTgsImV4cCI6MjA2Mzg3MTQxOH0.xM1V6pUAOIrALa8E1o8Ma8j7csavI2kPjIfS6RPu15s'
const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

// Create a Supabase client for the browser with production-safe settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  // Add global settings for better error handling
  global: {
    headers: {
      'X-Client-Info': `hr-portal-web@1.0.0`,
    },
  },
  // Add retry logic for production
  ...(isProduction && {
    realtime: {
      params: {
        eventsPerSecond: 2,
      },
    },
  }),
})

// Development logging for debugging
if (isDevelopment) {
  console.log('Supabase client initialized with URL:', supabaseUrl)
  console.log('Environment:', process.env.NODE_ENV)
}

// Production-safe error handling
if (isProduction && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('Production deployment detected but NEXT_PUBLIC_SUPABASE_URL not set')
}

// Global type definition
declare global {
  const supabase: ReturnType<typeof createClient>
}

// Helper for tenant-aware queries with error handling
export const tenantClient = (tenantId: string) => {
  try {
    return supabase.from('employees').select().eq('tenant_id', tenantId)
  } catch (error) {
    console.error('Tenant client error:', error)
    throw error
  }
} 