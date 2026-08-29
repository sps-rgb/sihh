'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SchemeCard from '@/components/SchemeCard';
import type { MatchResult, UserProfile, Scheme } from '@/types';

export default function ResultsPage() {
  const router = useRouter();
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [schemes, setSchemes] = useState<Record<string, Scheme>>({});
  const [filter, setFilter] = useState<'All' | 'Eligible' | 'Potentially Eligible'>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resultsStr = sessionStorage.getItem('match-results');
    const profileStr = sessionStorage.getItem('user-profile');

    if (!resultsStr || !profileStr) {
      setIsLoading(false);
      return;
    }

    const results = JSON.parse(resultsStr) as MatchResult[];
    setMatchResults(results);
    setUserProfile(JSON.parse(profileStr));

    // Fetch scheme details for the matches
    const fetchSchemes = async () => {
      try {
        const response = await fetch('/api/schemes');
        const data = await response.json();
        const schemeMap: Record<string, Scheme> = {};
        data.schemes.forEach((s: Scheme) => {
          schemeMap[s.id] = s;
        });
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
      <div className="flex-1 flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!matchResults.length || !userProfile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Profile Found</h2>
        <p className="text-gray-600 mb-8">Please fill out the profile form to see your recommended schemes.</p>
        <Link href="/scheme-finder" className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">
          Go to Scheme Finder
        </Link>
      </div>
    );
  }

  // Hide "Not Eligible" by default
  const displayableResults = matchResults.filter(r => r.status !== 'Not Eligible');
  
  const eligibleCount = displayableResults.filter(r => r.status === 'Eligible').length;
  const potentialCount = displayableResults.filter(r => r.status === 'Potentially Eligible').length;

  const filteredResults = displayableResults.filter(r => {
    if (filter === 'All') return true;
    return r.status === filter;
  });

  return (
    <div className="flex-1 bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Your Recommended Schemes</h1>
            <p className="text-lg text-gray-600">
              We found {displayableResults.length} schemes that may be relevant to you.
            </p>
          </div>
          <Link href="/scheme-finder" className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md font-medium hover:bg-gray-50 whitespace-nowrap text-sm">
            Start Over
          </Link>
        </div>

        {displayableResults.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2 mb-8 bg-white p-1 rounded-lg border border-gray-200 inline-flex">
              <button
                onClick={() => setFilter('All')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'All' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                All ({displayableResults.length})
              </button>
              <button
                onClick={() => setFilter('Eligible')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'Eligible' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Eligible ({eligibleCount})
              </button>
              <button
                onClick={() => setFilter('Potentially Eligible')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'Potentially Eligible' ? 'bg-amber-100 text-amber-800' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Potentially Eligible ({potentialCount})
              </button>
            </div>

            <div className="space-y-6">
              {filteredResults.length > 0 ? (
                filteredResults.map((result) => (
                  schemes[result.schemeId] && (
                    <SchemeCard
                      key={result.schemeId}
                      scheme={schemes[result.schemeId]}
                      matchResult={result}
                      userProfile={userProfile}
                    />
                  )
                ))
              ) : (
                <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                  <p className="text-gray-600">No schemes found for the selected filter.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg p-10 text-center border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Matching Schemes Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Based on the details provided, we couldn't find any schemes you are eligible for right now. 
              Try adjusting your profile or check back later as new schemes are added.
            </p>
            <Link href="/scheme-finder" className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">
              Update Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
