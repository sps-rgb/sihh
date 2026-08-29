'use client';

import ProfileForm from '@/components/ProfileForm';
import Disclaimer from '@/components/Disclaimer';

export default function SchemeFinderPage() {
  return (
    <div className="flex-1 max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
          Find Your Matching Schemes
        </h1>
        <p className="text-base text-neutral-500 max-w-xl mx-auto">
          Complete the 3-step profile assessment to discover government schemes tailored to your entrepreneurial needs.
        </p>
      </div>

      <ProfileForm />

      <div className="max-w-2xl mx-auto pt-4">
        <Disclaimer />
      </div>
    </div>
  );
}
