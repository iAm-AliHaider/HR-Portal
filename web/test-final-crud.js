// Final CRUD Test - Complete HR Portal Systems
const { createClient } = require("@supabase/supabase-js");

console.log("🚀 Final CRUD Test for HR Portal Systems\n");
console.log("=".repeat(60));

// Supabase Configuration (from production template)
const supabaseUrl = "https://tqtwdkobrzzrhrqdxprs.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTU0MTgsImV4cCI6MjA2Mzg3MTQxOH0.xM1V6pUAOIrALa8E1o8Ma8j7csavI2kPjIfS6RPu15s";

console.log("✅ Using Supabase Configuration");
console.log(`📍 URL: ${supabaseUrl}`);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabaseTables() {
  console.log("\n📋 Checking Database Tables...\n");

  // Check all tables from our HR Portal
  const tables = [
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
    "offers",
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
    "teams",
    "projects",
    "project_tasks",
    "bookable_equipment",
    "travel_requests",
    "travel_bookings",
    "travel_expenses",
    "chat_channels",
    "channel_members",
    "chat_messages",
    "message_reactions",
    "unified_requests",
    "request_comments",
  ];

  const tableStatus = {};
  let existingTables = 0;

  for (const table of tables) {
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
        existingTables++;
      }
    } catch (err) {
      tableStatus[table] = `❌ Error: ${err.message}`;
    }
  }

  // Display results grouped by module
  console.log("📊 HR Portal Database Status:\n");

  console.log("🏢 Core System:");
  ["profiles", "departments", "skills", "employee_skills"].forEach((table) => {
    console.log(`  ${table}: ${tableStatus[table]}`);
  });

  console.log("\n🏖️ Leave Management:");
  ["leave_types", "leave_balances", "leave_requests"].forEach((table) => {
    console.log(`  ${table}: ${tableStatus[table]}`);
  });

  console.log("\n📚 Training System:");
  ["training_courses", "course_enrollments"].forEach((table) => {
    console.log(`  ${table}: ${tableStatus[table]}`);
  });

  console.log("\n👥 Recruitment:");
  ["jobs", "applications", "interviews", "offers"].forEach((table) => {
    console.log(`  ${table}: ${tableStatus[table]}`);
  });

  console.log("\n💰 Loan Management:");
  ["loan_programs", "loan_applications", "loan_repayments"].forEach((table) => {
    console.log(`  ${table}: ${tableStatus[table]}`);
  });

  console.log("\n🏠 Facility Management:");
  [
    "meeting_rooms",
    "room_bookings",
    "equipment_inventory",
    "equipment_bookings",
  ].forEach((table) => {
    console.log(`  ${table}: ${tableStatus[table]}`);
  });

  console.log("\n📋 Request System:");
  ["request_categories", "request_types", "requests"].forEach((table) => {
    console.log(`  ${table}: ${tableStatus[table]}`);
  });

  console.log("\n👥 Team Management (New):");
  ["teams", "projects", "project_tasks"].forEach((table) => {
    console.log(`  ${table}: ${tableStatus[table]}`);
  });

  console.log("\n📱 Equipment Booking (New):");
  ["bookable_equipment"].forEach((table) => {
    console.log(`  ${table}: ${tableStatus[table]}`);
  });

  console.log("\n✈️ Business Travel (New):");
  ["travel_requests", "travel_bookings", "travel_expenses"].forEach((table) => {
    console.log(`  ${table}: ${tableStatus[table]}`);
  });

  console.log("\n💬 Chat System (New):");
  [
    "chat_channels",
    "channel_members",
    "chat_messages",
    "message_reactions",
  ].forEach((table) => {
    console.log(`  ${table}: ${tableStatus[table]}`);
  });

  console.log("\n📝 Unified Requests (New):");
  ["unified_requests", "request_comments"].forEach((table) => {
    console.log(`  ${table}: ${tableStatus[table]}`);
  });

  console.log(
    `\n📊 Summary: ${existingTables}/${tables.length} tables exist (${Math.round((existingTables / tables.length) * 100)}%)`,
  );

  return { existingTables, totalTables: tables.length, tableStatus };
}

async function testCRUDOperations() {
  console.log("\n🧪 Testing CRUD Operations...\n");

  // Test existing tables that should work
  const existingTableTests = [
    {
      name: "Profiles",
      table: "profiles",
      testData: {
        id: "test-user-id-" + Date.now(),
        email: `test${Date.now()}@example.com`,
        name: "Test User",
        role: "employee",
      },
    },
    {
      name: "Departments",
      table: "departments",
      testData: {
        name: "Test Department " + Date.now(),
        description: "Testing CRUD operations",
      },
    },
    {
      name: "Leave Types",
      table: "leave_types",
      testData: {
        name: "Test Leave " + Date.now(),
        description: "Testing CRUD operations",
        default_days: 5,
      },
    },
    {
      name: "Meeting Rooms",
      table: "meeting_rooms",
      testData: {
        name: "Test Room " + Date.now(),
        capacity: 10,
        location: "Test Building",
      },
    },
  ];

  let passedTests = 0;
  let totalTests = existingTableTests.length * 4; // CREATE, READ, UPDATE, DELETE

  for (const test of existingTableTests) {
    console.log(`  Testing ${test.name}...`);

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
          test.table === "profiles"
            ? { name: "Updated Test User" }
            : test.table === "departments"
              ? { name: "Updated Test Department" }
              : test.table === "leave_types"
                ? { name: "Updated Test Leave" }
                : { name: "Updated Test Room" };

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
  console.log("\n🌐 Testing API Endpoints...\n");

  const http = require("http");

  const testEndpoint = (path) => {
    return new Promise((resolve) => {
      const options = {
        hostname: "localhost",
        port: 3000,
        path: `/api${path}`,
        method: "GET",
        timeout: 3000,
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
    "/chat",
    "/request-panel",
  ];

  let workingEndpoints = 0;

  console.log("  Checking API endpoints...");

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    if (result.success) {
      console.log(`    ✅ ${endpoint}: Working (${result.status})`);
      workingEndpoints++;
    } else {
      console.log(`    ⚠️ ${endpoint}: ${result.status || "No response"}`);
    }
  }

  if (workingEndpoints === 0) {
    console.log(
      "\n  ℹ️ Development server not running. Start with: npm run dev",
    );
    return {
      working: false,
      endpoints: workingEndpoints,
      total: endpoints.length,
    };
  }

  console.log(
    `\n  📊 API Status: ${workingEndpoints}/${endpoints.length} working`,
  );
  return {
    working: workingEndpoints === endpoints.length,
    endpoints: workingEndpoints,
    total: endpoints.length,
  };
}

async function main() {
  try {
    // Step 1: Check database tables
    const { existingTables, totalTables, tableStatus } =
      await checkDatabaseTables();

    // Step 2: Test CRUD operations on existing tables
    const crudWorking = await testCRUDOperations();

    // Step 3: Test API endpoints
    const apiStatus = await testAPIEndpoints();

    // Final Summary
    console.log("\n" + "=".repeat(60));
    console.log("🎯 FINAL HR PORTAL STATUS");
    console.log("=".repeat(60));

    const dbProgress = Math.round((existingTables / totalTables) * 100);
    console.log(
      `📊 Database: ${existingTables}/${totalTables} tables (${dbProgress}%)`,
    );
    console.log(
      `${crudWorking ? "✅" : "❌"} CRUD Operations: ${crudWorking ? "Working" : "Issues detected"}`,
    );
    console.log(
      `${apiStatus.working ? "✅" : "⚠️"} API Endpoints: ${apiStatus.endpoints}/${apiStatus.total} working`,
    );

    if (dbProgress >= 80 && crudWorking) {
      console.log(
        "\n🎉 SUCCESS! HR Portal database is ready for production use.",
      );
      console.log("\n✨ Key Features Available:");
      console.log("   • Employee Management & Profiles");
      console.log("   • Leave Management System");
      console.log("   • Training & Development");
      console.log("   • Recruitment & Hiring");
      console.log("   • Loan Management");
      console.log("   • Facility & Equipment Booking");
      console.log("   • Request Management System");

      if (existingTables === totalTables) {
        console.log("   • Team Management & Projects");
        console.log("   • Business Travel Management");
        console.log("   • Chat & Communication");
        console.log("   • Unified Request Panel");
      }

      console.log("\n🚀 Next Steps:");
      console.log("   1. Start development server: npm run dev");
      console.log("   2. Test in browser at: http://localhost:3000");
      console.log("   3. Create test user accounts");
      console.log("   4. Validate all HR workflows");
    } else if (dbProgress >= 60) {
      console.log("\n⚠️ PARTIAL SUCCESS - Core systems are working.");
      console.log("\n🛠️ Missing Tables:");
      Object.entries(tableStatus)
        .filter(([_, status]) => status.includes("Missing"))
        .forEach(([table, _]) => console.log(`   • ${table}`));

      console.log("\n📋 To Complete Setup:");
      console.log("   1. Apply missing migrations in Supabase dashboard");
      console.log("   2. Run this test again to verify");
    } else {
      console.log("\n❌ SETUP INCOMPLETE - Major database issues detected.");
      console.log("\n🆘 Required Actions:");
      console.log("   1. Check Supabase connection");
      console.log("   2. Apply all database migrations");
      console.log("   3. Verify table permissions");
    }
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("   1. Verify Supabase credentials");
    console.log("   2. Check network connection");
    console.log("   3. Ensure database is accessible");
  }
}

main().catch(console.error);
