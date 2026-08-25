import React from 'react';
import Link from 'next/link';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { Button } from '@/components/ui/Button';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="space-y-16 pb-20 font-sans">
      
      {/* Hero Header */}
      <section className="bg-white border-b border-[#E2E8F0] pt-16 pb-12 text-center max-w-[1280px] mx-auto px-4 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-semibold text-[#2563EB]">
          <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
          <span>Verified Technology Delivery Process</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B1F3A] tracking-tight">
          How the <span className="text-[#2563EB]">MakeIT Platform Works</span>
        </h1>
        <p className="text-base sm:text-lg text-[#475569] max-w-2xl mx-auto font-normal">
          Discover how our requirement matching engine, technical review standards, and milestone protection eliminate software development risk.
        </p>
      </section>

      <HowItWorksSection />

      {/* 4-Pillar Quality Guarantee */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mnc-card p-8 sm:p-12 space-y-8 border-[#2563EB]">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              Platform Quality Commitment
            </span>
            <h2 className="text-3xl font-extrabold text-[#0B1F3A]">Our 4-Pillar Quality Guarantee</h2>
            <p className="text-[#475569] text-sm font-normal">Every software engineering engagement on MakeIT is protected by strict technical standards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#2563EB]" />
              <h3 className="text-base font-bold text-[#0B1F3A]">Engineering Verification</h3>
              <p className="text-xs text-[#475569] leading-relaxed">Software developers and architects demonstrate real-world production codebases and technical certifications.</p>
            </div>

            <div className="p-6 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <CheckCircle2 className="w-6 h-6 text-[#2563EB]" />
              <h3 className="text-base font-bold text-[#0B1F3A]">Curated Matching</h3>
              <p className="text-xs text-[#475569] leading-relaxed">No open bidding spam. We analyze your tech stack needs and connect you directly with qualified specialists.</p>
            </div>

            <div className="p-6 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#2563EB]" />
              <h3 className="text-base font-bold text-[#0B1F3A]">Milestone Protection</h3>
              <p className="text-xs text-[#475569] leading-relaxed">Funds are tied to agreed deliverable milestones and released only upon your explicit approval.</p>
            </div>

            <div className="p-6 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <CheckCircle2 className="w-6 h-6 text-[#2563EB]" />
              <h3 className="text-base font-bold text-[#0B1F3A]">Post-Launch Support</h3>
              <p className="text-xs text-[#475569] leading-relaxed">Every web application and MVP project includes 30 days of post-delivery warranty support.</p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link href="/request-service">
              <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                Start Your Requirement Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
