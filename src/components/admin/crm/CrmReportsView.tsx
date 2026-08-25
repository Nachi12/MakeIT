'use client';

import React from 'react';
import { BarChart3, TrendingUp, PhoneCall, CheckCircle2, Award } from 'lucide-react';
import { Badge } from '../../ui/Badge';

export const CrmReportsView: React.FC = () => {
  return (
    <div className="space-y-8 font-sans">
      
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <h2 className="text-xl font-extrabold text-[#0B1F3A]">Operational Sales Performance Reports</h2>
        <p className="text-xs text-[#64748B] mt-0.5">Real-time metrics on call volumes, conversion rates, and pipeline valuation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">Outbound Calls Executed</div>
          <h3 className="text-3xl font-extrabold text-[#0B1F3A]">28 Calls</h3>
          <p className="text-xs text-[#64748B]">85% Answer Rate • Avg Duration: 04:12</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">Qualified Leads Conversion</div>
          <h3 className="text-3xl font-extrabold text-[#0B1F3A]">64.2%</h3>
          <p className="text-xs text-[#64748B]">Converted from initial requirement to scope proposal</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="text-xs font-bold text-[#D97706] uppercase tracking-wider">Active Pipeline Valuation</div>
          <h3 className="text-3xl font-extrabold text-[#0B1F3A]">₹18,50,000</h3>
          <p className="text-xs text-[#64748B]">Total deal value across active sales stages</p>
        </div>

      </div>

    </div>
  );
};
