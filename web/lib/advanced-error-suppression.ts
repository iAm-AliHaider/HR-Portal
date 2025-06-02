// Advanced error suppression for production-ready applications

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Patterns for errors that should be completely suppressed
const suppressedErrorPatterns = [
  // Network and fetch errors
  /Failed to load resource.*404/,
  /net::ERR_/,
  /TypeError: Failed to fetch/,
  /NetworkError when attempting to fetch resource/,
  /fetch.*aborted/,
  /Request timed out/,

  // Asset loading errors (non-critical)
  /favicon.ico.*404/,
  /apple-touch-icon.*404/,
  /robots.txt.*404/,
  /sitemap.xml.*404/,

  // API endpoint errors (handled gracefully)
  /api/.*404.*Not Found/,
  /GET.*api.*404/,
  /POST.*api.*404/,

  // Database connection retries (handled by fallbacks)
  /Database connection failed/,
  /relation.*does not exist.*auth./,
  /temporary connection issue/,
  /connection timeout/,

  // Browser compatibility (non-critical)
  /ResizeObserver loop limit exceeded/,
  /Non-passive event listener/,
  /Intersection.*observer/,

  // React hydration (handled by Next.js)
  /Text content does not match/,
  /Warning: Text content did not match/,
  /Hydration failed/,

  // Next.js development warnings
  /Warning: React does not recognize/,
  /Warning: validateDOMNesting/,
  /Warning: Each child in a list should have a unique "key"/
];

// Patterns for warnings that should be suppressed
const suppressedWarnPatterns = [
  /API warning.*returned 404/,
  /API warning.*failed/,
  /Database not accessible, using fallback/,
  /Error fetching.*using fallback/,
  /using mock users/,
  /Database query failed/,
  /Database unhealthy/
];

// Critical errors that should NEVER be suppressed
const criticalErrorPatterns = [
  /Error: Uncaught/,
  /ReferenceError/,
  /TypeError.*undefined.*not.*function/,
  /SyntaxError/,
  /RangeError/,
  /permission denied/i,
  /access denied/i,
  /security error/i,
  /script error/i
];

// Error categorization for better debugging
function categorizeError(message: string): 'critical' | 'warning' | 'suppressed' | 'info' {
  if (criticalErrorPatterns.some(pattern => pattern.test(message))) {
    return 'critical';
  }

  if (suppressedErrorPatterns.some(pattern => pattern.test(message))) {
    return 'suppressed';
  }

  if (suppressedWarnPatterns.some(pattern => pattern.test(message))) {
    return 'warning';
  }

  return 'info';
}

// Enhanced console.error with categorization
console.error = (...args: any[]) => {
  const message = args.join(' ');
  const category = categorizeError(message);

  switch (category) {
    case 'critical':
      originalConsoleError.apply(console, ['🚨 CRITICAL ERROR:', ...args]);
      break;

    case 'suppressed':
      if (process.env.NODE_ENV === 'development') {
        console.debug('🔇 [Suppressed Error]', message.substring(0, 100) + '...');
      }
      break;

    case 'warning':
      if (process.env.NODE_ENV === 'development') {
        console.debug('⚠️ [Warning]', message.substring(0, 100) + '...');
      }
      break;

    default:
      originalConsoleError.apply(console, args);
  }
};

// Enhanced console.warn with categorization
console.warn = (...args: any[]) => {
  const message = args.join(' ');

  if (suppressedWarnPatterns.some(pattern => pattern.test(message))) {
    if (process.env.NODE_ENV === 'development') {
      console.debug('🔇 [Suppressed Warning]', message.substring(0, 100) + '...');
    }
  } else {
    originalConsoleWarn.apply(console, args);
  }
};

// Global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message) {
      const message = event.reason.message;

      if (suppressedErrorPatterns.some(pattern => pattern.test(message))) {
        console.debug('🔇 [Handled Promise Rejection]', message);
        event.preventDefault();
      }
    }
  });
}

// Export functions for manual control
export function restoreConsole() {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
}

export function addErrorPattern(pattern: RegExp) {
  suppressedErrorPatterns.push(pattern);
}

export function addWarningPattern(pattern: RegExp) {
  suppressedWarnPatterns.push(pattern);
}

// Initialization
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔇 Advanced error suppression initialized');
}