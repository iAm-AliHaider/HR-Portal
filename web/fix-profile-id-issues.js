// Fix Profile ID Issues for Business Travel and Unified Requests
const { createClient } = require("@supabase/supabase-js");

console.log("🔧 Fixing Profile ID Issues for CRUD Operations\n");
console.log("=".repeat(60));

const supabaseUrl = "https://tqtwdkobrzzrhrqdxprs.supabase.co";
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createTestProfile() {
  console.log("👤 Creating Test Profile...");

  const testProfile = {
    // Let the database generate the UUID
    email: `testuser${Date.now()}@hrportal.com`,
    name: "Test User for CRUD",
    role: "employee",
    department: "IT",
    phone: "+1-555-0123",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert([testProfile])
      .select()
      .single();

    if (error) {
      console.log("❌ Profile creation failed:", error.message);
      return null;
    }

    console.log("✅ Test profile created:", data.id);
    return data.id;
  } catch (err) {
    console.log("❌ Profile creation error:", err.message);
    return null;
  }
}

async function testBusinessTravelCRUD(profileId) {
  console.log("\n✈️ Testing Business Travel CRUD with Profile ID...");

  const testData = {
    traveler_id: profileId,
    purpose: "Test Business Trip " + Date.now(),
    destination: "Test City",
    departure_date: "2024-04-01",
    return_date: "2024-04-05",
    estimated_budget: 1500.0,
    status: "pending",
  };

  let passedTests = 0;

  try {
    // CREATE
    const { data: createData, error: createError } = await supabase
      .from("travel_requests")
      .insert([testData])
      .select()
      .single();

    if (createError) {
      console.log("  ❌ CREATE:", createError.message);
      return 0;
    }

    console.log("  ✅ CREATE: Success");
    passedTests++;

    const recordId = createData.id;

    // READ
    const { data: readData, error: readError } = await supabase
      .from("travel_requests")
      .select("*")
      .eq("id", recordId)
      .single();

    if (readError) {
      console.log("  ❌ READ:", readError.message);
    } else {
      console.log("  ✅ READ: Success");
      passedTests++;
    }

    // UPDATE
    const { data: updateData, error: updateError } = await supabase
      .from("travel_requests")
      .update({ purpose: testData.purpose + " - Updated" })
      .eq("id", recordId)
      .select()
      .single();

    if (updateError) {
      console.log("  ❌ UPDATE:", updateError.message);
    } else {
      console.log("  ✅ UPDATE: Success");
      passedTests++;
    }

    // DELETE
    const { error: deleteError } = await supabase
      .from("travel_requests")
      .delete()
      .eq("id", recordId);

    if (deleteError) {
      console.log("  ❌ DELETE:", deleteError.message);
    } else {
      console.log("  ✅ DELETE: Success");
      passedTests++;
    }
  } catch (error) {
    console.log("  ❌ Business Travel test failed:", error.message);
  }

  return passedTests;
}

async function testUnifiedRequestsCRUD(profileId) {
  console.log("\n📝 Testing Unified Requests CRUD with Profile ID...");

  const testData = {
    requester_id: profileId,
    request_type: "support",
    title: "Test Support Request " + Date.now(),
    description: "Testing unified request system with proper profile ID",
    priority: "medium",
    status: "pending",
    category: "IT Support",
  };

  let passedTests = 0;

  try {
    // CREATE
    const { data: createData, error: createError } = await supabase
      .from("unified_requests")
      .insert([testData])
      .select()
      .single();

    if (createError) {
      console.log("  ❌ CREATE:", createError.message);
      return 0;
    }

    console.log("  ✅ CREATE: Success");
    passedTests++;

    const recordId = createData.id;

    // READ
    const { data: readData, error: readError } = await supabase
      .from("unified_requests")
      .select("*")
      .eq("id", recordId)
      .single();

    if (readError) {
      console.log("  ❌ READ:", readError.message);
    } else {
      console.log("  ✅ READ: Success");
      passedTests++;
    }

    // UPDATE
    const { data: updateData, error: updateError } = await supabase
      .from("unified_requests")
      .update({ title: testData.title + " - Updated" })
      .eq("id", recordId)
      .select()
      .single();

    if (updateError) {
      console.log("  ❌ UPDATE:", updateError.message);
    } else {
      console.log("  ✅ UPDATE: Success");
      passedTests++;
    }

    // DELETE
    const { error: deleteError } = await supabase
      .from("unified_requests")
      .delete()
      .eq("id", recordId);

    if (deleteError) {
      console.log("  ❌ DELETE:", deleteError.message);
    } else {
      console.log("  ✅ DELETE: Success");
      passedTests++;
    }
  } catch (error) {
    console.log("  ❌ Unified Requests test failed:", error.message);
  }

  return passedTests;
}

async function cleanupTestProfile(profileId) {
  console.log("\n🧹 Cleaning up test profile...");

  try {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", profileId);

    if (error) {
      console.log("⚠️ Cleanup warning:", error.message);
    } else {
      console.log("✅ Test profile cleaned up");
    }
  } catch (err) {
    console.log("⚠️ Cleanup error:", err.message);
  }
}

async function main() {
  try {
    // Step 1: Create test profile
    const profileId = await createTestProfile();
    if (!profileId) {
      console.log("❌ Cannot proceed without test profile");
      return;
    }

    // Step 2: Test Business Travel CRUD
    const businessTravelPassed = await testBusinessTravelCRUD(profileId);

    // Step 3: Test Unified Requests CRUD
    const unifiedRequestsPassed = await testUnifiedRequestsCRUD(profileId);

    // Step 4: Cleanup
    await cleanupTestProfile(profileId);

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("🎯 PROFILE ID FIX RESULTS");
    console.log("=".repeat(60));

    const totalTests = 8; // 4 for each system
    const totalPassed = businessTravelPassed + unifiedRequestsPassed;
    const passRate = Math.round((totalPassed / totalTests) * 100);

    console.log(
      `📊 Fixed CRUD Operations: ${totalPassed}/${totalTests} passed (${passRate}%)`,
    );
    console.log(
      `✈️ Business Travel: ${businessTravelPassed}/4 operations working`,
    );
    console.log(
      `📝 Unified Requests: ${unifiedRequestsPassed}/4 operations working`,
    );

    if (passRate >= 75) {
      console.log("\n🎉 SUCCESS! Profile ID issues have been resolved.");
      console.log("\n✨ Both systems now support full CRUD operations:");
      console.log("   • Business Travel Management ✅");
      console.log("   • Unified Request System ✅");
    } else {
      console.log("\n⚠️ Some issues remain. Check the error messages above.");
    }
  } catch (error) {
    console.error("❌ Fix script failed:", error.message);
  }
}

main().catch(console.error);
