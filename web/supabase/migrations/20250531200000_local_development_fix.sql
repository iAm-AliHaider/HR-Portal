-- Local Development Environment Fix
-- This migration ensures local development works properly with Docker

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Only run profile fixes if the table exists
DO $$
BEGIN
    -- Check if profiles table exists before attempting to modify it
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        -- Add missing columns to profiles table
        ALTER TABLE profiles 
          ADD COLUMN IF NOT EXISTS first_name TEXT,
          ADD COLUMN IF NOT EXISTS last_name TEXT,
          ADD COLUMN IF NOT EXISTS avatar_url TEXT,
          ADD COLUMN IF NOT EXISTS phone TEXT,
          ADD COLUMN IF NOT EXISTS department TEXT,
          ADD COLUMN IF NOT EXISTS position TEXT,
          ADD COLUMN IF NOT EXISTS manager_id UUID,
          ADD COLUMN IF NOT EXISTS hire_date DATE;

        -- Add foreign key constraint if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'profiles_manager_id_fkey' 
            AND table_name = 'profiles'
        ) THEN
            ALTER TABLE profiles 
            ADD CONSTRAINT profiles_manager_id_fkey 
            FOREIGN KEY (manager_id) REFERENCES profiles(id);
        END IF;

        -- Ensure email is populated
        UPDATE profiles SET email = (
          SELECT email FROM auth.users WHERE id = profiles.id
        ) WHERE email IS NULL OR email = '';

        -- Enable RLS
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create or replace the user creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if profile already exists to prevent duplicates
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    INSERT INTO public.profiles (
      id, 
      email, 
      name, 
      role,
      created_at, 
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(
        NEW.raw_user_meta_data->>'name', 
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1)
      ),
      COALESCE(NEW.raw_user_meta_data->>'role', 'employee'),
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, profiles.name),
      updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Success message
SELECT 'Local development environment setup completed' as status; 