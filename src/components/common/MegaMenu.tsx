'use client';

import React from 'react';
import Link from 'next/link';
import { Layout, Code2, Server, Terminal, Cpu, Rocket, Globe, RefreshCw, Compass, ArrowRight } from 'lucide-react';
import { useAppState } from '@/lib/services/store';

interface MegaMenuProps {
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ onClose }) => {
  const { categories } = useAppState();

  const productDesignCats = categories.filter(c => c.pillar === 'PRODUCT_DESIGN');
  const softwareEngCats = categories.filter(c => c.pillar === 'SOFTWARE_ENGINEERING');
  const consultingCats = categories.filter(c => c.pillar === 'TECHNOLOGY_CONSULTING');

  const iconMap: Record<string, React.ReactNode> = {
    'Layout': <Layout className="w-4 h-4 text-[#2563EB]" />,
    'Globe': <Globe className="w-4 h-4 text-[#2563EB]" />,
    'Layers': <Code2 className="w-4 h-4 text-[#2563EB]" />,
    'Code2': <Code2 className="w-4 h-4 text-[#2563EB]" />,
    'Server': <Server className="w-4 h-4 text-[#2563EB]" />,
    'Terminal': <Terminal className="w-4 h-4 text-[#2563EB]" />,
    'Rocket': <Rocket className="w-4 h-4 text-[#2563EB]" />,
    'Cpu': <Cpu className="w-4 h-4 text-[#2563EB]" />,
    'RefreshCw': <RefreshCw className="w-4 h-4 text-[#2563EB]" />,
    'Compass': <Compass className="w-4 h-4 text-[#2563EB]" />
  };

  return (
    <div 
      className="absolute top-full left-0 right-0 w-full bg-white border-b border-x border-[#E2E8F0] shadow-2xl rounded-b-2xl p-8 z-[100] font-sans opacity-100"
      onMouseLeave={onClose}
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-8 bg-white">
        
        {/* Column 1: Product Design */}
        <div className="col-span-3 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB] border-b border-[#E2E8F0] pb-2">
            Product Design
          </div>
          <div className="space-y-2">
            {productDesignCats.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/services/${cat.slug}`}
                onClick={onClose}
                className="group flex items-start gap-3 p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="p-2 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] shrink-0 mt-0.5">
                  {iconMap[cat.iconName] || <Layout className="w-4 h-4 text-[#2563EB]" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#2563EB] transition-colors">
                    {cat.name}
                  </div>
                  <div className="text-[11px] text-[#64748B] line-clamp-1 font-normal">
                    {cat.shortDescription}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Column 2 & 3: Software Engineering */}
        <div className="col-span-6 space-y-4 border-x border-[#E2E8F0] px-6">
          <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB] border-b border-[#E2E8F0] pb-2">
            Software Engineering
          </div>
          <div className="grid grid-cols-2 gap-2">
            {softwareEngCats.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/services/${cat.slug}`}
                onClick={onClose}
                className="group flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="p-1.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] shrink-0 mt-0.5">
                  {iconMap[cat.iconName] || <Code2 className="w-4 h-4 text-[#2563EB]" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#2563EB] transition-colors">
                    {cat.name}
                  </div>
                  <div className="text-[11px] text-[#64748B] line-clamp-1 font-normal">
                    {cat.shortDescription}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Column 4: Technology Consulting & Business Goals */}
        <div className="col-span-3 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB] border-b border-[#E2E8F0] pb-2">
            Technology Consulting
          </div>
          <div className="space-y-2">
            {consultingCats.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/services/${cat.slug}`}
                onClick={onClose}
                className="group flex items-start gap-3 p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="p-2 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] shrink-0 mt-0.5">
                  {iconMap[cat.iconName] || <Compass className="w-4 h-4 text-[#2563EB]" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#2563EB] transition-colors">
                    {cat.name}
                  </div>
                  <div className="text-[11px] text-[#64748B] line-clamp-1 font-normal">
                    {cat.shortDescription}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E2E8F0]">
            <Link 
              href="/services" 
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline"
            >
              <span>Explore All IT Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
