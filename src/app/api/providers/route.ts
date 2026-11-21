import { NextResponse } from 'next/server';
import { ModelsService } from '@/lib/models-service';

export async function GET() {
  try {
    const providers = await ModelsService.getProviders();
    return NextResponse.json({
      success: true,
      data: providers,
    });
  } catch (error: any) {
    console.error('Error fetching providers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve providers',
        details: error?.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
