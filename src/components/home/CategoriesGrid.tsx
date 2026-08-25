'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Code, 
  Palette, 
  TrendingUp, 
  Calculator, 
  HeartPulse, 
  Wrench, 
  GraduationCap, 
  ArrowRight 
} from 'lucide-react';
import { useAppState } from '@/lib/services/store';

export const CategoriesGrid: React.FC = () => {
  const { categories } = useAppState();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code': return <Code className="w-6 h-6 text-[#F97316]" />;
      case 'Palette': return <Palette className="w-6 h-6 text-[#F97316]" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-[#F97316]" />;
      case 'Calculator': return <Calculator className="w-6 h-6 text-[#F97316]" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-[#F97316]" />;
      case 'Wrench': return <Wrench className="w-6 h-6 text-[#F97316]" />;
      case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-[#F97316]" />;
      default: return <Code className="w-6 h-6 text-[#F97316]" />;
    }
  };

  return (
    <section className="py-20 bg-[#F7F3E8] border-b border-[#E5E0D5] font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs font-black uppercase tracking-wider text-[#F97316] block">
            Domain Coverage
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight font-heading">
            Specialized Technology Categories
          </h2>
          <p className="text-[#4A4A45] text-base font-normal">
            Access verified software specialists structured across core product design and software engineering domains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/services?category=${cat.id}`}
              className="bg-white border border-[#E5E0D5] rounded-3xl p-6 shadow-xs hover:border-[#F97316] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFF0E6] border border-[#FFD8C2] flex items-center justify-center mb-4">
                  {getIcon(cat.iconName)}
                </div>
                <h3 className="text-lg font-black text-[#111111] mb-1.5 font-heading">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#4A4A45] leading-relaxed mb-4">
                  {cat.shortDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5E0D5] flex items-center justify-between text-xs text-[#787870] font-bold">
                <span>{cat.serviceCount} Services</span>
                <span className="flex items-center gap-1 text-[#F97316] font-bold">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
