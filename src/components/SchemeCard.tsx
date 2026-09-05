'use client';

import { useRouter } from 'next/navigation';
import type { Scheme, MatchResult, UserProfile } from '@/types';
import MatchBadge from './MatchBadge';
import EligibilityBreakdown from './EligibilityBreakdown';
import { ArrowRight, MessageSquare, TrendingUp } from 'lucide-react';

interface SchemeCardProps {
  scheme: Scheme;
  matchResult: MatchResult;
  userProfile: UserProfile;
}

export default function SchemeCard({ scheme, matchResult, userProfile }: SchemeCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    sessionStorage.setItem(`scheme-context-${scheme.id}`, JSON.stringify({ userProfile, matchResult }));
    router.push(`/scheme/${scheme.id}`);
  };

  const handleAskAi = () => {
    sessionStorage.setItem(`scheme-context-${scheme.id}`, JSON.stringify({ userProfile, matchResult }));
    router.push(`/scheme/${scheme.id}?chat=open`);
  };

  const isEligible = matchResult.status === 'Eligible';
  const scoreColor = matchResult.score >= 80 ? 'text-emerald-400' : matchResult.score >= 50 ? 'text-amber-400' : 'text-red-400';
  const scoreGlow = matchResult.score >= 80 ? 'shadow-emerald-500/20' : matchResult.score >= 50 ? 'shadow-amber-500/20' : 'shadow-red-500/20';

  // Circular progress ring
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (matchResult.score / 100) * circumference;

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-white/8">
      {/* Top Row */}
      <div className="p-6 sm:p-7 pb-5">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <MatchBadge status={matchResult.status} />
              <span className="text-xs text-neutral-500 font-mono">{scheme.ministry?.split(' ').slice(0, 3).join(' ')}</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight leading-snug mt-1">{scheme.name}</h3>
            <p className="text-sm text-neutral-400 mt-2 line-clamp-2 leading-relaxed">{scheme.description}</p>
          </div>

          {/* Circular Score Ring */}
          <div className={`flex-shrink-0 relative w-16 h-16 flex items-center justify-center rounded-full bg-black/30 shadow-xl ${scoreGlow}`}>
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none" />
              <circle
                cx="32" cy="32" r={radius}
                stroke={isEligible ? '#10b981' : matchResult.score >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="3"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>
            <span className={`text-sm font-black font-mono ${scoreColor} z-10`}>{matchResult.score}%</span>
          </div>
        </div>

        {/* Key Financial Terms */}
        <div className="grid grid-cols-3 gap-3 mt-5 text-xs">
          {[
            { label: 'Max Loan', value: scheme.maximumLoanAmount ? `₹${(scheme.maximumLoanAmount / 100000).toFixed(1)}L` : 'N/A' },
            { label: 'Interest', value: scheme.interestRate || 'N/A' },
            { label: 'Tenure', value: scheme.repaymentTenure || 'N/A' },
          ].map((item) => (
            <div key={item.label} className="p-2.5 rounded-xl bg-white/3 border border-white/6 text-center">
              <span className="block text-neutral-500 uppercase tracking-wider text-[10px] mb-0.5">{item.label}</span>
              <span className="font-bold text-white text-sm font-mono">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Eligibility Breakdown */}
      <div className="px-6 sm:px-7 pb-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Eligibility Assessment</span>
        </div>
        {/* Show only top 3 matched conditions to keep cards compact */}
        <EligibilityBreakdown
          matchedConditions={matchResult.matchedConditions.slice(0, 3)}
          failedConditions={matchResult.failedConditions.slice(0, 2)}
          uncertainConditions={matchResult.uncertainConditions.slice(0, 1)}
        />
      </div>

      {/* CTA Footer */}
      <div className="px-6 sm:px-7 pb-6 pt-2 flex flex-col sm:flex-row gap-3 border-t border-white/6">
        <button
          onClick={handleViewDetails}
          className="flex-1 btn-quantum inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full text-sm font-semibold"
        >
          <span>View Full Details</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={handleAskAi}
          className="flex-1 btn-ghost-glass inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full text-sm font-semibold"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask AI</span>
        </button>
      </div>
    </div>
  );
}
