'use client';

import React, { useEffect, useState } from 'react';
import { Search, Filter, PhoneOutgoing, ArrowRight, Flame, Plus } from 'lucide-react';
import { leadsApi } from '@/services/makeit-api';
import { Lead } from '@/types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';

export const CrmLeadsListView: React.FC<{
  onSelectLead: (lead: Lead) => void;
  onOpenQuickAdd: () => void;
}> = ({ onSelectLead, onOpenQuickAdd }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  useEffect(() => {
    leadsApi.getAll().then(res => {
      if (res.success && res.data) {
        setLeads(res.data);
      }
    });
  }, []);

  const filtered = leads.filter(l => {
    const s = search.toLowerCase();
    const matchesSearch = l.requirement.customerName.toLowerCase().includes(s) ||
                          l.requirement.rawInput.toLowerCase().includes(s) ||
                          (l.requirement.customerPhone && l.requirement.customerPhone.includes(s)) ||
                          (l.requirement.companyName && l.requirement.companyName.toLowerCase().includes(s));
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || l.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Search & Filter Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1F3A]">Sales Pipeline Leads Directory</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Filter prospective deals, search client history, and initiate direct click-to-call.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search client, phone, company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#CBD5E1] outline-none focus:border-[#2563EB] w-56"
            />
          </div>

          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-[#CBD5E1] bg-white outline-none focus:border-[#2563EB]"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="UNCONTACTED">UNCONTACTED</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="QUALIFIED">QUALIFIED</option>
            <option value="PROPOSAL_SENT">PROPOSAL_SENT</option>
            <option value="WON">WON</option>
            <option value="LOST">LOST</option>
          </select>

          <Button variant="primary" size="sm" onClick={onOpenQuickAdd} icon={<Plus className="w-4 h-4" />}>
            Add Client
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs font-sans border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 font-bold">Client & Company</th>
              <th className="py-3 px-4 font-bold">Requirement Specification</th>
              <th className="py-3 px-4 font-bold">Budget</th>
              <th className="py-3 px-4 font-bold">Priority</th>
              <th className="py-3 px-4 font-bold">Status Stage</th>
              <th className="py-3 px-4 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filtered.map(l => (
              <tr key={l.id} className="hover:bg-[#F8FAFC]">
                <td className="py-3.5 px-4 font-bold text-[#0B1F3A]">
                  {l.requirement.customerName}
                  <span className="block text-[10px] text-[#64748B] font-normal">{l.requirement.companyName || 'Private Founder'} • {l.requirement.customerPhone || 'N/A'}</span>
                </td>
                <td className="py-3.5 px-4 text-[#334155] max-w-xs">
                  <span className="font-bold text-[#2563EB] block">{l.requirement.projectType}</span>
                  <p className="line-clamp-1 text-[11px] text-[#64748B]">"{l.requirement.rawInput}"</p>
                </td>
                <td className="py-3.5 px-4 font-extrabold text-[#0B1F3A]">{l.requirement.budgetRange}</td>
                <td className="py-3.5 px-4">
                  <Badge variant={l.priority === 'URGENT' ? 'rose' : l.priority === 'HIGH' ? 'amber' : 'slate'}>
                    {l.priority || 'MEDIUM'}
                  </Badge>
                </td>
                <td className="py-3.5 px-4">
                  <Badge variant={l.status === 'WON' ? 'emerald' : l.status === 'QUALIFIED' ? 'blue' : 'slate'}>
                    {l.status}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Button size="sm" variant="primary" onClick={() => onSelectLead(l)} icon={<PhoneOutgoing className="w-3.5 h-3.5" />}>
                    Call / Inspect
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
