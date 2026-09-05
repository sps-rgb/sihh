'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import SchemeCard from '@/components/SchemeCard';
import Disclaimer from '@/components/Disclaimer';
import type { MatchResult, UserProfile, Scheme } from '@/types';
import { Sparkles, ArrowLeft, RefreshCw, LayoutGrid, GitBranch, Trophy } from 'lucide-react';

const SchemeNodeGraph = dynamic(() => import('@/components/3d/SchemeNodeGraph'), { ssr: false });

type Filter = 'All' | 'Eligible' | 'Potentially Eligible';
type ViewMode = 'cards' | 'graph';

export default function ResultsPage() {
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [schemes, setSchemes] = useState<Record<string, Scheme>>({});
  const [filter, setFilter] = useState<Filter>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resultsStr = sessionStorage.getItem('match-results');
    const profileStr = sessionStorage.getItem('user-profile');
    if (!resultsStr || !profileStr) { setIsLoading(false); return; }

    const results = JSON.parse(resultsStr) as MatchResult[];
    setMatchResults(results);
    setUserProfile(JSON.parse(profileStr));

    const fetchSchemes = async () => {
      try {
        const response = await fetch('/api/schemes');
        const data = await response.json();
        const schemeMap: Record<string, Scheme> = {};
        data.schemes.forEach((s: Scheme) => { schemeMap[s.id] = s; });
        setSchemes(schemeMap);
      } catch (error) {
        console.error('Failed to fetch schemes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-24 space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-emerald-500/20 border-b-emerald-400 animate-spin animate-[spin_1.5s_linear_reverse_infinite]" />
        </div>
        <p className="text-sm font-mono text-neutral-500 tracking-wider animate-pulse">EVALUATING SCHEME RULES...</p>
      </div>
    );
  }

  if (!matchResults.length || !userProfile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 shadow-xl shadow-cyan-500/10">
          <Sparkles className="w-7 h-7 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Profile Found</h2>
        <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
          Please complete the profile questionnaire so we can evaluate your scheme eligibility.
        </p>
        <Link href="/scheme-finder" className="btn-quantum inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-sm">
          <span>Go to Scheme Finder</span>
        </Link>
      </div>
    );
  }

  const displayableResults = matchResults.filter((r) => r.status !== 'Not Eligible');
  const eligibleCount = displayableResults.filter((r) => r.status === 'Eligible').length;
  const potentialCount = displayableResults.filter((r) => r.status === 'Potentially Eligible').length;

  const filteredResults = displayableResults.filter((r) => {
    if (filter === 'All') return true;
    return r.status === filter;
  });

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-500 flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Match Results
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Recommended Schemes</h1>
          <p className="text-sm text-neutral-400 mt-1.5">
            Found <span className="font-bold text-white">{displayableResults.length}</span> relevant schemes for{' '}
            <span className="font-bold text-cyan-400">{userProfile.state}</span>{' '}
            — {userProfile.category} category
          </p>
        </div>
        <Link
          href="/scheme-finder"
          className="btn-ghost-glass inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium whitespace-nowrap"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Edit Profile
        </Link>
      </div>

      {/* Score Summary Banner */}
      {eligibleCount > 0 && (
        <div className="glass-panel rounded-2xl p-4 border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              🎉 Congratulations — You are <span className="text-emerald-400">fully eligible for {eligibleCount} scheme{eligibleCount > 1 ? 's' : ''}!</span>
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">Click "View Details" on any scheme to see documents, subsidies, and how to apply.</p>
          </div>
        </div>
      )}

      {displayableResults.length > 0 ? (
        <>
          {/* Filter + View Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {(['All', 'Eligible', 'Potentially Eligible'] as Filter[]).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all border ${
                    filter === f
                      ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                      : 'border-white/10 text-neutral-400 hover:text-white hover:border-white/25'
                  }`}>
                  {f === 'All' ? `All (${displayableResults.length})` : f === 'Eligible' ? `Eligible (${eligibleCount})` : `Potential (${potentialCount})`}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-white/3">
              <button onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'cards' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'}`}>
                <LayoutGrid className="w-3.5 h-3.5" />
                Cards
              </button>
              <button onClick={() => setViewMode('graph')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'graph' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'}`}>
                <GitBranch className="w-3.5 h-3.5" />
                Graph View
              </button>
            </div>
          </div>

          {/* Results */}
          {viewMode === 'cards' ? (
            <div className="space-y-6">
              {filteredResults.length > 0 ? (
                filteredResults.map((result) =>
                  schemes[result.schemeId] && (
                    <SchemeCard
                      key={result.schemeId}
                      scheme={schemes[result.schemeId]}
                      matchResult={result}
                      userProfile={userProfile}
                    />
                  )
                )
              ) : (
                <div className="glass-panel rounded-3xl p-10 text-center border border-white/8">
                  <p className="text-sm text-neutral-500">No schemes found for the selected filter.</p>
                </div>
              )}
            </div>
          ) : (
            <SchemeNodeGraph
              userProfile={userProfile}
              matchResults={matchResults}
              schemes={schemes}
            />
          )}
        </>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/8 max-w-lg mx-auto">
          <h3 className="text-xl font-bold text-white mb-2">No Matching Schemes Found</h3>
          <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
            Based on your profile, none of the current demo schemes fully matched. Try updating your details or project requirements.
          </p>
          <Link href="/scheme-finder" className="btn-quantum inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Update Profile</span>
          </Link>
        </div>
      )}

      <div className="pt-4">
        <Disclaimer />
      </div>
    </div>
  );
}
