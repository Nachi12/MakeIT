'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { INITIAL_FAQS } from '@/lib/data/mockData';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  return (
    <section className="py-20 bg-white border-b border-[#E2E8F0] font-sans">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
            Clear Answers & Guidance
          </h2>
          <p className="text-[#475569] text-base font-normal">
            Learn more about matching logic, specialist verification, and engagement terms.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {INITIAL_FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div 
                key={faq.id}
                className="mnc-card overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-base font-bold text-[#0B1F3A] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 shrink-0 text-[#64748B] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#2563EB]' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-[#475569] leading-relaxed border-t border-[#E2E8F0] pt-4 animate-in fade-in duration-150 font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

