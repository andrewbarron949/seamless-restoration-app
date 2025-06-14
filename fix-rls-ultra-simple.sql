-- ULTRA SIMPLE RLS POLICIES - NO RECURSION
-- This removes all existing policies and creates the simplest possible ones

-- First, drop all existing RLS policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can create cases" ON cases;
DROP POLICY IF EXISTS "Users can view cases they created" ON cases;
DROP POLICY IF EXISTS "Users can update cases they created" ON cases;
DROP POLICY IF EXISTS "Authenticated users can create inspections" ON inspections;
DROP POLICY IF EXISTS "Users can view inspections they created" ON inspections;
DROP POLICY IF EXISTS "Users can update inspections they created" ON inspections;
DROP POLICY IF EXISTS "Authenticated users can create inspection items" ON inspection_items;
DROP POLICY IF EXISTS "Users can view inspection items they created" ON inspection_items;
DROP POLICY IF EXISTS "Users can update inspection items they created" ON inspection_items;
DROP POLICY IF EXISTS "Authenticated users can create photos" ON photos;
DROP POLICY IF EXISTS "Users can view photos they created" ON photos;
DROP POLICY IF EXISTS "Users can update photos they created" ON photos;

-- Temporarily disable RLS to avoid any issues
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE cases DISABLE ROW LEVEL SECURITY; 
ALTER TABLE inspections DISABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE photos DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- ULTRA SIMPLE POLICIES - Allow authenticated users to do everything
-- This eliminates any possibility of recursion

-- Profiles table
CREATE POLICY "Allow all for authenticated users" ON profiles
FOR ALL USING (auth.role() = 'authenticated');

-- Cases table  
CREATE POLICY "Allow all for authenticated users" ON cases
FOR ALL USING (auth.role() = 'authenticated');

-- Inspections table
CREATE POLICY "Allow all for authenticated users" ON inspections  
FOR ALL USING (auth.role() = 'authenticated');

-- Inspection items table
CREATE POLICY "Allow all for authenticated users" ON inspection_items
FOR ALL USING (auth.role() = 'authenticated');

-- Photos table
CREATE POLICY "Allow all for authenticated users" ON photos
FOR ALL USING (auth.role() = 'authenticated');