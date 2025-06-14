-- EMERGENCY FIX: Completely disable RLS to stop infinite recursion
-- This should be run immediately to get the app working
-- We can re-enable RLS with proper policies later

-- Drop all existing policies first
DROP POLICY IF EXISTS "Allow all for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON cases;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON inspections;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON inspection_items;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON photos;

-- Disable RLS completely on all tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE cases DISABLE ROW LEVEL SECURITY; 
ALTER TABLE inspections DISABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE photos DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'cases', 'inspections', 'inspection_items', 'photos')
  AND schemaname = 'public';