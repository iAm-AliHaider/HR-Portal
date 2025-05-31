// Production Configuration
// This file contains all production-specific settings and validations

export interface ProductionConfig {
  supabase: {
    url: string;
    anonKey: string;
    serviceKey?: string;
  };
  app: {
    name: string;
    url: string;
    environment: string;
  };
  features: {
    enableAuth: boolean;
    requireEmailVerification: boolean;
    enableDebugRoutes: boolean;
    enableMockData: boolean;
    enableFallbackAuth: boolean;
  };
  security: {
    maxFileSize: number;
    allowedFileTypes: string[];
    rateLimitRequests: number;
    rateLimitWindow: number;
  };
  email: {
    supportEmail: string;
    fromEmail: string;
  };
}

// Validate required environment variables
function validateEnvironment(): void {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. ` +
        "Please check your environment configuration.",
    );
  }

  // Validate Supabase URL format
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  if (
    !supabaseUrl.includes("supabase.co") &&
    !supabaseUrl.includes("localhost")
  ) {
    throw new Error(
      "Invalid Supabase URL format. Must be a valid Supabase project URL.",
    );
  }
}

// Get production configuration
export function getProductionConfig(): ProductionConfig {
  // Validate environment before creating config
  validateEnvironment();

  return {
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    app: {
      name: process.env.NEXT_PUBLIC_APP_NAME || "HR Portal",
      url: process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000",
      environment: process.env.NODE_ENV || "development",
    },
    features: {
      enableAuth: process.env.NEXT_PUBLIC_ENABLE_AUTH !== "false",
      requireEmailVerification:
        process.env.NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION === "true",
      enableDebugRoutes: process.env.NEXT_PUBLIC_ENABLE_DEBUG_ROUTES === "true",
      enableMockData: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === "true",
      enableFallbackAuth:
        process.env.NEXT_PUBLIC_ENABLE_FALLBACK_AUTH === "true",
    },
    security: {
      maxFileSize: parseInt(
        process.env.NEXT_PUBLIC_MAX_FILE_SIZE || "10485760",
      ),
      allowedFileTypes: (
        process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES ||
        ".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png"
      ).split(","),
      rateLimitRequests: parseInt(
        process.env.NEXT_PUBLIC_RATE_LIMIT_REQUESTS || "100",
      ),
      rateLimitWindow: parseInt(
        process.env.NEXT_PUBLIC_RATE_LIMIT_WINDOW || "900000",
      ),
    },
    email: {
      supportEmail:
        process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@yourcompany.com",
      fromEmail:
        process.env.NEXT_PUBLIC_FROM_EMAIL || "noreply@yourcompany.com",
    },
  };
}

// Check if we're in production mode
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

// Check if we're in development mode
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

// Check if mock data is enabled (should be false in production)
export function isMockDataEnabled(): boolean {
  const config = getProductionConfig();
  return config.features.enableMockData && !isProduction();
}

// Check if debug routes are enabled (should be false in production)
export function areDebugRoutesEnabled(): boolean {
  const config = getProductionConfig();
  return config.features.enableDebugRoutes && !isProduction();
}

// Validate production readiness
export function validateProductionReadiness(): {
  ready: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  try {
    const config = getProductionConfig();

    // Check environment
    if (!isProduction()) {
      issues.push('NODE_ENV is not set to "production"');
    }

    // Check required environment variables
    if (!config.supabase.url || !config.supabase.anonKey) {
      issues.push("Missing required Supabase credentials");
    }

    // Check that debug features are disabled
    if (config.features.enableMockData) {
      issues.push("Mock data is enabled (should be disabled in production)");
    }

    if (config.features.enableDebugRoutes) {
      issues.push(
        "Debug routes are enabled (should be disabled in production)",
      );
    }

    if (config.features.enableFallbackAuth) {
      issues.push(
        "Fallback authentication is enabled (should be disabled in production)",
      );
    }

    // Check app URL
    if (config.app.url.includes("localhost")) {
      issues.push("App URL is still set to localhost");
    }

    // Check email configuration
    if (config.email.supportEmail.includes("yourcompany.com")) {
      issues.push("Email configuration is using placeholder values");
    }

    return {
      ready: issues.length === 0,
      issues,
    };
  } catch (error) {
    issues.push(
      `Configuration error: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    return {
      ready: false,
      issues,
    };
  }
}

// Export the configuration instance
export const config = getProductionConfig();
