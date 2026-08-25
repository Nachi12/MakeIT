'use client';

import React from 'react';
import { UserCheck, Target, Clock, Layers } from 'lucide-react';

export const WhyMakeITSection: React.FC = () => {
  const benefits = [
    {
      num: '01',
      title: 'Curated Technology Experts',
      description: 'Work with vetted software engineers, architects, and UI/UX designers selected for verified engineering skills.'
    },
    {
      num: '02',
      title: 'Business-First Thinking',
      description: 'We analyze your exact product requirements and match them with relevant frontend, backend, and database expertise.'
    },
    {
      num: '03',
      title: 'Flexible Engagement',
      description: 'Get help for a single MVP milestone, specific feature sprint, or ongoing monthly software development.'
    },
    {
      num: '04',
      title: 'Structured Delivery',
      description: 'UI/UX product design, web app development, backend APIs, and technical support handled under one roof.'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#FCFAF4] border-b border-[#E5E0D5] font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-xs font-black uppercase tracking-wider text-[#F97316] block">
            Why Businesses Choose MakeIT
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-[#111111] tracking-tight font-heading leading-tight">
            Not just developers.<br />
            <span className="text-[#F97316]">The right people for the problem.</span>
          </h2>
          <p className="text-[#4A4A45] text-base sm:text-lg font-normal leading-relaxed">
            Avoid the overhead of interviewing and managing freelance marketplaces. Get reliable software development delivered by specialists.
          </p>
        </div>

        {/* Editorial 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((item) => (
            <div key={item.num} className="bg-white border border-[#E5E0D5] rounded-3xl p-8 space-y-4 hover:border-[#F97316] transition-all">
              <span className="text-3xl font-black text-[#F97316] font-heading">{item.num}</span>
              <h3 className="text-xl font-black text-[#111111] font-heading">{item.title}</h3>
              <p className="text-xs text-[#4A4A45] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
