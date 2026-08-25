import { NextRequest, NextResponse } from 'next/server';
import { ServicesService } from '@/backend/services/services.service';
import { requireAuth, getAuthUser } from '@/backend/middleware/auth';
import { AuditService } from '@/backend/services/audit.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;

    const categories = await ServicesService.getAllCategories();
    const services = await ServicesService.getAllServices({ categoryId, featured });

    return NextResponse.json({
      success: true,
      data: {
        categories,
        services
      }
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
    const created = await ServicesService.createService(body);

    await AuditService.log({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'CREATE_SERVICE',
      entity: 'Service',
      entityId: created.id,
      details: `Created new service catalog item: ${created.title}`
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
