import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { ProofSection } from '@/components/home/ProofSection';
import { SelectedWorkSection } from '@/components/home/SelectedWorkSection';
import { WhatWeBuildSection } from '@/components/home/WhatWeBuildSection';
import { SolutionsSection } from '@/components/home/SolutionsSection';
import { RequirementToExpertiseSection } from '@/components/home/RequirementToExpertiseSection';
import { FeaturedExpertsSection } from '@/components/home/FeaturedExpertsSection';
import { TechStackSection } from '@/components/home/TechStackSection';
import { TrustSection } from '@/components/home/TrustSection';
import { FinalCTASection } from '@/components/home/FinalCTASection';

export default function HomePage() {
  return (
    <div className="space-y-0 font-sans">
      {/* 02 HERO & 03 REQUIREMENT MATCHER */}
      <HeroSection />

      {/* 04 CREDIBILITY / PROOF */}
      <ProofSection />

      {/* 05 SELECTED WORK (MOVED EARLIER) */}
      <SelectedWorkSection />

      {/* 06 WHAT WE BUILD */}
      <WhatWeBuildSection />

      {/* 07 WHAT ARE YOU TRYING TO BUILD? */}
      <SolutionsSection />

      {/* 08 FROM REQUIREMENT TO THE RIGHT EXPERTISE (SIGNATURE DIFFERENTIATOR) */}
      <RequirementToExpertiseSection />

      {/* 09 MEET THE PEOPLE BEHIND THE WORK */}
      <FeaturedExpertsSection />

      {/* 10 TECHNOLOGY */}
      <TechStackSection />

      {/* 11 TRUST / EVIDENCE */}
      <TrustSection />

      {/* 12 FINAL CTA */}
      <FinalCTASection />
    </div>
  );
}
