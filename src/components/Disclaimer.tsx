import { AlertCircle } from 'lucide-react';

interface DisclaimerProps {
  className?: string;
  text?: string;
}

export default function Disclaimer({
  className = '',
  text = 'Demo Prototype: Scheme data shown is fictional/mock data for demonstration only. Verify all information against official government sources before applying.',
}: DisclaimerProps) {
  return (
    <div className={`flex items-start gap-3 bg-neutral-100 text-neutral-800 p-4 rounded-2xl border border-neutral-200 ${className}`}>
      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-neutral-900" />
      <p className="text-xs sm:text-sm font-medium leading-relaxed">{text}</p>
    </div>
  );
}
