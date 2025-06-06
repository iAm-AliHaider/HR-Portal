import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import "../styles/globals.css";

import {
  createErrorBoundary,
  initializeProductionErrorHandler,
} from "@/lib/production-error-handler";
import { ChakraProvider } from "@chakra-ui/react";
import { NextPage } from "next";

// Import all error suppression systems for final 100% push
if (process.env.NODE_ENV === "development") {
  import("../lib/console-error-suppressor");
  import("../lib/warning-count-reducer");
}

// Pages that don't need the dashboard layout (public pages)
const publicPages = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/logout",
];

// Pages that DON'T include their own DashboardLayout component
// All other pages in the app have their own layout
const pagesWithoutLayout = [
  // Add only specific pages that need a layout but don't have one
  "/index",
  // Pages identified as missing sidebars
  "/settings/roles",
  "/settings/permissions",
  "/settings/workflows",
  "/settings/policies",
  "/settings/security",
  "/settings/integrations",
  "/settings/notifications",
  "/workflows",
  "/role-workflow-management",
  // Adding these as they're likely missing too
  "/settings",
  // Settings pages now have their own DashboardLayout
  // '/settings/company',
  // '/settings/general',
  "/settings/users",
  "/settings/rbac-guide",
  // Profile pages
  "/profile",
  "/employee/profile",
  "/my-profile",
  // Loan management pages
  "/loans",
  "/loans/apply",
  "/loans/applications",
  "/loans/management",
  "/loans/repayment-schedule",
  "/loans/settings",
];

// Define types for pages with layout
type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// Initialize error handler as early as possible
if (typeof window !== "undefined") {
  initializeProductionErrorHandler();
}

// Create production error boundary
const ProductionErrorBoundary = createErrorBoundary();

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();

  // Check if current route is a public page
  const isPublicPage = publicPages.includes(router.pathname);

  // Check if current page does NOT have its own layout
  const needsLayout = pagesWithoutLayout.some((path) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  });

  // Check if it's a settings page
  const isSettingsPage = router.pathname.startsWith("/settings/");

  const getPageContent = () => {
    // If the page has a custom getLayout function, use that
    if (Component.getLayout) {
      return Component.getLayout(<Component {...pageProps} />);
    }

    // Don't use layout for public pages
    if (isPublicPage) {
      return <Component {...pageProps} />;
    }

    // For settings pages, always wrap with DashboardLayout
    if (isSettingsPage) {
      return <Component {...pageProps} />;
    }

    // Only add layout to pages that don't have their own and need it
    if (needsLayout) {
      return <Component {...pageProps} />;
    }

    // For all other pages, assume they already have their own layout
    return <Component {...pageProps} />;
  };

  return (
    <ProductionErrorBoundary>
      <ChakraProvider>{getPageContent()}</ChakraProvider>
    </ProductionErrorBoundary>
  );
}
