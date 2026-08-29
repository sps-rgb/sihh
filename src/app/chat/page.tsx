'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { STATE_ALIASES, normalizeStateName, INDIAN_STATES } from '@/types';
import type { UserProfile } from '@/types';
import Disclaimer from '@/components/Disclaimer';

export default function ChatModePage() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [extractedProfile, setExtractedProfile] = useState<Partial<UserProfile> | null>(null);
  const [error, setError] = useState('');

  const parseTextClientSide = (text: string): Partial<UserProfile> => {
    const profile: Partial<UserProfile> = {
      existingBusiness: false,
      existingLoan: false,
    };

    // Age
    const ageMatch = text.match(/(\d{2})\s*(?:year|yr|age|years old)/i);
    if (ageMatch) profile.age = parseInt(ageMatch[1], 10);

    // Gender
    const genderMatch = text.match(/\b(woman|female|women|man|male|men)\b/i);
    if (genderMatch) {
      const g = genderMatch[1].toLowerCase();
      if (['woman', 'female', 'women'].includes(g)) profile.gender = 'Female';
      else if (['man', 'male', 'men'].includes(g)) profile.gender = 'Male';
    }

    // Category
    const categoryMatch = text.match(/\b(SC|ST|OBC|minority|general)\b/i);
    if (categoryMatch) {
      const c = categoryMatch[1].toUpperCase();
      if (['SC', 'ST', 'OBC'].includes(c)) profile.category = c as any;
      else if (c === 'MINORITY') profile.category = 'Minority';
      else profile.category = 'General';
    }

    // State extraction with abbreviation/alias support (e.g. UP, HR, DL, MP, RJ)
    for (const [alias, fullState] of Object.entries(STATE_ALIASES)) {
      const pattern = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (pattern.test(text)) {
        profile.state = fullState;
        break;
      }
    }
    if (!profile.state) {
      for (const state of INDIAN_STATES) {
        if (text.toLowerCase().includes(state.toLowerCase())) {
          profile.state = state;
          break;
        }
      }
    }

    // Business Type
    const lowerText = text.toLowerCase();
    if (lowerText.includes('farm') || lowerText.includes('agri')) profile.businessType = 'Agriculture';
    else if (lowerText.includes('manufactur')) profile.businessType = 'Manufacturing';
    else if (lowerText.includes('shop') || lowerText.includes('retail') || lowerText.includes('trad')) profile.businessType = 'Trading';
    else if (lowerText.includes('service') || lowerText.includes('consult')) profile.businessType = 'Service';
    else if (lowerText.includes('tailor') || lowerText.includes('textile') || lowerText.includes('cloth')) profile.businessType = 'Tailoring/Textiles';
    else if (lowerText.includes('food') || lowerText.includes('cook') || lowerText.includes('restaurant')) profile.businessType = 'Food';
    else if (lowerText.includes('handicraft') || lowerText.includes('craft') || lowerText.includes('artisan')) profile.businessType = 'Handicrafts';
    else if (lowerText.includes('tech') || lowerText.includes('software')) profile.businessType = 'Other';
    
    // Project Cost / Loan Requirement
    const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac)s?/i);
    if (lakhMatch) {
      profile.projectCost = parseFloat(lakhMatch[1]) * 100000;
    } else {
      const numMatch = text.match(/(?:need|require|want|loan of)\s*(?:rs\.?|rupees|₹)?\s*(\d+(?:,\d+)*)/i);
      if (numMatch) {
        profile.projectCost = parseInt(numMatch[1].replace(/,/g, ''), 10);
      }
    }

    return profile;
  };

  const handleAnalyze = () => {
    if (!inputText.trim()) {
      setError('Please describe your profile and business needs.');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    setExtractedProfile(null);

    // Simulate analysis delay
    setTimeout(() => {
      const extracted = parseTextClientSide(inputText);
      setExtractedProfile(extracted);
      setIsAnalyzing(false);
    }, 1000);
  };

  const handleMatch = async () => {
    if (!extractedProfile) return;

    setIsMatching(true);
    setError('');

    try {
      const response = await fetch('/api/match-schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(extractedProfile),
      });

      if (!response.ok) {
        throw new Error('Failed to match schemes');
      }

      const data = await response.json();
      
      sessionStorage.setItem('user-profile', JSON.stringify(extractedProfile));
      sessionStorage.setItem('match-results', JSON.stringify(data.matches));
      
      router.push('/results');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setIsMatching(false);
    }
  };

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-800 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mode B • Conversational Input</span>
        </div>
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
          AI Scheme Assistant
        </h1>
        <p className="text-sm text-neutral-500 max-w-md mx-auto">
          Describe yourself and your business venture in plain text, and we'll extract your parameters automatically.
        </p>
      </div>

      <div className="bg-white shadow-sm border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Describe Yourself
        </label>
        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full rounded-2xl border border-neutral-300 p-4 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-neutral-900 placeholder:text-neutral-400 bg-neutral-50/50"
          placeholder="e.g. I am a 28 year old woman from UP. I want to start a tailoring business requiring a loan of 4 lakh. I belong to SC category."
        />
        
        {error && <p className="text-xs text-neutral-800 font-semibold">{error}</p>}
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
          <span className="text-xs text-neutral-400">Supports state abbreviations (UP, HR, DL, etc.)</span>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputText.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-black text-white rounded-full font-medium text-xs hover:bg-neutral-800 transition-all disabled:opacity-50"
          >
            {isAnalyzing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze My Profile'}</span>
          </button>
        </div>
      </div>

      {extractedProfile && (
        <div className="bg-white shadow-sm border border-neutral-200 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-3">
          <div className="p-6 bg-neutral-50 border-b border-neutral-200">
            <h2 className="text-base font-bold text-neutral-900">Extracted Profile Parameters</h2>
            <p className="text-xs text-neutral-500">Review the parameters detected from your text before evaluating schemes.</p>
          </div>
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100">
                <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Age</span>
                <span className="font-bold text-neutral-900">{extractedProfile.age ? `${extractedProfile.age} yrs` : 'Not detected'}</span>
              </div>
              <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100">
                <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Gender</span>
                <span className="font-bold text-neutral-900">{extractedProfile.gender || 'Not detected'}</span>
              </div>
              <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100">
                <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Category</span>
                <span className="font-bold text-neutral-900">{extractedProfile.category || 'Not detected'}</span>
              </div>
              <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100">
                <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">State</span>
                <span className="font-bold text-neutral-900">{extractedProfile.state || 'Not detected'}</span>
              </div>
              <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100">
                <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Sector</span>
                <span className="font-bold text-neutral-900">{extractedProfile.businessType || 'Not detected'}</span>
              </div>
              <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100">
                <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Project Cost</span>
                <span className="font-bold text-neutral-900">
                  {extractedProfile.projectCost ? `₹${extractedProfile.projectCost.toLocaleString()}` : 'Not detected'}
                </span>
              </div>
            </div>

            <button
              onClick={handleMatch}
              disabled={isMatching}
              className="w-full flex justify-center items-center gap-2 px-6 py-3.5 bg-black text-white rounded-full font-semibold text-sm hover:bg-neutral-800 transition-all disabled:opacity-60 shadow-sm"
            >
              {isMatching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Schemes...</span>
                </>
              ) : (
                <>
                  <span>Find Matching Schemes</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div>
        <Disclaimer />
      </div>
    </div>
  );
}
