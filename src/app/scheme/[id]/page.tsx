'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ExternalLink, Sparkles, X, MessageSquare } from 'lucide-react';
import type { Scheme, MatchResult, UserProfile } from '@/types';
import MatchBadge from '@/components/MatchBadge';
import EligibilityBreakdown from '@/components/EligibilityBreakdown';
import ChatBox from '@/components/ChatBox';
import Disclaimer from '@/components/Disclaimer';
import InfrastructureMap from '@/components/InfrastructureMap/InfrastructureMap';

export default function SchemeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(searchParams.get('chat') === 'open');

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const response = await fetch(`/api/schemes/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setScheme(null);
          }
          throw new Error('Scheme not found');
        }
        const data = await response.json();
        setScheme(data);
      } catch (error) {
        console.error('Error fetching scheme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheme();

    const contextStr = sessionStorage.getItem(`scheme-context-${params.id}`);
    if (contextStr) {
      try {
        const context = JSON.parse(contextStr);
        setMatchResult(context.matchResult || null);
        setUserProfile(context.userProfile || null);
      } catch (e) {
        console.error('Error parsing scheme context', e);
      }
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-24 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-neutral-300 border-t-black"></div>
        <p className="text-sm font-medium text-neutral-500">Loading scheme details...</p>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Scheme Not Found</h2>
        <p className="text-sm text-neutral-500 mb-8">The requested scheme could not be found or has been removed.</p>
        <button 
          onClick={() => router.back()} 
          className="px-8 py-3.5 bg-black text-white rounded-full font-medium text-sm hover:bg-neutral-800 transition-all shadow-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full relative">
      <div className={`transition-all duration-300 ${isChatOpen ? 'lg:pr-96' : ''}`}>
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-black mb-6 transition-colors px-3 py-1.5 rounded-full hover:bg-neutral-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Results</span>
        </button>

        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden mb-10">
          {/* Top Banner */}
          <div className="p-6 sm:p-10 border-b border-neutral-200">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{scheme.ministry}</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">{scheme.name}</h1>
              </div>
              {matchResult && (
                <div className="mt-1 flex-shrink-0">
                  <MatchBadge status={matchResult.status} score={matchResult.score} showScore={true} />
                </div>
              )}
            </div>
            <p className="text-base text-neutral-600 leading-relaxed mt-2">{scheme.description}</p>
          </div>

          {/* Key Financial Terms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-neutral-200 divide-y md:divide-y-0 md:divide-x divide-neutral-200 bg-neutral-50">
            <div className="p-6">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Max Loan Amount</h3>
              <p className="text-xl font-bold text-neutral-900">{scheme.maximumLoanAmount ? `₹${scheme.maximumLoanAmount.toLocaleString()}` : 'N/A'}</p>
            </div>
            <div className="p-6">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Interest Rate</h3>
              <p className="text-xl font-bold text-neutral-900">{scheme.interestRate || 'N/A'}</p>
            </div>
            <div className="p-6">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Repayment Tenure</h3>
              <p className="text-xl font-bold text-neutral-900">{scheme.repaymentTenure || 'N/A'}</p>
            </div>
          </div>

          {/* Body Sections */}
          <div className="p-6 sm:p-10 space-y-10">
            {matchResult && (
              <section className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 sm:p-8">
                <h2 className="text-lg font-bold text-neutral-900 mb-2">Your Eligibility Assessment</h2>
                <p className="text-xs text-neutral-500 mb-4">Detailed condition checks based on your submitted profile.</p>
                <EligibilityBreakdown 
                  matchedConditions={matchResult.matchedConditions}
                  failedConditions={matchResult.failedConditions}
                  uncertainConditions={matchResult.uncertainConditions}
                />
              </section>
            )}

            {/* MAP: Rendered automatically below scheme details / eligibility */}
            {userProfile && (
              <InfrastructureMap
                state={userProfile.state}
                radius={5000}
              />
            )}

            <section>
              <h2 className="text-lg font-bold text-neutral-900 mb-3 pb-2 border-b border-neutral-100">Target Beneficiaries</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">{scheme.targetBeneficiaries}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-neutral-900 mb-3 pb-2 border-b border-neutral-100">Eligibility Criteria</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-neutral-700">
                {scheme.eligibility.minAge && <li className="bg-neutral-50 p-3 rounded-2xl border border-neutral-100">• Min Age: <span className="font-semibold">{scheme.eligibility.minAge} year[...]
