import { prisma, hasDatabaseUrl } from './db';
import { CURATED_MODELS, AI_LABS, AI_PROVIDERS, BENCHMARK_METRICS } from './data/curated-models';
import { AIModel, ModelFilterParams, PaginatedResponse, Lab, Provider, BenchmarkMetric } from '@/types';

export class ModelsService {
  /**
   * Search and filter AI models with pagination and sorting
   */
  static async getModels(params: ModelFilterParams = {}): Promise<PaginatedResponse<AIModel>> {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(params.limit) || 12));
    const search = params.search?.toLowerCase().trim();
    const labSlug = params.lab && params.lab !== 'all' ? params.lab : undefined;
    const providerSlug = params.provider && params.provider !== 'all' ? params.provider : undefined;
    const capability = params.capability && params.capability !== 'all' ? params.capability : undefined;
    const modality = params.modality && params.modality !== 'all' ? params.modality : undefined;
    const openSource = params.openSource !== undefined && params.openSource !== 'all' 
      ? Boolean(params.openSource === true || (params.openSource as any) === 'true') 
      : undefined;
    const minContext = params.minContext ? Number(params.minContext) : undefined;
    const maxInputPrice = params.maxInputPrice ? Number(params.maxInputPrice) : undefined;
    const sortBy = params.sortBy || 'popularity';

    // If PostgreSQL is available, attempt Prisma query
    if (hasDatabaseUrl) {
      try {
        const whereClause: any = {};

        if (search) {
          whereClause.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
          ];
        }

        if (labSlug) {
          whereClause.lab = { slug: labSlug };
        }

        if (providerSlug) {
          whereClause.providerPricings = {
            some: {
              provider: { slug: providerSlug },
            },
          };
        }

        if (openSource !== undefined) {
          whereClause.isOpenSource = openSource;
        }

        if (minContext) {
          whereClause.contextLength = { gte: minContext };
        }

        if (maxInputPrice) {
          whereClause.inputPricePerMillion = { lte: maxInputPrice };
        }

        let orderBy: any = { ratingScore: 'desc' };
        if (sortBy === 'price_asc') orderBy = { inputPricePerMillion: 'asc' };
        else if (sortBy === 'price_desc') orderBy = { inputPricePerMillion: 'desc' };
        else if (sortBy === 'context_desc') orderBy = { contextLength: 'desc' };
        else if (sortBy === 'release_date') orderBy = { releaseDate: 'desc' };
        else if (sortBy === 'speed') orderBy = { typicalThroughputTps: 'desc' };

        const [total, models] = await Promise.all([
          prisma.model.count({ where: whereClause }),
          prisma.model.findMany({
            where: whereClause,
            include: {
              lab: true,
              benchmarkScores: { include: { metric: true } },
              providerPricings: { include: { provider: true } },
            },
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
          }),
        ]);

        return {
          data: models as unknown as AIModel[],
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        };
      } catch (err) {
        console.warn('Prisma query failed, falling back to curated in-memory dataset:', err);
      }
    }

    // High-performance In-Memory Fallback
    let filtered = [...CURATED_MODELS];

    if (search) {
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(search) ||
          m.description.toLowerCase().includes(search) ||
          m.lab.name.toLowerCase().includes(search) ||
          m.slug.toLowerCase().includes(search)
      );
    }

    if (labSlug) {
      filtered = filtered.filter((m) => m.lab.slug === labSlug);
    }

    if (providerSlug) {
      filtered = filtered.filter((m) =>
        m.providerPricings.some((p) => p.provider.slug === providerSlug)
      );
    }

    if (modality) {
      filtered = filtered.filter((m) => m.modalities.includes(modality as any));
    }

    if (capability) {
      filtered = filtered.filter((m) => m.capabilities.includes(capability as any));
    }

    if (openSource !== undefined) {
      filtered = filtered.filter((m) => m.isOpenSource === openSource);
    }

    if (minContext) {
      filtered = filtered.filter((m) => m.contextLength >= minContext);
    }

    if (maxInputPrice !== undefined) {
      filtered = filtered.filter((m) => m.inputPricePerMillion <= maxInputPrice);
    }

    // Sorting
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
        case 'rating':
        case 'popularity':
        default:
          return (b.ratingScore || 0) - (a.ratingScore || 0);
      }
    });

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Get single model detail by slug
   */
  static async getModelBySlug(slug: string): Promise<AIModel | null> {
    if (hasDatabaseUrl) {
      try {
        const model = await prisma.model.findUnique({
          where: { slug },
          include: {
            lab: true,
            benchmarkScores: { include: { metric: true } },
            providerPricings: { include: { provider: true } },
          },
        });
        if (model) return model as unknown as AIModel;
      } catch (err) {
        console.warn('Prisma getModelBySlug failed, falling back:', err);
      }
    }

    const found = CURATED_MODELS.find((m) => m.slug === slug);
    return found || null;
  }

  /**
   * Fetch 2 to 4 models for side-by-side comparison
   */
  static async getModelsForComparison(slugs: string[]): Promise<AIModel[]> {
    if (!slugs.length) return [];
    
    if (hasDatabaseUrl) {
      try {
        const models = await prisma.model.findMany({
          where: { slug: { in: slugs } },
          include: {
            lab: true,
            benchmarkScores: { include: { metric: true } },
            providerPricings: { include: { provider: true } },
          },
        });
        if (models.length > 0) return models as unknown as AIModel[];
      } catch (err) {
        console.warn('Prisma getModelsForComparison failed, falling back:', err);
      }
    }

    return CURATED_MODELS.filter((m) => slugs.includes(m.slug));
  }

  /**
   * Get all AI Labs with models count
   */
  static async getLabs(): Promise<(Lab & { modelCount: number })[]> {
    return AI_LABS.map((lab) => {
      const modelCount = CURATED_MODELS.filter((m) => m.labId === lab.id).length;
      return {
        ...lab,
        modelCount,
      };
    });
  }

  /**
   * Get all Providers
   */
  static async getProviders(): Promise<Provider[]> {
    return AI_PROVIDERS;
  }

  /**
   * Get Leaderboards by Benchmark (Arena Elo, MMLU-Pro, HumanEval, Math, Speed)
   */
  static async getLeaderboard(metricCode = 'ARENA_ELO'): Promise<{
    metric: BenchmarkMetric;
    rankings: {
      rank: number;
      model: AIModel;
      score: number;
      source?: string;
    }[];
  }> {
    const metric = BENCHMARK_METRICS.find((m) => m.code === metricCode) || BENCHMARK_METRICS[0];

    const scoredModels = CURATED_MODELS.map((model) => {
      const bench = model.benchmarkScores.find((b) => b.metric.code === metric.code);
      return {
        model,
        score: bench?.score ?? 0,
        source: bench?.source,
      };
    })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        rank: index + 1,
        ...item,
      }));

    return {
      metric,
      rankings: scoredModels,
    };
  }

  /**
   * Global summary stats for homepage & intelligence overview
   */
  static async getStats() {
    const totalModels = CURATED_MODELS.length;
    const openSourceCount = CURATED_MODELS.filter((m) => m.isOpenSource).length;
    const maxContext = Math.max(...CURATED_MODELS.map((m) => m.contextLength));
    const lowestPrice = Math.min(...CURATED_MODELS.map((m) => m.inputPricePerMillion));

    return {
      totalModels,
      openSourceCount,
      labsCount: AI_LABS.length,
      providersCount: AI_PROVIDERS.length,
      maxContextWindow: maxContext,
      lowestInputPrice: lowestPrice,
    };
  }
}
