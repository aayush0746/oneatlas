import { NextRequest, NextResponse } from 'next/server';
import { ModelsService } from '@/lib/models-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids') || searchParams.get('slugs') || '';
    const slugs = idsParam
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (slugs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide at least one model slug in query param: ?ids=slug1,slug2',
        },
        { status: 400 }
      );
    }

    const models = await ModelsService.getModelsForComparison(slugs);

    // Generate comparison insights & radar dimension data
    const radarDimensions = [
      { key: 'reasoning', label: 'Reasoning (MMLU / Elo)' },
      { key: 'coding', label: 'Coding (HumanEval)' },
      { key: 'speed', label: 'Throughput (TPS)' },
      { key: 'costEfficiency', label: 'Price Efficiency' },
      { key: 'context', label: 'Context Window' },
    ];

    const modelScores = models.map((m) => {
      const arenaScore = m.benchmarkScores.find((b) => b.metric.code === 'ARENA_ELO')?.score || 1200;
      const humanevalScore = m.benchmarkScores.find((b) => b.metric.code === 'HUMANEVAL')?.score || 80;
      
      // Normalize to 0-100 scale
      const reasoningNorm = Math.min(100, Math.max(20, Math.round(((arenaScore - 1100) / 300) * 100)));
      const codingNorm = Math.min(100, Math.round(humanevalScore));
      const speedNorm = Math.min(100, Math.max(10, Math.round(((m.typicalThroughputTps || 50) / 250) * 100)));
      // Cost efficiency: cheaper is higher score
      const costNorm = Math.min(100, Math.max(10, Math.round(100 - (m.inputPricePerMillion / 10) * 80)));
      const contextNorm = Math.min(100, Math.max(10, Math.round((m.contextLength / 1000000) * 100)));

      return {
        modelId: m.id,
        modelName: m.name,
        slug: m.slug,
        scores: {
          reasoning: reasoningNorm,
          coding: codingNorm,
          speed: speedNorm,
          costEfficiency: costNorm,
          context: contextNorm,
        },
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        models,
        radarDimensions,
        modelScores,
      },
    });
  } catch (error: any) {
    console.error('Error in compare API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate model comparison',
        details: error?.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
