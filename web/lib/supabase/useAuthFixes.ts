import { useEffect, useState } from "react";

import { User as SupabaseUser } from "@supabase/supabase-js";

import { supabase } from "./client";

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

// Production-ready auth hook
export function useAuthFixed() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Helper to convert Supabase user to our User type
  const convertSupabaseUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name:
        supabaseUser.user_metadata?.name ||
        supabaseUser.user_metadata?.full_name,
      role: supabaseUser.user_metadata?.role || "employee",
    };
  };

  // Fetch user profile with error handling
  const fetchUserProfile = async (userId: string): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.warn("Profile fetch error:", error.message);
        return { role: "employee", profile: null };
      }

      return {
        role: data?.role || "employee",
        profile: data || null,
      };
    } catch (err) {
      console.warn("Unexpected error in fetchUserProfile:", err);
      return { role: "employee", profile: null };
    }
  };

  // Initialize auth state
  useEffect(() => {
    if (initialized) return;

    let timeoutId: NodeJS.Timeout;

    const initAuth = async () => {
      try {
        // Set timeout for auth initialization
        timeoutId = setTimeout(() => {
          setLoading(false);
          setInitialized(true);
          setError("Authentication timeout. Please refresh the page.");
          console.error("Authentication initialization timeout");
        }, 5000);

        // Get current session
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error.message);
          setError(error.message);
          setUser(null);
          setRole(null);
          setLoading(false);
          setInitialized(true);
          clearTimeout(timeoutId);
          return;
        }

        if (data?.session) {
          // Session exists, set user
          const supabaseUser = convertSupabaseUser(data.session.user);
          setUser(supabaseUser);

          // Get profile data
          try {
            const { role: userRole } = await fetchUserProfile(
              data.session.user.id,
            );
            setRole(userRole || "employee");
          } catch (profileError) {
            console.warn("Error fetching initial profile:", profileError);
            setRole("employee");
          }
        } else {
          // No session, clear user state
          setUser(null);
          setRole(null);
        }
      } catch (e) {
        console.error("Auth initialization error:", e);
        setError("Authentication initialization failed");
      } finally {
        setLoading(false);
        setInitialized(true);
        clearTimeout(timeoutId);
      }
    };

    initAuth();

    // Set up auth change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        handleAuthChange(event, session);
      },
    );

    return () => {
      clearTimeout(timeoutId);
      authListener?.subscription.unsubscribe();
    };
  }, [initialized]);

  // Handle auth changes
  const handleAuthChange = async (event: string, session: any) => {
    try {
      if (session?.user) {
        const supabaseUser = convertSupabaseUser(session.user);
        setUser(supabaseUser);

        // Get profile
        try {
          const { role: userRole } = await fetchUserProfile(session.user.id);
          setRole(userRole || "employee");
        } catch (err) {
          console.warn("Error in auth change profile fetch:", err);
          setRole("employee");
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setError(null);
    } catch (error) {
      console.error("Error handling auth state change:", error);
      setError("Authentication state change failed");
    }
  };

  // Sign in with error handling
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

      return { success: true, user: data.user };
    } catch (error: any) {
      const errorMessage = error.message || "Sign in failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign up with error handling
  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {},
        },
      });

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user };
    } catch (error: any) {
      const errorMessage = error.message || "Sign up failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign out with error handling
  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      setUser(null);
      setRole(null);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || "Sign out failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setError(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || "Password reset failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    user,
    role,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: role === "admin",
    isManager: role === "manager" || role === "admin",
  };
}
