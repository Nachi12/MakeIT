import { NextRequest, NextResponse } from 'next/server';
import { ProjectsService } from '@/backend/services/projects.service';
import { requireAuth, getAuthUser } from '@/backend/middleware/auth';
import { AuditService } from '@/backend/services/audit.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;

    const projects = await ProjectsService.getAllProjects({ status });
    return NextResponse.json({ success: true, data: projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = requireAuth(req, ['ADMIN', 'SUPER_ADMIN']);
  if (authErr) return authErr;

  try {
    const user = getAuthUser(req)!;
    const body = await req.json();
    const created = await ProjectsService.createProject(body);

    await AuditService.log({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'CREATE_PROJECT',
      entity: 'Project',
      entityId: created!.id,
      details: `Initialized new IT project: ${created!.title}`
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
