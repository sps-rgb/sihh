'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GENDERS,
  CATEGORIES,
  BUSINESS_STATUSES,
  BUSINESS_TYPES,
  INCOME_RANGES,
  INDIAN_STATES,
  normalizeStateName,
  formatCurrency
} from '@/types';
import type { UserProfile } from '@/types';
import { Loader2, ArrowRight, ArrowLeft, Check, Sparkles, User, Briefcase, DollarSign } from 'lucide-react';

const STEP_META = [
  { label: 'Personal', icon: User, desc: 'Your demographic details' },
  { label: 'Business', icon: Briefcase, desc: 'Your venture information' },
  { label: 'Financial', icon: DollarSign, desc: 'Income & funding needs' },
];

export default function ProfileForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [stateInput, setStateInput] = useState('');

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    existingBusiness: false,
    existingLoan: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const name = target.name;
    const type = target.type;
    const value = target.value;

    let parsedValue: any = value;
    if (type === 'number') parsedValue = value ? Number(value) : '';
    else if (type === 'checkbox') parsedValue = target.checked;
    else if (value === 'true' || value === 'false') parsedValue = value === 'true';
    else parsedValue = value;

    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setStateInput(rawVal);
    const normalized = normalizeStateName(rawVal);
    setFormData((prev) => ({ ...prev, state: INDIAN_STATES.includes(normalized) ? normalized : rawVal }));
  };

  const handleStateBlur = () => {
    if (stateInput) {
      const normalized = normalizeStateName(stateInput);
      if (INDIAN_STATES.includes(normalized)) {
        setStateInput(normalized);
        setFormData((prev) => ({ ...prev, state: normalized }));
      }
    }
  };

  const selectStateFromList = (stateName: string) => {
    setStateInput(stateName);
    setFormData((prev) => ({ ...prev, state: stateName }));
  };

  const validateStep1 = () => {
    if (!formData.age || (typeof formData.age === 'number' && (formData.age < 18 || formData.age > 100))) return 'Please enter a valid age between 18 and 100.';
    if (!formData.gender) return 'Please select a gender.';
    const normalizedState = normalizeStateName((formData.state as string) || stateInput || '');
    if (!normalizedState) return 'Please enter or select a state.';
    if (!INDIAN_STATES.includes(normalizedState)) return `State "${normalizedState}" not recognized.`;
    setFormData((prev) => ({ ...prev, state: normalizedState }));
    if (!formData.category) return 'Please select a social category.';
    return '';
  };

  const validateStep2 = () => {
    if (!formData.businessStatus) return 'Please select your employment/business status.';
    if (!formData.businessType) return 'Please select a business type.';
    return '';
  };

  const validateStep3 = () => {
    if (!formData.annualIncome) return 'Please select your annual family income.';
    if (!formData.projectCost || Number(formData.projectCost) <= 0) return 'Please enter a valid project/loan requirement.';
    return '';
  };

  const nextStep = () => {
    console.log('ProfileForm.nextStep called, current step=', step);
    let err = '';
    if (step === 1) err = validateStep1();
    if (step === 2) err = validateStep2();
    if (err) { setError(err); console.warn('Validation error on nextStep:', err); } else { setError(''); setStep((p) => p + 1); }
  };

  const prevStep = () => { console.log('ProfileForm.prevStep called, current step=', step); setError(''); setStep((p) => p - 1); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ProfileForm.handleSubmit called, formData=', formData);
    const err = validateStep3();
    if (err) { setError(err); console.warn('Validation error on submit:', err); return; }
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/match-schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to match schemes');
      const data = await response.json();
      sessionStorage.setItem('user-profile', JSON.stringify(formData));
      sessionStorage.setItem('match-results', JSON.stringify(data.matches));
      router.push('/results');
    } catch (err: any) {
      console.error('match-schemes error', err);
      setError(err.message || 'An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const QUICK_STATES = ['UP', 'HR', 'Delhi', 'MP', 'Rajasthan', 'Maharashtra', 'Bihar', 'Gujarat'];
  const QUICK_AMOUNTS = [
    { label: '₹1L', val: 100000 }, { label: '₹3L', val: 300000 },
    { label: '₹5L', val: 500000 }, { label: '₹10L', val: 1000000 },
    { label: '₹15L', val: 1500000 }, { label: '₹25L', val: 2500000 },
  ];

  return (
    <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 max-w-2xl mx-auto border border-white/8 shadow-2xl relative z-20">
      {/* Step Progress */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-1 sm:gap-0">
          {STEP_META.map((meta, idx) => {
            const stepNum = idx + 1;
            const isCompleted = step > stepNum;
            const isCurrent = step === stepNum;
            return (
              <div key={stepNum} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                    isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40' :
                    isCurrent ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/40 ring-4 ring-cyan-500/20' :
                    'bg-white/5 border border-white/15 text-neutral-500'
                  }`}>
                    {isCompleted ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : stepNum}
                  </div>
                  <span className={`text-[10px] sm:text-xs mt-1.5 font-semibold text-center leading-tight ${isCurrent ? 'text-cyan-400' : isCompleted ? 'text-emerald-400' : 'text-neutral-600'}`}>
                    {meta.label}
                  </span>
                </div>
                {idx < STEP_META.length - 1 && (
                  <div className="flex-1 h-0.5 mx-1 sm:mx-3 relative mt-[-20px]">
                    <div className="w-full h-full bg-white/8 rounded" />
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded transition-all duration-500"
                      style={{ width: step > stepNum ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl sm:rounded-2xl text-xs sm:text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ── Step 1: Personal ── */}
        {step === 1 && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Personal Details</h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">Demographic data to evaluate your scheme eligibility.</p>
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Age</label>
              <input
                type="number" name="age" value={formData.age || ''} onChange={handleChange}
                min="18" max="100" placeholder="e.g. 28"
                className="w-full rounded-xl sm:rounded-2xl glass-input px-3 sm:px-4 py-2 sm:py-3 text-sm"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Gender</label>
              <div className="grid grid-cols-3 gap-2">
                {GENDERS.map((g) => (
                  <label key={g} className={`flex items-center justify-center p-2.5 sm:p-3 rounded-lg sm:rounded-xl border cursor-pointer transition-all text-xs sm:text-sm font-medium truncate ${
                    formData.gender === g
                      ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300'
                      : 'border-white/10 bg-white/3 text-neutral-400 hover:border-white/25 hover:text-white'
                  }`}>
                    <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} className="sr-only" />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            {/* State */}
            <div>
              <div className="flex justify-between items-center mb-2 gap-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">State / UT</label>
                <span className="text-[9px] text-neutral-600 text-right">Supports: UP, HR, DL…</span>
              </div>
              <input
                type="text" list="indian-states-list"
                value={stateInput || (formData.state as string) || ''} onChange={handleStateChange} onBlur={handleStateBlur}
                placeholder="Type state name (e.g. UP)"
                autoComplete="off"
                className="w-full rounded-xl sm:rounded-2xl glass-input px-3 sm:px-4 py-2 sm:py-3 text-sm"
              />
              <datalist id="indian-states-list">{INDIAN_STATES.map((s) => <option key={s} value={s} />)}</datalist>
              <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2">
                {QUICK_STATES.map((st) => {
                  const full = normalizeStateName(st);
                  return (
                    <button key={st} type="button" onClick={() => selectStateFromList(full)}
                      className={`text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full border transition-all whitespace-nowrap ${formData.state === full ? 'bg-cyan-500 border-cyan-500 text-white font-semibold' : 'border-white/10 text-neutral-400 hover:text-white hover:border-white/30'}`}>
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Social Category</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((c) => (
                  <label key={c} className={`flex items-center justify-center p-2.5 sm:p-3 rounded-lg sm:rounded-xl border cursor-pointer transition-all text-xs sm:text-sm font-medium truncate ${
                    formData.category === c
                      ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300'
                      : 'border-white/10 bg-white/3 text-neutral-400 hover:border-white/25 hover:text-white'
                  }`}>
                    <input type="radio" name="category" value={c} checked={formData.category === c} onChange={handleChange} className="sr-only" />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Business ── */}
        {step === 2 && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Business Details</h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">Tell us about your venture and operations.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Employment / Business Status</label>
              <select name="businessStatus" value={formData.businessStatus || ''} onChange={handleChange}
                className="w-full rounded-xl sm:rounded-2xl glass-input px-3 sm:px-4 py-2 sm:py-3 text-sm appearance-none">
                <option value="" className="bg-neutral-900">Select Status</option>
                {BUSINESS_STATUSES.map((s) => <option key={s} value={s} className="bg-neutral-900">{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Business Sector / Industry</label>
              <div className="grid grid-cols-2 gap-2">
                {BUSINESS_TYPES.map((t) => (
                  <label key={t} className={`flex items-center justify-center p-2.5 sm:p-3 rounded-lg sm:rounded-xl border cursor-pointer transition-all text-xs sm:text-sm font-medium truncate ${
                    formData.businessType === t
                      ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300'
                      : 'border-white/10 bg-white/3 text-neutral-400 hover:border-white/25 hover:text-white'
                  }`}>
                    <input type="radio" name="businessType" value={t} checked={formData.businessType === t} onChange={handleChange} className="sr-only" />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Existing Business?</label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[{ val: true, label: 'Yes, Existing' }, { val: false, label: 'No, New' }].map((opt) => (
                  <label key={String(opt.val)} className={`flex items-center justify-center gap-2 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl border cursor-pointer transition-all text-xs sm:text-sm font-medium truncate ${
                    formData.existingBusiness === opt.val
                      ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300'
                      : 'border-white/10 bg-white/3 text-neutral-400 hover:border-white/25 hover:text-white'
                  }`}>
                    <input type="radio" name="existingBusiness" value={String(opt.val)} checked={formData.existingBusiness === opt.val} onChange={handleChange} className="sr-only" />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Business Loan?</label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[{ val: true, label: 'Yes, Active' }, { val: false, label: 'No Loans' }].map((opt) => (
                  <label key={String(opt.val)} className={`flex items-center justify-center gap-2 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl border cursor-pointer transition-all text-xs sm:text-sm font-medium truncate ${
                    formData.existingLoan === opt.val
                      ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300'
                      : 'border-white/10 bg-white/3 text-neutral-400 hover:border-white/25 hover:text-white'
                  }`}>
                    <input type="radio" name="existingLoan" value={String(opt.val)} checked={formData.existingLoan === opt.val} onChange={handleChange} className="sr-only" />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Financial ── */}
        {step === 3 && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Financial Requirements</h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">Family income and project funding needed.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Annual Family Income</label>
              <div className="grid grid-cols-1 gap-2">
                {INCOME_RANGES.map((i) => (
                  <label key={i} className={`flex items-center p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl border cursor-pointer transition-all text-xs sm:text-sm font-medium ${
                    formData.annualIncome === i
                      ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300'
                      : 'border-white/10 bg-white/3 text-neutral-400 hover:border-white/25 hover:text-white'
                  }`}>
                    <input type="radio" name="annualIncome" value={i} checked={formData.annualIncome === i} onChange={handleChange} className="sr-only" />
                    {i}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 gap-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">Project Cost (₹)</label>
                {formData.projectCost && Number(formData.projectCost) > 0 && (
                  <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 sm:px-2.5 py-0.5 rounded-full border border-cyan-500/20 whitespace-nowrap">
                    {formatCurrency(Number(formData.projectCost))}
                  </span>
                )}
              </div>
              <input
                type="number" name="projectCost" value={formData.projectCost || ''} onChange={handleChange}
                min="0" step="any" placeholder="e.g. 300000"
                className="w-full rounded-xl sm:rounded-2xl glass-input px-3 sm:px-4 py-2 sm:py-3 text-sm font-mono"
              />
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                {QUICK_AMOUNTS.map((item) => (
                  <button key={item.val} type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, projectCost: item.val }))}
                    className={`text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border font-semibold transition-all whitespace-nowrap ${
                      formData.projectCost === item.val
                        ? 'bg-cyan-500 border-cyan-500 text-white'
                        : 'border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
                    }`}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-white/8 flex justify-between items-center gap-3">
          {step > 1 ? (
            <button type="button" onClick={prevStep}
              className="btn-ghost-glass inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium flex-1 sm:flex-none">
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Back</span>
            </button>
          ) : <div className="flex-1 sm:flex-none" />}

          {step < 3 ? (
            <button type="button" onClick={nextStep}
              className="btn-quantum inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold flex-1 sm:flex-none whitespace-nowrap">
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          ) : (
            <button type="submit" disabled={isLoading}
              className="btn-quantum inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold flex-1 sm:flex-none disabled:opacity-60 whitespace-nowrap">
              {isLoading && <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />}
              <span>{isLoading ? 'Evaluating...' : 'Find Schemes'}</span>
              {!isLoading && <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
