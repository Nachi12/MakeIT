'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Video, 
  FileText, 
  MessageSquare, 
  Plus, 
  ExternalLink,
  Send
} from 'lucide-react';
import { useAppState } from '@/lib/services/store';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';

export const CustomerPortal: React.FC = () => {
  const { projects, consultations } = useAppState();

  const [chatMessage, setChatMessage] = useState('');
  const [messagesList, setMessagesList] = useState([
    { sender: 'Aravind Swaminathan (Expert)', content: 'Hi Kunal! I have reviewed your storefront requirements. The Next.js database schema is ready.', time: '10:45 AM' },
    { sender: 'You', content: 'Awesome! When can we test the checkout flow?', time: '10:48 AM' }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setMessagesList(prev => [...prev, { sender: 'You', content: chatMessage, time: 'Just now' }]);
    setChatMessage('');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      
      {/* Customer Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0B1F3A] flex items-center justify-center text-white text-lg font-bold">
            KS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#0B1F3A]">Client Portal</h1>
              <Badge variant="emerald" size="sm">ACTIVE CLIENT</Badge>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">Kunal Singhania (Threads Clothing Co.) • kunal@threads.io</p>
          </div>
        </div>

        <Link href="/request-service">
          <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
            Submit New Requirement
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column 1 & 2: Active Projects & Consultation Schedule */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Projects Tracker */}
          <div className="mnc-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <h2 className="text-xl font-bold text-[#0B1F3A] flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#2563EB]" />
                Active Projects ({projects.length})
              </h2>
              <span className="text-xs font-semibold text-[#64748B]">STATUS: LIVE</span>
            </div>

            {projects.map(proj => (
              <div key={proj.id} className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-5">
                
                {/* Project Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#0B1F3A]">{proj.title}</h3>
                      <Badge variant="blue" size="sm">{proj.status}</Badge>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5">{proj.serviceTitle} • Deadline: {proj.deadline}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#64748B] font-medium block">BUDGET</span>
                    <span className="text-base font-extrabold text-[#0B1F3A]">₹{proj.budgetINR.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Assigned Expert Details */}
                <div className="p-3.5 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={proj.expertAvatar} alt={proj.expertName} className="w-10 h-10 rounded-lg object-cover border border-[#E2E8F0]" />
                    <div>
                      <span className="text-xs font-bold text-[#0B1F3A] block">{proj.expertName}</span>
                      <span className="text-[11px] text-[#2563EB] font-semibold">Assigned Lead Specialist</span>
                    </div>
                  </div>

                  <Link href={`/experts/aravind-swaminathan`}>
                    <Button variant="outline" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                      Profile
                    </Button>
                  </Link>
                </div>

                {/* Milestones Breakdown */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Project Milestones:</span>
                  {proj.milestones.map(m => (
                    <div key={m.id} className="p-3 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${m.status === 'Completed' ? 'bg-[#16A34A]' : 'bg-[#F59E0B]'}`}></span>
                          <span className="font-bold text-[#0B1F3A]">{m.title}</span>
                        </div>
                        <p className="text-[#64748B] text-[11px] mt-0.5">{m.description}</p>
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

          {/* Booked Consultations */}
          <div className="mnc-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-[#0B1F3A] flex items-center gap-2 border-b border-[#E2E8F0] pb-4">
              <Video className="w-5 h-5 text-[#2563EB]" />
              Booked Consultations ({consultations.length})
            </h2>

            <div className="space-y-3">
              {consultations.map(c => (
                <div key={c.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#0B1F3A]">{c.expertName}</h4>
                      <Badge variant="blue" size="sm">{c.consultationType}</Badge>
                    </div>
                    <p className="text-xs text-[#64748B] mt-1">{c.topic}</p>
                    <p className="text-xs text-[#2563EB] font-semibold mt-1">📅 {c.date} • 🕒 {c.timeSlot}</p>
                  </div>

                  {c.meetingUrl && (
                    <a href={c.meetingUrl} target="_blank" rel="noreferrer">
                      <Button variant="primary" size="sm" icon={<Video className="w-3.5 h-3.5" />}>
                        Join Video Call
                      </Button>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar Column 3: Direct Messaging & Documents */}
        <div className="space-y-8">
          
          {/* Direct Expert Messaging Box */}
          <div className="mnc-card p-6 flex flex-col h-[460px] justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#2563EB]" />
                  <h3 className="text-base font-bold text-[#0B1F3A]">Expert Chat</h3>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" title="Online"></span>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[290px] pr-1">
                {messagesList.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-xl text-xs space-y-1 ${
                      msg.sender === 'You'
                        ? 'bg-[#EFF6FF] border border-[#BFDBFE] text-[#0F172A] ml-6'
                        : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155] mr-6'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#64748B] font-semibold">
                      <span>{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p>{msg.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="pt-3 border-t border-[#E2E8F0] flex items-center gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Message your expert..."
                className="w-full p-2.5 rounded-xl mnc-input text-xs text-[#0F172A]"
              />
              <Button type="submit" variant="primary" size="sm" className="shrink-0" icon={<Send className="w-3.5 h-3.5" />} />
            </form>
          </div>

          {/* Documents & Invoices */}
          <div className="mnc-card p-6 space-y-4">
            <h3 className="text-base font-bold text-[#0B1F3A] flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
              <FileText className="w-5 h-5 text-[#2563EB]" />
              Documents & Invoices
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0B1F3A] block">Threads_SaaS_Proposal.pdf</span>
                  <span className="text-[10px] text-[#64748B]">Fixed Price: ₹65,000</span>
                </div>
                <Badge variant="emerald" size="sm">APPROVED</Badge>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0B1F3A] block">Invoice_INV-2026-004.pdf</span>
                  <span className="text-[10px] text-[#64748B]">Milestone 1: ₹20,000</span>
                </div>
                <Badge variant="emerald" size="sm">PAID</Badge>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

