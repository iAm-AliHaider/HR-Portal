import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';

// Global singleton to prevent multiple auth listeners
let authListenerActive = false;
let authSubscription: any = null;
import { mockAccounts } from '../components/ui/MockAccountInfo';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Extended user type to include profile information
export interface User {
  id: string;
  email: string;
  name?: string;
  department?: string;
  position?: string;
  avatar?: string;
  role?: string;
}

// Helper to safely use localStorage with fallback
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      }
      return null;
    } catch (err) {
      console.warn('localStorage access error:', err);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch (err) {
      console.warn('localStorage write error:', err);
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      }
    } catch (err) {
      console.warn('localStorage remove error:', err);
    }
  },
  clear: () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.clear();
      }
    } catch (err) {
      console.warn('localStorage clear error:', err);
    }
  }
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const isProduction = process.env.NODE_ENV === 'production';

  // Helper to convert Supabase user to our User type
  const convertSupabaseUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      // Additional fields would be populated from user profile table in a real app
    };
  };

  // Helper to fetch user profile with retry logic
  const fetchUserProfile = async (userId: string, retries: number = 3): Promise<{ role: string; profile: any } | null> => {
    try {
      // Add production safety check
      if (typeof window === 'undefined') {
        console.warn('fetchUserProfile called on server side, skipping');
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Handle specific error cases more gracefully in production
        if (error.code === 'PGRST116') {
          console.warn('Profile not found for user:', userId);
          
          if (retries > 0) {
            // Try to create profile
            try {
              const { data: authUser } = await supabase.auth.getUser();
              if (authUser.user) {
                const { data: newProfile, error: createError } = await supabase
                  .from('profiles')
                  .insert([{
                    id: authUser.user.id,
                    email: authUser.user.email,
                    first_name: authUser.user.user_metadata?.first_name || authUser.user.user_metadata?.full_name || 'User',
                    last_name: authUser.user.user_metadata?.last_name || '',
                    role: authUser.user.user_metadata?.role || 'employee'
                  }])
                  .select()
                  .single();
                
                if (!createError && newProfile) {
                  return { role: newProfile.role, profile: newProfile };
                }
              }
            } catch (createErr) {
              console.warn('Failed to create profile:', createErr);
            }
          }
          
          // Return default for missing profile
          return { role: 'employee', profile: { id: userId, role: 'employee' } };
        }
        
        if (retries > 0) {
          console.warn(`Error fetching profile, retrying... (${retries} attempts left):`, error.message);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          return fetchUserProfile(userId, retries - 1);
        }
        
        console.error('Error fetching user profile:', error.message);
        // Return default role instead of null to prevent app crashes
        return { role: 'employee', profile: { id: userId, role: 'employee' } };
      }

      // If profile exists but role is null/undefined, try to fix it
      if (data && (!data.role || data.role === null)) {
        console.warn('Profile exists but role is missing, attempting to fix...');
        
        try {
          // Try to get role from auth metadata
          const { data: authUser } = await supabase.auth.getUser();
          const roleFromAuth = authUser.user?.user_metadata?.role || 'employee';
          
          // Update the profile with the role
          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({ 
              role: roleFromAuth,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single();
          
          if (!updateError && updatedProfile) {
            console.log('Successfully updated profile with role:', roleFromAuth);
            return { role: updatedProfile.role, profile: updatedProfile };
          } else {
            console.error('Failed to update profile role:', updateError);
            // Return with default role as fallback
            return { role: 'employee', profile: { ...data, role: 'employee' } };
          }
        } catch (updateErr) {
          console.warn('Error updating profile role:', updateErr);
          return { role: 'employee', profile: { ...data, role: 'employee' } };
        }
      }

      return { role: data?.role || 'employee', profile: data };
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      // Return safe default instead of null
      return { role: 'employee', profile: { id: userId, role: 'employee' } };
    }
  };

  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('Authentication timeout reached, setting default state');
      if (loading) {
        // Set a safe default state instead of null to prevent login loops
        const fallbackUser: User = {
          id: 'fallback-user',
          email: 'demo@company.com',
          name: 'Demo User',
          role: 'employee',
          department: 'HR',
          position: 'Employee'
        };
        setUser(fallbackUser);
        setRole('employee');
        setLoading(false);
      }
    }, 5000); // Reduced timeout to 5 seconds to prevent long waits

    const getInitialSession = async () => {
      try {
        // Clear any previous errors
        setError(null);

        // If we're on login or logout page, don't auto-login
        if (typeof window !== 'undefined') {
          const isLoginPage = window.location.pathname.includes('login');
          const isLogoutPage = window.location.pathname.includes('logout');
          
          if (isLoginPage || isLogoutPage) {
            setUser(null);
            setRole(null);
            setLoading(false);
            clearTimeout(timeout);
            return;
          }
        }

        // Try to get the current session with error handling
        try {
          // Add timeout to supabase calls
          const sessionPromise = supabase.auth.getSession();
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Session timeout')), 5000)
          );
          
          const { data, error: sessionError } = await Promise.race([
            sessionPromise,
            timeoutPromise
          ]) as { data: { session: any } | null; error: Error | null };
          
          if (sessionError) {
            console.error('Session error:', sessionError);
            setError(sessionError.message);
            setLoading(false);
            clearTimeout(timeout);
            return;
          }

          if (data?.session?.user) {
            const supabaseUser = convertSupabaseUser(data.session.user);
            setUser(supabaseUser);
            
            // Fetch user profile and role with timeout
            try {
              const profileData = await Promise.race([
                fetchUserProfile(data.session.user.id),
                new Promise<never>((_, reject) => 
                  setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
                )
              ]) as { role: string; profile: any } | null;
              
              if (profileData && profileData.role) {
                setRole(profileData.role);
              } else {
                console.warn('No role found for user, defaulting to employee');
                setRole('employee');
              }
            } catch (profileError) {
              console.warn('Profile fetch failed, using default role:', profileError);
              setRole('employee');
            }
          } else {
            // No active session - redirect to login
            console.log('No active session, clearing user state');
            setUser(null);
            setRole(null);
            
            // Redirect to login if not already there
            if (typeof window !== 'undefined' && 
                !window.location.pathname.includes('login') && 
                !window.location.pathname.includes('logout')) {
              console.log('Redirecting to login due to no session');
              window.location.href = '/login';
            }
          }
        } catch (authError) {
          console.error('Authentication system error:', authError);
          setError(`Authentication system unavailable: ${authError instanceof Error ? authError.message : 'Unknown error'}`);
        }
      } catch (err) {
        console.error('Unexpected error in getSession:', err);
        setError('Failed to connect to authentication service');
      } finally {
        setLoading(false);
        clearTimeout(timeout);
      }
    };

    getInitialSession();

    // Set up the auth change listener
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          const supabaseUser = convertSupabaseUser(session.user);
          setUser(supabaseUser);
          
          // Fetch user profile and role with timeout
          try {
            const profileData = await Promise.race([
              fetchUserProfile(session.user.id),
              new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
              )
            ]) as { role: string; profile: any } | null;
            
            if (profileData && profileData.role) {
              setRole(profileData.role);
            } else {
              setRole('employee');
            }
          } catch (err) {
            console.warn('Profile fetch in auth change failed:', err);
            setRole('employee');
          }
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // Simplified role fetching since it's handled above
  useEffect(() => {
    // Role is now fetched in the main useEffect above
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const supabaseUser = convertSupabaseUser(data.user);
        setUser(supabaseUser);
        
        // Fetch user profile
        const profileData = await fetchUserProfile(data.user.id);
        if (profileData?.role) {
          setRole(profileData.role);
        }
        
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting sign out process...');
      
      // First, clear local state immediately
      setUser(null);
      setRole(null);
      setError(null);
      
      // Clear localStorage for development mode
      if (isDevelopment || isDemoMode) {
        safeLocalStorage.removeItem('mockUserEmail');
        safeLocalStorage.removeItem('mockUserRole');
        console.log('Cleared localStorage for dev mode');
      }
      
      // Call Supabase sign out
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error.message);
        // Don't throw error, just log it since we've already cleared local state
      } else {
        console.log('Successfully signed out from Supabase');
      }
      
      // Force a page reload to ensure complete session cleanup
      if (typeof window !== 'undefined') {
        // Clear any remaining session data
        try {
          safeLocalStorage.clear();
        } catch (err) {
          console.warn('Error clearing localStorage:', err);
        }
        
        // Redirect to login page with a clean reload
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Unexpected error during sign out:', err);
      // Even if there's an error, ensure we clear local state and redirect
      setUser(null);
      setRole(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  // Alias for signOut for compatibility
  const logout = async () => {
    await signOut();
  };

  return {
    user,
    role,
    loading,
    error,
    signIn,
    signOut,
    logout,
  };
} 