'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Target, Award, ArrowRight } from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-20 font-sans">
      
      {/* Hero Header */}
      <section className="bg-white border-b border-[#E5E0D5] pt-16 pb-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <Reveal direction="up" distance={20}>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
              About MakeIT Expert Network
            </span>
            
            <h1 className="text-4xl sm:text-5xl font-black text-[#111111] tracking-tight font-heading leading-tight mt-2">
              Technology Experts for Real Business Problems
            </h1>
            
            <p className="text-base sm:text-lg text-[#4A4A45] leading-relaxed font-normal mt-3">
              From product design and web development to SaaS applications and technical consulting, we connect businesses with experienced technology specialists who turn requirements into working products.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Brand Values */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <StaggerItem>
            <div className="bg-white border border-[#E5E0D5] rounded-3xl p-8 space-y-4 hover:border-[#F97316] hover:-translate-y-1.5 transition-all duration-200 shadow-xs h-full cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0E6] text-[#F97316] border border-[#FFD8C2] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#111111] font-heading">Vetted Engineering Talent</h3>
              <p className="text-xs text-[#4A4A45] leading-relaxed font-normal">
                We verify technical experience and production codebases. Every developer, architect, and UI/UX designer on our network demonstrates real-world software delivery.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white border border-[#E5E0D5] rounded-3xl p-8 space-y-4 hover:border-[#F97316] hover:-translate-y-1.5 transition-all duration-200 shadow-xs h-full cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0E6] text-[#F97316] border border-[#FFD8C2] flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#111111] font-heading">Curated Matching</h3>
              <p className="text-xs text-[#4A4A45] leading-relaxed font-normal">
                We do not operate as an open, noisy bidding marketplace. Instead, we analyze project requirements and recommend the appropriate technology service and specialist.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white border border-[#E5E0D5] rounded-3xl p-8 space-y-4 hover:border-[#F97316] hover:-translate-y-1.5 transition-all duration-200 shadow-xs h-full cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0E6] text-[#F97316] border border-[#FFD8C2] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#111111] font-heading">End-to-End Technology Partner</h3>
              <p className="text-xs text-[#4A4A45] leading-relaxed font-normal">
                UI/UX research, full stack development, backend REST APIs, and ongoing maintenance handled through one accountable platform.
              </p>
            </div>
          </StaggerItem>

        </StaggerContainer>
      </section>

      {/* Final CTA */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="up" distance={16}>
          <div className="bg-white border border-[#E5E0D5] rounded-3xl p-10 text-center space-y-4 shadow-xs">
            <h2 className="text-3xl font-black text-[#111111] font-heading">Ready to Start Your Technology Project?</h2>
            <p className="text-[#4A4A45] text-sm max-w-xl mx-auto font-normal">Tell us what you want to build and our team will connect you with the right specialist.</p>
            <div className="pt-2">
              <Link href="/request-service">
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                  Start a Project
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
