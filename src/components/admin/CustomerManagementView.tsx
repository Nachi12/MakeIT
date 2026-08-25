'use client';

import React, { useEffect, useState } from 'react';
import { Users, Briefcase, Mail, Phone, Building } from 'lucide-react';
import { leadsApi } from '@/services/makeit-api';
import { Badge } from '../ui/Badge';

export const CustomerManagementView: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    leadsApi.getAll().then(res => {
      if (res.success && res.data) {
        // Extract customer profiles from incoming requirements
        const list = res.data.map(l => l.requirement);
        setCustomers(list);
      }
    });
  }, []);

  return (
    <div className="space-y-6 font-sans">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1F3A]">Customer Directory & Profiles</h2>
          <p className="text-xs text-[#64748B] mt-0.5">View founder profiles, submitted project specifications, and active account histories.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs font-sans border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 font-bold">Customer Name</th>
              <th className="py-3 px-4 font-bold">Company / Organization</th>
              <th className="py-3 px-4 font-bold">Contact Email</th>
              <th className="py-3 px-4 font-bold">Primary Requirement</th>
              <th className="py-3 px-4 font-bold">Budget Range</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {customers.map((cust, idx) => (
              <tr key={idx} className="hover:bg-[#F8FAFC]">
                <td className="py-3.5 px-4 font-bold text-[#0B1F3A]">{cust.customerName}</td>
                <td className="py-3.5 px-4 font-medium text-[#334155]">{cust.companyName || 'Founder / Startup'}</td>
                <td className="py-3.5 px-4 text-[#2563EB] font-medium">{cust.customerEmail}</td>
                <td className="py-3.5 px-4 text-[#475569]">
                  <span className="font-bold text-[#0B1F3A]">{cust.projectType}</span>
                  <p className="text-[11px] text-[#64748B] line-clamp-1">"{cust.rawInput}"</p>
                </td>
                <td className="py-3.5 px-4 font-extrabold text-[#0B1F3A]">{cust.budgetRange}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
