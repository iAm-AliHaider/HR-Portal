#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");

// Configuration
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://tqtwdkobrzzrhrqdxprs.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94";

// Initialize Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Required tables
const requiredTables = [
  "profiles",
  "departments",
  "skills",
  "employee_skills",
  "leave_types",
  "leave_balances",
  "leave_requests",
  "training_courses",
  "course_enrollments",
  "jobs",
  "applications",
  "interviews",
  "loan_programs",
  "loan_applications",
  "loan_repayments",
  "meeting_rooms",
  "room_bookings",
  "equipment_inventory",
  "equipment_bookings",
  "request_categories",
  "request_types",
  "requests",
  "safety_incidents",
  "safety_equipment_checks",
];

// Helper functions
const logSuccess = (message) => console.log(`✅ ${message}`);
const logError = (message) => console.log(`❌ ${message}`);
const logInfo = (message) => console.log(`ℹ️ ${message}`);

async function verifyTables() {
  let missingTables = [];
  let existingTables = [];

  for (const table of requiredTables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });

      if (error) {
        logError(`Table '${table}' verification failed: ${error.message}`);
        missingTables.push(table);
      } else {
        logSuccess(`Table '${table}' exists`);
        existingTables.push(table);
      }
    } catch (error) {
      logError(`Error checking table '${table}': ${error.message}`);
      missingTables.push(table);
    }
  }

  return { missingTables, existingTables };
}

async function main() {
  console.log(
    "======================================================================",
  );
  console.log("SUPABASE TABLE VERIFICATION");
  console.log(
    "======================================================================",
  );

  // Verify tables
  logInfo("Verifying database tables...");
  const { missingTables, existingTables } = await verifyTables();

  console.log(
    "\n======================================================================",
  );
  console.log("VERIFICATION RESULTS");
  console.log(
    "======================================================================",
  );

  if (missingTables.length === 0) {
    logSuccess("All required tables have been created successfully!");
  } else {
    logError(
      `${missingTables.length} tables are still missing: ${missingTables.join(", ")}`,
    );
  }

  logSuccess(`${existingTables.length} tables exist in the database`);

  console.log("\nVerification process complete!");
}

// Run the main function
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
