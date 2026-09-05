'use client';

import { use, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ExternalLink, Sparkles, X, MessageSquare, Calculator } from 'lucide-react';
import type { Scheme, MatchResult, UserProfile } from '@/types';
import MatchBadge from '@/components/MatchBadge';
import EligibilityBreakdown from '@/components/EligibilityBreakdown';
import ChatBox from '@/components/ChatBox';
import Disclaimer from '@/components/Disclaimer';
import InfrastructureMap from '@/components/InfrastructureMap/InfrastructureMap';
import RoiCalculator from '@/components/RoiCalculator';

export default function SchemeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(searchParams.get('chat') === 'open');
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'apply' | 'calculator'>('overview');

  useEffect(() => {
    let isMounted = true;
    const fetchScheme = async () => {
      try {
        const response = await fetch(`/api/schemes/${id}`);
        if (!response.ok) { if (isMounted) setScheme(null); throw new Error('Scheme not found'); }
        const data = await response.json();
        if (isMounted) setScheme(data);
      } catch (error) { console.error('Error fetching scheme:', error); }
      finally { if (isMounted) setIsLoading(false); }
    };
    fetchScheme();

    const contextStr = sessionStorage.getItem(`scheme-context-${id}`);
    if (contextStr) {
      try {
        const context = JSON.parse(contextStr);
        if (isMounted) { setMatchResult(context.matchResult || null); setUserProfile(context.userProfile || null); }
      } catch (e) { console.error('Error parsing scheme context', e); }
    }
    return () => { isMounted = false; };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-24 space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-emerald-500/20 border-b-emerald-400 animate-spin animate-[spin_1.5s_linear_reverse_infinite]" />
        </div>
        <p className="text-sm font-mono text-neutral-500 tracking-wider animate-pulse">LOADING SCHEME DETAILS...</p>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Scheme Not Found</h2>
        <p className="text-sm text-neutral-400 mb-8">The requested scheme could not be found or has been removed.</p>
        <button onClick={() => router.back()}
          className="btn-quantum px-8 py-3.5 rounded-full font-medium text-sm">
          Go Back
        </button>
      </div>
    );
  }

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'apply', label: 'How to Apply' },
    { id: 'calculator', label: 'EMI Calculator' },
  ] as const;

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full relative">
      <div className={`transition-all duration-300 ${isChatOpen ? 'lg:pr-[400px]' : ''}`}>

        {/* Back Button */}
        <button onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-white mb-6 transition-colors px-3 py-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10">
          <ArrowLeft className="w-4 h-4" />
          Back to Results
        </button>

        {/* Hero Banner */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/8 mb-6">
          {/* Top header */}
          <div className="p-6 sm:p-10 border-b border-white/8 bg-gradient-to-br from-cyan-950/20 via-transparent to-purple-950/20">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-500 mb-2 block">
                  {scheme.ministry}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">{scheme.name}</h1>
                <p className="text-base text-neutral-400 leading-relaxed mt-3 max-w-2xl">{scheme.description}</p>
              </div>
              {matchResult && (
                <div className="flex-shrink-0 flex flex-col items-end gap-3">
                  <MatchBadge status={matchResult.status} score={matchResult.score} showScore />
                  {/* Score Ring */}
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.06)" strokeWidth="4" fill="none" />
                      <circle cx="40" cy="40" r="34"
                        stroke={matchResult.status === 'Eligible' ? '#10b981' : '#f59e0b'}
                        strokeWidth="4" fill="none"
                        strokeDasharray={2 * Math.PI * 34}
                        strokeDashoffset={2 * Math.PI * 34 * (1 - matchResult.score / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="text-center z-10">
                      <span className={`text-xl font-extrabold font-mono ${matchResult.status === 'Eligible' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {matchResult.score}%
                      </span>
                      <span className="block text-[9px] text-neutral-500 uppercase tracking-wider">Match</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Key Financial Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/8 bg-white/2">
            {[
              { label: 'Max Loan Amount', value: scheme.maximumLoanAmount ? `₹${scheme.maximumLoanAmount.toLocaleString()}` : 'N/A' },
              { label: 'Interest Rate', value: scheme.interestRate || 'N/A' },
              { label: 'Repayment Tenure', value: scheme.repaymentTenure || 'N/A' },
            ].map((stat) => (
              <div key={stat.label} className="p-6 text-center">
                <span className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1">{stat.label}</span>
                <span className="text-2xl font-extrabold text-white font-mono">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 px-4 sm:px-6 pt-4 pb-0 border-b border-white/8">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                    : 'border-transparent text-neutral-500 hover:text-white'
                }`}>
                {tab.id === 'calculator' && <Calculator className="inline w-3.5 h-3.5 mr-1.5" />}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <section>
                  <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-5 rounded bg-cyan-500" />
                    Target Beneficiaries
                  </h2>
                  <p className="text-neutral-300 text-sm leading-relaxed">{scheme.targetBeneficiaries}</p>
                </section>

                <section>
                  <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-5 rounded bg-emerald-500" />
                    Key Benefits
                  </h2>
                  <ul className="space-y-2">
                    {scheme.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-neutral-300">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0 mt-0.5 text-emerald-400 text-xs font-bold">{idx + 1}</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-5 rounded bg-purple-500" />
                    Eligibility Criteria
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {scheme.eligibility.minAge && <div className="glass-panel rounded-xl p-3 text-sm border border-white/6">Min Age: <strong className="text-white">{scheme.eligibility.minAge} years</strong></div>}
                    {scheme.eligibility.maxAge && <div className="glass-panel rounded-xl p-3 text-sm border border-white/6">Max Age: <strong className="text-white">{scheme.eligibility.maxAge} years</strong></div>}
                    {scheme.eligibility.genders?.length > 0 && <div className="glass-panel rounded-xl p-3 text-sm border border-white/6">Gender: <strong className="text-white">{scheme.eligibility.genders.join(', ')}</strong></div>}
                    {scheme.eligibility.categories?.length > 0 && <div className="glass-panel rounded-xl p-3 text-sm border border-white/6">Category: <strong className="text-white">{scheme.eligibility.categories.join(', ')}</strong></div>}
                    {scheme.eligibility.maxAnnualIncome && <div className="glass-panel rounded-xl p-3 text-sm border border-white/6">Max Income: <strong className="text-white">₹{scheme.eligibility.maxAnnualIncome.toLocaleString()}</strong></div>}
                    {scheme.eligibility.maxProjectCost && <div className="glass-panel rounded-xl p-3 text-sm border border-white/6">Max Project: <strong className="text-white">₹{scheme.eligibility.maxProjectCost.toLocaleString()}</strong></div>}
                    {scheme.eligibility.businessTypes?.length > 0 && <div className="glass-panel rounded-xl p-3 text-sm border border-white/6 sm:col-span-2">Sectors: <strong className="text-white">{scheme.eligibility.businessTypes.join(', ')}</strong></div>}
                  </div>
                </section>

                <section>
                  <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-5 rounded bg-amber-500" />
                    State Coverage
                  </h2>
                  <p className="text-neutral-300 text-sm">{scheme.stateCoverage}</p>
                </section>
              </div>
            )}

            {/* ELIGIBILITY TAB */}
            {activeTab === 'eligibility' && (
              <div className="space-y-6">
                {matchResult ? (
                  <div>
                    <h2 className="text-base font-bold text-white mb-2">Your Personalised Eligibility Assessment</h2>
                    <p className="text-xs text-neutral-500 mb-5">Detailed condition checks based on your submitted profile.</p>
                    <EligibilityBreakdown
                      matchedConditions={matchResult.matchedConditions}
                      failedConditions={matchResult.failedConditions}
                      uncertainConditions={matchResult.uncertainConditions}
                    />
                  </div>
                ) : (
                  <div className="glass-panel rounded-2xl p-8 text-center border border-white/8">
                    <p className="text-neutral-400 text-sm">Complete the profile assessment to see your personalised eligibility breakdown.</p>
                  </div>
                )}

                {/* Infrastructure Map */}
                {userProfile && (
                  <div className="mt-4">
                    <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-5 rounded bg-cyan-500" />
                      Nearby Banking & MSME Infrastructure
                    </h2>
                    <InfrastructureMap state={userProfile.state} radius={5000} />
                  </div>
                )}
              </div>
            )}

            {/* HOW TO APPLY TAB */}
            {activeTab === 'apply' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                  <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-5 rounded bg-purple-500" />
                    Required Documents
                  </h2>
                  <ol className="space-y-2">
                    {scheme.documents.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-neutral-300 glass-panel rounded-xl p-3 border border-white/6">
                        <span className="w-6 h-6 rounded-full bg-purple-500/15 border border-purple-500/25 flex items-center justify-center flex-shrink-0 text-xs font-bold text-purple-400">{idx + 1}</span>
                        {doc}
                      </li>
                    ))}
                  </ol>
                </section>
                <section>
                  <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-5 rounded bg-cyan-500" />
                    Application Steps
                  </h2>
                  <ol className="space-y-2">
                    {scheme.applicationProcess.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-neutral-300 glass-panel rounded-xl p-3 border border-white/6">
                        <span className="w-6 h-6 rounded-full bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center flex-shrink-0 text-xs font-bold text-cyan-400">{idx + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </section>
              </div>
            )}

            {/* CALCULATOR TAB */}
            {activeTab === 'calculator' && (
              <RoiCalculator
                defaultLoanAmount={userProfile?.projectCost || scheme.maximumLoanAmount || 500000}
                maxLoanAmount={scheme.maximumLoanAmount || 2500000}
                defaultInterestRate={scheme.interestRate}
                defaultTenure={scheme.repaymentTenure}
              />
            )}
          </div>

          {/* Footer */}
          <div className="bg-white/2 p-6 sm:p-8 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
            <div>
              Source:{' '}
              {scheme.sourceUrl ? (
                <a href={scheme.sourceUrl} target="_blank" rel="noreferrer"
                  className="text-cyan-400 underline font-semibold inline-flex items-center gap-1 hover:text-cyan-300">
                  Official Portal <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-neutral-300 font-semibold">{scheme.ministry}</span>
              )}
              {' '}· Last Verified: {new Date(scheme.lastUpdated).toLocaleDateString()}
            </div>
            <Disclaimer className="w-full sm:w-auto mt-2 sm:mt-0 max-w-md" />
          </div>
        </div>
      </div>

      {/* Chat Drawer */}
      {isChatOpen ? (
        <div className="fixed inset-y-0 right-0 w-full md:w-[400px] z-50 flex flex-col shadow-2xl border-l border-white/10"
          style={{ background: 'rgba(7,8,12,0.97)', backdropFilter: 'blur(24px)' }}>
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              AI Scheme Assistant
            </h3>
            <button onClick={() => setIsChatOpen(false)}
              className="text-neutral-400 hover:text-white bg-white/8 rounded-full p-1.5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden p-3">
            <ChatBox schemeId={scheme.id} schemeName={scheme.name} userProfile={userProfile} matchResult={matchResult} />
          </div>
        </div>
      ) : (
        <button onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 btn-quantum px-6 py-3.5 rounded-full shadow-2xl z-40 flex items-center gap-2.5">
          <MessageSquare className="w-5 h-5" />
          <span className="font-semibold text-sm">Ask AI Assistant</span>
        </button>
      )}
    </div>
  );
}
