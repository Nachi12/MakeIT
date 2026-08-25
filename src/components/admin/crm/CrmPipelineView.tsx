'use client';

import React, { useEffect, useState } from 'react';
import { PhoneOutgoing, ArrowRight, Flame, Layers } from 'lucide-react';
import { leadsApi } from '@/services/makeit-api';
import { Lead } from '@/types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';

export const CrmPipelineView: React.FC<{
  onSelectLead: (lead: Lead) => void;
}> = ({ onSelectLead }) => {
  const [leads, setLeads] = useState<Lead[]>([]);

  const stages = [
    'NEW',
    'CONTACTED',
    'FOLLOW_UP',
    'QUALIFIED',
    'PROPOSAL_SENT',
    'WON',
    'LOST'
  ];

  useEffect(() => {
    leadsApi.getAll().then(res => {
      if (res.success && res.data) {
        setLeads(res.data);
      }
    });
  }, []);

  const handleStageChange = async (leadId: string, newStatus: string) => {
    const res = await leadsApi.updateStatus(leadId, newStatus);
    if (res.success && res.data) {
      setLeads(prev => prev.map(l => l.id === leadId ? res.data! : l));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1F3A]">Visual Sales Pipeline</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Stage progression view of active software engineering deals.</p>
        </div>
      </div>

      {/* Kanban Stage Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map(stage => {
          const stageLeads = leads.filter(l => l.status === stage);
          return (
            <div key={stage} className="w-72 shrink-0 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between font-bold text-xs text-[#0B1F3A] border-b border-[#E2E8F0] pb-2">
                <span>{stage}</span>
                <span className="px-2 py-0.5 rounded-full bg-white text-[#2563EB] border text-[11px] font-extrabold">
                  {stageLeads.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[300px]">
                {stageLeads.map(lead => (
                  <div key={lead.id} className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-2 hover:border-[#2563EB] transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0B1F3A]">{lead.requirement.customerName}</span>
                      <Badge variant={lead.priority === 'URGENT' ? 'rose' : 'amber'}>{lead.priority}</Badge>
                    </div>

                    <p className="text-xs text-[#334155] line-clamp-2">"{lead.requirement.rawInput}"</p>

                    <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-[#0B1F3A]">{lead.requirement.budgetRange}</span>
                      
                      <Button size="sm" variant="outline" onClick={() => onSelectLead(lead)} icon={<PhoneOutgoing className="w-3 h-3" />}>
                        Inspect / Call
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
