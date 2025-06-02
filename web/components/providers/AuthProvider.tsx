import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType>({ initialized: false });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Simple initialization without global listeners
    // The useAuth hook handles all auth state management
    const timer = setTimeout(() => {
      setInitialized(true);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ initialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
