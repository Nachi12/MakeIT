export type CallDirection = 'OUTBOUND' | 'INBOUND';

export type CallState = 
  | 'INITIATING'
  | 'RINGING'
  | 'ANSWERED'
  | 'IN_PROGRESS'
  | 'ENDED'
  | 'MISSED'
  | 'FAILED'
  | 'BUSY'
  | 'NO_ANSWER'
  | 'CANCELLED';

export interface InitiateCallParams {
  leadId?: string;
  contactId?: string;
  agentId: string;
  agentName: string;
  toNumber: string;
  fromNumber?: string;
}

export interface InitiateCallResult {
  success: boolean;
  providerCallId: string;
  status: CallState;
  message?: string;
}

export interface TelephonyProvider {
  name: string;
  isConfigured: boolean;
  initiateCall(params: InitiateCallParams): Promise<InitiateCallResult>;
  getCallStatus(providerCallId: string): Promise<CallState>;
  endCall(providerCallId: string): Promise<boolean>;
  handleWebhook(payload: any): Promise<{ providerCallId: string; status: CallState; durationSeconds?: number; recordingUrl?: string }>;
}
