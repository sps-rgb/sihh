'use client';

import React, { useState } from 'react';
import { Calculator, Sparkles, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/types';

interface RoiCalculatorProps {
  defaultLoanAmount?: number;
  maxLoanAmount?: number;
  defaultInterestRate?: string;
  defaultTenure?: string;
}

export default function RoiCalculator({
  defaultLoanAmount = 500000,
  maxLoanAmount = 2500000,
  defaultInterestRate = '7.5%',
  defaultTenure = '5 Years',
}: RoiCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState<number>(defaultLoanAmount || 500000);
  const [interestRate, setInterestRate] = useState<number>(7.5);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [subsidyPercent, setSubsidyPercent] = useState<number>(25);

  // Financial Calculations
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const effectivePrincipal = Math.max(0, loanAmount * (1 - subsidyPercent / 100));

  const emiWithoutSubsidy = monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : loanAmount / totalMonths;

  const emiWithSubsidy = monthlyRate > 0
    ? (effectivePrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : effectivePrincipal / totalMonths;

  const subsidySavings = (loanAmount * subsidyPercent) / 100;
  const totalRepaymentWithSubsidy = emiWithSubsidy * totalMonths;
  const totalRepaymentWithoutSubsidy = emiWithoutSubsidy * totalMonths;
  const totalInterestSaved = totalRepaymentWithoutSubsidy - totalRepaymentWithSubsidy;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Interactive Scheme Subsidy & EMI Simulator</h3>
            <p className="text-xs text-neutral-400">Real-time simulation of government capital subsidy impact on your loan</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Live Calculator</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sliders Input Column */}
        <div className="space-y-5">
          {/* Loan Amount */}
          <div>
            <div className="flex justify-between items-center text-sm font-medium mb-2">
              <label className="text-neutral-300">Project / Loan Requirement</label>
              <span className="font-mono font-bold text-cyan-400">{formatCurrency(loanAmount)}</span>
            </div>
            <input
              type="range"
              min="50000"
              max={maxLoanAmount || 2500000}
              step="50000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Subsidy Percentage */}
          <div>
            <div className="flex justify-between items-center text-sm font-medium mb-2">
              <label className="text-neutral-300">Government Capital Subsidy</label>
              <span className="font-mono font-bold text-emerald-400">{subsidyPercent}% Grant</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={subsidyPercent}
              onChange={(e) => setSubsidyPercent(Number(e.target.value))}
              className="w-full h-2 bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          {/* Interest Rate & Tenure */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Bank Interest Rate (% p.a.)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="20"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full rounded-2xl glass-input px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Repayment Tenure (Years)</label>
              <input
                type="number"
                min="1"
                max="15"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full rounded-2xl glass-input px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Results HUD Display */}
        <div className="bg-obsidian-900/80 rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/5 text-sm">
              <span className="text-neutral-400">Direct Capital Subsidy:</span>
              <span className="font-mono font-bold text-emerald-400">+{formatCurrency(subsidySavings)} (Non-Repayable)</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/5 text-sm">
              <span className="text-neutral-400">Net Repayable Loan:</span>
              <span className="font-mono font-bold text-white">{formatCurrency(effectivePrincipal)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-400">Standard EMI vs Subsidized:</span>
              <span className="font-mono text-xs line-through text-neutral-500 mr-2">
                {formatCurrency(Math.round(emiWithoutSubsidy))}/mo
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 to-emerald-950/40 border border-cyan-500/20">
            <span className="block text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-1">
              Estimated Monthly EMI
            </span>
            <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-2">
              <span>{formatCurrency(Math.round(emiWithSubsidy))}</span>
              <span className="text-xs font-normal text-neutral-400">/ month</span>
            </div>
            <span className="block text-xs text-emerald-400 mt-2 font-medium">
              ✨ You save {formatCurrency(Math.round(totalInterestSaved + subsidySavings))} total over {tenureYears} years!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
