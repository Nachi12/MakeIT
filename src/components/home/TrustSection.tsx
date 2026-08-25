'use client';

import React from 'react';
import { ShieldCheck, Award, Clock, Users, FileText, CheckCircle2 } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const trustPillars = [
    {
      icon: <FileText className="w-5 h-5 text-[#F97316]" />,
      title: "Transparent Process & Scope",
      desc: "Every milestone, deliverable, and specification is defined before engineering begins."
    },
    {
      icon: <Users className="w-5 h-5 text-[#F97316]" />,
      title: "Vetted Senior Specialists",
      desc: "Direct access to software engineers and designers with 6+ years of verified industry experience."
    },
    {
      icon: <Clock className="w-5 h-5 text-[#F97316]" />,
      title: "Structured Delivery Cycles",
      desc: "Predictable 2–4 week sprint cycles with regular progress reviews and code check-ins."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#F97316]" />,
      title: "Post-Launch Code Warranty",
      desc: "30-day post-delivery support for bug fixes, code handoff, and infrastructure deployment."
    }
  ];

  return (
    <section className="bg-[#FCFAF4] py-16 border-b border-[#E5E0D5] font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
            COMMERCIAL CREDIBILITY & SAFEGUARDS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight font-heading">
            Built for Transparency and Trust
          </h2>
          <p className="text-sm text-[#4A4A45]">
            Clear scope, senior practitioners, and structured engineering accountability.
          </p>
        </div>

        {/* 4 Trust Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPillars.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-[#E5E0D5] space-y-4 hover:border-[#F97316] transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF0E6] flex items-center justify-center">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#111111] font-heading">{item.title}</h3>
                <p className="text-xs text-[#4A4A45] leading-relaxed font-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
