-- FINAL CORRECTED RLS POLICIES - Using actual table names from database schema
-- This fixes the infinite recursion by using the correct table names and simple policies

-- ==========================================
-- STEP 1: Drop all existing problematic policies
-- ==========================================

-- Drop policies for PROFILES table (correct name, not user_profiles)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Drop policies for CASES table
DROP POLICY IF EXISTS "Users can view cases they created" ON public.cases;
DROP POLICY IF EXISTS "Users can update cases they created" ON public.cases;
DROP POLICY IF EXISTS "Users can create cases" ON public.cases;
DROP POLICY IF EXISTS "Users can view cases they created or are assigned to" ON public.cases;
DROP POLICY IF EXISTS "Case creators and admins can update cases" ON public.cases;

-- Drop policies for INSPECTIONS table
DROP POLICY IF EXISTS "Users can view their own inspections" ON public.inspections;
DROP POLICY IF EXISTS "Users can update their own inspections" ON public.inspections;
DROP POLICY IF EXISTS "Users can create inspections" ON public.inspections;
DROP POLICY IF EXISTS "Inspectors can update their own inspections" ON public.inspections;

-- Drop policies for INSPECTION_ITEMS table (correct name, not inspection_details)
DROP POLICY IF EXISTS "Users can view items for their inspections" ON public.inspection_items;
DROP POLICY IF EXISTS "Users can manage items for their inspections" ON public.inspection_items;
DROP POLICY IF EXISTS "Users can view details for their inspections" ON public.inspection_items;
DROP POLICY IF EXISTS "Users can manage details for their inspections" ON public.inspection_items;

-- Drop policies for PHOTOS table (correct name, not inspection_photos)
DROP POLICY IF EXISTS "Users can view photos for their inspections" ON public.photos;
DROP POLICY IF EXISTS "Users can manage photos for their inspections" ON public.photos;

-- ==========================================
-- STEP 2: Create simple, direct policies
-- ==========================================

-- PROFILES table policies - No role-based queries to avoid recursion
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- CASES table policies - Simple ownership checks
CREATE POLICY "cases_select_own" ON public.cases
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "cases_update_own" ON public.cases
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "cases_insert_own" ON public.cases
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "cases_delete_own" ON public.cases
  FOR DELETE USING (created_by = auth.uid());

-- INSPECTIONS table policies - Simple ownership checks
CREATE POLICY "inspections_select_own" ON public.inspections
  FOR SELECT USING (inspector_id = auth.uid());

CREATE POLICY "inspections_update_own" ON public.inspections
  FOR UPDATE USING (inspector_id = auth.uid());

CREATE POLICY "inspections_insert_own" ON public.inspections
  FOR INSERT WITH CHECK (inspector_id = auth.uid());

CREATE POLICY "inspections_delete_own" ON public.inspections
  FOR DELETE USING (inspector_id = auth.uid());

-- INSPECTION_ITEMS table policies - Direct ownership through inspection
CREATE POLICY "inspection_items_select" ON public.inspection_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.inspections 
      WHERE inspections.id = inspection_items.inspection_id 
      AND inspections.inspector_id = auth.uid()
    )
  );

CREATE POLICY "inspection_items_insert" ON public.inspection_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.inspections 
      WHERE inspections.id = inspection_items.inspection_id 
      AND inspections.inspector_id = auth.uid()
    )
  );

CREATE POLICY "inspection_items_update" ON public.inspection_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.inspections 
      WHERE inspections.id = inspection_items.inspection_id 
      AND inspections.inspector_id = auth.uid()
    )
  );

CREATE POLICY "inspection_items_delete" ON public.inspection_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.inspections 
      WHERE inspections.id = inspection_items.inspection_id 
      AND inspections.inspector_id = auth.uid()
    )
  );

-- PHOTOS table policies - Direct ownership through inspection
CREATE POLICY "photos_select" ON public.photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.inspections 
      WHERE inspections.id = photos.inspection_id 
      AND inspections.inspector_id = auth.uid()
    )
  );

CREATE POLICY "photos_insert" ON public.photos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.inspections 
      WHERE inspections.id = photos.inspection_id 
      AND inspections.inspector_id = auth.uid()
    )
  );

CREATE POLICY "photos_update" ON public.photos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.inspections 
      WHERE inspections.id = photos.inspection_id 
      AND inspections.inspector_id = auth.uid()
    )
  );

CREATE POLICY "photos_delete" ON public.photos
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.inspections 
      WHERE inspections.id = photos.inspection_id 
      AND inspections.inspector_id = auth.uid()
    )
  );

-- ==========================================
-- STEP 3: Ensure RLS is enabled on all tables
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- VERIFICATION QUERIES (optional - for testing)
-- ==========================================
-- Uncomment these to verify the policies are working:
-- SELECT * FROM public.profiles WHERE id = auth.uid();
-- SELECT * FROM public.cases WHERE created_by = auth.uid();
-- SELECT * FROM public.inspections WHERE inspector_id = auth.uid();