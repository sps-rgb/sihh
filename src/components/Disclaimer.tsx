import { AlertTriangle } from 'lucide-react';

interface DisclaimerProps {
  className?: string;
  text?: string;
}

export default function Disclaimer({
  className = '',
  text = 'This MVP uses mock scheme data for demonstration. Verify all information against official government sources before applying.',
}: DisclaimerProps) {
  return (
    <div className={`flex items-start gap-3 bg-amber-50 text-amber-800 p-4 rounded-md border border-amber-200 ${className}`}>
      <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-600" />
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
}
