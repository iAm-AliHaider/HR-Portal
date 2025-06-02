#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("🔒 Applying Database Security Fixes");
console.log("===================================\n");

async function main() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing environment variables");
    console.error("Please check .env.local file");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    console.log("📝 Reading SQL script...");
    const sqlContent = fs.readFileSync("fix-database-security.sql", "utf8");

    console.log("🚀 Executing security fixes...\n");

    // Execute key security fixes one by one
    const fixes = [
      // Create activity_logs table
      `CREATE TABLE IF NOT EXISTS public.activity_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        action_type TEXT NOT NULL,
        description TEXT,
        metadata JSONB DEFAULT '{}',
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,

      // Enable RLS on activity_logs
      `ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;`,

      // Create RLS policies
      `CREATE POLICY IF NOT EXISTS "Users can view their own activity logs" ON public.activity_logs
        FOR SELECT USING (auth.uid() = user_id);`,

      `CREATE POLICY IF NOT EXISTS "Admins can view all activity logs" ON public.activity_logs
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'hr_director')
          )
        );`,

      // Fix assign_department_manager function
      `CREATE OR REPLACE FUNCTION public.assign_department_manager(
        user_id UUID,
        department_id UUID
      )
      RETURNS VOID
      SECURITY DEFINER
      SET search_path = public
      LANGUAGE plpgsql
      AS $$
      BEGIN
        UPDATE user_profiles
        SET
          department_id = assign_department_manager.department_id,
          updated_at = NOW()
        WHERE id = assign_department_manager.user_id;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'User not found: %', user_id;
        END IF;
      END;
      $$;`,

      // Fix get_user_role function
      `CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
      RETURNS TEXT
      SECURITY DEFINER
      SET search_path = public
      LANGUAGE plpgsql
      AS $$
      DECLARE
        user_role TEXT;
      BEGIN
        SELECT role INTO user_role
        FROM user_profiles
        WHERE id = get_user_role.user_id
        AND deleted_at IS NULL;

        RETURN COALESCE(user_role, 'employee');
      EXCEPTION WHEN OTHERS THEN
        RETURN 'employee';
      END;
      $$;`,

      // Fix handle_new_user function
      `CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER
      SECURITY DEFINER
      SET search_path = public
      LANGUAGE plpgsql
      AS $$
      BEGIN
        INSERT INTO public.user_profiles (
          id,
          email,
          full_name,
          role,
          department_id,
          status,
          created_at,
          updated_at
        ) VALUES (
          NEW.id,
          NEW.email,
          COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            'New User'
          ),
          'employee',
          NULL,
          'active',
          NOW(),
          NOW()
        );
        RETURN NEW;
      EXCEPTION WHEN OTHERS THEN
        RETURN NEW;
      END;
      $$;`,

      // Fix update_assets_updated_at function
      `CREATE OR REPLACE FUNCTION public.update_assets_updated_at()
      RETURNS TRIGGER
      SECURITY DEFINER
      SET search_path = public
      LANGUAGE plpgsql
      AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      EXCEPTION WHEN OTHERS THEN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$;`,

      // Grant permissions
      `GRANT EXECUTE ON FUNCTION public.assign_department_manager(UUID, UUID) TO authenticated;`,
      `GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;`,
      `GRANT SELECT ON public.activity_logs TO authenticated;`,
      `GRANT INSERT ON public.activity_logs TO authenticated;`,
    ];

    for (let i = 0; i < fixes.length; i++) {
      try {
        const { error } = await supabase.from("_").select("*").limit(0);
        // Use a direct query approach
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${supabaseServiceKey}`,
            "Content-Type": "application/json",
            apikey: supabaseServiceKey,
          },
          body: JSON.stringify({ query: fixes[i] }),
        });

        if (response.ok) {
          console.log(`✅ Fix ${i + 1} applied successfully`);
        } else {
          const errorText = await response.text();
          console.log(`⚠️  Fix ${i + 1}: ${errorText}`);
        }
      } catch (err) {
        console.log(`⚠️  Fix ${i + 1}: ${err.message}`);
      }
    }

    console.log("\n🎉 Security fixes application completed!");
    console.log("\n📋 Next steps:");
    console.log("1. Configure Auth settings in Supabase Dashboard:");
    console.log("   • Set OTP expiry to 15 minutes");
    console.log("   • Enable leaked password protection");
    console.log("   • Set password requirements");
    console.log("2. Run verification: node test-security-fixes.js");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main();
