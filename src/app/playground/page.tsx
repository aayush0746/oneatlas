'use client';

import { useState } from 'react';
import { Terminal, Play, Sparkles, Sliders, Copy, Check, RotateCcw } from 'lucide-react';
import { CURATED_MODELS } from '@/lib/data/curated-models';
import { CodeSnippet } from '@/components/CodeSnippet';

export default function PlaygroundPage() {
  const [selectedSlug, setSelectedSlug] = useState('claude-3-5-sonnet');
  const [systemPrompt, setSystemPrompt] = useState('You are an expert AI software architect and technical lead.');
  const [userPrompt, setUserPrompt] = useState('Compare the architectural trade-offs of Mixture-of-Experts (MoE) vs Dense Transformers for production LLMs.');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);

  const currentModel = CURATED_MODELS.find((m) => m.slug === selectedSlug) || CURATED_MODELS[0];

  const handleSimulate = () => {
    setIsRunning(true);
    setOutput(null);

    setTimeout(() => {
      setIsRunning(false);
      setLatency(Math.round(250 + Math.random() * 300));
      setOutput(
        `## Architectural Comparison: Mixture-of-Experts (MoE) vs Dense Transformers\n\n` +
        `### 1. Mixture-of-Experts (MoE) — e.g., DeepSeek-V3, Mixtral\n` +
        `- **Active vs Total Parameters**: MoE activates only a subset of experts per token (e.g. 37B active out of 671B total). This allows frontier capability while keeping FLOPs per token comparable to a much smaller model.\n` +
        `- **Inference Efficiency**: Substantially lower cost-per-token and faster throughput (often 2x-3x faster than dense equivalents).\n` +
        `- **VRAM & Routing Challenge**: Requires holding all 671B weights in GPU memory across nodes, requiring high-bandwidth all-to-all NVLink interconnects.\n\n` +
        `### 2. Dense Transformers — e.g., Claude 3.5 Sonnet, GPT-4o\n` +
        `- **Consistent Attention**: Every parameter participates in every token prediction, ensuring predictable memory bandwidth and uniform compute utilization.\n` +
        `- **Deployment Simplicity**: Simple tensor parallelism without dynamic router balancing overhead.\n\n` +
        `**Recommendation**: For large-scale multi-tenant APIs, MoE models (like DeepSeek-V3/R1) provide unmatched pricing economics, while dense models remain standard for consistent edge deployment.`
      );
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold mb-3">
          <Terminal className="w-3.5 h-3.5" />
          <span>Interactive Model Playground</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Prompt & Latency Probe</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Test prompt generation, configure sampling parameters, evaluate simulated latency, and inspect runnable SDK code snippets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Prompts & Output */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prompts Input Panel */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
            {/* Model Selector Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Target Model
              </span>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="bg-[#090d16] border border-white/15 rounded-xl px-3 py-1.5 text-xs font-bold text-sky-400 focus:outline-none"
              >
                {CURATED_MODELS.map((m) => (
                  <option key={m.slug} value={m.slug}>
                    {m.name} ({m.lab.name})
                  </option>
                ))}
              </select>
            </div>

            {/* System Prompt */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                System Prompt
              </label>
              <textarea
                rows={2}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full bg-[#080d17] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* User Prompt */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                User Prompt
              </label>
              <textarea
                rows={4}
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="w-full bg-[#080d17] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-400">
                Input Price: <strong className="text-white">${currentModel.inputPricePerMillion.toFixed(2)}</strong> / 1M
              </div>

              <button
                onClick={handleSimulate}
                disabled={isRunning}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-sky-500/20 disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                <span>{isRunning ? 'Synthesizing...' : 'Run Simulation'}</span>
              </button>
            </div>
          </div>

          {/* Response Output Panel */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                Model Generation Output
              </span>
              {latency && (
                <span className="text-xs font-mono text-emerald-400">
                  Latency: {latency} ms (simulated)
                </span>
              )}
            </div>

            {output ? (
              <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-2 whitespace-pre-line bg-slate-900/40 p-4 rounded-xl border border-white/5">
                {output}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                Click &quot;Run Simulation&quot; to test prompt response from {currentModel.name}.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sampling Parameters & SDK Code */}
        <div className="space-y-6">
          {/* Sampling Parameters */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              Inference Parameters
            </h3>

            {/* Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Temperature</span>
                <span className="font-mono text-sky-400">{temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-sky-500 bg-slate-800"
              />
              <div className="text-[10px] text-slate-500 flex justify-between">
                <span>0.0 (Deterministic)</span>
                <span>1.0 (Creative)</span>
              </div>
            </div>

            {/* Max Output Tokens */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Max Tokens</span>
                <span className="font-mono text-indigo-400">{maxTokens}</span>
              </div>
              <input
                type="range"
                min="256"
                max="8192"
                step="256"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800"
              />
              <div className="text-[10px] text-slate-500 flex justify-between">
                <span>256</span>
                <span>8,192</span>
              </div>
            </div>
          </div>

          {/* Generated Code Snippet */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 block px-1">
              Runnable Integration Code
            </span>
            <CodeSnippet modelSlug={currentModel.slug} modelName={currentModel.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
