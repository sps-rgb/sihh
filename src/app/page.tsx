'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Search, ShieldCheck, Layers, TrendingUp, Users, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import Disclaimer from '@/components/Disclaimer';

// Dynamic-load the 3D core to avoid SSR issues
const HeroQuantumCore = dynamic(() => import('@/components/3d/HeroQuantumCore'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[540px] lg:h-[620px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
        <span className="text-xs font-mono text-gray-600 tracking-wider">INITIALIZING SETU CORE...</span>
      </div>
    </div>
  ),
});

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Search,
    title: 'Smart Profile Ingestion',
    desc: 'Provide your demographic, financial, and business data once. Our multi-constraint engine ingests over 8 eligibility dimensions simultaneously.',
    color: 'text-cyan-600',
    glow: 'shadow-cyan-500/15',
    border: 'border-cyan-500/20',
    bgColor: 'bg-cyan-50',
  },
  {
    step: '02',
    icon: ShieldCheck,
    title: 'Transparent Match Engine',
    desc: 'Every match is explained with granular condition breakdowns — Eligible, Potentially Eligible, or Not Eligible — with zero black-box guessing.',
    color: 'text-emerald-600',
    glow: 'shadow-emerald-500/15',
    border: 'border-emerald-500/20',
    bgColor: 'bg-emerald-50',
  },
  {
    step: '03',
    icon: Layers,
    title: 'AI-Powered Scheme Co-Pilot',
    desc: 'Ask scheme-specific questions about documents, subsidies, loan caps, repayment periods, and step-by-step application guidance.',
    color: 'text-purple-600',
    glow: 'shadow-purple-500/15',
    border: 'border-purple-500/20',
    bgColor: 'bg-purple-50',
  },
];

const STATS = [
  { label: 'Government Schemes', value: '300+', icon: Layers, color: 'text-cyan-600' },
  { label: 'Eligibility Dimensions', value: '8', icon: ShieldCheck, color: 'text-emerald-600' },
  { label: 'Entrepreneur Segments', value: '12', icon: Users, color: 'text-purple-600' },
  { label: 'States & UTs Covered', value: '36', icon: MapPin, color: 'text-amber-600' },
];

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* ══ HERO SECTION ══ */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0 overflow-hidden">
        {/* Text Overlay + CTA */}
        <div className="text-center mb-8 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-cyan-100 border border-cyan-300/50 text-xs sm:text-sm font-semibold text-cyan-700 mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse" />
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="truncate">AI-Driven Scheme Matching</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-tight mb-4 sm:mb-6 text-gray-900">
            <span className="block">Unlock Your</span>
            <span className="block text-gradient-cyan">Government Capital</span>
          </h1>

          <p className="text-sm sm:text-lg lg:text-xl text-gray-700 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            Udhyog-Setu uses deterministic AI to match marginalized entrepreneurs to eligible government schemes,
            subsidies, and loans — with complete explainability.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2">
            <Link
              href="/scheme-finder"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full btn-quantum text-sm sm:text-base font-bold whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span>Find Schemes</span>
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </Link>
            <Link
              href="/chat"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full btn-ghost-glass text-sm sm:text-base font-semibold whitespace-nowrap"
            >
              <span>✦</span>
              <span>Ask AI</span>
            </Link>
          </div>
        </div>

        {/* ── 3D WebGL Quantum Core ── */}
        <div className="relative z-10">
          <HeroQuantumCore />
        </div>
      </section>

      {/* ══ LIVE STATS BAR ══ */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="glass-panel rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-4 sm:py-5 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border border-gray-200">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center min-w-0">
              <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color} mb-1.5 sm:mb-2 flex-shrink-0`} />
              <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${stat.color}`}>{stat.value}</span>
              <span className="text-xs text-gray-600 mt-1 leading-tight line-clamp-2">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block text-xs font-mono font-semibold uppercase tracking-widest text-cyan-600 mb-2 sm:mb-3">
            Intelligence Pipeline
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">How the Engine Works</h2>
          <p className="text-gray-600 mt-2 sm:mt-3 max-w-xl mx-auto text-xs sm:text-sm">
            Deterministic, explainable, transparent — no black-box AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {HOW_IT_WORKS.map((item) => (
            <div
              key={item.step}
              className={`glass-panel glass-panel-hover rounded-2xl sm:rounded-3xl p-6 sm:p-8 border ${item.border} shadow-lg ${item.glow} group ${item.bgColor}`}
            >
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-white border ${item.border} flex items-center justify-center flex-shrink-0`}>
                  <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color}`} />
                </div>
                <span className={`text-2xl sm:text-3xl font-mono font-black ${item.color} opacity-20 group-hover:opacity-30 transition-all`}>
                  {item.step}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 tracking-tight">{item.title}</h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-cyan-200 text-center relative overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-50">
          {/* Background glow accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/30 via-transparent to-purple-100/30 pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300/50 text-emerald-700 text-xs sm:text-sm font-semibold mb-3 sm:mb-4 whitespace-nowrap">
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              <span>Real government criteria</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight mb-2 sm:mb-3">
              Complete your profile in 2 minutes
            </h2>
            <p className="text-gray-700 text-xs sm:text-sm mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed">
              Tell us your details. We match you against 300+ scheme rules and show you exactly why you qualify.
            </p>
            <Link
              href="/scheme-finder"
              className="inline-flex items-center gap-2 px-8 sm:px-10 py-3 sm:py-4 rounded-full btn-quantum text-sm sm:text-base font-bold"
            >
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              Start Assessment
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 w-full">
        <Disclaimer />
      </div>
    </div>
  );
}
