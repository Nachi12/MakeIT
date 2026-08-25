import { NextRequest, NextResponse } from 'next/server';
import { CrmService } from '@/backend/services/crm.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, email } = body;
    const existing = await CrmService.checkForDuplicate(phone, email);

    return NextResponse.json({
      success: true,
      data: {
        isDuplicate: Boolean(existing),
        contact: existing
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
