import { NextRequest, NextResponse } from 'next/server';
import { ModelsService } from '@/lib/models-service';
import { BENCHMARK_METRICS } from '@/lib/data/curated-models';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metricCode = searchParams.get('metric') || 'ARENA_ELO';

    const leaderboard = await ModelsService.getLeaderboard(metricCode);

    return NextResponse.json({
      success: true,
      availableMetrics: BENCHMARK_METRICS,
      data: leaderboard,
    });
  } catch (error: any) {
    console.error('Error fetching benchmarks:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve benchmark leaderboards',
        details: error?.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
