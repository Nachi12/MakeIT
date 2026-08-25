'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, MessageSquare, Compass, Cpu, Users, Rocket } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Reveal, StaggerContainer, StaggerItem } from '../ui/Motion';

export const RequirementToExpertiseSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const progressLineScale = useTransform(scrollYProgress, [0.2, 0.7], [0, 1]);
  const animate = mounted && !shouldReduceMotion;

  const steps = [
    {
      num: "01",
      title: "You Tell Us What You Need",
      desc: "Share your product goals, feature requirements, or project specification.",
      icon: <MessageSquare className="w-5 h-5 text-[#F97316]" />
    },
    {
      num: "02",
      title: "We Understand the Business Requirement",
      desc: "We analyze your business context, user workflows, target scale, and deadlines.",
      icon: <Compass className="w-5 h-5 text-[#F97316]" />
    },
    {
      num: "03",
      title: "We Map the Capabilities Required",
      desc: "We define the exact engineering disciplines required (e.g. Next.js, Node.js API, UI/UX).",
      icon: <Cpu className="w-5 h-5 text-[#F97316]" />
    },
    {
      num: "04",
      title: "We Identify the Relevant Expertise",
      desc: "We match senior specialists from our network with verified track records in your tech stack.",
      icon: <Users className="w-5 h-5 text-[#F97316]" />
    },
    {
      num: "05",
      title: "We Assemble the Right Delivery Approach",
      desc: "We structure the project milestones, deliverables, and transparent warranty safeguards.",
      icon: <Rocket className="w-5 h-5 text-[#F97316]" />
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-[#F7F3E8] border-b border-[#E5E0D5] font-sans relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <Reveal direction="up" distance={20}>
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] block">
              THE MAKEIT DIFFERENTIATOR
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-[#111111] tracking-tight font-heading leading-tight">
              From Requirement to the <span className="text-[#F97316]">Right Expertise.</span>
            </h2>
            <p className="text-[#4A4A45] text-base sm:text-lg font-normal leading-relaxed">
              MakeIT is not a generic developer marketplace. We act as your engineering filter, ensuring your requirement is translated into the exact technical capabilities and senior practitioners needed.
            </p>
          </div>
        </Reveal>

        {/* 5-Step Editorial Process Timeline */}
        <div className="relative">
          {/* Subtle scroll progress line behind cards */}
          <div className="hidden md:block absolute top-1/2 left-6 right-6 h-[2px] bg-[#E5E0D5] -translate-y-1/2 z-0">
            <motion.div 
              style={animate ? { scaleX: progressLineScale } : undefined}
              className="h-full bg-gradient-to-r from-[#F97316]/40 via-[#F97316] to-[#EA580C] origin-left"
            />
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
          {steps.map((step, idx) => (
            <StaggerItem key={step.num}>
              <div 
                className="bg-white border border-[#E5E0D5] rounded-3xl p-6 space-y-5 hover:border-[#F97316] hover:-translate-y-2 transition-all duration-200 shadow-xs flex flex-col justify-between h-full cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-[#F97316] font-heading group-hover:scale-105 transition-transform duration-200">{step.num}</span>
                    <div className="w-9 h-9 rounded-xl bg-[#FFF0E6] flex items-center justify-center group-hover:bg-[#FFD8C2] transition-colors">
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-base font-black text-[#111111] font-heading leading-snug group-hover:text-[#F97316] transition-colors">
                    {step.title}
                  </h3>
                  
                  <p className="text-xs text-[#4A4A45] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden md:block text-[#E5E0D5] pt-2">
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                      <ArrowRight className="w-4 h-4 text-[#787870] group-hover:text-[#F97316]" />
                    </span>
                  </div>
                )}
              </div>
            </StaggerItem>
          ))}
          </StaggerContainer>
        </div>

        {/* Signature Quality Assurance Callout */}
        <Reveal direction="up" distance={16}>
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="text-base font-black text-[#111111] font-heading flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#F97316]" />
                Structured Milestone Execution & Warranty
              </div>
              <p className="text-xs text-[#4A4A45]">
                Every engagement follows structured sprint milestones with source code handoff and post-launch technical warranty.
              </p>
            </div>
            
            <div className="shrink-0">
              <span className="px-4 py-2 rounded-full bg-[#FFF0E6] text-[#F97316] text-xs font-bold border border-[#FFD8C2]">
                100% TRANSPARENT SCOPE
              </span>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
};
