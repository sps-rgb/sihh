import { Check, X, AlertTriangle } from 'lucide-react';

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
    <div className="space-y-2.5 text-sm">
      {matchedConditions.map((condition, idx) => (
        <div key={`match-${idx}`} className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mt-0.5">
            <Check className="w-2.5 h-2.5 text-emerald-400" />
          </span>
          <span className="text-neutral-300 leading-snug">{condition}</span>
        </div>
      ))}

      {uncertainConditions.map((condition, idx) => (
        <div key={`uncertain-${idx}`} className="flex items-start gap-3 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/15">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mt-0.5">
            <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
          </span>
          <span className="text-neutral-400 leading-snug">{condition}</span>
        </div>
      ))}

      {failedConditions.map((condition, idx) => (
        <div key={`fail-${idx}`} className="flex items-start gap-3 p-2.5 rounded-xl bg-red-500/5 border border-red-500/10">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/15 border border-red-500/20 flex items-center justify-center mt-0.5">
            <X className="w-2.5 h-2.5 text-red-400" />
          </span>
          <span className="text-neutral-500 leading-snug line-through decoration-red-500/40">{condition}</span>
        </div>
      ))}
    </div>
  );
}
