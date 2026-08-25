'use client';

import React, { useEffect, useState } from 'react';
import { PhoneOutgoing, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { callsApi } from '@/services/makeit-api';
import { Call } from '@/types';
import { Badge } from '../../ui/Badge';

export const CrmCallsView: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([]);

  useEffect(() => {
    callsApi.getAll().then(res => res.success && res.data && setCalls(res.data));
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 font-sans">
      
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <h2 className="text-xl font-extrabold text-[#0B1F3A]">Telephony Call Activity Log</h2>
        <p className="text-xs text-[#64748B] mt-0.5">Historical telephony records, duration metrics, outcomes, and agent details.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs font-sans border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 font-bold">Call ID & Provider</th>
              <th className="py-3 px-4 font-bold">Sales Agent</th>
              <th className="py-3 px-4 font-bold">Direction</th>
              <th className="py-3 px-4 font-bold">Call Status</th>
              <th className="py-3 px-4 font-bold">Duration</th>
              <th className="py-3 px-4 font-bold">Call Outcome</th>
              <th className="py-3 px-4 font-bold text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {calls.map(c => (
              <tr key={c.id} className="hover:bg-[#F8FAFC]">
                <td className="py-3 px-4 font-mono font-bold text-[#0B1F3A]">
                  {c.id.substring(0, 12)}...
                  <span className="block text-[10px] text-[#64748B] font-normal uppercase">{c.provider} Provider</span>
                </td>
                <td className="py-3 px-4 font-bold text-[#0B1F3A]">{c.agentName}</td>
                <td className="py-3 px-4"><Badge variant="blue">{c.direction}</Badge></td>
                <td className="py-3 px-4">
                  <Badge variant={c.status === 'ENDED' ? 'emerald' : c.status === 'ANSWERED' ? 'blue' : 'amber'}>
                    {c.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 font-mono font-extrabold text-[#2563EB]">{formatTimer(c.durationSeconds)}</td>
                <td className="py-3 px-4 text-[#334155]">{c.outcome || 'N/A'}</td>
                <td className="py-3 px-4 text-right font-mono text-[11px] text-[#64748B]">{new Date(c.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
