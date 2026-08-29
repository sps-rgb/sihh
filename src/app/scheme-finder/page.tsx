'use client';

import ProfileForm from '@/components/ProfileForm';
import Disclaimer from '@/components/Disclaimer';

export default function SchemeFinderPage() {
  return (
    <div className="flex-1 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Find Your Matching Schemes</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Fill in your details and we'll match you with relevant schemes.
        </p>
      </div>

      <ProfileForm />

      <div className="max-w-2xl mx-auto mt-12">
        <Disclaimer />
      </div>
    </div>
  );
}
