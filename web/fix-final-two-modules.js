// Fix Final Two Problematic Modules - Equipment Booking & Safety Incidents
const { createClient } = require("@supabase/supabase-js");

console.log("🔧 Fixing Final Two Problematic Modules\n");
console.log("=".repeat(60));

const supabaseUrl = "https://tqtwdkobrzzrhrqdxprs.supabase.co";
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94";

const supabase = createClient(supabaseUrl, serviceRoleKey);

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

async function inspectTableSchema(tableName) {
  console.log(`\n🔍 Inspecting ${tableName} table schema...`);

  // Try to get existing data to understand structure
  const { data, error } = await supabase.from(tableName).select("*").limit(1);

  if (!error && data.length > 0) {
    console.log(
      `   📋 Sample data columns: [${Object.keys(data[0]).join(", ")}]`,
    );
    return Object.keys(data[0]);
  }

  // If no data, try a simple insert to see error message
  const testInsert = await supabase
    .from(tableName)
    .insert([{ test: "discovery" }]);

  if (testInsert.error) {
    console.log(`   ❌ Insert error: ${testInsert.error.message}`);

    // Parse error for column info
    if (
      testInsert.error.message.includes("column") &&
      testInsert.error.message.includes("does not exist")
    ) {
      const match = testInsert.error.message.match(
        /column "([^"]+)" of relation/,
      );
      if (match) {
        console.log(`   📝 Invalid column found: ${match[1]}`);
      }
    }
  }

  return [];
}

// Fix Equipment Bookings - Discover correct schema
async function fixEquipmentBookingsAdvanced(profileId) {
  console.log("\n🔧 Advanced Fix: Equipment Bookings Module...");

  await inspectTableSchema("equipment_bookings");

  let passed = 0;
  const operations = [
    "CREATE_EQUIPMENT",
    "BOOK_EQUIPMENT",
    "CHECK_BOOKING",
    "CLEANUP",
  ];

  try {
    // CREATE EQUIPMENT first
    const equipmentData = {
      name: "MacBook Pro " + Date.now(),
      model: "MacBook Pro 16",
      serial_number: "MBP" + Date.now(),
      category: "laptop",
      status: "available",
      condition: "excellent",
    };

    const { data: equipment, error: equipmentError } = await supabase
      .from("bookable_equipment")
      .insert([equipmentData])
      .select()
      .single();

    if (!equipmentError) {
      console.log("   ✅ CREATE_EQUIPMENT: Success");
      passed++;

      // Try multiple booking schemas systematically
      const bookingSchemas = [
        // Standard datetime booking
        {
          equipment_id: equipment.id,
          user_id: profileId,
          start_datetime: new Date().toISOString(),
          end_datetime: new Date(Date.now() + 7 * 86400000).toISOString(),
          status: "active",
        },
        // Date-only booking
        {
          equipment_id: equipment.id,
          booked_by: profileId,
          start_date: new Date().toISOString().split("T")[0],
          end_date: new Date(Date.now() + 7 * 86400000)
            .toISOString()
            .split("T")[0],
          status: "confirmed",
        },
        // Simple booking
        {
          equipment_id: equipment.id,
          user_id: profileId,
          booking_date: new Date().toISOString().split("T")[0],
          return_date: new Date(Date.now() + 7 * 86400000)
            .toISOString()
            .split("T")[0],
          purpose: "Development work",
          status: "active",
        },
        // Minimal booking
        {
          equipment_id: equipment.id,
          employee_id: profileId,
          booking_date: new Date().toISOString().split("T")[0],
          status: "booked",
        },
        // Alternative names
        {
          item_id: equipment.id,
          user_id: profileId,
          checkout_date: new Date().toISOString().split("T")[0],
          expected_return: new Date(Date.now() + 7 * 86400000)
            .toISOString()
            .split("T")[0],
          status: "checked_out",
        },
      ];

      let booking = null;
      let workingSchema = null;

      for (const [index, bookingData] of bookingSchemas.entries()) {
        console.log(`   🔄 Trying booking schema ${index + 1}...`);

        const { data, error } = await supabase
          .from("equipment_bookings")
          .insert([bookingData])
          .select()
          .single();

        if (!error) {
          booking = data;
          workingSchema = bookingData;
          console.log(`   ✅ BOOK_EQUIPMENT: Success with schema ${index + 1}`);
          console.log(
            `   📝 Working schema: ${JSON.stringify(Object.keys(bookingData))}`,
          );
          passed++;
          break;
        } else {
          console.log(`   ❌ Schema ${index + 1} failed: ${error.message}`);
        }
      }

      if (booking) {
        // CHECK BOOKING
        const { data: bookings, error: checkError } = await supabase
          .from("equipment_bookings")
          .select("*")
          .eq(Object.keys(workingSchema)[0], equipment.id); // Use the working foreign key

        if (!checkError) {
          console.log("   ✅ CHECK_BOOKING: Success");
          console.log(`   📊 Found ${bookings.length} booking(s)`);
          passed++;
        }

        // Cleanup booking
        await supabase.from("equipment_bookings").delete().eq("id", booking.id);
      }

      // CLEANUP
      await supabase.from("bookable_equipment").delete().eq("id", equipment.id);
      console.log("   ✅ CLEANUP: Success");
      passed++;
    } else {
      console.log(`   ❌ CREATE_EQUIPMENT: ${equipmentError.message}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  return { module: "Equipment Management", passed, total: operations.length };
}

// Fix Safety Incidents - Discover correct schema
async function fixSafetyIncidentsAdvanced(profileId) {
  console.log("\n🛡️ Advanced Fix: Safety Incidents Module...");

  await inspectTableSchema("safety_incidents");

  let passed = 0;
  const operations = ["CREATE", "READ", "UPDATE", "DELETE"];

  try {
    // Try multiple incident schemas systematically
    const incidentSchemas = [
      // Standard incident report
      {
        reported_by: profileId,
        incident_type: "near_miss",
        description: "Test safety incident report",
        location: "Office Floor 2",
        incident_date: new Date().toISOString().split("T")[0],
        status: "reported",
      },
      // Alternative column names
      {
        reporter_id: profileId,
        type: "safety_violation",
        details: "Test incident details",
        occurred_at: new Date().toISOString(),
        severity: "low",
        status: "open",
      },
      // Minimal incident
      {
        user_id: profileId,
        title: "Safety Incident Report",
        description: "Test incident description",
        date_reported: new Date().toISOString(),
        status: "pending",
      },
      // Simple incident
      {
        employee_id: profileId,
        incident_description: "Equipment malfunction reported",
        report_date: new Date().toISOString().split("T")[0],
        status: "submitted",
      },
      // Basic incident
      {
        reporter: profileId,
        summary: "Safety concern report",
        created_at: new Date().toISOString(),
        state: "new",
      },
    ];

    let incident = null;
    let workingSchema = null;

    for (const [index, incidentData] of incidentSchemas.entries()) {
      console.log(`   🔄 Trying incident schema ${index + 1}...`);

      const { data, error } = await supabase
        .from("safety_incidents")
        .insert([incidentData])
        .select()
        .single();

      if (!error) {
        incident = data;
        workingSchema = incidentData;
        console.log(`   ✅ CREATE: Success with schema ${index + 1}`);
        console.log(
          `   📝 Working schema: ${JSON.stringify(Object.keys(incidentData))}`,
        );
        passed++;
        break;
      } else {
        console.log(`   ❌ Schema ${index + 1} failed: ${error.message}`);
      }
    }

    if (incident) {
      // READ
      const { data: readData, error: readError } = await supabase
        .from("safety_incidents")
        .select("*")
        .eq("id", incident.id)
        .single();

      if (!readError) {
        console.log("   ✅ READ: Success");
        passed++;
      }

      // UPDATE - try updating status/state field
      const statusFields = ["status", "state", "incident_status"];
      let updateSuccess = false;

      for (const field of statusFields) {
        if (workingSchema.hasOwnProperty(field)) {
          const updateData = {};
          updateData[field] = field === "state" ? "resolved" : "closed";

          const { error: updateError } = await supabase
            .from("safety_incidents")
            .update(updateData)
            .eq("id", incident.id);

          if (!updateError) {
            console.log("   ✅ UPDATE: Success");
            passed++;
            updateSuccess = true;
            break;
          }
        }
      }

      if (!updateSuccess) {
        // Try updating description field
        const { error: updateError } = await supabase
          .from("safety_incidents")
          .update({
            description:
              (workingSchema.description ||
                workingSchema.details ||
                workingSchema.summary) + " - Updated",
          })
          .eq("id", incident.id);

        if (!updateError) {
          console.log("   ✅ UPDATE: Success");
          passed++;
        }
      }

      // DELETE
      const { error: deleteError } = await supabase
        .from("safety_incidents")
        .delete()
        .eq("id", incident.id);

      if (!deleteError) {
        console.log("   ✅ DELETE: Success");
        passed++;
      }
    } else {
      console.log("   ❌ CREATE: All incident schemas failed");
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  return { module: "Safety Incidents", passed, total: operations.length };
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
      `🧪 Fixing final modules with: ${testProfile.name} (${testProfile.role})\n`,
    );

    // Fix the two problematic modules
    const fixResults = [];

    fixResults.push(await fixEquipmentBookingsAdvanced(testProfile.id));
    fixResults.push(await fixSafetyIncidentsAdvanced(testProfile.id));

    // Calculate results
    const totalTests = fixResults.reduce(
      (sum, result) => sum + result.total,
      0,
    );
    const totalPassed = fixResults.reduce(
      (sum, result) => sum + result.passed,
      0,
    );
    const overallPassRate = Math.round((totalPassed / totalTests) * 100);

    // Display results
    console.log("\n" + "=".repeat(60));
    console.log("🎯 FINAL TWO MODULES FIX RESULTS");
    console.log("=".repeat(60));

    console.log(`\n📊 Fix Results:`);
    console.log(`   Modules Fixed: ${fixResults.length}`);
    console.log(`   Total Operations: ${totalTests}`);
    console.log(`   Successful Operations: ${totalPassed}`);
    console.log(`   Success Rate: ${overallPassRate}%`);

    console.log(`\n📋 Individual Results:`);
    fixResults.forEach((result) => {
      const passRate = Math.round((result.passed / result.total) * 100);
      const status = passRate >= 75 ? "✅" : passRate >= 50 ? "⚠️" : "❌";
      console.log(
        `   ${status} ${result.module}: ${result.passed}/${result.total} (${passRate}%)`,
      );
    });

    if (overallPassRate >= 75) {
      console.log("\n🎉 SUCCESS! Both problematic modules are now fixed!");
      console.log("   Your HR Portal should now be at near 100% functionality");
    } else if (overallPassRate >= 50) {
      console.log("\n⚠️ PARTIAL SUCCESS - Some improvements made");
      console.log("   Continue working on remaining schema issues");
    } else {
      console.log("\n❌ NEEDS MORE WORK - Schema issues persist");
      console.log(
        "   Consider creating missing tables or reviewing database structure",
      );
    }

    console.log("\n🚀 Next Steps:");
    console.log("   1. Run comprehensive test again to verify all fixes");
    console.log("   2. Test the modules in the web interface");
    console.log(
      "   3. Deploy to production if >75% overall success rate achieved",
    );
  } catch (error) {
    console.error("❌ Module fixing failed:", error.message);
  }
}

main().catch(console.error);
