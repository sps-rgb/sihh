import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Scheme, SchemeEligibility, Category, BusinessType } from '@/types';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://enmqwjldwpwrvdvhjqjq.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVubXF3amxkd3B3cnZkdmhqcWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxODIzNTAsImV4cCI6MjEwMzc1ODM1MH0.grKRs_cEpY9StENl9YogVKPSS3Pd8w9IQReQSc39TiU';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseSchemeEligibilityRow {
  id?: string;
  scheme_id?: string;
  min_age?: number;
  max_age?: number;
  allowed_genders?: string[];
  allowed_states?: string[];
  allowed_social_categories?: string[];
  allowed_business_sectors?: string[];
  min_investment?: number;
  max_investment?: number;
  min_annual_turnover?: number;
  max_annual_turnover?: number;
  is_rural_only?: boolean;
  is_urban_only?: boolean;
}

export interface SupabaseSchemeRow {
  id: string;
  name: string;
  ministry?: string;
  category_type?: string;
  short_description?: string;
  detailed_description?: string;
  max_loan_amount?: number;
  subsidy_percentage?: number;
  interest_rate_subsidy?: number;
  official_portal_url?: string;
  nodal_agency?: string;
  documents_required?: string[];
  created_at?: string;
  updated_at?: string;
  scheme_eligibility?: SupabaseSchemeEligibilityRow | SupabaseSchemeEligibilityRow[];
}

/**
 * Transforms a Supabase database row (with joined scheme_eligibility) into the unified Scheme domain model.
 */
export function mapSupabaseSchemeToScheme(row: SupabaseSchemeRow): Scheme {
  const el: SupabaseSchemeEligibilityRow = Array.isArray(row.scheme_eligibility)
    ? row.scheme_eligibility[0] || {}
    : row.scheme_eligibility || {};

  // Normalize categories
  const rawCategories = el.allowed_social_categories || ['All'];
  const categories: (Category | 'ALL')[] = rawCategories.map((c) => {
    if (c.toLowerCase() === 'all') return 'ALL';
    return c as Category;
  });

  // Normalize genders
  const rawGenders = el.allowed_genders || ['All'];
  const genders: ('Male' | 'Female' | 'Other' | 'ALL')[] = rawGenders.map((g) => {
    if (g.toLowerCase() === 'all') return 'ALL';
    return g as 'Male' | 'Female' | 'Other';
  });

  // Normalize states
  const rawStates = el.allowed_states || ['All'];
  const states = rawStates.map((s) => {
    if (s.toLowerCase() === 'all') return 'ALL';
    return s;
  });

  // Normalize business types/sectors
  const rawBusinessTypes = el.allowed_business_sectors || ['All'];
  const businessTypes: (BusinessType | 'ALL')[] = rawBusinessTypes.map((b) => {
    if (b.toLowerCase() === 'all') return 'ALL';
    return b as BusinessType;
  });

  // Construct key benefits array
  const benefits: string[] = [];
  if (row.max_loan_amount && row.max_loan_amount > 0) {
    benefits.push(`Financial assistance / loan up to ₹${Number(row.max_loan_amount).toLocaleString('en-IN')}`);
  }
  if (row.subsidy_percentage && row.subsidy_percentage > 0) {
    benefits.push(`Capital subsidy of ${row.subsidy_percentage}% on eligible project cost`);
  }
  if (row.interest_rate_subsidy && row.interest_rate_subsidy > 0) {
    benefits.push(`Interest rate subvention / subsidy of ${row.interest_rate_subsidy}% per annum`);
  }
  if (row.category_type) {
    benefits.push(`Category assistance type: ${row.category_type}`);
  }
  if (row.nodal_agency) {
    benefits.push(`Implementing & nodal agency: ${row.nodal_agency}`);
  }

  // Construct target beneficiaries summary text
  const targetCategoryText = categories.includes('ALL') ? 'All eligible' : categories.join(', ');
  const targetSectorText = businessTypes.includes('ALL') ? 'all sectors' : businessTypes.join(', ');
  const targetBeneficiaries = `${targetCategoryText} entrepreneurs aged ${el.min_age || 18}–${el.max_age || 70} in ${targetSectorText}`;

  // Structured application steps
  const applicationProcess = [
    row.official_portal_url
      ? `Visit the official portal at ${row.official_portal_url}`
      : 'Visit the implementing agency official portal or nearest DIC office',
    row.nodal_agency
      ? `Apply through ${row.nodal_agency} or partner financial institutions`
      : 'Apply via designated nodal portal or partner commercial/rural banks',
    'Submit required KYC (Aadhaar/PAN), business proposal/DPR, and statutory registrations',
    'Application verification, screening, and credit/subsidy disbursement',
  ];

  const eligibility: SchemeEligibility = {
    categories,
    minAge: el.min_age ?? 18,
    maxAge: el.max_age ?? 70,
    maxAnnualIncome: el.max_annual_turnover ?? null,
    businessTypes,
    states,
    genders,
    newBusinessAllowed: true,
    existingBusinessAllowed: true,
    maxProjectCost: el.max_investment ?? row.max_loan_amount ?? null,
  };

  const interestRate = row.interest_rate_subsidy && row.interest_rate_subsidy > 0
    ? `${row.interest_rate_subsidy}% Interest Subvention`
    : 'Concessional / Bank Rates';

  return {
    id: row.id,
    name: row.name,
    ministry: row.ministry || 'Government of India',
    shortDescription: row.short_description || '',
    description: row.detailed_description || row.short_description || '',
    targetBeneficiaries,
    eligibility,
    benefits: benefits.length > 0 ? benefits : ['Financial assistance as per scheme guidelines'],
    maximumLoanAmount: row.max_loan_amount ?? 0,
    interestRate,
    repaymentTenure: '3 to 7 years (as per lending institution guidelines)',
    documents:
      Array.isArray(row.documents_required) && row.documents_required.length > 0
        ? row.documents_required
        : ['Aadhaar Card', 'PAN Card', 'Bank Account details', 'Detailed Project Report (DPR)'],
    applicationProcess,
    stateCoverage: states.includes('ALL') ? 'All States and Union Territories' : states.join(', '),
    sourceUrl: row.official_portal_url || '',
    lastUpdated: row.updated_at
      ? row.updated_at.split('T')[0]
      : row.created_at
      ? row.created_at.split('T')[0]
      : '2026-09-01',
  };
}

/**
 * Fetches all schemes with their associated eligibility data from Supabase.
 */
export async function fetchSupabaseSchemes(): Promise<Scheme[] | null> {
  try {
    const { data, error } = await supabase
      .from('schemes')
      .select(`
        *,
        scheme_eligibility (*)
      `)
      .order('id', { ascending: true });

    if (error) {
      console.error('[Supabase] Error fetching schemes:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return (data as SupabaseSchemeRow[]).map(mapSupabaseSchemeToScheme);
  } catch (err) {
    console.error('[Supabase] Exception querying schemes:', err);
    return null;
  }
}

/**
 * Fetches a single scheme by ID from Supabase.
 */
export async function fetchSupabaseSchemeById(id: string): Promise<Scheme | null> {
  try {
    const { data, error } = await supabase
      .from('schemes')
      .select(`
        *,
        scheme_eligibility (*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return mapSupabaseSchemeToScheme(data as SupabaseSchemeRow);
  } catch (err) {
    console.error(`[Supabase] Exception querying scheme ${id}:`, err);
    return null;
  }
}

