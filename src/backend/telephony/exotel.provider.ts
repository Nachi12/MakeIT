import { TelephonyProvider, InitiateCallParams, InitiateCallResult, CallState } from './telephony.interface';

export class ExotelProvider implements TelephonyProvider {
  name = 'exotel';

  get isConfigured(): boolean {
    return Boolean(
      process.env.EXOTEL_SID && 
      process.env.EXOTEL_TOKEN && 
      process.env.EXOTEL_CALLER_ID
    );
  }

  async initiateCall(params: InitiateCallParams): Promise<InitiateCallResult> {
    if (!this.isConfigured) {
      return {
        success: false,
        providerCallId: '',
        status: 'FAILED',
        message: 'Exotel telephony provider is not configured. Set EXOTEL_SID, EXOTEL_TOKEN, and EXOTEL_CALLER_ID in environment.'
      };
    }

    try {
      const sid = process.env.EXOTEL_SID;
      const token = process.env.EXOTEL_TOKEN;
      const callerId = process.env.EXOTEL_CALLER_ID;

      const body = new URLSearchParams({
        From: params.agentName || callerId || '',
        To: params.toNumber,
        CallerId: callerId || '',
        StatusCallback: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/v1/telephony/webhooks?provider=exotel`
      });

      const response = await fetch(`https://api.exotel.com/v1/Accounts/${sid}/Calls/connect.json`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.RestException?.Message || 'Exotel call request failed');
      }

      return {
        success: true,
        providerCallId: data.Call?.Sid || `exotel-${Date.now()}`,
        status: 'INITIATING',
        message: 'Exotel call initiated.'
      };
    } catch (e: any) {
      return {
        success: false,
        providerCallId: '',
        status: 'FAILED',
        message: e.message || 'Failed to initiate Exotel call'
      };
    }
  }

  async getCallStatus(providerCallId: string): Promise<CallState> {
    if (!this.isConfigured || !providerCallId) return 'FAILED';
    return 'IN_PROGRESS';
  }

  async endCall(providerCallId: string): Promise<boolean> {
    if (!this.isConfigured || !providerCallId) return false;
    return true;
  }

  async handleWebhook(payload: any) {
    const statusMap: Record<string, CallState> = {
      initiated: 'INITIATING',
      ringing: 'RINGING',
      'in-progress': 'ANSWERED',
      completed: 'ENDED',
      busy: 'BUSY',
      'no-answer': 'NO_ANSWER',
      failed: 'FAILED'
    };

    const status = statusMap[payload.Status || ''] || 'ENDED';
    const durationSeconds = Number(payload.Duration || 0);

    return {
      providerCallId: payload.CallSid || '',
      status,
      durationSeconds,
      recordingUrl: payload.RecordingUrl || null
    };
  }
}
