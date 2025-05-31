import React, { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "@/lib/supabase/client";

interface AuthContextType {
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType>({ initialized: false });

// Global auth listener to prevent multiple instances
let globalAuthListener: any = null;
let isAuthInitialized = false;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Only initialize once globally
    if (isAuthInitialized) {
      setInitialized(true);
      return;
    }

    isAuthInitialized = true;

    // Set up global auth listener
    const initializeAuth = async () => {
      try {
        // Clean up any existing listener
        if (globalAuthListener) {
          globalAuthListener.unsubscribe();
        }

        // Create single global listener
        const { data: listener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log("Global auth state change:", event, !!session?.user);
          },
        );

        globalAuthListener = listener;
        setInitialized(true);
      } catch (error) {
        console.error("Auth initialization error:", error);
        setInitialized(true); // Still mark as initialized to prevent blocking
      }
    };

    initializeAuth();

    // Cleanup on unmount
    return () => {
      if (globalAuthListener) {
        globalAuthListener.unsubscribe();
        globalAuthListener = null;
        isAuthInitialized = false;
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ initialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthProvider = () => useContext(AuthContext);
export default AuthProvider;
