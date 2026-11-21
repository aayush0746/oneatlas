'use client';

import Link from 'next/link';
import { AIModel } from '@/types';
import { 
  Cpu, 
  Zap, 
  Eye, 
  Code2, 
  BrainCircuit, 
  Coins, 
  ExternalLink,
  Check
} from 'lucide-react';

interface ModelCardProps {
  model: AIModel;
  isCompared?: boolean;
  onToggleCompare?: (slug: string) => void;
}

export function ModelCard({ model, isCompared, onToggleCompare }: ModelCardProps) {
  const arenaScore = model.benchmarkScores.find((b) => b.metric.code === 'ARENA_ELO')?.score;
  const humanEvalScore = model.benchmarkScores.find((b) => b.metric.code === 'HUMANEVAL')?.score;

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between hover:border-sky-500/30 transition-all duration-200 group relative">
      {/* Top Header: Lab & Badges */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              {model.lab.name}
            </span>
            {model.isOpenSource && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Open Weights
              </span>
            )}
            {model.isNew && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                New
              </span>
            )}
          </div>

          {/* Quick Compare Checkbox Button */}
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare(model.slug)}
              className={`text-xs flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                isCompared
                  ? 'bg-sky-500 text-white font-medium shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              title="Add to comparison matrix"
            >
              {isCompared ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{isCompared ? 'Comparing' : '+ Compare'}</span>
            </button>
          )}
        </div>

        {/* Model Name and Short Description */}
        <Link href={`/models/${model.slug}`} className="block">
          <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors flex items-center gap-1.5">
            {model.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {model.description}
          </p>
        </Link>

        {/* Capabilities / Modality Pills */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-900/80 text-slate-300 border border-white/5">
            <Cpu className="w-3 h-3 text-sky-400" />
            {(model.contextLength / 1000).toLocaleString()}k ctx
          </span>
          {model.typicalThroughputTps && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-900/80 text-emerald-400 border border-white/5">
              <Zap className="w-3 h-3 text-emerald-400" />
              {model.typicalThroughputTps} tps
            </span>
          )}
          {model.modalities.includes('image') && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-900/80 text-purple-400 border border-white/5">
              <Eye className="w-3 h-3" />
              Vision
            </span>
          )}
          {model.capabilities.includes('reasoning') && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-900/80 text-amber-400 border border-white/5">
              <BrainCircuit className="w-3 h-3" />
              Reasoning
            </span>
          )}
          {model.capabilities.includes('code_generation') && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-900/80 text-blue-400 border border-white/5">
              <Code2 className="w-3 h-3" />
              Code
            </span>
          )}
        </div>
      </div>

      {/* Bottom Section: Benchmarks & Pricing */}
      <div className="mt-5 pt-4 border-t border-white/5">
        <div className="grid grid-cols-2 gap-2 text-xs mb-3.5">
          {arenaScore && (
            <div className="bg-white/5 rounded-lg p-2 border border-white/5">
              <div className="text-[10px] text-slate-400 uppercase">Arena Elo</div>
              <div className="font-bold text-sky-400 text-sm mt-0.5">{arenaScore}</div>
            </div>
          )}
          {humanEvalScore ? (
            <div className="bg-white/5 rounded-lg p-2 border border-white/5">
              <div className="text-[10px] text-slate-400 uppercase">HumanEval Code</div>
              <div className="font-bold text-indigo-400 text-sm mt-0.5">{humanEvalScore}%</div>
            </div>
          ) : (
            <div className="bg-white/5 rounded-lg p-2 border border-white/5">
              <div className="text-[10px] text-slate-400 uppercase">Rating Score</div>
              <div className="font-bold text-emerald-400 text-sm mt-0.5">{model.ratingScore}/100</div>
            </div>
          )}
        </div>

        {/* Pricing Info */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Coins className="w-3 h-3 text-emerald-400" />
              Price / 1M tokens
            </div>
            <div className="text-xs font-semibold text-white mt-0.5">
              ${model.inputPricePerMillion.toFixed(2)}{' '}
              <span className="text-slate-400 font-normal">in</span> / $
              {model.outputPricePerMillion.toFixed(2)}{' '}
              <span className="text-slate-400 font-normal">out</span>
            </div>
          </div>

          <Link
            href={`/models/${model.slug}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors"
          >
            Inspect
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
