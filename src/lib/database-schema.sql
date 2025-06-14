-- Database Schema for Seamless Restoration App

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'inspector' CHECK (role IN ('admin', 'manager', 'inspector')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Cases table
CREATE TABLE public.cases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_number TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  property_address TEXT NOT NULL,
  property_city TEXT NOT NULL,
  property_state TEXT NOT NULL,
  property_zip TEXT NOT NULL,
  loss_date DATE,
  loss_type TEXT,
  insurance_company TEXT,
  claim_number TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inspections table
CREATE TABLE public.inspections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  inspector_id UUID REFERENCES public.profiles(id),
  inspection_date DATE NOT NULL,
  inspection_type TEXT NOT NULL CHECK (inspection_type IN ('initial', 'follow-up', 'final')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'submitted')),
  
  -- Location and access
  location_details TEXT,
  access_notes TEXT,
  
  -- Environmental conditions
  temperature DECIMAL,
  humidity DECIMAL,
  weather_conditions TEXT,
  
  -- General notes
  general_notes TEXT,
  recommendations TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE
);

-- Inspection items table (for detailed damage assessment)
CREATE TABLE public.inspection_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  inspection_id UUID REFERENCES public.inspections(id) ON DELETE CASCADE,
  
  -- Item details
  item_category TEXT NOT NULL, -- e.g., 'flooring', 'walls', 'ceiling', 'contents'
  item_type TEXT NOT NULL, -- e.g., 'hardwood', 'carpet', 'drywall'
  item_description TEXT,
  room_location TEXT NOT NULL,
  
  -- Damage assessment
  damage_type TEXT, -- e.g., 'water', 'fire', 'mold', 'structural'
  damage_severity TEXT CHECK (damage_severity IN ('minor', 'moderate', 'severe', 'total_loss')),
  damage_description TEXT,
  
  -- Measurements
  length DECIMAL,
  width DECIMAL,
  height DECIMAL,
  area DECIMAL,
  unit_of_measure TEXT DEFAULT 'sq_ft',
  
  -- Recommendations
  repair_recommendation TEXT,
  replacement_needed BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photos table
CREATE TABLE public.photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  inspection_id UUID REFERENCES public.inspections(id) ON DELETE CASCADE,
  inspection_item_id UUID REFERENCES public.inspection_items(id) ON DELETE CASCADE,
  
  -- File details
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_size INTEGER,
  mime_type TEXT,
  
  -- Photo metadata
  caption TEXT,
  photo_type TEXT, -- e.g., 'overview', 'detail', 'before', 'after'
  
  -- Location data (if available)
  gps_latitude DECIMAL,
  gps_longitude DECIMAL,
  
  -- Timestamps
  taken_at TIMESTAMP WITH TIME ZONE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity log table (for audit trail)
CREATE TABLE public.activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL, -- e.g., 'inspection', 'case', 'photo'
  resource_id UUID NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_cases_case_number ON public.cases(case_number);
CREATE INDEX idx_cases_created_by ON public.cases(created_by);
CREATE INDEX idx_inspections_case_id ON public.inspections(case_id);
CREATE INDEX idx_inspections_inspector_id ON public.inspections(inspector_id);
CREATE INDEX idx_inspections_status ON public.inspections(status);
CREATE INDEX idx_inspection_items_inspection_id ON public.inspection_items(inspection_id);
CREATE INDEX idx_photos_inspection_id ON public.photos(inspection_id);
CREATE INDEX idx_photos_inspection_item_id ON public.photos(inspection_item_id);
CREATE INDEX idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX idx_activity_log_resource ON public.activity_log(resource_type, resource_id);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Cases policies
CREATE POLICY "Users can view cases they created or are assigned to" ON public.cases
  FOR SELECT USING (
    created_by = auth.uid() OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "Inspectors can view assigned cases" ON public.cases
  FOR SELECT USING (
    id IN (
      SELECT DISTINCT case_id FROM public.inspections WHERE inspector_id = auth.uid()
    )
  );

CREATE POLICY "Users can create cases" ON public.cases
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Case creators and admins can update cases" ON public.cases
  FOR UPDATE USING (
    created_by = auth.uid() OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- Inspections policies
CREATE POLICY "Users can view their own inspections" ON public.inspections
  FOR SELECT USING (
    inspector_id = auth.uid() OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "Case creators can view inspections for their cases" ON public.inspections
  FOR SELECT USING (
    case_id IN (
      SELECT id FROM public.cases WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Inspectors can create inspections" ON public.inspections
  FOR INSERT WITH CHECK (inspector_id = auth.uid());

CREATE POLICY "Inspectors can update their own inspections" ON public.inspections
  FOR UPDATE USING (
    inspector_id = auth.uid() OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- Inspection items policies
CREATE POLICY "Users can view items for their inspections" ON public.inspection_items
  FOR SELECT USING (
    inspection_id IN (
      SELECT id FROM public.inspections WHERE inspector_id = auth.uid()
    ) OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "Case creators can view items for their case inspections" ON public.inspection_items
  FOR SELECT USING (
    inspection_id IN (
      SELECT i.id FROM public.inspections i
      JOIN public.cases c ON i.case_id = c.id
      WHERE c.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage items for their inspections" ON public.inspection_items
  FOR ALL USING (
    inspection_id IN (
      SELECT id FROM public.inspections WHERE inspector_id = auth.uid()
    ) OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- Photos policies
CREATE POLICY "Users can view photos for their inspections" ON public.photos
  FOR SELECT USING (
    inspection_id IN (
      SELECT id FROM public.inspections WHERE inspector_id = auth.uid()
    ) OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "Case creators can view photos for their case inspections" ON public.photos
  FOR SELECT USING (
    inspection_id IN (
      SELECT i.id FROM public.inspections i
      JOIN public.cases c ON i.case_id = c.id
      WHERE c.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage photos for their inspections" ON public.photos
  FOR ALL USING (
    inspection_id IN (
      SELECT id FROM public.inspections WHERE inspector_id = auth.uid()
    ) OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- Activity log policies
CREATE POLICY "Users can view their own activity" ON public.activity_log
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all activity" ON public.activity_log
  FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_cases
  BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_inspections
  BEFORE UPDATE ON public.inspections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_inspection_items
  BEFORE UPDATE ON public.inspection_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('inspection-photos', 'inspection-photos', false);

-- Storage policies
CREATE POLICY "Users can view photos for their inspections" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'inspection-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload photos for their inspections" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'inspection-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'inspection-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );