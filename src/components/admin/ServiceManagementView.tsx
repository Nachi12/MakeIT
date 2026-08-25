'use client';

import React, { useEffect, useState } from 'react';
import { 
  Layers, 
  Plus, 
  Search, 
  Edit3, 
  Sparkles,
  Tag,
  DollarSign
} from 'lucide-react';
import { servicesApi } from '@/services/makeit-api';
import { Service, ServiceCategory } from '@/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export const ServiceManagementView: React.FC = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [catId, setCatId] = useState('full-stack-development');
  const [desc, setDesc] = useState('');
  const [priceINR, setPriceINR] = useState(25000);
  const [delivery, setDelivery] = useState('2 Weeks');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');

  const loadServices = async () => {
    const res = await servicesApi.getAll();
    if (res.success && res.data) {
      setCategories(res.data.categories || []);
      setServices(res.data.services || []);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenCreate = () => {
    setEditingService(null);
    setTitle('');
    setCatId('full-stack-development');
    setDesc('');
    setPriceINR(25000);
    setDelivery('2 Weeks');
    setSeoTitle('');
    setSeoDesc('');
    setModalOpen(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setTitle(srv.title);
    setCatId(srv.categoryId);
    setDesc(srv.shortDescription);
    setPriceINR(srv.startingPriceINR);
    setDelivery(srv.typicalDelivery);
    setSeoTitle(srv.seoTitle || srv.title);
    setSeoDesc(srv.seoDescription || srv.shortDescription);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const catName = categories.find(c => c.id === catId)?.name || 'Specialized Services';

    if (editingService) {
      const res = await servicesApi.update(editingService.id, {
        title,
        categoryId: catId as any,
        categoryName: catName,
        shortDescription: desc,
        fullDescription: desc,
        startingPriceINR: Number(priceINR),
        typicalDelivery: delivery,
        seoTitle,
        seoDescription: seoDesc
      });
      if (res.success && res.data) {
        setServices(prev => prev.map(s => s.id === editingService.id ? res.data! : s));
      }
    } else {
      const res = await servicesApi.create({
        title,
        categoryId: catId as any,
        categoryName: catName,
        shortDescription: desc,
        fullDescription: desc,
        startingPriceINR: Number(priceINR),
        typicalDelivery: delivery,
        seoTitle,
        seoDescription: seoDesc
      });
      if (res.success && res.data) {
        setServices(prev => [res.data!, ...prev]);
      }
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1F3A]">IT Services Catalog Management</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Manage software engineering packages, deliverables, starting prices, and SEO metadata.</p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenCreate} icon={<Plus className="w-4 h-4" />}>
          New Service Package
        </Button>
      </div>

      {/* Grid of Service Catalog Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map(srv => (
          <div key={srv.id} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#CBD5E1] transition-all">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">{srv.categoryName}</span>
                  <h4 className="text-sm font-extrabold text-[#0B1F3A] mt-0.5">{srv.title}</h4>
                </div>

                <button onClick={() => handleOpenEdit(srv)} className="text-[#94A3B8] hover:text-[#2563EB] p-1">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#475569] mt-2 line-clamp-2">{srv.shortDescription}</p>

              <div className="mt-3 text-[11px] text-[#64748B] space-y-1">
                <div>Typical Delivery: <strong className="text-[#0B1F3A]">{srv.typicalDelivery}</strong></div>
                {srv.seoTitle && <div className="truncate">SEO Title: <span className="text-[#0B1F3A]">{srv.seoTitle}</span></div>}
              </div>
            </div>

            <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
              <span className="text-[#64748B]">Starting at:</span>
              <strong className="text-sm font-extrabold text-[#0B1F3A]">₹{srv.startingPriceINR.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingService ? 'Edit Service Package' : 'Create New Service Package'}>
        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          <div>
            <label className="font-bold text-[#0B1F3A]">Service Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="E.g., Full Stack Next.js Development" 
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
              required 
            />
          </div>

          <div>
            <label className="font-bold text-[#0B1F3A]">Service Category</label>
            <select 
              value={catId} 
              onChange={e => setCatId(e.target.value)}
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg bg-white outline-none focus:border-[#2563EB]"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#0B1F3A]">Starting Price (INR)</label>
              <input 
                type="number" 
                value={priceINR} 
                onChange={e => setPriceINR(Number(e.target.value))} 
                className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="font-bold text-[#0B1F3A]">Typical Delivery Timeline</label>
              <input 
                type="text" 
                value={delivery} 
                onChange={e => setDelivery(e.target.value)} 
                className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#0B1F3A]">Short Description & Scope</label>
            <textarea 
              rows={3} 
              value={desc} 
              onChange={e => setDesc(e.target.value)} 
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <span className="font-bold text-[#0B1F3A] uppercase tracking-wider text-[11px]">SEO Metadata</span>
            <div>
              <label className="text-[#64748B]">SEO Title Tag</label>
              <input 
                type="text" 
                value={seoTitle} 
                onChange={e => setSeoTitle(e.target.value)} 
                className="w-full text-xs p-2 mt-1 border border-[#CBD5E1] rounded-lg bg-white outline-none focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="text-[#64748B]">Meta Description</label>
              <input 
                type="text" 
                value={seoDesc} 
                onChange={e => setSeoDesc(e.target.value)} 
                className="w-full text-xs p-2 mt-1 border border-[#CBD5E1] rounded-lg bg-white outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Save Service</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
