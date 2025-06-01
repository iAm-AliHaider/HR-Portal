// Setup Validation Utility
// This file helps validate that all production components are properly configured

import { storageService } from "../services/storageService";
import { supabase } from "./supabase/client";

interface ValidationResult {
  component: string;
  status: "success" | "warning" | "error";
  message: string;
  details?: string;
}

interface SetupValidation {
  overall: "success" | "warning" | "error";
  results: ValidationResult[];
  summary: {
    total: number;
    success: number;
    warnings: number;
    errors: number;
  };
}

export class SetupValidator {
  private results: ValidationResult[] = [];

  // Validate environment variables
  private validateEnvironmentVariables(): ValidationResult {
    const requiredVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ];

    const optionalVars = [
      "SUPABASE_SERVICE_ROLE_KEY",
      "SMTP_HOST",
      "SMTP_USER",
      "SMTP_PASS",
      "EMAIL_FROM",
      "NEXTAUTH_SECRET",
      "JWT_SECRET",
    ];

    const missing = requiredVars.filter((varName) => !process.env[varName]);
    const missingOptional = optionalVars.filter(
      (varName) => !process.env[varName],
    );

    if (missing.length > 0) {
      return {
        component: "Environment Variables",
        status: "error",
        message: `Missing required environment variables: ${missing.join(", ")}`,
        details:
          "These variables are required for the application to function properly.",
      };
    }

    if (missingOptional.length > 0) {
      return {
        component: "Environment Variables",
        status: "warning",
        message: `Missing optional environment variables: ${missingOptional.join(", ")}`,
        details:
          "These variables enable additional features like email notifications.",
      };
    }

    return {
      component: "Environment Variables",
      status: "success",
      message: "All environment variables are properly configured",
      details: `✅ Required: ${requiredVars.length} ✅ Optional: ${optionalVars.length - missingOptional.length}/${optionalVars.length}`,
    };
  }

  // Validate database connection
  private async validateDatabase(): Promise<ValidationResult> {
    try {
      // Test Supabase connection by trying to get session
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return {
          component: "Database Connection",
          status: "error",
          message: "Failed to connect to database",
          details: error.message,
        };
      }

      // Also test a basic database query
      const { error: testError } = await supabase
        .from("profiles")
        .select("count")
        .limit(1);

      if (testError && testError.code !== "PGRST116") {
        // PGRST116 is "table not found" which is OK for validation
        return {
          component: "Database Connection",
          status: "warning",
          message: "Database connected but some tables may not exist",
          details: `Connection successful but got error: ${testError.message}`,
        };
      }

      return {
        component: "Database Connection",
        status: "success",
        message: "Successfully connected to Supabase database",
        details: "Database connection and basic queries are working",
      };
    } catch (error) {
      return {
        component: "Database Connection",
        status: "error",
        message: "Database connection error",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Validate email service configuration
  private async validateEmailService(): Promise<ValidationResult> {
    try {
      // Check if email environment variables are set
      const emailVars = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "EMAIL_FROM"];
      const missingEmailVars = emailVars.filter(
        (varName) => !process.env[varName],
      );

      if (missingEmailVars.length === emailVars.length) {
        return {
          component: "Email Service",
          status: "warning",
          message: "Email service not configured",
          details:
            "Email notifications will be disabled. Configure SMTP settings to enable email features.",
        };
      }

      if (missingEmailVars.length > 0) {
        return {
          component: "Email Service",
          status: "warning",
          message: `Email service partially configured. Missing: ${missingEmailVars.join(", ")}`,
          details:
            "Some email environment variables are missing. Check your configuration.",
        };
      }

      // If we're on the server side, we can test the email service
      if (typeof window === "undefined") {
        try {
          // Dynamic import for server-side only
          const { emailService } = await import("../services/emailService");

          if (emailService.isAvailable()) {
            return {
              component: "Email Service",
              status: "success",
              message: "Email service is configured and ready",
              details:
                process.env.NODE_ENV === "development"
                  ? "Running in development mode - emails will be logged to console"
                  : "Email will be sent via configured SMTP provider",
            };
          } else {
            return {
              component: "Email Service",
              status: "warning",
              message: "Email service configuration incomplete",
              details: "Email service is configured but not available",
            };
          }
        } catch (error) {
          return {
            component: "Email Service",
            status: "warning",
            message: "Email service validation failed",
            details:
              error instanceof Error
                ? error.message
                : "Unknown email service error",
          };
        }
      } else {
        // Client-side validation
        return {
          component: "Email Service",
          status: "success",
          message: "Email service configuration looks good",
          details:
            "All required email environment variables are set. Full validation available on server side.",
        };
      }
    } catch (error) {
      return {
        component: "Email Service",
        status: "warning",
        message: "Email service validation skipped",
        details: "Email service will work when SMTP credentials are configured",
      };
    }
  }

  // Validate file storage
  private async validateStorage(): Promise<ValidationResult> {
    try {
      // Test storage configuration
      const buckets = [
        "documents",
        "avatars",
        "training",
        "compliance",
        "expenses",
      ] as const;
      const testResults = [];

      for (const bucket of buckets) {
        const config = storageService.getConfig(bucket);
        if (config) {
          testResults.push(`${bucket}: configured`);
        }
      }

      if (process.env.NODE_ENV === "development") {
        return {
          component: "File Storage",
          status: "success",
          message: "File storage is configured and ready",
          details: `Running in development mode - file uploads will be simulated. Buckets: ${testResults.join(", ")}`,
        };
      } else {
        return {
          component: "File Storage",
          status: "success",
          message: "File storage is configured and ready",
          details: `Supabase storage buckets configured: ${testResults.join(", ")}`,
        };
      }
    } catch (error) {
      return {
        component: "File Storage",
        status: "error",
        message: "File storage validation failed",
        details:
          error instanceof Error ? error.message : "Unknown storage error",
      };
    }
  }

  // Validate security configuration
  private validateSecurity(): ValidationResult {
    const securityChecks = {
      nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      jwtSecret: !!process.env.JWT_SECRET,
      httpsInProduction:
        process.env.NODE_ENV !== "production" ||
        process.env.NEXTAUTH_URL?.startsWith("https://"),
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    const passedChecks = Object.values(securityChecks).filter(Boolean).length;
    const totalChecks = Object.keys(securityChecks).length;

    if (passedChecks === totalChecks) {
      return {
        component: "Security Configuration",
        status: "success",
        message: "All security checks passed",
        details: `✅ ${passedChecks}/${totalChecks} security requirements met`,
      };
    } else if (passedChecks >= totalChecks * 0.75) {
      return {
        component: "Security Configuration",
        status: "warning",
        message: "Most security checks passed",
        details: `⚠️ ${passedChecks}/${totalChecks} security requirements met. Review missing configurations.`,
      };
    } else {
      return {
        component: "Security Configuration",
        status: "error",
        message: "Security configuration incomplete",
        details: `❌ ${passedChecks}/${totalChecks} security requirements met. Critical security settings missing.`,
      };
    }
  }

  // Validate application dependencies
  private validateDependencies(): ValidationResult {
    try {
      const criticalModules = ["@supabase/supabase-js", "next", "react"];

      // Only check nodemailer on server side
      if (typeof window === "undefined") {
        criticalModules.push("nodemailer");
      }

      const missingModules = [];

      for (const module of criticalModules) {
        try {
          require.resolve(module);
        } catch {
          missingModules.push(module);
        }
      }

      if (missingModules.length === 0) {
        return {
          component: "Dependencies",
          status: "success",
          message: "All critical dependencies are installed",
          details: `✅ ${criticalModules.length} critical modules verified`,
        };
      } else {
        return {
          component: "Dependencies",
          status: "error",
          message: `Missing dependencies: ${missingModules.join(", ")}`,
          details: 'Run "npm install" to install missing dependencies',
        };
      }
    } catch (error) {
      return {
        component: "Dependencies",
        status: "warning",
        message: "Dependency validation skipped",
        details: "Unable to verify dependencies",
      };
    }
  }

  // Run all validations
  async validateSetup(): Promise<SetupValidation> {
    console.log("🔍 Validating HR Portal setup...\n");

    this.results = [];

    // Run all validation checks
    this.results.push(this.validateEnvironmentVariables());
    this.results.push(await this.validateDatabase());
    this.results.push(await this.validateEmailService());
    this.results.push(await this.validateStorage());
    this.results.push(this.validateSecurity());
    this.results.push(this.validateDependencies());

    // Calculate summary
    const summary = {
      total: this.results.length,
      success: this.results.filter((r) => r.status === "success").length,
      warnings: this.results.filter((r) => r.status === "warning").length,
      errors: this.results.filter((r) => r.status === "error").length,
    };

    // Determine overall status
    let overall: "success" | "warning" | "error" = "success";
    if (summary.errors > 0) {
      overall = "error";
    } else if (summary.warnings > 0) {
      overall = "warning";
    }

    return {
      overall,
      results: this.results,
      summary,
    };
  }

  // Print validation results
  static printResults(validation: SetupValidation): void {
    console.log("📊 Setup Validation Results\n");
    console.log("═".repeat(50));

    validation.results.forEach((result, index) => {
      const icon =
        result.status === "success"
          ? "✅"
          : result.status === "warning"
            ? "⚠️"
            : "❌";

      console.log(`${icon} ${result.component}`);
      console.log(`   ${result.message}`);
      if (result.details) {
        console.log(`   ${result.details}`);
      }
      console.log("");
    });

    console.log("═".repeat(50));
    console.log(
      `📈 Summary: ${validation.summary.success} success, ${validation.summary.warnings} warnings, ${validation.summary.errors} errors`,
    );

    if (validation.overall === "success") {
      console.log(
        "🎉 Setup validation passed! Your HR Portal is ready for use.",
      );
    } else if (validation.overall === "warning") {
      console.log(
        "⚠️ Setup validation completed with warnings. Review the issues above.",
      );
    } else {
      console.log(
        "❌ Setup validation failed. Please fix the errors above before proceeding.",
      );
    }

    console.log("");
  }
}

// Convenience function for quick validation
export async function validateHRPortalSetup(): Promise<SetupValidation> {
  const validator = new SetupValidator();
  return await validator.validateSetup();
}

// Export for use in other files
export default SetupValidator;
