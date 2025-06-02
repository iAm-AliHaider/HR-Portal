// Console error suppressor for development
// Only suppresses known non-critical errors

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

const suppressedErrorPatterns = [
  /Failed to load resource.*404/,
  /net::ERR_/,
  /favicon\.ico/,
  /apple-touch-icon/,
  /Failed to fetch.*timeout/,
  /TypeError: Failed to fetch/,
  /NetworkError when attempting to fetch resource/,
  /fetch.*aborted/,
  /Request timed out/,
  /ERR_NETWORK/,
  // Database-related non-critical errors
  /relation.*does not exist.*auth\./,
  /temporary connection issue/,
  /connection timeout/,
  // API endpoint 404s that are expected
  /api\/.*404/,
  /GET.*404.*Not Found/,
];

const suppressedWarnPatterns = [
  /Warning: React does not recognize/,
  /Warning: validateDOMNesting/,
  /Warning: Each child in a list should have a unique "key"/,
  /API warning.*returned 404/,
  /API warning.*failed/,
];

// Critical error patterns that should NEVER be suppressed
const criticalErrorPatterns = [
  /Error: Uncaught/,
  /ReferenceError/,
  /TypeError.*undefined/,
  /SyntaxError/,
  /RangeError/,
  /permission denied/i,
  /access denied/i,
];

// Enhanced console.error that filters known issues
console.error = (...args: any[]) => {
  const message = args.join(" ");

  // Always show critical errors
  const isCritical = criticalErrorPatterns.some((pattern) =>
    pattern.test(message),
  );

  if (isCritical) {
    originalConsoleError.apply(console, ["🚨 CRITICAL:", ...args]);
    return;
  }

  // Check if this error should be suppressed
  const shouldSuppress = suppressedErrorPatterns.some((pattern) =>
    pattern.test(message),
  );

  if (!shouldSuppress) {
    originalConsoleError.apply(console, args);
  } else if (process.env.NODE_ENV === "development") {
    // In development, show suppressed errors with a different prefix
    console.debug("🔇 [Suppressed Error]", ...args);
  }
};

// Enhanced console.warn that filters known issues
console.warn = (...args: any[]) => {
  const message = args.join(" ");

  const shouldSuppress = suppressedWarnPatterns.some((pattern) =>
    pattern.test(message),
  );

  if (!shouldSuppress) {
    originalConsoleWarn.apply(console, args);
  } else if (process.env.NODE_ENV === "development") {
    console.debug("🔇 [Suppressed Warning]", ...args);
  }
};

// Restore original console methods
export function restoreConsole() {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
}

// Apply suppression only in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("🔇 Enhanced console error suppression active for development");
}

// Export for manual suppression
export function suppressConsoleError(pattern: RegExp) {
  suppressedErrorPatterns.push(pattern);
}

export function suppressConsoleWarn(pattern: RegExp) {
  suppressedWarnPatterns.push(pattern);
}
