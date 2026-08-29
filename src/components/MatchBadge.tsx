import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import type { EligibilityStatus } from '@/types';

interface MatchBadgeProps {
  status: EligibilityStatus;
  score: number;
}

export default function MatchBadge({ status, score }: MatchBadgeProps) {
  const isEligible = status === 'Eligible';
  const isPotentiallyEligible = status === 'Potentially Eligible';
  
  const bgClass = isEligible ? 'bg-green-100 text-green-800 border-green-200' :
                  isPotentiallyEligible ? 'bg-amber-100 text-amber-800 border-amber-200' :
                  'bg-red-100 text-red-800 border-red-200';
                  
  const Icon = isEligible ? CheckCircle : isPotentiallyEligible ? AlertCircle : XCircle;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-sm font-medium ${bgClass}`}>
      <Icon className="h-4 w-4" />
      <span>{status} ({score}%)</span>
    </div>
  );
}
