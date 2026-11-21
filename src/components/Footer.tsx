import Link from 'next/link';
import { Sparkles, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#04070e] text-slate-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white tracking-tight">OneAtlas</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open-standard intelligence platform for AI model discovery, benchmark evaluation, and multi-provider pricing.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Discovery</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/models" className="hover:text-sky-400 transition-colors">All Models</Link></li>
              <li><Link href="/compare" className="hover:text-sky-400 transition-colors">Model Comparison Matrix</Link></li>
              <li><Link href="/benchmarks" className="hover:text-sky-400 transition-colors">Chatbot Arena Rankings</Link></li>
              <li><Link href="/labs" className="hover:text-sky-400 transition-colors">AI Labs & Research Directory</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Developer Tools</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/calculator" className="hover:text-sky-400 transition-colors">TCO Token Calculator</Link></li>
              <li><Link href="/wizard" className="hover:text-sky-400 transition-colors">Find My Model Wizard</Link></li>
              <li><Link href="/playground" className="hover:text-sky-400 transition-colors">Prompt Playground</Link></li>
              <li><a href="/api/models" target="_blank" className="hover:text-sky-400 transition-colors inline-flex items-center gap-1">REST API <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>

          {/* Architecture & Tech Stack */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Engineering</h4>
            <p className="text-xs text-slate-400 mb-2">
              Built with Next.js App Router, TypeScript, PostgreSQL, Prisma ORM, and TailwindCSS.
            </p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono">
                PostgreSQL + Prisma
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[11px] font-mono">
                Live OpenRouter ETL
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 OneAtlas Platform. Built for AI Software Engineer Internship Evaluation.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
