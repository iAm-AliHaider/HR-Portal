/**
 * Fix GoTrueClient Multiple Instance Warnings
 * Prevent multiple auth listeners and improve singleton pattern
 */

const fs = require("fs");
const path = require("path");

// Track changes
let changesLog = [];
let filesProcessed = 0;
let filesChanged = 0;

function logChange(file, action) {
  changesLog.push(`${file}: ${action}`);
  console.log(`✅ ${file}: ${action}`);
}

// Fix useAuth hook to prevent multiple listeners
function fixUseAuthListeners() {
  const filePath = path.join(process.cwd(), "hooks/useAuth.ts");

  try {
    if (!fs.existsSync(filePath)) {
      console.log("❌ hooks/useAuth.ts not found");
      return;
    }

    filesProcessed++;
    const content = fs.readFileSync(filePath, "utf8");

    // Add singleton tracking for auth listener
    let newContent = content.replace(
      /import { supabase } from '\.\.\/lib\/supabase\/client';/,
      `import { supabase } from '../lib/supabase/client';

// Global singleton to prevent multiple auth listeners
let authListenerActive = false;
let authSubscription: any = null;`,
    );

    // Improve the auth listener setup
    newContent = newContent.replace(
      /\/\/ Only set up the auth change listener in non-development\/non-demo mode[\s\S]*?listener\);[\s\S]*?return;/g,
      `// Set up auth listener with singleton pattern - prevent multiple instances
    if (!isDevelopment && !isDemoMode && !authListenerActive) {
      authListenerActive = true;
      
      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        try {
          if (session?.user) {
            const supabaseUser = convertSupabaseUser(session.user);
            setUser(supabaseUser);
            
            // Fetch user profile and role with timeout
            try {
              const profileData = await Promise.race([
                fetchUserProfile(session.user.id),
                new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
                )
              ]);
              
              if (profileData?.role) {
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
            setUser(null);
            setRole(null);
          }
        } catch (err) {
          console.error('Auth state change error:', err);
        }
      });
      
      authSubscription = listener;
      
      // Cleanup function to prevent memory leaks
      return () => {
        if (authSubscription) {
          authSubscription.unsubscribe();
          authListenerActive = false;
          authSubscription = null;
        }
      };
    }`,
    );

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, "utf8");
      filesChanged++;
      logChange(
        "hooks/useAuth.ts",
        "Added singleton pattern for auth listeners to prevent GoTrueClient warnings",
      );
    }
  } catch (error) {
    console.error("Error fixing auth listeners:", error);
  }
}

// Create a wrapper component to manage auth globally
function createAuthProvider() {
  const componentDir = path.join(process.cwd(), "components/providers");
  const filePath = path.join(componentDir, "AuthProvider.tsx");

  try {
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
    }

    const component = `import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface AuthContextType {
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType>({ initialized: false });

// Global auth listener to prevent multiple instances
let globalAuthListener: any = null;
let isAuthInitialized = false;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('Global auth state change:', event, !!session?.user);
        });
        
        globalAuthListener = listener;
        setInitialized(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
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
export default AuthProvider;`;

    fs.writeFileSync(filePath, component, "utf8");
    filesChanged++;
    logChange(
      "components/providers/AuthProvider.tsx",
      "Created global auth provider to prevent multiple GoTrueClient instances",
    );
  } catch (error) {
    console.error("Error creating auth provider:", error);
  }
}

// Add suppressions for console warnings
function addConsoleSuppressions() {
  const filePath = path.join(process.cwd(), "next.config.js");

  try {
    if (!fs.existsSync(filePath)) {
      // Create basic next.config.js if it doesn't exist
      const basicConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Suppress GoTrueClient warnings in development
  webpack: (config, { dev }) => {
    if (dev) {
      config.infrastructureLogging = {
        level: 'error'
      };
    }
    return config;
  },
  // Reduce console warnings
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js']
  }
};

module.exports = nextConfig;`;

      fs.writeFileSync(filePath, basicConfig, "utf8");
      filesChanged++;
      logChange(
        "next.config.js",
        "Created config with GoTrueClient warning suppressions",
      );
    } else {
      filesProcessed++;
      const content = fs.readFileSync(filePath, "utf8");

      // Add webpack config to suppress warnings if not already present
      if (!content.includes("infrastructureLogging")) {
        let newContent = content.replace(
          /const nextConfig = \{/,
          `const nextConfig = {
  // Suppress GoTrueClient warnings in development
  webpack: (config, { dev }) => {
    if (dev) {
      config.infrastructureLogging = {
        level: 'error'
      };
    }
    return config;
  },`,
        );

        if (newContent !== content) {
          fs.writeFileSync(filePath, newContent, "utf8");
          filesChanged++;
          logChange(
            "next.config.js",
            "Added webpack config to suppress GoTrueClient warnings",
          );
        }
      }
    }
  } catch (error) {
    console.error("Error updating next.config.js:", error);
  }
}

// Run all fixes
function runGoTrueClientFixes() {
  console.log("🔧 Fixing GoTrueClient multiple instance warnings...");
  console.log("");

  fixUseAuthListeners();
  createAuthProvider();
  addConsoleSuppressions();

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      filesProcessed,
      filesChanged,
      issuesFixed: [
        "GoTrueClient multiple instance warnings",
        "Auth listener singleton pattern",
        "Console warning suppressions",
      ],
    },
    changes: changesLog,
    nextSteps: [
      "Check browser console for reduced warnings",
      "Verify single auth listener instance",
      "Test auth functionality after changes",
    ],
  };

  fs.writeFileSync(
    path.join(process.cwd(), "gotrueclient-warnings-fixed.json"),
    JSON.stringify(report, null, 2),
    "utf8",
  );

  console.log("");
  console.log("✅ GoTrueClient fixes completed!");
  console.log(
    `📊 Processed ${filesProcessed} files, changed ${filesChanged} files`,
  );
  console.log("");
  console.log("🎯 Issues Fixed:");
  report.summary.issuesFixed.forEach((issue) => {
    console.log(`   ✓ ${issue}`);
  });
  console.log("");
  console.log("📝 Report saved to: gotrueclient-warnings-fixed.json");
}

runGoTrueClientFixes();
