-- Add missing tables for CRUD operations
-- Migration for HR Portal CRUD functionality

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Teams table (if not exists)
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  team_type TEXT DEFAULT 'general',
  status TEXT DEFAULT 'active',
  max_members INTEGER DEFAULT 10,
  team_lead_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Team members junction table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, member_id)
);

-- 3. Projects table (if not exists)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning',
  priority TEXT DEFAULT 'medium',
  start_date DATE,
  end_date DATE,
  estimated_hours INTEGER,
  actual_hours INTEGER DEFAULT 0,
  team_id UUID REFERENCES public.teams(id),
  project_manager_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Project tasks table
CREATE TABLE IF NOT EXISTS public.project_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  assigned_to UUID REFERENCES public.profiles(id),
  due_date DATE,
  estimated_hours INTEGER,
  actual_hours INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bookable equipment table (different from inventory)
CREATE TABLE IF NOT EXISTS public.bookable_equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  model TEXT,
  serial_number TEXT UNIQUE,
  category TEXT,
  description TEXT,
  purchase_date DATE,
  purchase_price DECIMAL(10,2),
  status TEXT DEFAULT 'available',
  condition TEXT DEFAULT 'good',
  location TEXT,
  maintenance_due DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Business travel requests table
CREATE TABLE IF NOT EXISTS public.travel_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  traveler_id UUID NOT NULL REFERENCES public.profiles(id),
  purpose TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL,
  estimated_budget DECIMAL(10,2),
  approved_budget DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMPTZ,
  travel_policy_acknowledged BOOLEAN DEFAULT FALSE,
  emergency_contact TEXT,
  special_requirements TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Travel bookings table (flights, hotels, etc.)
CREATE TABLE IF NOT EXISTS public.travel_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  travel_request_id UUID NOT NULL REFERENCES public.travel_requests(id) ON DELETE CASCADE,
  booking_type TEXT NOT NULL, -- 'flight', 'hotel', 'car', 'train', etc.
  provider TEXT,
  confirmation_number TEXT,
  details JSONB,
  cost DECIMAL(10,2),
  booking_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Travel expenses table
CREATE TABLE IF NOT EXISTS public.travel_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  travel_request_id UUID NOT NULL REFERENCES public.travel_requests(id) ON DELETE CASCADE,
  expense_type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  expense_date DATE NOT NULL,
  description TEXT,
  receipt_url TEXT,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Chat channels table
CREATE TABLE IF NOT EXISTS public.chat_channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'group', -- 'group', 'direct', 'public', 'private'
  created_by UUID REFERENCES public.profiles(id), -- Made nullable for now
  is_private BOOLEAN DEFAULT FALSE,
  max_members INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Chat channel members table
CREATE TABLE IF NOT EXISTS public.channel_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID NOT NULL REFERENCES public.chat_channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'admin', 'moderator', 'member'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);

-- 11. Chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID NOT NULL REFERENCES public.chat_channels(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- 'text', 'image', 'file', 'system'
  reply_to UUID REFERENCES public.chat_messages(id),
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Message reactions table
CREATE TABLE IF NOT EXISTS public.message_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- 13. Unified requests table (if not exists or add columns)
CREATE TABLE IF NOT EXISTS public.unified_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id),
  request_type TEXT NOT NULL, -- 'leave', 'equipment', 'travel', 'support', etc.
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  category TEXT,
  related_id UUID, -- ID of related record (equipment_id, travel_request_id, etc.)
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMPTZ,
  approval_comments TEXT,
  completed_at TIMESTAMPTZ,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Request comments table
CREATE TABLE IF NOT EXISTS public.request_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES public.unified_requests(id) ON DELETE CASCADE,
  commenter_id UUID NOT NULL REFERENCES public.profiles(id),
  comment_text TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_status ON public.teams(status);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_member_id ON public.team_members(member_id);
CREATE INDEX IF NOT EXISTS idx_projects_team_id ON public.projects(team_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON public.project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_assigned_to ON public.project_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_bookable_equipment_status ON public.bookable_equipment(status);
CREATE INDEX IF NOT EXISTS idx_travel_requests_traveler_id ON public.travel_requests(traveler_id);
CREATE INDEX IF NOT EXISTS idx_travel_requests_status ON public.travel_requests(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_channel_id ON public.chat_messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON public.chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_unified_requests_requester_id ON public.unified_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_unified_requests_status ON public.unified_requests(status);
CREATE INDEX IF NOT EXISTS idx_unified_requests_type ON public.unified_requests(request_type);

-- Enable Row Level Security (RLS) on new tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookable_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unified_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_comments ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (allow all for development - restrict in production)
CREATE POLICY "Allow all operations" ON public.teams FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.team_members FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.projects FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.project_tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.bookable_equipment FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.travel_requests FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.travel_bookings FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.travel_expenses FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.chat_channels FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.channel_members FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.chat_messages FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.message_reactions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.unified_requests FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.request_comments FOR ALL USING (true);

-- Insert some sample data for testing (only for tables that don't require profiles)
INSERT INTO public.teams (name, description, team_type) VALUES
('Frontend Development Team', 'Responsible for all user-facing applications', 'development'),
('Backend Development Team', 'Handles server-side development and APIs', 'development'),
('QA Team', 'Quality assurance and testing', 'testing'),
('Marketing Team', 'Brand management and digital marketing', 'marketing')
ON CONFLICT DO NOTHING;

INSERT INTO public.bookable_equipment (name, model, serial_number, category, status) VALUES
('MacBook Pro 16"', 'MacBook Pro M2', 'MBP001', 'Laptop', 'available'),
('MacBook Pro 14"', 'MacBook Pro M2', 'MBP002', 'Laptop', 'available'),
('iPad Pro', 'iPad Pro 12.9"', 'IPD001', 'Tablet', 'available'),
('iPhone 15 Pro', 'iPhone 15 Pro', 'IPH001', 'Phone', 'available'),
('Dell Monitor 27"', 'Dell UltraSharp', 'MON001', 'Monitor', 'available'),
('Webcam HD', 'Logitech C920', 'CAM001', 'Camera', 'available'),
('Projector', 'Epson PowerLite', 'PRJ001', 'Presentation', 'available'),
('Wireless Mouse', 'Logitech MX Master 3', 'MOU001', 'Accessory', 'available'),
('Mechanical Keyboard', 'Keychron K8', 'KEY001', 'Accessory', 'available'),
('Noise Cancelling Headphones', 'Sony WH-1000XM4', 'HEAD001', 'Audio', 'available')
ON CONFLICT (serial_number) DO NOTHING;

-- Insert sample chat channels (without created_by for now)
INSERT INTO public.chat_channels (name, description, type) VALUES
('General', 'General company discussion', 'public'),
('Development', 'Development team discussions', 'group'),
('HR Announcements', 'HR department announcements', 'public')
ON CONFLICT DO NOTHING;

-- Success message
COMMENT ON TABLE public.teams IS 'CRUD migration completed successfully! All tables created with sample data.';
