import { User as SupabaseUser } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase/client";

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
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Use refs to prevent stale closures and infinite loops
  const authListenerRef = useRef<any>(null);
  const isInitializedRef = useRef(false);
  const mountedRef = useRef(true);

  // Helper to safely update state only if component is still mounted
  const safeSetState = useCallback((updater: () => void) => {
    if (mountedRef.current) {
      updater();
    }
  }, []);

  // Helper to convert Supabase user to our User type
  const convertSupabaseUser = useCallback(
    (supabaseUser: SupabaseUser, profile: any = null): User => {
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
    },
    [],
  );

  // Helper to fetch user profile with retry logic
  const fetchUserProfile = useCallback(
    async (
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
    },
    [],
  );

  // Handle auth state changes
  const handleAuthStateChange = useCallback(
    async (event: string, session: any) => {
      console.log("Auth state changed:", event);

      if (!mountedRef.current) return;

      try {
        if (session?.user) {
          const profileData = await fetchUserProfile(session.user.id);
          if (profileData && mountedRef.current) {
            const userWithProfile = convertSupabaseUser(
              session.user,
              profileData.profile,
            );
            safeSetState(() => {
              setUser(userWithProfile);
              setRole(profileData.role);
            });
            console.log("Auth state change - user set:", userWithProfile.email);
          }
        } else {
          safeSetState(() => {
            setUser(null);
            setRole(null);
          });
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        safeSetState(() => {
          setError("Authentication state error");
        });
      }
    },
    [fetchUserProfile, convertSupabaseUser, safeSetState],
  );

  // Initialize auth state
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    console.log("Initializing auth state...");

    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (mountedRef.current && loading) {
        console.warn("Authentication timeout reached");
        safeSetState(() => {
          setLoading(false);
          setError("Authentication timeout - please refresh the page");
        });
      }
    }, 10000);

    const getInitialSession = async () => {
      try {
        safeSetState(() => setError(null));

        // Skip auth on login/logout pages
        if (typeof window !== "undefined") {
          const isAuthPage =
            window.location.pathname.includes("login") ||
            window.location.pathname.includes("logout") ||
            window.location.pathname.includes("signup") ||
            window.location.pathname.includes("register") ||
            window.location.pathname.includes("test-auth");

          if (isAuthPage) {
            safeSetState(() => {
              setUser(null);
              setRole(null);
              setLoading(false);
            });
            clearTimeout(timeout);
            return;
          }
        }

        // Get current session
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          safeSetState(() => {
            setError(sessionError.message);
            setLoading(false);
          });
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

          if (profileData && mountedRef.current) {
            const userWithProfile = convertSupabaseUser(
              data.session.user,
              profileData.profile,
            );
            safeSetState(() => {
              setUser(userWithProfile);
              setRole(profileData.role);
            });
            console.log(
              "User authenticated successfully:",
              userWithProfile.email,
              "Role:",
              profileData.role,
            );
          } else {
            console.error("Failed to fetch profile data");
            safeSetState(() => setError("Failed to load user profile"));
          }
        } else {
          // No active session - redirect to login ONLY if not currently signing in
          console.log("No active session found");
          safeSetState(() => {
            setUser(null);
            setRole(null);
          });

          if (
            typeof window !== "undefined" &&
            !window.location.pathname.includes("login") &&
            !window.location.pathname.includes("register") &&
            !window.location.pathname.includes("test-auth") &&
            !isSigningIn
          ) {
            console.log("Redirecting to login...");
            // Use a timeout to prevent infinite redirect loops
            setTimeout(() => {
              window.location.href = "/login";
            }, 100);
          }
        }
      } catch (err) {
        console.error("Error during authentication:", err);
        safeSetState(() => setError("Authentication system error"));
      } finally {
        safeSetState(() => setLoading(false));
        clearTimeout(timeout);
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      handleAuthStateChange,
    );
    authListenerRef.current = authListener;

    return () => {
      clearTimeout(timeout);
      if (authListenerRef.current) {
        authListenerRef.current.subscription.unsubscribe();
        authListenerRef.current = null;
      }
    };
  }, []); // Remove isSigningIn dependency to prevent re-initialization

  // Handle component unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (authListenerRef.current) {
        authListenerRef.current.subscription.unsubscribe();
        authListenerRef.current = null;
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      safeSetState(() => {
        setError(null);
        setLoading(true);
        setIsSigningIn(true);
      });

      console.log("Attempting to sign in user:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error.message);
        safeSetState(() => setError(error.message));
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log("Sign in successful for:", data.user.email);

        // Fetch user profile
        const profileData = await fetchUserProfile(data.user.id);
        if (profileData && mountedRef.current) {
          const userWithProfile = convertSupabaseUser(
            data.user,
            profileData.profile,
          );

          // IMMEDIATELY set user state - don't wait for auth listener
          console.log("Setting user state immediately:", userWithProfile.email);
          safeSetState(() => {
            setUser(userWithProfile);
            setRole(profileData.role);
          });

          console.log(
            "User profile loaded:",
            userWithProfile.name,
            "Role:",
            profileData.role,
          );

          // Return success with user data for immediate use
          return {
            success: true,
            user: userWithProfile,
            role: profileData.role,
          };
        } else {
          safeSetState(() => setError("Failed to load user profile"));
          return { success: false, error: "Failed to load user profile" };
        }
      }

      return { success: false, error: "Login failed - no user data returned" };
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred";
      console.error("Sign in exception:", errorMessage);
      safeSetState(() => setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      safeSetState(() => {
        setLoading(false);
        setIsSigningIn(false);
      });
    }
  };

  const signOut = async () => {
    try {
      console.log("Starting sign out process...");

      // Clear local state immediately
      safeSetState(() => {
        setUser(null);
        setRole(null);
        setError(null);
      });

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Sign out error:", error.message);
        safeSetState(() => setError(error.message));
        return { success: false, error: error.message };
      }

      console.log("Sign out successful");
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred";
      console.error("Sign out exception:", errorMessage);
      safeSetState(() => setError(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      safeSetState(() => {
        setError(null);
        setLoading(true);
      });

      console.log("Attempting to create account for:", email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            full_name: name,
          },
        },
      });

      if (error) {
        console.error("Sign up error:", error.message);
        safeSetState(() => setError(error.message));
        return { success: false, error: error.message };
      }

      console.log("Sign up successful for:", email);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred";
      console.error("Sign up exception:", errorMessage);
      safeSetState(() => setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      safeSetState(() => setLoading(false));
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
  };
}
