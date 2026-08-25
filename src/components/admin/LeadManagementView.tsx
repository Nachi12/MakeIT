'use client';

import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Users, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight,
  Send,
  Plus,
  Briefcase
} from 'lucide-react';
import { leadsApi, expertsApi, matchesApi, proposalsApi } from '@/services/makeit-api';
import { Lead, Expert } from '@/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export const LeadManagementView: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [matchingResults, setMatchingResults] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [internalNote, setInternalNote] = useState('');
  const [loading, setLoading] = useState(true);

  // Proposal modal
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalPrice, setProposalPrice] = useState(50000);
  const [proposalScope, setProposalScope] = useState('');

  const leadStatuses = [
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'TECHNICAL_REVIEW',
    'EXPERT_MATCHED',
    'PROPOSAL_SENT',
    'NEGOTIATION',
    'WON',
    'IN_PROGRESS',
    'COMPLETED',
    'LOST'
  ];

  const loadData = async () => {
    setLoading(true);
    const [leadsRes, expRes] = await Promise.all([
      leadsApi.getAll(),
      expertsApi.getAll()
    ]);
    if (leadsRes.success && leadsRes.data) {
      setLeads(leadsRes.data);
      if (leadsRes.data.length > 0 && !selectedLead) {
        setSelectedLead(leadsRes.data[0]);
      }
    }
    if (expRes.success && expRes.data) {
      setExperts(expRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedLead?.requirement) {
      matchesApi.postMatch(selectedLead.requirement.rawInput, selectedLead.requirement.budgetRange)
        .then(res => {
          if (res.success && (res.data as any)?.matches) {
            setMatchingResults((res.data as any).matches);
          }
        });
    }
  }, [selectedLead]);

  const handleStatusChange = async (leadId: string, newStatus: string, assignedExpertId?: string) => {
    const res = await leadsApi.updateStatus(leadId, newStatus, assignedExpertId, internalNote ? `Status changed to ${newStatus}: ${internalNote}` : undefined);
    if (res.success && res.data) {
      setLeads(prev => prev.map(l => l.id === leadId ? res.data! : l));
      setSelectedLead(res.data);
      setInternalNote('');
    }
  };

  const handleAssignExpert = async (expertId: string) => {
    if (!selectedLead) return;
    await handleStatusChange(selectedLead.id, 'EXPERT_MATCHED', expertId);
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    const res = await proposalsApi.create({
      leadId: selectedLead.id,
      customerName: selectedLead.requirement.customerName,
      customerEmail: selectedLead.requirement.customerEmail,
      title: proposalTitle || `Technical Solution Proposal for ${selectedLead.requirement.customerName}`,
      services: [selectedLead.requirement.detectedServiceId || 'full-stack-development'],
      scope: proposalScope || selectedLead.requirement.details,
      timeline: selectedLead.requirement.timeline,
      priceINR: Number(proposalPrice),
      status: 'SENT'
    });

    if (res.success) {
      await handleStatusChange(selectedLead.id, 'PROPOSAL_SENT', selectedLead.assignedExpertId);
      setProposalModalOpen(false);
      setProposalTitle('');
      setProposalScope('');
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.requirement.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          l.requirement.rawInput.toLowerCase().includes(search.toLowerCase()) ||
                          (l.requirement.companyName && l.requirement.companyName.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1F3A]">Requirements & Lead Management</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Process incoming customer specifications, run backend expert matching, and dispatch proposals.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search leads..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#CBD5E1] outline-none focus:border-[#2563EB] w-52"
            />
          </div>

          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-[#CBD5E1] bg-white outline-none focus:border-[#2563EB]"
          >
            <option value="ALL">All Statuses</option>
            {leadStatuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Lead Cards List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredLeads.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-2xl border border-[#E2E8F0] text-xs text-[#64748B]">
              No matching leads found.
            </div>
          ) : (
            filteredLeads.map(lead => {
              const isSelected = selectedLead?.id === lead.id;
              return (
                <div 
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                    isSelected ? 'border-[#2563EB] ring-2 ring-[#2563EB]/10 shadow-xs' : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-[#0B1F3A]">{lead.requirement.customerName}</span>
                    <Badge variant={lead.status === 'WON' ? 'emerald' : lead.status === 'PROPOSAL_SENT' ? 'blue' : 'slate'}>
                      {lead.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#334155] line-clamp-2 mb-3">"{lead.requirement.rawInput}"</p>
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>Budget: <strong className="text-[#0B1F3A]">{lead.requirement.budgetRange}</strong></span>
                    <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Lead Inspection & Expert Recommendation Center */}
        {selectedLead && (
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-6">
            
            {/* Lead Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
              <div>
                <span className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">Requirement ID: {selectedLead.requirement.id}</span>
                <h3 className="text-xl font-extrabold text-[#0B1F3A] mt-0.5">{selectedLead.requirement.customerName}</h3>
                <p className="text-xs text-[#64748B]">{selectedLead.requirement.customerEmail} • {selectedLead.requirement.companyName || 'Private Client'}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setProposalModalOpen(true)} icon={<Send className="w-3.5 h-3.5" />}>
                  Create Proposal
                </Button>
              </div>
            </div>

            {/* Natural Language Requirement Card */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <span className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#2563EB]" /> Natural Language Requirement Specification
              </span>
              <p className="text-sm font-medium text-[#1E293B] leading-relaxed font-sans">
                "{selectedLead.requirement.rawInput}"
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {(selectedLead.requirement.detectedSkills || []).map((sk: string) => (
                  <span key={sk} className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Status Pipeline Controller */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider">Lead Status Pipeline Stage</label>
              <div className="flex flex-wrap gap-2">
                {leadStatuses.map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(selectedLead.id, s, selectedLead.assignedExpertId)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                      selectedLead.status === s 
                        ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]' 
                        : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Backend Expert Recommendation Engine Output */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-[#0B1F3A] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2563EB]" /> Ranked Backend Expert Recommendations
                </h4>
                <span className="text-xs text-[#64748B]">Algorithm match score</span>
              </div>

              <div className="space-y-2">
                {matchingResults.slice(0, 3).map(m => {
                  const isAssigned = selectedLead.assignedExpertId === m.expert.id;
                  return (
                    <div key={m.expert.id} className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      isAssigned ? 'bg-[#F0FDF4] border-[#16A34A]' : 'bg-white border-[#E2E8F0]'
                    }`}>
                      <div className="flex items-center gap-3">
                        <img src={m.expert.avatar} alt={m.expert.name} className="w-10 h-10 rounded-full object-cover border border-[#CBD5E1]" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#0B1F3A]">{m.expert.name}</span>
                            <span className="text-[10px] font-extrabold px-1.5 py-0.2 bg-[#EFF6FF] text-[#2563EB] rounded">
                              {m.matchScore}% Match
                            </span>
                          </div>
                          <p className="text-[11px] text-[#64748B]">{m.expert.title} • ₹{m.expert.hourlyRateINR}/hr</p>
                        </div>
                      </div>

                      <Button 
                        size="sm" 
                        variant={isAssigned ? 'secondary' : 'outline'}
                        onClick={() => handleAssignExpert(m.expert.id)}
                      >
                        {isAssigned ? 'Assigned Primary' : 'Assign Expert'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Internal Notes History */}
            <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
              <label className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider">Internal Admin Notes</label>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {(selectedLead.notes || []).map((n, idx) => (
                  <div key={idx} className="text-xs p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155]">
                    {n}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  placeholder="Add operational note..."
                  value={internalNote}
                  onChange={e => setInternalNote(e.target.value)}
                  className="flex-1 text-xs p-2 rounded-lg border border-[#CBD5E1] outline-none focus:border-[#2563EB]"
                />
                <Button size="sm" variant="primary" onClick={() => handleStatusChange(selectedLead.id, selectedLead.status, selectedLead.assignedExpertId)}>
                  Add Note
                </Button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Proposal Modal */}
      <Modal isOpen={proposalModalOpen} onClose={() => setProposalModalOpen(false)} title="Generate Client Proposal">
        <form onSubmit={handleCreateProposal} className="space-y-4 font-sans text-xs">
          <div>
            <label className="font-bold text-[#0B1F3A]">Proposal Title</label>
            <input 
              type="text" 
              value={proposalTitle}
              onChange={e => setProposalTitle(e.target.value)}
              placeholder="E.g., Production SaaS Architecture Proposal"
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
              required
            />
          </div>

          <div>
            <label className="font-bold text-[#0B1F3A]">Proposed Price (INR)</label>
            <input 
              type="number" 
              value={proposalPrice}
              onChange={e => setProposalPrice(Number(e.target.value))}
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
              required
            />
          </div>

          <div>
            <label className="font-bold text-[#0B1F3A]">Detailed Scope & Deliverables</label>
            <textarea 
              rows={4}
              value={proposalScope}
              onChange={e => setProposalScope(e.target.value)}
              placeholder="Outline exact deliverables, database architecture, frontend screens, and milestone roadmap."
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setProposalModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Send Proposal
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
