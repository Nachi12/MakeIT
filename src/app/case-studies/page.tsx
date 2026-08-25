import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { INITIAL_CASE_STUDIES } from '@/lib/data/mockData';
import { Button } from '@/components/ui/Button';

export default function CaseStudiesPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 font-sans">
      
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
          Proven Outcomes
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1F3A] tracking-tight">
          Work That Solves Real Problems
        </h1>
        <p className="text-[#475569] text-base font-normal">
          Structured client engagements delivering measurable operational, technical, and commercial results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {INITIAL_CASE_STUDIES.map((cs) => (
          <div key={cs.id} className="mnc-card-interactive p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] mb-3">
                <span className="px-2.5 py-1 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                  {cs.clientIndustry}
                </span>
                <span>{cs.serviceTitle}</span>
              </div>

              <h3 className="text-xl font-bold text-[#0B1F3A] mb-3 leading-snug">
                {cs.title}
              </h3>
              
              <p className="text-xs text-[#475569] leading-relaxed line-clamp-3 mb-6 font-normal">
                {cs.challenge}
              </p>

              {/* Results Bar */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-center mb-6">
                {cs.results.map((res, idx) => (
                  <div key={idx}>
                    <div className="text-base font-extrabold text-[#0B1F3A]">{res.metric}</div>
                    <div className="text-[10px] text-[#64748B] font-medium line-clamp-1">{res.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0]">
              <Link href={`/case-studies/${cs.slug}`}>
                <Button variant="outline" size="sm" className="w-full justify-between" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                  Read Case Details
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

