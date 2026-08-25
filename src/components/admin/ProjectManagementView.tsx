'use client';

import React, { useEffect, useState } from 'react';
import { 
  Briefcase, 
  Users, 
  CheckCircle2, 
  Clock, 
  Plus, 
  FileText,
  DollarSign,
  UserPlus
} from 'lucide-react';
import { projectsApi, expertsApi } from '@/services/makeit-api';
import { Project, Expert } from '@/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export const ProjectManagementView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Modals
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);

  // New Milestone Form
  const [mTitle, setMTitle] = useState('');
  const [mDesc, setMDesc] = useState('');
  const [mDueDate, setMDueDate] = useState('');
  const [mAmount, setMAmount] = useState(25000);

  // New Team Member Form
  const [memRole, setMemRole] = useState('Frontend Engineer');
  const [memExpertId, setMemExpertId] = useState('');

  const loadData = async () => {
    const [pRes, eRes] = await Promise.all([
      projectsApi.getAll(),
      expertsApi.getAll()
    ]);

    if (pRes.success && pRes.data) {
      setProjects(pRes.data);
      if (pRes.data.length > 0 && !selectedProject) {
        setSelectedProject(pRes.data[0]);
      }
    }

    if (eRes.success && eRes.data) {
      setExperts(eRes.data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusUpdate = async (projId: string, status: string) => {
    const res = await projectsApi.updateStatus(projId, status);
    if (res.success && res.data) {
      setProjects(prev => prev.map(p => p.id === projId ? res.data! : p));
      setSelectedProject(res.data);
    }
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    const res = await projectsApi.updateStatus(selectedProject.id, selectedProject.status, undefined, {
      title: mTitle,
      description: mDesc,
      dueDate: mDueDate || new Date().toISOString().split('T')[0],
      amountINR: Number(mAmount)
    });

    if (res.success && res.data) {
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? res.data! : p));
      setSelectedProject(res.data);
      setMilestoneModalOpen(false);
      setMTitle('');
      setMDesc('');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !memExpertId) return;
    const exp = experts.find(e => e.id === memExpertId);
    if (!exp) return;

    const res = await projectsApi.updateStatus(selectedProject.id, selectedProject.status, undefined, undefined, {
      role: memRole,
      expertId: exp.id,
      expertName: exp.name,
      expertTitle: exp.title,
      expertAvatar: exp.avatar
    });

    if (res.success && res.data) {
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? res.data! : p));
      setSelectedProject(res.data);
      setMemberModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1F3A]">Active Project Engineering</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Manage multi-member project teams, milestone releases, and contract budgets.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Projects List */}
        <div className="lg:col-span-5 space-y-3">
          {projects.map(proj => {
            const isSelected = selectedProject?.id === proj.id;
            return (
              <div 
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                  isSelected ? 'border-[#2563EB] ring-2 ring-[#2563EB]/10 shadow-xs' : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-extrabold text-[#0B1F3A]">{proj.title}</h4>
                  <Badge variant={proj.status === 'Completed' ? 'emerald' : 'blue'}>{proj.status}</Badge>
                </div>
                <p className="text-xs text-[#64748B] font-medium">Customer: {proj.customerName}</p>
                <div className="flex items-center justify-between text-[11px] text-[#64748B] mt-3 pt-2 border-t border-[#F1F5F9]">
                  <span>Contract Budget: <strong className="text-[#0B1F3A]">₹{proj.budgetINR.toLocaleString('en-IN')}</strong></span>
                  <span>Deadline: {proj.deadline}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Project Workspace */}
        {selectedProject && (
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-6">
            
            {/* Top Workspace Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
              <div>
                <span className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">Project ID: {selectedProject.id}</span>
                <h3 className="text-xl font-extrabold text-[#0B1F3A] mt-0.5">{selectedProject.title}</h3>
                <p className="text-xs text-[#64748B]">Client: {selectedProject.customerName} ({selectedProject.customerEmail})</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {['Planning', 'In Progress', 'Review', 'Completed'].map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusUpdate(selectedProject.id, st)}
                    className={`px-2 py-1 text-[11px] font-bold rounded-md border ${
                      selectedProject.status === st ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]' : 'bg-white text-[#475569] border-[#CBD5E1]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Multi-Member Team Roster Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-[#0B1F3A] uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#2563EB]" /> Assigned Engineering Team Roster
                </h4>
                <Button size="sm" variant="outline" onClick={() => setMemberModalOpen(true)} icon={<UserPlus className="w-3.5 h-3.5" />}>
                  Add Member
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(selectedProject.members || [
                  { role: 'Lead Architect', expertName: selectedProject.expertName, expertTitle: 'Senior Specialist', expertAvatar: selectedProject.expertAvatar }
                ]).map((mem: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-3">
                    <img src={mem.expertAvatar || selectedProject.expertAvatar} alt={mem.expertName} className="w-9 h-9 rounded-full object-cover border border-[#CBD5E1]" />
                    <div>
                      <span className="text-xs font-bold text-[#0B1F3A] block">{mem.expertName}</span>
                      <span className="text-[10px] font-semibold text-[#2563EB] block">{mem.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones & Deliverables Roadmap */}
            <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-[#0B1F3A] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB]" /> Project Milestones & Financial Releases
                </h4>
                <Button size="sm" variant="primary" onClick={() => setMilestoneModalOpen(true)} icon={<Plus className="w-3.5 h-3.5" />}>
                  Add Milestone
                </Button>
              </div>

              <div className="space-y-2.5">
                {(selectedProject.milestones || []).map((m: any) => (
                  <div key={m.id} className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#0B1F3A]">{m.title}</span>
                        <Badge variant={m.status === 'Completed' ? 'emerald' : 'blue'}>{m.status}</Badge>
                      </div>
                      <p className="text-xs text-[#475569] mt-0.5">{m.description}</p>
                      <span className="text-[10px] text-[#94A3B8] font-medium block mt-1">Due Date: {m.dueDate}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-[#0B1F3A] block">₹{m.amountINR.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Add Milestone Modal */}
      <Modal isOpen={milestoneModalOpen} onClose={() => setMilestoneModalOpen(false)} title="Add Milestone Deliverable">
        <form onSubmit={handleAddMilestone} className="space-y-4 font-sans text-xs">
          <div>
            <label className="font-bold text-[#0B1F3A]">Milestone Title</label>
            <input 
              type="text" 
              value={mTitle}
              onChange={e => setMTitle(e.target.value)}
              placeholder="E.g., Core Auth & Stripe Integration"
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
              required
            />
          </div>

          <div>
            <label className="font-bold text-[#0B1F3A]">Deliverable Description</label>
            <textarea 
              rows={2}
              value={mDesc}
              onChange={e => setMDesc(e.target.value)}
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#0B1F3A]">Milestone Amount (INR)</label>
              <input 
                type="number" 
                value={mAmount}
                onChange={e => setMAmount(Number(e.target.value))}
                className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="font-bold text-[#0B1F3A]">Target Due Date</label>
              <input 
                type="date" 
                value={mDueDate}
                onChange={e => setMDueDate(e.target.value)}
                className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setMilestoneModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Add Milestone</Button>
          </div>
        </form>
      </Modal>

      {/* Add Team Member Modal */}
      <Modal isOpen={memberModalOpen} onClose={() => setMemberModalOpen(false)} title="Assign Team Member to Project">
        <form onSubmit={handleAddMember} className="space-y-4 font-sans text-xs">
          <div>
            <label className="font-bold text-[#0B1F3A]">Project Role</label>
            <input 
              type="text" 
              value={memRole}
              onChange={e => setMemRole(e.target.value)}
              placeholder="E.g., Senior Frontend Engineer"
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
              required
            />
          </div>

          <div>
            <label className="font-bold text-[#0B1F3A]">Select Expert Candidate</label>
            <select 
              value={memExpertId}
              onChange={e => setMemExpertId(e.target.value)}
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg bg-white outline-none focus:border-[#2563EB]"
              required
            >
              <option value="">Select an expert...</option>
              {experts.map(exp => (
                <option key={exp.id} value={exp.id}>{exp.name} — {exp.title}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setMemberModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Assign Member</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
