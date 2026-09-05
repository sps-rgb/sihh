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
    <div className="glass-panel glass-panel-hover rounded-2xl sm:rounded-3xl overflow-hidden border border-white/8">
      {/* Top Row */}
      <div className="p-4 sm:p-6 sm:pb-5 pb-4">
        <div className="flex flex-col gap-4">
          {/* Header with Badge and Score */}
          <div className="flex items-start gap-3 justify-between min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="flex-shrink-0">
                <MatchBadge status={matchResult.status} />
              </div>
              <span className="text-[10px] sm:text-xs text-neutral-500 font-mono truncate">{scheme.ministry?.split(' ').slice(0, 2).join(' ')}</span>
            </div>
            
            {/* Circular Score Ring */}
            <div className={`flex-shrink-0 relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-black/30 shadow-xl ${scoreGlow}`}>
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
              <span className={`text-xs sm:text-sm font-black font-mono ${scoreColor} z-10`}>{matchResult.score}%</span>
            </div>
          </div>

          {/* Title and Description */}
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug line-clamp-2 break-words">{scheme.name}</h3>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1.5 line-clamp-2 leading-relaxed break-words">{scheme.description}</p>
          </div>

          {/* Key Financial Terms */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs">
            {[
              { label: 'Max Loan', value: scheme.maximumLoanAmount ? `₹${(scheme.maximumLoanAmount / 100000).toFixed(1)}L` : 'N/A' },
              { label: 'Interest', value: scheme.interestRate || 'N/A' },
              { label: 'Tenure', value: scheme.repaymentTenure || 'N/A' },
            ].map((item) => (
              <div key={item.label} className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/3 border border-white/6 text-center min-w-0">
                <span className="block text-neutral-500 uppercase tracking-wider text-[9px] sm:text-[10px] mb-0.5 truncate">{item.label}</span>
                <span className="font-bold text-white text-xs sm:text-sm font-mono truncate block">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Eligibility Breakdown */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 truncate">Eligibility</span>
        </div>
        {/* Show only top 3 matched conditions to keep cards compact */}
        <EligibilityBreakdown
          matchedConditions={matchResult.matchedConditions.slice(0, 3)}
          failedConditions={matchResult.failedConditions.slice(0, 2)}
          uncertainConditions={matchResult.uncertainConditions.slice(0, 1)}
        />
      </div>

      {/* CTA Footer */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 flex flex-col sm:flex-row gap-2.5 sm:gap-3 border-t border-white/6">
        <button
          onClick={handleViewDetails}
          className="flex-1 btn-quantum inline-flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 sm:px-5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap"
        >
          <span className="truncate">View Details</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
        </button>
        <button
          onClick={handleAskAi}
          className="flex-1 btn-ghost-glass inline-flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 sm:px-5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap"
        >
          <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="truncate">Ask AI</span>
        </button>
      </div>
    </div>
  );
}
