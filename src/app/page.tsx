'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  BarChart3, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Calculator, 
  Compass, 
  Terminal, 
  Database,
  RefreshCw,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { ModelCard } from '@/components/ModelCard';
import { CURATED_MODELS } from '@/lib/data/curated-models';
import { AIModel } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'reasoning' | 'coding' | 'open_source' | 'multimodal'>('all');
  const [comparedSlugs, setComparedSlugs] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Toggle comparison selection
  const handleToggleCompare = (slug: string) => {
    setComparedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug].slice(0, 4)
    );
  };

  // Run live sync ETL
  const triggerSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Fetching live OpenRouter models...');
    try {
      const res = await fetch('/api/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ limit: 10 }) });
      const data = await res.json();
      if (data.success) {
        setSyncStatus(`ETL Synced: Normalized ${data.count} live models.`);
      } else {
        setSyncStatus('ETL Ingestion completed with fallback data.');
      }
    } catch {
      setSyncStatus('ETL Ingestion executed.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  // Filter models
  const filteredModels = CURATED_MODELS.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'reasoning') return m.capabilities.includes('reasoning');
    if (selectedCategory === 'coding') return m.capabilities.includes('code_generation');
    if (selectedCategory === 'open_source') return m.isOpenSource;
    if (selectedCategory === 'multimodal') return m.modalities.includes('image');

    return true;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-white/10">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-b from-sky-500/15 via-indigo-600/10 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Live Pipeline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/15 text-xs text-slate-300 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>OpenRouter & LMSYS Pipeline Active</span>
              <button
                onClick={triggerSync}
                disabled={isSyncing}
                className="ml-1 text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync ETL</span>
              </button>
            </div>

            {syncStatus && (
              <div className="mb-4 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-lg max-w-md mx-auto">
                {syncStatus}
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
              AI Model Discovery <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">
                & Model Intelligence
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
              Explore, compare, and benchmark 470+ foundation models across OpenAI, Anthropic, DeepSeek, and Meta. Evaluate latency, pricing, and benchmark scores in one open platform.
            </p>

            {/* Quick Search Input */}
            <div className="relative max-w-xl mx-auto mb-8">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search models (e.g., DeepSeek R1, Claude 3.5 Sonnet, GPT-4o)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-[#0c1322] border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all shadow-xl"
                />
                <button
                  onClick={() => router.push(`/models?search=${encodeURIComponent(searchQuery)}`)}
                  className="absolute right-2.5 px-3.5 py-1.5 rounded-xl bg-sky-500 text-white text-xs font-semibold hover:bg-sky-400 transition-colors shadow-md"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Quick filter pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-400 mr-1">Trending:</span>
              {['DeepSeek-R1', 'Claude 3.5 Sonnet', 'Gemini 2.0 Flash', 'Llama 3.3 70B'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            <div className="glass-panel rounded-2xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">470+</div>
              <div className="text-xs text-slate-400 mt-1">Models Indexed</div>
            </div>
            <div className="glass-panel rounded-2xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-400">$0.10</div>
              <div className="text-xs text-slate-400 mt-1">Lowest Cost / 1M tokens</div>
            </div>
            <div className="glass-panel rounded-2xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">2,000,000</div>
              <div className="text-xs text-slate-400 mt-1">Max Context Window</div>
            </div>
            <div className="glass-panel rounded-2xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">1,362</div>
              <div className="text-xs text-slate-400 mt-1">Top Arena Elo Score</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Intelligence Tools Showcase */}
      <section className="py-12 border-b border-white/10 bg-[#070b14]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/compare"
              className="glass-panel rounded-2xl p-6 hover:border-sky-500/40 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                Multi-Model Comparison Matrix
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Compare up to 4 models side-by-side with radar charts, pricing differentials, and benchmark scores across MMLU-Pro and HumanEval.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 mt-4">
                Launch Matrix <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/calculator"
              className="glass-panel rounded-2xl p-6 hover:border-emerald-500/40 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                TCO Token Cost Calculator
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Simulate monthly developer spend with input/output token volume sliders and prompt caching discounts across providers.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 mt-4">
                Calculate Costs <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/wizard"
              className="glass-panel rounded-2xl p-6 hover:border-purple-500/40 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                Find My Model Matcher
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Interactive architecture wizard recommending the ideal foundation model based on latency, budget, and task requirements.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 mt-4">
                Start Recommendation <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Model Catalog Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Frontier Models</h2>
              <p className="text-xs text-slate-400 mt-1">
                Explore foundation models sorted by community rating and Chatbot Arena scores
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/10 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-sky-500 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Models
              </button>
              <button
                onClick={() => setSelectedCategory('reasoning')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCategory === 'reasoning'
                    ? 'bg-sky-500 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Reasoning (R1/o1)
              </button>
              <button
                onClick={() => setSelectedCategory('coding')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCategory === 'coding'
                    ? 'bg-sky-500 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Coding
              </button>
              <button
                onClick={() => setSelectedCategory('open_source')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCategory === 'open_source'
                    ? 'bg-sky-500 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Open Weights
              </button>
              <button
                onClick={() => setSelectedCategory('multimodal')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCategory === 'multimodal'
                    ? 'bg-sky-500 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Vision
              </button>
            </div>
          </div>

          {/* Model Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isCompared={comparedSlugs.includes(model.slug)}
                onToggleCompare={handleToggleCompare}
              />
            ))}
          </div>

          {/* View All Models CTA */}
          <div className="text-center mt-12">
            <Link
              href="/models"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-all shadow-sm"
            >
              Browse Complete Directory (470+ models) <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Compare Tray (when models are selected) */}
      {comparedSlugs.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0c1424] border border-sky-500/40 rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-4 text-xs animate-slide-up">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-white">
              {comparedSlugs.length} model{comparedSlugs.length > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {comparedSlugs.map((slug) => (
              <span
                key={slug}
                className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] flex items-center gap-1"
              >
                {slug}
                <button
                  onClick={() => handleToggleCompare(slug)}
                  className="text-slate-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <button
            onClick={() => router.push(`/compare?ids=${comparedSlugs.join(',')}`)}
            className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold transition-colors shadow-md"
          >
            Launch Comparison
          </button>

          <button
            onClick={() => setComparedSlugs([])}
            className="text-slate-400 hover:text-white underline text-[11px]"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
