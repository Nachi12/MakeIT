import { NextRequest, NextResponse } from 'next/server';
import { FollowUpsService } from '@/backend/services/followups.service';
import { requireAuth, getAuthUser } from '@/backend/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    const followUps = await FollowUpsService.getPendingFollowUps();
    return NextResponse.json({ success: true, data: followUps });
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

    const created = await FollowUpsService.scheduleFollowUp({
      leadId: body.leadId,
      contactId: body.contactId,
      assignedTo: user.id,
      assignedToName: user.name,
      scheduledAt: body.scheduledAt,
      reason: body.reason,
      priority: body.priority
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const authErr = requireAuth(req, ['ADMIN', 'SUPER_ADMIN', 'SALES']);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { id } = body;

    const completed = await FollowUpsService.completeFollowUp(id);
    return NextResponse.json({ success: true, data: completed });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
