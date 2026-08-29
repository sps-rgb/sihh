'use client';

import { useRouter } from 'next/navigation';
import type { Scheme, MatchResult, UserProfile } from '@/types';
import MatchBadge from './MatchBadge';
import EligibilityBreakdown from './EligibilityBreakdown';

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6 card">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
        <div>
          <MatchBadge status={matchResult.status} score={matchResult.score} />
          <h3 className="text-xl font-bold text-gray-900 mt-3">{scheme.name}</h3>
        </div>
        <div className="bg-blue-50 text-blue-800 text-2xl font-bold px-4 py-2 rounded-lg text-center min-w-[80px]">
          {matchResult.score}%
        </div>
      </div>
      
      <p className="text-gray-600 mb-6 line-clamp-2">{scheme.description}</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg text-sm">
        <div>
          <span className="block text-gray-500 mb-1">Max Loan</span>
          <span className="font-semibold text-gray-900">{scheme.maximumLoanAmount ? `₹${scheme.maximumLoanAmount.toLocaleString()}` : 'Varies'}</span>
        </div>
        <div>
          <span className="block text-gray-500 mb-1">Interest Rate</span>
          <span className="font-semibold text-gray-900">{scheme.interestRate || 'Varies'}</span>
        </div>
        <div>
          <span className="block text-gray-500 mb-1">Tenure</span>
          <span className="font-semibold text-gray-900">{scheme.repaymentTenure || 'Varies'}</span>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Eligibility Assessment</h4>
        <EligibilityBreakdown 
          matchedConditions={matchResult.matchedConditions} 
          failedConditions={matchResult.failedConditions} 
          uncertainConditions={matchResult.uncertainConditions} 
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
        <button 
          onClick={handleViewDetails}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          View Details
        </button>
        <button 
          onClick={handleAskAi}
          className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
        >
          Ask AI Assistant
        </button>
      </div>
    </div>
  );
}
