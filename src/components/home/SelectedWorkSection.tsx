'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, User } from 'lucide-react';
import { INITIAL_CASE_STUDIES } from '@/lib/data/mockData';
import { Button } from '../ui/Button';

export const SelectedWorkSection: React.FC = () => {
  const featuredProject = INITIAL_CASE_STUDIES[0]; // PayPulse SaaS Rearchitecture
  const secondaryProjects = INITIAL_CASE_STUDIES.slice(1, 3); // Telehealth UX & Legacy PHP

  return (
    <section className="py-20 lg:py-28 bg-[#FCFAF4] border-b border-[#E5E0D5] font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] block">
              REAL PROJECT EXECUTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight font-heading">
              Selected Work
            </h2>
            <p className="text-[#4A4A45] text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Real software engineering and product design projects delivered by MakeIT specialists.
            </p>
          </div>

          <Link href="/case-studies">
            <Button variant="outline" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              VIEW ALL CASE STUDIES
            </Button>
          </Link>
        </div>

        {/* 1 LARGE FEATURED PROJECT PRESENTATION */}
        <div className="bg-white border border-[#E5E0D5] rounded-3xl p-8 sm:p-12 space-y-8 hover:border-[#F97316] transition-all">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D5] pb-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#FFF0E6] text-[#F97316] text-xs font-bold border border-[#FFD8C2]">
                FEATURED CASE STUDY
              </span>
              <span className="text-xs font-bold text-[#787870]">{featuredProject.clientIndustry}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
              <User className="w-4 h-4 text-[#F97316]" />
              <span>Assigned Lead: {featuredProject.expertName}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Problem, What MakeIT Provided, What Was Built */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111] font-heading leading-snug">
                {featuredProject.title}
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="font-extrabold uppercase text-[#787870] tracking-wider text-[11px] block mb-1">
                    WHAT WAS THE PROBLEM?
                  </span>
                  <p className="text-[#4A4A45] leading-relaxed">
                    {featuredProject.challenge}
                  </p>
                </div>

                <div>
                  <span className="font-extrabold uppercase text-[#F97316] tracking-wider text-[11px] block mb-1">
                    WHAT MAKEIT PROVIDED
                  </span>
                  <p className="text-[#111111] font-medium leading-relaxed">
                    {featuredProject.solution}
                  </p>
                </div>
              </div>

              {/* Real Outcome Metrics */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F7F3E8] border border-[#E5E0D5]">
                {featuredProject.results.map((res, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-xl sm:text-2xl font-black text-[#F97316] font-heading">{res.metric}</div>
                    <div className="text-[11px] text-[#787870] font-bold mt-0.5">{res.label}</div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link href={`/case-studies`} className="inline-flex items-center gap-2 text-xs font-bold text-[#111111] hover:text-[#F97316] transition-colors">
                  <span>READ FULL CASE STUDY</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: Visual Project Showcase */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-[#E5E0D5] group">
                <img 
                  src={featuredProject.image} 
                  alt={featuredProject.title}
                  className="w-full h-72 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <div className="text-xs font-bold text-[#FFD8C2]">{featuredProject.clientName}</div>
                    <div className="text-sm font-black font-heading">{featuredProject.serviceTitle}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 2 SMALLER PROJECTS SIDE-BY-SIDE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {secondaryProjects.map((project) => (
            <div 
              key={project.id}
              className="bg-white border border-[#E5E0D5] rounded-3xl p-8 space-y-6 hover:border-[#F97316] transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#787870]">
                  <span className="px-3 py-0.5 rounded-full bg-[#F7F3E8] text-[#111111] border border-[#E5E0D5]">
                    {project.clientIndustry}
                  </span>
                  <span>Lead: {project.expertName}</span>
                </div>

                <h4 className="text-xl font-black text-[#111111] font-heading leading-snug">
                  {project.title}
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-[#787870] uppercase block">Problem:</span>
                    <p className="text-[#4A4A45] leading-relaxed line-clamp-2">{project.challenge}</p>
                  </div>

                  <div>
                    <span className="font-bold text-[#F97316] uppercase block">Solution Built:</span>
                    <p className="text-[#111111] font-medium leading-relaxed line-clamp-2">{project.solution}</p>
                  </div>
                </div>

                {/* Outcome Bar */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-[#FCFAF4] border border-[#E5E0D5] text-xs">
                  {project.results.slice(0, 2).map((res, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#F97316]" />
                      <span className="font-extrabold text-[#111111]">{res.metric}</span>
                      <span className="text-[#787870] text-[11px] font-medium">{res.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E0D5]">
                <Link href="/case-studies" className="inline-flex items-center gap-2 text-xs font-bold text-[#111111] hover:text-[#F97316]">
                  <span>Explore Outcome & Tech Stack</span>
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
