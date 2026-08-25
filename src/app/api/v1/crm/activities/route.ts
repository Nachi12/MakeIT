import { NextRequest, NextResponse } from 'next/server';
import { ActivitiesService } from '@/backend/services/activities.service';
import { requireAuth, getAuthUser } from '@/backend/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json({ success: false, message: 'leadId is required' }, { status: 400 });
    }

    const activities = await ActivitiesService.getLeadActivities(leadId);
    return NextResponse.json({ success: true, data: activities });
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

    const activity = await ActivitiesService.logActivity({
      leadId: body.leadId,
      contactId: body.contactId,
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      type: body.type || 'Note',
      title: body.title || 'Note added',
      description: body.description || body.content,
      metadata: body.metadata
    });

    return NextResponse.json({ success: true, data: activity });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
