'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { INITIAL_CASE_STUDIES } from '@/lib/data/mockData';
import { Button } from '@/components/ui/Button';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

export default function CaseStudiesPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 font-sans">
      
      <Reveal direction="up" distance={20}>
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
            Proven Outcomes
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#111111] tracking-tight font-heading">
            Work That Solves Real Problems
          </h1>
          <p className="text-[#4A4A45] text-base font-normal">
            Structured client engagements delivering measurable operational, technical, and commercial results.
          </p>
        </div>
      </Reveal>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {INITIAL_CASE_STUDIES.map((cs) => (
          <StaggerItem key={cs.id}>
            <div className="bg-white border border-[#E5E0D5] rounded-3xl p-6 flex flex-col justify-between hover:border-[#F97316] hover:-translate-y-1.5 transition-all duration-200 h-full shadow-xs cursor-pointer">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#787870] mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-[#FFF0E6] text-[#F97316] font-bold border border-[#FFD8C2]">
                    {cs.clientIndustry}
                  </span>
                  <span>{cs.serviceTitle}</span>
                </div>

                <h3 className="text-xl font-black text-[#111111] font-heading mb-3 leading-snug hover:text-[#F97316] transition-colors">
                  {cs.title}
                </h3>
                
                <p className="text-xs text-[#4A4A45] leading-relaxed line-clamp-3 mb-6 font-normal">
                  {cs.challenge}
                </p>

                {/* Results Bar */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#FCFAF4] border border-[#E5E0D5] text-center mb-6">
                  {cs.results.map((res, idx) => (
                    <div key={idx}>
                      <div className="text-base font-black text-[#F97316] font-heading">{res.metric}</div>
                      <div className="text-[10px] text-[#787870] font-medium line-clamp-1">{res.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E0D5]">
                <Link href={`/case-studies/${cs.slug}`}>
                  <Button variant="outline" size="sm" className="w-full justify-between" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                    Read Case Details
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

