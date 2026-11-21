import Link from 'next/link';
import { Building2, Server, ArrowRight, ExternalLink, Cpu, Layers } from 'lucide-react';
import { AI_LABS, AI_PROVIDERS, CURATED_MODELS } from '@/lib/data/curated-models';

export default function LabsDirectoryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* AI Labs Section */}
      <section>
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Research & Frontier Organizations</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Labs & Creators</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Directory of leading artificial intelligence research institutions, frontier labs, and open-source foundation model creators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AI_LABS.map((lab) => {
            const labModels = CURATED_MODELS.filter((m) => m.labId === lab.id);

            return (
              <div
                key={lab.id}
                className="glass-panel rounded-3xl p-6 flex flex-col justify-between border border-white/10 hover:border-indigo-500/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
                      {lab.name[0]}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      Founded {lab.foundedYear}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {lab.name}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{lab.headquarters}</div>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {lab.description}
                  </p>

                  {/* Flagship Models */}
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                      Indexed Models ({labModels.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {labModels.map((m) => (
                        <Link
                          key={m.id}
                          href={`/models/${m.slug}`}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 border border-white/5 transition-colors"
                        >
                          {m.shortName || m.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <Link
                    href={`/models?lab=${lab.slug}`}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                  >
                    View All Models <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {lab.websiteUrl && (
                    <a
                      href={lab.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1"
                    >
                      Website <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Inference Providers Section */}
      <section>
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-3">
            <Server className="w-3.5 h-3.5" />
            <span>Inference Engines & Cloud Routers</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Inference Providers</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Cloud infrastructure platforms, LPU acceleration providers, and unified API gateways hosting model endpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AI_PROVIDERS.map((provider) => {
            const supportedModels = CURATED_MODELS.filter((m) =>
              m.providerPricings.some((p) => p.providerId === provider.id)
            );

            return (
              <div
                key={provider.id}
                className="glass-panel rounded-3xl p-6 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      {provider.name[0]}
                    </div>
                    {provider.isAggregator ? (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-400 border border-sky-500/30">
                        Aggregator / Router
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Hardware / Engine
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {provider.name}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {provider.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/5">
                    <span className="text-[11px] text-slate-400">
                      Hosts <strong className="text-white">{supportedModels.length}</strong> top benchmarked models
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <Link
                    href={`/models?provider=${provider.slug}`}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
                  >
                    Filter Models <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {provider.websiteUrl && (
                    <a
                      href={provider.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1"
                    >
                      Documentation <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
