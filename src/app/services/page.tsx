'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useAppState } from '@/lib/services/store';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ServiceCategoryId } from '@/types';
import { Button } from '@/components/ui/Button';

function ServicesPageContent() {
  const searchParams = useSearchParams();
  const catQuery = searchParams.get('category') as ServiceCategoryId | null;

  const { services, categories } = useAppState();
  const [selectedCat, setSelectedCat] = useState<ServiceCategoryId | 'all'>(catQuery || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = services.filter((srv) => {
    const matchesCat = selectedCat === 'all' || srv.categoryId === selectedCat;
    const matchesSearch = 
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 font-sans">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
          IT Service Catalog
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1F3A] tracking-tight">
          Technology Services Built Around Your Business
        </h1>
        <p className="text-[#475569] text-base font-normal">
          Connect with verified engineering specialists delivering web development, full-stack software, UI/UX design, PHP/Laravel, and API integration.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service name, skill..."
            className="w-full pl-10 p-2.5 rounded-lg mnc-input text-xs sm:text-sm text-[#0F172A]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
              selectedCat === 'all'
                ? 'bg-[#2563EB] text-white border-[#2563EB]'
                : 'bg-white text-[#475569] border-[#E2E8F0] hover:bg-[#F8FAFC]'
            }`}
          >
            All ({services.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                selectedCat === cat.id
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-white text-[#475569] border-[#E2E8F0] hover:bg-[#F8FAFC]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

      </div>

      {/* Services Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E2E8F0] space-y-4">
          <p className="text-[#475569] text-base font-normal">No services match your exact filter criteria.</p>
          <Link href="/request-service">
            <Button variant="primary" size="md">
              Submit Custom Requirement
            </Button>
          </Link>
        </div>
      )}

    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#64748B]">Loading Services...</div>}>
      <ServicesPageContent />
    </Suspense>
  );
}


