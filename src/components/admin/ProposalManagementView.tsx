'use client';

import React, { useEffect, useState } from 'react';
import { Send, FileText, CheckCircle2, Clock, Calendar, DollarSign } from 'lucide-react';
import { proposalsApi } from '@/services/makeit-api';
import { Proposal } from '@/types';
import { Badge } from '../ui/Badge';

export const ProposalManagementView: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    proposalsApi.getAll().then(res => {
      if (res.success && res.data) {
        setProposals(res.data);
      }
    });
  }, []);

  return (
    <div className="space-y-6 font-sans">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1F3A]">Technical Proposals Roster</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Manage customer proposals, financial pricing terms, and acceptance statuses.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs font-sans border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 font-bold">Proposal Title</th>
              <th className="py-3 px-4 font-bold">Customer</th>
              <th className="py-3 px-4 font-bold">Proposed Value</th>
              <th className="py-3 px-4 font-bold">Timeline</th>
              <th className="py-3 px-4 font-bold">Status</th>
              <th className="py-3 px-4 font-bold">Valid Until</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {proposals.map(prop => (
              <tr key={prop.id} className="hover:bg-[#F8FAFC]">
                <td className="py-3.5 px-4 font-bold text-[#0B1F3A]">{prop.title}</td>
                <td className="py-3.5 px-4 font-medium text-[#334155]">
                  {prop.customerName}
                  <span className="block text-[10px] text-[#94A3B8]">{prop.customerEmail}</span>
                </td>
                <td className="py-3.5 px-4 font-extrabold text-[#0B1F3A]">₹{prop.priceINR.toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-4 text-[#475569]">{prop.timeline}</td>
                <td className="py-3.5 px-4">
                  <Badge variant={prop.status === 'ACCEPTED' ? 'emerald' : prop.status === 'SENT' ? 'blue' : 'slate'}>
                    {prop.status}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 text-[#64748B]">{prop.validUntil}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
