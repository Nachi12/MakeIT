'use client';

import React from 'react';
import { ArrowRight, Search, Target, Users, Rocket } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "TELL US WHAT YOU NEED",
      description: "Tell us what you are trying to achieve — product goals, target audience, and business requirements.",
      icon: <Search className="w-5 h-5 text-[#F97316]" />
    },
    {
      num: "02",
      title: "WE UNDERSTAND THE SCOPE",
      description: "We analyze the technical architecture, database scope, and required software engineering capabilities.",
      icon: <Target className="w-5 h-5 text-[#F97316]" />
    },
    {
      num: "03",
      title: "WE BRING THE RIGHT EXPERTISE",
      description: "We connect you with the right vetted specialist or cross-functional engineering team.",
      icon: <Users className="w-5 h-5 text-[#F97316]" />
    },
    {
      num: "04",
      title: "WE BUILD & DELIVER",
      description: "Structured milestone execution: plan, build, review, and launch with ongoing technical warranty.",
      icon: <Rocket className="w-5 h-5 text-[#F97316]" />
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#F7F3E8] border-b border-[#E5E0D5] font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs font-black uppercase tracking-wider text-[#F97316] block">
            Structured Engagement Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight font-heading">
            From Idea to Delivery
          </h2>
          <p className="text-[#4A4A45] text-base sm:text-lg font-normal leading-relaxed">
            A clear, transparent framework designed for business clarity, accountability, and predictable software delivery.
          </p>
        </div>

        {/* 4 Steps Horizontal Process Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div 
              key={step.num}
              className="bg-white border border-[#E5E0D5] rounded-3xl p-8 space-y-6 hover:border-[#F97316] transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-black text-[#F97316] font-heading">{step.num}</span>
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF0E6] flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-lg font-black text-[#111111] font-heading leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-[#4A4A45] leading-relaxed">
                  {step.description}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 text-[#E5E0D5]">
                  <ArrowRight className="w-4 h-4 text-[#787870]" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
