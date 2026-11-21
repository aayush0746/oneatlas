import { PrismaClient } from '@prisma/client';
import { AI_LABS, AI_PROVIDERS, BENCHMARK_METRICS, CURATED_MODELS } from '../src/lib/data/curated-models';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting OneAtlas Database Seed...');

  // 1. Seed AI Labs
  console.log('Seeding AI Labs...');
  for (const lab of AI_LABS) {
    await prisma.lab.upsert({
      where: { slug: lab.slug },
      update: {
        name: lab.name,
        logoUrl: lab.logoUrl,
        websiteUrl: lab.websiteUrl,
        description: lab.description,
        headquarters: lab.headquarters,
        foundedYear: lab.foundedYear,
      },
      create: {
        id: lab.id,
        slug: lab.slug,
        name: lab.name,
        logoUrl: lab.logoUrl,
        websiteUrl: lab.websiteUrl,
        description: lab.description,
        headquarters: lab.headquarters,
        foundedYear: lab.foundedYear,
      },
    });
  }

  // 2. Seed Providers
  console.log('Seeding Inference Providers...');
  for (const provider of AI_PROVIDERS) {
    await prisma.provider.upsert({
      where: { slug: provider.slug },
      update: {
        name: provider.name,
        websiteUrl: provider.websiteUrl,
        description: provider.description,
        isAggregator: provider.isAggregator ?? false,
      },
      create: {
        id: provider.id,
        slug: provider.slug,
        name: provider.name,
        websiteUrl: provider.websiteUrl,
        description: provider.description,
        isAggregator: provider.isAggregator ?? false,
      },
    });
  }

  // 3. Seed Benchmark Metrics
  console.log('Seeding Benchmark Metrics...');
  for (const metric of BENCHMARK_METRICS) {
    await prisma.benchmarkMetric.upsert({
      where: { code: metric.code },
      update: {
        name: metric.name,
        category: metric.category,
        unit: metric.unit,
        maxScore: metric.maxScore,
        description: metric.description,
      },
      create: {
        id: metric.id,
        code: metric.code,
        name: metric.name,
        category: metric.category,
        unit: metric.unit,
        maxScore: metric.maxScore,
        description: metric.description,
      },
    });
  }

  // 4. Seed AI Models, Pricings & Benchmark Scores
  console.log('Seeding AI Models and Relations...');
  for (const model of CURATED_MODELS) {
    const createdModel = await prisma.model.upsert({
      where: { slug: model.slug },
      update: {
        name: model.name,
        shortName: model.shortName,
        description: model.description,
        labId: model.labId,
        releaseDate: new Date(model.releaseDate),
        contextLength: model.contextLength,
        maxOutputTokens: model.maxOutputTokens,
        inputPricePerMillion: model.inputPricePerMillion,
        outputPricePerMillion: model.outputPricePerMillion,
        cacheReadPricePerMillion: model.cacheReadPricePerMillion,
        architecture: model.architecture,
        parameterCount: model.parameterCount,
        modalities: model.modalities,
        capabilities: model.capabilities,
        licenseType: model.licenseType,
        isOpenSource: model.isOpenSource,
        isFeatured: model.isFeatured,
        isNew: model.isNew,
        ratingScore: model.ratingScore,
        typicalThroughputTps: model.typicalThroughputTps,
        typicalTtftMs: model.typicalTtftMs,
      },
      create: {
        id: model.id,
        slug: model.slug,
        name: model.name,
        shortName: model.shortName,
        description: model.description,
        labId: model.labId,
        releaseDate: new Date(model.releaseDate),
        contextLength: model.contextLength,
        maxOutputTokens: model.maxOutputTokens,
        inputPricePerMillion: model.inputPricePerMillion,
        outputPricePerMillion: model.outputPricePerMillion,
        cacheReadPricePerMillion: model.cacheReadPricePerMillion,
        architecture: model.architecture,
        parameterCount: model.parameterCount,
        modalities: model.modalities,
        capabilities: model.capabilities,
        licenseType: model.licenseType,
        isOpenSource: model.isOpenSource,
        isFeatured: model.isFeatured,
        isNew: model.isNew,
        ratingScore: model.ratingScore,
        typicalThroughputTps: model.typicalThroughputTps,
        typicalTtftMs: model.typicalTtftMs,
      },
    });

    // Seed Benchmark Scores for this model
    for (const bScore of model.benchmarkScores) {
      await prisma.modelBenchmarkScore.upsert({
        where: {
          modelId_metricId: {
            modelId: createdModel.id,
            metricId: bScore.metricId,
          },
        },
        update: {
          score: bScore.score,
          source: bScore.source,
        },
        create: {
          id: bScore.id,
          modelId: createdModel.id,
          metricId: bScore.metricId,
          score: bScore.score,
          source: bScore.source,
        },
      });
    }

    // Seed Provider Pricings for this model
    for (const pricing of model.providerPricings) {
      await prisma.modelProviderPricing.upsert({
        where: {
          modelId_providerId: {
            modelId: createdModel.id,
            providerId: pricing.providerId,
          },
        },
        update: {
          inputPricePerM: pricing.inputPricePerM,
          outputPricePerM: pricing.outputPricePerM,
          throughputTps: pricing.throughputTps,
          latencyMs: pricing.latencyMs,
          isAvailable: pricing.isAvailable,
        },
        create: {
          id: pricing.id,
          modelId: createdModel.id,
          providerId: pricing.providerId,
          inputPricePerM: pricing.inputPricePerM,
          outputPricePerM: pricing.outputPricePerM,
          throughputTps: pricing.throughputTps,
          latencyMs: pricing.latencyMs,
          isAvailable: pricing.isAvailable,
        },
      });
    }
  }

  console.log('✅ OneAtlas database seeded successfully with models, labs, providers & benchmarks!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
