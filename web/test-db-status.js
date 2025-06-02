const { createClient } = require("@supabase/supabase-js");

console.log("🔍 HR Portal Database Connection Status Check\n");

// Use the configured Supabase credentials
const supabaseUrl = "https://tqtwdkobrzzrhrqdxprs.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTU0MTgsImV4cCI6MjA2Mzg3MTQxOH0.xM1V6pUAOIrALa8E1o8Ma8j7csavI2kPjIfS6RPu15s";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabaseConnection() {
  console.log("1. Testing Basic Database Connection...");

  try {
    const startTime = Date.now();
    const { data, error } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);
    const duration = Date.now() - startTime;

    if (error) {
      console.log("   ❌ Database connection failed:", error.message);
      return false;
    }

    console.log(`   ✅ Database connection successful (${duration}ms)`);
    return true;
  } catch (err) {
    console.log("   ❌ Connection error:", err.message);
    return false;
  }
}

async function testAuthSystem() {
  console.log("\n2. Testing Auth System...");

  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.log("   ❌ Auth system error:", error.message);
      return false;
    }

    console.log("   ✅ Auth system responding");
    console.log(
      `   - Session status: ${data.session ? "Active session found" : "No active session"}`,
    );
    return true;
  } catch (err) {
    console.log("   ❌ Auth connection error:", err.message);
    return false;
  }
}

async function testCriticalTables() {
  console.log("\n3. Testing Critical Tables...");

  const tables = [
    "profiles",
    "employees",
    "jobs",
    "applications",
    "leave_requests",
    "training_courses",
    "workflows",
    "meeting_rooms",
    "assets",
    "expenses",
  ];

  const results = [];

  for (const table of tables) {
    try {
      const startTime = Date.now();
      const { data, error } = await supabase.from(table).select("*").limit(1);
      const duration = Date.now() - startTime;

      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`);
        results.push({ table, status: "error", error: error.message });
      } else {
        console.log(`   ✅ ${table}: Accessible (${duration}ms)`);
        results.push({ table, status: "success", duration });
      }
    } catch (error) {
      console.log(`   ❌ ${table}: ${error.message}`);
      results.push({ table, status: "error", error: error.message });
    }
  }

  return results;
}

async function testRealtimeConnection() {
  console.log("\n4. Testing Realtime Connection...");

  try {
    const channel = supabase.channel("test-channel");

    const subscription = channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("   ✅ Realtime connection successful");
      } else if (status === "CHANNEL_ERROR") {
        console.log("   ❌ Realtime connection failed");
      }
    });

    // Cleanup after a short test
    setTimeout(() => {
      channel.unsubscribe();
    }, 2000);

    return true;
  } catch (err) {
    console.log("   ❌ Realtime error:", err.message);
    return false;
  }
}

async function runAllTests() {
  const dbConnected = await testDatabaseConnection();
  const authWorking = await testAuthSystem();
  const tableResults = await testCriticalTables();
  await testRealtimeConnection();

  // Summary
  console.log("\n📊 SUMMARY:");
  console.log("=====================================");

  console.log(
    `Database Connection: ${dbConnected ? "✅ Working" : "❌ Failed"}`,
  );
  console.log(`Auth System: ${authWorking ? "✅ Working" : "❌ Failed"}`);

  const successfulTables = tableResults.filter(
    (r) => r.status === "success",
  ).length;
  const totalTables = tableResults.length;
  console.log(
    `Tables Accessible: ${successfulTables}/${totalTables} ${successfulTables === totalTables ? "✅" : "⚠️"}`,
  );

  // Failed tables
  const failedTables = tableResults.filter((r) => r.status === "error");
  if (failedTables.length > 0) {
    console.log("\n❌ Failed Tables:");
    failedTables.forEach((table) => {
      console.log(`   - ${table.table}: ${table.error}`);
    });
  }

  // Recommendations
  if (!dbConnected || !authWorking || successfulTables < totalTables) {
    console.log("\n🔧 RECOMMENDATIONS:");
    console.log("=====================================");

    if (!dbConnected) {
      console.log("1. Check if Supabase project is running");
      console.log("2. Verify environment variables");
      console.log("3. Check network connectivity");
    }

    if (!authWorking) {
      console.log("4. Verify auth settings in Supabase dashboard");
      console.log("5. Check RLS policies on auth tables");
    }

    if (successfulTables < totalTables) {
      console.log("6. Run database migrations");
      console.log("7. Check table permissions and RLS policies");
      console.log("8. Verify schema matches expected structure");
    }
  } else {
    console.log("\n🎉 All systems operational!");
  }

  console.log("\n=====================================");
}

// Run the tests
runAllTests().catch((error) => {
  console.error("❌ Test suite failed:", error.message);
  process.exit(1);
});
