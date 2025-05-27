import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';
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
  }
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116' && retries > 0) {
          // Row not found, try to create profile
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
        }
        
        if (retries > 0) {
          console.warn(`Error fetching profile, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          return fetchUserProfile(userId, retries - 1);
        }
        
        console.error('Error fetching user profile:', error.message);
        return null;
      }

      // If profile exists but role is null/undefined, try to fix it
      if (data && (!data.role || data.role === null)) {
        console.warn('Profile exists but role is missing, attempting to fix...');
        
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
      }

      return { role: data?.role || 'employee', profile: data };
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      return null;
    }
  };

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        // Clear any previous errors
        setError(null);

        // If in development mode or demo mode
        if (isDevelopment || isDemoMode) {
          // Check if we're on the login page
          const isLoginPage = typeof window !== 'undefined' && window.location.pathname.includes('login');
          const isLogoutPage = typeof window !== 'undefined' && window.location.pathname.includes('logout');
          
          // Skip auto-login if on login or logout page
          if (isLoginPage || isLogoutPage) {
            setUser(null);
            setRole(null);
            setLoading(false);
            return;
          }
          
          // Check for query parameters (fallback auth method)
          if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const mockEmail = urlParams.get('mockEmail');
            const mockRole = urlParams.get('mockRole');
            const mockName = urlParams.get('mockName');
            const mockBypass = urlParams.get('mockBypass');
            
            if (mockEmail && mockRole && mockBypass === 'true') {
              // Create a mock user from URL parameters
              const mockUser: User = {
                id: `mock-${mockEmail}`,
                email: mockEmail,
                name: mockName || 'Test User',
                role: mockRole,
              };
              
              setUser(mockUser);
              setRole(mockRole);
              
              // Try to store in localStorage for future sessions
              try {
                safeLocalStorage.setItem('mockUserEmail', mockEmail);
              } catch (err) {
                console.warn('Could not save to localStorage:', err);
              }
              
              setLoading(false);
              return;
            }
          }
          
          // Try to get the mock user from localStorage
          const mockEmail = safeLocalStorage.getItem('mockUserEmail');
          
          if (mockEmail) {
            const matchedAccount = mockAccounts.find(account => account.email === mockEmail);
            if (matchedAccount) {
              const mockUser: User = {
                id: `mock-${mockEmail}`,
                email: mockEmail,
                name: matchedAccount.name,
                department: matchedAccount.department,
                position: matchedAccount.position,
                avatar: `/avatars/${matchedAccount.role}.png`,
                role: matchedAccount.role,
              };
              setUser(mockUser);
              setRole(matchedAccount.role);
              setLoading(false);
              return;
            }
          }
          
          // Don't auto-login with default user anymore
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }

        // Normal Supabase authentication for non-development
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error.message);
          setError(`Authentication error: ${error.message}`);
        } else if (data.session?.user) {
          const supabaseUser = convertSupabaseUser(data.session.user);
          setUser(supabaseUser);
          
          // Fetch user profile and role
          const profileData = await fetchUserProfile(data.session.user.id);
          if (profileData?.role) {
            setRole(profileData.role);
          }
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (err) {
        console.error('Unexpected error in getSession:', err);
        setError('Failed to connect to authentication service');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Only set up the auth change listener in non-development/non-demo mode
    if (!isDevelopment && !isDemoMode) {
      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const supabaseUser = convertSupabaseUser(session.user);
          setUser(supabaseUser);
          
          // Fetch user profile and role
          const profileData = await fetchUserProfile(session.user.id);
          if (profileData?.role) {
            setRole(profileData.role);
          }
        } else {
          setUser(null);
          setRole(null);
        }
      });

      return () => {
        listener.subscription.unsubscribe();
      };
    }
    
    return () => {}; // No cleanup needed in development/demo mode
  }, [isDevelopment, isDemoMode]);

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
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
      }
      setUser(null);
      setRole(null);
      
      // Clear localStorage for development mode
      if (isDevelopment || isDemoMode) {
        safeLocalStorage.removeItem('mockUserEmail');
      }
    } catch (err) {
      console.error('Unexpected error during sign out:', err);
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