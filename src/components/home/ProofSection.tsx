'use client';

import React from 'react';
import { Layout, Code2, Compass, Clock } from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem } from '../ui/Motion';

export const ProofSection: React.FC = () => {
  const expertiseAreas = [
    {
      category: "PRODUCT DESIGN",
      skills: "UI/UX, Systems, Wireframes",
      icon: <Layout className="w-4 h-4 text-[#F97316]" />
    },
    {
      category: "SOFTWARE ENGINEERING",
      skills: "Full Stack, React, SaaS, Node.js",
      icon: <Code2 className="w-4 h-4 text-[#F97316]" />
    },
    {
      category: "TECHNOLOGY CONSULTING",
      skills: "Architecture, Modernization, Audits",
      icon: <Compass className="w-4 h-4 text-[#F97316]" />
    }
  ];

  const engagementModels = [
    { label: "Project-Based", detail: "Defined Scope & Milestones" },
    { label: "Dedicated Specialist", detail: "Senior Technical Lead" },
    { label: "Delivery Team", detail: "Cross-Functional Pod" }
  ];

  return (
    <section className="bg-[#FCFAF4] py-10 border-b border-[#E5E0D5] font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Real Expertise */}
          <div className="lg:col-span-7 space-y-3">
            <Reveal direction="up" distance={12}>
              <div className="text-[11px] font-black uppercase tracking-wider text-[#787870] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]"></span>
                <span>CORE TECHNICAL CAPABILITIES</span>
              </div>
            </Reveal>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {expertiseAreas.map((item) => (
                <StaggerItem key={item.category}>
                  <div className="p-3.5 rounded-2xl bg-white border border-[#E5E0D5] space-y-1 hover:border-[#F97316] hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="text-xs font-bold text-[#111111] font-heading">{item.category}</span>
                    </div>
                    <p className="text-[11px] text-[#4A4A45] font-medium leading-tight">{item.skills}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Right Column: Flexible Engagement Models */}
          <div className="lg:col-span-5 space-y-3 border-t lg:border-t-0 lg:border-l border-[#E5E0D5] pt-6 lg:pt-0 lg:pl-8">
            <Reveal direction="up" distance={12}>
              <div className="text-[11px] font-black uppercase tracking-wider text-[#787870] flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#F97316]" />
                <span>FLEXIBLE ENGAGEMENT MODELS</span>
              </div>
            </Reveal>

            <StaggerContainer className="grid grid-cols-3 gap-2">
              {engagementModels.map((eng) => (
                <StaggerItem key={eng.label}>
                  <div className="p-3 rounded-2xl bg-white border border-[#E5E0D5] text-center hover:border-[#F97316] hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                    <div className="text-xs font-extrabold text-[#111111]">{eng.label}</div>
                    <div className="text-[10px] text-[#787870] font-medium mt-0.5">{eng.detail}</div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

        </div>

      </div>
    </section>
  );
};
