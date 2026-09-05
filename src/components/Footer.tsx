import Link from 'next/link';
import { Zap, ExternalLink } from 'lucide-react';

const FOOTER_LINKS = [
  { label: 'Find Schemes', href: '/scheme-finder' },
  { label: 'AI Assistant', href: '/chat' },
];

export default function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-white/8 bg-[#07080c]/60 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-base font-bold text-white">Udhyog-Setu</span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs">
              AI-Driven Scheme Matching Platform for Marginalized Entrepreneurs — SIH Problem Statement 26092.
              Connected to Supabase Central Scheme Database.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">Platform</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-neutral-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer / Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">Notice</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              All scheme data in this prototype is fictional / mock data for demonstration purposes. Always verify
              eligibility with official government portals before applying.
            </p>
            <a
              href="https://www.myscheme.gov.in"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs text-cyan-500 hover:text-cyan-300 transition-colors"
            >
              myScheme Official Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-600">
          <p>© {new Date().getFullYear()} Udhyog-Setu. Built for Smart India Hackathon 2026.</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>System Online — Demo Mode Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
