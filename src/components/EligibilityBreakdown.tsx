import { Check, X, AlertCircle } from 'lucide-react';

interface EligibilityBreakdownProps {
  matchedConditions: string[];
  failedConditions: string[];
  uncertainConditions?: string[];
}

export default function EligibilityBreakdown({
  matchedConditions,
  failedConditions,
  uncertainConditions = [],
}: EligibilityBreakdownProps) {
  return (
    <div className="space-y-2 mt-3 text-sm">
      {matchedConditions.length > 0 && (
        <ul className="space-y-1.5">
          {matchedConditions.map((condition, idx) => (
            <li key={`match-${idx}`} className="flex items-start gap-2 text-neutral-800">
              <span className="h-4 w-4 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="h-2.5 w-2.5" />
              </span>
              <span>{condition}</span>
            </li>
          ))}
        </ul>
      )}
      {uncertainConditions.length > 0 && (
        <ul className="space-y-1.5 mt-2">
          {uncertainConditions.map((condition, idx) => (
            <li key={`uncertain-${idx}`} className="flex items-start gap-2 text-neutral-600">
              <span className="h-4 w-4 rounded-full bg-neutral-200 text-neutral-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertCircle className="h-3 w-3" />
              </span>
              <span>{condition}</span>
            </li>
          ))}
        </ul>
      )}
      {failedConditions.length > 0 && (
        <ul className="space-y-1.5 mt-2">
          {failedConditions.map((condition, idx) => (
            <li key={`fail-${idx}`} className="flex items-start gap-2 text-neutral-500">
              <span className="h-4 w-4 rounded-full border border-neutral-300 bg-neutral-100 text-neutral-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <X className="h-2.5 w-2.5" />
              </span>
              <span>{condition}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
