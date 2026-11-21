'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Sparkles, Building2, BarChart3, Calculator, Compass, ArrowRight } from 'lucide-react';
import { CURATED_MODELS, AI_LABS } from '@/lib/data/curated-models';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  // Global keydown listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredModels = query.trim()
    ? CURATED_MODELS.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.slug.toLowerCase().includes(query.toLowerCase()) ||
          m.lab.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : CURATED_MODELS.slice(0, 4);

  const filteredLabs = query.trim()
    ? AI_LABS.filter((l) => l.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
    : AI_LABS.slice(0, 3);

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-[#0c1220] border border-white/15 rounded-2xl shadow-2xl overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            type="text"
            placeholder="Search AI models, labs, or tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/10">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Tools */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
              Intelligence Tools
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleSelect('/compare')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-white/5 text-slate-300 hover:text-white text-left transition-colors"
              >
                <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
                <span>Model Comparison Matrix</span>
              </button>
              <button
                onClick={() => handleSelect('/calculator')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-white/5 text-slate-300 hover:text-white text-left transition-colors"
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                <span>TCO Token Cost Calculator</span>
              </button>
              <button
                onClick={() => handleSelect('/wizard')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-white/5 text-slate-300 hover:text-white text-left transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                <span>Find My Model Matcher</span>
              </button>
              <button
                onClick={() => handleSelect('/benchmarks')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-white/5 text-slate-300 hover:text-white text-left transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Chatbot Arena Leaderboard</span>
              </button>
            </div>
          </div>

          {/* Models */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
              Models ({filteredModels.length})
            </div>
            <div className="space-y-1">
              {filteredModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleSelect(`/models/${model.slug}`)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-sky-500/10 hover:border-sky-500/20 border border-transparent text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-sky-400 text-[10px] font-bold">
                      {model.name[0]}
                    </div>
                    <div>
                      <div className="font-medium text-slate-200 group-hover:text-white">
                        {model.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {model.lab.name} • ${(model.inputPricePerMillion).toFixed(2)}/M tokens
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-sky-400">
                    <span className="text-[10px] font-mono">{(model.contextLength / 1000).toFixed(0)}k ctx</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Labs */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
              AI Labs ({filteredLabs.length})
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {filteredLabs.map((lab) => (
                <button
                  key={lab.id}
                  onClick={() => handleSelect(`/models?lab=${lab.slug}`)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-white/5 border border-white/5 text-slate-300 hover:text-white transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="truncate">{lab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
