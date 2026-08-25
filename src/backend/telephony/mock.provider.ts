import { TelephonyProvider, InitiateCallParams, InitiateCallResult, CallState } from './telephony.interface';

export class MockTelephonyProvider implements TelephonyProvider {
  name = 'mock';
  isConfigured = true; // Always ready for zero-config demonstration

  private activeCalls = new Map<string, { status: CallState; startedAt: number }>();

  async initiateCall(params: InitiateCallParams): Promise<InitiateCallResult> {
    const providerCallId = `mock-call-${Date.now()}`;
    this.activeCalls.set(providerCallId, { status: 'INITIATING', startedAt: Date.now() });

    // Transition to RINGING after 1 second
    setTimeout(() => {
      const call = this.activeCalls.get(providerCallId);
      if (call && call.status === 'INITIATING') {
        call.status = 'RINGING';
      }
    }, 1000);

    // Transition to ANSWERED after 3 seconds
    setTimeout(() => {
      const call = this.activeCalls.get(providerCallId);
      if (call && call.status === 'RINGING') {
        call.status = 'ANSWERED';
      }
    }, 3000);

    return {
      success: true,
      providerCallId,
      status: 'INITIATING',
      message: 'Simulated call initiated via Mock Telephony Engine.'
    };
  }

  async getCallStatus(providerCallId: string): Promise<CallState> {
    const call = this.activeCalls.get(providerCallId);
    return call ? call.status : 'ENDED';
  }

  async endCall(providerCallId: string): Promise<boolean> {
    const call = this.activeCalls.get(providerCallId);
    if (call) {
      call.status = 'ENDED';
      return true;
    }
    return false;
  }

  async handleWebhook(payload: any) {
    const providerCallId = payload.providerCallId || `mock-call-${Date.now()}`;
    const status: CallState = payload.status || 'ENDED';
    const durationSeconds = payload.durationSeconds || 120;
    return {
      providerCallId,
      status,
      durationSeconds,
      recordingUrl: payload.recordingUrl || null
    };
  }
}
