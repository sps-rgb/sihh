'use client';

import ProfileForm from '@/components/ProfileForm';
import Disclaimer from '@/components/Disclaimer';
import { Sparkles, Target } from 'lucide-react';

export default function SchemeFinderPage() {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/8 border border-cyan-500/20 text-xs font-semibold text-cyan-400 mb-2">
          <Target className="w-3.5 h-3.5" />
          3-Step Profile Assessment
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Find Your Matching Schemes
        </h1>
        <p className="text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Complete the 3-step profile to discover government schemes tailored to your entrepreneurial needs — with full eligibility transparency.
        </p>
      </div>

      <ProfileForm />

      <div className="max-w-2xl mx-auto">
        <Disclaimer />
      </div>
    </div>
  );
}
