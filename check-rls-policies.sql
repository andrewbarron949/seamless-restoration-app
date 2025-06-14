-- Check current RLS policies on all tables
-- Run this in Supabase SQL Editor to see what policies are currently active

-- Check if RLS is enabled on tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'cases', 'inspections', 'inspection_items', 'photos')
  AND schemaname = 'public';

-- Check current policies on each table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('profiles', 'cases', 'inspections', 'inspection_items', 'photos')
  AND schemaname = 'public'
ORDER BY tablename, policyname;

-- Check if there are any triggers or functions that might cause recursion
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('profiles', 'cases', 'inspections', 'inspection_items', 'photos')
  AND trigger_schema = 'public';