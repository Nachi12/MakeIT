import { NextRequest, NextResponse } from 'next/server';
import { AuditService } from '@/backend/services/audit.service';
import { requireAuth } from '@/backend/middleware/auth';

export async function GET(req: NextRequest) {
  const authErr = requireAuth(req, ['ADMIN', 'SUPER_ADMIN']);
  if (authErr) return authErr;

  try {
    const logs = await AuditService.getLogs(100);
    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
