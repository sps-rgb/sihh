# SchemeMatch — AI-Driven Scheme Matching for Marginalized Entrepreneurs

> ⚠️ **Demo Version**: All scheme data in this prototype is fictional/mock data created for demonstration purposes. Do NOT treat these as real government schemes. Always verify eligibility with official government sources.

## Overview
SchemeMatch is a comprehensive AI-driven platform built for SIH Problem Statement 26092. It simplifies the discovery and matching process of government schemes for marginalized entrepreneurs. By utilizing a multi-step user profiling form, SchemeMatch cross-references demographic data, business intentions, and economic background with complex government scheme requirements, surfacing the most applicable opportunities with full transparency.

## Features
- **Smart scheme matching with transparent scoring:** Explains exactly why a user matches, potentially matches, or doesn't match.
- **Multi-step profile form:** Easy-to-use, accessible questionnaire for data intake.
- **Detailed scheme information:** Clean presentation of scheme benefits, eligibility criteria, and documentation.
- **AI-powered scheme assistant:** A deterministic chatbot to help clarify doubts and provide immediate guidance.
- **Natural language input (experimental):** Ability to fill profile details via conversational text.
- **Mobile responsive design:** Accessible fully across devices, prioritizing users on low-end smartphones.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Vitest

## Getting Started

### Prerequisites
- Node.js 18+
- npm (or pnpm/yarn)

### Installation
```bash
npm install
```

### Running the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Running Tests
```bash
npm test
```

## Project Structure
```text
src/
├── app/                  # Next.js App Router pages and layouts
├── components/           # Reusable UI components (buttons, forms, cards)
├── data/                 # Mock database and static data (schemes.json)
├── services/             # Core business logic
│   ├── matchingEngine.ts # The rule engine for scheme matching
│   ├── chatbotService.ts # Chatbot logic
│   └── schemeService.ts  # Data fetching/abstraction layer
├── types/                # TypeScript interface definitions (index.ts barrel)
├── utils/                # Helper functions
└── __tests__/            # Vitest unit tests (matchingEngine.test.ts)
```

## How the Matching Algorithm Works
The matching engine (`src/services/matchingEngine.ts`) iterates over all available schemes and evaluates a `UserProfile` against each scheme's `SchemeEligibility`.

1. **Mandatory vs Soft Conditions:** Certain criteria (like Age, State, Gender, Category) are typically treated as hard mandatory checks. Business type, existing loan status, and specific income caps may be treated as soft or secondary checks depending on the scheme configuration.
2. **Scoring System:** Each matched condition adds to a total scheme match score.
3. **Status Classification:** 
   - `Eligible`: Passes all mandatory conditions and primary constraints.
   - `Potentially Eligible`: Passes mandatory demographic conditions but may slightly exceed financial or project cost thresholds, or is missing secondary details.
   - `Not Eligible`: Fails hard mandatory checks (e.g., wrong gender for a women-only scheme, completely outside the age bracket).

## How to Modify/Add Schemes
Schemes are currently sourced from `src/data/schemes.json`. To add a new scheme:
1. Open `src/data/schemes.json`.
2. Add a new object adhering to the `Scheme` interface defined in `src/types/scheme.ts`.
3. Ensure the `eligibility` object maps correctly to the allowed enums for categories, business types, etc.

## Replacing Mock Data with Real Government Data
To transition this prototype into a production app:
1. **Remove `schemes.json`**: Replace the static import in `src/services/schemeService.ts`.
2. **Database/API Integration**: Modify `schemeService.ts` to fetch from a PostgreSQL database (e.g., via Prisma/Drizzle) or an external API.
3. **Connect to myScheme / API Setu**: Map external API schemas to the internal `Scheme` and `SchemeEligibility` models using adapter functions.
4. **Refine Eligibility Rules**: Adjust the matching engine to handle the complexity and nuance of real API parameters.

## Configuring an LLM API
To replace the current deterministic chatbot with a generative AI approach:
1. **API Keys**: Add `OPENAI_API_KEY` or `GEMINI_API_KEY` to your `.env.local` file.
2. **Update Service**: Modify `src/services/chatbotService.ts` to forward user queries to the LLM.
3. **Implement RAG**: Feed the contents of `schemes.json` (or real database records) as context to the LLM to ground its answers using Retrieval-Augmented Generation.

## Future Roadmap
- Real government scheme data integration (API Setu / myScheme)
- PostgreSQL database integration for user progress saving
- User authentication (NextAuth/Auth.js)
- Multilingual support (i18n) for regional accessibility
- RAG-based AI assistant for personalized deep-dives
- Interactive Document checklist generator
- Direct application tracking dashboard

## License
MIT
