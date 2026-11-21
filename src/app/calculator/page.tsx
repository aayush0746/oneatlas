'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, Coins, Sparkles, TrendingDown, ArrowRight, ShieldCheck } from 'lucide-react';
import { CURATED_MODELS } from '@/lib/data/curated-models';

export default function CalculatorPage() {
  const [inputMillions, setInputMillions] = useState<number>(5); // 5M input tokens
  const [outputMillions, setOutputMillions] = useState<number>(1); // 1M output tokens
  const [cacheHitPercent, setCacheHitPercent] = useState<number>(30); // 30% cache hit

  // Calculate costs across all models
  const calculatedResults = CURATED_MODELS.map((model) => {
    const rawInputCost = inputMillions * model.inputPricePerMillion;
    const outputCost = outputMillions * model.outputPricePerMillion;

    // Cache calculation
    const cachedInputTokens = inputMillions * (cacheHitPercent / 100);
    const nonCachedInputTokens = inputMillions - cachedInputTokens;

    let actualInputCost = rawInputCost;
    let cacheSavings = 0;

    if (model.cacheReadPricePerMillion) {
      actualInputCost =
        nonCachedInputTokens * model.inputPricePerMillion +
        cachedInputTokens * model.cacheReadPricePerMillion;
      cacheSavings = rawInputCost - actualInputCost;
    }

    const totalMonthlyCost = actualInputCost + outputCost;

    return {
      model,
      totalMonthlyCost,
      rawInputCost,
      actualInputCost,
      outputCost,
      cacheSavings,
    };
  }).sort((a, b) => a.totalMonthlyCost - b.totalMonthlyCost);

  const cheapest = calculatedResults[0];
  const mostExpensive = calculatedResults[calculatedResults.length - 1];
  const maxSavings = Math.max(...calculatedResults.map((r) => r.cacheSavings));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>Total Cost of Ownership (TCO) Simulator</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          AI Token & Monthly Spend Calculator
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Simulate your project&apos;s monthly inference bill across foundation models with prompt caching discounts and volume scaling.
        </p>
      </div>

      {/* Control Sliders Panel */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Coins className="w-4 h-4 text-emerald-400" />
          Set Monthly Token Volume
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Input Tokens */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Input Tokens (Prompts)</span>
              <span className="text-emerald-400 font-bold font-mono text-sm">
                {inputMillions} Million
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="50"
              step="0.5"
              value={inputMillions}
              onChange={(e) => setInputMillions(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800"
            />
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>100k tokens</span>
              <span>50M tokens</span>
            </div>
          </div>

          {/* Output Tokens */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Output Tokens (Completions)</span>
              <span className="text-sky-400 font-bold font-mono text-sm">
                {outputMillions} Million
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="20"
              step="0.5"
              value={outputMillions}
              onChange={(e) => setOutputMillions(parseFloat(e.target.value))}
              className="w-full accent-sky-500 bg-slate-800"
            />
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>100k tokens</span>
              <span>20M tokens</span>
            </div>
          </div>

          {/* Prompt Caching Reuse */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Prompt Cache Reuse Ratio</span>
              <span className="text-purple-400 font-bold font-mono text-sm">
                {cacheHitPercent}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={cacheHitPercent}
              onChange={(e) => setCacheHitPercent(parseInt(e.target.value))}
              className="w-full accent-purple-500 bg-slate-800"
            />
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>0% (No caching)</span>
              <span>90% (High reuse)</span>
            </div>
          </div>
        </div>

        {/* Highlight Insights Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
            <div className="text-emerald-400 font-semibold text-[11px]">Most Cost-Effective</div>
            <div className="text-white font-bold text-sm mt-0.5">{cheapest.model.name}</div>
            <div className="text-slate-300 font-mono mt-0.5">
              ${cheapest.totalMonthlyCost.toFixed(2)} / month
            </div>
          </div>

          <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-3">
            <div className="text-sky-400 font-semibold text-[11px]">Frontier Flagship</div>
            <div className="text-white font-bold text-sm mt-0.5">{mostExpensive.model.name}</div>
            <div className="text-slate-300 font-mono mt-0.5">
              ${mostExpensive.totalMonthlyCost.toFixed(2)} / month
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
            <div className="text-purple-400 font-semibold text-[11px]">Maximum Cache Savings</div>
            <div className="text-white font-bold text-sm mt-0.5">
              Up to ${maxSavings.toFixed(2)} / mo
            </div>
            <div className="text-slate-300 text-[10px] mt-0.5">
              With 75-90% prompt caching discount
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-white/10 text-slate-400">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Model</th>
                <th className="py-3.5 px-3 font-semibold">Lab</th>
                <th className="py-3.5 px-3 font-semibold">Input Spend</th>
                <th className="py-3.5 px-3 font-semibold">Output Spend</th>
                <th className="py-3.5 px-3 font-semibold">Cache Savings</th>
                <th className="py-3.5 px-4 font-semibold text-right">Est. Monthly Bill</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {calculatedResults.map((res) => (
                <tr key={res.model.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/models/${res.model.slug}`}
                      className="font-bold text-white hover:text-sky-400 text-sm"
                    >
                      {res.model.name}
                    </Link>
                    <div className="text-[10px] text-slate-400 font-mono">
                      ${res.model.inputPricePerMillion.toFixed(2)} in / ${res.model.outputPricePerMillion.toFixed(2)} out
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-slate-300">{res.model.lab.name}</td>

                  <td className="py-3.5 px-3 font-mono text-slate-300">
                    ${res.actualInputCost.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-3 font-mono text-slate-300">
                    ${res.outputCost.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-3 font-mono">
                    {res.cacheSavings > 0 ? (
                      <span className="text-emerald-400 font-medium">
                        -${res.cacheSavings.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-extrabold text-base text-white">
                    ${res.totalMonthlyCost.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/models/${res.model.slug}`}
                      className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold"
                    >
                      View Specs <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
