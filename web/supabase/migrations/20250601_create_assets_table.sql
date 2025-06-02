-- Create missing assets table to match code expectations
-- This resolves the "relation public.assets does not exist" error

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

-- RLS Policies
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

-- Add updated_at trigger
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

-- Insert sample data for testing
INSERT INTO public.assets (org_id, name, description, category, brand, model, status, condition, location, specifications) VALUES
  ('org1', 'MacBook Pro 16"', 'High-performance laptop for development', 'laptop', 'Apple', 'MacBook Pro', 'available', 'excellent', 'IT Storage', '{"processor": "M2 Pro", "ram": "32GB", "storage": "1TB SSD"}'),
  ('org1', 'Dell Monitor 27"', 'External monitor for workstations', 'monitor', 'Dell', 'U2723QE', 'available', 'good', 'IT Storage', '{"resolution": "4K", "size": "27 inch", "ports": ["USB-C", "HDMI"]}'),
  ('org1', 'iPhone 14 Pro', 'Company mobile device', 'mobile', 'Apple', 'iPhone 14 Pro', 'in_use', 'excellent', 'Assigned to John Doe', '{"storage": "256GB", "color": "Space Black"}'),
  ('org1', 'Projector Epson', 'Meeting room projector', 'projector', 'Epson', 'EB-2055', 'available', 'good', 'Meeting Room A', '{"brightness": "5000 lumens", "resolution": "XGA"}'),
  ('org1', 'Ergonomic Chair', 'Adjustable office chair', 'furniture', 'Herman Miller', 'Aeron', 'available', 'good', 'Facilities Storage', '{"type": "Ergonomic", "color": "Black", "adjustable": true}');

-- Grant permissions
GRANT ALL ON public.assets TO authenticated;
GRANT ALL ON public.assets TO service_role;
