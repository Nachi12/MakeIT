import { NextRequest, NextResponse } from 'next/server';
import { ProposalsService } from '@/backend/services/proposals.service';
import { requireAuth, getAuthUser } from '@/backend/middleware/auth';
import { AuditService } from '@/backend/services/audit.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;

    const proposals = await ProposalsService.getAllProposals({ status });
    return NextResponse.json({ success: true, data: proposals });
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
    const created = await ProposalsService.createProposal(body);

    await AuditService.log({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'CREATE_PROPOSAL',
      entity: 'Proposal',
      entityId: created.id,
      details: `Generated proposal "${created.title}" for ${created.customerName}`
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
