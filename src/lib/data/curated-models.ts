import { AIModel, BenchmarkMetric, Lab, Provider } from '@/types';

export const BENCHMARK_METRICS: BenchmarkMetric[] = [
  {
    id: 'm-arena-elo',
    code: 'ARENA_ELO',
    name: 'LMSYS Chatbot Arena',
    category: 'OVERALL',
    unit: 'Elo',
    maxScore: 1400,
    description: 'Crowdsourced open human evaluation benchmark of LLM quality and instruction following.'
  },
  {
    id: 'm-mmlu-pro',
    code: 'MMLU_PRO',
    name: 'MMLU-Pro',
    category: 'REASONING',
    unit: '%',
    maxScore: 100,
    description: 'Massive Multitask Language Understanding Pro - rigorous evaluation of college-level knowledge and reasoning.'
  },
  {
    id: 'm-humaneval',
    code: 'HUMANEVAL',
    name: 'HumanEval (Python)',
    category: 'CODING',
    unit: '%',
    maxScore: 100,
    description: 'Pass@1 code synthesis benchmark evaluating real-world algorithmic programming capabilities.'
  },
  {
    id: 'm-gsm8k',
    code: 'GSM8K',
    name: 'GSM8K (Grade School Math)',
    category: 'MATH',
    unit: '%',
    maxScore: 100,
    description: '8,500 grade school math word problems requiring multi-step arithmetic reasoning.'
  },
  {
    id: 'm-math-500',
    code: 'MATH_500',
    name: 'MATH-500',
    category: 'MATH',
    unit: '%',
    maxScore: 100,
    description: 'Challenging high school and Olympiad competition math problems.'
  },
  {
    id: 'm-gpqa-diamond',
    code: 'GPQA_DIAMOND',
    name: 'GPQA Diamond',
    category: 'REASONING',
    unit: '%',
    maxScore: 100,
    description: 'Graduate-level Google-proof Q&A benchmark across biology, physics, and chemistry.'
  }
];

export const AI_LABS: Lab[] = [
  {
    id: 'lab-anthropic',
    slug: 'anthropic',
    name: 'Anthropic',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&q=80',
    websiteUrl: 'https://anthropic.com',
    description: 'AI safety and research company building reliable, interpretable, and steerable AI systems like Claude.',
    headquarters: 'San Francisco, CA',
    foundedYear: 2021
  },
  {
    id: 'lab-openai',
    slug: 'openai',
    name: 'OpenAI',
    logoUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=128&q=80',
    websiteUrl: 'https://openai.com',
    description: 'Pioneering AI research and deployment company behind GPT-4o, ChatGPT, and reasoning models like o1.',
    headquarters: 'San Francisco, CA',
    foundedYear: 2015
  },
  {
    id: 'lab-deepseek',
    slug: 'deepseek',
    name: 'DeepSeek',
    logoUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=128&q=80',
    websiteUrl: 'https://deepseek.com',
    description: 'High-efficiency open-weights foundation models, creator of DeepSeek-V3 and breakthrough reasoning model DeepSeek-R1.',
    headquarters: 'Hangzhou, China',
    foundedYear: 2023
  },
  {
    id: 'lab-google',
    slug: 'google',
    name: 'Google DeepMind',
    logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&q=80',
    websiteUrl: 'https://deepmind.google',
    description: 'Leading artificial intelligence research laboratory creating Gemini native multimodal models.',
    headquarters: 'London / Mountain View',
    foundedYear: 2010
  },
  {
    id: 'lab-meta',
    slug: 'meta',
    name: 'Meta AI',
    logoUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=128&q=80',
    websiteUrl: 'https://ai.meta.com',
    description: 'Open-science AI research organization democratizing frontier intelligence through Llama 3.',
    headquarters: 'Menlo Park, CA',
    foundedYear: 2013
  },
  {
    id: 'lab-mistral',
    slug: 'mistral',
    name: 'Mistral AI',
    logoUrl: 'https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=128&q=80',
    websiteUrl: 'https://mistral.ai',
    description: 'European AI lab championing open and lightweight high-performance models and frontier architectures.',
    headquarters: 'Paris, France',
    foundedYear: 2023
  },
  {
    id: 'lab-xai',
    slug: 'xai',
    name: 'xAI',
    logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=128&q=80',
    websiteUrl: 'https://x.ai',
    description: 'Building AI to accelerate human scientific discovery and truthful comprehension of the universe.',
    headquarters: 'Burlingame, CA',
    foundedYear: 2023
  },
  {
    id: 'lab-qwen',
    slug: 'qwen',
    name: 'Alibaba Qwen',
    logoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=128&q=80',
    websiteUrl: 'https://qwenlm.github.io',
    description: 'Advanced open-weights multilingual and code-specialized models developed by Alibaba Cloud.',
    headquarters: 'Hangzhou, China',
    foundedYear: 2023
  }
];

export const AI_PROVIDERS: Provider[] = [
  {
    id: 'prov-openrouter',
    slug: 'openrouter',
    name: 'OpenRouter',
    websiteUrl: 'https://openrouter.ai',
    description: 'Universal unified API router with automatic fallbacks and multi-provider load balancing.',
    isAggregator: true
  },
  {
    id: 'prov-groq',
    slug: 'groq',
    name: 'Groq',
    websiteUrl: 'https://groq.com',
    description: 'LPU inference engine delivering lightning-fast token generation at industry-record speeds (300-800 tps).',
    isAggregator: false
  },
  {
    id: 'prov-together',
    slug: 'together',
    name: 'Together AI',
    websiteUrl: 'https://together.ai',
    description: 'High-throughput cloud platform specialized in open-source model inference and fine-tuning.',
    isAggregator: false
  },
  {
    id: 'prov-fireworks',
    slug: 'fireworks',
    name: 'Fireworks AI',
    websiteUrl: 'https://fireworks.ai',
    description: 'Production-ready serverless AI platform with optimized compound inference and structured output.',
    isAggregator: false
  },
  {
    id: 'prov-direct',
    slug: 'first-party',
    name: 'First-Party Cloud (Direct)',
    websiteUrl: 'https://oneatlas.dev',
    description: 'Direct API endpoints provided directly by original model developers (OpenAI, Anthropic, Google).',
    isAggregator: false
  }
];

export const CURATED_MODELS: AIModel[] = [
  {
    id: 'model-claude-3-5-sonnet',
    slug: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    shortName: 'Sonnet 3.5',
    description: 'Industry benchmark for software engineering, complex multi-step reasoning, and vision analysis. Outperforms prior frontier models on coding and nuanced tool use.',
    labId: 'lab-anthropic',
    lab: AI_LABS[0],
    releaseDate: '2024-10-22T00:00:00Z',
    contextLength: 200000,
    maxOutputTokens: 8192,
    inputPricePerMillion: 3.00,
    outputPricePerMillion: 15.00,
    cacheReadPricePerMillion: 0.30,
    architecture: 'Dense Transformer',
    parameterCount: 'Estimated ~175B',
    modalities: ['text', 'image'],
    capabilities: ['function_calling', 'json_mode', 'vision', 'code_generation', 'caching', 'streaming'],
    licenseType: 'Proprietary',
    isOpenSource: false,
    isFeatured: true,
    isNew: false,
    ratingScore: 98,
    typicalThroughputTps: 72,
    typicalTtftMs: 420,
    benchmarkScores: [
      { id: 'bs-c35s-1', modelId: 'model-claude-3-5-sonnet', metricId: 'm-arena-elo', metric: BENCHMARK_METRICS[0], score: 1320, source: 'LMSYS 2024' },
      { id: 'bs-c35s-2', modelId: 'model-claude-3-5-sonnet', metricId: 'm-mmlu-pro', metric: BENCHMARK_METRICS[1], score: 78.0, source: 'Anthropic Paper' },
      { id: 'bs-c35s-3', modelId: 'model-claude-3-5-sonnet', metricId: 'm-humaneval', metric: BENCHMARK_METRICS[2], score: 93.7, source: 'EvalPlus 2024' },
      { id: 'bs-c35s-4', modelId: 'model-claude-3-5-sonnet', metricId: 'm-gpqa-diamond', metric: BENCHMARK_METRICS[5], score: 65.0, source: 'Internal Eval' }
    ],
    providerPricings: [
      { id: 'pp-c35s-direct', modelId: 'model-claude-3-5-sonnet', providerId: 'prov-direct', provider: AI_PROVIDERS[4], inputPricePerM: 3.00, outputPricePerM: 15.00, throughputTps: 75, latencyMs: 410, isAvailable: true },
      { id: 'pp-c35s-openrouter', modelId: 'model-claude-3-5-sonnet', providerId: 'prov-openrouter', provider: AI_PROVIDERS[0], inputPricePerM: 3.00, outputPricePerM: 15.00, throughputTps: 70, latencyMs: 430, isAvailable: true }
    ]
  },
  {
    id: 'model-deepseek-r1',
    slug: 'deepseek-r1',
    name: 'DeepSeek R1',
    shortName: 'DeepSeek-R1',
    description: 'Groundbreaking open-weights reasoning model trained with large-scale reinforcement learning. Competes directly with OpenAI o1 on math, coding, and complex scientific reasoning at a fraction of the cost.',
    labId: 'lab-deepseek',
    lab: AI_LABS[2],
    releaseDate: '2025-01-20T00:00:00Z',
    contextLength: 128000,
    maxOutputTokens: 8192,
    inputPricePerMillion: 0.55,
    outputPricePerMillion: 2.19,
    cacheReadPricePerMillion: 0.14,
    architecture: 'Mixture of Experts (MoE) + Multi-head Latent Attention (MLA)',
    parameterCount: '671B Total (37B Active)',
    modalities: ['text'],
    capabilities: ['reasoning', 'code_generation', 'caching', 'streaming'],
    licenseType: 'Open Weights (MIT)',
    isOpenSource: true,
    isFeatured: true,
    isNew: true,
    ratingScore: 99,
    typicalThroughputTps: 45,
    typicalTtftMs: 980,
    benchmarkScores: [
      { id: 'bs-dr1-1', modelId: 'model-deepseek-r1', metricId: 'm-arena-elo', metric: BENCHMARK_METRICS[0], score: 1358, source: 'LMSYS 2025' },
      { id: 'bs-dr1-2', modelId: 'model-deepseek-r1', metricId: 'm-mmlu-pro', metric: BENCHMARK_METRICS[1], score: 84.0, source: 'DeepSeek Technical Report' },
      { id: 'bs-dr1-3', modelId: 'model-deepseek-r1', metricId: 'm-humaneval', metric: BENCHMARK_METRICS[2], score: 92.3, source: 'DeepSeek Technical Report' },
      { id: 'bs-dr1-4', modelId: 'model-deepseek-r1', metricId: 'm-math-500', metric: BENCHMARK_METRICS[4], score: 97.3, source: 'Official Eval' },
      { id: 'bs-dr1-5', modelId: 'model-deepseek-r1', metricId: 'm-gpqa-diamond', metric: BENCHMARK_METRICS[5], score: 71.5, source: 'Official Eval' }
    ],
    providerPricings: [
      { id: 'pp-dr1-direct', modelId: 'model-deepseek-r1', providerId: 'prov-direct', provider: AI_PROVIDERS[4], inputPricePerM: 0.55, outputPricePerM: 2.19, throughputTps: 40, latencyMs: 980, isAvailable: true },
      { id: 'pp-dr1-together', modelId: 'model-deepseek-r1', providerId: 'prov-together', provider: AI_PROVIDERS[2], inputPricePerM: 0.80, outputPricePerM: 2.40, throughputTps: 60, latencyMs: 750, isAvailable: true },
      { id: 'pp-dr1-openrouter', modelId: 'model-deepseek-r1', providerId: 'prov-openrouter', provider: AI_PROVIDERS[0], inputPricePerM: 0.55, outputPricePerM: 2.19, throughputTps: 52, latencyMs: 820, isAvailable: true }
    ]
  },
  {
    id: 'model-gpt-4o',
    slug: 'gpt-4o',
    name: 'OpenAI GPT-4o',
    shortName: 'GPT-4o',
    description: 'OpenAIs flagship omni multimodal model integrating text, vision, and audio reasoning natively. Fast, responsive, and widely supported across developer ecosystems.',
    labId: 'lab-openai',
    lab: AI_LABS[1],
    releaseDate: '2024-05-13T00:00:00Z',
    contextLength: 128000,
    maxOutputTokens: 16384,
    inputPricePerMillion: 2.50,
    outputPricePerMillion: 10.00,
    cacheReadPricePerMillion: 1.25,
    architecture: 'Dense Transformer Omni',
    parameterCount: 'Estimated ~200B',
    modalities: ['text', 'image', 'audio'],
    capabilities: ['function_calling', 'json_mode', 'vision', 'code_generation', 'caching', 'streaming'],
    licenseType: 'Proprietary',
    isOpenSource: false,
    isFeatured: true,
    isNew: false,
    ratingScore: 96,
    typicalThroughputTps: 85,
    typicalTtftMs: 380,
    benchmarkScores: [
      { id: 'bs-g4o-1', modelId: 'model-gpt-4o', metricId: 'm-arena-elo', metric: BENCHMARK_METRICS[0], score: 1310, source: 'LMSYS' },
      { id: 'bs-g4o-2', modelId: 'model-gpt-4o', metricId: 'm-mmlu-pro', metric: BENCHMARK_METRICS[1], score: 77.2, source: 'OpenAI Tech Report' },
      { id: 'bs-g4o-3', modelId: 'model-gpt-4o', metricId: 'm-humaneval', metric: BENCHMARK_METRICS[2], score: 90.2, source: 'EvalPlus' },
      { id: 'bs-g4o-4', modelId: 'model-gpt-4o', metricId: 'm-gsm8k', metric: BENCHMARK_METRICS[3], score: 95.8, source: 'Standard Bench' }
    ],
    providerPricings: [
      { id: 'pp-g4o-direct', modelId: 'model-gpt-4o', providerId: 'prov-direct', provider: AI_PROVIDERS[4], inputPricePerM: 2.50, outputPricePerM: 10.00, throughputTps: 85, latencyMs: 380, isAvailable: true },
      { id: 'pp-g4o-openrouter', modelId: 'model-gpt-4o', providerId: 'prov-openrouter', provider: AI_PROVIDERS[0], inputPricePerM: 2.50, outputPricePerM: 10.00, throughputTps: 82, latencyMs: 400, isAvailable: true }
    ]
  },
  {
    id: 'model-gemini-2-0-flash',
    slug: 'gemini-2-0-flash',
    name: 'Gemini 2.0 Flash',
    shortName: 'Gemini 2.0 Flash',
    description: 'Next-gen multimodal workhorse model by Google with exceptional speed, native tool calling, and a 1-million-token context window.',
    labId: 'lab-google',
    lab: AI_LABS[3],
    releaseDate: '2024-12-11T00:00:00Z',
    contextLength: 1048576,
    maxOutputTokens: 8192,
    inputPricePerMillion: 0.10,
    outputPricePerMillion: 0.40,
    cacheReadPricePerMillion: 0.025,
    architecture: 'Multimodal Transformer',
    parameterCount: 'Proprietary Efficient',
    modalities: ['text', 'image', 'audio', 'video'],
    capabilities: ['function_calling', 'json_mode', 'vision', 'code_generation', 'caching', 'streaming'],
    licenseType: 'Proprietary',
    isOpenSource: false,
    isFeatured: true,
    isNew: true,
    ratingScore: 94,
    typicalThroughputTps: 135,
    typicalTtftMs: 290,
    benchmarkScores: [
      { id: 'bs-g2f-1', modelId: 'model-gemini-2-0-flash', metricId: 'm-arena-elo', metric: BENCHMARK_METRICS[0], score: 1295, source: 'LMSYS' },
      { id: 'bs-g2f-2', modelId: 'model-gemini-2-0-flash', metricId: 'm-mmlu-pro', metric: BENCHMARK_METRICS[1], score: 75.4, source: 'Google DeepMind' },
      { id: 'bs-g2f-3', modelId: 'model-gemini-2-0-flash', metricId: 'm-humaneval', metric: BENCHMARK_METRICS[2], score: 88.5, source: 'Google DeepMind' }
    ],
    providerPricings: [
      { id: 'pp-g2f-direct', modelId: 'model-gemini-2-0-flash', providerId: 'prov-direct', provider: AI_PROVIDERS[4], inputPricePerM: 0.10, outputPricePerM: 0.40, throughputTps: 135, latencyMs: 290, isAvailable: true },
      { id: 'pp-g2f-openrouter', modelId: 'model-gemini-2-0-flash', providerId: 'prov-openrouter', provider: AI_PROVIDERS[0], inputPricePerM: 0.10, outputPricePerM: 0.40, throughputTps: 125, latencyMs: 310, isAvailable: true }
    ]
  },
  {
    id: 'model-deepseek-v3',
    slug: 'deepseek-v3',
    name: 'DeepSeek V3',
    shortName: 'DeepSeek-V3',
    description: 'Leading 671B Mixture-of-Experts general purpose open-weights model delivering frontier chat, instruction following, and multilingual generation at ultra-low inference costs.',
    labId: 'lab-deepseek',
    lab: AI_LABS[2],
    releaseDate: '2024-12-26T00:00:00Z',
    contextLength: 128000,
    maxOutputTokens: 8192,
    inputPricePerMillion: 0.14,
    outputPricePerMillion: 0.28,
    cacheReadPricePerMillion: 0.014,
    architecture: 'Mixture of Experts (MoE)',
    parameterCount: '671B (37B active)',
    modalities: ['text'],
    capabilities: ['function_calling', 'json_mode', 'code_generation', 'caching', 'streaming'],
    licenseType: 'Open Weights (MIT)',
    isOpenSource: true,
    isFeatured: true,
    isNew: true,
    ratingScore: 95,
    typicalThroughputTps: 82,
    typicalTtftMs: 440,
    benchmarkScores: [
      { id: 'bs-dv3-1', modelId: 'model-deepseek-v3', metricId: 'm-arena-elo', metric: BENCHMARK_METRICS[0], score: 1315, source: 'LMSYS' },
      { id: 'bs-dv3-2', modelId: 'model-deepseek-v3', metricId: 'm-mmlu-pro', metric: BENCHMARK_METRICS[1], score: 75.9, source: 'DeepSeek AI' },
      { id: 'bs-dv3-3', modelId: 'model-deepseek-v3', metricId: 'm-humaneval', metric: BENCHMARK_METRICS[2], score: 89.1, source: 'DeepSeek AI' }
    ],
    providerPricings: [
      { id: 'pp-dv3-direct', modelId: 'model-deepseek-v3', providerId: 'prov-direct', provider: AI_PROVIDERS[4], inputPricePerM: 0.14, outputPricePerM: 0.28, throughputTps: 80, latencyMs: 440, isAvailable: true },
      { id: 'pp-dv3-together', modelId: 'model-deepseek-v3', providerId: 'prov-together', provider: AI_PROVIDERS[2], inputPricePerM: 0.25, outputPricePerM: 0.50, throughputTps: 90, latencyMs: 380, isAvailable: true },
      { id: 'pp-dv3-openrouter', modelId: 'model-deepseek-v3', providerId: 'prov-openrouter', provider: AI_PROVIDERS[0], inputPricePerM: 0.14, outputPricePerM: 0.28, throughputTps: 78, latencyMs: 460, isAvailable: true }
    ]
  },
  {
    id: 'model-llama-3-3-70b',
    slug: 'llama-3-3-70b-instruct',
    name: 'Llama 3.3 70B Instruct',
    shortName: 'Llama 3.3 70B',
    description: 'Metas premier open weights model that matches previous 405B capabilities at a fraction of compute. Optimized for coding, instruction following, and agent workflows.',
    labId: 'lab-meta',
    lab: AI_LABS[4],
    releaseDate: '2024-12-06T00:00:00Z',
    contextLength: 128000,
    maxOutputTokens: 4096,
    inputPricePerMillion: 0.35,
    outputPricePerMillion: 0.40,
    architecture: 'Dense Transformer',
    parameterCount: '70B',
    modalities: ['text'],
    capabilities: ['function_calling', 'json_mode', 'code_generation', 'streaming'],
    licenseType: 'Llama 3.3 Community License',
    isOpenSource: true,
    isFeatured: true,
    isNew: false,
    ratingScore: 92,
    typicalThroughputTps: 280, // on Groq!
    typicalTtftMs: 180,
    benchmarkScores: [
      { id: 'bs-l33-1', modelId: 'model-llama-3-3-70b', metricId: 'm-arena-elo', metric: BENCHMARK_METRICS[0], score: 1278, source: 'LMSYS' },
      { id: 'bs-l33-2', modelId: 'model-llama-3-3-70b', metricId: 'm-mmlu-pro', metric: BENCHMARK_METRICS[1], score: 71.0, source: 'Meta Research' },
      { id: 'bs-l33-3', modelId: 'model-llama-3-3-70b', metricId: 'm-humaneval', metric: BENCHMARK_METRICS[2], score: 88.0, source: 'Meta Research' }
    ],
    providerPricings: [
      { id: 'pp-l33-groq', modelId: 'model-llama-3-3-70b', providerId: 'prov-groq', provider: AI_PROVIDERS[1], inputPricePerM: 0.59, outputPricePerM: 0.79, throughputTps: 280, latencyMs: 180, isAvailable: true },
      { id: 'pp-l33-fireworks', modelId: 'model-llama-3-3-70b', providerId: 'prov-fireworks', provider: AI_PROVIDERS[3], inputPricePerM: 0.35, outputPricePerM: 0.40, throughputTps: 110, latencyMs: 240, isAvailable: true },
      { id: 'pp-l33-together', modelId: 'model-llama-3-3-70b', providerId: 'prov-together', provider: AI_PROVIDERS[2], inputPricePerM: 0.35, outputPricePerM: 0.40, throughputTps: 120, latencyMs: 250, isAvailable: true }
    ]
  },
  {
    id: 'model-gpt-4o-mini',
    slug: 'gpt-4o-mini',
    name: 'OpenAI GPT-4o mini',
    shortName: 'GPT-4o mini',
    description: 'Ultra-fast and exceptionally cost-effective small model from OpenAI. Perfect for fast agent loops, text classification, and high-volume structured data extraction.',
    labId: 'lab-openai',
    lab: AI_LABS[1],
    releaseDate: '2024-07-18T00:00:00Z',
    contextLength: 128000,
    maxOutputTokens: 16384,
    inputPricePerMillion: 0.15,
    outputPricePerMillion: 0.60,
    cacheReadPricePerMillion: 0.075,
    architecture: 'Compact Multimodal Transformer',
    parameterCount: 'Estimated ~8B',
    modalities: ['text', 'image'],
    capabilities: ['function_calling', 'json_mode', 'vision', 'code_generation', 'caching', 'streaming'],
    licenseType: 'Proprietary',
    isOpenSource: false,
    isFeatured: false,
    isNew: false,
    ratingScore: 90,
    typicalThroughputTps: 110,
    typicalTtftMs: 310,
    benchmarkScores: [
      { id: 'bs-g4om-1', modelId: 'model-gpt-4o-mini', metricId: 'm-arena-elo', metric: BENCHMARK_METRICS[0], score: 1265, source: 'LMSYS' },
      { id: 'bs-g4om-2', modelId: 'model-gpt-4o-mini', metricId: 'm-mmlu-pro', metric: BENCHMARK_METRICS[1], score: 68.5, source: 'OpenAI' },
      { id: 'bs-g4om-3', modelId: 'model-gpt-4o-mini', metricId: 'm-humaneval', metric: BENCHMARK_METRICS[2], score: 86.8, source: 'EvalPlus' }
    ],
    providerPricings: [
      { id: 'pp-g4om-direct', modelId: 'model-gpt-4o-mini', providerId: 'prov-direct', provider: AI_PROVIDERS[4], inputPricePerM: 0.15, outputPricePerM: 0.60, throughputTps: 110, latencyMs: 310, isAvailable: true },
      { id: 'pp-g4om-openrouter', modelId: 'model-gpt-4o-mini', providerId: 'prov-openrouter', provider: AI_PROVIDERS[0], inputPricePerM: 0.15, outputPricePerM: 0.60, throughputTps: 105, latencyMs: 330, isAvailable: true }
    ]
  },
  {
    id: 'model-qwen-2-5-coder-32b',
    slug: 'qwen-2-5-coder-32b-instruct',
    name: 'Qwen 2.5 Coder 32B Instruct',
    shortName: 'Qwen 2.5 Coder 32B',
    description: 'SOTA open-source code generation model. Rivals GPT-4o in coding benchmarks while fitting on a single consumer GPU when quantized.',
    labId: 'lab-qwen',
    lab: AI_LABS[7],
    releaseDate: '2024-11-12T00:00:00Z',
    contextLength: 128000,
    maxOutputTokens: 8192,
    inputPricePerMillion: 0.20,
    outputPricePerMillion: 0.40,
    architecture: 'Dense Transformer',
    parameterCount: '32B',
    modalities: ['text'],
    capabilities: ['code_generation', 'function_calling', 'json_mode', 'streaming'],
    licenseType: 'Apache 2.0',
    isOpenSource: true,
    isFeatured: true,
    isNew: false,
    ratingScore: 93,
    typicalThroughputTps: 140,
    typicalTtftMs: 220,
    benchmarkScores: [
      { id: 'bs-q25c-1', modelId: 'model-qwen-2-5-coder-32b', metricId: 'm-arena-elo', metric: BENCHMARK_METRICS[0], score: 1282, source: 'LMSYS' },
      { id: 'bs-q25c-2', modelId: 'model-qwen-2-5-coder-32b', metricId: 'm-humaneval', metric: BENCHMARK_METRICS[2], score: 92.7, source: 'EvalPlus Leaderboard' },
      { id: 'bs-q25c-3', modelId: 'model-qwen-2-5-coder-32b', metricId: 'm-math-500', metric: BENCHMARK_METRICS[4], score: 85.2, source: 'Alibaba Cloud' }
    ],
    providerPricings: [
      { id: 'pp-q25c-together', modelId: 'model-qwen-2-5-coder-32b', providerId: 'prov-together', provider: AI_PROVIDERS[2], inputPricePerM: 0.20, outputPricePerM: 0.40, throughputTps: 140, latencyMs: 220, isAvailable: true },
      { id: 'pp-q25c-openrouter', modelId: 'model-qwen-2-5-coder-32b', providerId: 'prov-openrouter', provider: AI_PROVIDERS[0], inputPricePerM: 0.20, outputPricePerM: 0.40, throughputTps: 130, latencyMs: 240, isAvailable: true }
    ]
  },
  {
    id: 'model-o1',
    slug: 'openai-o1',
    name: 'OpenAI o1',
    shortName: 'o1',
    description: 'Frontier reasoning model designed to spend more time thinking before responding. Excels in complex mathematics, competitive programming, and doctoral-level science.',
    labId: 'lab-openai',
    lab: AI_LABS[1],
    releaseDate: '2024-12-05T00:00:00Z',
    contextLength: 200000,
    maxOutputTokens: 100000,
    inputPricePerMillion: 15.00,
    outputPricePerMillion: 60.00,
    cacheReadPricePerMillion: 7.50,
    architecture: 'CoT RL-Reasoning Transformer',
    parameterCount: 'Proprietary Large',
    modalities: ['text', 'image'],
    capabilities: ['reasoning', 'vision', 'code_generation', 'caching', 'streaming'],
    licenseType: 'Proprietary',
    isOpenSource: false,
    isFeatured: true,
    isNew: false,
    ratingScore: 97,
    typicalThroughputTps: 40,
    typicalTtftMs: 3200,
    benchmarkScores: [
      { id: 'bs-o1-1', modelId: 'model-o1', metricId: 'm-arena-elo', metric: BENCHMARK_METRICS[0], score: 1362, source: 'LMSYS' },
      { id: 'bs-o1-2', modelId: 'model-o1', metricId: 'm-mmlu-pro', metric: BENCHMARK_METRICS[1], score: 85.2, source: 'OpenAI Paper' },
      { id: 'bs-o1-3', modelId: 'model-o1', metricId: 'm-math-500', metric: BENCHMARK_METRICS[4], score: 96.4, source: 'OpenAI Paper' },
      { id: 'bs-o1-4', modelId: 'model-o1', metricId: 'm-gpqa-diamond', metric: BENCHMARK_METRICS[5], score: 75.7, source: 'OpenAI Paper' }
    ],
    providerPricings: [
      { id: 'pp-o1-direct', modelId: 'model-o1', providerId: 'prov-direct', provider: AI_PROVIDERS[4], inputPricePerM: 15.00, outputPricePerM: 60.00, throughputTps: 40, latencyMs: 3200, isAvailable: true }
    ]
  },
  {
    id: 'model-mistral-large-2',
    slug: 'mistral-large-2407',
    name: 'Mistral Large 2',
    shortName: 'Mistral Large 2',
    description: 'Flagship multilingual enterprise model by Mistral AI with 123B parameters. SOTA reasoning, math, and code generation across 80+ languages.',
    labId: 'lab-mistral',
    lab: AI_LABS[5],
    releaseDate: '2024-07-24T00:00:00Z',
    contextLength: 128000,
    maxOutputTokens: 4096,
    inputPricePerMillion: 2.00,
    outputPricePerMillion: 6.00,
    architecture: 'Dense Multilingual Transformer',
    parameterCount: '123B',
    modalities: ['text'],
    capabilities: ['function_calling', 'json_mode', 'code_generation', 'streaming'],
    licenseType: 'Mistral Research License',
    isOpenSource: true,
    isFeatured: false,
    isNew: false,
    ratingScore: 91,
    typicalThroughputTps: 58,
    typicalTtftMs: 460,
    benchmarkScores: [
      { id: 'bs-ml2-1', modelId: 'model-mistral-large-2', metricId: 'm-arena-elo', metric: BENCHMARK_METRICS[0], score: 1270, source: 'LMSYS' },
      { id: 'bs-ml2-2', modelId: 'model-mistral-large-2', metricId: 'm-mmlu-pro', metric: BENCHMARK_METRICS[1], score: 72.8, source: 'Mistral AI' },
      { id: 'bs-ml2-3', modelId: 'model-mistral-large-2', metricId: 'm-humaneval', metric: BENCHMARK_METRICS[2], score: 88.2, source: 'Mistral AI' }
    ],
    providerPricings: [
      { id: 'pp-ml2-direct', modelId: 'model-mistral-large-2', providerId: 'prov-direct', provider: AI_PROVIDERS[4], inputPricePerM: 2.00, outputPricePerM: 6.00, throughputTps: 60, latencyMs: 440, isAvailable: true },
      { id: 'pp-ml2-openrouter', modelId: 'model-mistral-large-2', providerId: 'prov-openrouter', provider: AI_PROVIDERS[0], inputPricePerM: 2.00, outputPricePerM: 6.00, throughputTps: 55, latencyMs: 470, isAvailable: true }
    ]
  }
];
