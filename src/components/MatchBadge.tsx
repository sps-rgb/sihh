import type { EligibilityStatus } from '@/types';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface MatchBadgeProps {
  status: EligibilityStatus;
  score?: number;
  showScore?: boolean;
}

const STATUS_CONFIG = {
  'Eligible': {
    label: 'Fully Eligible',
    bg: 'bg-emerald-500/10 border-emerald-500/25',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
    icon: CheckCircle,
  },
  'Potentially Eligible': {
    label: 'Potentially Eligible',
    bg: 'bg-amber-500/10 border-amber-500/25',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    icon: AlertCircle,
  },
  'Not Eligible': {
    label: 'Not Eligible',
    bg: 'bg-red-500/10 border-red-500/25',
    text: 'text-red-400',
    dot: 'bg-red-400',
    icon: XCircle,
  },
};

export default function MatchBadge({ status, score, showScore = false }: MatchBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG['Not Eligible'];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
      {showScore && score !== undefined && (
        <span className="ml-1 font-mono font-bold text-xs">· {score}%</span>
      )}
    </div>
  );
}
