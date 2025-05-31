/**
 * Fix Admin Roles
 *
 * This script checks and fixes role assignments for admin users
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

async function fixAdminRoles() {
  console.log("🔧 Checking and fixing admin role assignments...\n");

  try {
    // Admin emails that should have admin role
    const adminEmails = [
      "sanfa360@gmail.com",
      "admin@yourcompany.com",
      "admin@hrportal.com",
    ];

    console.log("🔍 Checking current roles for admin users...\n");

    for (const email of adminEmails) {
      console.log(`📧 Checking ${email}:`);

      // Get current profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.log(`   ❌ Error: ${profileError.message}`);
        continue;
      }

      if (!profile) {
        console.log(`   ⚠️ No profile found`);
        continue;
      }

      console.log(`   📊 Current role: ${profile.role}`);
      console.log(`   👤 Name: ${profile.first_name} ${profile.last_name}`);
      console.log(`   🆔 Profile ID: ${profile.id}`);

      if (profile.role !== "admin") {
        console.log(`   🔄 Updating role from '${profile.role}' to 'admin'...`);

        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            role: "admin",
            updated_at: new Date().toISOString(),
          })
          .eq("email", email);

        if (updateError) {
          console.log(`   ❌ Failed to update role: ${updateError.message}`);
        } else {
          console.log(`   ✅ Role updated to admin successfully`);
        }
      } else {
        console.log(`   ✅ Role is already admin`);
      }

      console.log("");
    }

    // Also check and fix any other users that should be admin
    console.log("🔍 Checking for other admin users...");

    const { data: allProfiles, error: allError } = await supabase
      .from("profiles")
      .select("*")
      .or(
        "first_name.ilike.%admin%,last_name.ilike.%admin%,position.ilike.%admin%",
      );

    if (allError) {
      console.log(`❌ Error checking other profiles: ${allError.message}`);
    } else {
      console.log(`📋 Found ${allProfiles.length} potential admin profiles:`);

      for (const profile of allProfiles) {
        console.log(
          `   📧 ${profile.email}: ${profile.first_name} ${profile.last_name} (${profile.role})`,
        );

        if (
          profile.role !== "admin" &&
          (profile.first_name?.toLowerCase().includes("admin") ||
            profile.last_name?.toLowerCase().includes("admin") ||
            profile.position?.toLowerCase().includes("admin"))
        ) {
          console.log(`   🔄 Should be admin, updating...`);

          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              role: "admin",
              updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id);

          if (updateError) {
            console.log(`   ❌ Update failed: ${updateError.message}`);
          } else {
            console.log(`   ✅ Updated to admin`);
          }
        }
      }
    }

    console.log("\n🎉 Admin role fixes complete!");
    console.log(
      "\n📝 Please log out and log back in for changes to take effect.",
    );
    console.log("🔗 Login at: https://hr-portal-app-dev-ita.vercel.app/login");

    // Verify final state
    console.log("\n📊 Final verification - Admin users:");

    const { data: finalAdmins, error: finalError } = await supabase
      .from("profiles")
      .select("email, first_name, last_name, role, position")
      .eq("role", "admin")
      .order("email");

    if (finalError) {
      console.log(`❌ Error: ${finalError.message}`);
    } else {
      finalAdmins.forEach((admin) => {
        console.log(
          `   ✅ ${admin.email} - ${admin.first_name} ${admin.last_name} (${admin.role})`,
        );
      });
    }
  } catch (error) {
    console.error("❌ Script failed:", error.message);
  }
}

// Main execution
if (require.main === module) {
  fixAdminRoles().catch((error) => {
    console.error("❌ Script failed:", error.message);
    process.exit(1);
  });
}

module.exports = {
  fixAdminRoles,
};
