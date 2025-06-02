-- HR Portal Database Connection Fix
-- Copy this entire script into Supabase Dashboard > SQL Editor and run it
-- This will resolve the "assets table does not exist" error

-- Fix 1: Create missing assets table
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

-- Fix 2: Add performance indexes
CREATE INDEX IF NOT EXISTS idx_assets_org_id ON public.assets(org_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON public.assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_category ON public.assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_location ON public.assets(location);

-- Fix 3: Enable Row Level Security
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Fix 4: Add RLS policies for proper access control
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

-- Fix 5: Add updated_at trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_assets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW
  EXECUTE FUNCTION update_assets_updated_at();

-- Fix 6: Insert sample data for testing (JSON syntax corrected)
INSERT INTO public.assets (org_id, name, description, category, brand, model, status, condition, location, specifications) VALUES
  ('org1', 'MacBook Pro 16"', 'High-performance laptop for development', 'laptop', 'Apple', 'MacBook Pro', 'available', 'excellent', 'IT Storage', '{"processor": "M2 Pro", "ram": "32GB", "storage": "1TB SSD"}'),
  ('org1', 'Dell Monitor 27"', 'External monitor for workstations', 'monitor', 'Dell', 'U2723QE', 'available', 'good', 'IT Storage', '{"resolution": "4K", "size": "27 inch", "ports": ["USB-C", "HDMI"]}'),
  ('org1', 'iPhone 14 Pro', 'Company mobile device', 'mobile', 'Apple', 'iPhone 14 Pro', 'in_use', 'excellent', 'Assigned to John Doe', '{"storage": "256GB", "color": "Space Black"}'),
  ('org1', 'Projector Epson', 'Meeting room projector', 'projector', 'Epson', 'EB-2055', 'available', 'good', 'Meeting Room A', '{"brightness": "5000 lumens", "resolution": "XGA"}'),
  ('org1', 'Ergonomic Chair', 'Adjustable office chair', 'furniture', 'Herman Miller', 'Aeron', 'available', 'good', 'Facilities Storage', '{"type": "Ergonomic", "color": "Black", "adjustable": true}'),
  ('org1', 'Conference Phone', 'VoIP conference phone', 'communication', 'Polycom', 'Trio 8500', 'available', 'good', 'Meeting Room B', '{"type": "Conference Phone", "connectivity": "WiFi/Ethernet"}'),
  ('org1', 'Wireless Presenter', 'Wireless presentation remote', 'accessory', 'Logitech', 'R400', 'available', 'good', 'IT Storage', '{"range": "15m", "battery": "AAA"}');

-- Fix 7: Grant proper permissions
GRANT ALL ON public.assets TO authenticated;
GRANT ALL ON public.assets TO service_role;

-- Verification: Check that the table was created successfully
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'assets') THEN
    RAISE NOTICE '✅ Assets table created successfully!';
  ELSE
    RAISE NOTICE '❌ Assets table creation failed!';
  END IF;
END $$;
