import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabase/client'

// Get environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example-key'

const supabaseClient = createClient(supabaseUrl, supabaseKey)

// Custom auth hook with tenant context
export const useAuth = () => {
  const signUp = async (email: string, password: string, tenantSlug: string) => {
    // In development mode, just return a mock successful response
    if (process.env.NODE_ENV === 'development') {
      return {
        user: { id: 'mock-user-id', email },
        error: null
      };
    }

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
    // In development mode, just return a mock successful response
    if (process.env.NODE_ENV === 'development') {
      return {
        data: {
          user: { id: 'mock-user-id', email },
          session: { access_token: 'mock-token' }
        },
        error: null
      };
    }
    return await supabaseClient.auth.signInWithPassword({ email, password })
  }

  const signOut = async () => {
    return await supabaseClient.auth.signOut()
  }

  return { signUp, signIn, signOut }
}

export const registerUser = async ({ email, password, name }) => {
  // In development mode, just return a mock successful response
  if (process.env.NODE_ENV === 'development') {
    return {
      data: {
        user: { id: 'mock-user-id', email },
        session: { access_token: 'mock-token' }
      },
      error: null
    };
  }
  
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
  // In development mode, just return a mock successful response
  if (process.env.NODE_ENV === 'development') {
    return {
      data: {
        user: { id: 'mock-user-id', email },
        session: { access_token: 'mock-token' }
      },
      error: null
    };
  }
  return await supabase.auth.signInWithPassword({ email, password })
};

export const logoutUser = async () => {
  return await supabase.auth.signOut()
};

// Development helper utility for bypassing auth
export const shouldBypassAuth = (query) => {
  // Always bypass in development
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  // Check for explicit bypass parameter
  if (query && query.bypass === 'true') {
    return true;
  }
  
  return false;
}; 