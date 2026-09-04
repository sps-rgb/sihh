# Supabase Database Setup Guide

This guide explains how to set up and populate the Supabase database for the Udhyog-Setu scheme matching platform.

## Prerequisites

1. **Supabase Account**: Create one at [supabase.com](https://supabase.com)
2. **Project Created**: You should have a Supabase project with:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

These should already be configured in your Netlify environment variables.

## Step 1: Run the Migration

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `supabase/migrations/001_create_schemes_table.sql`
5. Paste it into the query editor
6. Click **Run**

### Option B: Using Supabase CLI

```bash
npm install -g supabase

# Link your project (you'll need your project ID and API key)
supabase link

# Run migrations
supabase migration up
```

## Step 2: Populate the Database

After creating the table, you need to insert the schemes data. Use one of these methods:

### Option A: Insert via SQL (Easy)

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy and run this query to insert schemes:

```sql
-- Insert all demo schemes into the database
INSERT INTO public.schemes (id, name, ministry, short_description, description, target_beneficiaries, eligibility, benefits, maximum_loan_amount, interest_rate, repayment_tenure, documents, application_process, state_coverage, source_url, last_updated) VALUES
  ('DEMO-SC-001', 'Community Enterprise Growth Scheme', 'Demo Ministry of Social Justice (Fictional)', 'Financial assistance for SC/ST entrepreneurs in manufacturing, service, and food sectors.', 'This DEMO scheme provides subsidized loans and mentorship support to entrepreneurs from Scheduled Caste and Scheduled Tribe communities who wish to start or grow businesses...', 'SC/ST entrepreneurs aged 18–60 with annual family income up to ₹5 lakh', '{"categories":["SC","ST"],"minAge":18,"maxAge":60,"maxAnnualIncome":500000,"businessTypes":["Manufacturing","Service","Food"],"states":["ALL"],"genders":["ALL"],"newBusinessAllowed":true,"existingBusinessAllowed":true,"maxProjectCost":1000000}'::jsonb, ARRAY['Loan up to ₹10 lakh at subsidized interest rate','Margin money assistance of 25%','Skill development training','Mentorship from established entrepreneurs','3-month moratorium on EMI payments'], 1000000, '5% per annum (subsidized)', '7 years including 3-month moratorium', ARRAY['Aadhaar Card','Caste Certificate (SC/ST)','Income Certificate','Business Plan / Project Report','Bank Account Details','Address Proof','2 Passport-size Photographs'], ARRAY['Visit the nearest District Industries Centre (DIC)','Fill out the application form with required documents','Submit the business plan / project report','Application is reviewed by the district committee','Approved applicants receive loan disbursement within 45 days'], 'All States and Union Territories', 'https://demo-example.gov.in/community-enterprise (FICTIONAL URL)', '2024-01-15'::timestamp with time zone);
```

### Option B: Programmatic Insert (Via Application)

Create a new file `scripts/seedDatabase.ts`:

```typescript
import { supabase } from '@/lib/supabase';
import schemeData from '@/src/data/schemes.json';

async function seedDatabase() {
  const schemes = schemeData.schemes;

  for (const scheme of schemes) {
    const { error } = await supabase
      .from('schemes')
      .insert([
        {
          id: scheme.id,
          name: scheme.name,
          ministry: scheme.ministry,
          short_description: scheme.shortDescription,
          description: scheme.description,
          target_beneficiaries: scheme.targetBeneficiaries,
          eligibility: scheme.eligibility,
          benefits: scheme.benefits,
          maximum_loan_amount: scheme.maximumLoanAmount,
          interest_rate: scheme.interestRate,
          repayment_tenure: scheme.repaymentTenure,
          documents: scheme.documents,
          application_process: scheme.applicationProcess,
          state_coverage: scheme.stateCoverage,
          source_url: scheme.sourceUrl,
          last_updated: new Date(scheme.lastUpdated),
        }
      ]);

    if (error) {
      console.error(`Error inserting scheme ${scheme.id}:`, error);
    } else {
      console.log(`✅ Inserted scheme: ${scheme.id}`);
    }
  }

  console.log('✅ Database seeding complete!');
}

// Run it
seedDatabase().catch(console.error);
```

Run with:
```bash
npx ts-node scripts/seedDatabase.ts
```

## Step 3: Verify Your Setup

### Check if data is in Supabase:

1. Go to **Table Editor** in Supabase dashboard
2. Click on **schemes** table
3. You should see all 10 demo schemes listed

### Test the application:

1. Run your app locally:
   ```bash
   npm run dev
   ```

2. The app will now:
   - Fetch schemes from Supabase
   - Fall back to mock data if Supabase is unavailable
   - Cache results to reduce database queries

## Environment Variables

Make sure these are set in both your local `.env.local` and Netlify environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://enmqwjldwpwrvdvhjqjq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Adding More Schemes

To add new schemes to the database:

1. **Via Dashboard**: Go to Supabase → Table Editor → Click **Insert row**
2. **Via SQL**: Use an INSERT statement
3. **Via Code**: Modify `src/data/schemes.json` and re-run the seed script

## Troubleshooting

### "Permission denied" error
- Check RLS policies in Supabase: **Authentication → Policies**
- Ensure the `allow_public_read_schemes` policy is enabled

### "Table does not exist"
- Run the migration again (Step 1)
- Make sure you're in the correct Supabase project

### Data not showing in app
- Check the browser console for errors
- Verify environment variables are correct
- Clear browser cache and rebuild: `npm run build`

## Security Considerations

- **NEXT_PUBLIC_SUPABASE_ANON_KEY** is exposed in the browser (intentional - it's anon key)
- Schemes are read-only for public users
- For admin operations, create a service role key (never expose in browser)

## Future Enhancements

- [ ] Add admin panel to manage schemes
- [ ] Set up real-time subscriptions for scheme updates
- [ ] Add authentication for user profile saving
- [ ] Create API routes for server-side operations
