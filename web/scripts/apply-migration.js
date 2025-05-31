#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const chalk = require("chalk");

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

// Helper functions
const logSuccess = (message) => console.log(chalk.green(`✅ ${message}`));
const logError = (message) => console.log(chalk.red(`❌ ${message}`));
const logInfo = (message) => console.log(chalk.blue(`ℹ️ ${message}`));

async function applySqlMigration(filePath) {
  try {
    logInfo(`Reading SQL file: ${filePath}`);
    const sql = fs.readFileSync(filePath, "utf8");

    // Split the SQL into statements
    const statements = sql.split(";").filter((s) => s.trim() !== "");

    logInfo(`Found ${statements.length} SQL statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement.trim()) continue;

      logInfo(`Executing statement ${i + 1}/${statements.length}...`);

      // Execute the SQL statement
      const { error } = await supabase.rpc("pgbouncer_exec_sql", {
        sql: statement + ";",
      });

      if (error) {
        logError(`Error executing statement ${i + 1}: ${error.message}`);
        console.log("Statement:", statement);
        // Continue with next statement
      } else {
        logSuccess(`Statement ${i + 1} executed successfully`);
      }
    }

    logSuccess(`Migration complete: ${filePath}`);
    return true;
  } catch (error) {
    logError(`Error applying migration: ${error.message}`);
    return false;
  }
}

async function verifyTables() {
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
  console.log("=".repeat(70));
  console.log(chalk.blue.bold("SUPABASE DATABASE MIGRATION"));
  console.log("=".repeat(70));

  // Get the migration file path
  const migrationFile = path.resolve(
    __dirname,
    "../supabase/migrations/20250528000000_complete_requirements.sql",
  );

  if (!fs.existsSync(migrationFile)) {
    logError(`Migration file not found: ${migrationFile}`);
    process.exit(1);
  }

  // Apply the migration
  logInfo("Applying migration to Supabase...");
  const success = await applySqlMigration(migrationFile);

  if (!success) {
    logError("Migration failed to apply completely");
  }

  // Verify tables after migration
  logInfo("Verifying database tables...");
  const { missingTables, existingTables } = await verifyTables();

  console.log("\n" + "=".repeat(70));
  console.log(chalk.blue.bold("MIGRATION RESULTS"));
  console.log("=".repeat(70));

  if (missingTables.length === 0) {
    logSuccess("All required tables have been created successfully!");
  } else {
    logError(
      `${missingTables.length} tables are still missing: ${missingTables.join(", ")}`,
    );
    logInfo("You may need to execute specific SQL for these tables manually");
  }

  logSuccess(`${existingTables.length} tables exist in the database`);

  console.log("\nMigration process complete!");
}

// Run the main function
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
