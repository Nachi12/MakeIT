'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, PhoneOutgoing, Clock } from 'lucide-react';
import { followupsApi } from '@/services/makeit-api';
import { FollowUp } from '@/types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';

export const CrmFollowUpsView: React.FC<{
  onSelectLead?: (lead: any) => void;
}> = ({ onSelectLead }) => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);

  const loadData = async () => {
    const res = await followupsApi.getPending();
    if (res.success && res.data) setFollowUps(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkComplete = async (id: string) => {
    await followupsApi.complete(id);
    loadData();
  };

  return (
    <div className="space-y-6 font-sans">
      
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <h2 className="text-xl font-extrabold text-[#0B1F3A]">Sales Follow-ups & Task Checklist</h2>
        <p className="text-xs text-[#64748B] mt-0.5">Manage scheduled calls, deal milestones, and completion actions.</p>
      </div>

      <div className="space-y-3">
        {followUps.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-2xl border border-[#E2E8F0] text-xs text-[#64748B]">
            No pending follow-ups found.
          </div>
        ) : (
          followUps.map(fu => (
            <div key={fu.id} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-[#0B1F3A]">
                    {fu.lead?.requirement?.customerName || fu.contact?.name || 'Client'}
                  </span>
                  <Badge variant="blue">{new Date(fu.scheduledAt).toLocaleString()}</Badge>
                  <Badge variant={fu.priority === 'HIGH' ? 'rose' : 'amber'}>{fu.priority}</Badge>
                </div>
                <p className="text-xs text-[#334155] font-medium mt-1">"{fu.reason}"</p>
                <span className="text-[11px] text-[#64748B] block mt-0.5">Assigned Agent: {fu.assignedToName}</span>
              </div>

              <div className="flex items-center gap-3">
                {fu.lead && onSelectLead && (
                  <Button size="sm" variant="primary" onClick={() => onSelectLead(fu.lead)} icon={<PhoneOutgoing className="w-3.5 h-3.5" />}>
                    Call Client
                  </Button>
                )}

                <Button size="sm" variant="outline" onClick={() => handleMarkComplete(fu.id)} icon={<CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />}>
                  Mark Done
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
