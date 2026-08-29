import type { BusinessType, Category } from "./userProfile";

export interface SchemeEligibility {
  /** Eligible social categories. Empty array or ["ALL"] means all categories. */
  categories: (Category | "ALL")[];
  /** Minimum age for eligibility. */
  minAge: number;
  /** Maximum age for eligibility. */
  maxAge: number;
  /** Maximum annual income (INR) for eligibility. null = no limit. */
  maxAnnualIncome: number | null;
  /** Eligible business types. Empty array or ["ALL"] means all types. */
  businessTypes: (BusinessType | "ALL")[];
  /** Eligible states. ["ALL"] means all states. */
  states: string[];
  /** Eligible genders. ["ALL"] means all genders. */
  genders: ("Male" | "Female" | "Other" | "ALL")[];
  /** Whether new businesses are eligible. */
  newBusinessAllowed: boolean;
  /** Whether existing businesses are eligible. */
  existingBusinessAllowed: boolean;
  /** Maximum project/loan amount (INR). null = no limit. */
  maxProjectCost: number | null;
}

export interface Scheme {
  id: string;
  name: string;
  ministry: string;
  shortDescription: string;
  description: string;
  targetBeneficiaries: string;
  eligibility: SchemeEligibility;
  benefits: string[];
  maximumLoanAmount: number;
  interestRate: string;
  repaymentTenure: string;
  documents: string[];
  applicationProcess: string[];
  stateCoverage: string;
  sourceUrl: string;
  lastUpdated: string;
}

