import { NextRequest, NextResponse } from 'next/server';
import { ExpertsService } from '@/backend/services/experts.service';
import { requireAuth, getAuthUser } from '@/backend/middleware/auth';
import { AuditService } from '@/backend/services/audit.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;

    const experts = await ExpertsService.getAllExperts({ categoryId, featured });
    return NextResponse.json({
      success: true,
      data: experts
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message, code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authErr = requireAuth(req, ['ADMIN', 'SUPER_ADMIN']);
  if (authErr) return authErr;

  try {
    const user = getAuthUser(req)!;
    const body = await req.json();
    const created = await ExpertsService.createExpert(body);

    await AuditService.log({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'CREATE_EXPERT',
      entity: 'Expert',
      entityId: created.id,
      details: `Added new expert profile: ${created.name} (${created.title})`
    });

    return NextResponse.json({
      success: true,
      data: created
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message, code: 'CREATE_ERROR' },
      { status: 500 }
    );
  }
}
