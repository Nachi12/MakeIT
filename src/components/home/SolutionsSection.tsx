'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Layers, Sparkles } from 'lucide-react';

export const SolutionsSection: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(0); // Default first item open

  const solutions = [
    {
      title: 'BUILD A WEBSITE',
      audience: 'Startups & Growing Businesses',
      desc: 'High-performance web presence with modern typography, SEO optimization, and dynamic content management.',
      slug: 'build-website',
      recommendedServices: 'Web Development, SEO, Responsive UI',
      tech: ['React', 'Next.js', 'Tailwind', 'CMS']
    },
    {
      title: 'BUILD AN MVP',
      audience: 'Founders & Early Stage Teams',
      desc: 'Rapid product launch with core functional features built for early customer testing and investor feedback.',
      slug: 'build-mvp',
      recommendedServices: 'SaaS MVP Engineering, Database Architecture',
      tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe']
    },
    {
      title: 'LAUNCH A SAAS PRODUCT',
      audience: 'SaaS Companies & Founders',
      desc: 'Multi-tenant web platform with authentication, subscription billing, dashboard analytics, and REST APIs.',
      slug: 'launch-saas',
      recommendedServices: 'Full Stack Engineering, Auth, Billing Integration',
      tech: ['React', 'Node.js', 'Docker', 'Stripe']
    },
    {
      title: 'CREATE A WEB APPLICATION',
      audience: 'Businesses & Digital Products',
      desc: 'Custom web software engineered for specific operational workflows, team collaboration, and data management.',
      slug: 'create-web-app',
      recommendedServices: 'Frontend & Backend Architecture, Custom APIs',
      tech: ['TypeScript', 'Laravel', 'MySQL', 'REST APIs']
    },
    {
      title: 'REDESIGN YOUR PRODUCT',
      audience: 'Existing Web Applications',
      desc: 'Complete UX audit and visual overhaul to improve conversion rates, user engagement, and product polish.',
      slug: 'redesign-product',
      recommendedServices: 'UI/UX Audit, Design System, Component Library',
      tech: ['Figma', 'UI/UX', 'Design Systems', 'Tailwind']
    },
    {
      title: 'MODERNIZE EXISTING SOFTWARE',
      audience: 'Established Enterprises',
      desc: 'Refactor legacy codebase, improve API response speeds, upgrade dependencies, and stabilize cloud backend.',
      slug: 'modernize-software',
      recommendedServices: 'Technical Review, PHP/Laravel Refactoring',
      tech: ['Node.js', 'PHP', 'Database Tuning', 'Laravel']
    }
  ];

  return (
    <section id="solutions" className="py-20 lg:py-28 bg-[#FCFAF4] border-b border-[#E5E0D5] font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] block">
              TARGET GOALS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight font-heading">
              What Are You Trying to Build?
            </h2>
            <p className="text-[#4A4A45] text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Hover over a goal to reveal the recommended technical strategy.
            </p>
          </div>

          <Link href="/solutions" className="inline-flex items-center gap-2 text-xs font-bold text-[#111111] hover:text-[#F97316]">
            <span>EXPLORE ALL SOLUTIONS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Progressive Disclosure Interactive List */}
        <div className="divide-y divide-[#E5E0D5] border-t border-b border-[#E5E0D5]">
          {solutions.map((item, idx) => {
            const isSelected = hoveredIdx === idx;

            return (
              <div
                key={item.title}
                onMouseEnter={() => setHoveredIdx(idx)}
                onFocus={() => setHoveredIdx(idx)}
                tabIndex={0}
                className={`py-6 px-4 sm:px-6 transition-all duration-200 cursor-pointer rounded-2xl ${
                  isSelected ? 'bg-white shadow-xs border border-[#E5E0D5]' : 'hover:bg-[#F7F3E8]'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Primary Info Always Visible */}
                  <div className="space-y-1 md:w-5/12">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#787870] block">
                      {item.audience}
                    </span>
                    <h3 className={`text-xl sm:text-2xl font-black font-heading transition-colors ${
                      isSelected ? 'text-[#F97316]' : 'text-[#111111]'
                    }`}>
                      {item.title}
                    </h3>
                  </div>

                  {/* Progressive Revealed Info on Hover/Focus */}
                  {isSelected ? (
                    <div className="md:w-5/12 space-y-2 animate-fadeIn">
                      <p className="text-xs text-[#4A4A45] leading-relaxed font-normal">
                        {item.desc}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[10px] font-bold text-[#787870] uppercase">Recommended Stack:</span>
                        {item.tech.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded bg-[#FFF0E6] text-[10px] font-bold text-[#F97316]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="hidden md:block md:w-5/12 text-xs text-[#787870] font-medium italic">
                      Hover to reveal technical approach & stack →
                    </div>
                  )}

                  {/* Action Link Button */}
                  <div className="md:w-2/12 flex justify-end shrink-0">
                    <Link
                      href={`/start-project?solution=${item.slug}`}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        isSelected 
                          ? 'bg-[#F97316] text-white' 
                          : 'bg-[#F7F3E8] text-[#111111] hover:bg-[#FFF0E6] hover:text-[#F97316]'
                      }`}
                    >
                      <span>DISCUSS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
