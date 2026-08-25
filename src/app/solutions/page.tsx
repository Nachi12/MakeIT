'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, Rocket, Layers, Code2, RefreshCw, Wrench, Cpu } from 'lucide-react';
import { useAppState } from '@/lib/services/store';
import { Button } from '@/components/ui/Button';

const iconMap: Record<string, React.ReactNode> = {
  'Globe': <Globe className="w-6 h-6 text-[#2563EB]" />,
  'Rocket': <Rocket className="w-6 h-6 text-[#2563EB]" />,
  'Layers': <Layers className="w-6 h-6 text-[#2563EB]" />,
  'Code2': <Code2 className="w-6 h-6 text-[#2563EB]" />,
  'RefreshCw': <RefreshCw className="w-6 h-6 text-[#2563EB]" />,
  'Wrench': <Wrench className="w-6 h-6 text-[#2563EB]" />,
  'Cpu': <Cpu className="w-6 h-6 text-[#2563EB]" />
};

export default function SolutionsPage() {
  const { solutions } = useAppState();

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 font-sans">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
          Outcome-Based Solutions
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1F3A] tracking-tight">
          What Are You Trying to Achieve?
        </h1>
        <p className="text-[#475569] text-base font-normal">
          Explore business-level solutions structured around real outcomes — from launching websites to building custom SaaS platforms and modernizing software.
        </p>
      </div>

      {/* Grid of Solutions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {solutions.map((sol) => (
          <div key={sol.id} className="mnc-card-interactive p-6 flex flex-col justify-between space-y-5">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center mb-4">
                {iconMap[sol.iconName] || <Code2 className="w-6 h-6 text-[#2563EB]" />}
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                {sol.targetAudience}
              </span>

              <h3 className="text-xl font-bold text-[#0B1F3A] mb-2 leading-snug">
                {sol.title}
              </h3>

              <p className="text-xs text-[#475569] leading-relaxed font-normal mb-4">
                {sol.shortDescription}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#E2E8F0]">
                {sol.exampleTechnologies.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 rounded bg-[#F1F5F9] text-[10px] font-medium text-[#475569]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0]">
              <Link href={`/solutions/${sol.slug}`}>
                <Button variant="outline" size="sm" className="w-full justify-between" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                  Explore Solution
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
