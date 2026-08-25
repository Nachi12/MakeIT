import { NextRequest, NextResponse } from 'next/server';
import { LeadsService } from '@/backend/services/leads.service';
import { requireAuth, getAuthUser } from '@/backend/middleware/auth';

export async function GET(req: NextRequest) {
  const authErr = requireAuth(req, ['ADMIN', 'SUPER_ADMIN']);
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const leads = await LeadsService.getAllLeads({ status });

    return NextResponse.json({
      success: true,
      data: leads
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
