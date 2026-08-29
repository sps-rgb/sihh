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
    <div className="space-y-2 mt-4">
      {matchedConditions.length > 0 && (
        <ul className="space-y-1">
          {matchedConditions.map((condition, idx) => (
            <li key={`match-${idx}`} className="flex items-start gap-2 text-sm text-gray-700">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{condition}</span>
            </li>
          ))}
        </ul>
      )}
      {uncertainConditions.length > 0 && (
        <ul className="space-y-1 mt-2">
          {uncertainConditions.map((condition, idx) => (
            <li key={`uncertain-${idx}`} className="flex items-start gap-2 text-sm text-gray-700">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span>{condition}</span>
            </li>
          ))}
        </ul>
      )}
      {failedConditions.length > 0 && (
        <ul className="space-y-1 mt-2">
          {failedConditions.map((condition, idx) => (
            <li key={`fail-${idx}`} className="flex items-start gap-2 text-sm text-gray-700">
              <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>{condition}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
