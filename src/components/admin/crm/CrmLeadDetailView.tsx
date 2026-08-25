'use client';

import React, { useEffect, useState } from 'react';
import { 
  PhoneOutgoing, 
  PhoneOff, 
  Clock, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  AlertCircle,
  ChevronRight,
  Send,
  User,
  Building,
  Tag
} from 'lucide-react';
import { callsApi, activitiesApi, followupsApi, leadsApi, proposalsApi } from '@/services/makeit-api';
import { Lead, Call, Activity, FollowUp } from '@/types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';

export const CrmLeadDetailView: React.FC<{ 
  leadId: string;
  onBack?: () => void;
}> = ({ leadId, onBack }) => {
  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  // Live Calling State
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [callTimer, setCallTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<any>(null);

  // Post-Call Outcome Modal
  const [postCallModalOpen, setPostCallModalOpen] = useState(false);
  const [callOutcome, setCallOutcome] = useState('Interested');
  const [callNotes, setCallNotes] = useState('');
  const [scheduleNextFollowUp, setScheduleNextFollowUp] = useState(true);
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [nextFollowUpReason, setNextFollowUpReason] = useState('Discuss technical proposal');

  // Follow-up Modal
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [fuDate, setFuDate] = useState('');
  const [fuReason, setFuReason] = useState('Follow up call');

  // Note State
  const [newNoteText, setNewNoteText] = useState('');

  const loadLeadDetails = async () => {
    setLoading(true);
    const [leadsRes, actRes, callRes] = await Promise.all([
      leadsApi.getAll(),
      activitiesApi.getByLead(leadId),
      callsApi.getAll({ leadId })
    ]);

    if (leadsRes.success && leadsRes.data) {
      const found = leadsRes.data.find(l => l.id === leadId);
      if (found) setLead(found);
    }
    if (actRes.success && actRes.data) {
      setActivities(actRes.data);
    }
    if (callRes.success && callRes.data) {
      setCalls(callRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLeadDetails();
  }, [leadId]);

  // Handle Live Call Duration Timer
  useEffect(() => {
    if (activeCall && activeCall.status === 'ANSWERED') {
      const interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    } else {
      if (timerInterval) clearInterval(timerInterval);
    }
  }, [activeCall?.status]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initiate Live Click-to-Call
  const handleInitiateCall = async () => {
    if (!lead) return;
    const phone = lead.requirement.customerPhone || '+91 98765 43210';
    try {
      const res = await callsApi.initiate({
        leadId: lead.id,
        contactId: lead.contactId,
        phone
      });

      if (res.success && res.data) {
        setActiveCall(res.data);
        setCallTimer(0);

        // Simulate state transition: INITIATING -> RINGING (1s) -> ANSWERED (3s)
        setTimeout(() => {
          setActiveCall(prev => prev ? { ...prev, status: 'RINGING' } : null);
        }, 1000);

        setTimeout(() => {
          setActiveCall(prev => prev ? { ...prev, status: 'ANSWERED' } : null);
        }, 3500);
      }
    } catch (e: any) {
      alert(`Call failed: ${e.message}`);
    }
  };

  // End Call & Open Post-Call Outcome Modal
  const handleEndCall = async () => {
    if (!activeCall) return;
    if (timerInterval) clearInterval(timerInterval);

    const endedCall = await callsApi.updateState(activeCall.id, {
      status: 'ENDED',
      durationSeconds: callTimer
    });

    if (endedCall.success) {
      setActiveCall(null);
      setPostCallModalOpen(true);
      loadLeadDetails();
    }
  };

  // Save Post-Call Outcome
  const handleSavePostCallOutcome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;

    // Log Activity
    await activitiesApi.log({
      leadId: lead.id,
      contactId: lead.contactId,
      type: 'Call',
      title: `Call Outcome: ${callOutcome} (${formatTimer(callTimer)})`,
      description: callNotes || `Client interaction completed with outcome: ${callOutcome}`
    });

    // Schedule next follow-up if requested
    if (scheduleNextFollowUp && nextFollowUpDate) {
      await followupsApi.schedule({
        leadId: lead.id,
        contactId: lead.contactId,
        scheduledAt: nextFollowUpDate,
        reason: nextFollowUpReason,
        priority: 'HIGH'
      });
    }

    // Update Lead status based on outcome
    let newStatus = lead.status;
    if (callOutcome === 'Interested' || callOutcome === 'Requested Proposal') {
      newStatus = 'QUALIFIED';
    } else if (callOutcome === 'Not Interested' || callOutcome === 'Do Not Contact') {
      newStatus = 'NOT_INTERESTED';
    }

    await leadsApi.updateStatus(lead.id, newStatus, lead.assignedExpertId, `Post-call outcome recorded: ${callOutcome}`);

    setPostCallModalOpen(false);
    setCallNotes('');
    loadLeadDetails();
  };

  // Add Manual Note
  const handleAddNote = async () => {
    if (!lead || !newNoteText.trim()) return;
    await activitiesApi.log({
      leadId: lead.id,
      contactId: lead.contactId,
      type: 'Note',
      title: 'Manual Sales Note Added',
      description: newNoteText
    });
    setNewNoteText('');
    loadLeadDetails();
  };

  if (!lead) {
    return <div className="p-8 text-center text-xs text-[#64748B] font-sans">Loading lead details...</div>;
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Back button */}
      {onBack && (
        <button onClick={onBack} className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1">
          ← Back to Lead Queue
        </button>
      )}

      {/* CLIENT HEADER */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-[#0B1F3A]">{lead.requirement.customerName}</h2>
            <Badge variant={lead.priority === 'URGENT' ? 'rose' : 'amber'}>{lead.priority}</Badge>
            <Badge variant="blue">{lead.status}</Badge>
          </div>
          <p className="text-xs text-[#64748B] mt-1 flex items-center gap-3">
            <span><Building className="w-3.5 h-3.5 inline mr-1" /> {lead.requirement.companyName || 'Founder / Client'}</span>
            <span><PhoneOutgoing className="w-3.5 h-3.5 inline mr-1" /> {lead.requirement.customerPhone || '+91 98765 43210'}</span>
            <span><Send className="w-3.5 h-3.5 inline mr-1" /> {lead.requirement.customerEmail}</span>
          </p>
        </div>

        {/* PRIMARY CALL ACTION BUTTON */}
        <div className="flex items-center gap-3">
          <Button 
            variant="primary" 
            size="md" 
            onClick={handleInitiateCall} 
            disabled={Boolean(activeCall)}
            icon={<PhoneOutgoing className="w-4 h-4" />}
          >
            {activeCall ? 'Call Active...' : 'Call Client Now'}
          </Button>

          <Button variant="outline" size="md" onClick={() => setFollowUpModalOpen(true)} icon={<Calendar className="w-4 h-4" />}>
            Schedule Follow-up
          </Button>
        </div>
      </div>

      {/* LIVE CALL CONTROL BAR */}
      {activeCall && (
        <div className="bg-[#0B1F3A] text-white p-5 rounded-2xl shadow-md border-2 border-[#2563EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-extrabold">
              <PhoneOutgoing className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#60A5FA]">
                Call State: {activeCall.status}
              </span>
              <h4 className="text-lg font-bold">Calling {lead.requirement.customerName} ({lead.requirement.customerPhone || '+91 98765 43210'})</h4>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-[#94A3B8] block">Live Duration</span>
              <span className="text-2xl font-mono font-extrabold text-[#60A5FA]">{formatTimer(callTimer)}</span>
            </div>

            <Button variant="whiteNavy" size="sm" onClick={handleEndCall} icon={<PhoneOff className="w-4 h-4 text-[#E11D48]" />}>
              End Call
            </Button>
          </div>
        </div>
      )}

      {/* PROJECT REQUIREMENT SPECIFICATION CARD */}
      <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
        <span className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#2563EB]" /> Natural Language Requirement Specification
        </span>
        <p className="text-sm font-medium text-[#1E293B] leading-relaxed">
          "{lead.requirement.rawInput}"
        </p>
        <div className="flex flex-wrap gap-4 text-xs text-[#64748B] pt-2 border-t border-[#F1F5F9]">
          <span>Project Type: <strong className="text-[#0B1F3A]">{lead.requirement.projectType}</strong></span>
          <span>Budget: <strong className="text-[#0B1F3A]">{lead.requirement.budgetRange}</strong></span>
          <span>Timeline: <strong className="text-[#0B1F3A]">{lead.requirement.timeline}</strong></span>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE: Activity Timeline vs History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Real-time Activity Timeline Stream */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-5">
          <h3 className="text-base font-extrabold text-[#0B1F3A] flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-[#2563EB]" /> Real-time Activity & Relationship Timeline
          </h3>

          {/* Quick Note Input */}
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Add call note or sales commentary..."
              value={newNoteText}
              onChange={e => setNewNoteText(e.target.value)}
              className="flex-1 text-xs p-2.5 rounded-xl border border-[#CBD5E1] outline-none focus:border-[#2563EB]"
            />
            <Button size="sm" variant="primary" onClick={handleAddNote}>
              Post Note
            </Button>
          </div>

          {/* Activity Stream */}
          <div className="space-y-3.5 max-h-[450px] overflow-y-auto pr-1">
            {activities.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#64748B] bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                No logged activity events yet.
              </div>
            ) : (
              activities.map(act => (
                <div key={act.id} className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0B1F3A]">
                    <span className="text-[#2563EB] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> {act.type}: {act.title}
                    </span>
                    <span className="text-[10px] text-[#94A3B8] font-mono">{new Date(act.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-[#334155]">{act.description}</p>
                  <div className="text-[10px] text-[#94A3B8] font-mono">Recorded by: {act.actorName}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Call History & Details */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Call History */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#0B1F3A] flex items-center gap-2">
              <PhoneOutgoing className="w-4.5 h-4.5 text-[#2563EB]" /> Telephony Call History
            </h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {calls.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#64748B] bg-[#F8FAFC] rounded-xl">
                  No previous calling history.
                </div>
              ) : (
                calls.map(c => (
                  <div key={c.id} className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-[#0B1F3A]">
                      <span>{c.direction} ({c.status})</span>
                      <span className="text-[#2563EB] font-mono">{formatTimer(c.durationSeconds)}</span>
                    </div>
                    {c.outcome && <p className="text-[#475569]">Outcome: <strong className="text-[#0B1F3A]">{c.outcome}</strong></p>}
                    <span className="text-[10px] text-[#94A3B8] font-mono block">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* POST-CALL OUTCOME WORKFLOW MODAL */}
      <Modal isOpen={postCallModalOpen} onClose={() => setPostCallModalOpen(false)} title="Call Completed — Post-Call Workflow">
        <form onSubmit={handleSavePostCallOutcome} className="space-y-4 font-sans text-xs">
          <div>
            <label className="font-bold text-[#0B1F3A]">How did the call go? (Call Outcome)</label>
            <select 
              value={callOutcome}
              onChange={e => setCallOutcome(e.target.value)}
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg bg-white outline-none focus:border-[#2563EB]"
            >
              <option value="Interested">Interested — Move to Qualified</option>
              <option value="Requested Proposal">Requested Proposal</option>
              <option value="Follow-up Required">Follow-up Required</option>
              <option value="No Answer">No Answer / Busy</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Do Not Contact">Do Not Contact</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-[#0B1F3A]">Call Notes & Discussion Points</label>
            <textarea 
              rows={3}
              value={callNotes}
              onChange={e => setCallNotes(e.target.value)}
              placeholder="E.g., Client wants a SaaS MVP with Next.js & Stripe billing. Budget around ₹1.5L."
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="fuCheck" 
                checked={scheduleNextFollowUp} 
                onChange={e => setScheduleNextFollowUp(e.target.checked)}
                className="rounded text-[#2563EB]"
              />
              <label htmlFor="fuCheck" className="font-bold text-[#0B1F3A]">Schedule Next Follow-Up Call</label>
            </div>

            {scheduleNextFollowUp && (
              <div className="space-y-2 pt-1">
                <div>
                  <label className="text-[#64748B]">Follow-up Date & Time</label>
                  <input 
                    type="datetime-local" 
                    value={nextFollowUpDate}
                    onChange={e => setNextFollowUpDate(e.target.value)}
                    className="w-full text-xs p-2 mt-1 border border-[#CBD5E1] rounded-lg bg-white outline-none focus:border-[#2563EB]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#64748B]">Follow-up Objective</label>
                  <input 
                    type="text" 
                    value={nextFollowUpReason}
                    onChange={e => setNextFollowUpReason(e.target.value)}
                    className="w-full text-xs p-2 mt-1 border border-[#CBD5E1] rounded-lg bg-white outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="primary" size="sm" type="submit">
              Save Outcome & Activity
            </Button>
          </div>
        </form>
      </Modal>

      {/* SCHEDULE FOLLOW-UP MODAL */}
      <Modal isOpen={followUpModalOpen} onClose={() => setFollowUpModalOpen(false)} title="Schedule Client Follow-up Call">
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (!fuDate || !lead) return;
          await followupsApi.schedule({
            leadId: lead.id,
            contactId: lead.contactId,
            scheduledAt: fuDate,
            reason: fuReason
          });
          setFollowUpModalOpen(false);
          loadLeadDetails();
        }} className="space-y-4 font-sans text-xs">
          <div>
            <label className="font-bold text-[#0B1F3A]">Follow-up Date & Time</label>
            <input 
              type="datetime-local" 
              value={fuDate}
              onChange={e => setFuDate(e.target.value)}
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
              required
            />
          </div>

          <div>
            <label className="font-bold text-[#0B1F3A]">Reason / Objective</label>
            <input 
              type="text" 
              value={fuReason}
              onChange={e => setFuReason(e.target.value)}
              placeholder="E.g., Review technical proposal and pricing"
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setFollowUpModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Schedule Follow-up</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
