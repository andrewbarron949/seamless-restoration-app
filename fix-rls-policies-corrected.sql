-- CORRECTED Fix for infinite recursion in RLS policies
-- This version eliminates circular dependencies using a security definer function

-- First, create a security definer function to safely get user role without RLS interference
CREATE OR REPLACE FUNCTION auth.get_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$;

-- Drop all existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view cases they created or are assigned to" ON public.cases;
DROP POLICY IF EXISTS "Case creators and admins can update cases" ON public.cases;
DROP POLICY IF EXISTS "Users can create cases" ON public.cases;
DROP POLICY IF EXISTS "Users can view their own inspections" ON public.inspections;
DROP POLICY IF EXISTS "Inspectors can update their own inspections" ON public.inspections;
DROP POLICY IF EXISTS "Users can create inspections" ON public.inspections;
DROP POLICY IF EXISTS "Users can view details for their inspections" ON public.inspection_details;
DROP POLICY IF EXISTS "Users can manage details for their inspections" ON public.inspection_details;
DROP POLICY IF EXISTS "Users can view photos for their inspections" ON public.inspection_photos;
DROP POLICY IF EXISTS "Users can manage photos for their inspections" ON public.inspection_photos;

-- USER_PROFILES table policies (using the security definer function)
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.user_profiles  
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (auth.get_user_role() = 'admin');

-- CASES table policies
CREATE POLICY "Users can view cases they created or are assigned to" ON public.cases
  FOR SELECT USING (
    created_by = auth.uid() OR
    auth.get_user_role() IN ('admin', 'manager')
  );

CREATE POLICY "Case creators and admins can update cases" ON public.cases
  FOR UPDATE USING (
    created_by = auth.uid() OR
    auth.get_user_role() IN ('admin', 'manager')
  );

CREATE POLICY "Users can create cases" ON public.cases
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- INSPECTIONS table policies  
CREATE POLICY "Users can view their own inspections" ON public.inspections
  FOR SELECT USING (
    inspector_id = auth.uid() OR
    auth.get_user_role() IN ('admin', 'manager')
  );

CREATE POLICY "Inspectors can update their own inspections" ON public.inspections
  FOR UPDATE USING (
    inspector_id = auth.uid() OR
    auth.get_user_role() IN ('admin', 'manager')
  );

CREATE POLICY "Users can create inspections" ON public.inspections
  FOR INSERT WITH CHECK (inspector_id = auth.uid());

-- INSPECTION_DETAILS table policies
CREATE POLICY "Users can view details for their inspections" ON public.inspection_details
  FOR SELECT USING (
    inspection_id IN (
      SELECT id FROM public.inspections WHERE inspector_id = auth.uid()
    ) OR
    auth.get_user_role() IN ('admin', 'manager')
  );

CREATE POLICY "Users can manage details for their inspections" ON public.inspection_details
  FOR ALL USING (
    inspection_id IN (
      SELECT id FROM public.inspections WHERE inspector_id = auth.uid()
    ) OR
    auth.get_user_role() IN ('admin', 'manager')
  );

-- INSPECTION_PHOTOS table policies
CREATE POLICY "Users can view photos for their inspections" ON public.inspection_photos
  FOR SELECT USING (
    inspection_id IN (
      SELECT id FROM public.inspections WHERE inspector_id = auth.uid()
    ) OR
    auth.get_user_role() IN ('admin', 'manager')
  );

CREATE POLICY "Users can manage photos for their inspections" ON public.inspection_photos
  FOR ALL USING (
    inspection_id IN (
      SELECT id FROM public.inspections WHERE inspector_id = auth.uid()
    ) OR
    auth.get_user_role() IN ('admin', 'manager')
  );