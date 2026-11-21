'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  RotateCcw, 
  Cpu, 
  Coins, 
  BarChart3, 
  Check, 
  Grid3X3, 
  List, 
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ModelCard } from '@/components/ModelCard';
import { CURATED_MODELS, AI_LABS, AI_PROVIDERS } from '@/lib/data/curated-models';
import { AIModel } from '@/types';

function ModelsCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedLab, setSelectedLab] = useState(searchParams.get('lab') || 'all');
  const [selectedProvider, setSelectedProvider] = useState(searchParams.get('provider') || 'all');
  const [selectedModality, setSelectedModality] = useState(searchParams.get('modality') || 'all');
  const [selectedCapability, setSelectedCapability] = useState(searchParams.get('capability') || 'all');
  const [openSourceOnly, setOpenSourceOnly] = useState(searchParams.get('openSource') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [comparedSlugs, setComparedSlugs] = useState<string[]>([]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedLab !== 'all') params.set('lab', selectedLab);
    if (selectedProvider !== 'all') params.set('provider', selectedProvider);
    if (selectedModality !== 'all') params.set('modality', selectedModality);
    if (selectedCapability !== 'all') params.set('capability', selectedCapability);
    if (openSourceOnly) params.set('openSource', 'true');
    if (sortBy !== 'popularity') params.set('sortBy', sortBy);

    const queryStr = params.toString();
    const newPath = queryStr ? `/models?${queryStr}` : '/models';
    window.history.replaceState(null, '', newPath);
  }, [search, selectedLab, selectedProvider, selectedModality, selectedCapability, openSourceOnly, sortBy]);

  const handleToggleCompare = (slug: string) => {
    setComparedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug].slice(0, 4)
    );
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedLab('all');
    setSelectedProvider('all');
    setSelectedModality('all');
    setSelectedCapability('all');
    setOpenSourceOnly(false);
    setSortBy('popularity');
  };

  // Perform filtering
  let filtered = [...CURATED_MODELS];

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.slug.toLowerCase().includes(q) ||
        m.lab.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
    );
  }

  if (selectedLab !== 'all') {
    filtered = filtered.filter((m) => m.lab.slug === selectedLab);
  }

  if (selectedProvider !== 'all') {
    filtered = filtered.filter((m) =>
      m.providerPricings.some((p) => p.provider.slug === selectedProvider)
    );
  }

  if (selectedModality !== 'all') {
    filtered = filtered.filter((m) => m.modalities.includes(selectedModality as any));
  }

  if (selectedCapability !== 'all') {
    filtered = filtered.filter((m) => m.capabilities.includes(selectedCapability as any));
  }

  if (openSourceOnly) {
    filtered = filtered.filter((m) => m.isOpenSource);
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.inputPricePerMillion - b.inputPricePerMillion;
      case 'price_desc':
        return b.inputPricePerMillion - a.inputPricePerMillion;
      case 'context_desc':
        return b.contextLength - a.contextLength;
      case 'release_date':
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      case 'speed':
        return (b.typicalThroughputTps || 0) - (a.typicalThroughputTps || 0);
      case 'popularity':
      default:
        return (b.ratingScore || 0) - (a.ratingScore || 0);
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Model Discovery</h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore foundation models with multi-provider pricing, context length, benchmarks, and throughput.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="glass-panel rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-sky-400" />
                Filters
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* AI Lab Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">AI Lab / Organization</label>
              <select
                value={selectedLab}
                onChange={(e) => setSelectedLab(e.target.value)}
                className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="all">All Labs</option>
                {AI_LABS.map((lab) => (
                  <option key={lab.slug} value={lab.slug}>
                    {lab.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Modality Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Modality</label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'text', label: 'Text' },
                  { id: 'image', label: 'Vision / Image' },
                  { id: 'audio', label: 'Audio' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedModality(item.id)}
                    className={`px-2.5 py-1.5 rounded-lg border text-left transition-colors ${
                      selectedModality === item.id
                        ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 font-medium'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Capabilities */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Capabilities</label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'all', label: 'Any capability' },
                  { id: 'reasoning', label: 'Deep Reasoning (R1 / o1)' },
                  { id: 'code_generation', label: 'Coding & Synthesis' },
                  { id: 'function_calling', label: 'Function Calling' },
                  { id: 'caching', label: 'Prompt Caching' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedCapability(item.id)}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-left transition-colors ${
                      selectedCapability === item.id
                        ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 font-medium'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Open Weights Toggle */}
            <div className="pt-2 border-t border-white/10">
              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={openSourceOnly}
                  onChange={(e) => setOpenSourceOnly(e.target.checked)}
                  className="rounded border-white/20 bg-slate-900 text-sky-500 focus:ring-0"
                />
                <span className="font-medium">Open-Weights Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Search & Sort Bar */}
          <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 w-4 h-4 text-slate-400 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by name or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#090d16] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 whitespace-nowrap">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#090d16] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="popularity">Arena Elo & Rating</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="context_desc">Context Window</option>
                  <option value="speed">Generation Speed (TPS)</option>
                  <option value="release_date">Newest Release</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center rounded-xl bg-slate-900 border border-white/10 p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'table' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Table View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing <strong className="text-white">{filtered.length}</strong> AI models
            </span>
            {comparedSlugs.length > 0 && (
              <span className="text-sky-400 font-medium">
                {comparedSlugs.length} selected for comparison
              </span>
            )}
          </div>

          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  isCompared={comparedSlugs.includes(model.slug)}
                  onToggleCompare={handleToggleCompare}
                />
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 border-b border-white/10 text-slate-400">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Model</th>
                    <th className="py-3 px-3 font-semibold">Lab</th>
                    <th className="py-3 px-3 font-semibold">Context</th>
                    <th className="py-3 px-3 font-semibold">Throughput</th>
                    <th className="py-3 px-3 font-semibold">Price (In / Out)</th>
                    <th className="py-3 px-3 font-semibold">Arena Elo</th>
                    <th className="py-3 px-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((m) => {
                    const elo = m.benchmarkScores.find((b) => b.metric.code === 'ARENA_ELO')?.score;
                    return (
                      <tr key={m.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4">
                          <a href={`/models/${m.slug}`} className="font-bold text-white hover:text-sky-400">
                            {m.name}
                          </a>
                          <div className="text-[10px] text-slate-400 font-mono">{m.licenseType}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-300">{m.lab.name}</td>
                        <td className="py-3 px-3 text-slate-300 font-mono">
                          {(m.contextLength / 1000).toLocaleString()}k
                        </td>
                        <td className="py-3 px-3 text-emerald-400 font-mono">
                          {m.typicalThroughputTps ? `${m.typicalThroughputTps} tps` : '—'}
                        </td>
                        <td className="py-3 px-3 text-slate-200 font-mono">
                          ${m.inputPricePerMillion.toFixed(2)} / ${m.outputPricePerMillion.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-sky-400 font-bold font-mono">
                          {elo || '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleToggleCompare(m.slug)}
                            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                              comparedSlugs.includes(m.slug)
                                ? 'bg-sky-500 text-white'
                                : 'bg-white/5 text-slate-300 hover:bg-white/10'
                            }`}
                          >
                            {comparedSlugs.includes(m.slug) ? 'Selected' : 'Compare'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="glass-panel rounded-2xl p-12 text-center space-y-3">
              <Cpu className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No models match your filters</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try widening your search criteria or resetting filters to see the full model catalog.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-semibold hover:bg-sky-400"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Floating Compare Action Tray */}
      {comparedSlugs.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0c1424] border border-sky-500/40 rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-4 text-xs animate-slide-up">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-white">
              {comparedSlugs.length} model{comparedSlugs.length > 1 ? 's' : ''} ready to compare
            </span>
          </div>

          <button
            onClick={() => router.push(`/compare?ids=${comparedSlugs.join(',')}`)}
            className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold transition-colors shadow-md"
          >
            Launch Side-by-Side View
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

export default function ModelsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading Model Discovery...</div>}>
      <ModelsCatalogContent />
    </Suspense>
  );
}
