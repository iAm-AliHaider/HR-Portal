import type { NextApiRequest, NextApiResponse } from "next";

interface HealthResponse {
  status: "healthy" | "degraded" | "error";
  database: {
    connected: boolean;
    responseTime: number;
    error?: string;
  };
  services: {
    auth: boolean;
    api: boolean;
    storage: boolean;
  };
  environment: {
    nodeEnv: string;
    version: string;
    uptime: number;
  };
  timestamp: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>,
) {
  const startTime = performance.now();

  try {
    // Check environment configuration
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let dbConnected = false;
    let dbError = "";
    let responseTime = 0;

    // Test database connection if credentials are available
    if (hasSupabaseUrl && hasSupabaseKey) {
      try {
        // Dynamic import to avoid initialization errors
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );

        // Simple connectivity test
        const { error } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .limit(1);

        responseTime = Math.round(performance.now() - startTime);

        if (!error) {
          dbConnected = true;
        } else {
          dbError = error.message;
        }
      } catch (error) {
        dbError =
          error instanceof Error ? error.message : "Unknown database error";
        responseTime = Math.round(performance.now() - startTime);
      }
    } else {
      dbError = "Database credentials not configured";
      responseTime = Math.round(performance.now() - startTime);
    }

    // Determine overall status
    let status: "healthy" | "degraded" | "error" = "healthy";
    if (!dbConnected) {
      status = hasSupabaseUrl && hasSupabaseKey ? "degraded" : "error";
    }

    const healthData: HealthResponse = {
      status,
      database: {
        connected: dbConnected,
        responseTime,
        ...(dbError && { error: dbError }),
      },
      services: {
        auth: hasSupabaseUrl && hasSupabaseKey,
        api: true, // API is responding
        storage: dbConnected,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || "development",
        version: "1.0.0",
        uptime: process.uptime(),
      },
      timestamp: new Date().toISOString(),
    };

    // Return appropriate status code
    const statusCode =
      status === "healthy" ? 200 : status === "degraded" ? 200 : 503;

    res.status(statusCode).json(healthData);
  } catch (error) {
    const responseTime = Math.round(performance.now() - startTime);

    res.status(503).json({
      status: "error",
      database: {
        connected: false,
        responseTime,
        error: error instanceof Error ? error.message : "Health check failed",
      },
      services: {
        auth: false,
        api: true,
        storage: false,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || "development",
        version: "1.0.0",
        uptime: process.uptime(),
      },
      timestamp: new Date().toISOString(),
    });
  }
}
