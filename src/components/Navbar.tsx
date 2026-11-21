'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Search, 
  Layers, 
  BarChart3, 
  Calculator, 
  Compass, 
  Terminal, 
  Building2,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export function Navbar({ onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/models', label: 'Models', icon: Layers },
    { href: '/compare', label: 'Compare', icon: BarChart3 },
    { href: '/benchmarks', label: 'Leaderboard', icon: BarChart3 },
    { href: '/labs', label: 'Labs & Providers', icon: Building2 },
    { href: '/calculator', label: 'TCO Calculator', icon: Calculator },
    { href: '/wizard', label: 'Model Matcher', icon: Compass },
    { href: '/playground', label: 'Playground', icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#060911]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  OneAtlas
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30">
                    Intelligence
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono -mt-0.5">ai model discovery</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Search & Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSearch}
              className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/10 text-slate-400 text-sm hover:border-sky-500/40 hover:text-slate-200 transition-all shadow-inner"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search models, labs, benchmarks...</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/10">
                ⌘K
              </kbd>
            </button>

            <Link
              href="/compare"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-semibold hover:opacity-95 shadow-sm shadow-sky-500/25 transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Compare Models
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#080d18] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5"
            >
              <link.icon className="w-4 h-4 text-sky-400" />
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
