'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Motion';

export const FinalCTASection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#111827] text-white font-sans overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <Reveal direction="up" distance={24}>
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF0E6] text-[#F97316] text-xs font-bold tracking-wide">
                START YOUR ENGAGEMENT
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-heading leading-tight">
                Have Something to Build?
              </h2>
              <p className="text-base sm:text-lg text-[#D1D5DB] max-w-xl mx-auto font-normal leading-relaxed">
                Tell us what you're trying to achieve. We'll map your business requirement to the right technology capabilities and senior specialists.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/start-project">
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5 text-white" />}>
                  START A PROJECT
                </Button>
              </Link>
              <Link href="/services">
                <button 
                  className="px-7 py-3.5 text-base font-bold rounded-full bg-transparent text-white border border-[#374151] hover:bg-[#1F2937] active:scale-[0.98] transition-all duration-150 cursor-pointer"
                >
                  EXPLORE SERVICES
                </button>
              </Link>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
};
