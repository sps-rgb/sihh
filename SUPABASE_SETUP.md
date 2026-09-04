# Supabase Database Integration Guide

This guide explains how the Supabase database is integrated into the Udhyog-Setu scheme matching platform.

## 1. Credentials Configuration

The application connects to the Supabase database using the following environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL="https://enmqwjldwpwrvdvhjqjq.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVubXF3amxkd3B3cnZkdmhqcWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxODIzNTAsImV4cCI6MjEwMzc1ODM1MH0.grKRs_cEpY9StENl9YogVKPSS3Pd8w9IQReQSc39TiU"
```

These are configured in `.env.local` for local development and in Netlify environment variables for deployment.

---

## 2. Database Schema

The database consists of two primary tables linked via foreign key:

### `public.schemes`
- `id` (TEXT, Primary Key): e.g. `pmegp-01`, `mudra-03`, `pm-vishwakarma-02`
- `name` (TEXT): Scheme title
- `ministry` (TEXT): Sponsoring ministry/department
- `category_type` (TEXT): Assistance type (e.g. Subsidy & Loan, Incubation Grant)
- `short_description` (TEXT): Brief overview
- `detailed_description` (TEXT): In-depth scheme description
- `max_loan_amount` (NUMERIC): Maximum loan or grant amount in INR
- `subsidy_percentage` (NUMERIC): Percentage of subsidy offered (0-100)
- `interest_rate_subsidy` (NUMERIC): Subvention percentage
- `official_portal_url` (TEXT): Official government portal URL
- `nodal_agency` (TEXT): Implementing agency
- `documents_required` (TEXT[]): List of required documents
- `created_at` / `updated_at` (TIMESTAMPTZ)

### `public.scheme_eligibility`
- `id` (TEXT, Primary Key)
- `scheme_id` (TEXT, Foreign Key -> schemes.id)
- `min_age` (INTEGER): Minimum applicant age (e.g. 18)
- `max_age` (INTEGER): Maximum applicant age (e.g. 70)
- `allowed_genders` (TEXT[]): e.g. `{"All"}` or `{"Female", "Other"}`
- `allowed_states` (TEXT[]): e.g. `{"All"}` or `{"Delhi", "Uttar Pradesh"}`
- `allowed_social_categories` (TEXT[]): e.g. `{"General", "OBC", "SC", "ST", "Minority"}`
- `allowed_business_sectors` (TEXT[]): e.g. `{"Manufacturing", "Service", "Agritech", "Food Processing"}`
- `min_investment` / `max_investment` (NUMERIC)
- `min_annual_turnover` / `max_annual_turnover` (NUMERIC)
- `is_rural_only` / `is_urban_only` (BOOLEAN)

---

## 3. Application Architecture

1. **Client & Adapter** (`src/lib/supabase.ts`):
   - Initializes Supabase JavaScript client.
   - Converts raw Supabase records and eligibility objects into the application's domain model.

2. **Data Service Layer** (`src/services/schemeService.ts`):
   - `getAllSchemes()`: Asynchronously fetches live schemes from Supabase with smart 60s in-memory caching.
   - `getSchemeById(id)`: Fetches detailed scheme record directly.
   - Fallback: Transparently falls back to local data if network connectivity is interrupted.

3. **Matching Engine** (`src/services/matchingEngine.ts`):
   - `matchSchemesAsync(profile)`: Matches user profile against all live Supabase schemes.
   - Evaluates mandatory rules (Age, State, Gender, Category) and soft scoring (Turnover/Income, Project Cost, Business Sector compatibility).

4. **API Endpoints**:
   - `GET /api/schemes` - Lists all available schemes.
   - `GET /api/schemes/[id]` - Details of a specific scheme.
   - `POST /api/match-schemes` - Matches user profile against database schemes.
   - `POST /api/chat` - Chatbot Q&A grounded in live database scheme details.

---

## 4. Verification & Testing

To verify the database connection:
```bash
node scripts/seedDatabase.mjs
```

To run automated tests:
```bash
npm test
```
