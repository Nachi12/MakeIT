'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, UserCheck } from 'lucide-react';
import { useAppState } from '@/lib/services/store';
import { Button } from '../ui/Button';

export const FeaturedExpertsSection: React.FC = () => {
  const { experts } = useAppState();

  return (
    <section className="py-20 lg:py-28 bg-[#FCFAF4] border-b border-[#E5E0D5] font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] block">
              SENIOR PRACTITIONERS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight font-heading">
              Meet the People Behind the Work
            </h2>
            <p className="text-[#4A4A45] text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Senior software architects, product designers, and full-stack engineers who turn requirements into working digital products.
            </p>
          </div>

          <Link href="/experts">
            <Button variant="outline" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              VIEW EXPERT DIRECTORY
            </Button>
          </Link>
        </div>

        {/* Editorial Profile Roster (Professional & Clean — No Marketplace Badges/Ratings) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experts.slice(0, 6).map((expert) => (
            <div 
              key={expert.id} 
              className="bg-white border border-[#E5E0D5] rounded-3xl p-7 shadow-xs hover:border-[#F97316] transition-all space-y-6 flex flex-col justify-between"
            >
              
              <div className="space-y-5">
                {/* Header: Photo, Name, Role */}
                <div className="flex items-center gap-4">
                  <img 
                    src={expert.avatar} 
                    alt={expert.name} 
                    className="w-16 h-16 rounded-2xl object-cover border border-[#E5E0D5]" 
                  />
                  <div>
                    <h3 className="text-xl font-black text-[#111111] font-heading">{expert.name}</h3>
                    <p className="text-xs font-bold text-[#F97316] mt-0.5">{expert.title}</p>
                    <span className="text-[11px] text-[#787870] font-medium block mt-1">
                      {expert.yearsOfExperience} yrs experience • {expert.location.split('(')[0]}
                    </span>
                  </div>
                </div>

                {/* Specialization / Short Intro */}
                <p className="text-xs text-[#4A4A45] leading-relaxed line-clamp-3">
                  "{expert.shortIntro}"
                </p>

                {/* Relevant Technologies */}
                <div className="space-y-2 pt-2 border-t border-[#E5E0D5]">
                  <span className="text-[10px] font-bold text-[#787870] uppercase tracking-wider block">Specializations:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {expert.skills.slice(0, 4).map(skill => (
                      <span key={skill} className="px-2.5 py-1 rounded-full bg-[#F7F3E8] text-[11px] font-semibold text-[#111111] border border-[#E5E0D5]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-3 border-t border-[#E5E0D5]">
                <Link 
                  href={`/start-project?expertId=${expert.id}`}
                  className="w-full inline-flex items-center justify-between text-xs font-bold text-[#111111] hover:text-[#F97316] transition-colors"
                >
                  <span>Discuss Project with {expert.name.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
