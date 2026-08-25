'use client';

import React, { useEffect, useState } from 'react';
import { 
  PhoneCall, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  PhoneOutgoing,
  Flame,
  Calendar
} from 'lucide-react';
import { crmDashboardApi } from '@/services/makeit-api';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';

export const CrmDashboardView: React.FC<{ 
  onSelectLead: (lead: any) => void;
  onOpenQuickAdd: () => void;
}> = ({ onSelectLead, onOpenQuickAdd }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const res = await crmDashboardApi.getMetrics();
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const metrics = data?.metrics || {
    followUpsTodayCount: 1,
    overdueFollowUpsCount: 0,
    uncontactedLeadsCount: 1,
    highPriorityCount: 2,
    totalActiveLeads: 2
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header & Quick Action */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4 text-[#2563EB]" /> Live Sales Command Center
          </div>
          <h2 className="text-3xl font-extrabold text-[#0B1F3A]">Who should I contact right now?</h2>
          <p className="text-sm text-[#475569] mt-1">Real-time calling queue, scheduled follow-ups, and uncontacted business opportunities.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="md" onClick={onOpenQuickAdd} icon={<PhoneOutgoing className="w-4 h-4" />}>
            + Add Client & Call
          </Button>
        </div>
      </div>

      {/* 4 Priority Queue Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Today's Follow-ups */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">Follow-ups Today</p>
            <h3 className="text-3xl font-extrabold text-[#0B1F3A] mt-1">{metrics.followUpsTodayCount}</h3>
            <p className="text-xs text-[#64748B] mt-1 font-medium">Scheduled for today</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Overdue Follow-ups */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#E11D48] uppercase tracking-wider">Overdue Follow-ups</p>
            <h3 className="text-3xl font-extrabold text-[#0B1F3A] mt-1">{metrics.overdueFollowUpsCount}</h3>
            <p className="text-xs text-[#E11D48] mt-1 font-medium">Requires immediate call</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FFF1F2] text-[#E11D48] flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Uncontacted Leads */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#D97706] uppercase tracking-wider">Uncontacted Leads</p>
            <h3 className="text-3xl font-extrabold text-[#0B1F3A] mt-1">{metrics.uncontactedLeadsCount}</h3>
            <p className="text-xs text-[#64748B] mt-1 font-medium">Awaiting first call</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
            <PhoneCall className="w-6 h-6" />
          </div>
        </div>

        {/* High Priority Leads */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">High / Urgent Priority</p>
            <h3 className="text-3xl font-extrabold text-[#0B1F3A] mt-1">{metrics.highPriorityCount}</h3>
            <p className="text-xs text-[#64748B] mt-1 font-medium">Top deal value</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Calling Work Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Today's Follow-up Call List */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#0B1F3A] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#2563EB]" /> Follow-ups Scheduled Today
            </h3>
            <span className="text-xs text-[#64748B] font-semibold">{metrics.followUpsTodayCount} Clients</span>
          </div>

          <div className="space-y-3">
            {(data?.followUpsToday || []).length === 0 ? (
              <div className="p-6 text-center text-xs text-[#64748B] bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                No pending follow-ups scheduled for today.
              </div>
            ) : (
              (data?.followUpsToday || []).map((fu: any) => (
                <div key={fu.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#2563EB] transition-all flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#0B1F3A]">{fu.lead?.requirement?.customerName || fu.contact?.name || 'Client'}</span>
                      <Badge variant="blue">{new Date(fu.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Badge>
                    </div>
                    <p className="text-xs text-[#334155] font-medium mt-1">"{fu.reason}"</p>
                    <span className="text-[11px] text-[#64748B] block mt-1">Phone: <strong className="text-[#0B1F3A]">{fu.contact?.phone || fu.lead?.requirement?.customerPhone || 'N/A'}</strong></span>
                  </div>

                  <Button size="sm" variant="primary" onClick={() => onSelectLead(fu.lead)} icon={<PhoneOutgoing className="w-3.5 h-3.5" />}>
                    Call Client
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* High Priority Uncontacted Leads */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#0B1F3A] flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-[#2563EB]" /> Priority Uncontacted Queue
            </h3>
            <span className="text-xs text-[#64748B] font-semibold">{metrics.uncontactedLeadsCount} Leads</span>
          </div>

          <div className="space-y-3">
            {(data?.uncontactedLeads || []).length === 0 ? (
              <div className="p-6 text-center text-xs text-[#64748B] bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                All leads have received initial contact.
              </div>
            ) : (
              (data?.uncontactedLeads || []).map((lead: any) => (
                <div key={lead.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#2563EB] transition-all flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#0B1F3A]">{lead.requirement?.customerName}</span>
                      <Badge variant={lead.priority === 'URGENT' ? 'rose' : 'amber'}>{lead.priority}</Badge>
                    </div>
                    <p className="text-xs text-[#334155] line-clamp-1 mt-1">"{lead.requirement?.rawInput}"</p>
                    <span className="text-[11px] text-[#64748B] block mt-1">Budget: <strong className="text-[#0B1F3A]">{lead.requirement?.budgetRange}</strong></span>
                  </div>

                  <Button size="sm" variant="primary" onClick={() => onSelectLead(lead)} icon={<PhoneOutgoing className="w-3.5 h-3.5" />}>
                    Call Client
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
