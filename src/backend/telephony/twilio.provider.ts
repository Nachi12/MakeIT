import { TelephonyProvider, InitiateCallParams, InitiateCallResult, CallState } from './telephony.interface';

export class TwilioProvider implements TelephonyProvider {
  name = 'twilio';
  
  get isConfigured(): boolean {
    return Boolean(
      process.env.TWILIO_ACCOUNT_SID && 
      process.env.TWILIO_AUTH_TOKEN && 
      process.env.TWILIO_FROM_NUMBER
    );
  }

  async initiateCall(params: InitiateCallParams): Promise<InitiateCallResult> {
    if (!this.isConfigured) {
      return {
        success: false,
        providerCallId: '',
        status: 'FAILED',
        message: 'Twilio telephony provider is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER in environment.'
      };
    }

    try {
      // Twilio REST API integration placeholder using account credentials
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const auth = process.env.TWILIO_AUTH_TOKEN;
      const from = process.env.TWILIO_FROM_NUMBER;

      const body = new URLSearchParams({
        To: params.toNumber,
        From: from || '',
        Url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/v1/telephony/webhooks?provider=twilio`
      });

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Calls.json`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${sid}:${auth}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Twilio call request failed');
      }

      return {
        success: true,
        providerCallId: data.sid,
        status: 'INITIATING',
        message: 'Twilio call initiated.'
      };
    } catch (e: any) {
      return {
        success: false,
        providerCallId: '',
        status: 'FAILED',
        message: e.message || 'Failed to initiate Twilio call'
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
      queued: 'INITIATING',
      ringing: 'RINGING',
      'in-progress': 'ANSWERED',
      completed: 'ENDED',
      busy: 'BUSY',
      'no-answer': 'NO_ANSWER',
      failed: 'FAILED',
      canceled: 'CANCELLED'
    };

    const status = statusMap[payload.CallStatus || ''] || 'ENDED';
    const durationSeconds = Number(payload.CallDuration || 0);

    return {
      providerCallId: payload.CallSid || '',
      status,
      durationSeconds,
      recordingUrl: payload.RecordingUrl || null
    };
  }
}
