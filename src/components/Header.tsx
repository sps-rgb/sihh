'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Sun, Moon } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      } else if (stored === 'light') {
        document.documentElement.classList.remove('dark');
        setIsDark(false);
      } else {
        // follow system preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
          setIsDark(true);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    try {
      if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        setIsDark(false);
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        setIsDark(true);
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="text-xl font-bold tracking-tight text-neutral-900">Udhyog-Setu</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-900 text-white">
                DEMO
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/scheme-finder" 
              className="text-neutral-600 hover:text-black font-medium text-sm transition-colors px-3 py-1.5 rounded-full hover:bg-neutral-100"
            >
              Find Schemes
            </Link>
            <Link 
              href="/chat" 
              className="text-neutral-600 hover:text-black font-medium text-sm transition-colors px-3 py-1.5 rounded-full hover:bg-neutral-100 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Assistant</span>
            </Link>
            <Link
              href="/scheme-finder"
              className="bg-black hover:bg-neutral-800 text-white text-sm font-medium px-5 py-2 rounded-full transition-all shadow-sm"
            >
              Get Started
            </Link>
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="ml-2 p-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700"
            >
              {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-neutral-700 hover:text-black p-2 rounded-full hover:bg-neutral-100 focus:outline-none"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 pt-3 pb-5 space-y-2 rounded-b-3xl shadow-lg animate-in slide-in-from-top-2">
          <Link
            href="/scheme-finder"
            className="block px-4 py-2.5 rounded-2xl text-base font-medium text-neutral-800 hover:text-black hover:bg-neutral-100"
            onClick={() => setIsOpen(false)}
          >
            Find Schemes
          </Link>
          <Link
            href="/chat"
            className="block px-4 py-2.5 rounded-2xl text-base font-medium text-neutral-800 hover:text-black hover:bg-neutral-100"
            onClick={() => setIsOpen(false)}
          >
            AI Assistant
          </Link>
          <div className="px-4 pt-2">
            <button
              onClick={() => { toggleTheme(); setIsOpen(false); }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl border border-neutral-200 bg-white text-sm font-medium"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
