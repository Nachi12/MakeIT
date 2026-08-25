import { NextRequest, NextResponse } from 'next/server';
import { ExpertsService } from '@/backend/services/experts.service';
import { requireAuth, getAuthUser } from '@/backend/middleware/auth';
import { AuditService } from '@/backend/services/audit.service';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const expert = await ExpertsService.getExpertById(id);
    if (!expert) {
      return NextResponse.json({ success: false, message: 'Expert not found', code: 'NOT_FOUND' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: expert });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authErr = requireAuth(req, ['ADMIN', 'SUPER_ADMIN']);
  if (authErr) return authErr;

  try {
    const user = getAuthUser(req)!;
    const body = await req.json();
    const updated = await ExpertsService.updateExpert(id, body);

    await AuditService.log({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'UPDATE_EXPERT',
      entity: 'Expert',
      entityId: id,
      details: `Updated expert parameters for ${updated.name}`
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
