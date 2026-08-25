import { NextRequest, NextResponse } from 'next/server';
import { CallsService } from '@/backend/services/calls.service';
import { requireAuth } from '@/backend/middleware/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authErr = requireAuth(req, ['ADMIN', 'SUPER_ADMIN', 'SALES']);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { status, durationSeconds, outcome, notes } = body;

    const updated = await CallsService.updateCallState(id, status, durationSeconds, outcome, notes);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
