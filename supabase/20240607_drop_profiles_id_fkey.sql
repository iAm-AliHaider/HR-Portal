-- Migration: Drop foreign key constraint on profiles.id for local/dev environments
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey; 