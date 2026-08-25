'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, CheckCircle2, ArrowDown } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion, Variants } from 'framer-motion';
import { parseRequirementText, rankExpertsForRequirement } from '@/lib/services/matchingEngine';
import { useAppState } from '@/lib/services/store';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const { experts, submitRequirement } = useAppState();
  const [query, setQuery] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [matchResultModalOpen, setMatchResultModalOpen] = useState(false);
  const [activeResult, setActiveResult] = useState<ReturnType<typeof rankExpertsForRequirement> | null>(null);
  const [parsedState, setParsedState] = useState<ReturnType<typeof parseRequirementText> | null>(null);

  const shouldReduceMotion = useReducedMotion();

  // Hydration safety: defer animation props until after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const animate = mounted && !shouldReduceMotion;

  // Scroll parallax logic for right side artwork
  const { scrollY } = useScroll();
  const visualParallaxY = useTransform(scrollY, [0, 400], [0, -18]);
  const bgBadgeParallaxY = useTransform(scrollY, [0, 400], [0, -32]);

  // Strictly 4 clean example requirements as specified
  const exampleRequirements = [
    "Build a multi-tenant SaaS platform",
    "Redesign product UX and design system",
    "Develop custom web application MVP",
    "Audit & modernize legacy web backend"
  ];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsMatching(true);
    const parsed = parseRequirementText(query);
    setParsedState(parsed);

    setTimeout(() => {
      const ranked = rankExpertsForRequirement(parsed, experts);
      setActiveResult(ranked);
      setIsMatching(false);
      setMatchResultModalOpen(true);
    }, 350);
  };

  const handleExampleClick = (term: string) => {
    setQuery(term);
    const parsed = parseRequirementText(term);
    setParsedState(parsed);
  };

  const liveParsed = query.trim() ? parseRequirementText(query) : null;

  // Staggered entry animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="bg-[#F7F3E8] border-b border-[#E5E0D5] pt-12 pb-20 lg:pt-20 lg:pb-28 font-sans overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetric 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column (7 cols): Editorial Headline & Central Requirement Input */}
          <motion.div 
            className="lg:col-span-7 space-y-9"
            variants={animate ? containerVariants : undefined}
            initial={animate ? "hidden" : undefined}
            animate={animate ? "visible" : undefined}
          >
            
            {/* Eyebrow */}
            <motion.div variants={animate ? itemVariants : undefined}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF0E6] border border-[#FFD8C2] text-[#111111] text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#F97316]"></span>
                <span>MAKEIT — EXPERT TECHNOLOGY NETWORK</span>
              </div>
            </motion.div>

            {/* Main Editorial Headline */}
            <motion.div variants={animate ? itemVariants : undefined} className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111111] tracking-tight leading-[1.08] font-heading">
                You Have the Idea.<br />
                <span className="text-[#F97316]">We Have the Expertise</span><br />
                <span className="font-serif-editorial font-normal">to Build It.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#4A4A45] leading-relaxed max-w-2xl font-normal">
                MakeIT helps you define your business requirements, maps the technical capabilities needed, and connects you directly with the right senior software specialists to deliver your project.
              </p>
            </motion.div>

            {/* Hero Requirement Input (Central Product Interaction) */}
            <motion.div variants={animate ? itemVariants : undefined} className="space-y-4 pt-1">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#111111] block">
                  What are you trying to build?
                </label>
                
                <form onSubmit={handleSearchSubmit} className="editorial-input-surface p-2.5 bg-white">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex items-center gap-3 flex-1 px-3 py-2 w-full">
                      <Search className="w-5 h-5 text-[#787870] shrink-0" />
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="I need a SaaS platform with authentication & billing..."
                        className="w-full bg-transparent text-[#111111] placeholder-[#94A3B8] text-base font-medium focus:outline-none"
                      />
                    </div>

                    <div className="w-full sm:w-auto shrink-0">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isMatching}
                        className="w-full sm:w-auto"
                        icon={<ArrowRight className="w-4 h-4" />}
                      >
                        Analyze Requirement →
                      </Button>
                    </div>
                  </div>

                  {/* Instant Requirement Preview */}
                  {liveParsed && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 pt-3 border-t border-[#E5E0D5] px-3 space-y-2 text-xs overflow-hidden"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[#111111] font-bold">Mapped Scope:</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0E6] text-[#F97316] font-bold border border-[#FFD8C2]">
                          {liveParsed.detectedServiceName || 'Custom Application'}
                        </span>
                        {liveParsed.detectedSkills.map(sk => (
                          <span key={sk} className="px-2.5 py-0.5 rounded-full bg-[#F7F3E8] text-[#4A4A45] font-semibold border border-[#E5E0D5]">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </form>
              </div>

              {/* 3-4 Clean Example Requirements */}
              <div className="space-y-2 text-xs">
                <span className="text-[#787870] font-semibold block">Or explore an example requirement:</span>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {exampleRequirements.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleExampleClick(term)}
                      className="text-[#4A4A45] hover:text-[#F97316] font-medium underline underline-offset-4 decoration-[#E5E0D5] hover:decoration-[#F97316] transition-colors cursor-pointer text-left"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Direct Action Links */}
            <motion.div variants={animate ? itemVariants : undefined} className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/start-project">
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                  START A PROJECT
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg">
                  EXPLORE SERVICES
                </Button>
              </Link>
            </motion.div>

          </motion.div>

          {/* Right Column (5 cols): Lightweight Visual representing REQUIREMENT -> CAPABILITIES -> EXPERTISE */}
          <motion.div 
            className="lg:col-span-5 flex justify-center"
            initial={animate ? { opacity: 0, scale: 0.97 } : undefined}
            animate={animate ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.2 }}
          >
            <motion.div style={animate ? { y: visualParallaxY } : undefined} className="w-full max-w-md relative space-y-4">
              
              <div className="p-6 sm:p-8 bg-white border border-[#E5E0D5] rounded-3xl space-y-6 relative overflow-hidden shadow-xs">
                <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    MakeIT Routing Framework
                  </span>
                  <motion.span 
                    style={animate ? { y: bgBadgeParallaxY } : undefined}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FFF0E6] text-[#F97316]"
                  >
                    PRECISION MATCH
                  </motion.span>
                </div>

                {/* Flow Step 1: REQUIREMENT */}
                <div className="space-y-1.5 p-3.5 rounded-2xl bg-[#F7F3E8] border border-[#E5E0D5]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold uppercase text-[#787870] tracking-wider text-[10px]">01 REQUIREMENT</span>
                    <span className="text-[#F97316] font-bold">Business Goal</span>
                  </div>
                  <p className="text-xs font-bold text-[#111111]">
                    "Build a scalable SaaS MVP with payment billing"
                  </p>
                </div>

                <div className="flex justify-center text-[#F97316]">
                  <ArrowDown className="w-4 h-4" />
                </div>

                {/* Flow Step 2: CAPABILITIES */}
                <div className="space-y-1.5 p-3.5 rounded-2xl bg-[#F7F3E8] border border-[#E5E0D5]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold uppercase text-[#787870] tracking-wider text-[10px]">02 CAPABILITIES</span>
                    <span className="text-[#111111] font-bold">Engineering Scope</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-[#4A4A45] bg-white px-2 py-0.5 rounded border border-[#E5E0D5]">React/Next.js</span>
                    <span className="text-[11px] font-semibold text-[#4A4A45] bg-white px-2 py-0.5 rounded border border-[#E5E0D5]">Node.js API</span>
                    <span className="text-[11px] font-semibold text-[#4A4A45] bg-white px-2 py-0.5 rounded border border-[#E5E0D5]">Stripe</span>
                  </div>
                </div>

                <div className="flex justify-center text-[#F97316]">
                  <ArrowDown className="w-4 h-4" />
                </div>

                {/* Flow Step 3: EXPERTISE */}
                <div className="space-y-2 p-4 rounded-2xl bg-[#FFF0E6] border border-[#FFD8C2]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold uppercase text-[#F97316] tracking-wider text-[10px]">03 RIGHT EXPERTISE</span>
                    <span className="text-xs font-bold text-[#111111]">Senior Lead Assigned</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" 
                      alt="Expert" 
                      className="w-10 h-10 rounded-xl object-cover border border-[#FFD8C2]"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#111111]">Elena Rostova</div>
                      <div className="text-[11px] text-[#F97316] font-semibold">Lead Full Stack Architect (9 yrs)</div>
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>
          </motion.div>

        </div>

      </div>

      {/* Requirement Analysis Modal */}
      <Modal
        isOpen={matchResultModalOpen}
        onClose={() => setMatchResultModalOpen(false)}
        title="Requirement Analysis & Recommendation"
        subtitle={parsedState ? `Input: "${parsedState.rawInput}"` : undefined}
        maxWidth="2xl"
      >
        {activeResult && activeResult.length > 0 ? (
          <div className="space-y-6 font-sans">
            <div className="p-5 rounded-2xl bg-[#FFF0E6] border border-[#FFD8C2] text-[#111111] text-sm space-y-2">
              <div className="font-bold text-[#F97316] flex items-center gap-2 text-base font-heading">
                <CheckCircle2 className="w-5 h-5 text-[#F97316]" />
                Requirement Mapped Successfully
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div>
                  <span className="text-[#787870] font-semibold block uppercase">RECOMMENDED SOLUTION:</span>
                  <span className="text-[#111111] font-bold">{parsedState?.detectedServiceName || 'SaaS Application Development'}</span>
                </div>
                <div>
                  <span className="text-[#787870] font-semibold block uppercase">REQUIRED CAPABILITIES:</span>
                  <span className="text-[#111111] font-bold">UI/UX Design, Full Stack Dev, API Integration</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#787870]">Matched Lead Specialist:</span>
                <Badge variant="orange" size="sm" className="font-bold">PRIMARY MATCH</Badge>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#E5E0D5] hover:border-[#F97316] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img src={activeResult[0].expert.avatar} alt={activeResult[0].expert.name} className="w-12 h-12 rounded-xl object-cover border border-[#E5E0D5]" />
                  <div>
                    <h4 className="text-base font-bold text-[#111111] font-heading">{activeResult[0].expert.name}</h4>
                    <p className="text-xs font-bold text-[#F97316]">{activeResult[0].expert.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#787870]">
                      <span>{activeResult[0].expert.yearsOfExperience} yrs exp • {activeResult[0].expert.primaryExpertise}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setMatchResultModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setMatchResultModalOpen(false);
                  submitRequirement({
                    rawInput: query,
                    detectedServiceId: parsedState?.detectedServiceId,
                    detectedCategory: parsedState?.detectedCategoryId
                  });
                  router.push(`/start-project?expertId=${activeResult[0].expert.id}`);
                }}
              >
                Discuss This Project
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

    </section>
  );
};
