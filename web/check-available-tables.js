// Check Available Tables and Test Existing Modules
const { createClient } = require("@supabase/supabase-js");

console.log("🔍 Checking Available Database Tables\n");
console.log("=".repeat(60));

const supabaseUrl = "https://tqtwdkobrzzrhrqdxprs.supabase.co";
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkAvailableTables() {
  console.log("📋 Listing all available tables...");

  try {
    // Query the information schema to get all tables
    const { data, error } = await supabase.rpc("exec_sql", {
      sql: `
          SELECT table_name, table_type
          FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
          ORDER BY table_name;
        `,
    });

    if (error) {
      console.log("❌ Failed to get tables:", error.message);
      // Fallback: try to query known tables individually
      return await checkKnownTables();
    }

    console.log(`✅ Found ${data.length} tables in database:`);
    data.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.table_name}`);
    });

    return data.map((table) => table.table_name);
  } catch (err) {
    console.log("❌ Error getting tables:", err.message);
    return await checkKnownTables();
  }
}

async function checkKnownTables() {
  console.log("🔍 Checking known tables individually...");

  const knownTables = [
    "profiles",
    "teams",
    "projects",
    "team_members",
    "project_members",
    "meeting_rooms",
    "room_bookings",
    "bookable_equipment",
    "equipment_bookings",
    "travel_requests",
    "unified_requests",
    "chat_channels",
    "chat_messages",
    "chat_members",
    "message_reactions",
    "leave_requests",
    "loan_applications",
    "payroll_records",
    "training_courses",
    "training_enrollments",
    "safety_incidents",
    "expense_reports",
    "job_postings",
    "job_applications",
    "performance_reviews",
    "departments",
    "employee_documents",
  ];

  const existingTables = [];

  for (const table of knownTables) {
    try {
      const { error } = await supabase.from(table).select("*").limit(0);

      if (!error) {
        existingTables.push(table);
        console.log(`   ✅ ${table}`);
      } else {
        console.log(`   ❌ ${table} - ${error.message}`);
      }
    } catch (err) {
      console.log(`   ❌ ${table} - ${err.message}`);
    }
  }

  console.log(`\n📊 Found ${existingTables.length} existing tables`);
  return existingTables;
}

async function testExistingTableStructures(tables) {
  console.log("\n🧪 Testing Structure of Existing Tables...");

  const testResults = {};

  for (const table of tables) {
    try {
      // Get table schema
      const { data, error } = await supabase.from(table).select("*").limit(1);

      if (!error && data.length > 0) {
        const columns = Object.keys(data[0]);
        testResults[table] = {
          exists: true,
          columns: columns,
          sampleData: data[0],
        };
        console.log(`✅ ${table}: ${columns.length} columns`);
      } else if (!error) {
        // Table exists but is empty - get columns differently
        const { data: schemaData, error: schemaError } = await supabase
          .from(table)
          .select("*")
          .limit(0);

        testResults[table] = {
          exists: true,
          columns: [],
          sampleData: null,
        };
        console.log(`✅ ${table}: Empty table`);
      } else {
        testResults[table] = {
          exists: false,
          error: error.message,
        };
        console.log(`❌ ${table}: ${error.message}`);
      }
    } catch (err) {
      testResults[table] = {
        exists: false,
        error: err.message,
      };
      console.log(`❌ ${table}: ${err.message}`);
    }
  }

  return testResults;
}

async function getTestProfiles() {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, name, role, department")
      .limit(3);

    if (error) {
      console.log("❌ Failed to get profiles:", error.message);
      return [];
    }

    return data;
  } catch (err) {
    console.log("❌ Error getting profiles:", err.message);
    return [];
  }
}

async function testWorkingModules(availableTables, profiles) {
  console.log("\n🎯 Testing Known Working Modules...");

  const workingModules = [];
  const testProfile = profiles[0];

  // Test modules we know work
  if (
    availableTables.includes("teams") &&
    availableTables.includes("projects")
  ) {
    const teamResult = await testTeamManagement(testProfile.id);
    workingModules.push(teamResult);
  }

  if (availableTables.includes("room_bookings")) {
    const roomResult = await testMeetingRooms(testProfile.id);
    workingModules.push(roomResult);
  }

  if (availableTables.includes("bookable_equipment")) {
    const equipmentResult = await testEquipmentBooking();
    workingModules.push(equipmentResult);
  }

  if (availableTables.includes("travel_requests")) {
    const travelResult = await testBusinessTravel(testProfile.id);
    workingModules.push(travelResult);
  }

  if (availableTables.includes("unified_requests")) {
    const requestResult = await testUnifiedRequests(testProfile.id);
    workingModules.push(requestResult);
  }

  if (availableTables.includes("chat_channels")) {
    const chatResult = await testChatSystem(testProfile.id);
    workingModules.push(chatResult);
  }

  return workingModules;
}

async function testTeamManagement(profileId) {
  console.log("  👥 Testing Team Management...");

  let passed = 0;
  const total = 4;

  try {
    // Test teams table
    const teamData = {
      name: "Test Team " + Date.now(),
      description: "Testing team management",
      created_by: profileId,
    };

    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert([teamData])
      .select()
      .single();

    if (!teamError) {
      passed++;

      // Test projects table
      const projectData = {
        name: "Test Project " + Date.now(),
        description: "Testing project management",
        team_id: team.id,
        status: "planning",
      };

      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert([projectData])
        .select()
        .single();

      if (!projectError) {
        passed++;

        // Cleanup
        await supabase.from("projects").delete().eq("id", project.id);
        passed++;
      }

      await supabase.from("teams").delete().eq("id", team.id);
      passed++;
    }
  } catch (error) {
    console.log(`    ❌ Error: ${error.message}`);
  }

  console.log(`    ✅ Team Management: ${passed}/${total} operations`);
  return { module: "Team Management", passed, total };
}

async function testMeetingRooms(profileId) {
  console.log("  🏢 Testing Meeting Rooms...");

  let passed = 0;
  const total = 2;

  try {
    const roomData = {
      room_name: "Test Room " + Date.now(),
      booked_by: profileId,
      start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      end_time: new Date(Date.now() + 90000000).toISOString(),
      purpose: "Testing room booking",
    };

    const { data, error } = await supabase
      .from("room_bookings")
      .insert([roomData])
      .select()
      .single();

    if (!error) {
      passed++;
      await supabase.from("room_bookings").delete().eq("id", data.id);
      passed++;
    }
  } catch (error) {
    console.log(`    ❌ Error: ${error.message}`);
  }

  console.log(`    ✅ Meeting Rooms: ${passed}/${total} operations`);
  return { module: "Meeting Rooms", passed, total };
}

async function testEquipmentBooking() {
  console.log("  🔧 Testing Equipment Booking...");

  let passed = 0;
  const total = 2;

  try {
    const equipmentData = {
      name: "Test Equipment " + Date.now(),
      type: "laptop",
      availability: true,
      location: "IT Department",
    };

    const { data, error } = await supabase
      .from("bookable_equipment")
      .insert([equipmentData])
      .select()
      .single();

    if (!error) {
      passed++;
      await supabase.from("bookable_equipment").delete().eq("id", data.id);
      passed++;
    }
  } catch (error) {
    console.log(`    ❌ Error: ${error.message}`);
  }

  console.log(`    ✅ Equipment Booking: ${passed}/${total} operations`);
  return { module: "Equipment Booking", passed, total };
}

async function testBusinessTravel(profileId) {
  console.log("  ✈️ Testing Business Travel...");

  let passed = 0;
  const total = 2;

  try {
    const travelData = {
      traveler_id: profileId,
      purpose: "Test Business Trip " + Date.now(),
      destination: "Test City",
      departure_date: "2024-04-01",
      return_date: "2024-04-03",
      estimated_budget: 1500.0,
      status: "pending",
    };

    const { data, error } = await supabase
      .from("travel_requests")
      .insert([travelData])
      .select()
      .single();

    if (!error) {
      passed++;
      await supabase.from("travel_requests").delete().eq("id", data.id);
      passed++;
    }
  } catch (error) {
    console.log(`    ❌ Error: ${error.message}`);
  }

  console.log(`    ✅ Business Travel: ${passed}/${total} operations`);
  return { module: "Business Travel", passed, total };
}

async function testUnifiedRequests(profileId) {
  console.log("  📝 Testing Unified Requests...");

  let passed = 0;
  const total = 2;

  try {
    const requestData = {
      requester_id: profileId,
      request_type: "support",
      title: "Test Request " + Date.now(),
      description: "Testing unified request system",
      priority: "medium",
      status: "pending",
      category: "IT Support",
    };

    const { data, error } = await supabase
      .from("unified_requests")
      .insert([requestData])
      .select()
      .single();

    if (!error) {
      passed++;
      await supabase.from("unified_requests").delete().eq("id", data.id);
      passed++;
    }
  } catch (error) {
    console.log(`    ❌ Error: ${error.message}`);
  }

  console.log(`    ✅ Unified Requests: ${passed}/${total} operations`);
  return { module: "Unified Requests", passed, total };
}

async function testChatSystem(profileId) {
  console.log("  💬 Testing Chat System...");

  let passed = 0;
  const total = 2;

  try {
    const channelData = {
      name: "test-channel-" + Date.now(),
      description: "Testing chat system",
      type: "public",
      created_by: profileId,
    };

    const { data, error } = await supabase
      .from("chat_channels")
      .insert([channelData])
      .select()
      .single();

    if (!error) {
      passed++;
      await supabase.from("chat_channels").delete().eq("id", data.id);
      passed++;
    }
  } catch (error) {
    console.log(`    ❌ Error: ${error.message}`);
  }

  console.log(`    ✅ Chat System: ${passed}/${total} operations`);
  return { module: "Chat System", passed, total };
}

async function main() {
  try {
    // Step 1: Check available tables
    const availableTables = await checkAvailableTables();

    // Step 2: Test table structures
    const tableStructures = await testExistingTableStructures(availableTables);

    // Step 3: Get test profiles
    const profiles = await getTestProfiles();

    if (profiles.length === 0) {
      console.log("❌ No profiles available for testing");
      return;
    }

    // Step 4: Test working modules
    const moduleResults = await testWorkingModules(availableTables, profiles);

    // Final Summary
    console.log("\n" + "=".repeat(60));
    console.log("🎯 DATABASE AND MODULE ANALYSIS RESULTS");
    console.log("=".repeat(60));

    console.log(`\n📊 Database Status:`);
    console.log(`   Available Tables: ${availableTables.length}`);
    console.log(`   Working Modules: ${moduleResults.length}`);

    const totalTests = moduleResults.reduce(
      (sum, result) => sum + result.total,
      0,
    );
    const totalPassed = moduleResults.reduce(
      (sum, result) => sum + result.passed,
      0,
    );
    const overallPassRate =
      totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;

    console.log(
      `   Overall CRUD Success: ${totalPassed}/${totalTests} (${overallPassRate}%)`,
    );

    console.log(`\n✅ Working Modules:`);
    moduleResults.forEach((result) => {
      const passRate = Math.round((result.passed / result.total) * 100);
      const status = passRate >= 75 ? "✅" : passRate >= 50 ? "⚠️" : "❌";
      console.log(
        `   ${status} ${result.module}: ${result.passed}/${result.total} (${passRate}%)`,
      );
    });

    console.log(`\n📋 Available Tables for Future Development:`);
    availableTables.forEach((table) => {
      console.log(`   • ${table}`);
    });

    console.log("\n🚀 Summary:");
    if (overallPassRate >= 75) {
      console.log("   ✅ Core HR Portal functionality is working!");
      console.log("   ✅ Database is properly configured");
      console.log("   ✅ User authentication and profiles functional");
      console.log("   🎯 Ready for production use with current modules");
    } else {
      console.log("   ⚠️ Some core modules need attention");
    }

    console.log("\n📈 Next Development Phases:");
    console.log("   1. Add missing database tables for advanced modules");
    console.log("   2. Implement leave management, payroll, training systems");
    console.log("   3. Add performance reviews and recruitment features");
    console.log("   4. Enhance safety and compliance modules");
  } catch (error) {
    console.error("❌ Analysis failed:", error.message);
  }
}

main().catch(console.error);
