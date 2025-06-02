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

  // Refs for cleanup and preventing memory leaks
  const mountedRef = useRef(true);
  const isInitializedRef = useRef(false);
  const authListenerRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Safe state setter to prevent updates on unmounted components
  const safeSetState = useCallback((stateFn: () => void) => {
    if (mountedRef.current) {
      stateFn();
    }
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (authListenerRef.current) {
      authListenerRef.current.subscription.unsubscribe();
      authListenerRef.current = null;
    }
  }, []);

  // Handle component unmount - prevent memory leaks
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

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

  // Initialize auth state
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    console.log("Initializing auth state...");

    // Set a timeout to prevent infinite loading
    timeoutRef.current = setTimeout(() => {
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
            cleanup();
            return;
          }
        }

        // Get current session with timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Session timeout")), 5000),
        );

        const { data, error: sessionError } = (await Promise.race([
          sessionPromise,
          timeoutPromise,
        ])) as any;

        if (sessionError) {
          console.error("Session error:", sessionError);
          safeSetState(() => {
            setError(sessionError.message);
            setLoading(false);
          });
          cleanup();
          return;
        }

        if (data?.session?.user) {
          console.log(
            "Found active session for user:",
            data.session.user.email,
          );

          // Fetch user profile with timeout
          try {
            const profilePromise = fetchUserProfile(data.session.user.id);
            const profileTimeoutPromise = new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("Profile fetch timeout")),
                3000,
              ),
            );

            const profileData = (await Promise.race([
              profilePromise,
              profileTimeoutPromise,
            ])) as any;

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
            }
          } catch (profileError) {
            console.warn(
              "Profile fetch failed, using default role:",
              profileError,
            );
            const userWithoutProfile = convertSupabaseUser(data.session.user);
            safeSetState(() => {
              setUser(userWithoutProfile);
              setRole("employee");
            });
          }
        } else {
          // No active session
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
            setTimeout(() => {
              if (mountedRef.current) {
                window.location.href = "/login";
              }
            }, 100);
          }
        }
      } catch (err) {
        console.error("Error during authentication:", err);
        safeSetState(() => setError("Authentication system error"));
      } finally {
        safeSetState(() => setLoading(false));
        cleanup();
      }
    };

    getInitialSession();

    // Set up auth change listener with proper cleanup
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mountedRef.current) return;

        try {
          console.log("Auth state changed:", event, !!session?.user);

          if (session?.user) {
            try {
              const profileData = await fetchUserProfile(session.user.id);
              if (mountedRef.current) {
                const userWithProfile = convertSupabaseUser(
                  session.user,
                  profileData?.profile,
                );
                safeSetState(() => {
                  setUser(userWithProfile);
                  setRole(profileData?.role || "employee");
                  setError(null);
                });
              }
            } catch (profileError) {
              console.warn("Auth change profile fetch failed:", profileError);
              if (mountedRef.current) {
                const userWithoutProfile = convertSupabaseUser(session.user);
                safeSetState(() => {
                  setUser(userWithoutProfile);
                  setRole("employee");
                });
              }
            }
          } else {
            safeSetState(() => {
              setUser(null);
              setRole(null);
            });
          }
        } catch (error) {
          console.error("Error handling auth state change:", error);
        }
      },
    );

    authListenerRef.current = authListener;

    // Cleanup on effect cleanup
    return () => {
      cleanup();
    };
  }, []); // Empty dependency array - only run once

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

      console.log("Sign in successful");
      return { success: true, user: data.user };
    } catch (error: any) {
      console.error("Sign in exception:", error);
      const errorMessage = error.message || "Sign in failed";
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
      safeSetState(() => setLoading(true));

      await supabase.auth.signOut();

      safeSetState(() => {
        setUser(null);
        setRole(null);
        setError(null);
      });

      // Clear any stored session data
      if (typeof window !== "undefined") {
        localStorage.removeItem("hr-portal-auth");
      }

      return { success: true };
    } catch (error: any) {
      console.error("Sign out error:", error);
      safeSetState(() => setError(error.message));
      return { success: false, error: error.message };
    } finally {
      safeSetState(() => setLoading(false));
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
    isAuthenticated: !!user,
  };
}
