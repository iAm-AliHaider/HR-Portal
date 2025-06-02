// Inspect Actual Equipment Table Schema
const { createClient } = require("@supabase/supabase-js");

console.log("🔍 Inspecting Actual Equipment Table Schema\n");
console.log("=".repeat(60));

const supabaseUrl = "https://tqtwdkobrzzrhrqdxprs.supabase.co";
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function inspectTableColumns(tableName) {
  console.log(`🔍 Inspecting columns for table: ${tableName}`);

  try {
    const { data, error } = await supabase.rpc("sql", {
      query: `
        SELECT
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns
        WHERE table_name = '${tableName}'
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `,
    });

    if (!error && data) {
      console.log(`   📋 Found ${data.length} columns:`);
      data.forEach((col, index) => {
        console.log(
          `   ${index + 1}. ${col.column_name} (${col.data_type}) ${col.is_nullable === "NO" ? "🔒 NOT NULL" : "✅ NULLABLE"}`,
        );
        if (col.column_default) {
          console.log(`      Default: ${col.column_default}`);
        }
      });
      return data;
    } else {
      console.log(`   ❌ Error: ${error?.message || "Unknown error"}`);
      return null;
    }
  } catch (err) {
    console.log(`   ❌ Exception: ${err.message}`);
    return null;
  }
}

async function inspectTableConstraints(tableName) {
  console.log(`\n🔒 Inspecting constraints for table: ${tableName}`);

  try {
    const { data, error } = await supabase.rpc("sql", {
      query: `
        SELECT
          constraint_name,
          constraint_type,
          check_clause
        FROM information_schema.table_constraints tc
        LEFT JOIN information_schema.check_constraints cc
          ON tc.constraint_name = cc.constraint_name
        WHERE tc.table_name = '${tableName}'
        AND tc.table_schema = 'public';
      `,
    });

    if (!error && data) {
      console.log(`   🔒 Found ${data.length} constraints:`);
      data.forEach((constraint, index) => {
        console.log(
          `   ${index + 1}. ${constraint.constraint_name} (${constraint.constraint_type})`,
        );
        if (constraint.check_clause) {
          console.log(`      Check: ${constraint.check_clause}`);
        }
      });
      return data;
    } else {
      console.log(`   ❌ Error: ${error?.message || "Unknown error"}`);
      return null;
    }
  } catch (err) {
    console.log(`   ❌ Exception: ${err.message}`);
    return null;
  }
}

async function inspectForeignKeys(tableName) {
  console.log(`\n🔗 Inspecting foreign keys for table: ${tableName}`);

  try {
    const { data, error } = await supabase.rpc("sql", {
      query: `
        SELECT
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE constraint_type = 'FOREIGN KEY'
        AND tc.table_name = '${tableName}'
        AND tc.table_schema = 'public';
      `,
    });

    if (!error && data) {
      console.log(`   🔗 Found ${data.length} foreign keys:`);
      data.forEach((fk, index) => {
        console.log(
          `   ${index + 1}. ${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`,
        );
      });
      return data;
    } else {
      console.log(`   ❌ Error: ${error?.message || "Unknown error"}`);
      return null;
    }
  } catch (err) {
    console.log(`   ❌ Exception: ${err.message}`);
    return null;
  }
}

async function testSimpleInsert(tableName) {
  console.log(`\n🧪 Testing minimal insert into: ${tableName}`);

  // Try to get a valid UUID from profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id")
    .limit(1);
  const testProfileId = profiles?.[0]?.id;

  // Try to get a valid UUID from bookable_equipment
  const { data: equipment } = await supabase
    .from("bookable_equipment")
    .select("id")
    .limit(1);
  const testEquipmentId = equipment?.[0]?.id;

  if (!testProfileId || !testEquipmentId) {
    console.log("   ⚠️ Cannot test - missing profile or equipment IDs");
    return;
  }

  // Try minimal insert with discovered required fields
  const minimalData = {
    equipment_id: testEquipmentId,
    employee_id: testProfileId,
    checkout_time: new Date().toISOString(),
    expected_return_time: new Date(Date.now() + 86400000).toISOString(),
    // Deliberately omitting status to see what happens
  };

  console.log("   🔄 Testing minimal insert without status...");
  const { data, error } = await supabase
    .from(tableName)
    .insert([minimalData])
    .select()
    .single();

  if (!error) {
    console.log("   ✅ SUCCESS! Minimal insert worked");
    console.log("   📋 Inserted data:", data);

    // Cleanup
    await supabase.from(tableName).delete().eq("id", data.id);
    return data;
  } else {
    console.log(`   ❌ Failed: ${error.message}`);
    return null;
  }
}

async function main() {
  try {
    console.log("🔍 Starting comprehensive table schema inspection...\n");

    const tableName = "equipment_bookings";

    // 1. Inspect columns
    const columns = await inspectTableColumns(tableName);

    // 2. Inspect constraints
    const constraints = await inspectTableConstraints(tableName);

    // 3. Inspect foreign keys
    const foreignKeys = await inspectForeignKeys(tableName);

    // 4. Test simple insert
    await testSimpleInsert(tableName);

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 SCHEMA INSPECTION SUMMARY");
    console.log("=".repeat(60));

    if (columns) {
      console.log(`\n📋 Table Structure:`);
      console.log(`   Table: ${tableName}`);
      console.log(`   Columns: ${columns.length}`);

      const requiredColumns = columns.filter((col) => col.is_nullable === "NO");
      console.log(`   Required fields: ${requiredColumns.length}`);
      requiredColumns.forEach((col) => {
        console.log(`   • ${col.column_name} (${col.data_type})`);
      });
    }

    if (constraints) {
      console.log(`\n🔒 Constraints:`);
      constraints.forEach((constraint) => {
        if (constraint.constraint_type === "CHECK") {
          console.log(
            `   • ${constraint.constraint_name}: ${constraint.check_clause}`,
          );
        }
      });
    }

    if (foreignKeys) {
      console.log(`\n🔗 Foreign Key Dependencies:`);
      foreignKeys.forEach((fk) => {
        console.log(
          `   • ${fk.column_name} must reference ${fk.foreign_table_name}.${fk.foreign_column_name}`,
        );
      });
    }

    console.log("\n🎯 Next Steps:");
    console.log("   1. Use the exact column names shown above");
    console.log("   2. Ensure all required fields are provided");
    console.log("   3. Check foreign key references are valid");
    console.log("   4. Follow any check constraints exactly");
  } catch (error) {
    console.error("❌ Schema inspection failed:", error.message);
  }
}

main().catch(console.error);
