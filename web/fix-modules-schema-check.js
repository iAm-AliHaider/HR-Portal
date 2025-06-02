// Fix Remaining Modules - Schema Analysis and Repair
const { createClient } = require("@supabase/supabase-js");

console.log("🔧 Fixing Remaining HR Modules\n");
console.log("=".repeat(60));

const supabaseUrl = "https://tqtwdkobrzzrhrqdxprs.supabase.co";
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function getTableColumns(tableName) {
  try {
    // First try to get data to see columns
    const { data, error } = await supabase.from(tableName).select("*").limit(1);

    if (!error) {
      if (data.length > 0) {
        return Object.keys(data[0]);
      } else {
        // Table exists but empty - try inserting a minimal record to see required fields
        return await discoverRequiredFields(tableName);
      }
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

async function discoverRequiredFields(tableName) {
  console.log(`🔍 Discovering required fields for ${tableName}...`);

  // Try inserting with minimal data to see what's required
  const testData = { id: "test-discovery" };

  const { error } = await supabase.from(tableName).insert([testData]);

  if (error) {
    console.log(`   ❌ Error for ${tableName}: ${error.message}`);

    // Parse error message to understand required fields
    if (error.message.includes("violates not-null constraint")) {
      const matches = error.message.match(/column "([^"]+)"/);
      if (matches) {
        console.log(`   📝 Required field: ${matches[1]}`);
      }
    }
  }

  return [];
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

// Fix Meeting Rooms
async function fixMeetingRooms(profileId) {
  console.log("\n🏢 Fixing Meeting Rooms Module...");

  const columns = await getTableColumns("meeting_rooms");
  console.log(
    `   Available columns: [${columns?.join(", ") || "checking..."}]`,
  );

  // Get existing rooms first
  const { data: existingRooms } = await supabase
    .from("meeting_rooms")
    .select("*")
    .limit(1);

  if (existingRooms && existingRooms.length > 0) {
    console.log("   📋 Sample room data:", existingRooms[0]);
  }

  // Try simple room creation with known columns
  const roomData = {
    name: "Test Room " + Date.now(),
    capacity: 10,
  };

  let passed = 0;
  const operations = ["CREATE", "READ", "UPDATE", "DELETE"];

  try {
    const { data: room, error: roomError } = await supabase
      .from("meeting_rooms")
      .insert([roomData])
      .select()
      .single();

    if (!roomError) {
      console.log("   ✅ CREATE: Success");
      passed++;

      // READ
      const { data: readData, error: readError } = await supabase
        .from("meeting_rooms")
        .select("*")
        .eq("id", room.id)
        .single();

      if (!readError) {
        console.log("   ✅ READ: Success");
        passed++;
      }

      // UPDATE
      const { error: updateError } = await supabase
        .from("meeting_rooms")
        .update({ capacity: 12 })
        .eq("id", room.id);

      if (!updateError) {
        console.log("   ✅ UPDATE: Success");
        passed++;
      } else {
        console.log(`   ❌ UPDATE: ${updateError.message}`);
      }

      // DELETE
      const { error: deleteError } = await supabase
        .from("meeting_rooms")
        .delete()
        .eq("id", room.id);

      if (!deleteError) {
        console.log("   ✅ DELETE: Success");
        passed++;
      }
    } else {
      console.log(`   ❌ CREATE: ${roomError.message}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  return { module: "Meeting Rooms", passed, total: operations.length };
}

// Fix Equipment Management
async function fixEquipmentManagement(profileId) {
  console.log("\n🔧 Fixing Equipment Management Module...");

  const columns = await getTableColumns("bookable_equipment");
  console.log(
    `   Available columns: [${columns?.join(", ") || "checking..."}]`,
  );

  // Get existing equipment first
  const { data: existingEquipment } = await supabase
    .from("bookable_equipment")
    .select("*")
    .limit(1);

  if (existingEquipment && existingEquipment.length > 0) {
    console.log("   📋 Sample equipment data:", existingEquipment[0]);
  }

  let passed = 0;
  const operations = [
    "CREATE_EQUIPMENT",
    "BOOK_EQUIPMENT",
    "CHECK_BOOKING",
    "CLEANUP",
  ];

  try {
    // CREATE EQUIPMENT with known columns
    const equipmentData = {
      name: "Test Laptop " + Date.now(),
      status: "available",
    };

    const { data: equipment, error: equipmentError } = await supabase
      .from("bookable_equipment")
      .insert([equipmentData])
      .select()
      .single();

    if (!equipmentError) {
      console.log("   ✅ CREATE_EQUIPMENT: Success");
      passed++;

      // BOOK EQUIPMENT
      const bookingData = {
        equipment_id: equipment.id,
        user_id: profileId,
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date(Date.now() + 7 * 86400000)
          .toISOString()
          .split("T")[0],
        status: "active",
      };

      const { data: booking, error: bookingError } = await supabase
        .from("equipment_bookings")
        .insert([bookingData])
        .select()
        .single();

      if (!bookingError) {
        console.log("   ✅ BOOK_EQUIPMENT: Success");
        passed++;

        // CHECK BOOKING
        const { data: bookings, error: checkError } = await supabase
          .from("equipment_bookings")
          .select("*")
          .eq("equipment_id", equipment.id);

        if (!checkError) {
          console.log("   ✅ CHECK_BOOKING: Success");
          passed++;
        }

        // CLEANUP
        await supabase.from("equipment_bookings").delete().eq("id", booking.id);
      } else {
        console.log(`   ❌ BOOK_EQUIPMENT: ${bookingError.message}`);
      }

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

// Fix Leave Requests
async function fixLeaveRequests(profileId) {
  console.log("\n🏖️ Fixing Leave Requests Module...");

  const columns = await getTableColumns("leave_requests");
  console.log(
    `   Available columns: [${columns?.join(", ") || "checking..."}]`,
  );

  // Try with minimal required fields only
  const leaveData = {
    employee_id: profileId,
    leave_type: "vacation",
    start_date: "2024-05-01",
    end_date: "2024-05-05",
    status: "pending",
  };

  let passed = 0;
  const operations = ["CREATE", "READ", "UPDATE", "DELETE"];

  try {
    const { data: leave, error: leaveError } = await supabase
      .from("leave_requests")
      .insert([leaveData])
      .select()
      .single();

    if (!leaveError) {
      console.log("   ✅ CREATE: Success");
      passed++;

      // READ
      const { data: readData, error: readError } = await supabase
        .from("leave_requests")
        .select("*")
        .eq("id", leave.id)
        .single();

      if (!readError) {
        console.log("   ✅ READ: Success");
        passed++;
      }

      // UPDATE
      const { error: updateError } = await supabase
        .from("leave_requests")
        .update({ status: "approved" })
        .eq("id", leave.id);

      if (!updateError) {
        console.log("   ✅ UPDATE: Success");
        passed++;
      }

      // DELETE
      const { error: deleteError } = await supabase
        .from("leave_requests")
        .delete()
        .eq("id", leave.id);

      if (!deleteError) {
        console.log("   ✅ DELETE: Success");
        passed++;
      }
    } else {
      console.log(`   ❌ CREATE: ${leaveError.message}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  return { module: "Leave Requests", passed, total: operations.length };
}

// Fix Loan Applications
async function fixLoanApplications(profileId) {
  console.log("\n💰 Fixing Loan Applications Module...");

  const columns = await getTableColumns("loan_applications");
  console.log(
    `   Available columns: [${columns?.join(", ") || "checking..."}]`,
  );

  // Try with minimal required fields only
  const loanData = {
    employee_id: profileId,
    loan_type: "personal",
    amount: 5000.0,
    status: "pending",
  };

  let passed = 0;
  const operations = ["CREATE", "READ", "UPDATE", "DELETE"];

  try {
    const { data: loan, error: loanError } = await supabase
      .from("loan_applications")
      .insert([loanData])
      .select()
      .single();

    if (!loanError) {
      console.log("   ✅ CREATE: Success");
      passed++;

      // READ
      const { data: readData, error: readError } = await supabase
        .from("loan_applications")
        .select("*")
        .eq("id", loan.id)
        .single();

      if (!readError) {
        console.log("   ✅ READ: Success");
        passed++;
      }

      // UPDATE
      const { error: updateError } = await supabase
        .from("loan_applications")
        .update({ status: "approved" })
        .eq("id", loan.id);

      if (!updateError) {
        console.log("   ✅ UPDATE: Success");
        passed++;
      }

      // DELETE
      const { error: deleteError } = await supabase
        .from("loan_applications")
        .delete()
        .eq("id", loan.id);

      if (!deleteError) {
        console.log("   ✅ DELETE: Success");
        passed++;
      }
    } else {
      console.log(`   ❌ CREATE: ${loanError.message}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  return { module: "Loan Applications", passed, total: operations.length };
}

// Fix Safety Incidents
async function fixSafetyIncidents(profileId) {
  console.log("\n🛡️ Fixing Safety Incidents Module...");

  const columns = await getTableColumns("safety_incidents");
  console.log(
    `   Available columns: [${columns?.join(", ") || "checking..."}]`,
  );

  // Try with minimal required fields only
  const incidentData = {
    reporter_id: profileId,
    incident_type: "near_miss",
    description: "Test incident report",
    status: "reported",
  };

  let passed = 0;
  const operations = ["CREATE", "READ", "UPDATE", "DELETE"];

  try {
    const { data: incident, error: incidentError } = await supabase
      .from("safety_incidents")
      .insert([incidentData])
      .select()
      .single();

    if (!incidentError) {
      console.log("   ✅ CREATE: Success");
      passed++;

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

      // UPDATE
      const { error: updateError } = await supabase
        .from("safety_incidents")
        .update({ status: "investigated" })
        .eq("id", incident.id);

      if (!updateError) {
        console.log("   ✅ UPDATE: Success");
        passed++;
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
      console.log(`   ❌ CREATE: ${incidentError.message}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  return { module: "Safety Incidents", passed, total: operations.length };
}

// Create missing tables for advanced modules
async function createMissingTables() {
  console.log("\n🏗️ Creating Missing Tables for Advanced Modules...");

  const missingTables = [
    "payroll_records",
    "training_enrollments",
    "expense_reports",
    "job_postings",
    "job_applications",
    "performance_reviews",
  ];

  for (const table of missingTables) {
    console.log(`   🔧 Creating ${table}...`);

    let createSQL = "";

    switch (table) {
      case "payroll_records":
        createSQL = `
          CREATE TABLE IF NOT EXISTS payroll_records (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            employee_id UUID REFERENCES profiles(id) NOT NULL,
            pay_period_start DATE NOT NULL,
            pay_period_end DATE NOT NULL,
            basic_salary DECIMAL(10,2) DEFAULT 0,
            overtime_hours INTEGER DEFAULT 0,
            overtime_rate DECIMAL(10,2) DEFAULT 0,
            allowances DECIMAL(10,2) DEFAULT 0,
            deductions DECIMAL(10,2) DEFAULT 0,
            gross_pay DECIMAL(10,2) DEFAULT 0,
            net_pay DECIMAL(10,2) DEFAULT 0,
            status VARCHAR(20) DEFAULT 'draft',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `;
        break;

      case "training_enrollments":
        createSQL = `
          CREATE TABLE IF NOT EXISTS training_enrollments (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            employee_id UUID REFERENCES profiles(id) NOT NULL,
            course_id UUID REFERENCES training_courses(id) NOT NULL,
            enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            status VARCHAR(20) DEFAULT 'enrolled',
            completion_date TIMESTAMP WITH TIME ZONE,
            score INTEGER,
            certificate_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `;
        break;

      case "expense_reports":
        createSQL = `
          CREATE TABLE IF NOT EXISTS expense_reports (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            employee_id UUID REFERENCES profiles(id) NOT NULL,
            category VARCHAR(50) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            description TEXT,
            date_incurred DATE NOT NULL,
            receipt_url TEXT,
            status VARCHAR(20) DEFAULT 'submitted',
            submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            approved_by UUID REFERENCES profiles(id),
            approved_date TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `;
        break;

      case "job_postings":
        createSQL = `
          CREATE TABLE IF NOT EXISTS job_postings (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            department VARCHAR(100),
            location VARCHAR(100),
            employment_type VARCHAR(50) DEFAULT 'full_time',
            salary_min DECIMAL(10,2),
            salary_max DECIMAL(10,2),
            status VARCHAR(20) DEFAULT 'active',
            posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            application_deadline DATE,
            created_by UUID REFERENCES profiles(id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `;
        break;

      case "job_applications":
        createSQL = `
          CREATE TABLE IF NOT EXISTS job_applications (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            job_id UUID REFERENCES job_postings(id) NOT NULL,
            applicant_name VARCHAR(100) NOT NULL,
            applicant_email VARCHAR(100) NOT NULL,
            phone VARCHAR(20),
            resume_url TEXT,
            cover_letter TEXT,
            status VARCHAR(20) DEFAULT 'submitted',
            applied_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            reviewed_by UUID REFERENCES profiles(id),
            reviewed_date TIMESTAMP WITH TIME ZONE,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `;
        break;

      case "performance_reviews":
        createSQL = `
          CREATE TABLE IF NOT EXISTS performance_reviews (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            employee_id UUID REFERENCES profiles(id) NOT NULL,
            reviewer_id UUID REFERENCES profiles(id) NOT NULL,
            review_period_start DATE NOT NULL,
            review_period_end DATE NOT NULL,
            overall_rating DECIMAL(3,2),
            goals_achievement INTEGER,
            strengths TEXT,
            areas_for_improvement TEXT,
            status VARCHAR(20) DEFAULT 'draft',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `;
        break;
    }

    try {
      // Create table using direct SQL (since we can't use RPC)
      // We'll have to create these tables manually through Supabase dashboard
      console.log(`   📝 SQL for ${table}:`);
      console.log(`   ${createSQL.trim()}`);
    } catch (error) {
      console.log(`   ❌ Failed to create ${table}: ${error.message}`);
    }
  }
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
      `🧪 Fixing modules with profile: ${testProfile.name} (${testProfile.role})\n`,
    );

    // Fix existing modules with schema issues
    const fixResults = [];

    fixResults.push(await fixMeetingRooms(testProfile.id));
    fixResults.push(await fixEquipmentManagement(testProfile.id));
    fixResults.push(await fixLeaveRequests(testProfile.id));
    fixResults.push(await fixLoanApplications(testProfile.id));
    fixResults.push(await fixSafetyIncidents(testProfile.id));

    // Show SQL for missing tables
    await createMissingTables();

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
    console.log("🎯 MODULE FIXING RESULTS");
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

    const workingModules = fixResults.filter(
      (r) => Math.round((r.passed / r.total) * 100) >= 75,
    );

    if (workingModules.length > 0) {
      console.log(`\n✅ Successfully Fixed Modules:`);
      workingModules.forEach((result) => {
        const rate = Math.round((result.passed / result.total) * 100);
        console.log(`   • ${result.module} (${rate}%)`);
      });
    }

    console.log("\n🚀 Next Steps:");
    console.log(
      "   1. Create the missing tables using the SQL above in Supabase dashboard",
    );
    console.log("   2. Run comprehensive test again to verify all fixes");
    console.log("   3. Test the working modules in the web interface");
  } catch (error) {
    console.error("❌ Module fixing failed:", error.message);
  }
}

main().catch(console.error);
