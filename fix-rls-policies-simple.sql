-- SIMPLE Fix for infinite recursion in RLS policies
-- This version avoids circular dependencies by using direct auth.uid() checks where possible

-- Drop all existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
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

-- USER_PROFILES table policies - CRITICAL: No role-based policies on this table to avoid recursion
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.user_profiles  
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- CASES table policies - Using simple auth.uid() checks only
CREATE POLICY "Users can view cases they created" ON public.cases
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can update cases they created" ON public.cases
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can create cases" ON public.cases
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- INSPECTIONS table policies - Using simple auth.uid() checks only
CREATE POLICY "Users can view their own inspections" ON public.inspections
  FOR SELECT USING (inspector_id = auth.uid());

CREATE POLICY "Users can update their own inspections" ON public.inspections
  FOR UPDATE USING (inspector_id = auth.uid());

CREATE POLICY "Users can create inspections" ON public.inspections
  FOR INSERT WITH CHECK (inspector_id = auth.uid());

-- INSPECTION_DETAILS table policies
CREATE POLICY "Users can view details for their inspections" ON public.inspection_details
  FOR SELECT USING (
    inspection_id IN (
      SELECT id FROM public.inspections WHERE inspector_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage details for their inspections" ON public.inspection_details
  FOR ALL USING (
    inspection_id IN (
      SELECT id FROM public.inspections WHERE inspector_id = auth.uid()
    )
  );

-- INSPECTION_PHOTOS table policies
CREATE POLICY "Users can view photos for their inspections" ON public.inspection_photos
  FOR SELECT USING (
    inspection_id IN (
      SELECT id FROM public.inspections WHERE inspector_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage photos for their inspections" ON public.inspection_photos
  FOR ALL USING (
    inspection_id IN (
      SELECT id FROM public.inspections WHERE inspector_id = auth.uid()
    )
  );

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_photos ENABLE ROW LEVEL SECURITY;