'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, Rocket, Layers, Code2, RefreshCw, Wrench, Cpu } from 'lucide-react';
import { useAppState } from '@/lib/services/store';
import { Button } from '@/components/ui/Button';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

const iconMap: Record<string, React.ReactNode> = {
  'Globe': <Globe className="w-6 h-6 text-[#F97316]" />,
  'Rocket': <Rocket className="w-6 h-6 text-[#F97316]" />,
  'Layers': <Layers className="w-6 h-6 text-[#F97316]" />,
  'Code2': <Code2 className="w-6 h-6 text-[#F97316]" />,
  'RefreshCw': <RefreshCw className="w-6 h-6 text-[#F97316]" />,
  'Wrench': <Wrench className="w-6 h-6 text-[#F97316]" />,
  'Cpu': <Cpu className="w-6 h-6 text-[#F97316]" />
};

export default function SolutionsPage() {
  const { solutions } = useAppState();

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 font-sans">
      
      {/* Header */}
      <Reveal direction="up" distance={20}>
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
            Outcome-Based Solutions
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#111111] tracking-tight font-heading">
            What Are You Trying to Achieve?
          </h1>
          <p className="text-[#4A4A45] text-base font-normal">
            Explore business-level solutions structured around real outcomes — from launching websites to building custom SaaS platforms and modernizing software.
          </p>
        </div>
      </Reveal>

      {/* Grid of Solutions */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {solutions.map((sol) => (
          <StaggerItem key={sol.id}>
            <div className="bg-white border border-[#E5E0D5] rounded-3xl p-6 flex flex-col justify-between space-y-5 hover:border-[#F97316] hover:-translate-y-1.5 transition-all duration-200 h-full shadow-xs cursor-pointer">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFF0E6] border border-[#FFD8C2] flex items-center justify-center mb-4">
                  {iconMap[sol.iconName] || <Code2 className="w-6 h-6 text-[#F97316]" />}
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#787870] block mb-1">
                  {sol.targetAudience}
                </span>

                <h3 className="text-xl font-black text-[#111111] font-heading mb-2 leading-snug hover:text-[#F97316] transition-colors">
                  {sol.title}
                </h3>

                <p className="text-xs text-[#4A4A45] leading-relaxed font-normal mb-4">
                  {sol.shortDescription}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#E5E0D5]">
                  {sol.exampleTechnologies.map((tech) => (
                    <span key={tech} className="px-2.5 py-0.5 rounded-full bg-[#F7F3E8] border border-[#E5E0D5] text-[10px] font-semibold text-[#4A4A45]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E0D5]">
                <Link href={`/solutions/${sol.slug}`}>
                  <Button variant="outline" size="sm" className="w-full justify-between" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                    Explore Solution
                  </Button>
                </Link>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

    </div>
  );
}
