import { NextResponse } from 'next/server';
import { ModelsService } from '@/lib/models-service';

export async function GET() {
  try {
    const labs = await ModelsService.getLabs();
    return NextResponse.json({
      success: true,
      data: labs,
    });
  } catch (error: any) {
    console.error('Error fetching labs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve AI labs',
        details: error?.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
