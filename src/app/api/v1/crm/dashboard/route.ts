import { NextRequest, NextResponse } from 'next/server';
import { CrmService } from '@/backend/services/crm.service';
import { requireAuth, getAuthUser } from '@/backend/middleware/auth';

export async function GET(req: NextRequest) {
  const authErr = requireAuth(req, ['ADMIN', 'SUPER_ADMIN', 'SALES']);
  if (authErr) return authErr;

  try {
    const user = getAuthUser(req)!;
    const dashboardData = await CrmService.getDashboardMetrics(user.id);
    return NextResponse.json({ success: true, data: dashboardData });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
