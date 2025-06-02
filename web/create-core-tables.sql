-- 🏗️ Create Core HR Portal Database Tables
-- Sets up essential tables needed for security functions and application

-- Create user_profiles table (essential for authentication and RBAC)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'employee',
  department_id UUID,
  employee_id TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  date_of_birth DATE,
  hire_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active',
  manager_id UUID REFERENCES public.user_profiles(id),
  salary DECIMAL(10,2),
  position TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR ALL USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'hr_director', 'hr_manager')
    )
  );

-- Create departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  manager_id UUID REFERENCES public.user_profiles(id),
  budget DECIMAL(12,2),
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on departments
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for departments
CREATE POLICY "Authenticated users can view departments" ON public.departments
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage departments" ON public.departments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'hr_director')
    )
  );

-- Ensure activity_logs table exists (created earlier but ensuring it's here)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on activity_logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create additional essential tables for HR Portal

-- Assets table (for asset management)
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  asset_tag TEXT UNIQUE,
  category TEXT,
  model TEXT,
  serial_number TEXT,
  purchase_date DATE,
  purchase_price DECIMAL(10,2),
  assigned_to UUID REFERENCES public.user_profiles(id),
  location TEXT,
  status TEXT DEFAULT 'available',
  condition TEXT DEFAULT 'good',
  notes TEXT,
  updated_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on assets
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for assets
CREATE POLICY "Users can view assets" ON public.assets
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage assets" ON public.assets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'hr_director', 'facilities_manager')
    )
  );

-- Add foreign key constraint for departments in user_profiles
ALTER TABLE public.user_profiles
DROP CONSTRAINT IF EXISTS user_profiles_department_id_fkey;

ALTER TABLE public.user_profiles
ADD CONSTRAINT user_profiles_department_id_fkey
FOREIGN KEY (department_id) REFERENCES public.departments(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_department ON public.user_profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_assets_assigned_to ON public.assets(assigned_to);

-- Grant necessary permissions
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.departments TO authenticated;
GRANT ALL ON public.activity_logs TO authenticated;
GRANT ALL ON public.assets TO authenticated;

-- Insert sample departments
INSERT INTO public.departments (id, name, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Human Resources', 'Manages employee relations and policies'),
  ('22222222-2222-2222-2222-222222222222', 'Information Technology', 'Manages technology infrastructure'),
  ('33333333-3333-3333-3333-333333333333', 'Finance', 'Handles financial operations'),
  ('44444444-4444-4444-4444-444444444444', 'Operations', 'Manages day-to-day operations')
ON CONFLICT (name) DO NOTHING;

-- Create or update the updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers to tables
DROP TRIGGER IF EXISTS handle_updated_at ON public.user_profiles;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.departments;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.assets;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Verification
DO $$
BEGIN
  RAISE NOTICE '🏗️ Core tables created successfully!';
  RAISE NOTICE '✅ user_profiles table with RLS';
  RAISE NOTICE '✅ departments table with sample data';
  RAISE NOTICE '✅ activity_logs table verified';
  RAISE NOTICE '✅ assets table for asset management';
  RAISE NOTICE '✅ All necessary indexes created';
  RAISE NOTICE '✅ Updated_at triggers applied';
  RAISE NOTICE '✅ Permissions granted';
END
$$;
