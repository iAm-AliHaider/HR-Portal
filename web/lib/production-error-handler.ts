// Production Error Handler for HR Portal
// Handles React minified errors and client-side exceptions

import React from "react";

declare global {
  interface Window {
    __PRODUCTION_ERROR_HANDLER_INITIALIZED__?: boolean;
  }
}

// Error patterns that should be suppressed in production
const SUPPRESSED_ERROR_PATTERNS = [
  // Network errors (non-critical)
  /Failed to load resource.*404/,
  /net::ERR_/,
  /fetch.*timeout/,
  /NetworkError/,

  // Browser compatibility (non-critical)
  /ResizeObserver loop limit exceeded/,
  /Non-passive event listener/,

  // Known React development warnings
  /Warning: React does not recognize/,
  /Warning: validateDOMNesting/,
  /Text content does not match server-rendered HTML/,

  // Hydration warnings (handled by error boundaries)
  /Hydration failed because the initial UI/,
  /There was an error while hydrating/,

  // Resource loading (non-critical)
  /favicon\.ico.*404/,
  /apple-touch-icon.*404/,
];

// Critical errors that should NEVER be suppressed
const CRITICAL_ERROR_PATTERNS = [
  /TypeError.*undefined.*not.*function/,
  /ReferenceError/,
  /SyntaxError/,
  /permission denied/i,
  /access denied/i,
  /security error/i,
];

// React error code decoder
const REACT_ERROR_CODES: Record<string, string> = {
  "130": "Element type is invalid - Check component imports/exports",
  "418": "Hydration failed - Server/client mismatch",
  "423": "Cannot update during render - Move state updates to useEffect",
  "152": "Invalid return value from render - Check component return statements",
  "31": "Invalid prop type - Check prop validation",
  "425": "Component state update on unmounted component",
};

// Error categorization
type ErrorCategory = "critical" | "warning" | "suppressed" | "react";

function categorizeError(message: string): ErrorCategory {
  // Check for React minified errors
  const reactErrorMatch = message.match(/Minified React error #(\d+)/);
  if (reactErrorMatch) {
    return "react";
  }

  // Check for critical errors
  if (CRITICAL_ERROR_PATTERNS.some((pattern) => pattern.test(message))) {
    return "critical";
  }

  // Check for suppressed errors
  if (SUPPRESSED_ERROR_PATTERNS.some((pattern) => pattern.test(message))) {
    return "suppressed";
  }

  return "warning";
}

// Enhanced error reporting
function reportError(error: Error, context: Record<string, any> = {}) {
  if (process.env.NODE_ENV === "production") {
    // In a real application, send to error monitoring service
    // Example: Sentry, LogRocket, Bugsnag, etc.

    const errorReport = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: context.userId || "anonymous",
    };

    // Send to monitoring service (uncomment when service is configured)
    /*
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorReport),
    }).catch(() => {
      // Silently fail if error reporting fails
    });
    */

    // For now, log to console with context
    console.error("🚨 Production Error Reported:", errorReport);
  }
}

// Enhanced console.error replacement
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

function enhancedConsoleError(...args: any[]) {
  const message = args.join(" ");
  const category = categorizeError(message);

  switch (category) {
    case "critical":
      originalConsoleError("🚨 CRITICAL ERROR:", ...args);
      reportError(new Error(message), { category: "critical" });
      break;

    case "react":
      const reactErrorMatch = message.match(/Minified React error #(\d+)/);
      if (reactErrorMatch) {
        const errorCode = reactErrorMatch[1];
        const explanation =
          REACT_ERROR_CODES[errorCode] || "Unknown React error";

        originalConsoleError(
          `🔴 React Error #${errorCode}:`,
          explanation,
          "\nOriginal error:",
          ...args,
        );

        reportError(new Error(`React Error #${errorCode}: ${explanation}`), {
          category: "react",
          errorCode,
          originalMessage: message,
        });
      } else {
        originalConsoleError("🔴 React Error:", ...args);
      }
      break;

    case "suppressed":
      if (process.env.NODE_ENV === "development") {
        console.debug("🔇 [Suppressed]", message.substring(0, 100) + "...");
      }
      break;

    default:
      originalConsoleError(...args);
  }
}

// Enhanced console.warn replacement
function enhancedConsoleWarn(...args: any[]) {
  const message = args.join(" ");

  if (SUPPRESSED_ERROR_PATTERNS.some((pattern) => pattern.test(message))) {
    if (process.env.NODE_ENV === "development") {
      console.debug(
        "🔇 [Suppressed Warning]",
        message.substring(0, 100) + "...",
      );
    }
  } else {
    originalConsoleWarn(...args);
  }
}

// Global error handlers
function setupGlobalErrorHandlers() {
  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    const error = event.reason;
    const message = error?.message || "Unknown promise rejection";

    if (SUPPRESSED_ERROR_PATTERNS.some((pattern) => pattern.test(message))) {
      console.debug("🔇 [Handled Promise Rejection]", message);
      event.preventDefault();
      return;
    }

    console.error("🚨 Unhandled Promise Rejection:", error);
    reportError(error, { type: "unhandledPromiseRejection" });

    // Prevent default browser error handling for known issues
    if (process.env.NODE_ENV === "production") {
      event.preventDefault();
    }
  });

  // Handle global JavaScript errors
  window.addEventListener("error", (event) => {
    const error = event.error || new Error(event.message);
    const category = categorizeError(error.message);

    if (category === "suppressed") {
      console.debug("🔇 [Handled Global Error]", error.message);
      event.preventDefault();
      return;
    }

    console.error("🚨 Global Error:", error);
    reportError(error, {
      type: "globalError",
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });
}

// Error boundary helper for React components
export function createErrorBoundary(
  fallbackComponent?: React.ComponentType<any>,
) {
  return class ProductionErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error?: Error }
  > {
    constructor(props: { children: React.ReactNode }) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error("🛡️ Error Boundary Caught:", error, errorInfo);
      reportError(error, {
        type: "errorBoundary",
        componentStack: errorInfo.componentStack,
      });
    }

    render() {
      if (this.state.hasError) {
        if (fallbackComponent) {
          return React.createElement(fallbackComponent, {
            error: this.state.error,
          });
        }

        return React.createElement(
          "div",
          {
            className:
              "error-boundary-fallback p-4 bg-red-50 border border-red-200 rounded-lg",
          },
          [
            React.createElement(
              "h3",
              {
                key: "title",
                className: "text-red-800 font-semibold mb-2",
              },
              "Something went wrong",
            ),
            React.createElement(
              "p",
              {
                key: "description",
                className: "text-red-600 text-sm mb-3",
              },
              "We're sorry, but something unexpected happened. Please refresh the page.",
            ),
            React.createElement(
              "button",
              {
                key: "retry",
                className:
                  "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700",
                onClick: () => window.location.reload(),
              },
              "Refresh Page",
            ),
          ],
        );
      }

      return this.props.children;
    }
  };
}

// Initialize the production error handler
export function initializeProductionErrorHandler() {
  if (
    typeof window === "undefined" ||
    window.__PRODUCTION_ERROR_HANDLER_INITIALIZED__
  ) {
    return;
  }

  // Replace console methods
  console.error = enhancedConsoleError;
  console.warn = enhancedConsoleWarn;

  // Setup global handlers
  setupGlobalErrorHandlers();

  // Mark as initialized
  window.__PRODUCTION_ERROR_HANDLER_INITIALIZED__ = true;

  console.log("🛡️ Production Error Handler Initialized");
}

// Restore original console (for debugging)
export function restoreConsole() {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
}

// Manual error reporting function
export function manualErrorReport(error: Error, context?: Record<string, any>) {
  reportError(error, { ...context, type: "manual" });
}

// React hook for error reporting
export function useErrorReporting() {
  return React.useCallback((error: Error, context?: Record<string, any>) => {
    manualErrorReport(error, context);
  }, []);
}

// Auto-initialize in browser environment
if (typeof window !== "undefined") {
  initializeProductionErrorHandler();
}

export { REACT_ERROR_CODES, categorizeError };
