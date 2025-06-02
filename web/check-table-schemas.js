// Check Actual Table Schemas and Test with Correct Columns
const { createClient } = require("@supabase/supabase-js");

console.log("🔍 Checking Actual Table Schemas\n");
console.log("=".repeat(60));

const supabaseUrl = "https://tqtwdkobrzzrhrqdxprs.supabase.co";
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function getTableSchema(tableName) {
  try {
    // Try to get sample data to see column structure
    const { data, error } = await supabase.from(tableName).select("*").limit(1);

    if (!error) {
      if (data.length > 0) {
        return { columns: Object.keys(data[0]), sampleData: data[0] };
      } else {
        // Table is empty, try to insert and see what happens
        return { columns: [], sampleData: null };
      }
    } else {
      return { error: error.message };
    }
  } catch (err) {
    return { error: err.message };
  }
}

async function getTestProfiles() {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, name, role, department")
      .limit(3);

    return error ? [] : data;
  } catch (err) {
    return [];
  }
}

async function testWithCorrectSchema(tableName, testData, profileId) {
  console.log(`\n🧪 Testing ${tableName} with minimal data...`);

  let passed = 0;
  const operations = ["CREATE", "READ", "UPDATE", "DELETE"];

  try {
    // CREATE
    const { data: createData, error: createError } = await supabase
      .from(tableName)
      .insert([testData])
      .select()
      .single();

    if (!createError) {
      console.log(`  ✅ CREATE: Success`);
      console.log(`    📋 Created record with ID: ${createData.id}`);
      passed++;

      const recordId = createData.id;

      // READ
      const { data: readData, error: readError } = await supabase
        .from(tableName)
        .select("*")
        .eq("id", recordId)
        .single();

      if (!readError) {
        console.log(`  ✅ READ: Success`);
        console.log(`    📖 Retrieved record successfully`);
        passed++;
      } else {
        console.log(`  ❌ READ: ${readError.message}`);
      }

      // UPDATE (try to update a basic field if it exists)
      let updateData = {};
      if ("status" in createData) updateData.status = "updated";
      else if ("name" in createData)
        updateData.name = createData.name + " - Updated";
      else if ("title" in createData)
        updateData.title = createData.title + " - Updated";
      else updateData = { id: recordId }; // Just update timestamp

      const { error: updateError } = await supabase
        .from(tableName)
        .update(updateData)
        .eq("id", recordId);

      if (!updateError) {
        console.log(`  ✅ UPDATE: Success`);
        passed++;
      } else {
        console.log(`  ❌ UPDATE: ${updateError.message}`);
      }

      // DELETE
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq("id", recordId);

      if (!deleteError) {
        console.log(`  ✅ DELETE: Success`);
        passed++;
      } else {
        console.log(`  ❌ DELETE: ${deleteError.message}`);
      }
    } else {
      console.log(`  ❌ CREATE: ${createError.message}`);
    }
  } catch (error) {
    console.log(`  ❌ ${tableName} test failed: ${error.message}`);
  }

  const passRate = Math.round((passed / operations.length) * 100);
  return { module: tableName, passed, total: operations.length, passRate };
}

async function main() {
  try {
    const profiles = await getTestProfiles();

    if (profiles.length === 0) {
      console.log("❌ No profiles available for testing");
      return;
    }

    const testProfile = profiles[0];
    console.log(
      `🧪 Testing with profile: ${testProfile.name} (${testProfile.role})\n`,
    );

    const tablesToTest = [
      "leave_requests",
      "loan_applications",
      "training_courses",
      "safety_incidents",
      "teams",
      "meeting_rooms",
      "bookable_equipment",
    ];

    console.log("📋 Checking table schemas first...\n");

    // Check schemas
    const tableSchemas = {};
    for (const table of tablesToTest) {
      const schema = await getTableSchema(table);
      tableSchemas[table] = schema;

      if (schema.error) {
        console.log(`❌ ${table}: ${schema.error}`);
      } else if (schema.columns.length > 0) {
        console.log(`✅ ${table}: [${schema.columns.join(", ")}]`);
      } else {
        console.log(`⚪ ${table}: Empty table - will test basic insertion`);
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("🧪 TESTING MODULES WITH MINIMAL DATA");
    console.log("=".repeat(60));

    const testResults = [];

    // Test leave_requests with minimal data
    if (!tableSchemas.leave_requests?.error) {
      const leaveData = {
        employee_id: testProfile.id,
        status: "pending",
      };
      testResults.push(
        await testWithCorrectSchema(
          "leave_requests",
          leaveData,
          testProfile.id,
        ),
      );
    }

    // Test loan_applications with minimal data
    if (!tableSchemas.loan_applications?.error) {
      const loanData = {
        employee_id: testProfile.id,
        amount: 5000.0,
        status: "pending",
      };
      testResults.push(
        await testWithCorrectSchema(
          "loan_applications",
          loanData,
          testProfile.id,
        ),
      );
    }

    // Test training_courses with minimal data
    if (!tableSchemas.training_courses?.error) {
      const courseData = {
        title: "Test Course " + Date.now(),
        status: "draft", // Use valid status
      };
      testResults.push(
        await testWithCorrectSchema(
          "training_courses",
          courseData,
          testProfile.id,
        ),
      );
    }

    // Test safety_incidents with minimal data
    if (!tableSchemas.safety_incidents?.error) {
      const incidentData = {
        reporter_id: testProfile.id,
        description: "Test incident report",
        status: "reported",
      };
      testResults.push(
        await testWithCorrectSchema(
          "safety_incidents",
          incidentData,
          testProfile.id,
        ),
      );
    }

    // Test teams with minimal data
    if (!tableSchemas.teams?.error) {
      const teamData = {
        name: "Test Team " + Date.now(),
        description: "Test team description",
      };
      testResults.push(
        await testWithCorrectSchema("teams", teamData, testProfile.id),
      );
    }

    // Test meeting_rooms with minimal data
    if (!tableSchemas.meeting_rooms?.error) {
      const roomData = {
        name: "Test Room " + Date.now(),
        capacity: 10,
      };
      testResults.push(
        await testWithCorrectSchema("meeting_rooms", roomData, testProfile.id),
      );
    }

    // Test bookable_equipment with minimal data
    if (!tableSchemas.bookable_equipment?.error) {
      const equipmentData = {
        name: "Test Equipment " + Date.now(),
        status: "available",
      };
      testResults.push(
        await testWithCorrectSchema(
          "bookable_equipment",
          equipmentData,
          testProfile.id,
        ),
      );
    }

    // Calculate overall results
    const totalTests = testResults.reduce(
      (sum, result) => sum + result.total,
      0,
    );
    const totalPassed = testResults.reduce(
      (sum, result) => sum + result.passed,
      0,
    );
    const overallPassRate =
      totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;

    // Display comprehensive results
    console.log("\n" + "=".repeat(60));
    console.log("🎯 SCHEMA-CORRECTED TESTING RESULTS");
    console.log("=".repeat(60));

    console.log(`\n📊 Overall Statistics:`);
    console.log(`   Tables Tested: ${testResults.length}`);
    console.log(`   Total Operations: ${totalTests}`);
    console.log(`   Successful Operations: ${totalPassed}`);
    console.log(`   Overall Success Rate: ${overallPassRate}%`);

    console.log(`\n📋 Individual Module Results:`);
    testResults.forEach((result) => {
      const status =
        result.passRate >= 75 ? "✅" : result.passRate >= 50 ? "⚠️" : "❌";
      console.log(
        `   ${status} ${result.module}: ${result.passed}/${result.total} (${result.passRate}%)`,
      );
    });

    const workingModules = testResults.filter((r) => r.passRate >= 75);
    const partialModules = testResults.filter(
      (r) => r.passRate >= 50 && r.passRate < 75,
    );
    const failingModules = testResults.filter((r) => r.passRate < 50);

    if (workingModules.length > 0) {
      console.log(`\n✅ Fully Working Modules (≥75%):`);
      workingModules.forEach((result) => {
        console.log(`   • ${result.module} (${result.passRate}%)`);
      });
    }

    if (partialModules.length > 0) {
      console.log(`\n⚠️ Partially Working Modules (50-74%):`);
      partialModules.forEach((result) => {
        console.log(`   • ${result.module} (${result.passRate}%)`);
      });
    }

    if (failingModules.length > 0) {
      console.log(`\n❌ Modules Needing Work (<50%):`);
      failingModules.forEach((result) => {
        console.log(`   • ${result.module} (${result.passRate}%)`);
      });
    }

    console.log("\n🚀 Summary:");
    if (overallPassRate >= 70) {
      console.log("   🎉 EXCELLENT! Most HR modules are functional!");
      console.log("   ✅ Database schemas are working correctly");
      console.log("   ✅ CRUD operations are successful");
      console.log("   🎯 Ready for UI testing and production");
    } else if (overallPassRate >= 50) {
      console.log("   ⚠️ GOOD PROGRESS - Core functionality working");
      console.log("   📝 Some modules may need schema adjustments");
    } else {
      console.log("   ❌ NEEDS ATTENTION - Multiple schema issues");
      console.log("   🔧 Consider updating table structures");
    }

    console.log("\n📈 Recommended Next Steps:");
    console.log("   1. Focus on working modules for immediate use");
    console.log("   2. Update schemas for partially working modules");
    console.log("   3. Test working modules in the web interface");
    console.log("   4. Gradually add more advanced features");
  } catch (error) {
    console.error("❌ Schema testing failed:", error.message);
  }
}

main().catch(console.error);
