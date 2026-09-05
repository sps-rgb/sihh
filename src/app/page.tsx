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
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
        <span className="text-xs font-mono text-neutral-500 tracking-wider">INITIALIZING SETU CORE...</span>
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
    color: 'text-cyan-400',
    glow: 'shadow-cyan-500/20',
    border: 'border-cyan-500/20',
  },
  {
    step: '02',
    icon: ShieldCheck,
    title: 'Transparent Match Engine',
    desc: 'Every match is explained with granular condition breakdowns — Eligible, Potentially Eligible, or Not Eligible — with zero black-box guessing.',
    color: 'text-emerald-400',
    glow: 'shadow-emerald-500/20',
    border: 'border-emerald-500/20',
  },
  {
    step: '03',
    icon: Layers,
    title: 'AI-Powered Scheme Co-Pilot',
    desc: 'Ask scheme-specific questions about documents, subsidies, loan caps, repayment periods, and step-by-step application guidance.',
    color: 'text-purple-400',
    glow: 'shadow-purple-500/20',
    border: 'border-purple-500/20',
  },
];

const STATS = [
  { label: 'Government Schemes', value: '300+', icon: Layers, color: 'text-cyan-400' },
  { label: 'Eligibility Dimensions', value: '8', icon: ShieldCheck, color: 'text-emerald-400' },
  { label: 'Entrepreneur Segments', value: '12', icon: Users, color: 'text-purple-400' },
  { label: 'States & UTs Covered', value: '36', icon: MapPin, color: 'text-amber-400' },
];

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* ══ HERO SECTION ══ */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0 overflow-hidden">
        {/* Text Overlay + CTA */}
        <div className="text-center mb-8 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/8 border border-cyan-500/20 text-xs font-semibold text-cyan-300 mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Government Scheme Matching — SIH 26092</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-6">
            <span className="block text-white">Unlock Your</span>
            <span className="block text-gradient-cyan">Government Capital</span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Udhyog-Setu uses deterministic AI to match marginalized entrepreneurs to eligible government schemes,
            subsidies, and loans — with complete explainability and zero guesswork.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/scheme-finder"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full btn-quantum text-base font-bold"
            >
              <Sparkles className="w-4 h-4" />
              <span>Find My Eligible Schemes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/chat"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full btn-ghost-glass text-base font-semibold"
            >
              <span>✦</span>
              <span>Ask AI Assistant</span>
            </Link>
          </div>
        </div>

        {/* ── 3D WebGL Quantum Core ── */}
        <div className="relative z-10">
          <HeroQuantumCore />
        </div>
      </section>

      {/* ══ LIVE STATS BAR ══ */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass-panel rounded-3xl px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6 border border-white/8">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <span className={`text-3xl font-extrabold font-mono ${stat.color}`}>{stat.value}</span>
              <span className="text-xs text-neutral-500 mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-mono font-semibold uppercase tracking-widest text-cyan-500 mb-3">
            Intelligence Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">How the Engine Works</h2>
          <p className="text-neutral-500 mt-3 max-w-xl mx-auto text-sm">
            Deterministic, explainable, transparent — no black-box AI. Every eligibility decision is fully justified.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((item) => (
            <div
              key={item.step}
              className={`glass-panel glass-panel-hover rounded-3xl p-8 border ${item.border} shadow-xl ${item.glow} group`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-black/30 border ${item.border} flex items-center justify-center`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className={`text-3xl font-mono font-black ${item.color} opacity-20 group-hover:opacity-50 transition-all`}>
                  {item.step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{item.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="glass-panel rounded-3xl p-10 border border-cyan-500/15 text-center relative overflow-hidden">
          {/* Background glow accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-purple-900/20 pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real government eligibility criteria — not generic advice</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              Complete your 3-step profile in under 2 minutes
            </h2>
            <p className="text-neutral-400 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
              Tell us your category, state, business sector, and funding requirement. We match you against 300+ scheme
              rules and show you exactly why you qualify — or why you don't.
            </p>
            <Link
              href="/scheme-finder"
              className="inline-flex items-center gap-2.5 px-10 py-4 rounded-full btn-quantum text-base font-bold"
            >
              <Sparkles className="w-4 h-4" />
              Start My Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
        <Disclaimer />
      </div>
    </div>
  );
}
