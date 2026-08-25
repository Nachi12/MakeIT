import { NextRequest, NextResponse } from 'next/server';
import { TechnologiesService } from '@/backend/services/technologies.service';
import { requireAuth, getAuthUser } from '@/backend/middleware/auth';
import { AuditService } from '@/backend/services/audit.service';

export async function GET(req: NextRequest) {
  try {
    const technologies = await TechnologiesService.getAllTechnologies();
    return NextResponse.json({ success: true, data: technologies });
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
    const created = await TechnologiesService.createTechnology(body);

    await AuditService.log({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'CREATE_TECHNOLOGY',
      entity: 'Technology',
      entityId: created.id,
      details: `Added new technology catalog item: ${created.name}`
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
