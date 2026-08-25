import { NextRequest, NextResponse } from 'next/server';
import { TelephonyService } from '@/backend/telephony/telephony.service';
import { requireAuth } from '@/backend/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    const status = TelephonyService.getProviderStatus();
    return NextResponse.json({ success: true, data: status });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
