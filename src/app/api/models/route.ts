import { NextRequest, NextResponse } from 'next/server';
import { ModelsService } from '@/lib/models-service';
import { ModelFilterParams } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: ModelFilterParams = {
      search: searchParams.get('search') || undefined,
      lab: searchParams.get('lab') || undefined,
      provider: searchParams.get('provider') || undefined,
      modality: searchParams.get('modality') || undefined,
      capability: searchParams.get('capability') || undefined,
      openSource: searchParams.has('openSource') 
        ? searchParams.get('openSource') === 'true' 
        : undefined,
      minContext: searchParams.has('minContext') 
        ? Number(searchParams.get('minContext')) 
        : undefined,
      maxInputPrice: searchParams.has('maxInputPrice') 
        ? Number(searchParams.get('maxInputPrice')) 
        : undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'popularity',
      page: searchParams.has('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.has('limit') ? Number(searchParams.get('limit')) : 12,
    };

    const response = await ModelsService.getModels(params);

    return NextResponse.json({
      success: true,
      ...response,
    });
  } catch (error: any) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve models',
        details: error?.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
