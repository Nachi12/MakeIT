'use client';

import React from 'react';
import { Quote } from 'lucide-react';
import { INITIAL_TESTIMONIALS } from '@/lib/data/mockData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#F7F3E8] border-b border-[#E5E0D5] font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#F97316]">
            Client Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight font-heading">
            Trusted by Business Owners & Founders
          </h2>
          <p className="text-[#4A4A45] text-base sm:text-lg font-normal leading-relaxed">
            Direct observations from organizations and buyers who built digital products through MakeIT.
          </p>
        </div>

        {/* Editorial Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_TESTIMONIALS.map((t) => (
            <div 
              key={t.id}
              className="bg-white border border-[#E5E0D5] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6 hover:border-[#F97316] transition-all"
            >
              <div>
                <Quote className="w-8 h-8 text-[#F97316] mb-4 opacity-60" />
                <p className="text-xs text-[#4A4A45] leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Details */}
              <div className="pt-4 border-t border-[#E5E0D5] flex items-center gap-3">
                <img 
                  src={t.avatar} 
                  alt={t.author}
                  className="w-10 h-10 rounded-full object-cover border border-[#E5E0D5]" 
                />
                <div>
                  <h4 className="text-xs font-bold text-[#111111]">{t.author}</h4>
                  <p className="text-[11px] text-[#787870] font-medium">{t.role}, {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
