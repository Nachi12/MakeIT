'use client';

import React, { useEffect, useState } from 'react';
import { Phone, Shield, CheckCircle2, AlertTriangle, Settings } from 'lucide-react';
import { crmSettingsApi } from '@/services/makeit-api';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';

export const CrmSettingsView: React.FC = () => {
  const [providerData, setProviderData] = useState<any>(null);

  useEffect(() => {
    crmSettingsApi.getProviderStatus().then(res => {
      if (res.success && res.data) setProviderData(res.data);
    });
  }, []);

  const providers = providerData?.providers || [
    { name: 'mock', configured: true, active: true },
    { name: 'twilio', configured: false, active: false },
    { name: 'exotel', configured: false, active: false }
  ];

  return (
    <div className="space-y-8 font-sans">
      
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <h2 className="text-xl font-extrabold text-[#0B1F3A]">Telephony & CRM Configuration</h2>
        <p className="text-xs text-[#64748B] mt-0.5">Telephony provider integrations, call recording policies, and lead channels.</p>
      </div>

      {/* Provider Status Cards */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-[#0B1F3A] flex items-center gap-2">
          <Phone className="w-4.5 h-4.5 text-[#2563EB]" /> Telephony Provider Status
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {providers.map((p: any) => (
            <div key={p.name} className={`p-5 rounded-2xl border ${p.active ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-[#F8FAFC]'} space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold uppercase text-[#0B1F3A]">{p.name} Provider</span>
                {p.active && <Badge variant="blue">ACTIVE</Badge>}
              </div>

              <div className="text-xs text-[#475569]">
                Status: <strong className={p.configured ? 'text-[#16A34A]' : 'text-[#E11D48]'}>
                  {p.configured ? 'Configured & Ready' : 'Not Configured (Missing ENV Credentials)'}
                </strong>
              </div>

              {!p.configured && p.name !== 'mock' && (
                <p className="text-[11px] text-[#64748B]">
                  To activate real production calling via {p.name}, set <code className="bg-[#E2E8F0] px-1 py-0.5 rounded">{p.name.toUpperCase()}_ACCOUNT_SID</code> in <code className="bg-[#E2E8F0] px-1 py-0.5 rounded">.env</code>.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lead Channel Sources */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-[#0B1F3A]">Configured Lead Channel Sources</h3>
        <div className="flex flex-wrap gap-2 text-xs">
          {['Website', 'LinkedIn', 'Referral', 'WhatsApp', 'Phone Call', 'Instagram', 'Manual Entry'].map(src => (
            <Badge key={src} variant="slate">{src}</Badge>
          ))}
        </div>
      </div>

    </div>
  );
};
