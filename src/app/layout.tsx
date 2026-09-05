import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AmbientCanvasGlow from '@/components/3d/AmbientCanvasGlow';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Udhyog-Setu — AI-Powered Scheme Intelligence Platform',
  description: 'Next-generation AI scheme matching for Indian entrepreneurs. Discover eligible government schemes, subsidies, and loans with full transparency.',
  keywords: 'government schemes, PMEGP, Mudra, SC/ST entrepreneur, startup India, business loan subsidy',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col relative`} style={{ backgroundColor: '#07080c' }}>
        {/* Ambient animated background glow */}
        <AmbientCanvasGlow />

        {/* Subtle grid overlay */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-grid-cyber opacity-50" />

        {/* Radial vignette overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 60%, rgba(7,8,12,0.8) 100%)',
          }}
        />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
