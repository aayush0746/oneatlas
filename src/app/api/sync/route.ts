import { NextRequest, NextResponse } from 'next/server';
import { fetchAndNormalizeOpenRouterModels } from '@/lib/sync-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const limit = Number(body.limit) || 15;

    const normalized = await fetchAndNormalizeOpenRouterModels(limit);

    return NextResponse.json({
      success: true,
      message: `Successfully ingested and normalized ${normalized.length} models from OpenRouter live feed.`,
      count: normalized.length,
      data: normalized,
    });
  } catch (error: any) {
    console.error('ETL Sync API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run ETL sync',
        details: error?.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
