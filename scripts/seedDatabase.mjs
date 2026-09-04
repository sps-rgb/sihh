import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://enmqwjldwpwrvdvhjqjq.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVubXF3amxkd3B3cnZkdmhqcWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxODIzNTAsImV4cCI6MjEwMzc1ODM1MH0.grKRs_cEpY9StENl9YogVKPSS3Pd8w9IQReQSc39TiU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function syncAndVerifyDatabase() {
  console.log('🔄 Checking Supabase connection and schemes data...');

  const { data: schemes, error: schemesError } = await supabase
    .from('schemes')
    .select(`
      *,
      scheme_eligibility (*)
    `);

  if (schemesError) {
    console.error('❌ Supabase error:', schemesError.message);
    process.exit(1);
  }

  console.log(`✅ Supabase connected successfully! Found ${schemes?.length || 0} active schemes:`);
  schemes?.forEach((s, idx) => {
    const el = Array.isArray(s.scheme_eligibility) ? s.scheme_eligibility[0] : s.scheme_eligibility;
    console.log(`  ${idx + 1}. [${s.id}] ${s.name} - Max Loan: ₹${s.max_loan_amount?.toLocaleString('en-IN')} (${s.category_type || 'Scheme'})`);
  });

  console.log('\n✅ Database verification complete. Repository is connected to Supabase.');
}

syncAndVerifyDatabase().catch((err) => {
  console.error('Fatal error verifying database:', err);
  process.exit(1);
});

