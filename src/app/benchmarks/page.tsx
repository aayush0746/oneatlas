'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  BarChart3, 
  Sparkles, 
  BrainCircuit, 
  Code2, 
  Calculator, 
  Zap, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { CURATED_MODELS, BENCHMARK_METRICS } from '@/lib/data/curated-models';

export default function BenchmarksPage() {
  const [selectedMetricCode, setSelectedMetricCode] = useState('ARENA_ELO');

  const currentMetric = BENCHMARK_METRICS.find((m) => m.code === selectedMetricCode) || BENCHMARK_METRICS[0];

  // Rank models based on selected metric
  const rankedModels = CURATED_MODELS.map((model) => {
    const scoreItem = model.benchmarkScores.find((b) => b.metric.code === currentMetric.code);
    return {
      model,
      score: scoreItem?.score ?? 0,
      source: scoreItem?.source || 'Official Evaluation',
    };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item, idx) => ({ rank: idx + 1, ...item }));

  const maxScore = Math.max(...rankedModels.map((m) => m.score), currentMetric.maxScore || 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3">
          <Trophy className="w-3.5 h-3.5" />
          <span>Global AI Foundation Rankings</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          AI Model Rankings & Leaderboard
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Evaluate comparative performance across crowdsourced human evaluations (Chatbot Arena) and standardized academic benchmarks (MMLU-Pro, HumanEval, Math).
        </p>
      </div>

      {/* Metric Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
        {BENCHMARK_METRICS.map((metric) => {
          const isActive = metric.code === selectedMetricCode;
          return (
            <button
              key={metric.code}
              onClick={() => setSelectedMetricCode(metric.code)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'bg-sky-500/15 border-sky-500/50 text-white shadow-md shadow-sky-500/10'
                  : 'glass-panel text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400">
                {metric.category}
              </div>
              <div className="font-bold text-xs mt-1 text-white truncate">{metric.name}</div>
            </button>
          );
        })}
      </div>

      {/* Metric Info Banner */}
      <div className="glass-panel rounded-2xl p-5 mb-8 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            Benchmark Details
          </span>
          <h2 className="text-lg font-bold text-white mt-0.5">{currentMetric.name}</h2>
          <p className="text-xs text-slate-400 mt-1">{currentMetric.description}</p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-slate-300 whitespace-nowrap">
          Unit: <strong className="text-white">{currentMetric.unit}</strong>
        </div>
      </div>

      {/* Leaderboard Table / Rankings */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-white/10 text-slate-400">
              <tr>
                <th className="py-3.5 px-4 font-semibold w-16">Rank</th>
                <th className="py-3.5 px-4 font-semibold">Model</th>
                <th className="py-3.5 px-3 font-semibold">Lab</th>
                <th className="py-3.5 px-4 font-semibold w-1/3">Benchmark Score</th>
                <th className="py-3.5 px-3 font-semibold">Input / 1M</th>
                <th className="py-3.5 px-3 font-semibold">Context</th>
                <th className="py-3.5 px-4 text-right font-semibold">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rankedModels.map((item) => {
                const percentage = Math.min(100, Math.round((item.score / maxScore) * 100));
                const isTop3 = item.rank <= 3;

                return (
                  <tr key={item.model.id} className="hover:bg-white/5 transition-colors">
                    {/* Rank */}
                    <td className="py-4 px-4">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold font-mono text-xs ${
                          item.rank === 1
                            ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                            : item.rank === 2
                            ? 'bg-slate-300 text-black'
                            : item.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.rank}
                      </span>
                    </td>

                    {/* Model Name */}
                    <td className="py-4 px-4 font-medium">
                      <Link
                        href={`/models/${item.model.slug}`}
                        className="font-bold text-white hover:text-sky-400 text-sm flex items-center gap-1.5"
                      >
                        {item.model.name}
                        {item.model.isOpenSource && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Open
                          </span>
                        )}
                      </Link>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {item.model.licenseType}
                      </div>
                    </td>

                    {/* Lab */}
                    <td className="py-4 px-3 text-slate-300">{item.model.lab.name}</td>

                    {/* Visual Score Bar */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-extrabold text-sm text-sky-400">
                            {item.score} {currentMetric.unit}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Pricing */}
                    <td className="py-4 px-3 font-mono text-slate-300 font-medium">
                      ${item.model.inputPricePerMillion.toFixed(2)}
                    </td>

                    {/* Context */}
                    <td className="py-4 px-3 font-mono text-slate-400">
                      {(item.model.contextLength / 1000).toLocaleString()}k
                    </td>

                    {/* Source */}
                    <td className="py-4 px-4 text-right text-slate-500 text-[11px] font-mono">
                      {item.source}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
