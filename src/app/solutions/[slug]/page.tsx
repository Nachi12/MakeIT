'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppState } from '@/lib/services/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, CheckCircle2, Layers, Code2 } from 'lucide-react';
import { ExpertCard } from '@/components/experts/ExpertCard';

export default function SolutionDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { solutions, services, experts } = useAppState();

  const solution = solutions.find(s => s.slug === slug || s.id === slug);

  if (!solution) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4 font-sans">
        <h1 className="text-3xl font-bold text-[#0B1F3A]">Solution Not Found</h1>
        <p className="text-[#64748B]">The requested business solution does not exist or has been relocated.</p>
        <Link href="/solutions">
          <Button variant="primary" size="md">Back to Solutions</Button>
        </Link>
      </div>
    );
  }

  const recommendedService = services.find(s => s.id === solution.recommendedServiceId) || services[0];
  const assignedExperts = experts.filter(e => e.categoryId === solution.recommendedCategoryId || e.servicesOffered.includes(solution.recommendedServiceId));

  return (
    <div className="space-y-16 pb-20 font-sans">
      
      {/* Solution Hero */}
      <section className="bg-white border-b border-[#E2E8F0] pt-12 pb-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center gap-2">
            <Link href="/solutions" className="text-xs text-[#64748B] hover:text-[#2563EB] font-medium">Solutions</Link>
            <span className="text-[#94A3B8] text-xs">/</span>
            <span className="text-xs text-[#2563EB] font-bold">{solution.title}</span>
          </div>

          <div className="max-w-4xl space-y-3">
            <Badge variant="blue" size="md">{solution.targetAudience}</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B1F3A] tracking-tight leading-tight">
              {solution.title}
            </h1>
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed font-normal">
              {solution.shortDescription}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link href={`/start-project?type=${encodeURIComponent(solution.title)}`}>
              <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                Start This Solution
              </Button>
            </Link>
            <Link href={`/services/${recommendedService.slug}`}>
              <Button variant="outline" size="lg">
                View Recommended Service
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <div className="lg:col-span-2 space-y-10">
          
          {/* Solution Capabilities */}
          <div className="mnc-card p-8 space-y-6">
            <h2 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#2563EB]" />
              Core Capabilities Provided
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F3A]">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB]" /> UI/UX & User Flows
                </div>
                <p className="text-xs text-[#475569]">Figma visual design and clickable interactive prototypes.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F3A]">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB]" /> Modular Architecture
                </div>
                <p className="text-xs text-[#475569]">Clean frontend and scalable database schema definition.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F3A]">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB]" /> API & Auth Integration
                </div>
                <p className="text-xs text-[#475569]">Secure JWT user authentication and payment gateway integration.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F3A]">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB]" /> Warranty & Launch
                </div>
                <p className="text-xs text-[#475569]">30 days of post-delivery warranty support and deployment.</p>
              </div>
            </div>
          </div>

          {/* Example Technologies */}
          <div className="mnc-card p-8 space-y-6">
            <h2 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2">
              <Code2 className="w-6 h-6 text-[#2563EB]" />
              Applied Technologies & Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {solution.exampleTechnologies.map(tech => (
                <span key={tech} className="px-3.5 py-1.5 rounded-lg bg-[#EFF6FF] text-xs font-bold text-[#2563EB] border border-[#BFDBFE]">
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Recommended Experts */}
        <div className="space-y-8">
          <div className="mnc-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#0B1F3A]">Recommended Specialists</h3>
            <div className="space-y-4">
              {assignedExperts.slice(0, 2).map((exp) => (
                <ExpertCard key={exp.id} expert={exp} />
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
