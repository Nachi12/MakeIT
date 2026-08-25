import { NextRequest, NextResponse } from 'next/server';
import { LeadsService } from '@/backend/services/leads.service';
import { requireAuth, getAuthUser } from '@/backend/middleware/auth';
import { AuditService } from '@/backend/services/audit.service';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authErr = requireAuth(req, ['ADMIN', 'SUPER_ADMIN']);
  if (authErr) return authErr;

  try {
    const user = getAuthUser(req)!;
    const body = await req.json();
    const { status, assignedExpertId, note } = body;

    const updated = await LeadsService.updateLeadStatus(id, status, assignedExpertId, note);

    await AuditService.log({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'UPDATE_LEAD_STATUS',
      entity: 'Lead',
      entityId: id,
      details: `Lead status updated to ${status}${assignedExpertId ? ` (Assigned expert: ${assignedExpertId})` : ''}`
    });

    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
