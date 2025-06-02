// Comprehensive HR Portal Module Testing
const { createClient } = require("@supabase/supabase-js");

console.log("🏢 Comprehensive HR Portal Module Testing\n");
console.log("=".repeat(70));

const supabaseUrl = "https://tqtwdkobrzzrhrqdxprs.supabase.co";
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94";

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Get test profiles for different operations
async function getTestProfiles() {
  console.log("👥 Getting test profiles for module testing...");

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, name, role, department")
      .limit(5);

    if (error) {
      console.log("❌ Failed to get profiles:", error.message);
      return [];
    }

    console.log(`✅ Found ${data.length} profiles for testing`);
    return data;
  } catch (err) {
    console.log("❌ Error getting profiles:", err.message);
    return [];
  }
}

// Test Leave Management System
async function testLeaveManagement(profileId) {
  console.log("\n🏖️ Testing Leave Management System...");

  const leaveData = {
    employee_id: profileId,
    leave_type: "vacation",
    start_date: "2024-04-15",
    end_date: "2024-04-19",
    days_requested: 5,
    reason: "Family vacation",
    status: "pending",
    applied_date: new Date().toISOString(),
  };

  let passed = 0;
  const tests = ["CREATE", "READ", "UPDATE", "DELETE"];

  try {
    // CREATE
    const { data: createData, error: createError } = await supabase
      .from("leave_requests")
      .insert([leaveData])
      .select()
      .single();

    if (!createError) {
      console.log("  ✅ CREATE: Success");
      passed++;

      const recordId = createData.id;

      // READ
      const { error: readError } = await supabase
        .from("leave_requests")
        .select("*")
        .eq("id", recordId)
        .single();

      if (!readError) {
        console.log("  ✅ READ: Success");
        passed++;
      } else {
        console.log("  ❌ READ:", readError.message);
      }

      // UPDATE
      const { error: updateError } = await supabase
        .from("leave_requests")
        .update({ status: "approved", reason: leaveData.reason + " - Updated" })
        .eq("id", recordId);

      if (!updateError) {
        console.log("  ✅ UPDATE: Success");
        passed++;
      } else {
        console.log("  ❌ UPDATE:", updateError.message);
      }

      // DELETE
      const { error: deleteError } = await supabase
        .from("leave_requests")
        .delete()
        .eq("id", recordId);

      if (!deleteError) {
        console.log("  ✅ DELETE: Success");
        passed++;
      } else {
        console.log("  ❌ DELETE:", deleteError.message);
      }
    } else {
      console.log("  ❌ CREATE:", createError.message);
    }
  } catch (error) {
    console.log("  ❌ Leave Management test failed:", error.message);
  }

  return { passed, total: tests.length, module: "Leave Management" };
}

// Test Loan Management System
async function testLoanManagement(profileId) {
  console.log("\n💰 Testing Loan Management System...");

  const loanData = {
    employee_id: profileId,
    loan_type: "personal",
    amount_requested: 5000.0,
    purpose: "Home improvement",
    repayment_period: 12,
    monthly_installment: 450.0,
    status: "pending",
    application_date: new Date().toISOString(),
  };

  let passed = 0;
  const tests = ["CREATE", "READ", "UPDATE", "DELETE"];

  try {
    // CREATE
    const { data: createData, error: createError } = await supabase
      .from("loan_applications")
      .insert([loanData])
      .select()
      .single();

    if (!createError) {
      console.log("  ✅ CREATE: Success");
      passed++;

      const recordId = createData.id;

      // READ
      const { error: readError } = await supabase
        .from("loan_applications")
        .select("*")
        .eq("id", recordId)
        .single();

      if (!readError) {
        console.log("  ✅ READ: Success");
        passed++;
      } else {
        console.log("  ❌ READ:", readError.message);
      }

      // UPDATE
      const { error: updateError } = await supabase
        .from("loan_applications")
        .update({ status: "approved", amount_approved: 4500.0 })
        .eq("id", recordId);

      if (!updateError) {
        console.log("  ✅ UPDATE: Success");
        passed++;
      } else {
        console.log("  ❌ UPDATE:", updateError.message);
      }

      // DELETE
      const { error: deleteError } = await supabase
        .from("loan_applications")
        .delete()
        .eq("id", recordId);

      if (!deleteError) {
        console.log("  ✅ DELETE: Success");
        passed++;
      } else {
        console.log("  ❌ DELETE:", deleteError.message);
      }
    } else {
      console.log("  ❌ CREATE:", createError.message);
    }
  } catch (error) {
    console.log("  ❌ Loan Management test failed:", error.message);
  }

  return { passed, total: tests.length, module: "Loan Management" };
}

// Test Payroll System
async function testPayrollSystem(profileId) {
  console.log("\n💵 Testing Payroll System...");

  const payrollData = {
    employee_id: profileId,
    pay_period_start: "2024-04-01",
    pay_period_end: "2024-04-30",
    basic_salary: 5000.0,
    overtime_hours: 8,
    overtime_rate: 25.0,
    allowances: 500.0,
    deductions: 200.0,
    gross_pay: 5800.0,
    net_pay: 5600.0,
    status: "calculated",
  };

  let passed = 0;
  const tests = ["CREATE", "READ", "UPDATE", "DELETE"];

  try {
    // CREATE
    const { data: createData, error: createError } = await supabase
      .from("payroll_records")
      .insert([payrollData])
      .select()
      .single();

    if (!createError) {
      console.log("  ✅ CREATE: Success");
      passed++;

      const recordId = createData.id;

      // READ
      const { error: readError } = await supabase
        .from("payroll_records")
        .select("*")
        .eq("id", recordId)
        .single();

      if (!readError) {
        console.log("  ✅ READ: Success");
        passed++;
      } else {
        console.log("  ❌ READ:", readError.message);
      }

      // UPDATE
      const { error: updateError } = await supabase
        .from("payroll_records")
        .update({ status: "processed", net_pay: 5650.0 })
        .eq("id", recordId);

      if (!updateError) {
        console.log("  ✅ UPDATE: Success");
        passed++;
      } else {
        console.log("  ❌ UPDATE:", updateError.message);
      }

      // DELETE
      const { error: deleteError } = await supabase
        .from("payroll_records")
        .delete()
        .eq("id", recordId);

      if (!deleteError) {
        console.log("  ✅ DELETE: Success");
        passed++;
      } else {
        console.log("  ❌ DELETE:", deleteError.message);
      }
    } else {
      console.log("  ❌ CREATE:", createError.message);
    }
  } catch (error) {
    console.log("  ❌ Payroll System test failed:", error.message);
  }

  return { passed, total: tests.length, module: "Payroll System" };
}

// Test Training & Learning System
async function testTrainingSystem(profileId) {
  console.log("\n📚 Testing Training & Learning System...");

  const courseData = {
    title: "Data Security Training " + Date.now(),
    description: "Comprehensive data security and privacy training",
    instructor: "Security Team",
    duration_hours: 4,
    max_participants: 50,
    start_date: "2024-05-01",
    end_date: "2024-05-01",
    status: "scheduled",
    category: "compliance",
  };

  let passed = 0;
  const tests = ["CREATE", "READ", "UPDATE", "DELETE"];

  try {
    // CREATE Course
    const { data: createData, error: createError } = await supabase
      .from("training_courses")
      .insert([courseData])
      .select()
      .single();

    if (!createError) {
      console.log("  ✅ CREATE: Success");
      passed++;

      const courseId = createData.id;

      // READ
      const { error: readError } = await supabase
        .from("training_courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (!readError) {
        console.log("  ✅ READ: Success");
        passed++;
      } else {
        console.log("  ❌ READ:", readError.message);
      }

      // UPDATE
      const { error: updateError } = await supabase
        .from("training_courses")
        .update({ status: "in_progress", max_participants: 60 })
        .eq("id", courseId);

      if (!updateError) {
        console.log("  ✅ UPDATE: Success");
        passed++;
      } else {
        console.log("  ❌ UPDATE:", updateError.message);
      }

      // Test Enrollment
      const enrollmentData = {
        employee_id: profileId,
        course_id: courseId,
        enrollment_date: new Date().toISOString(),
        status: "enrolled",
      };

      const { error: enrollError } = await supabase
        .from("training_enrollments")
        .insert([enrollmentData]);

      if (!enrollError) {
        console.log("  ✅ ENROLLMENT: Success");
      }

      // DELETE
      const { error: deleteError } = await supabase
        .from("training_courses")
        .delete()
        .eq("id", courseId);

      if (!deleteError) {
        console.log("  ✅ DELETE: Success");
        passed++;
      } else {
        console.log("  ❌ DELETE:", deleteError.message);
      }
    } else {
      console.log("  ❌ CREATE:", createError.message);
    }
  } catch (error) {
    console.log("  ❌ Training System test failed:", error.message);
  }

  return { passed, total: tests.length, module: "Training System" };
}

// Test Safety & Compliance System
async function testSafetySystem(profileId) {
  console.log("\n🛡️ Testing Safety & Compliance System...");

  const incidentData = {
    reporter_id: profileId,
    incident_type: "near_miss",
    location: "Office Floor 2",
    description: "Spilled water near elevator entrance",
    severity: "low",
    date_occurred: new Date().toISOString(),
    status: "reported",
    immediate_action: "Cleaned up and placed warning signs",
  };

  let passed = 0;
  const tests = ["CREATE", "READ", "UPDATE", "DELETE"];

  try {
    // CREATE
    const { data: createData, error: createError } = await supabase
      .from("safety_incidents")
      .insert([incidentData])
      .select()
      .single();

    if (!createError) {
      console.log("  ✅ CREATE: Success");
      passed++;

      const recordId = createData.id;

      // READ
      const { error: readError } = await supabase
        .from("safety_incidents")
        .select("*")
        .eq("id", recordId)
        .single();

      if (!readError) {
        console.log("  ✅ READ: Success");
        passed++;
      } else {
        console.log("  ❌ READ:", readError.message);
      }

      // UPDATE
      const { error: updateError } = await supabase
        .from("safety_incidents")
        .update({ status: "investigated", severity: "low" })
        .eq("id", recordId);

      if (!updateError) {
        console.log("  ✅ UPDATE: Success");
        passed++;
      } else {
        console.log("  ❌ UPDATE:", updateError.message);
      }

      // DELETE
      const { error: deleteError } = await supabase
        .from("safety_incidents")
        .delete()
        .eq("id", recordId);

      if (!deleteError) {
        console.log("  ✅ DELETE: Success");
        passed++;
      } else {
        console.log("  ❌ DELETE:", deleteError.message);
      }
    } else {
      console.log("  ❌ CREATE:", createError.message);
    }
  } catch (error) {
    console.log("  ❌ Safety System test failed:", error.message);
  }

  return { passed, total: tests.length, module: "Safety & Compliance" };
}

// Test Expense Management System
async function testExpenseManagement(profileId) {
  console.log("\n💳 Testing Expense Management System...");

  const expenseData = {
    employee_id: profileId,
    category: "travel",
    amount: 250.0,
    description: "Client meeting taxi fare",
    date_incurred: "2024-04-10",
    receipt_url: null,
    status: "submitted",
    submission_date: new Date().toISOString(),
  };

  let passed = 0;
  const tests = ["CREATE", "READ", "UPDATE", "DELETE"];

  try {
    // CREATE
    const { data: createData, error: createError } = await supabase
      .from("expense_reports")
      .insert([expenseData])
      .select()
      .single();

    if (!createError) {
      console.log("  ✅ CREATE: Success");
      passed++;

      const recordId = createData.id;

      // READ
      const { error: readError } = await supabase
        .from("expense_reports")
        .select("*")
        .eq("id", recordId)
        .single();

      if (!readError) {
        console.log("  ✅ READ: Success");
        passed++;
      } else {
        console.log("  ❌ READ:", readError.message);
      }

      // UPDATE
      const { error: updateError } = await supabase
        .from("expense_reports")
        .update({ status: "approved", amount: 250.0 })
        .eq("id", recordId);

      if (!updateError) {
        console.log("  ✅ UPDATE: Success");
        passed++;
      } else {
        console.log("  ❌ UPDATE:", updateError.message);
      }

      // DELETE
      const { error: deleteError } = await supabase
        .from("expense_reports")
        .delete()
        .eq("id", recordId);

      if (!deleteError) {
        console.log("  ✅ DELETE: Success");
        passed++;
      } else {
        console.log("  ❌ DELETE:", deleteError.message);
      }
    } else {
      console.log("  ❌ CREATE:", createError.message);
    }
  } catch (error) {
    console.log("  ❌ Expense Management test failed:", error.message);
  }

  return { passed, total: tests.length, module: "Expense Management" };
}

// Test Job Applications & Recruitment
async function testRecruitmentSystem() {
  console.log("\n👔 Testing Recruitment & Applications System...");

  const jobData = {
    title: "Senior Software Engineer " + Date.now(),
    description: "Full-stack development position",
    department: "IT",
    location: "Remote",
    employment_type: "full_time",
    salary_min: 80000,
    salary_max: 120000,
    status: "active",
    posted_date: new Date().toISOString(),
    application_deadline: "2024-05-31",
  };

  let passed = 0;
  const tests = ["CREATE", "READ", "UPDATE", "DELETE"];

  try {
    // CREATE Job Posting
    const { data: createData, error: createError } = await supabase
      .from("job_postings")
      .insert([jobData])
      .select()
      .single();

    if (!createError) {
      console.log("  ✅ CREATE: Success");
      passed++;

      const jobId = createData.id;

      // READ
      const { error: readError } = await supabase
        .from("job_postings")
        .select("*")
        .eq("id", jobId)
        .single();

      if (!readError) {
        console.log("  ✅ READ: Success");
        passed++;
      } else {
        console.log("  ❌ READ:", readError.message);
      }

      // UPDATE
      const { error: updateError } = await supabase
        .from("job_postings")
        .update({ status: "closed", salary_max: 125000 })
        .eq("id", jobId);

      if (!updateError) {
        console.log("  ✅ UPDATE: Success");
        passed++;
      } else {
        console.log("  ❌ UPDATE:", updateError.message);
      }

      // DELETE
      const { error: deleteError } = await supabase
        .from("job_postings")
        .delete()
        .eq("id", jobId);

      if (!deleteError) {
        console.log("  ✅ DELETE: Success");
        passed++;
      } else {
        console.log("  ❌ DELETE:", deleteError.message);
      }
    } else {
      console.log("  ❌ CREATE:", createError.message);
    }
  } catch (error) {
    console.log("  ❌ Recruitment System test failed:", error.message);
  }

  return { passed, total: tests.length, module: "Recruitment System" };
}

// Test Performance Management
async function testPerformanceManagement(profileId) {
  console.log("\n📊 Testing Performance Management System...");

  const reviewData = {
    employee_id: profileId,
    reviewer_id: profileId, // Self review for testing
    review_period_start: "2024-01-01",
    review_period_end: "2024-03-31",
    overall_rating: 4.5,
    goals_achievement: 85,
    strengths: "Strong technical skills and collaboration",
    areas_for_improvement: "Time management and project planning",
    status: "draft",
  };

  let passed = 0;
  const tests = ["CREATE", "READ", "UPDATE", "DELETE"];

  try {
    // CREATE
    const { data: createData, error: createError } = await supabase
      .from("performance_reviews")
      .insert([reviewData])
      .select()
      .single();

    if (!createError) {
      console.log("  ✅ CREATE: Success");
      passed++;

      const recordId = createData.id;

      // READ
      const { error: readError } = await supabase
        .from("performance_reviews")
        .select("*")
        .eq("id", recordId)
        .single();

      if (!readError) {
        console.log("  ✅ READ: Success");
        passed++;
      } else {
        console.log("  ❌ READ:", readError.message);
      }

      // UPDATE
      const { error: updateError } = await supabase
        .from("performance_reviews")
        .update({ status: "completed", overall_rating: 4.7 })
        .eq("id", recordId);

      if (!updateError) {
        console.log("  ✅ UPDATE: Success");
        passed++;
      } else {
        console.log("  ❌ UPDATE:", updateError.message);
      }

      // DELETE
      const { error: deleteError } = await supabase
        .from("performance_reviews")
        .delete()
        .eq("id", recordId);

      if (!deleteError) {
        console.log("  ✅ DELETE: Success");
        passed++;
      } else {
        console.log("  ❌ DELETE:", deleteError.message);
      }
    } else {
      console.log("  ❌ CREATE:", createError.message);
    }
  } catch (error) {
    console.log("  ❌ Performance Management test failed:", error.message);
  }

  return { passed, total: tests.length, module: "Performance Management" };
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
      `\n🧪 Running tests with profile: ${testProfile.name} (${testProfile.role})\n`,
    );

    // Run all module tests
    const testResults = [];

    // Test all major HR modules
    testResults.push(await testLeaveManagement(testProfile.id));
    testResults.push(await testLoanManagement(testProfile.id));
    testResults.push(await testPayrollSystem(testProfile.id));
    testResults.push(await testTrainingSystem(testProfile.id));
    testResults.push(await testSafetySystem(testProfile.id));
    testResults.push(await testExpenseManagement(testProfile.id));
    testResults.push(await testRecruitmentSystem());
    testResults.push(await testPerformanceManagement(testProfile.id));

    // Calculate overall results
    const totalTests = testResults.reduce(
      (sum, result) => sum + result.total,
      0,
    );
    const totalPassed = testResults.reduce(
      (sum, result) => sum + result.passed,
      0,
    );
    const overallPassRate = Math.round((totalPassed / totalTests) * 100);

    // Display comprehensive results
    console.log("\n" + "=".repeat(70));
    console.log("🎯 COMPREHENSIVE HR PORTAL MODULE TESTING RESULTS");
    console.log("=".repeat(70));

    console.log(`\n📊 Overall Statistics:`);
    console.log(`   Total Modules Tested: ${testResults.length}`);
    console.log(`   Total CRUD Operations: ${totalTests}`);
    console.log(`   Successful Operations: ${totalPassed}`);
    console.log(`   Overall Pass Rate: ${overallPassRate}%`);

    console.log(`\n📋 Module-by-Module Results:`);
    testResults.forEach((result) => {
      const modulePassRate = Math.round((result.passed / result.total) * 100);
      const status =
        modulePassRate >= 75 ? "✅" : modulePassRate >= 50 ? "⚠️" : "❌";
      console.log(
        `   ${status} ${result.module}: ${result.passed}/${result.total} (${modulePassRate}%)`,
      );
    });

    if (overallPassRate >= 75) {
      console.log(
        "\n🎉 EXCELLENT! Most HR Portal modules are working correctly!",
      );
      console.log("\n✨ Functional HR Modules:");
      testResults.forEach((result) => {
        const passRate = Math.round((result.passed / result.total) * 100);
        if (passRate >= 75) {
          console.log(`   • ${result.module} ✅`);
        }
      });
    } else if (overallPassRate >= 50) {
      console.log("\n⚠️ PARTIAL SUCCESS - Some modules need attention");
      console.log("\n📝 Modules needing review:");
      testResults.forEach((result) => {
        const passRate = Math.round((result.passed / result.total) * 100);
        if (passRate < 75) {
          console.log(`   • ${result.module} (${passRate}%)`);
        }
      });
    } else {
      console.log("\n❌ Multiple modules need database schema updates");
      console.log("   Consider reviewing table structures and relationships");
    }

    console.log("\n🚀 Next Steps:");
    console.log("   1. Review any failed modules above");
    console.log("   2. Check database schema for missing tables");
    console.log("   3. Start the development server: npm run dev");
    console.log("   4. Test the working modules in the UI");
  } catch (error) {
    console.error("❌ Comprehensive testing failed:", error.message);
  }
}

main().catch(console.error);
