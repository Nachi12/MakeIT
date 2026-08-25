import { NextRequest, NextResponse } from 'next/server';
import { CrmService } from '@/backend/services/crm.service';
import { requireAuth, getAuthUser } from '@/backend/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    const contacts = await CrmService.getAllContacts();
    return NextResponse.json({ success: true, data: contacts });
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

    const result = await CrmService.quickAddClient({
      ...body,
      ownerId: user.id,
      ownerName: user.name
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
