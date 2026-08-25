import { NextRequest, NextResponse } from 'next/server';
import { MatchingService } from '@/backend/services/matching.service';
import { requireAuth } from '@/backend/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    const weights = MatchingService.getWeights();
    return NextResponse.json({ success: true, data: weights });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawText, budgetRange, weights } = body;

    if (weights) {
      MatchingService.updateWeights(weights);
    }

    const matches = await MatchingService.matchExpertsForRequirementText(rawText || '', budgetRange);
    return NextResponse.json({
      success: true,
      data: {
        matches,
        weights: MatchingService.getWeights()
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
