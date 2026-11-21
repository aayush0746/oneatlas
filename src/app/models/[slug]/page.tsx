import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Cpu, 
  Zap, 
  Coins, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  BarChart3,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { ModelsService } from '@/lib/models-service';
import { CURATED_MODELS } from '@/lib/data/curated-models';
import { CodeSnippet } from '@/components/CodeSnippet';

export async function generateStaticParams() {
  return CURATED_MODELS.map((m) => ({
    slug: m.slug,
  }));
}

export const dynamicParams = true;

interface ModelDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ModelDetailPage({ params }: ModelDetailPageProps) {
  const { slug } = await params;
  const model = await ModelsService.getModelBySlug(slug);

  if (!model) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back navigation */}
      <div className="mb-6">
        <Link
          href="/models"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all models
        </Link>
      </div>

      {/* Main Model Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 mb-8 border border-white/10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {model.lab.name}
              </span>
              {model.isOpenSource && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Open Weights
                </span>
              )}
              {model.isNew && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  New Release
                </span>
              )}
              <span className="text-xs text-slate-400 font-mono">
                Released {new Date(model.releaseDate).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {model.name}
            </h1>

            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {model.description}
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <Link
              href={`/compare?ids=${model.slug}`}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-semibold text-center hover:opacity-95 shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Compare With Others
            </Link>
            <Link
              href="/calculator"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-2"
            >
              <Coins className="w-4 h-4 text-emerald-400" />
              Calculate Token Costs
            </Link>
          </div>
        </div>

        {/* Highlight Specs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Context Length
            </div>
            <div className="text-xl font-bold text-white mt-1 font-mono">
              {(model.contextLength / 1000).toLocaleString()}k tokens
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Input Pricing
            </div>
            <div className="text-xl font-bold text-sky-400 mt-1 font-mono">
              ${model.inputPricePerMillion.toFixed(2)}
              <span className="text-xs font-normal text-slate-400"> / 1M</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Output Pricing
            </div>
            <div className="text-xl font-bold text-indigo-400 mt-1 font-mono">
              ${model.outputPricePerMillion.toFixed(2)}
              <span className="text-xs font-normal text-slate-400"> / 1M</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Typical Speed
            </div>
            <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
              {model.typicalThroughputTps ? `${model.typicalThroughputTps} tps` : '—'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Benchmarks & Multi-Provider Pricing */}
        <div className="lg:col-span-2 space-y-8">
          {/* Benchmarks Section */}
          <section className="glass-panel rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sky-400" />
              Benchmark Performance Scores
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {model.benchmarkScores.map((scoreItem) => (
                <div
                  key={scoreItem.id}
                  className="bg-slate-900/80 rounded-xl p-4 border border-white/5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">
                      {scoreItem.metric.name}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                      {scoreItem.metric.category}
                    </span>
                  </div>

                  <div className="text-2xl font-extrabold text-sky-400 font-mono">
                    {scoreItem.score}
                    <span className="text-xs text-slate-400 ml-1 font-normal">
                      {scoreItem.metric.unit}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {scoreItem.metric.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Available Providers & Latency Table */}
          <section className="glass-panel rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Available Inference Providers & Routing
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Provider</th>
                    <th className="py-2.5 px-3 font-semibold">Input / 1M</th>
                    <th className="py-2.5 px-3 font-semibold">Output / 1M</th>
                    <th className="py-2.5 px-3 font-semibold">Throughput</th>
                    <th className="py-2.5 px-3 font-semibold">TTFT Latency</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {model.providerPricings.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 font-medium text-white flex items-center gap-2">
                        <span>{p.provider.name}</span>
                        {p.provider.isAggregator && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-sky-500/20 text-sky-300">Router</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300">${p.inputPricePerM.toFixed(2)}</td>
                      <td className="py-3 px-3 font-mono text-slate-300">${p.outputPricePerM.toFixed(2)}</td>
                      <td className="py-3 px-3 font-mono text-emerald-400">
                        {p.throughputTps ? `${p.throughputTps} tps` : '—'}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400">
                        {p.latencyMs ? `${p.latencyMs} ms` : '—'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          Operational
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quick Integration Code Snippets */}
          <section className="glass-panel rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Developer Integration (1-Click SDK Code)
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Integrate {model.name} into your software with Vercel AI SDK, LiteLLM, or direct cURL.
            </p>
            <CodeSnippet modelSlug={model.slug} modelName={model.name} />
          </section>
        </div>

        {/* Right Column: Model Specs & Capabilities */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10">
              Technical Specifications
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Architecture</span>
                <span className="text-white font-medium">{model.architecture || 'Transformer'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Parameter Count</span>
                <span className="text-white font-mono">{model.parameterCount || 'Proprietary'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Max Generation Tokens</span>
                <span className="text-white font-mono">{model.maxOutputTokens?.toLocaleString() || '4,096'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">License</span>
                <span className="text-white font-medium">{model.licenseType}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Prompt Caching</span>
                <span className="text-emerald-400 font-medium">
                  {model.cacheReadPricePerMillion ? `Available ($${model.cacheReadPricePerMillion}/M)` : 'Not Supported'}
                </span>
              </div>
            </div>
          </div>

          {/* Capabilities Checklist */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-white/10">
              Supported Capabilities
            </h3>

            <div className="space-y-2 text-xs">
              {model.capabilities.map((cap) => (
                <div key={cap} className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="capitalize">{cap.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Modalities */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-white/10">
              Modalities
            </h3>

            <div className="flex flex-wrap gap-2 text-xs">
              {model.modalities.map((mod) => (
                <span
                  key={mod}
                  className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium capitalize"
                >
                  {mod}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
