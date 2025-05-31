/**
 * Setup Test Accounts for HR Portal
 *
 * This script creates test accounts in Supabase for testing and verification
 * Run this script after setting up your Supabase database
 */

const { createClient } = require("@supabase/supabase-js");

// Supabase configuration
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://tqtwdkobrzzrhrqdxprs.supabase.co";
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94";

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Test accounts to create
const TEST_ACCOUNTS = [
  {
    email: "admin@hrportal.com",
    password: "HRPortal2024!",
    userData: {
      first_name: "System",
      last_name: "Administrator",
      role: "admin",
      department: "IT",
      position: "System Administrator",
      user_type: "admin",
    },
  },
  {
    email: "hr@hrportal.com",
    password: "HRPortal2024!",
    userData: {
      first_name: "HR",
      last_name: "Manager",
      role: "hr",
      department: "Human Resources",
      position: "HR Director",
      user_type: "hr",
    },
  },
  {
    email: "manager@hrportal.com",
    password: "HRPortal2024!",
    userData: {
      first_name: "Department",
      last_name: "Manager",
      role: "manager",
      department: "Engineering",
      position: "Engineering Manager",
      user_type: "manager",
    },
  },
  {
    email: "employee@hrportal.com",
    password: "HRPortal2024!",
    userData: {
      first_name: "John",
      last_name: "Employee",
      role: "employee",
      department: "Engineering",
      position: "Software Developer",
      user_type: "employee",
    },
  },
  {
    email: "recruiter@hrportal.com",
    password: "HRPortal2024!",
    userData: {
      first_name: "Talent",
      last_name: "Recruiter",
      role: "recruiter",
      department: "Human Resources",
      position: "Senior Recruiter",
      user_type: "recruiter",
    },
  },
];

async function createTestAccount(account) {
  console.log(`Creating test account for ${account.email}...`);

  try {
    // Check if user already exists
    const { data: existingUsers, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      console.warn(`⚠️ Could not check existing users: ${listError.message}`);
    } else {
      const existingUser = existingUsers.users.find(
        (user) => user.email === account.email,
      );
      if (existingUser) {
        console.log(`✅ User ${account.email} already exists`);

        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", existingUser.id)
          .single();

        if (existingProfile) {
          console.log(`✅ Profile already exists for ${account.email}`);
          return true;
        } else {
          // Create missing profile
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: existingUser.id,
              first_name: account.userData.first_name,
              last_name: account.userData.last_name,
              email: account.email,
              role: account.userData.role,
              department: account.userData.department,
              position: account.userData.position,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (profileError) {
            console.error(
              `❌ Failed to create profile for ${account.email}:`,
              profileError.message,
            );
            return false;
          }
          console.log(`✅ Profile created for existing user ${account.email}`);
          return true;
        }
      }
    }

    // Create auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: account.userData,
      });

    if (authError) {
      console.error(
        `❌ Failed to create auth user for ${account.email}:`,
        authError.message,
      );
      return false;
    }

    console.log(`✅ Auth user created for ${account.email}`);

    // Wait a moment for triggers to run
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if profile was created by trigger
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (!existingProfile) {
      // Manually create profile if trigger didn't work
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: authData.user.id,
        first_name: account.userData.first_name,
        last_name: account.userData.last_name,
        email: account.email,
        role: account.userData.role,
        department: account.userData.department,
        position: account.userData.position,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error(
          `❌ Failed to create profile for ${account.email}:`,
          profileError.message,
        );
        return false;
      }

      console.log(`✅ Profile created for ${account.email}`);
    } else {
      console.log(`✅ Profile already exists for ${account.email}`);
    }

    // Create employee record if role is employee
    if (account.userData.role === "employee") {
      const { error: employeeError } = await supabase.from("employees").insert({
        profile_id: authData.user.id,
        employee_id: `EMP${Date.now().toString().slice(-6)}`,
        status: "active",
        employment_type: "full-time",
        start_date: new Date().toISOString().split("T")[0],
        department: account.userData.department,
        position: account.userData.position,
      });

      if (employeeError) {
        console.warn(
          `⚠️ Failed to create employee record for ${account.email}:`,
          employeeError.message,
        );
      } else {
        console.log(`✅ Employee record created for ${account.email}`);
      }
    }

    return true;
  } catch (error) {
    console.error(
      `❌ Unexpected error creating account for ${account.email}:`,
      error.message,
    );
    return false;
  }
}

async function setupTestAccounts() {
  console.log("🚀 Setting up test accounts for HR Portal...\n");

  // Verify Supabase connection
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("count")
      .single();
    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      throw error;
    }
    console.log("✅ Supabase connection verified\n");
  } catch (error) {
    console.error("❌ Failed to connect to Supabase:", error.message);
    console.error(
      "Please check your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
    );
    process.exit(1);
  }

  let successCount = 0;
  const totalAccounts = TEST_ACCOUNTS.length;

  for (const account of TEST_ACCOUNTS) {
    const success = await createTestAccount(account);
    if (success) {
      successCount++;
    }
    console.log(""); // Empty line for readability
  }

  console.log(`\n📊 Setup Results:`);
  console.log(
    `✅ Successfully created: ${successCount}/${totalAccounts} accounts`,
  );

  if (successCount === totalAccounts) {
    console.log("\n🎉 All test accounts created successfully!");
    console.log("\n📝 Test Account Credentials:");
    TEST_ACCOUNTS.forEach((account) => {
      console.log(
        `   ${account.userData.role.toUpperCase()}: ${account.email} / ${account.password}`,
      );
    });
    console.log(
      "\n🔗 You can now test the HR Portal at: https://hr-portal-k4ubyr0fh-app-dev-ita.vercel.app",
    );
  } else {
    console.log(
      "\n⚠️ Some accounts failed to create. Please check the errors above.",
    );
  }
}

// Configuration instructions
function showInstructions() {
  console.log("📋 Setup Instructions:");
  console.log("1. Set up your Supabase project");
  console.log("2. Run the database schema (supabase/schema.sql)");
  console.log("3. Set your environment variables:");
  console.log("   - NEXT_PUBLIC_SUPABASE_URL");
  console.log(
    "   - SUPABASE_SERVICE_ROLE_KEY (from Supabase Dashboard > Settings > API)",
  );
  console.log("4. Run this script: node scripts/setup-test-accounts.js");
  console.log("");
}

// Main execution
if (require.main === module) {
  if (!SUPABASE_URL || SUPABASE_URL.includes("YOUR_URL_HERE")) {
    showInstructions();
    console.error("❌ Please set NEXT_PUBLIC_SUPABASE_URL");
    process.exit(1);
  }

  if (
    !SUPABASE_SERVICE_KEY ||
    SUPABASE_SERVICE_KEY.includes("YOUR_SERVICE_ROLE_KEY_HERE")
  ) {
    showInstructions();
    console.error("❌ Please set SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  setupTestAccounts().catch((error) => {
    console.error("❌ Script failed:", error.message);
    process.exit(1);
  });
}

module.exports = {
  setupTestAccounts,
  TEST_ACCOUNTS,
};
