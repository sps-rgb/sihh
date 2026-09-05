'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Zap } from 'lucide-react';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/scheme-finder', label: 'Find Schemes', icon: null },
  { href: '/chat', label: 'AI Assistant', icon: '✦' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? 'bg-[#07080c]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/50'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-all duration-300">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              Udhyog-Setu
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              SIH 2026
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.icon && <span className="text-cyan-400">{link.icon}</span>}
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/scheme-finder"
              className="ml-2 btn-quantum inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#07080c]/95 backdrop-blur-xl px-4 pb-6 pt-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/8 transition-all"
            >
              {link.icon && <span className="text-cyan-400">{link.icon}</span>}
              {link.label}
            </Link>
          ))}
          <Link
            href="/scheme-finder"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full btn-quantum text-sm font-semibold mt-2"
          >
            <Sparkles className="w-4 h-4" />
            Find My Schemes
          </Link>
        </div>
      )}
    </header>
  );
}
