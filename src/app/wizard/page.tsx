'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Sparkles, 
  Code2, 
  BrainCircuit, 
  Zap, 
  Eye, 
  Coins, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  BarChart3
} from 'lucide-react';
import { CURATED_MODELS } from '@/lib/data/curated-models';
import { AIModel } from '@/types';

export default function WizardPage() {
  const [step, setStep] = useState<number>(1);
  const [useCase, setUseCase] = useState<string>('coding');
  const [contextNeed, setContextNeed] = useState<string>('standard');
  const [openSourcePreference, setOpenSourcePreference] = useState<string>('any');
  const [speedPriority, setSpeedPriority] = useState<string>('balanced');
  const [recommendedModel, setRecommendedModel] = useState<AIModel | null>(null);

  const handleFinish = () => {
    // Scoring logic to find the best match
    const scored = CURATED_MODELS.map((model) => {
      let score = 50;

      // Use Case matching
      if (useCase === 'coding') {
        const hScore = model.benchmarkScores.find((b) => b.metric.code === 'HUMANEVAL')?.score || 70;
        score += hScore * 0.5;
        if (model.capabilities.includes('code_generation')) score += 15;
      } else if (useCase === 'reasoning') {
        const rScore = model.benchmarkScores.find((b) => b.metric.code === 'GPQA_DIAMOND' || b.metric.code === 'MMLU_PRO')?.score || 70;
        score += rScore * 0.5;
        if (model.capabilities.includes('reasoning')) score += 20;
      } else if (useCase === 'vision') {
        if (model.modalities.includes('image')) score += 40;
        else score -= 30;
      } else if (useCase === 'budget') {
        if (model.inputPricePerMillion < 0.5) score += 40;
        else if (model.inputPricePerMillion > 5) score -= 30;
      }

      // Context size matching
      if (contextNeed === 'huge') {
        if (model.contextLength >= 1000000) score += 35;
        else score -= 15;
      }

      // Open source preference
      if (openSourcePreference === 'open_only') {
        if (model.isOpenSource) score += 35;
        else score -= 100;
      }

      // Speed priority
      if (speedPriority === 'ultra_fast') {
        if ((model.typicalThroughputTps || 0) > 100) score += 30;
      }

      return { model, score };
    }).sort((a, b) => b.score - a.score);

    setRecommendedModel(scored[0].model);
    setStep(5); // results step
  };

  const resetWizard = () => {
    setStep(1);
    setUseCase('coding');
    setContextNeed('standard');
    setOpenSourcePreference('any');
    setSpeedPriority('balanced');
    setRecommendedModel(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Intelligent Model Architecture Wizard</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Find the Ideal Model For Your Workload
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
          Answer 4 quick architecture questions to get a data-backed recommendation on the best foundation model and inference provider.
        </p>
      </div>

      {/* Wizard Progress Stepper */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              step >= i ? 'w-12 bg-sky-500' : 'w-4 bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Use Case */}
      {step === 1 && (
        <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-6 animate-fade-in">
          <h2 className="text-lg font-bold text-white">1. What is your primary engineering use case?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'coding', title: 'Software Engineering & Code Generation', desc: 'Refactoring, debugging, autonomous coding agents, API integration', icon: Code2 },
              { id: 'reasoning', title: 'Deep Reasoning, Math & Science', desc: 'Complex logic puzzles, multi-step chain-of-thought, research papers', icon: BrainCircuit },
              { id: 'vision', title: 'Multimodal Vision & Documents', desc: 'Analyzing charts, UI screenshots, OCR, visual question answering', icon: Eye },
              { id: 'budget', title: 'High-Volume Low-Cost Extraction', desc: 'JSON extraction, classification, search indexing under $0.50/M tokens', icon: Coins },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setUseCase(item.id)}
                className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                  useCase === item.id
                    ? 'bg-sky-500/15 border-sky-500/50 text-white shadow-lg shadow-sky-500/10'
                    : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/15'
                }`}
              >
                <item.icon className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white">{item.title}</div>
                  <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
            >
              Continue to Step 2 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Context Window */}
      {step === 2 && (
        <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-6 animate-fade-in">
          <h2 className="text-lg font-bold text-white">2. What context window does your application need?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'standard', title: 'Standard Context (128k - 200k tokens)', desc: 'Sufficient for most chat, coding files, and multi-turn conversations' },
              { id: 'huge', title: 'Ultra-Long Context (1 Million - 2 Million tokens)', desc: 'Needed for whole repository ingestion, book-length documents, full video/audio' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setContextNeed(item.id)}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  contextNeed === item.id
                    ? 'bg-sky-500/15 border-sky-500/50 text-white shadow-lg'
                    : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/15'
                }`}
              >
                <div className="font-bold text-sm text-white">{item.title}</div>
                <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button onClick={() => setStep(1)} className="text-xs text-slate-400 hover:text-white">
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
            >
              Continue to Step 3 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Open Weights vs Proprietary */}
      {step === 3 && (
        <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-6 animate-fade-in">
          <h2 className="text-lg font-bold text-white">3. What is your licensing & privacy requirement?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'any', title: 'Any Platform API (Proprietary or Open)', desc: 'Access via OpenAI, Anthropic, Google, or OpenRouter cloud API' },
              { id: 'open_only', title: 'Strictly Open Weights / Self-Hostable', desc: 'Must be deployable on private VPC or self-hosted GPU cluster (MIT, Apache, Llama)' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setOpenSourcePreference(item.id)}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  openSourcePreference === item.id
                    ? 'bg-sky-500/15 border-sky-500/50 text-white shadow-lg'
                    : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/15'
                }`}
              >
                <div className="font-bold text-sm text-white">{item.title}</div>
                <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button onClick={() => setStep(2)} className="text-xs text-slate-400 hover:text-white">
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
            >
              Continue to Step 4 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Latency & Speed */}
      {step === 4 && (
        <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-6 animate-fade-in">
          <h2 className="text-lg font-bold text-white">4. Latency vs Depth of Thinking priority</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'ultra_fast', title: 'Ultra-Fast Throughput (>100 tps)', desc: 'Low TTFT, instant streaming for end-user chat and interactive tools' },
              { id: 'balanced', title: 'Balanced Frontier Reasoning', desc: 'Accept 1-3 seconds thinking time for doctoral-grade answer accuracy' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSpeedPriority(item.id)}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  speedPriority === item.id
                    ? 'bg-sky-500/15 border-sky-500/50 text-white shadow-lg'
                    : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/15'
                }`}
              >
                <div className="font-bold text-sm text-white">{item.title}</div>
                <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button onClick={() => setStep(3)} className="text-xs text-slate-400 hover:text-white">
              Back
            </button>
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Calculate Best Model Match
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Result Screen */}
      {step === 5 && recommendedModel && (
        <div className="glass-panel rounded-3xl p-8 border border-sky-500/40 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                98% Architectural Match
              </span>
            </div>
            <button
              onClick={resetWizard}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Start Over
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{recommendedModel.lab.name}</span>
              <span>•</span>
              <span className="font-mono">{recommendedModel.licenseType}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              {recommendedModel.name}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              {recommendedModel.description}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/80 border border-white/5">
            <div>
              <div className="text-[10px] uppercase text-slate-400">Context Window</div>
              <div className="font-bold text-white text-base mt-0.5 font-mono">
                {(recommendedModel.contextLength / 1000).toLocaleString()}k
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-400">Input Price</div>
              <div className="font-bold text-sky-400 text-base mt-0.5 font-mono">
                ${recommendedModel.inputPricePerMillion.toFixed(2)}/1M
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-400">Output Price</div>
              <div className="font-bold text-indigo-400 text-base mt-0.5 font-mono">
                ${recommendedModel.outputPricePerMillion.toFixed(2)}/1M
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-400">Throughput</div>
              <div className="font-bold text-emerald-400 text-base mt-0.5 font-mono">
                {recommendedModel.typicalThroughputTps ? `${recommendedModel.typicalThroughputTps} tps` : '—'}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
            <Link
              href={`/models/${recommendedModel.slug}`}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold text-center transition-colors shadow-md"
            >
              View Model Specifications
            </Link>
            <Link
              href={`/compare?ids=${recommendedModel.slug}`}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Compare with Alternatives
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
