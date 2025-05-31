/**
 * Fix Profile ID Mismatch
 *
 * This script fixes the mismatch between auth user ID and profile ID for the same email
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

async function fixProfileIdMismatch() {
  console.log("🔧 Fixing profile ID mismatch for sanfa360@gmail.com...\n");

  try {
    const email = "sanfa360@gmail.com";
    const authUserId = "2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb";

    console.log(`📧 Email: ${email}`);
    console.log(`🆔 Auth User ID: ${authUserId}`);

    // Find the existing profile by email
    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("❌ Error finding profile:", profileError.message);
      return;
    }

    if (!existingProfile) {
      console.log("❌ No existing profile found with this email");
      return;
    }

    console.log("✅ Found existing profile:");
    console.log(`   Current ID: ${existingProfile.id}`);
    console.log(
      `   Name: ${existingProfile.first_name} ${existingProfile.last_name}`,
    );
    console.log(`   Role: ${existingProfile.role}`);

    if (existingProfile.id === authUserId) {
      console.log("✅ Profile ID already matches auth user ID - no fix needed");
      return;
    }

    console.log("🔄 Profile ID mismatch detected, fixing...");

    // Check if there are any dependent records (like employees) that reference the old profile ID
    const { data: dependents, error: depError } = await supabase
      .from("employees")
      .select("id")
      .eq("profile_id", existingProfile.id);

    if (depError) {
      console.log("⚠️ Could not check dependent records:", depError.message);
    } else if (dependents && dependents.length > 0) {
      console.log(
        `📋 Found ${dependents.length} dependent employee record(s), updating...`,
      );

      // Update dependent records to point to new profile ID
      const { error: updateDepError } = await supabase
        .from("employees")
        .update({ profile_id: authUserId })
        .eq("profile_id", existingProfile.id);

      if (updateDepError) {
        console.log(
          "⚠️ Failed to update dependent records:",
          updateDepError.message,
        );
      } else {
        console.log("✅ Updated dependent records");
      }
    }

    // Delete the old profile
    const { error: deleteError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", existingProfile.id);

    if (deleteError) {
      console.error("❌ Failed to delete old profile:", deleteError.message);
      return;
    }

    console.log("✅ Deleted old profile");

    // Create new profile with correct ID
    const { error: createError } = await supabase.from("profiles").insert({
      id: authUserId,
      first_name: existingProfile.first_name,
      last_name: existingProfile.last_name,
      email: existingProfile.email,
      role: "admin", // Ensure it's admin
      department: existingProfile.department || "IT",
      position: existingProfile.position || "Administrator",
      avatar_url: existingProfile.avatar_url,
      phone: existingProfile.phone,
      created_at: existingProfile.created_at,
      updated_at: new Date().toISOString(),
    });

    if (createError) {
      console.error("❌ Failed to create new profile:", createError.message);
      return;
    }

    console.log("✅ Created new profile with correct ID");

    // Verify the fix
    const { data: verifyProfile, error: verifyError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUserId)
      .single();

    if (verifyError) {
      console.error("❌ Verification failed:", verifyError.message);
    } else {
      console.log("\n✅ Verification successful:");
      console.log(`   ID: ${verifyProfile.id}`);
      console.log(`   Email: ${verifyProfile.email}`);
      console.log(`   Role: ${verifyProfile.role}`);
      console.log(
        `   Name: ${verifyProfile.first_name} ${verifyProfile.last_name}`,
      );
    }

    console.log("\n🎉 Profile ID mismatch fixed!");
    console.log("\n📝 Next steps:");
    console.log("1. Go to: https://hr-portal-app-dev-ita.vercel.app/login");
    console.log("2. Clear browser cache (Ctrl+Shift+R)");
    console.log("3. Log in with: sanfa360@gmail.com / HRPortal2024!");
    console.log("4. You should now have admin access without loading errors");
  } catch (error) {
    console.error("❌ Script failed:", error.message);
  }
}

// Main execution
if (require.main === module) {
  fixProfileIdMismatch().catch((error) => {
    console.error("❌ Script failed:", error.message);
    process.exit(1);
  });
}

module.exports = {
  fixProfileIdMismatch,
};
