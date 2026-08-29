import Link from 'next/link';
import { Search, BarChart3, MessageCircle } from 'lucide-react';
import Disclaimer from '@/components/Disclaimer';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            Find Government Schemes That Match You
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Tell us about yourself and your business. We'll identify schemes that may be relevant to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/scheme-finder" 
              className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
            >
              Find My Schemes
            </Link>
            <Link 
              href="/chat" 
              className="inline-flex justify-center items-center px-8 py-3.5 border-2 border-blue-600 text-base font-medium rounded-lg text-blue-700 bg-transparent hover:bg-blue-50 transition-all"
            >
              Ask AI Assistant
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                We compare your profile against scheme eligibility criteria to find the best matches.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparent Results</h3>
              <p className="text-gray-600 leading-relaxed">
                See exactly why each scheme was recommended with a detailed eligibility breakdown.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Assistant</h3>
              <p className="text-gray-600 leading-relaxed">
                Ask questions about any scheme and get instant answers based on scheme data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Disclaimer />
      </div>
    </div>
  );
}
