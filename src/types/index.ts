export type Modality = 'text' | 'image' | 'audio' | 'video' | 'embedding';

export type Capability = 
  | 'function_calling' 
  | 'json_mode' 
  | 'reasoning' 
  | 'vision' 
  | 'code_generation' 
  | 'caching' 
  | 'streaming';

export interface Lab {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  headquarters?: string;
  foundedYear?: number;
  modelsCount?: number;
}

export interface Provider {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  isAggregator?: boolean;
}

export interface ModelProviderPricing {
  id: string;
  modelId: string;
  providerId: string;
  provider: Provider;
  inputPricePerM: number;
  outputPricePerM: number;
  throughputTps?: number;
  latencyMs?: number;
  isAvailable: boolean;
  region?: string;
}

export interface BenchmarkMetric {
  id: string;
  code: string; // "ARENA_ELO" | "MMLU_PRO" | "HUMANEVAL" | "GSM8K" | "GPQA_DIAMOND" | "MATH_500"
  name: string;
  category: 'REASONING' | 'CODING' | 'MATH' | 'OVERALL' | 'EFFICIENCY';
  unit: string;
  maxScore?: number;
  description: string;
}

export interface ModelBenchmarkScore {
  id: string;
  modelId: string;
  metricId: string;
  metric: BenchmarkMetric;
  score: number;
  source?: string;
}

export interface AIModel {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  description: string;
  labId: string;
  lab: Lab;
  releaseDate: string; // ISO date
  contextLength: number; // in tokens
  maxOutputTokens?: number;
  inputPricePerMillion: number; // in USD
  outputPricePerMillion: number; // in USD
  cacheReadPricePerMillion?: number;
  architecture?: string;
  parameterCount?: string;
  modalities: Modality[];
  capabilities: Capability[];
  licenseType: string;
  isOpenSource: boolean;
  isFeatured: boolean;
  isNew: boolean;
  ratingScore: number; // 0 - 100
  typicalThroughputTps?: number;
  typicalTtftMs?: number;
  benchmarkScores: ModelBenchmarkScore[];
  providerPricings: ModelProviderPricing[];
}

export interface ModelFilterParams {
  search?: string;
  lab?: string; // lab slug or 'all'
  provider?: string; // provider slug or 'all'
  modality?: string; // 'all' | 'image' | 'audio' etc.
  capability?: string;
  openSource?: boolean | 'all';
  minContext?: number;
  maxInputPrice?: number;
  sortBy?: 'popularity' | 'price_asc' | 'price_desc' | 'context_desc' | 'release_date' | 'rating' | 'speed';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CostCalculationInput {
  inputTokensPerMonth: number;
  outputTokensPerMonth: number;
  cacheHitRatioPercent: number;
}

export interface CostCalculationResult {
  modelId: string;
  modelName: string;
  labName: string;
  monthlyCost: number;
  inputCost: number;
  outputCost: number;
  cacheSavings: number;
}
