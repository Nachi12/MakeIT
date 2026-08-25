import { NextRequest, NextResponse } from 'next/server';
import { CallsService } from '@/backend/services/calls.service';
import { requireAuth, getAuthUser } from '@/backend/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get('leadId') || undefined;
    const contactId = searchParams.get('contactId') || undefined;

    const calls = await CallsService.getCallHistory({ leadId, contactId });
    return NextResponse.json({ success: true, data: calls });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = requireAuth(req, ['ADMIN', 'SUPER_ADMIN', 'SALES']);
  if (authErr) return authErr;

  try {
    const user = getAuthUser(req)!;
    const body = await req.json();

    const callRecord = await CallsService.initiateCall({
      leadId: body.leadId,
      contactId: body.contactId,
      agentId: user.id,
      agentName: user.name,
      toNumber: body.toNumber || body.phone
    });

    return NextResponse.json({ success: true, data: callRecord });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
