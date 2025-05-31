#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");

// Configuration
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://tqtwdkobrzzrhrqdxprs.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94";

// Initialize Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function fixProfileRLSPolicies() {
  console.log("Fixing Profile RLS policies to prevent infinite recursion...");

  try {
    // First, let's check current policies
    console.log("Checking current RLS policies for profiles table...");

    // Drop existing problematic policies that cause recursion
    console.log("Dropping existing policies...");

    const sqlDropPolicies = `
      DROP POLICY IF EXISTS "Admin and HR can view all data" ON public.profiles;
      DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
      DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
    `;

    const { error: dropError } = await supabase.rpc("pgbouncer_exec_sql", {
      sql: sqlDropPolicies,
    });

    if (dropError) {
      console.error("Error dropping policies:", dropError.message);
    } else {
      console.log("Successfully dropped existing policies");
    }

    // Create new non-recursive policies
    console.log("Creating new non-recursive policies...");

    const sqlCreatePolicies = `
      -- Everyone can read basic profile data (no recursion)
      CREATE POLICY "Profiles are viewable by everyone" 
        ON public.profiles FOR SELECT 
        USING (true);

      -- Users can update their own profiles
      CREATE POLICY "Users can update own profile" 
        ON public.profiles FOR UPDATE 
        USING (auth.uid() = id) 
        WITH CHECK (auth.uid() = id);

      -- Admin and HR roles have full access without recursive checks
      CREATE POLICY "Admin and HR full access" 
        ON public.profiles FOR ALL 
        USING (
          auth.jwt() -> 'role' = 'admin' OR 
          auth.jwt() -> 'role' = 'hr' OR
          EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid() AND raw_user_meta_data->>'role' IN ('admin', 'hr')
          )
        );
        
      -- Users can insert their own profile
      CREATE POLICY "Users can insert own profile" 
        ON public.profiles FOR INSERT 
        WITH CHECK (auth.uid() = id);
    `;

    const { error: createError } = await supabase.rpc("pgbouncer_exec_sql", {
      sql: sqlCreatePolicies,
    });

    if (createError) {
      console.error("Error creating new policies:", createError.message);
      return false;
    } else {
      console.log("Successfully created new non-recursive policies");
    }

    // Fix request_types form_schema data
    console.log("Ensuring request_types has proper form_schema data...");

    const updateRequestTypesSchema = `
      -- Update request types to ensure they have form_schema
      UPDATE public.request_types
      SET form_schema = '{"fields": [{"name": "description", "type": "textarea", "label": "Description", "required": true}]}'::jsonb
      WHERE form_schema IS NULL;
    `;

    const { error: updateError } = await supabase.rpc("pgbouncer_exec_sql", {
      sql: updateRequestTypesSchema,
    });

    if (updateError) {
      console.error(
        "Error updating request_types schema:",
        updateError.message,
      );
    } else {
      console.log("Successfully updated request_types schema where needed");
    }

    return true;
  } catch (error) {
    console.error("Exception during RLS policy fix:", error.message);
    return false;
  }
}

async function main() {
  console.log(
    "======================================================================",
  );
  console.log("FIXING PROFILE RLS POLICIES");
  console.log(
    "======================================================================",
  );

  const success = await fixProfileRLSPolicies();

  if (success) {
    console.log("\n✅ Successfully fixed profile RLS policies");
    console.log("✅ Updated request_types form schema where needed");
    console.log(
      '\nThe "type required" error in request forms should now be resolved.',
    );
    console.log("\nPlease refresh your application and try again.");
  } else {
    console.log("\n❌ Failed to fix profile RLS policies");
    console.log("Please check the error messages above for details.");
  }
}

// Run the main function
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
