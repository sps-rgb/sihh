import { AlertTriangle } from 'lucide-react';

interface DisclaimerProps {
  className?: string;
}

export default function Disclaimer({ className = '' }: DisclaimerProps) {
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 text-amber-400/80 ${className}`}
    >
      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-400" />
      <p className="text-xs leading-relaxed">
        <strong className="text-amber-300 font-semibold">Demo Prototype:</strong> All scheme data is fictional / mock
        data for demonstration purposes only. Do NOT treat these as real government schemes. Always verify eligibility
        with official government sources before applying.
      </p>
    </div>
  );
}
