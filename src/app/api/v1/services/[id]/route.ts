import { NextRequest, NextResponse } from 'next/server';
import { ServicesService } from '@/backend/services/services.service';
import { requireAuth, getAuthUser } from '@/backend/middleware/auth';
import { AuditService } from '@/backend/services/audit.service';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authErr = requireAuth(req, ['ADMIN', 'SUPER_ADMIN']);
  if (authErr) return authErr;

  try {
    const user = getAuthUser(req)!;
    const body = await req.json();
    const updated = await ServicesService.updateService(id, body);

    await AuditService.log({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'UPDATE_SERVICE',
      entity: 'Service',
      entityId: id,
      details: `Updated service parameters for: ${updated.title}`
    });

    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message, code: 'UPDATE_ERROR' },
      { status: 500 }
    );
  }
}
