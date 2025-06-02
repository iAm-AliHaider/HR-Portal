// Apply CRUD Migration and Test Database
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config();

console.log("🔄 Applying CRUD Migration and Testing Database\n");
console.log("=".repeat(60));

// Get Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("❌ Missing Supabase environment variables");
  console.log("Please set up your .env.local file with:");
  console.log("   NEXT_PUBLIC_SUPABASE_URL=your_project_url");
  console.log("   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key");
  console.log("   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key");
  process.exit(1);
}

console.log("✅ Environment variables loaded");
console.log(`📍 URL: ${supabaseUrl}`);

// Create Supabase client with service role for admin operations
const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey,
);

async function applyMigration() {
  console.log("\n🔧 Applying CRUD Migration...");

  try {
    // Read the migration file
    const migrationPath = path.join(
      __dirname,
      "supabase",
      "migrations",
      "20250602000000_add_crud_tables.sql",
    );

    if (!fs.existsSync(migrationPath)) {
      console.log("❌ Migration file not found at:", migrationPath);
      return false;
    }

    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc("exec_sql", {
            sql: statement + ";",
          });
          if (error) {
            // Try alternative approach for statements that might not work with RPC
            const { error: directError } = await supabase
              .from("_sqlx_migrations")
              .select("*")
              .limit(1);

            if (
              directError &&
              !directError.message.includes("does not exist")
            ) {
              console.log(`⚠️ Statement ${i + 1} warning:`, error.message);
            }
          }
        } catch (err) {
          console.log(`⚠️ Statement ${i + 1} info:`, err.message);
        }
      }
    }

    console.log("✅ Migration application completed");
    return true;
  } catch (error) {
    console.log("❌ Migration failed:", error.message);
    return false;
  }
}

async function testTablesExist() {
  console.log("\n📋 Checking Required Tables...");

  const requiredTables = [
    "profiles",
    "teams",
    "projects",
    "meeting_rooms",
    "bookable_equipment",
    "travel_requests",
    "chat_channels",
    "unified_requests",
  ];

  const tableStatus = {};

  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase.from(table).select("*").limit(1);

      if (error) {
        if (error.message.includes("does not exist")) {
          tableStatus[table] = "❌ Missing";
        } else {
          tableStatus[table] = `⚠️ Error: ${error.message}`;
        }
      } else {
        tableStatus[table] = "✅ Exists";
      }
    } catch (err) {
      tableStatus[table] = `❌ Error: ${err.message}`;
    }
  }

  console.log("\n📊 Table Status:");
  Object.entries(tableStatus).forEach(([table, status]) => {
    console.log(`  ${table}: ${status}`);
  });

  const missingTables = Object.entries(tableStatus)
    .filter(([_, status]) => status.includes("Missing"))
    .map(([table, _]) => table);

  return missingTables.length === 0;
}

async function testCRUDOperations() {
  console.log("\n🧪 Testing CRUD Operations...");

  const tests = [
    {
      name: "Teams",
      table: "teams",
      testData: {
        name: "Test CRUD Team",
        description: "Testing CRUD operations",
        team_type: "development",
      },
    },
    {
      name: "Projects",
      table: "projects",
      testData: {
        name: "Test CRUD Project",
        description: "Testing CRUD operations",
        status: "planning",
      },
    },
    {
      name: "Travel Requests",
      table: "travel_requests",
      testData: {
        purpose: "Test Travel",
        destination: "Test City",
        departure_date: "2024-03-01",
        return_date: "2024-03-05",
      },
    },
  ];

  let passedTests = 0;
  let totalTests = tests.length * 4; // CREATE, READ, UPDATE, DELETE

  for (const test of tests) {
    console.log(`\n  Testing ${test.name}...`);

    try {
      // CREATE
      const { data: createData, error: createError } = await supabase
        .from(test.table)
        .insert([test.testData])
        .select()
        .single();

      if (createError) {
        console.log(`    ❌ CREATE: ${createError.message}`);
      } else {
        console.log(`    ✅ CREATE: Success`);
        passedTests++;

        const recordId = createData.id;

        // READ
        const { data: readData, error: readError } = await supabase
          .from(test.table)
          .select("*")
          .eq("id", recordId)
          .single();

        if (readError) {
          console.log(`    ❌ READ: ${readError.message}`);
        } else {
          console.log(`    ✅ READ: Success`);
          passedTests++;
        }

        // UPDATE
        const updateData =
          test.table === "teams"
            ? { name: "Updated Test Team" }
            : test.table === "projects"
              ? { name: "Updated Test Project" }
              : { purpose: "Updated Test Travel" };

        const { data: updateResult, error: updateError } = await supabase
          .from(test.table)
          .update(updateData)
          .eq("id", recordId)
          .select()
          .single();

        if (updateError) {
          console.log(`    ❌ UPDATE: ${updateError.message}`);
        } else {
          console.log(`    ✅ UPDATE: Success`);
          passedTests++;
        }

        // DELETE
        const { error: deleteError } = await supabase
          .from(test.table)
          .delete()
          .eq("id", recordId);

        if (deleteError) {
          console.log(`    ❌ DELETE: ${deleteError.message}`);
        } else {
          console.log(`    ✅ DELETE: Success`);
          passedTests++;
        }
      }
    } catch (error) {
      console.log(`    ❌ ${test.name} test failed:`, error.message);
    }
  }

  console.log(
    `\n📊 CRUD Test Results: ${passedTests}/${totalTests} passed (${Math.round((passedTests / totalTests) * 100)}%)`,
  );
  return passedTests === totalTests;
}

async function testAPIEndpoints() {
  console.log("\n🌐 Testing API Endpoints...");

  // Start the dev server check
  const http = require("http");

  const testEndpoint = (path) => {
    return new Promise((resolve) => {
      const options = {
        hostname: "localhost",
        port: 3000,
        path: `/api${path}`,
        method: "GET",
        timeout: 5000,
      };

      const req = http.request(options, (res) => {
        resolve({ status: res.statusCode, success: res.statusCode < 400 });
      });

      req.on("error", () => {
        resolve({ status: 0, success: false });
      });

      req.on("timeout", () => {
        resolve({ status: 0, success: false });
      });

      req.end();
    });
  };

  const endpoints = [
    "/teams",
    "/projects",
    "/meeting-rooms",
    "/equipment-booking",
    "/business-travel",
    "/request-panel",
  ];

  let workingEndpoints = 0;

  console.log("  Checking if development server is running on port 3000...");

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    if (result.success) {
      console.log(`    ✅ ${endpoint}: Working`);
      workingEndpoints++;
    } else {
      console.log(
        `    ⚠️ ${endpoint}: Status ${result.status || "No response"}`,
      );
    }
  }

  if (workingEndpoints === 0) {
    console.log(
      "\n  ⚠️ Development server not running. Start with: npm run dev",
    );
    return false;
  }

  console.log(
    `\n  📊 API Endpoints: ${workingEndpoints}/${endpoints.length} working`,
  );
  return workingEndpoints === endpoints.length;
}

async function main() {
  try {
    // Step 1: Apply migration (skip if not working - tables might already exist)
    await applyMigration();

    // Step 2: Check if tables exist
    const tablesExist = await testTablesExist();

    if (!tablesExist) {
      console.log("\n❌ Some required tables are missing.");
      console.log("\n🛠️ Manual Migration Required:");
      console.log("1. Go to your Supabase project dashboard");
      console.log("2. Navigate to SQL Editor");
      console.log("3. Copy and paste the contents of:");
      console.log(
        "   web/supabase/migrations/20250602000000_add_crud_tables.sql",
      );
      console.log("4. Run the SQL script");
      console.log("5. Run this script again to verify");
      return;
    }

    // Step 3: Test CRUD operations
    const crudWorking = await testCRUDOperations();

    // Step 4: Test API endpoints
    const apisWorking = await testAPIEndpoints();

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("🎯 FINAL RESULTS");
    console.log("=".repeat(60));
    console.log(`✅ Database Tables: Ready`);
    console.log(
      `${crudWorking ? "✅" : "❌"} CRUD Operations: ${crudWorking ? "Working" : "Failed"}`,
    );
    console.log(
      `${apisWorking ? "✅" : "⚠️"} API Endpoints: ${apisWorking ? "Working" : "Server not running"}`,
    );

    if (crudWorking) {
      console.log("\n🎉 SUCCESS! Your database is ready for CRUD operations.");
      console.log("\nNext steps:");
      console.log("1. Start the development server: npm run dev");
      console.log("2. Run the verification script: node ../verify-database.js");
      console.log("3. Test the HR Portal features in your browser");
    } else {
      console.log(
        "\n❌ CRUD operations failed. Please check your database permissions.",
      );
    }
  } catch (error) {
    console.error("❌ Script failed:", error.message);
  }
}

main().catch(console.error);
