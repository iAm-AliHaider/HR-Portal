import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

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

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to convert Supabase user to our User type
  const convertSupabaseUser = (
    supabaseUser: SupabaseUser,
    profile: any = null,
  ): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name:
        profile?.name ||
        supabaseUser.user_metadata?.name ||
        supabaseUser.user_metadata?.full_name ||
        "User",
      department: profile?.department || "N/A",
      position: profile?.position || "Employee",
      avatar: profile?.avatar_url || null,
      role: profile?.role || "employee",
    };
  };

  // Helper to fetch user profile with retry logic
  const fetchUserProfile = async (
    userId: string,
    retries: number = 2,
  ): Promise<{ role: string; profile: any } | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // Profile not found, create one
          console.log(
            "Profile not found, creating new profile for user:",
            userId,
          );

          try {
            const { data: authUser } = await supabase.auth.getUser();
            if (authUser.user) {
              const newProfile = {
                id: authUser.user.id,
                email: authUser.user.email,
                name:
                  authUser.user.user_metadata?.name ||
                  authUser.user.user_metadata?.full_name ||
                  authUser.user.email?.split("@")[0] ||
                  "User",
                role: authUser.user.user_metadata?.role || "employee",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };

              const { data: createdProfile, error: createError } =
                await supabase
                  .from("profiles")
                  .insert([newProfile])
                  .select()
                  .single();

              if (!createError && createdProfile) {
                console.log("Successfully created profile:", createdProfile);
                return { role: createdProfile.role, profile: createdProfile };
              } else {
                console.error("Failed to create profile:", createError);
              }
            }
          } catch (createErr) {
            console.warn("Failed to create profile:", createErr);
          }

          // Return default if creation fails
          return {
            role: "employee",
            profile: { id: userId, role: "employee", name: "User" },
          };
        }

        if (retries > 0) {
          console.warn(
            `Error fetching profile, retrying... (${retries} attempts left):`,
            error.message,
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return fetchUserProfile(userId, retries - 1);
        }

        console.error("Error fetching user profile:", error.message);
        return {
          role: "employee",
          profile: { id: userId, role: "employee", name: "User" },
        };
      }

      // Ensure role is not null
      if (!data.role) {
        console.warn("Profile found but role is missing, updating...");
        const { data: updatedProfile } = await supabase
          .from("profiles")
          .update({ role: "employee", updated_at: new Date().toISOString() })
          .eq("id", userId)
          .select()
          .single();

        return {
          role: "employee",
          profile: updatedProfile || { ...data, role: "employee" },
        };
      }

      return { role: data.role, profile: data };
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
      return {
        role: "employee",
        profile: { id: userId, role: "employee", name: "User" },
      };
    }
  };

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Authentication timeout reached");
        setLoading(false);
        setError("Authentication timeout - please refresh the page");
      }
    }, 10000);

    const getInitialSession = async () => {
      try {
        setError(null);

        // Skip auth on login/logout pages
        if (typeof window !== "undefined") {
          const isAuthPage =
            window.location.pathname.includes("login") ||
            window.location.pathname.includes("logout") ||
            window.location.pathname.includes("signup");

          if (isAuthPage) {
            setUser(null);
            setRole(null);
            setLoading(false);
            clearTimeout(timeout);
            return;
          }
        }

        // Get current session
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          setLoading(false);
          clearTimeout(timeout);
          return;
        }

        if (data?.session?.user) {
          console.log(
            "Found active session for user:",
            data.session.user.email,
          );

          // Fetch user profile
          const profileData = await fetchUserProfile(data.session.user.id);

          if (profileData) {
            const userWithProfile = convertSupabaseUser(
              data.session.user,
              profileData.profile,
            );
            setUser(userWithProfile);
            setRole(profileData.role);
            console.log(
              "User authenticated successfully:",
              userWithProfile.email,
              "Role:",
              profileData.role,
            );
          } else {
            console.error("Failed to fetch profile data");
            setError("Failed to load user profile");
          }
        } else {
          // No active session - redirect to login
          console.log("No active session found");
          setUser(null);
          setRole(null);

          if (
            typeof window !== "undefined" &&
            !window.location.pathname.includes("login")
          ) {
            console.log("Redirecting to login...");
            window.location.href = "/login";
          }
        }
      } catch (err) {
        console.error("Error during authentication:", err);
        setError("Authentication system error");
      } finally {
        setLoading(false);
        clearTimeout(timeout);
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          console.log("Auth state changed:", event);

          if (session?.user) {
            const profileData = await fetchUserProfile(session.user.id);
            if (profileData) {
              const userWithProfile = convertSupabaseUser(
                session.user,
                profileData.profile,
              );
              setUser(userWithProfile);
              setRole(profileData.role);
            }
          } else {
            setUser(null);
            setRole(null);
          }
        } catch (err) {
          console.error("Auth state change error:", err);
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      console.log("Attempting to sign in user:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error.message);
        setError(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log("Sign in successful for:", data.user.email);

        // Fetch user profile
        const profileData = await fetchUserProfile(data.user.id);
        if (profileData) {
          const userWithProfile = convertSupabaseUser(
            data.user,
            profileData.profile,
          );
          setUser(userWithProfile);
          setRole(profileData.role);

          console.log(
            "User profile loaded:",
            userWithProfile.name,
            "Role:",
            profileData.role,
          );
          return { success: true };
        } else {
          setError("Failed to load user profile");
          return { success: false, error: "Failed to load user profile" };
        }
      }

      return { success: false, error: "Login failed - no user data returned" };
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred";
      console.error("Sign in exception:", errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log("Starting sign out process...");

      // Clear local state immediately
      setUser(null);
      setRole(null);
      setError(null);

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Supabase signOut error:", error.message);
      } else {
        console.log("Successfully signed out from Supabase");
      }

      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Error during sign out:", err);
      // Even if there's an error, clear state and redirect
      setUser(null);
      setRole(null);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      setLoading(true);

      console.log("Attempting to sign up user:", email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: "employee",
          },
        },
      });

      if (error) {
        console.error("Sign up error:", error.message);
        setError(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log("Sign up successful for:", data.user.email);
        return {
          success: true,
          message: "Please check your email to confirm your account",
        };
      }

      return {
        success: false,
        error: "Sign up failed - no user data returned",
      };
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred";
      console.error("Sign up exception:", errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    role,
    loading,
    error,
    signIn,
    signOut,
    signUp,
    logout: signOut, // Alias for compatibility
  };
}
