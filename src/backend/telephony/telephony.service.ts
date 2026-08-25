import { TelephonyProvider, InitiateCallParams, InitiateCallResult, CallState } from './telephony.interface';
import { MockTelephonyProvider } from './mock.provider';
import { TwilioProvider } from './twilio.provider';
import { ExotelProvider } from './exotel.provider';

export class TelephonyService {
  private static mockProvider = new MockTelephonyProvider();
  private static twilioProvider = new TwilioProvider();
  private static exotelProvider = new ExotelProvider();

  static getActiveProvider(): TelephonyProvider {
    const selected = (process.env.TELEPHONY_PROVIDER || 'mock').toLowerCase();

    if (selected === 'twilio') {
      return this.twilioProvider;
    }
    if (selected === 'exotel') {
      return this.exotelProvider;
    }

    // Default to Mock simulation provider for zero-config out-of-the-box local execution
    return this.mockProvider;
  }

  static getProviderByName(name?: string): TelephonyProvider {
    if (name === 'twilio') return this.twilioProvider;
    if (name === 'exotel') return this.exotelProvider;
    return this.mockProvider;
  }

  static getProviderStatus() {
    return {
      activeProvider: this.getActiveProvider().name,
      providers: [
        { name: 'mock', configured: true, active: this.getActiveProvider().name === 'mock' },
        { name: 'twilio', configured: this.twilioProvider.isConfigured, active: this.getActiveProvider().name === 'twilio' },
        { name: 'exotel', configured: this.exotelProvider.isConfigured, active: this.getActiveProvider().name === 'exotel' }
      ]
    };
  }

  static async initiateCall(params: InitiateCallParams): Promise<InitiateCallResult> {
    const provider = this.getActiveProvider();
    return await provider.initiateCall(params);
  }
}
