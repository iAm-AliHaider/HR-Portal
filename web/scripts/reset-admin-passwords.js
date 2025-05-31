/**
 * Reset Admin Passwords
 *
 * This script resets passwords for existing admin accounts to ensure they work
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

async function resetAdminPasswords() {
  console.log("🔑 Resetting admin passwords to standard password...\n");

  try {
    // Get all users
    const { data: allUsers, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      console.error("❌ Failed to list users:", listError.message);
      return;
    }

    console.log(`📊 Found ${allUsers.users.length} total users\n`);

    // Find admin accounts from profiles
    const { data: adminProfiles, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "admin");

    if (profileError) {
      console.error("❌ Failed to get admin profiles:", profileError.message);
      return;
    }

    console.log(`👑 Found ${adminProfiles.length} admin profiles:`);
    adminProfiles.forEach((admin) => {
      console.log(
        `   - ${admin.email} (${admin.first_name} ${admin.last_name})`,
      );
    });

    console.log("\n🔄 Resetting passwords...\n");

    for (const adminProfile of adminProfiles) {
      console.log(`🔑 Processing ${adminProfile.email}...`);

      // Find corresponding auth user
      const authUser = allUsers.users.find(
        (user) => user.email === adminProfile.email,
      );

      if (!authUser) {
        console.log(`   ⚠️ No auth user found for ${adminProfile.email}`);
        continue;
      }

      // Reset password
      const { error: resetError } = await supabase.auth.admin.updateUserById(
        authUser.id,
        {
          password: "HRPortal2024!",
        },
      );

      if (resetError) {
        console.log(`   ❌ Failed to reset password: ${resetError.message}`);
      } else {
        console.log(`   ✅ Password reset successfully`);
      }
    }

    // Also create the missing admin@hrportal.com account if possible
    console.log("\n📝 Attempting to create admin@hrportal.com...");

    const existingUser = allUsers.users.find(
      (user) => user.email === "admin@hrportal.com",
    );

    if (!existingUser) {
      // Try to create with a different approach
      const { data: newAuthData, error: createError } =
        await supabase.auth.admin.createUser({
          email: "admin@hrportal.com",
          password: "HRPortal2024!",
          email_confirm: true,
          user_metadata: {
            first_name: "System",
            last_name: "Administrator",
          },
        });

      if (createError) {
        console.log(`   ❌ Could not create: ${createError.message}`);
        console.log(`   💡 Use existing admin accounts instead`);
      } else {
        console.log(`   ✅ Created auth user: ${newAuthData.user.id}`);

        // Create profile
        const { error: profileCreateError } = await supabase
          .from("profiles")
          .insert({
            id: newAuthData.user.id,
            first_name: "System",
            last_name: "Administrator",
            email: "admin@hrportal.com",
            role: "admin",
            department: "IT",
            position: "System Administrator",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (profileCreateError) {
          console.log(
            `   ⚠️ Auth created but profile failed: ${profileCreateError.message}`,
          );
        } else {
          console.log(`   ✅ Profile created successfully`);
        }
      }
    } else {
      console.log(`   ✅ admin@hrportal.com auth user already exists`);
    }

    console.log("\n🎉 Password reset complete!");
    console.log("\n📝 Available Admin Accounts:");

    adminProfiles.forEach((admin) => {
      console.log(`   📧 ${admin.email}`);
      console.log(`   🔑 Password: HRPortal2024!`);
      console.log(`   👤 Name: ${admin.first_name} ${admin.last_name}`);
      console.log("");
    });

    console.log("🔗 Login at: https://hr-portal-app-dev-ita.vercel.app/login");
  } catch (error) {
    console.error("❌ Script failed:", error.message);
  }
}

// Main execution
if (require.main === module) {
  resetAdminPasswords().catch((error) => {
    console.error("❌ Script failed:", error.message);
    process.exit(1);
  });
}

module.exports = {
  resetAdminPasswords,
};
