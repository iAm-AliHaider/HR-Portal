// Discover Actual Table Schemas for Problematic Modules
const { createClient } = require("@supabase/supabase-js");

console.log("🔍 Discovering Actual Table Schemas\n");
console.log("=".repeat(60));

const supabaseUrl = "https://tqtwdkobrzzrhrqdxprs.supabase.co";
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function discoverTableStructure(tableName) {
  console.log(`\n🔍 Discovering structure of ${tableName}...`);

  try {
    // First, try to get any existing data
    const { data, error } = await supabase.from(tableName).select("*").limit(1);

    if (!error) {
      if (data && data.length > 0) {
        console.log(`   ✅ Table exists with data`);
        console.log(`   📋 Columns: [${Object.keys(data[0]).join(", ")}]`);
        console.log(`   📝 Sample data:`, data[0]);
        return { exists: true, columns: Object.keys(data[0]), sample: data[0] };
      } else {
        console.log(`   ✅ Table exists but is empty`);
        // Try to get columns by inserting minimal data
        return await discoverEmptyTableStructure(tableName);
      }
    } else {
      console.log(`   ❌ Table access error: ${error.message}`);
      return { exists: false, error: error.message };
    }
  } catch (err) {
    console.log(`   ❌ Discovery error: ${err.message}`);
    return { exists: false, error: err.message };
  }
}

async function discoverEmptyTableStructure(tableName) {
  console.log(`   🔄 Attempting to discover empty table structure...`);

  // Try inserting minimal records to understand required fields
  const testInserts = [
    { id: "test" },
    { name: "test" },
    { title: "test" },
    { description: "test" },
  ];

  for (const testData of testInserts) {
    const { error } = await supabase.from(tableName).insert([testData]);

    if (error) {
      console.log(`   📝 Insert attempt error: ${error.message}`);

      // Parse for required columns
      if (error.message.includes("null value in column")) {
        const match = error.message.match(/null value in column "([^"]+)"/);
        if (match) {
          console.log(`   🔑 Required column: ${match[1]}`);
        }
      }

      if (error.message.includes("violates not-null constraint")) {
        const match = error.message.match(/column "([^"]+)"/);
        if (match) {
          console.log(`   🔑 Required column: ${match[1]}`);
        }
      }

      if (error.message.includes("does not exist")) {
        const match = error.message.match(/column "([^"]+)"/);
        if (match) {
          console.log(`   ❌ Invalid column: ${match[1]}`);
        }
      }
    } else {
      console.log(`   ✅ Successful insert with: ${JSON.stringify(testData)}`);
      // Cleanup
      await supabase.from(tableName).delete().match(testData);
      return {
        exists: true,
        columns: Object.keys(testData),
        workingSchema: testData,
      };
    }
  }

  return { exists: true, columns: [], workingSchema: null };
}

async function getTestProfile() {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, name, role")
      .limit(1)
      .single();

    return error ? null : data;
  } catch (err) {
    return null;
  }
}

async function testWithActualSchema(tableName, testProfile) {
  console.log(`\n🧪 Testing ${tableName} with discovered schema...`);

  if (tableName === "equipment_bookings") {
    // Test equipment bookings with known working patterns
    const schemas = [
      {
        equipment_id: "test-equipment-id",
        user_id: testProfile.id,
        start_date: "2024-01-01",
        end_date: "2024-01-07",
        status: "active",
      },
      {
        equipment_id: "test-equipment-id",
        employee_id: testProfile.id,
        booked_at: new Date().toISOString(),
        status: "reserved",
      },
      {
        item_id: "test-equipment-id",
        booked_by: testProfile.id,
        booking_date: "2024-01-01",
        status: "booked",
      },
    ];

    for (const [index, schema] of schemas.entries()) {
      const { error } = await supabase.from(tableName).insert([schema]);

      console.log(
        `   Schema ${index + 1}: ${error ? `❌ ${error.message}` : "✅ Success"}`,
      );
      if (!error) {
        console.log(
          `   🎯 Working schema: ${JSON.stringify(Object.keys(schema))}`,
        );
        // Cleanup
        await supabase.from(tableName).delete().match(schema);
        return schema;
      }
    }
  }

  if (tableName === "safety_incidents") {
    // Test safety incidents with known working patterns
    const schemas = [
      {
        reporter_id: testProfile.id,
        description: "Test incident",
        status: "reported",
        incident_date: "2024-01-01",
      },
      {
        user_id: testProfile.id,
        title: "Safety Incident",
        description: "Test incident",
        status: "open",
      },
      {
        reported_by: testProfile.id,
        summary: "Incident summary",
        status: "new",
        created_at: new Date().toISOString(),
      },
    ];

    for (const [index, schema] of schemas.entries()) {
      const { error } = await supabase.from(tableName).insert([schema]);

      console.log(
        `   Schema ${index + 1}: ${error ? `❌ ${error.message}` : "✅ Success"}`,
      );
      if (!error) {
        console.log(
          `   🎯 Working schema: ${JSON.stringify(Object.keys(schema))}`,
        );
        // Cleanup
        await supabase.from(tableName).delete().match(schema);
        return schema;
      }
    }
  }

  return null;
}

async function main() {
  try {
    const testProfile = await getTestProfile();
    if (!testProfile) {
      console.log("❌ No test profile available");
      return;
    }

    console.log(
      `🧪 Using test profile: ${testProfile.name} (${testProfile.role})\n`,
    );

    // Discover all tables we're interested in
    const tables = [
      "equipment_bookings",
      "safety_incidents",
      "bookable_equipment",
      "meeting_rooms",
    ];

    const discoveries = {};

    for (const table of tables) {
      discoveries[table] = await discoverTableStructure(table);
    }

    // Test with actual schemas
    console.log("\n" + "=".repeat(60));
    console.log("🎯 TESTING WITH DISCOVERED SCHEMAS");
    console.log("=".repeat(60));

    for (const table of ["equipment_bookings", "safety_incidents"]) {
      if (discoveries[table].exists) {
        const workingSchema = await testWithActualSchema(table, testProfile);
        if (workingSchema) {
          console.log(`   ✅ Found working schema for ${table}`);
        } else {
          console.log(`   ❌ No working schema found for ${table}`);
        }
      }
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 DISCOVERY SUMMARY");
    console.log("=".repeat(60));

    for (const [table, discovery] of Object.entries(discoveries)) {
      if (discovery.exists) {
        console.log(`✅ ${table}: EXISTS`);
        if (discovery.columns && discovery.columns.length > 0) {
          console.log(`   Columns: [${discovery.columns.join(", ")}]`);
        }
      } else {
        console.log(`❌ ${table}: NOT ACCESSIBLE`);
        console.log(`   Error: ${discovery.error}`);
      }
    }

    console.log("\n🎯 Next Steps:");
    console.log("   1. Use discovered schemas to create working test scripts");
    console.log("   2. Focus on tables that exist and are accessible");
    console.log("   3. Create missing tables if needed for full functionality");
  } catch (error) {
    console.error("❌ Discovery failed:", error.message);
  }
}

main().catch(console.error);
