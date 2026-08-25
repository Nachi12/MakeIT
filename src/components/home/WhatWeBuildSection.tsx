'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Layout, Code2, Compass } from 'lucide-react';
import { Button } from '../ui/Button';

export const WhatWeBuildSection: React.FC = () => {
  const servicePillars = [
    {
      number: '01',
      title: 'PRODUCT DESIGN',
      subtitle: 'Design products people understand and enjoy using.',
      icon: <Layout className="w-5 h-5 text-[#F97316]" />,
      skills: ['UI/UX Design', 'Product Strategy', 'Design Systems', 'Interactive Prototyping'],
      href: '/services/ui-ux-design'
    },
    {
      number: '02',
      title: 'SOFTWARE ENGINEERING',
      subtitle: 'Build reliable digital products and web applications.',
      icon: <Code2 className="w-5 h-5 text-[#F97316]" />,
      skills: ['Full Stack', 'React & Next.js', 'Node.js & Backend APIs', 'SaaS MVPs', 'PHP & Laravel', 'Website Redesign'],
      href: '/services/full-stack-development'
    },
    {
      number: '03',
      title: 'TECHNOLOGY CONSULTING',
      subtitle: 'Make better technical decisions with experienced specialists.',
      icon: <Compass className="w-5 h-5 text-[#F97316]" />,
      skills: ['Architecture Review', 'Code Modernization', 'Performance & Security Audits', 'Technical Strategy'],
      href: '/services/technical-consulting'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#F7F3E8] border-b border-[#E5E0D5] font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] block">
              CORE CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight font-heading">
              What We Build
            </h2>
            <p className="text-[#4A4A45] text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Structured engineering and design capabilities delivered by senior practitioners.
            </p>
          </div>

          <Link href="/services">
            <Button variant="outline" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              EXPLORE ALL SERVICES
            </Button>
          </Link>
        </div>

        {/* Editorial Service Rows (No Giant Cards!) */}
        <div className="divide-y divide-[#E5E0D5] border-t border-b border-[#E5E0D5]">
          {servicePillars.map((pillar) => (
            <div 
              key={pillar.number} 
              className="py-10 px-2 sm:px-4 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:bg-[#FCFAF4] transition-all group rounded-2xl"
            >
              {/* Left Number & Title */}
              <div className="flex items-start gap-6 lg:w-5/12">
                <span className="text-4xl sm:text-5xl font-black text-[#F97316] font-heading shrink-0">
                  {pillar.number}
                </span>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl sm:text-3xl font-black text-[#111111] font-heading group-hover:text-[#F97316] transition-colors">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[#4A4A45] leading-relaxed">
                    {pillar.subtitle}
                  </p>
                </div>
              </div>

              {/* Middle Capabilities List */}
              <div className="lg:w-5/12 flex flex-wrap gap-2">
                {pillar.skills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1.5 rounded-full bg-white border border-[#E5E0D5] text-xs font-semibold text-[#111111]"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Right Action */}
              <div className="lg:w-2/12 flex justify-end">
                <Link 
                  href={pillar.href} 
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#111111] group-hover:text-[#F97316] transition-colors"
                >
                  <span>EXPLORE</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
