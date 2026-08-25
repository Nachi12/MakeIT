'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { INITIAL_CASE_STUDIES, INITIAL_EXPERTS } from '@/lib/data/mockData';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, ArrowRight, Quote } from 'lucide-react';

export default function CaseStudyDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const cs = INITIAL_CASE_STUDIES.find(c => c.slug === slug || c.id === slug);

  if (!cs) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4 font-sans">
        <h1 className="text-3xl font-bold text-[#0B1F3A]">Case Study Not Found</h1>
        <Link href="/case-studies">
          <Button variant="primary" size="md">Back to Case Studies</Button>
        </Link>
      </div>
    );
  }

  const expert = INITIAL_EXPERTS.find(e => e.id === cs.expertId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-12 font-sans">
      
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <Badge variant="blue" size="md">{cs.clientIndustry}</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1F3A] tracking-tight leading-tight">{cs.title}</h1>
        <p className="text-xs text-[#64748B] font-medium">Client: {cs.clientName} • Service: {cs.serviceTitle}</p>
      </div>

      <img src={cs.image} alt={cs.title} className="w-full h-80 object-cover rounded-2xl border border-[#E2E8F0] shadow-sm" />

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cs.results.map((res, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-[#E2E8F0] text-center space-y-1 shadow-xs">
            <div className="text-3xl font-extrabold text-[#2563EB]">{res.metric}</div>
            <div className="text-xs font-semibold text-[#64748B]">{res.label}</div>
          </div>
        ))}
      </div>

      {/* Challenge & Solution */}
      <div className="mnc-card p-8 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-[#0B1F3A] mb-2">The Challenge</h2>
          <p className="text-sm text-[#475569] leading-relaxed font-normal">{cs.challenge}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#0B1F3A] mb-2">The Solution</h2>
          <p className="text-sm text-[#475569] leading-relaxed font-normal">{cs.solution}</p>
        </div>

        {/* Process steps */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#0B1F3A]">Execution Process</h3>
          {cs.processSteps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs text-[#475569] font-normal">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
              <span>{typeof step === 'string' ? step : (step as any).description}</span>
            </div>
          ))}
        </div>

        {/* Testimonial Quote */}
        <div className="p-6 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
          <Quote className="w-6 h-6 text-[#2563EB]" />
          <p className="text-sm text-[#334155] italic font-normal">&quot;{cs.testimonial.quote}&quot;</p>
          <div className="text-xs text-[#0B1F3A] font-bold">— {cs.testimonial.author}, {cs.testimonial.title}</div>
        </div>
      </div>

      {/* Expert Box */}
      {expert && (
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={expert.avatar} alt={expert.name} className="w-14 h-14 rounded-xl object-cover border border-[#E2E8F0]" />
            <div>
              <h4 className="text-base font-bold text-[#0B1F3A]">{expert.name}</h4>
              <p className="text-xs text-[#2563EB] font-semibold">{expert.title}</p>
            </div>
          </div>

          <Link href={`/experts/${expert.slug}`}>
            <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              Request This Expert
            </Button>
          </Link>
        </div>
      )}

    </div>
  );
}
