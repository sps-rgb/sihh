'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, MessageSquare, ArrowRight } from 'lucide-react';
import { GENDERS, CATEGORIES, BUSINESS_STATUSES, BUSINESS_TYPES, INDIAN_STATES } from '@/types';
import type { UserProfile } from '@/types';

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
    const genderMatch = text.match(/\b(woman|female|man|male)\b/i);
    if (genderMatch) {
      const g = genderMatch[1].toLowerCase();
      if (g === 'woman' || g === 'female') profile.gender = 'Female';
      else if (g === 'man' || g === 'male') profile.gender = 'Male';
    }

    // Category
    const categoryMatch = text.match(/\b(SC|ST|OBC|minority|general)\b/i);
    if (categoryMatch) {
      const c = categoryMatch[1].toUpperCase();
      if (['SC', 'ST', 'OBC'].includes(c)) profile.category = c as any;
      else if (c === 'MINORITY') profile.category = 'Minority';
      else profile.category = 'General';
    }

    // State (simple inclusion)
    for (const state of INDIAN_STATES) {
      if (text.toLowerCase().includes(state.toLowerCase())) {
        profile.state = state;
        break;
      }
    }

    // Business Type (simple keyword match)
    const lowerText = text.toLowerCase();
    if (lowerText.includes('farm') || lowerText.includes('agri')) profile.businessType = 'Agriculture';
    else if (lowerText.includes('manufactur')) profile.businessType = 'Manufacturing';
    else if (lowerText.includes('shop') || lowerText.includes('retail') || lowerText.includes('trad')) profile.businessType = 'Trading';
    else if (lowerText.includes('service') || lowerText.includes('consult')) profile.businessType = 'Service';
    else if (lowerText.includes('tailor') || lowerText.includes('textile') || lowerText.includes('cloth')) profile.businessType = 'Tailoring/Textiles';
    else if (lowerText.includes('food') || lowerText.includes('cook') || lowerText.includes('restaurant')) profile.businessType = 'Food';
    else if (lowerText.includes('handicraft') || lowerText.includes('craft') || lowerText.includes('artisan')) profile.businessType = 'Handicrafts';
    else if (lowerText.includes('tech') || lowerText.includes('software')) profile.businessType = 'Other';
    
    // Project Cost / Loan Requirement (Look for numbers near lakh/lac or just large numbers)
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
      setError('Please describe your profile and needs.');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    setExtractedProfile(null);

    // Simulate API delay for parsing
    setTimeout(() => {
      const extracted = parseTextClientSide(inputText);
      setExtractedProfile(extracted);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleMatch = async () => {
    if (!extractedProfile) return;

    setIsMatching(true);
    setError('');

    try {
      const response = await fetch('/api/match-schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(extractedProfile), // In a real app, you'd ensure missing required fields are handled
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
    <div className="flex-1 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            AI Scheme Assistant
          </h1>
          <p className="text-lg text-gray-600">
            Describe yourself and your business needs, and we'll help you find relevant schemes.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-sm text-amber-800">
          <p className="font-medium">⚠️ This NLP feature is a placeholder/demo.</p>
          <p>For the most accurate and reliable results in this MVP, please use the <Link href="/scheme-finder" className="underline font-bold hover:text-amber-900">structured form</Link>.</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden mb-8">
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tell us about yourself (Try: "I am a 25 year old woman from Maharashtra. I want to start a retail shop and need a loan of 5 lakhs. I belong to OBC category.")
            </label>
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="Describe your profile here..."
            />
            
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputText.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isAnalyzing && <Loader2 className="w-4 h-4 animate-spin" />}
                {isAnalyzing ? 'Analyzing...' : 'Analyze My Profile'}
              </button>
            </div>
          </div>
        </div>

        {extractedProfile && (
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <div className="p-6 bg-blue-50 border-b border-blue-100">
              <h2 className="text-xl font-bold text-gray-900">Extracted Information</h2>
              <p className="text-sm text-gray-600">Here's what we understood from your text.</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Age</span>
                  <span className="font-semibold text-gray-900">{extractedProfile.age || 'Not detected'}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Gender</span>
                  <span className="font-semibold text-gray-900">{extractedProfile.gender || 'Not detected'}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Category</span>
                  <span className="font-semibold text-gray-900">{extractedProfile.category || 'Not detected'}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">State</span>
                  <span className="font-semibold text-gray-900">{extractedProfile.state || 'Not detected'}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Business Type</span>
                  <span className="font-semibold text-gray-900">{extractedProfile.businessType || 'Not detected'}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Loan Required</span>
                  <span className="font-semibold text-gray-900">
                    {extractedProfile.projectCost ? `₹${extractedProfile.projectCost.toLocaleString()}` : 'Not detected'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleMatch}
                disabled={isMatching}
                className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-70"
              >
                {isMatching ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Finding Matches...
                  </>
                ) : (
                  <>
                    Find Matching Schemes
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
