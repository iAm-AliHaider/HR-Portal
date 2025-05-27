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

  useEffect(() => {
    const getInitialSession = async () => {
      try {
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
          setError(error.message);
        } else if (data.session?.user) {
          setUser(convertSupabaseUser(data.session.user));
        } else {
          setUser(null);
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
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(convertSupabaseUser(session.user));
        } else {
          setUser(null);
        }
      });

      return () => {
        listener.subscription.unsubscribe();
      };
    }
    
    return () => {}; // No cleanup needed in development/demo mode
  }, [isDevelopment, isDemoMode]);

  useEffect(() => {
    if (user && !isDevelopment && !isDemoMode) {
      const fetchUserRole = async () => {
        try {
          // Normal role fetching from Supabase
          const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching user role:', error.message);
            setError(error.message);
          } else {
            setRole(data?.role ?? null);
          }
        } catch (err) {
          console.error('Unexpected error in fetchUserRole:', err);
          setError('Failed to fetch user information');
        }
      };

      fetchUserRole();
    }
  }, [user, isDevelopment, isDemoMode]);

  const signIn = async (email: string, password: string) => {
    try {
      // In development or demo mode with mock users, set localStorage
      if (isDevelopment || isDemoMode) {
        const matchedAccount = mockAccounts.find(account => 
          account.email === email && account.password === password
        );
        
        if (matchedAccount) {
          safeLocalStorage.setItem('mockUserEmail', email);
          
          const mockUser: User = {
            id: `mock-${email}`,
            email: email,
            name: matchedAccount.name,
            department: matchedAccount.department,
            position: matchedAccount.position,
            avatar: `/avatars/${matchedAccount.role}.png`,
            role: matchedAccount.role,
          };
          
          setUser(mockUser);
          setRole(matchedAccount.role);
          return { success: true, user: mockUser };
        } else {
          return { success: false, error: 'Invalid credentials' };
        }
      }

      // Normal Supabase sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        const convertedUser = convertSupabaseUser(data.user);
        setUser(convertedUser);
        return { success: true, user: convertedUser };
      }
      
      return { success: false, error: 'No user data returned' };
    } catch (err) {
      console.error('Unexpected error in signIn:', err);
      setError('Failed to sign in');
      return { success: false, error: 'Failed to sign in' };
    }
  };

  const signOut = async () => {
    try {
      // In development or demo mode with mock users, just clear localStorage
      if (isDevelopment || isDemoMode) {
        safeLocalStorage.removeItem('mockUserEmail');
        setUser(null);
        setRole(null);
        return { success: true };
      }

      // Normal Supabase sign out
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        setError(error.message);
        return { success: false, error: error.message };
      }
      setUser(null);
      setRole(null);
      return { success: true };
    } catch (err) {
      console.error('Unexpected error in signOut:', err);
      setError('Failed to sign out');
      return { success: false, error: 'Failed to sign out' };
    }
  };

  const logout = async () => {
    return signOut();
  };

  return { user, role, loading, error, signIn, signOut, logout };
} 