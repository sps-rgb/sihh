'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ExternalLink, MessageCircle } from 'lucide-react';
import type { Scheme, MatchResult, UserProfile } from '@/types';
import MatchBadge from '@/components/MatchBadge';
import EligibilityBreakdown from '@/components/EligibilityBreakdown';
import ChatBox from '@/components/ChatBox';
import Disclaimer from '@/components/Disclaimer';

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
      <div className="flex-1 flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Scheme Not Found</h2>
        <p className="text-gray-600 mb-8">The requested scheme could not be found.</p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className={`max-w-5xl mx-auto transition-all duration-300 ${isChatOpen ? 'lg:pr-96' : ''}`}>
        <button 
          onClick={() => router.back()}
          className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Results
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
              <h1 className="text-3xl font-extrabold text-gray-900">{scheme.name}</h1>
              {matchResult && (
                <div className="mt-1 flex-shrink-0">
                  <MatchBadge status={matchResult.status} score={matchResult.score} />
                </div>
              )}
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">{scheme.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-gray-50">
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Max Loan Amount</h3>
              <p className="text-xl font-bold text-gray-900">{scheme.maximumLoanAmount ? `₹${scheme.maximumLoanAmount.toLocaleString()}` : 'N/A'}</p>
            </div>
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Interest Rate</h3>
              <p className="text-xl font-bold text-gray-900">{scheme.interestRate || 'N/A'}</p>
            </div>
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Tenure</h3>
              <p className="text-xl font-bold text-gray-900">{scheme.repaymentTenure || 'N/A'}</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-10">
            {matchResult && (
              <section className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your Eligibility Assessment</h2>
                <EligibilityBreakdown 
                  matchedConditions={matchResult.matchedConditions}
                  failedConditions={matchResult.failedConditions}
                  uncertainConditions={matchResult.uncertainConditions}
                />
              </section>
            )}

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Who Can Apply</h2>
              <p className="text-gray-700">{scheme.targetBeneficiaries}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Eligibility Criteria</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {scheme.eligibility.minAge && <li>Minimum Age: {scheme.eligibility.minAge}</li>}
                {scheme.eligibility.maxAge && <li>Maximum Age: {scheme.eligibility.maxAge}</li>}
                {scheme.eligibility.genders && scheme.eligibility.genders.length > 0 && (
                  <li>Gender: {scheme.eligibility.genders.join(', ')}</li>
                )}
                {scheme.eligibility.categories && scheme.eligibility.categories.length > 0 && (
                  <li>Category: {scheme.eligibility.categories.join(', ')}</li>
                )}
                {scheme.eligibility.businessTypes && scheme.eligibility.businessTypes.length > 0 && (
                  <li>Business Types: {scheme.eligibility.businessTypes.join(', ')}</li>
                )}
                {scheme.eligibility.maxAnnualIncome && <li>Maximum Annual Income: ₹{scheme.eligibility.maxAnnualIncome.toLocaleString()}</li>}
                {scheme.eligibility.maxProjectCost && <li>Maximum Project Cost: ₹{scheme.eligibility.maxProjectCost.toLocaleString()}</li>}
                <li>New Business: {scheme.eligibility.newBusinessAllowed ? 'Allowed' : 'Not Allowed'}</li>
                <li>Existing Business: {scheme.eligibility.existingBusinessAllowed ? 'Allowed' : 'Not Allowed'}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Benefits</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {scheme.benefits.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Required Documents</h2>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  {scheme.documents.map((doc, idx) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">How to Apply</h2>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  {scheme.applicationProcess.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </section>
            </div>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Coverage</h2>
              <p className="text-gray-700">
                {scheme.stateCoverage}
              </p>
            </section>
          </div>
          
          <div className="bg-gray-50 p-6 sm:p-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <div>
              <span className="block mb-1">Source (Mock): <a href="#" className="text-blue-600 hover:underline flex items-center gap-1 inline-flex">https://india.gov.in/scheme/{scheme.id} <ExternalLink className="w-3 h-3" /></a></span>
              <span>Last Updated: {new Date(scheme.lastUpdated).toLocaleDateString()}</span>
            </div>
            <Disclaimer className="w-full sm:w-auto mt-4 sm:mt-0 max-w-md text-xs py-2 px-3" />
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      {isChatOpen ? (
        <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl z-40 border-l border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out">
          <div className="p-4 bg-gray-100 flex justify-between items-center border-b border-gray-200">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              Scheme Assistant
            </h3>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-gray-500 hover:text-gray-900 bg-white rounded-full p-1 border border-gray-200"
            >
              <ChevronLeft className="w-5 h-5 transform rotate-180" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden p-2">
            <ChatBox 
              schemeId={scheme.id} 
              schemeName={scheme.name} 
              userProfile={userProfile} 
              matchResult={matchResult} 
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all z-40 flex items-center gap-3 animate-bounce"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="font-medium hidden sm:block pr-2">Ask AI Assistant</span>
        </button>
      )}
    </div>
  );
}
