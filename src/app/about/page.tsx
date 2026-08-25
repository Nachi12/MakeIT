import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Target, Award, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-20 font-sans">
      
      {/* Hero Header */}
      <section className="bg-white border-b border-[#E2E8F0] pt-16 pb-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
            About MakeIT Expert Network
          </span>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1F3A] tracking-tight leading-tight">
            Technology Experts for Real Business Problems
          </h1>
          
          <p className="text-base sm:text-lg text-[#475569] leading-relaxed font-normal">
            From product design and web development to SaaS applications and technical consulting, we connect businesses with experienced technology specialists who turn requirements into working products.
          </p>
        </div>
      </section>

      {/* Brand Values */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="mnc-card p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0B1F3A]">Vetted Engineering Talent</h3>
            <p className="text-xs text-[#475569] leading-relaxed font-normal">
              We verify technical experience and production codebases. Every developer, architect, and UI/UX designer on our network demonstrates real-world software delivery.
            </p>
          </div>

          <div className="mnc-card p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0B1F3A]">Curated Matching</h3>
            <p className="text-xs text-[#475569] leading-relaxed font-normal">
              We do not operate as an open, noisy bidding marketplace. Instead, we analyze project requirements and recommend the appropriate technology service and specialist.
            </p>
          </div>

          <div className="mnc-card p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0B1F3A]">End-to-End Technology Partner</h3>
            <p className="text-xs text-[#475569] leading-relaxed font-normal">
              UI/UX research, full stack development, backend REST APIs, and ongoing maintenance handled through one accountable platform.
            </p>
          </div>

        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mnc-card p-10 text-center space-y-4 border-[#2563EB]">
          <h2 className="text-3xl font-extrabold text-[#0B1F3A]">Ready to Start Your Technology Project?</h2>
          <p className="text-[#475569] text-sm max-w-xl mx-auto font-normal">Tell us what you want to build and our team will connect you with the right specialist.</p>
          <div className="pt-2">
            <Link href="/request-service">
              <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                Start a Project
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
