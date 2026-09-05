'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Sparkles, ArrowRight, Bot, Zap } from 'lucide-react';
import { STATE_ALIASES, normalizeStateName, INDIAN_STATES } from '@/types';
import type { UserProfile } from '@/types';
import Disclaimer from '@/components/Disclaimer';

const PERSONA_PRESETS = [
  {
    label: 'SC Woman Artisan, UP',
    text: 'I am a 28 year old woman from Uttar Pradesh. I want to start a handicraft business requiring a loan of 3 lakh. I belong to SC category.',
  },
  {
    label: 'OBC Farmer, Bihar',
    text: 'I am a 35 year old male from Bihar. I want to expand my agricultural equipment business. OBC category. Need 5 lakh loan.',
  },
  {
    label: 'ST Youth, Jharkhand',
    text: 'I am a 22 year old tribal youth from Jharkhand looking to start a food processing unit. I am from ST category and need 2 lakh rupees.',
  },
];

export default function ChatModePage() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [extractedProfile, setExtractedProfile] = useState<Partial<UserProfile> | null>(null);
  const [error, setError] = useState('');

  const parseTextClientSide = (text: string): Partial<UserProfile> => {
    const profile: Partial<UserProfile> = { existingBusiness: false, existingLoan: false };

    const ageMatch = text.match(/(\d{2})\s*(?:year|yr|age|years old)/i);
    if (ageMatch) profile.age = parseInt(ageMatch[1], 10);

    const genderMatch = text.match(/\b(woman|female|women|man|male|men)\b/i);
    if (genderMatch) {
      const g = genderMatch[1].toLowerCase();
      if (['woman', 'female', 'women'].includes(g)) profile.gender = 'Female';
      else if (['man', 'male', 'men'].includes(g)) profile.gender = 'Male';
    }

    const categoryMatch = text.match(/\b(SC|ST|OBC|minority|tribal|general)\b/i);
    if (categoryMatch) {
      const c = categoryMatch[1].toUpperCase();
      if (['SC', 'ST', 'OBC'].includes(c)) profile.category = c as any;
      else if (c === 'MINORITY') profile.category = 'Minority';
      else if (c === 'TRIBAL') profile.category = 'ST';
      else profile.category = 'General';
    }

    for (const [alias, fullState] of Object.entries(STATE_ALIASES)) {
      const pattern = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (pattern.test(text)) { profile.state = fullState; break; }
    }
    if (!profile.state) {
      for (const state of INDIAN_STATES) {
        if (text.toLowerCase().includes(state.toLowerCase())) { profile.state = state; break; }
      }
    }

    const lowerText = text.toLowerCase();
    if (lowerText.includes('farm') || lowerText.includes('agri')) profile.businessType = 'Agriculture';
    else if (lowerText.includes('manufactur')) profile.businessType = 'Manufacturing';
    else if (lowerText.includes('shop') || lowerText.includes('retail') || lowerText.includes('trad')) profile.businessType = 'Trading';
    else if (lowerText.includes('service') || lowerText.includes('consult')) profile.businessType = 'Service';
    else if (lowerText.includes('tailor') || lowerText.includes('textile') || lowerText.includes('cloth')) profile.businessType = 'Tailoring/Textiles';
    else if (lowerText.includes('food') || lowerText.includes('cook') || lowerText.includes('restaurant')) profile.businessType = 'Food';
    else if (lowerText.includes('handicraft') || lowerText.includes('craft') || lowerText.includes('artisan')) profile.businessType = 'Handicrafts';

    const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac)s?/i);
    if (lakhMatch) {
      profile.projectCost = parseFloat(lakhMatch[1]) * 100000;
    } else {
      const numMatch = text.match(/(?:need|require|want|loan of)\s*(?:rs\.?|rupees|₹)?\s*(\d+(?:,\d+)*)/i);
      if (numMatch) profile.projectCost = parseInt(numMatch[1].replace(/,/g, ''), 10);
    }

    return profile;
  };

  const handleAnalyze = () => {
    if (!inputText.trim()) { setError('Please describe your profile and business needs.'); return; }
    setError(''); setIsAnalyzing(true); setExtractedProfile(null);
    setTimeout(() => {
      const extracted = parseTextClientSide(inputText);
      setExtractedProfile(extracted);
      setIsAnalyzing(false);
    }, 800);
  };

  const handleMatch = async () => {
    if (!extractedProfile) return;
    setIsMatching(true); setError('');
    try {
      const response = await fetch('/api/match-schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(extractedProfile),
      });
      if (!response.ok) throw new Error('Failed to match schemes');
      const data = await response.json();
      sessionStorage.setItem('user-profile', JSON.stringify(extractedProfile));
      sessionStorage.setItem('match-results', JSON.stringify(data.matches));
      router.push('/results');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setIsMatching(false);
    }
  };

  const PROFILE_FIELDS: { label: string; key: keyof UserProfile; color: string }[] = [
    { label: 'Age', key: 'age', color: 'text-cyan-400' },
    { label: 'Gender', key: 'gender', color: 'text-purple-400' },
    { label: 'Category', key: 'category', color: 'text-amber-400' },
    { label: 'State', key: 'state', color: 'text-emerald-400' },
    { label: 'Sector', key: 'businessType', color: 'text-blue-400' },
    { label: 'Project Cost', key: 'projectCost', color: 'text-pink-400' },
  ];

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400 mb-2">
          <Bot className="w-3.5 h-3.5" />
          Conversational AI — NLP Entity Extraction
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">AI Profile Intelligence Lab</h1>
        <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
          Describe yourself in plain text. Our NLP engine extracts your demographic parameters automatically and evaluates matching schemes.
        </p>
      </div>

      {/* Persona Quick Fill */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Quick-fill Persona Presets:</span>
        <div className="flex flex-wrap gap-2">
          {PERSONA_PRESETS.map((preset) => (
            <button key={preset.label} onClick={() => setInputText(preset.text)}
              className="text-xs px-3.5 py-2 rounded-full border border-white/10 text-neutral-400 hover:border-purple-500/40 hover:text-purple-300 hover:bg-purple-500/5 transition-all font-medium">
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Text Input Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/8 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-white/8 pb-4">
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <label className="block text-sm font-bold text-white">Describe Yourself</label>
            <span className="text-xs text-neutral-500">Include age, gender, state, category, sector, and funding needed</span>
          </div>
        </div>

        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g. I am a 28 year old woman from UP. I want to start a tailoring business requiring a loan of 4 lakh. I belong to SC category."
          className="w-full rounded-2xl glass-input px-4 py-4 text-sm leading-relaxed resize-none"
        />

        {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-1">
          <span className="text-xs text-neutral-600">Supports: UP, HR, DL, MH, SC, OBC, lakh amounts…</span>
          <button onClick={handleAnalyze} disabled={isAnalyzing || !inputText.trim()}
            className="w-full sm:w-auto btn-quantum inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm disabled:opacity-50">
            {isAnalyzing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <Zap className="w-3.5 h-3.5" />
            <span>{isAnalyzing ? 'Analyzing...' : 'Extract & Analyze'}</span>
          </button>
        </div>
      </div>

      {/* Extracted Profile Display */}
      {extractedProfile && (
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/8 animate-in fade-in slide-in-from-bottom-3 duration-400">
          <div className="p-5 sm:p-6 border-b border-white/8 bg-gradient-to-r from-purple-950/30 to-cyan-950/20">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Extracted Profile Parameters
            </h2>
            <p className="text-xs text-neutral-500 mt-1">NLP entity extraction results — review before running scheme evaluation.</p>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROFILE_FIELDS.map((field) => {
                const value = extractedProfile[field.key];
                const displayValue = field.key === 'projectCost' && value
                  ? `₹${Number(value).toLocaleString()}`
                  : value
                    ? String(value) + (field.key === 'age' ? ' yrs' : '')
                    : null;
                return (
                  <div key={field.label} className={`glass-panel rounded-xl p-3.5 border ${displayValue ? 'border-white/8' : 'border-red-500/15 bg-red-500/3'}`}>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-1">{field.label}</span>
                    <span className={`font-bold text-sm ${displayValue ? field.color : 'text-red-400/60'}`}>
                      {displayValue || '⚠ Not detected'}
                    </span>
                  </div>
                );
              })}
            </div>

            <button onClick={handleMatch} disabled={isMatching}
              className="w-full btn-quantum flex justify-center items-center gap-2 px-6 py-4 rounded-2xl font-bold text-base disabled:opacity-60">
              {isMatching ? (
                <><Loader2 className="w-5 h-5 animate-spin" /><span>Evaluating Schemes...</span></>
              ) : (
                <><span>Find Matching Schemes</span><ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>
      )}

      <Disclaimer />
    </div>
  );
}
