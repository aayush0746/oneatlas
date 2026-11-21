import { NextRequest, NextResponse } from 'next/server';
import { ModelsService } from '@/lib/models-service';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const model = await ModelsService.getModelBySlug(slug);

    if (!model) {
      return NextResponse.json(
        {
          success: false,
          error: `Model not found with slug: ${slug}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: model,
    });
  } catch (error: any) {
    console.error('Error fetching model detail:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve model',
        details: error?.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
