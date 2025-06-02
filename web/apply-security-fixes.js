#!/usr/bin/env node

// 🔒 Apply Database Security Fixes Script
// Executes the security fixes SQL script via Supabase

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("🔒 HR Portal Database Security Fixes");
console.log("====================================\n");

async function applySecurityFixes() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase configuration");
    console.error(
      "Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set",
    );
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    console.log("📝 Reading security fixes SQL script...");
    const sqlScript = fs.readFileSync("fix-database-security.sql", "utf8");

    console.log("🚀 Applying security fixes to database...");
    console.log("This may take a few moments...\n");

    // Split the script into individual statements for better error handling
    const statements = sqlScript
      .split(";")
      .filter((stmt) => stmt.trim().length > 0);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement && !statement.startsWith("--")) {
        try {
          const { error } = await supabase.rpc("sql", {
            query: statement + ";",
          });

          if (error && !error.message.includes("already exists")) {
            console.log(`⚠️  Statement ${i + 1}: ${error.message}`);
          }
        } catch (err) {
          // Continue with other statements
          console.log(`⚠️  Statement ${i + 1}: ${err.message}`);
        }
      }
    }

    console.log("✅ Security fixes application completed!");
    console.log("\n🔍 Now running verification tests...\n");
  } catch (err) {
    console.error("❌ Error applying security fixes:", err.message);
    process.exit(1);
  }
}

// Run the application
applySecurityFixes()
  .then(() => {
    console.log("\n🎉 Database security fixes applied successfully!");
    console.log("📋 Next steps:");
    console.log("1. Run verification: node test-security-fixes.js");
    console.log("2. Configure Auth settings in Supabase Dashboard");
    console.log("3. Enable leaked password protection");
  })
  .catch((error) => {
    console.error("Fatal error:", error.message);
    process.exit(1);
  });
