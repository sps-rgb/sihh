'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-blue-600">Udhyog-Setu</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                DEMO
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/scheme-finder" className="text-gray-600 hover:text-blue-600 font-medium">
              Find Schemes
            </Link>
            <Link href="/chat" className="text-gray-600 hover:text-blue-600 font-medium">
              AI Assistant
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/scheme-finder"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Find Schemes
          </Link>
          <Link
            href="/chat"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            AI Assistant
          </Link>
        </div>
      )}
    </header>
  );
}
