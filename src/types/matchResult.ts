export type EligibilityStatus = "Eligible" | "Potentially Eligible" | "Not Eligible";

export interface MatchResult {
  schemeId: string;
  schemeName: string;
  status: EligibilityStatus;
  score: number;
  matchedConditions: string[];
  failedConditions: string[];
  /** Conditions that could not be verified (leading to "Potentially Eligible"). */
  uncertainConditions: string[];
}

