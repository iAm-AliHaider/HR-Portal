const { createClient } = require("@supabase/supabase-js");

// Use environment variables or hardcoded values
const supabaseUrl = "https://tqtwdkobrzzrhrqdxprs.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAssetsTable() {
  console.log("🔧 Creating assets table...");

  const createTableSQL = `
    -- Create missing assets table to match code expectations
    CREATE TABLE IF NOT EXISTS public.assets (
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
    );

    -- Add indexes for performance
    CREATE INDEX IF NOT EXISTS idx_assets_org_id ON public.assets(org_id);
    CREATE INDEX IF NOT EXISTS idx_assets_status ON public.assets(status);
    CREATE INDEX IF NOT EXISTS idx_assets_category ON public.assets(category);
    CREATE INDEX IF NOT EXISTS idx_assets_location ON public.assets(location);

    -- Enable RLS
    ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
  `;

  try {
    const { data, error } = await supabase.rpc("exec_sql", {
      sql: createTableSQL,
    });

    if (error) {
      console.error("❌ Error creating table:", error.message);
      // Try direct SQL execution
      console.log("Trying direct SQL execution...");
      const { error: directError } = await supabase
        .from("_dummy")
        .select("version()")
        .limit(1);

      // If that fails, we'll use individual operations
      console.log("Creating table using individual operations...");

      // Check if table exists first
      const { data: tableExists } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")
        .eq("table_name", "assets");

      if (tableExists && tableExists.length > 0) {
        console.log("✅ Assets table already exists!");
        return;
      }

      throw new Error("Unable to create table through available methods");
    }

    console.log("✅ Assets table created successfully!");

    // Insert sample data
    const sampleAssets = [
      {
        org_id: "org1",
        name: 'MacBook Pro 16"',
        description: "High-performance laptop for development",
        category: "laptop",
        brand: "Apple",
        model: "MacBook Pro",
        status: "available",
        condition: "excellent",
        location: "IT Storage",
        specifications: {
          processor: "M2 Pro",
          ram: "32GB",
          storage: "1TB SSD",
        },
      },
      {
        org_id: "org1",
        name: 'Dell Monitor 27"',
        description: "External monitor for workstations",
        category: "monitor",
        brand: "Dell",
        model: "U2723QE",
        status: "available",
        condition: "good",
        location: "IT Storage",
        specifications: {
          resolution: "4K",
          size: "27 inch",
          ports: ["USB-C", "HDMI"],
        },
      },
      {
        org_id: "org1",
        name: "iPhone 14 Pro",
        description: "Company mobile device",
        category: "mobile",
        brand: "Apple",
        model: "iPhone 14 Pro",
        status: "in_use",
        condition: "excellent",
        location: "Assigned to John Doe",
        specifications: {
          storage: "256GB",
          color: "Space Black",
        },
      },
    ];

    console.log("📦 Inserting sample assets...");
    const { data: insertData, error: insertError } = await supabase
      .from("assets")
      .insert(sampleAssets);

    if (insertError) {
      console.warn("⚠️ Could not insert sample data:", insertError.message);
    } else {
      console.log("✅ Sample assets inserted successfully!");
    }
  } catch (error) {
    console.error("❌ Failed to create assets table:", error.message);
    console.log("\n📋 Manual Steps Required:");
    console.log("1. Open Supabase Dashboard > SQL Editor");
    console.log("2. Run the following SQL:");
    console.log(createTableSQL);
    console.log("\n3. Then add RLS policies:");
    console.log(`
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
      );
    `);
  }
}

createAssetsTable();
