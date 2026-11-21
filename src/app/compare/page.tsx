'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart3, 
  Plus, 
  X, 
  Check, 
  Cpu, 
  Zap, 
  Coins, 
  Layers, 
  ShieldCheck, 
  Eye, 
  Code2, 
  BrainCircuit,
  ArrowRight
} from 'lucide-react';
import { RadarChart } from '@/components/RadarChart';
import { CURATED_MODELS, BENCHMARK_METRICS } from '@/lib/data/curated-models';
import { AIModel } from '@/types';

function ComparePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const idsParam = searchParams.get('ids') || '';
  const initialSlugs = idsParam ? idsParam.split(',').filter(Boolean) : ['claude-3-5-sonnet', 'deepseek-r1'];

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(initialSlugs);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync to URL
  useEffect(() => {
    const query = selectedSlugs.join(',');
    window.history.replaceState(null, '', query ? `/compare?ids=${query}` : '/compare');
  }, [selectedSlugs]);

  const removeModel = (slug: string) => {
    setSelectedSlugs((prev) => prev.filter((s) => s !== slug));
  };

  const addModel = (slug: string) => {
    if (!selectedSlugs.includes(slug) && selectedSlugs.length < 4) {
      setSelectedSlugs((prev) => [...prev, slug]);
      setIsAddModalOpen(false);
    }
  };

  const models: AIModel[] = selectedSlugs
    .map((slug) => CURATED_MODELS.find((m) => m.slug === slug))
    .filter((m): m is AIModel => Boolean(m));

  // Radar dimensions & calculated scores
  const radarDimensions = [
    { key: 'reasoning', label: 'Reasoning' },
    { key: 'coding', label: 'Coding' },
    { key: 'speed', label: 'Speed' },
    { key: 'costEfficiency', label: 'Price Efficiency' },
    { key: 'context', label: 'Context Size' },
  ];

  const radarData = models.map((m) => {
    const arenaScore = m.benchmarkScores.find((b) => b.metric.code === 'ARENA_ELO')?.score || 1200;
    const humanevalScore = m.benchmarkScores.find((b) => b.metric.code === 'HUMANEVAL')?.score || 80;

    const reasoningNorm = Math.min(100, Math.max(20, Math.round(((arenaScore - 1150) / 250) * 100)));
    const codingNorm = Math.min(100, Math.round(humanevalScore));
    const speedNorm = Math.min(100, Math.max(15, Math.round(((m.typicalThroughputTps || 60) / 280) * 100)));
    const costNorm = Math.min(100, Math.max(10, Math.round(100 - (m.inputPricePerMillion / 10) * 85)));
    const contextNorm = Math.min(100, Math.max(15, Math.round((m.contextLength / 1000000) * 100)));

    return {
      modelId: m.id,
      modelName: m.name,
      slug: m.slug,
      scores: {
        reasoning: reasoningNorm,
        coding: codingNorm,
        speed: speedNorm,
        costEfficiency: costNorm,
        context: contextNorm,
      },
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Multi-Model Comparison Matrix
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Compare capabilities, benchmarks, latency, and pricing across frontier AI models side-by-side.
          </p>
        </div>

        {selectedSlugs.length < 4 && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Model to Compare ({selectedSlugs.length}/4)
          </button>
        )}
      </div>

      {models.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
          <BarChart3 className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No models selected for comparison</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Choose 2 to 4 models to generate an interactive side-by-side comparison matrix and radar chart.
          </p>
          <button
            onClick={() => setSelectedSlugs(['claude-3-5-sonnet', 'deepseek-r1', 'gpt-4o'])}
            className="px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-semibold hover:bg-sky-400"
          >
            Load Sample Comparison
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Visual Radar Chart Section */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold text-white">Multidimensional Benchmark Radar</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Relative trade-offs between Reasoning, Coding, Speed, Price Efficiency, and Context Window
              </p>
            </div>
            <RadarChart dimensions={radarDimensions} data={radarData} size={360} />
          </div>

          {/* Side-by-Side Matrix Table */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-900/90 text-white">
                    <th className="py-4 px-4 font-semibold w-48 text-slate-400">Specification</th>
                    {models.map((m) => (
                      <th key={m.id} className="py-4 px-4 font-bold min-w-[220px]">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <div className="text-white text-sm">{m.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{m.lab.name}</div>
                          </div>
                          <button
                            onClick={() => removeModel(m.slug)}
                            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {/* Context Length */}
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-400">Context Window</td>
                    {models.map((m) => (
                      <td key={m.id} className="py-3 px-4 font-mono font-bold text-white">
                        {(m.contextLength / 1000).toLocaleString()}k tokens
                      </td>
                    ))}
                  </tr>

                  {/* Input Price */}
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-400">Input Price / 1M</td>
                    {models.map((m) => (
                      <td key={m.id} className="py-3 px-4 font-mono font-bold text-sky-400">
                        ${m.inputPricePerMillion.toFixed(2)}
                      </td>
                    ))}
                  </tr>

                  {/* Output Price */}
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-400">Output Price / 1M</td>
                    {models.map((m) => (
                      <td key={m.id} className="py-3 px-4 font-mono font-bold text-indigo-400">
                        ${m.outputPricePerMillion.toFixed(2)}
                      </td>
                    ))}
                  </tr>

                  {/* Prompt Caching */}
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-400">Prompt Caching</td>
                    {models.map((m) => (
                      <td key={m.id} className="py-3 px-4 text-slate-300">
                        {m.cacheReadPricePerMillion
                          ? `$${m.cacheReadPricePerMillion.toFixed(2)} / 1M`
                          : 'Not Supported'}
                      </td>
                    ))}
                  </tr>

                  {/* Throughput */}
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-400">Generation Speed</td>
                    {models.map((m) => (
                      <td key={m.id} className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                        {m.typicalThroughputTps ? `${m.typicalThroughputTps} tps` : '—'}
                      </td>
                    ))}
                  </tr>

                  {/* License & Weights */}
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-400">License</td>
                    {models.map((m) => (
                      <td key={m.id} className="py-3 px-4 text-slate-300">
                        {m.licenseType}
                      </td>
                    ))}
                  </tr>

                  {/* Architecture */}
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-400">Architecture</td>
                    {models.map((m) => (
                      <td key={m.id} className="py-3 px-4 text-slate-300">
                        {m.architecture || 'Dense'} ({m.parameterCount || 'Proprietary'})
                      </td>
                    ))}
                  </tr>

                  {/* Benchmarks Header */}
                  <tr className="bg-slate-900/60 font-bold text-white">
                    <td colSpan={models.length + 1} className="py-2.5 px-4 text-sky-400 text-[11px] uppercase tracking-wider">
                      Benchmark Leaderboard Results
                    </td>
                  </tr>

                  {/* Benchmark Rows */}
                  {BENCHMARK_METRICS.slice(0, 4).map((metric) => (
                    <tr key={metric.id}>
                      <td className="py-3 px-4 font-medium text-slate-400">{metric.name}</td>
                      {models.map((m) => {
                        const score = m.benchmarkScores.find((b) => b.metric.code === metric.code)?.score;
                        return (
                          <td key={m.id} className="py-3 px-4 font-mono font-bold text-slate-200">
                            {score ? `${score} ${metric.unit}` : '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Link Row */}
                  <tr>
                    <td className="py-4 px-4 font-medium text-slate-400">Model Page</td>
                    {models.map((m) => (
                      <td key={m.id} className="py-4 px-4">
                        <Link
                          href={`/models/${m.slug}`}
                          className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold"
                        >
                          View Full Details <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Model Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0e1626] border border-white/15 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white">Add Model to Comparison</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {CURATED_MODELS.map((m) => {
                const isAlreadySelected = selectedSlugs.includes(m.slug);
                return (
                  <button
                    key={m.id}
                    disabled={isAlreadySelected}
                    onClick={() => addModel(m.slug)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-colors ${
                      isAlreadySelected
                        ? 'opacity-40 border-white/5 bg-white/5 cursor-not-allowed'
                        : 'border-white/10 hover:border-sky-500/40 hover:bg-sky-500/5'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white">{m.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {m.lab.name} • ${(m.inputPricePerMillion).toFixed(2)}/1M in
                      </div>
                    </div>
                    {isAlreadySelected ? (
                      <span className="text-[10px] text-slate-500 font-medium">Already Added</span>
                    ) : (
                      <span className="text-sky-400 font-semibold">+ Add</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading Comparison Matrix...</div>}>
      <ComparePageContent />
    </Suspense>
  );
}
