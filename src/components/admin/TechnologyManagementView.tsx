'use client';

import React, { useEffect, useState } from 'react';
import { 
  Code2, 
  Plus, 
  Search, 
  Star, 
  Layers
} from 'lucide-react';
import { technologiesApi } from '@/services/makeit-api';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export const TechnologyManagementView: React.FC = () => {
  const [techList, setTechList] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Framework');
  const [description, setDescription] = useState('');
  const [popular, setPopular] = useState(true);

  const loadTech = async () => {
    const res = await technologiesApi.getAll();
    if (res.success && res.data) {
      setTechList(res.data);
    }
  };

  useEffect(() => {
    loadTech();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await technologiesApi.create({
      name,
      category,
      description,
      popular
    });

    if (res.success && res.data) {
      setTechList(prev => [...prev, res.data]);
      setModalOpen(false);
      setName('');
      setDescription('');
    }
  };

  const filtered = techList.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1F3A]">Technology Catalog & Stacks</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Centralized data catalog of frameworks, programming languages, databases, and UI tools.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search technologies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#CBD5E1] outline-none focus:border-[#2563EB] w-52"
            />
          </div>

          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Add Technology
          </Button>
        </div>
      </div>

      {/* Grid of Tech Badges & Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map(t => (
          <div key={t.id} className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-2 hover:border-[#CBD5E1] transition-all">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                <Code2 className="w-4 h-4" />
              </div>
              {t.popular && <Star className="w-3.5 h-3.5 text-[#D97706] fill-[#D97706]" />}
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-[#0B1F3A]">{t.name}</h4>
              <span className="text-[10px] text-[#64748B] font-medium block mt-0.5">{t.category}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Technology Catalog Item">
        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          <div>
            <label className="font-bold text-[#0B1F3A]">Technology Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="E.g., Vue.js or FastAPI" 
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
              required 
            />
          </div>

          <div>
            <label className="font-bold text-[#0B1F3A]">Category Classification</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg bg-white outline-none focus:border-[#2563EB]"
            >
              <option value="Frontend Framework">Frontend Framework</option>
              <option value="Backend Framework">Backend Framework</option>
              <option value="Language">Language</option>
              <option value="Database">Database</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Architecture">Architecture</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-[#0B1F3A]">Short Description</label>
            <input 
              type="text" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Optional overview..." 
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input 
              type="checkbox" 
              id="popCheck"
              checked={popular}
              onChange={e => setPopular(e.target.checked)}
              className="rounded text-[#2563EB]"
            />
            <label htmlFor="popCheck" className="text-xs font-semibold text-[#0B1F3A]">Feature as Popular Stack Option</label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Save Technology</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
