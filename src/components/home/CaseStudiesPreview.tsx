'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { INITIAL_CASE_STUDIES } from '@/lib/data/mockData';
import { Button } from '../ui/Button';

export const CaseStudiesPreview: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#FCFAF4] border-b border-[#E5E0D5] font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#F97316] block">
              Proven Project Execution
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight font-heading">
              Work That Speaks for Itself
            </h2>
            <p className="text-[#4A4A45] text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Structured software engineering engagements delivering measurable technical and operational outcomes.
            </p>
          </div>

          <Link href="/case-studies">
            <Button variant="outline" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              VIEW CASE STUDIES
            </Button>
          </Link>
        </div>

        {/* Editorial Project Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {INITIAL_CASE_STUDIES.map((cs) => (
            <div 
              key={cs.id}
              className="bg-white border border-[#E5E0D5] rounded-3xl p-8 shadow-xs hover:border-[#F97316] transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#787870]">
                  <span className="px-3 py-1 rounded-full bg-[#FFF0E6] text-[#F97316] border border-[#FFD8C2]">
                    {cs.clientIndustry}
                  </span>
                  <span>{cs.serviceTitle}</span>
                </div>

                <h3 className="text-2xl font-black text-[#111111] leading-snug font-heading">
                  {cs.title}
                </h3>
                
                <p className="text-xs text-[#4A4A45] leading-relaxed line-clamp-3">
                  {cs.challenge}
                </p>

                {/* Results Metrics */}
                <div className="grid grid-cols-3 gap-2 p-4 rounded-2xl bg-[#FCFAF4] border border-[#E5E0D5] text-center">
                  {cs.results.map((res, idx) => (
                    <div key={idx}>
                      <div className="text-base font-black text-[#F97316] font-heading">{res.metric}</div>
                      <div className="text-[10px] text-[#787870] font-bold line-clamp-1">{res.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-4 border-t border-[#E5E0D5]">
                <Link href="/case-studies" className="inline-flex items-center gap-2 text-xs font-bold text-[#111111] hover:text-[#F97316]">
                  <span>READ PROJECT DETAILS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
