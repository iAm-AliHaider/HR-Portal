import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabase/client'

// Get environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tqtwdkobrzzrhrqdxprs.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTU0MTgsImV4cCI6MjA2Mzg3MTQxOH0.xM1V6pUAOIrALa8E1o8Ma8j7csavI2kPjIfS6RPu15s'

const supabaseClient = createClient(supabaseUrl, supabaseKey)

// Custom auth hook with tenant context
export const useAuth = () => {
  const signUp = async (email: string, password: string, tenantSlug: string) => {
    // Real implementation using Supabase
    const { data: tenant } = await supabaseClient
      .from('tenants')
      .select('id')
      .eq('slug', tenantSlug)
      .single()

    if (!tenant) throw new Error('Invalid organization')

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password
    })
    
    // Check both data and user existence
    if (data && data.user) {
      await supabaseClient.from('profiles').insert({
        id: data.user.id,
        tenant_id: tenant.id,
        role: 'admin', // First user is admin
        first_name: '',
        last_name: ''
      })
    }
    
    return { user: data?.user || null, error }
  }

  // Fix the direct function references
  const signIn = async (email: string, password: string) => {
    return await supabaseClient.auth.signInWithPassword({ email, password })
  }

  const signOut = async () => {
    return await supabaseClient.auth.signOut()
  }

  return { signUp, signIn, signOut }
}

export const registerUser = async ({ email, password, name }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  return { data, error };
};

export const loginUser = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password })
};

export const logoutUser = async () => {
  return await supabase.auth.signOut()
};

// Development helper utility for bypassing auth - modified to use query params only
export const shouldBypassAuth = (query) => {
  // Only bypass with explicit bypass parameter
  if (query && query.bypass === 'true') {
    return true;
  }
  
  return false;
}; 