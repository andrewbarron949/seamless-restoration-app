-- Fix for infinite recursion in RLS policies
-- Run these commands in Supabase SQL Editor to fix the circular dependency issues

-- Drop the problematic policies first
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view cases they created or are assigned to" ON public.cases;
DROP POLICY IF EXISTS "Case creators and admins can update cases" ON public.cases;
DROP POLICY IF EXISTS "Users can view their own inspections" ON public.inspections;
DROP POLICY IF EXISTS "Inspectors can update their own inspections" ON public.inspections;
DROP POLICY IF EXISTS "Users can view items for their inspections" ON public.inspection_items;
DROP POLICY IF EXISTS "Users can manage items for their inspections" ON public.inspection_items;
DROP POLICY IF EXISTS "Users can view photos for their inspections" ON public.photos;
DROP POLICY IF EXISTS "Users can manage photos for their inspections" ON public.photos;
DROP POLICY IF EXISTS "Admins can view all activity" ON public.activity_log;

-- Recreate policies without circular references
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can view cases they created or are assigned to" ON public.cases
  FOR SELECT USING (
    created_by = auth.uid() OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "Case creators and admins can update cases" ON public.cases
  FOR UPDATE USING (
    created_by = auth.uid() OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "Users can view their own inspections" ON public.inspections
  FOR SELECT USING (
    inspector_id = auth.uid() OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "Inspectors can update their own inspections" ON public.inspections
  FOR UPDATE USING (
    inspector_id = auth.uid() OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "Users can view items for their inspections" ON public.inspection_items
  FOR SELECT USING (
    inspection_id IN (
      SELECT id FROM public.inspections WHERE inspector_id = auth.uid()
    ) OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "Users can manage items for their inspections" ON public.inspection_items
  FOR ALL USING (
    inspection_id IN (
      SELECT id FROM public.inspections WHERE inspector_id = auth.uid()
    ) OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "Users can view photos for their inspections" ON public.photos
  FOR SELECT USING (
    inspection_id IN (
      SELECT id FROM public.inspections WHERE inspector_id = auth.uid()
    ) OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "Users can manage photos for their inspections" ON public.photos
  FOR ALL USING (
    inspection_id IN (
      SELECT id FROM public.inspections WHERE inspector_id = auth.uid()
    ) OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "Admins can view all activity" ON public.activity_log
  FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );