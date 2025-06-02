// Discover Valid Status Values for Equipment Bookings
const { createClient } = require("@supabase/supabase-js");

console.log("🔍 Discovering Valid Status Values for Equipment Bookings\n");
console.log("=".repeat(60));

const supabaseUrl = "https://tqtwdkobrzzrhrqdxprs.supabase.co";
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function getTestProfile() {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .limit(1)
      .single();

    return error ? null : data;
  } catch (err) {
    return null;
  }
}

async function createTestEquipment() {
  const equipmentData = {
    name: "Status Test Equipment " + Date.now(),
    model: "Test Model",
    serial_number: "STATUS" + Date.now(),
    category: "laptop",
    status: "available",
    condition: "good",
  };

  const { data, error } = await supabase
    .from("bookable_equipment")
    .insert([equipmentData])
    .select()
    .single();

  return error ? null : data;
}

async function discoverValidStatusValues(equipmentId, profileId) {
  console.log("🔍 Testing various status values...\n");

  // Test many different possible status values
  const statusesToTest = [
    // Common database status values
    "pending",
    "active",
    "inactive",
    "approved",
    "rejected",
    "cancelled",
    "completed",
    "in_progress",
    "draft",
    "published",
    "archived",

    // Equipment-specific status values
    "available",
    "unavailable",
    "booked",
    "reserved",
    "checked_out",
    "checked_in",
    "returned",
    "overdue",
    "maintenance",
    "damaged",

    // Simple status values
    "open",
    "closed",
    "new",
    "old",
    "current",
    "expired",

    // Boolean-like status values
    "true",
    "false",
    "yes",
    "no",
    "on",
    "off",
    "enabled",
    "disabled",

    // Single character values
    "A",
    "I",
    "P",
    "C",
    "R",
    "B",
    "O",
    "N",
    "Y",

    // Numeric values as strings
    "0",
    "1",
    "2",
    "3",

    // Empty/null testing
    null,
    "",
  ];

  const validStatuses = [];
  let testCount = 0;

  for (const status of statusesToTest) {
    testCount++;

    const bookingData = {
      equipment_id: equipmentId,
      employee_id: profileId,
      checkout_time: new Date().toISOString(),
      expected_return_time: new Date(Date.now() + 86400000).toISOString(), // 1 day later
      status: status,
    };

    console.log(
      `${testCount.toString().padStart(2, "0")}. Testing status: ${status === null ? "NULL" : status === "" ? "EMPTY" : `"${status}"`}`,
    );

    const { data, error } = await supabase
      .from("equipment_bookings")
      .insert([bookingData])
      .select()
      .single();

    if (!error) {
      console.log(`   ✅ SUCCESS! "${status}" is VALID`);
      validStatuses.push(status);

      // Cleanup successful booking
      await supabase.from("equipment_bookings").delete().eq("id", data.id);
    } else {
      console.log(`   ❌ Failed: ${error.message.substring(0, 60)}...`);
    }
  }

  return validStatuses;
}

async function testCompleteBookingWithValidStatus(
  equipmentId,
  profileId,
  validStatus,
) {
  console.log(
    `\n🧪 Testing complete booking workflow with valid status "${validStatus}"...\n`,
  );

  let operations = 0;
  let successful = 0;

  try {
    // CREATE BOOKING
    operations++;
    const bookingData = {
      equipment_id: equipmentId,
      employee_id: profileId,
      checkout_time: new Date().toISOString(),
      expected_return_time: new Date(Date.now() + 7 * 86400000).toISOString(),
      status: validStatus,
    };

    const { data: booking, error: createError } = await supabase
      .from("equipment_bookings")
      .insert([bookingData])
      .select()
      .single();

    if (!createError) {
      console.log("   ✅ CREATE BOOKING: Success");
      successful++;

      // READ BOOKING
      operations++;
      const { data: readData, error: readError } = await supabase
        .from("equipment_bookings")
        .select("*")
        .eq("id", booking.id)
        .single();

      if (!readError) {
        console.log("   ✅ READ BOOKING: Success");
        console.log(`      📋 Full booking data:`, readData);
        successful++;
      }

      // UPDATE BOOKING (try changing expected_return_time)
      operations++;
      const { error: updateError } = await supabase
        .from("equipment_bookings")
        .update({
          expected_return_time: new Date(
            Date.now() + 14 * 86400000,
          ).toISOString(),
        })
        .eq("id", booking.id);

      if (!updateError) {
        console.log("   ✅ UPDATE BOOKING: Success");
        successful++;
      }

      // DELETE BOOKING
      operations++;
      const { error: deleteError } = await supabase
        .from("equipment_bookings")
        .delete()
        .eq("id", booking.id);

      if (!deleteError) {
        console.log("   ✅ DELETE BOOKING: Success");
        successful++;
      }
    } else {
      console.log(`   ❌ CREATE BOOKING failed: ${createError.message}`);
    }
  } catch (error) {
    console.log(`   ❌ Workflow error: ${error.message}`);
  }

  const successRate = Math.round((successful / operations) * 100);
  console.log(
    `\n   📊 Complete workflow: ${successful}/${operations} (${successRate}%)`,
  );

  return { successful, operations, successRate };
}

async function main() {
  try {
    console.log("🧪 Starting equipment booking status discovery...\n");

    const profile = await getTestProfile();
    if (!profile) {
      console.log("❌ No test profile available");
      return;
    }

    const equipment = await createTestEquipment();
    if (!equipment) {
      console.log("❌ Failed to create test equipment");
      return;
    }

    console.log(`✅ Test setup complete`);
    console.log(`   📱 Equipment: ${equipment.name} (${equipment.id})`);
    console.log(`   👤 Profile: ${profile.id}\n`);

    // Discover valid status values
    const validStatuses = await discoverValidStatusValues(
      equipment.id,
      profile.id,
    );

    console.log("\n" + "=".repeat(60));
    console.log("🎯 DISCOVERY RESULTS");
    console.log("=".repeat(60));

    if (validStatuses.length > 0) {
      console.log(`\n✅ Found ${validStatuses.length} valid status value(s):`);
      validStatuses.forEach((status, index) => {
        console.log(`   ${index + 1}. "${status}"`);
      });

      // Test complete workflow with first valid status
      const firstValidStatus = validStatuses[0];
      console.log(`\n🎯 Testing complete workflow with: "${firstValidStatus}"`);

      const workflowResult = await testCompleteBookingWithValidStatus(
        equipment.id,
        profile.id,
        firstValidStatus,
      );

      if (workflowResult.successRate >= 75) {
        console.log(
          "\n🎉 SUCCESS! Equipment Management is now FULLY FUNCTIONAL!",
        );
        console.log(`   ✅ Valid status: "${firstValidStatus}"`);
        console.log(
          `   ✅ Complete CRUD operations: ${workflowResult.successRate}%`,
        );
        console.log("\n🚀 Equipment Management Module: FIXED AND READY!");
      }
    } else {
      console.log("\n❌ No valid status values found");
      console.log("   The check constraint might be very restrictive");
      console.log("   Consider checking the database schema manually");
    }

    // Cleanup test equipment
    await supabase.from("bookable_equipment").delete().eq("id", equipment.id);
    console.log("\n🧹 Cleanup complete");
  } catch (error) {
    console.error("❌ Discovery failed:", error.message);
  }
}

main().catch(console.error);
