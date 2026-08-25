import { NextRequest, NextResponse } from 'next/server';
import { RequirementsService } from '@/backend/services/requirements.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await RequirementsService.submitRequirement(body);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to process requirement', code: 'REQUIREMENT_ERROR' },
      { status: 500 }
    );
  }
}
