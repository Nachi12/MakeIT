'use client';

import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  MessageSquare
} from 'lucide-react';
import { useAppState } from '@/lib/services/store';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { RatingStars } from '../ui/RatingStars';

export const ExpertPortal: React.FC = () => {
  const { experts, leads, projects, consultations, updateProjectStatus } = useAppState();

  const currentExpert = experts[0]; // Aravind Swaminathan
  const myProjects = projects.filter(p => p.expertId === currentExpert.id || p.expertName.includes('Aravind'));
  const myConsultations = consultations.filter(c => c.expertId === currentExpert.id || c.expertName.includes('Aravind'));

  const [availability, setAvailability] = useState(currentExpert.availability);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      
      {/* Expert Profile Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img 
            src={currentExpert.avatar} 
            alt={currentExpert.name}
            className="w-16 h-16 rounded-xl object-cover border border-[#E2E8F0] shadow-xs" 
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#0B1F3A]">{currentExpert.name}</h1>
              <Badge variant="blue" size="sm">VERIFIED PRACTITIONER</Badge>
            </div>
            <p className="text-xs font-semibold text-[#2563EB] mt-0.5">{currentExpert.title}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-[#64748B]">
              <RatingStars rating={currentExpert.rating} size="sm" />
              <span>• {currentExpert.completedProjects} Projects Completed</span>
              <span>• {currentExpert.yearsOfExperience} Yrs Exp</span>
            </div>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#64748B]">STATUS:</span>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value as any)}
            className="p-2.5 rounded-xl mnc-input text-xs font-bold text-[#0B1F3A]"
          >
            <option value="Available Now">Available Now</option>
            <option value="Next Week">Next Week</option>
            <option value="In 2 Weeks">In 2 Weeks</option>
            <option value="Limited Availability">Limited Availability</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="mnc-card p-6">
          <span className="text-xs font-semibold text-[#64748B] block">ACTIVE PROJECTS</span>
          <div className="text-3xl font-black text-[#0B1F3A] mt-2">{myProjects.length}</div>
          <p className="text-xs text-[#2563EB] mt-2 font-semibold">Threads Storefront Build</p>
        </div>

        <div className="mnc-card p-6">
          <span className="text-xs font-semibold text-[#64748B] block">EARNINGS (THIS MONTH)</span>
          <div className="text-3xl font-black text-[#0B1F3A] mt-2">₹1,45,000</div>
          <p className="text-xs text-[#64748B] mt-2">Milestone payouts released</p>
        </div>

        <div className="mnc-card p-6">
          <span className="text-xs font-semibold text-[#64748B] block">UPCOMING CALLS</span>
          <div className="text-3xl font-black text-[#0B1F3A] mt-2">{myConsultations.length}</div>
          <p className="text-xs text-[#64748B] mt-2">Scheduled consultations</p>
        </div>

        <div className="mnc-card p-6">
          <span className="text-xs font-semibold text-[#64748B] block">CLIENT RATING</span>
          <div className="text-3xl font-black text-[#0B1F3A] mt-2">4.96 / 5</div>
          <p className="text-xs text-[#64748B] mt-2">Based on 42 verified reviews</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Assigned Projects & Milestones */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="mnc-card p-6 space-y-6">
            <h2 className="text-xl font-bold text-[#0B1F3A] flex items-center gap-2 border-b border-[#E2E8F0] pb-4">
              <Briefcase className="w-5 h-5 text-[#2563EB]" />
              Assigned Client Projects
            </h2>

            {myProjects.map(proj => (
              <div key={proj.id} className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#0B1F3A]">{proj.title}</h3>
                      <Badge variant="blue" size="sm">{proj.status}</Badge>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5">Client: {proj.customerName} ({proj.customerEmail})</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#64748B]">UPDATE:</span>
                    <select
                      value={proj.status}
                      onChange={(e) => updateProjectStatus(proj.id, e.target.value as any)}
                      className="p-2 rounded-lg bg-white border border-[#CBD5E1] text-xs font-bold text-[#0B1F3A]"
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Revision">Revision</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Milestones Delivery Progress:</span>
                  {proj.milestones.map(m => (
                    <div key={m.id} className="p-3 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#0B1F3A]">{m.title}</span>
                        <p className="text-[#64748B] text-[11px] mt-0.5">Due: {m.dueDate}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#0B1F3A]">₹{m.amountINR.toLocaleString('en-IN')}</span>
                        <Badge variant={m.status === 'Completed' ? 'emerald' : 'amber'} size="sm">
                          {m.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Assigned Requirement Leads */}
          <div className="mnc-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-[#0B1F3A] flex items-center gap-2 border-b border-[#E2E8F0] pb-4">
              <Users className="w-5 h-5 text-[#2563EB]" />
              Incoming Client Requirements ({leads.length})
            </h2>

            <div className="space-y-3">
              {leads.map(lead => (
                <div key={lead.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-[#0B1F3A]">{lead.requirement.customerName}</span>
                      <p className="text-xs text-[#64748B]">{lead.requirement.customerEmail}</p>
                    </div>
                    <Badge variant="blue" size="sm">Match Score: 95%</Badge>
                  </div>

                  <p className="text-xs text-[#334155] italic">&quot;{lead.requirement.rawInput}&quot;</p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E2E8F0]">
                    <span className="text-[#64748B] font-medium">Budget: {lead.requirement.budgetRange}</span>
                    <Button variant="primary" size="sm" icon={<MessageSquare className="w-3.5 h-3.5" />}>
                      Respond to Client
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Upcoming Calls & Feedback */}
        <div className="space-y-8">
          
          <div className="mnc-card p-6 space-y-4">
            <h3 className="text-base font-bold text-[#0B1F3A] flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
              <Calendar className="w-5 h-5 text-[#2563EB]" />
              Upcoming Calls
            </h3>

            {myConsultations.map(c => (
              <div key={c.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0B1F3A]">{c.customerName}</span>
                  <Badge variant="blue" size="sm">{c.consultationType}</Badge>
                </div>
                <p className="text-xs text-[#64748B]">{c.topic}</p>
                <div className="text-xs text-[#2563EB] font-semibold pt-1">
                  📅 {c.date} • {c.timeSlot}
                </div>
              </div>
            ))}
          </div>

          <div className="mnc-card p-6 space-y-4">
            <h3 className="text-base font-bold text-[#0B1F3A] flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
              Latest Verified Reviews
            </h3>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <RatingStars rating={5} size="sm" showNumber={false} />
                <span className="text-[10px] text-[#64748B]">2 days ago</span>
              </div>
              <p className="text-[#334155] italic">
                &quot;Aravind is an absolute master of Next.js architecture. Re-engineered our storefront in record time!&quot;
              </p>
              <p className="text-[#0B1F3A] text-[11px] font-bold">— Sidharth M., CTO Nexus AI</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

