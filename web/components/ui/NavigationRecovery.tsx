import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * NavigationRecovery Component
 * Detects and fixes navigation issues after errors
 */
export const NavigationRecovery: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  
  useEffect(() => {
    // Detect if navigation is broken
    const checkNavigation = () => {
      try {
        // Test if router is responsive
        const currentPath = router.asPath;
        if (!currentPath) {
          console.warn('Navigation appears broken, attempting recovery');
          window.location.reload();
        }
      } catch (error) {
        console.warn('Navigation error detected:', error);
        // Force reload as last resort
        setTimeout(() => {
          if (confirm('Navigation appears broken. Reload the page?')) {
            window.location.reload();
          }
        }, 2000);
      }
    };
    
    // Check navigation health periodically
    const interval = setInterval(checkNavigation, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [router]);
  
  return <>{children}</>;
};

export default NavigationRecovery;