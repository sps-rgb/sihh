-- Create schemes table
CREATE TABLE IF NOT EXISTS public.schemes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  ministry TEXT,
  category_type TEXT,
  short_description TEXT,
  detailed_description TEXT,
  max_loan_amount NUMERIC,
  subsidy_percentage NUMERIC DEFAULT 0,
  interest_rate_subsidy NUMERIC DEFAULT 0,
  official_portal_url TEXT,
  nodal_agency TEXT,
  documents_required TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create scheme_eligibility table
CREATE TABLE IF NOT EXISTS public.scheme_eligibility (
  id TEXT PRIMARY KEY,
  scheme_id TEXT NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE,
  min_age INTEGER DEFAULT 18,
  max_age INTEGER DEFAULT 70,
  allowed_genders TEXT[] DEFAULT '{"All"}',
  allowed_states TEXT[] DEFAULT '{"All"}',
  allowed_social_categories TEXT[] DEFAULT '{"All"}',
  allowed_business_sectors TEXT[] DEFAULT '{"All"}',
  min_investment NUMERIC DEFAULT 0,
  max_investment NUMERIC,
  min_annual_turnover NUMERIC DEFAULT 0,
  max_annual_turnover NUMERIC,
  is_rural_only BOOLEAN DEFAULT FALSE,
  is_urban_only BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheme_eligibility ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on schemes"
  ON public.schemes
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access on scheme_eligibility"
  ON public.scheme_eligibility
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Indexes for fast query and join performance
CREATE INDEX IF NOT EXISTS idx_scheme_eligibility_scheme_id ON public.scheme_eligibility(scheme_id);
CREATE INDEX IF NOT EXISTS idx_schemes_ministry ON public.schemes(ministry);

