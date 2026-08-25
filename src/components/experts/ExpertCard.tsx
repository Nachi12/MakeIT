'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { Expert } from '@/types';
import { RatingStars } from '../ui/RatingStars';
import { Button } from '../ui/Button';

interface ExpertCardProps {
  expert: Expert;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({ expert }) => {
  return (
    <div className="mnc-card-interactive p-6 flex flex-col justify-between h-full font-sans">
      
      <div>
        {/* Top Header: Portrait Photo & Identity */}
        <div className="flex items-center gap-4 mb-4">
          <img 
            src={expert.avatar} 
            alt={expert.name}
            className="w-16 h-16 rounded-xl object-cover border border-[#E2E8F0] shadow-xs" 
          />

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-bold text-[#0B1F3A]">
                {expert.name}
              </h3>
              {expert.verified && (
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              )}
            </div>
            <p className="text-xs font-semibold text-[#2563EB] mt-0.5">{expert.title}</p>
            <p className="text-xs text-[#64748B] flex items-center gap-1 mt-1 font-medium">
              <MapPin className="w-3 h-3 text-[#94A3B8]" />
              <span>{expert.location}</span>
            </p>
          </div>
        </div>

        {/* Short Professional Intro */}
        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-2 mb-4 font-normal">
          {expert.shortIntro}
        </p>

        {/* 3 Core Relevant Skills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {expert.skills.slice(0, 3).map((skill) => (
            <span 
              key={skill}
              className="px-2.5 py-1 rounded bg-[#EFF6FF] text-xs font-medium text-[#2563EB]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Metrics & View Profile CTA */}
      <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#0B1F3A] block">
            {expert.yearsOfExperience}+ Years Exp.
          </span>
          <div className="mt-0.5">
            <RatingStars rating={expert.rating} size="sm" showNumber={true} />
          </div>
        </div>

        <Link href={`/experts/${expert.slug}`}>
          <Button variant="primary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />} iconPosition="right">
            View Profile
          </Button>
        </Link>
      </div>

    </div>
  );
};

