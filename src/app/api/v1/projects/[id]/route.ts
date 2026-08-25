import { NextRequest, NextResponse } from 'next/server';
import { ProjectsService } from '@/backend/services/projects.service';
import { requireAuth, getAuthUser } from '@/backend/middleware/auth';
import { AuditService } from '@/backend/services/audit.service';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authErr = requireAuth(req, ['ADMIN', 'SUPER_ADMIN']);
  if (authErr) return authErr;

  try {
    const user = getAuthUser(req)!;
    const body = await req.json();
    const { status, notes, milestone, member } = body;

    if (milestone) {
      await ProjectsService.addMilestone(id, milestone);
    }

    if (member) {
      await ProjectsService.addProjectMember(id, member);
    }

    const updated = await ProjectsService.updateProjectStatus(id, status, notes);

    await AuditService.log({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'UPDATE_PROJECT',
      entity: 'Project',
      entityId: id,
      details: `Project status updated to ${status}`
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
