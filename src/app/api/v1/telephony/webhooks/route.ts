import { NextRequest, NextResponse } from 'next/server';
import { TelephonyService } from '@/backend/telephony/telephony.service';
import { CallsService } from '@/backend/services/calls.service';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const providerName = searchParams.get('provider') || 'mock';

    const provider = TelephonyService.getProviderByName(providerName);

    let body: any = {};
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      formData.forEach((val, key) => {
        body[key] = val.toString();
      });
    }

    const webhookResult = await provider.handleWebhook(body);
    if (webhookResult.providerCallId) {
      await CallsService.updateCallState(
        webhookResult.providerCallId,
        webhookResult.status,
        webhookResult.durationSeconds
      );
    }

    return NextResponse.json({ success: true, processed: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
