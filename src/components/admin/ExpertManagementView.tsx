'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Star, 
  CheckCircle2, 
  Edit3, 
  ShieldCheck,
  MapPin,
  Clock
} from 'lucide-react';
import { expertsApi } from '@/services/makeit-api';
import { Expert } from '@/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export const ExpertManagementView: React.FC = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [years, setYears] = useState(5);
  const [rateINR, setRateINR] = useState(2500);
  const [availability, setAvailability] = useState<'Available Now' | 'Next Week' | 'In 2 Weeks' | 'Limited Availability'>('Available Now');
  const [skillsStr, setSkillsStr] = useState('React, Next.js, TypeScript');

  const loadExperts = async () => {
    const res = await expertsApi.getAll();
    if (res.success && res.data) {
      setExperts(res.data);
    }
  };

  useEffect(() => {
    loadExperts();
  }, []);

  const handleOpenCreate = () => {
    setEditingExpert(null);
    setName('');
    setTitle('');
    setYears(5);
    setRateINR(2500);
    setAvailability('Available Now');
    setSkillsStr('React, Next.js, TypeScript');
    setModalOpen(true);
  };

  const handleOpenEdit = (exp: Expert) => {
    setEditingExpert(exp);
    setName(exp.name);
    setTitle(exp.title);
    setYears(exp.yearsOfExperience);
    setRateINR(exp.hourlyRateINR);
    setAvailability(exp.availability as any);
    setSkillsStr((exp.skills || []).join(', '));
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);

    if (editingExpert) {
      const res = await expertsApi.update(editingExpert.id, {
        name,
        title,
        yearsOfExperience: Number(years),
        hourlyRateINR: Number(rateINR),
        availability,
        skills
      });
      if (res.success && res.data) {
        setExperts(prev => prev.map(e => e.id === editingExpert.id ? res.data! : e));
      }
    } else {
      const res = await expertsApi.create({
        name,
        title: title || 'Senior Technology Expert',
        yearsOfExperience: Number(years),
        hourlyRateINR: Number(rateINR),
        availability,
        skills
      });
      if (res.success && res.data) {
        setExperts(prev => [res.data!, ...prev]);
      }
    }
    setModalOpen(false);
  };

  const filteredExperts = experts.filter(exp => 
    exp.name.toLowerCase().includes(search.toLowerCase()) ||
    exp.title.toLowerCase().includes(search.toLowerCase()) ||
    (exp.skills || []).some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1F3A]">Technology Experts Directory</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Manage software architects, full stack engineers, and verified consultants.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search experts or skills..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#CBD5E1] outline-none focus:border-[#2563EB] w-60"
            />
          </div>

          <Button variant="primary" size="sm" onClick={handleOpenCreate} icon={<Plus className="w-4 h-4" />}>
            Add Expert
          </Button>
        </div>
      </div>

      {/* Grid of Expert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExperts.map(exp => (
          <div key={exp.id} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#CBD5E1] transition-all">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img src={exp.avatar} alt={exp.name} className="w-12 h-12 rounded-full object-cover border border-[#CBD5E1]" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-extrabold text-[#0B1F3A]">{exp.name}</h4>
                      {exp.verified && <ShieldCheck className="w-4 h-4 text-[#2563EB]" />}
                    </div>
                    <p className="text-xs text-[#2563EB] font-semibold">{exp.title}</p>
                  </div>
                </div>

                <button onClick={() => handleOpenEdit(exp)} className="text-[#94A3B8] hover:text-[#2563EB] p-1">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#64748B] mt-3">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {exp.location}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {exp.yearsOfExperience} yrs exp</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {(exp.skills || []).slice(0, 4).map(sk => (
                  <span key={sk} className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#F1F5F9] text-[#334155]">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#64748B]">Hourly Rate: </span>
                <strong className="text-[#0B1F3A]">₹{exp.hourlyRateINR}/hr</strong>
              </div>
              <Badge variant={exp.availability === 'Available Now' ? 'emerald' : 'blue'}>
                {exp.availability}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingExpert ? 'Edit Expert Profile' : 'Add Technology Expert'}>
        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          <div>
            <label className="font-bold text-[#0B1F3A]">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="E.g., Rajesh Khanna" 
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
              required 
            />
          </div>

          <div>
            <label className="font-bold text-[#0B1F3A]">Professional Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="E.g., Senior Full Stack Architect" 
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#0B1F3A]">Years of Experience</label>
              <input 
                type="number" 
                value={years} 
                onChange={e => setYears(Number(e.target.value))} 
                className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="font-bold text-[#0B1F3A]">Hourly Rate (INR)</label>
              <input 
                type="number" 
                value={rateINR} 
                onChange={e => setRateINR(Number(e.target.value))} 
                className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#0B1F3A]">Availability Status</label>
            <select 
              value={availability}
              onChange={e => setAvailability(e.target.value as any)}
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg bg-white outline-none focus:border-[#2563EB]"
            >
              <option value="Available Now">Available Now</option>
              <option value="Next Week">Next Week</option>
              <option value="In 2 Weeks">In 2 Weeks</option>
              <option value="Limited Availability">Limited Availability</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-[#0B1F3A]">Skills & Technologies (comma separated)</label>
            <input 
              type="text" 
              value={skillsStr} 
              onChange={e => setSkillsStr(e.target.value)} 
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Save Expert</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
