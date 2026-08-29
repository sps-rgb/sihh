'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GENDERS, CATEGORIES, BUSINESS_STATUSES, BUSINESS_TYPES, INCOME_RANGES, INDIAN_STATES } from '@/types';
import type { UserProfile, Gender, Category, BusinessStatus, BusinessType, IncomeRange } from '@/types';
import { Loader2 } from 'lucide-react';

export default function ProfileForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    existingBusiness: false,
    existingLoan: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;
    
    if (type === 'number') {
      parsedValue = value ? Number(value) : '';
    } else if (type === 'radio') {
      parsedValue = value === 'true';
    }
    
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const validateStep1 = () => {
    if (!formData.age || formData.age < 18 || formData.age > 100) return 'Please enter a valid age between 18 and 100.';
    if (!formData.gender) return 'Please select a gender.';
    if (!formData.state) return 'Please select a state.';
    if (!formData.category) return 'Please select a social category.';
    return '';
  };

  const validateStep2 = () => {
    if (!formData.businessStatus) return 'Please select your employment/business status.';
    if (!formData.businessType) return 'Please select a business type.';
    if (formData.existingBusiness === undefined) return 'Please indicate if you have an existing business.';
    if (formData.existingLoan === undefined) return 'Please indicate if you have an existing loan.';
    return '';
  };

  const validateStep3 = () => {
    if (!formData.annualIncome) return 'Please select your annual family income.';
    if (!formData.projectCost || formData.projectCost <= 0) return 'Please enter a valid project/loan requirement.';
    return '';
  };

  const nextStep = () => {
    let err = '';
    if (step === 1) err = validateStep1();
    if (step === 2) err = validateStep2();
    
    if (err) {
      setError(err);
    } else {
      setError('');
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setError('');
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep3();
    if (err) {
      setError(err);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/match-schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to match schemes');
      }

      const data = await response.json();
      
      sessionStorage.setItem('user-profile', JSON.stringify(formData));
      sessionStorage.setItem('match-results', JSON.stringify(data.matches));
      
      router.push('/results');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full z-0 transition-all duration-300" 
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
          
          {[1, 2, 3].map((num) => (
            <div key={num} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {num}
              </div>
              <span className={`text-xs mt-2 font-medium ${step >= num ? 'text-blue-600' : 'text-gray-500'}`}>
                {num === 1 ? 'Personal' : num === 2 ? 'Business' : 'Financial'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age || ''}
                onChange={handleChange}
                min="18"
                max="100"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 25"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender || ''}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select
                name="state"
                value={formData.state || ''}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Social Category</label>
              <select
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Business Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment / Business Status</label>
              <select
                name="businessStatus"
                value={formData.businessStatus || ''}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                {BUSINESS_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Type / Industry</label>
              <select
                name="businessType"
                value={formData.businessType || ''}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Industry</option>
                {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Do you have an existing business?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="existingBusiness" value="true" checked={formData.existingBusiness === true} onChange={handleChange} className="text-blue-600 focus:ring-blue-500" />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="existingBusiness" value="false" checked={formData.existingBusiness === false} onChange={handleChange} className="text-blue-600 focus:ring-blue-500" />
                  <span>No</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Do you currently have a business loan?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="existingLoan" value="true" checked={formData.existingLoan === true} onChange={handleChange} className="text-blue-600 focus:ring-blue-500" />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="existingLoan" value="false" checked={formData.existingLoan === false} onChange={handleChange} className="text-blue-600 focus:ring-blue-500" />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Family Income</label>
              <select
                name="annualIncome"
                value={formData.annualIncome || ''}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Income Range</option>
                {INCOME_RANGES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Cost / Loan Requirement (₹)</label>
              <input
                type="number"
                name="projectCost"
                value={formData.projectCost || ''}
                onChange={handleChange}
                min="1000"
                step="1000"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 500000"
              />
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          ) : (
            <div></div> // Spacer
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Matching...' : 'Find My Schemes'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
