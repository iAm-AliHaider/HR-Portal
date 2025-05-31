/**
 * Fix Profile Linking for Test Accounts
 *
 * This script fixes the mismatch between auth user IDs and profile IDs
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

const TEST_ACCOUNTS = [
  { email: "admin@hrportal.com", role: "admin" },
  { email: "hr@hrportal.com", role: "hr" },
  { email: "manager@hrportal.com", role: "manager" },
  { email: "employee@hrportal.com", role: "employee" },
  { email: "recruiter@hrportal.com", role: "recruiter" },
];

async function fixProfileLinking() {
  console.log("🔧 Fixing profile linking for test accounts...\n");

  try {
    // Get all auth users
    const { data: allUsers, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      console.error("❌ Failed to list users:", listError.message);
      return;
    }

    let fixedCount = 0;

    for (const account of TEST_ACCOUNTS) {
      console.log(`\n🔧 Processing ${account.email}:`);

      // Find auth user
      const authUser = allUsers.users.find(
        (user) => user.email === account.email,
      );

      if (!authUser) {
        console.log(`❌ Auth user not found for ${account.email}`);
        continue;
      }

      console.log(`✅ Found auth user: ${authUser.id}`);

      // Find existing profile by email
      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", account.email)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.log(`❌ Error finding profile: ${profileError.message}`);
        continue;
      }

      if (existingProfile && existingProfile.id === authUser.id) {
        console.log(`✅ Profile already correctly linked`);
        continue;
      }

      if (existingProfile) {
        console.log(`🔄 Found existing profile with ID: ${existingProfile.id}`);
        console.log(`   Need to update to match auth ID: ${authUser.id}`);

        // Delete old profile
        const { error: deleteError } = await supabase
          .from("profiles")
          .delete()
          .eq("id", existingProfile.id);

        if (deleteError) {
          console.log(
            `❌ Failed to delete old profile: ${deleteError.message}`,
          );
          continue;
        }

        console.log(`✅ Deleted old profile`);

        // Create new profile with correct ID
        const { error: createError } = await supabase.from("profiles").insert({
          id: authUser.id,
          first_name: existingProfile.first_name,
          last_name: existingProfile.last_name,
          email: existingProfile.email,
          role: existingProfile.role,
          department: existingProfile.department,
          position: existingProfile.position,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (createError) {
          console.log(
            `❌ Failed to create new profile: ${createError.message}`,
          );
          continue;
        }

        console.log(`✅ Created new profile with correct ID`);
        fixedCount++;
      } else {
        // Create new profile
        console.log(`📝 Creating new profile for ${account.email}`);

        const { error: createError } = await supabase.from("profiles").insert({
          id: authUser.id,
          first_name:
            account.role === "admin"
              ? "System"
              : account.role === "hr"
                ? "HR"
                : account.role === "manager"
                  ? "Department"
                  : account.role === "employee"
                    ? "John"
                    : "Talent",
          last_name:
            account.role === "admin"
              ? "Administrator"
              : account.role === "hr"
                ? "Manager"
                : account.role === "manager"
                  ? "Manager"
                  : account.role === "employee"
                    ? "Employee"
                    : "Recruiter",
          email: account.email,
          role: account.role,
          department:
            account.role === "admin"
              ? "IT"
              : account.role === "hr"
                ? "Human Resources"
                : account.role === "manager"
                  ? "Engineering"
                  : account.role === "employee"
                    ? "Engineering"
                    : "Human Resources",
          position:
            account.role === "admin"
              ? "System Administrator"
              : account.role === "hr"
                ? "HR Director"
                : account.role === "manager"
                  ? "Engineering Manager"
                  : account.role === "employee"
                    ? "Software Developer"
                    : "Senior Recruiter",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (createError) {
          console.log(`❌ Failed to create profile: ${createError.message}`);
          continue;
        }

        console.log(`✅ Created new profile`);
        fixedCount++;
      }

      // Create employee record if needed
      if (account.role === "employee") {
        const { data: existingEmployee } = await supabase
          .from("employees")
          .select("*")
          .eq("profile_id", authUser.id)
          .single();

        if (!existingEmployee) {
          const { error: employeeError } = await supabase
            .from("employees")
            .insert({
              profile_id: authUser.id,
              employee_id: `EMP${Date.now().toString().slice(-6)}`,
              status: "active",
              employment_type: "full-time",
              start_date: new Date().toISOString().split("T")[0],
              department: "Engineering",
              position: "Software Developer",
            });

          if (employeeError) {
            console.log(
              `⚠️ Failed to create employee record: ${employeeError.message}`,
            );
          } else {
            console.log(`✅ Created employee record`);
          }
        }
      }
    }

    console.log(`\n📊 Fix Results:`);
    console.log(
      `✅ Successfully fixed: ${fixedCount}/${TEST_ACCOUNTS.length} accounts`,
    );

    if (fixedCount === TEST_ACCOUNTS.length) {
      console.log("\n🎉 All test accounts are now properly linked!");
      console.log("\n📝 Test Account Credentials:");
      TEST_ACCOUNTS.forEach((account) => {
        console.log(
          `   ${account.role.toUpperCase()}: ${account.email} / HRPortal2024!`,
        );
      });
      console.log(
        "\n🔗 You can now test the HR Portal at: https://hr-portal-k4ubyr0fh-app-dev-ita.vercel.app",
      );
    } else {
      console.log(
        "\n⚠️ Some accounts still need attention. Please check the errors above.",
      );
    }
  } catch (error) {
    console.error("❌ Fix failed:", error.message);
  }
}

// Main execution
if (require.main === module) {
  fixProfileLinking().catch((error) => {
    console.error("❌ Script failed:", error.message);
    process.exit(1);
  });
}

module.exports = {
  fixProfileLinking,
};
