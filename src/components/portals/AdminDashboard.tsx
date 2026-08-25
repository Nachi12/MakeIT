'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Briefcase, 
  Layers, 
  Sliders, 
  Plus, 
  BarChart3,
  ArrowUpRight
} from 'lucide-react';
import { useAppState } from '@/lib/services/store';
import { LeadStatus, Service, Expert } from '@/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { RatingStars } from '../ui/RatingStars';

export const AdminDashboard: React.FC = () => {
  const { 
    leads, 
    projects, 
    services, 
    experts, 
    matchingWeights, 
    updateMatchingWeights,
    updateLeadStatus,
    addService,
    addExpert
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'matching' | 'services' | 'experts'>('overview');

  // Modal States
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [addExpertModalOpen, setAddExpertModalOpen] = useState(false);

  // New Service Form State
  const [newSrvTitle, setNewSrvTitle] = useState('');
  const [newSrvCat, setNewSrvCat] = useState('technology');
  const [newSrvDesc, setNewSrvDesc] = useState('');
  const [newSrvPriceINR, setNewSrvPriceINR] = useState(25000);

  // New Expert Form State
  const [newExpName, setNewExpName] = useState('');
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpCat, setNewExpCat] = useState('technology');
  const [newExpExpYrs, setNewExpExpYrs] = useState(5);

  const totalLeadsCount = leads.length;
  const activeProjectsCount = projects.filter(p => p.status === 'In Progress' || p.status === 'Planning').length;
  const completedProjectsCount = projects.filter(p => p.status === 'Completed').length;
  const totalRevenueINR = projects.reduce((sum, p) => sum + p.budgetINR, 0);

  const leadStatuses: LeadStatus[] = [
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

  const handleServiceCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newSrv: Service = {
      id: `srv-${Date.now()}`,
      slug: newSrvTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categoryId: newSrvCat as any,
      categoryName: newSrvCat === 'technology' ? 'Technology & Software' : 'Specialized Services',
      title: newSrvTitle,
      shortDescription: newSrvDesc || 'Custom professional service deliverable.',
      fullDescription: newSrvDesc || 'Full professional execution.',
      iconName: 'Sparkles',
      startingPriceINR: newSrvPriceINR,
      startingPriceUSD: Math.round(newSrvPriceINR / 75),
      typicalDelivery: '2 Weeks',
      expertCount: 3,
      skills: ['Specialized Skill'],
      features: ['Scope definition', 'Deliverables signoff'],
      deliverables: ['Source files', 'Documentation'],
      processSteps: [{ title: 'Scope', description: 'Initial alignment' }],
      packages: [{ name: 'Standard', priceINR: newSrvPriceINR, priceUSD: Math.round(newSrvPriceINR / 75), deliveryTime: '2 Weeks', features: ['Core deliverable'] }]
    };
    addService(newSrv);
    setAddServiceModalOpen(false);
    setNewSrvTitle('');
  };

  const handleExpertCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newExp: Expert = {
      id: `exp-${Date.now()}`,
      slug: newExpName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: newExpName,
      title: newExpTitle || 'Senior Specialist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      categoryId: newExpCat as any,
      categoryName: 'Specialized Professional Services',
      primaryExpertise: 'Domain Consulting',
      yearsOfExperience: newExpExpYrs,
      skills: ['Expertise', 'Consulting'],
      servicesOffered: [],
      hourlyRateINR: 3000,
      hourlyRateUSD: 40,
      rating: 5.0,
      reviewCount: 1,
      completedProjects: 0,
      location: 'Bangalore, India',
      languages: ['English'],
      shortIntro: `${newExpName} is a verified specialist in ${newExpTitle}.`,
      fullBio: `${newExpName} brings ${newExpExpYrs} years of experience.`,
      availability: 'Available Now',
      verified: true
    };
    addExpert(newExp);
    setAddExpertModalOpen(false);
    setNewExpName('');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-[#2563EB]" /> Super Admin Command Center
          </div>
          <h1 className="text-3xl font-extrabold text-[#0B1F3A]">Platform Operations Portal</h1>
          <p className="text-sm text-[#475569] mt-1 font-normal">Manage requirement leads, tune matching algorithm weights, and oversee service catalogs.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setAddServiceModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            New Service
          </Button>
          <Button variant="primary" size="sm" onClick={() => setAddExpertModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Add Expert
          </Button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Analytics & Overview', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'leads', label: `Requirement Leads (${leads.length})`, icon: <Users className="w-4 h-4" /> },
          { id: 'matching', label: 'Matching Algorithm Weights', icon: <Sliders className="w-4 h-4" /> },
          { id: 'services', label: `Services Catalog (${services.length})`, icon: <Layers className="w-4 h-4" /> },
          { id: 'experts', label: `Expert Network (${experts.length})`, icon: <Briefcase className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0B1F3A] hover:bg-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Analytics & Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          
          {/* Stat Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="mnc-card p-6">
              <span className="text-xs font-semibold text-[#64748B] block">TOTAL LEADS GENERATED</span>
              <div className="text-3xl font-black text-[#0B1F3A] mt-2">{totalLeadsCount}</div>
              <p className="text-xs text-[#16A34A] mt-2 flex items-center gap-1 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" /> +24% growth rate
              </p>
            </div>

            <div className="mnc-card p-6">
              <span className="text-xs font-semibold text-[#64748B] block">ACTIVE PROJECTS</span>
              <div className="text-3xl font-black text-[#0B1F3A] mt-2">{activeProjectsCount}</div>
              <p className="text-xs text-[#64748B] mt-2">{completedProjectsCount} completed projects</p>
            </div>

            <div className="mnc-card p-6">
              <span className="text-xs font-semibold text-[#64748B] block">PROJECT REVENUE</span>
              <div className="text-3xl font-black text-[#0B1F3A] mt-2">₹{totalRevenueINR.toLocaleString('en-IN')}</div>
              <p className="text-xs text-[#2563EB] mt-2 font-semibold">AVG: ₹{(totalRevenueINR / Math.max(1, projects.length)).toLocaleString('en-IN')}</p>
            </div>

            <div className="mnc-card p-6">
              <span className="text-xs font-semibold text-[#64748B] block">MATCH ACCURACY</span>
              <div className="text-3xl font-black text-[#0B1F3A] mt-2">94.8%</div>
              <p className="text-xs text-[#64748B] mt-2">Weighted algorithmic score</p>
            </div>
          </div>

          {/* Recent Lead Pipeline Overview */}
          <div className="mnc-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <h3 className="text-lg font-bold text-[#0B1F3A]">Recent Requirement Submissions</h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('leads')}>View All Pipeline →</Button>
            </div>

            <div className="divide-y divide-[#E2E8F0]">
              {leads.map(lead => (
                <div key={lead.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0B1F3A]">{lead.requirement.customerName}</span>
                      <Badge variant="blue" size="sm">{lead.status}</Badge>
                    </div>
                    <p className="text-xs text-[#475569] mt-1 font-normal">&quot;{lead.requirement.rawInput}&quot;</p>
                    <div className="flex items-center gap-4 text-xs text-[#64748B] mt-1 font-normal">
                      <span>Budget: {lead.requirement.budgetRange}</span>
                      <span>Timeline: {lead.requirement.timeline}</span>
                      <span>Contact: {lead.requirement.preferredContact}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                      className="p-2 rounded-lg bg-white border border-[#CBD5E1] text-xs font-semibold text-[#0B1F3A]"
                    >
                      {leadStatuses.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Full Lead Pipeline */}
      {activeTab === 'leads' && (
        <div className="mnc-card p-6 space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <h3 className="text-xl font-bold text-[#0B1F3A]">Requirement Lead Pipeline</h3>
              <p className="text-xs text-[#64748B] font-normal">Manage client submissions, expert assignments, and status updates.</p>
            </div>
          </div>

          <div className="space-y-4">
            {leads.map(lead => (
              <div key={lead.id} className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-[#0B1F3A]">{lead.requirement.customerName}</span>
                      {lead.requirement.companyName && <span className="text-xs text-[#64748B]">({lead.requirement.companyName})</span>}
                      <Badge variant="blue" size="sm">ID: {lead.id}</Badge>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5">{lead.requirement.customerEmail} • {lead.requirement.customerPhone}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#64748B]">STATUS:</span>
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                      className="p-2.5 rounded-xl bg-white border border-[#CBD5E1] text-xs font-bold text-[#0B1F3A]"
                    >
                      {leadStatuses.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#334155]">
                  <span className="font-bold text-[#2563EB]">REQUIREMENT:</span> &quot;{lead.requirement.rawInput}&quot;
                </div>

                {lead.notes && lead.notes.length > 0 && (
                  <div className="text-xs text-[#64748B] space-y-1">
                    {lead.notes.map((note, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Matching Engine Configurator */}
      {activeTab === 'matching' && (
        <div className="mnc-card p-6 sm:p-8 space-y-6 animate-in fade-in duration-150">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block mb-1">
              Algorithm Tuning Console
            </span>
            <h3 className="text-2xl font-bold text-[#0B1F3A]">Smart Expert Matching Engine Weights</h3>
            <p className="text-sm text-[#475569] mt-1 font-normal">Configure scoring weights dynamically across matching parameters.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-[#0B1F3A]">
                <span>SKILL OVERLAP MATCH ({matchingWeights.skillMatch}%)</span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                value={matchingWeights.skillMatch}
                onChange={(e) => updateMatchingWeights({ skillMatch: Number(e.target.value) })}
                className="w-full accent-[#2563EB]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-[#0B1F3A]">
                <span>SERVICE CATEGORY MATCH ({matchingWeights.serviceMatch}%)</span>
              </div>
              <input
                type="range"
                min={10}
                max={40}
                value={matchingWeights.serviceMatch}
                onChange={(e) => updateMatchingWeights({ serviceMatch: Number(e.target.value) })}
                className="w-full accent-[#2563EB]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-[#0B1F3A]">
                <span>YEARS OF EXPERIENCE ({matchingWeights.experienceScore}%)</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                value={matchingWeights.experienceScore}
                onChange={(e) => updateMatchingWeights({ experienceScore: Number(e.target.value) })}
                className="w-full accent-[#2563EB]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-[#0B1F3A]">
                <span>AVAILABILITY SPEED ({matchingWeights.availabilityScore}%)</span>
              </div>
              <input
                type="range"
                min={5}
                max={25}
                value={matchingWeights.availabilityScore}
                onChange={(e) => updateMatchingWeights({ availabilityScore: Number(e.target.value) })}
                className="w-full accent-[#2563EB]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-[#0B1F3A]">
                <span>BUDGET COMPATIBILITY ({matchingWeights.budgetScore}%)</span>
              </div>
              <input
                type="range"
                min={5}
                max={20}
                value={matchingWeights.budgetScore}
                onChange={(e) => updateMatchingWeights({ budgetScore: Number(e.target.value) })}
                className="w-full accent-[#2563EB]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-[#0B1F3A]">
                <span>LOCATION & LANGUAGE ({matchingWeights.locationScore}%)</span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                value={matchingWeights.locationScore}
                onChange={(e) => updateMatchingWeights({ locationScore: Number(e.target.value) })}
                className="w-full accent-[#2563EB]"
              />
            </div>

          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0B1F3A] font-bold">
            TOTAL ENGINE WEIGHT SUM: {matchingWeights.skillMatch + matchingWeights.serviceMatch + matchingWeights.experienceScore + matchingWeights.availabilityScore + matchingWeights.budgetScore + matchingWeights.locationScore}%
          </div>
        </div>
      )}

      {/* TAB 4: Services CMS */}
      {activeTab === 'services' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#0B1F3A]">Active Service Catalog</h3>
            <Button variant="primary" size="sm" onClick={() => setAddServiceModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
              Create New Service
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(srv => (
              <div key={srv.id} className="mnc-card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="blue" size="sm">{srv.categoryName}</Badge>
                    <span className="text-xs font-bold text-[#0B1F3A]">₹{srv.startingPriceINR.toLocaleString('en-IN')}</span>
                  </div>
                  <h4 className="text-base font-bold text-[#0B1F3A]">{srv.title}</h4>
                  <p className="text-xs text-[#475569] mt-1 line-clamp-2 font-normal">{srv.shortDescription}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-xs text-[#64748B] flex items-center justify-between">
                  <span>{srv.expertCount} Experts</span>
                  <span>{srv.typicalDelivery}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Experts CMS */}
      {activeTab === 'experts' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#0B1F3A]">Expert Network Directory</h3>
            <Button variant="primary" size="sm" onClick={() => setAddExpertModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
              Add Specialist Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {experts.map(exp => (
              <div key={exp.id} className="mnc-card p-5 flex items-center gap-4">
                <img src={exp.avatar} alt={exp.name} className="w-14 h-14 rounded-xl object-cover border border-[#E2E8F0] shrink-0" />
                <div>
                  <h4 className="text-base font-bold text-[#0B1F3A]">{exp.name}</h4>
                  <p className="text-xs text-[#2563EB] font-semibold">{exp.title}</p>
                  <div className="flex items-center gap-2 text-xs text-[#64748B] mt-1">
                    <RatingStars rating={exp.rating} size="sm" />
                    <span>• {exp.yearsOfExperience} yrs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Service */}
      <Modal isOpen={addServiceModalOpen} onClose={() => setAddServiceModalOpen(false)} title="Create New Service">
        <form onSubmit={handleServiceCreate} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1">Service Title *</label>
            <input
              type="text"
              required
              value={newSrvTitle}
              onChange={(e) => setNewSrvTitle(e.target.value)}
              placeholder="e.g. Enterprise AI Integration"
              className="w-full p-3 rounded-xl mnc-input text-sm text-[#0F172A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1">Category</label>
            <select
              value={newSrvCat}
              onChange={(e) => setNewSrvCat(e.target.value)}
              className="w-full p-3 rounded-xl mnc-input text-sm text-[#0F172A]"
            >
              <option value="technology">Technology & Software</option>
              <option value="design">UI/UX & Product Design</option>
              <option value="business-sales">Business & Sales</option>
              <option value="finance-audit">Finance & Audit Support</option>
              <option value="healthcare-wellness">Healthcare & Mobility</option>
              <option value="automotive">Automotive & Car Parts</option>
              <option value="education">Education & Technical Coaching</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1">Starting Price (INR)</label>
            <input
              type="number"
              value={newSrvPriceINR}
              onChange={(e) => setNewSrvPriceINR(Number(e.target.value))}
              className="w-full p-3 rounded-xl mnc-input text-sm text-[#0F172A]"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Publish Service
          </Button>
        </form>
      </Modal>

      {/* Modal: Create Expert */}
      <Modal isOpen={addExpertModalOpen} onClose={() => setAddExpertModalOpen(false)} title="Add Specialist Profile">
        <form onSubmit={handleExpertCreate} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1">Expert Full Name *</label>
            <input
              type="text"
              required
              value={newExpName}
              onChange={(e) => setNewExpName(e.target.value)}
              placeholder="e.g. Dr. Rajesh Kumar"
              className="w-full p-3 rounded-xl mnc-input text-sm text-[#0F172A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1">Professional Title *</label>
            <input
              type="text"
              required
              value={newExpTitle}
              onChange={(e) => setNewExpTitle(e.target.value)}
              placeholder="e.g. Senior Ergonomics & Physiotherapy Specialist"
              className="w-full p-3 rounded-xl mnc-input text-sm text-[#0F172A]"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Add Specialist to Network
          </Button>
        </form>
      </Modal>

    </div>
  );
};

