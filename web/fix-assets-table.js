const { createClient } = require("@supabase/supabase-js");

// Use the service role key for admin operations
const supabaseUrl = "https://tqtwdkobrzzrhrqdxprs.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndCreateAssets() {
  console.log("🔍 Checking if assets table exists...");

  try {
    // First, try to query the assets table to see if it exists
    const { data, error } = await supabase.from("assets").select("id").limit(1);

    if (!error) {
      console.log("✅ Assets table already exists!");
      console.log("📊 Current assets count:", data ? data.length : 0);
      return true;
    }

    if (error.message.includes("does not exist")) {
      console.log("❌ Assets table does not exist");
      console.log("📋 MANUAL FIX REQUIRED:");
      console.log("1. Go to https://supabase.com/dashboard");
      console.log("2. Open your project: tqtwdkobrzzrhrqdxprs");
      console.log("3. Navigate to SQL Editor");
      console.log("4. Run this SQL:");
      console.log("");
      console.log("-- Fix 1: Create assets table");
      console.log(`CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id TEXT NOT NULL DEFAULT 'org1',
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  asset_tag TEXT,
  location TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'retired')),
  condition TEXT DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  purchase_date DATE,
  warranty_expiry DATE,
  specifications JSONB DEFAULT '{}',
  booking_rules JSONB DEFAULT '{}',
  hourly_rate DECIMAL(8,2),
  daily_rate DECIMAL(8,2),
  responsible_person TEXT,
  images TEXT[],
  maintenance_schedule TEXT DEFAULT 'annual',
  last_maintenance_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`);

      console.log("");
      console.log("-- Fix 2: Add indexes");
      console.log(`CREATE INDEX IF NOT EXISTS idx_assets_org_id ON public.assets(org_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON public.assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_category ON public.assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_location ON public.assets(location);`);

      console.log("");
      console.log("-- Fix 3: Enable RLS and add policies");
      console.log(`ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Assets are viewable by authenticated users"
ON public.assets FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Admin and managers can manage assets"
ON public.assets FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'manager', 'hr')
  )
);`);

      console.log("");
      console.log("-- Fix 4: Add sample data");
      console.log(`INSERT INTO public.assets (org_id, name, description, category, brand, model, status, condition, location, specifications) VALUES
  ('org1', 'MacBook Pro 16"', 'High-performance laptop for development', 'laptop', 'Apple', 'MacBook Pro', 'available', 'excellent', 'IT Storage', '{"processor": "M2 Pro", "ram": "32GB", "storage": "1TB SSD"}'),
  ('org1', 'Dell Monitor 27"', 'External monitor for workstations', 'monitor', 'Dell', 'U2723QE', 'available', 'good', 'IT Storage', '{"resolution": "4K", "size": "27 inch", "ports": ["USB-C", "HDMI"]}'),
  ('org1', 'iPhone 14 Pro', 'Company mobile device', 'mobile', 'Apple', 'iPhone 14 Pro', 'in_use', 'excellent', 'Assigned to John Doe', '{"storage": "256GB", "color": "Space Black"}'),
  ('org1', 'Projector Epson', 'Meeting room projector', 'projector', 'Epson', 'EB-2055', 'available', 'good', 'Meeting Room A', '{"brightness": "5000 lumens", "resolution": "XGA"}'),
  ('org1', 'Ergonomic Chair', 'Adjustable office chair', 'furniture', 'Herman Miller', 'Aeron', 'available', 'good', 'Facilities Storage', '{"type": "Ergonomic", "color": "Black", "adjustable": true}');`);

      console.log("");
      console.log("5. After running the SQL, test again by running:");
      console.log("   node test-db-status.js");

      return false;
    } else {
      console.error("❌ Unexpected error:", error.message);
      return false;
    }
  } catch (err) {
    console.error("❌ Error checking assets table:", err.message);
    return false;
  }
}

async function checkAllTables() {
  console.log("🔍 Checking all critical tables...");

  const tables = [
    "profiles",
    "employees",
    "jobs",
    "applications",
    "leave_requests",
    "training_courses",
    "workflows",
    "meeting_rooms",
    "assets",
    "expenses",
  ];

  const results = [];

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select("id").limit(1);

      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
        results.push({ table, status: "error", error: error.message });
      } else {
        console.log(`✅ ${table}: Working`);
        results.push({ table, status: "success" });
      }
    } catch (error) {
      console.log(`❌ ${table}: ${error.message}`);
      results.push({ table, status: "error", error: error.message });
    }
  }

  const successful = results.filter((r) => r.status === "success").length;
  const total = results.length;

  console.log(`\n📊 Table Status: ${successful}/${total} working`);

  if (successful < total) {
    console.log("\n🔧 Issues found that need manual fixing:");
    results
      .filter((r) => r.status === "error")
      .forEach((result) => {
        console.log(`   - ${result.table}: ${result.error}`);
      });
  } else {
    console.log("\n🎉 All tables are working correctly!");
  }

  return successful === total;
}

async function main() {
  console.log("🚀 HR Portal Database Connection Fixer");
  console.log("=====================================\n");

  const assetsOk = await checkAndCreateAssets();
  console.log("");
  const allTablesOk = await checkAllTables();

  console.log("\n=====================================");
  if (allTablesOk) {
    console.log("✅ All database connection issues resolved!");
    console.log("🎯 Next steps:");
    console.log("   1. Run: node test-db-status.js");
    console.log("   2. Start your application: npm run dev");
  } else {
    console.log("⚠️  Manual fixes required (see instructions above)");
  }
}

main();
