'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Layout, Code2, Compass } from 'lucide-react';
import { Button } from '../ui/Button';

export const PopularServicesSection: React.FC = () => {
  const pillars = [
    {
      number: '01',
      title: 'PRODUCT DESIGN',
      subtitle: 'Design digital products people understand and enjoy using.',
      icon: <Layout className="w-6 h-6 text-[#F97316]" />,
      services: [
        { name: 'UI/UX Design', href: '/services/ui-ux-design' },
        { name: 'Product Strategy & Wireframing', href: '/services/ui-ux-design' },
        { name: 'Design Systems & UI Kits', href: '/services/ui-ux-design' },
        { name: 'Interactive Prototyping', href: '/services/ui-ux-design' }
      ]
    },
    {
      number: '02',
      title: 'SOFTWARE ENGINEERING',
      subtitle: 'Build reliable web applications and digital products.',
      icon: <Code2 className="w-6 h-6 text-[#F97316]" />,
      services: [
        { name: 'Full Stack Engineering', href: '/services/full-stack-development' },
        { name: 'SaaS & MVP Engineering', href: '/services/saas-mvp-development' },
        { name: 'React & Next.js Frontend', href: '/services/frontend-development' },
        { name: 'Node.js & API Systems', href: '/services/backend-development' },
        { name: 'PHP & Laravel Applications', href: '/services/php-laravel-development' },
        { name: 'Website Development & Redesign', href: '/services/website-redesign' }
      ]
    },
    {
      number: '03',
      title: 'TECHNOLOGY CONSULTING',
      subtitle: 'Make better technical decisions with experienced specialists.',
      icon: <Compass className="w-6 h-6 text-[#F97316]" />,
      services: [
        { name: 'Architecture Review & Specs', href: '/services/technical-consulting' },
        { name: 'Application Modernization', href: '/services/technical-consulting' },
        { name: 'Performance & Security Audit', href: '/services/technical-consulting' },
        { name: 'Ongoing Technical Maintenance', href: '/services/technical-consulting' }
      ]
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#FCFAF4] border-b border-[#E5E0D5] font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#F97316] block">
              Core Engineering Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight font-heading">
              What We Build
            </h2>
            <p className="text-[#4A4A45] text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              Technology expertise organized around the problems businesses need to solve.
            </p>
          </div>

          <Link href="/services">
            <Button variant="outline" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              EXPLORE ALL SERVICES
            </Button>
          </Link>
        </div>

        {/* Editorial 3-Pillar Service Rows */}
        <div className="space-y-12">
          {pillars.map((pillar) => (
            <div key={pillar.number} className="bg-white rounded-3xl border border-[#E5E0D5] p-8 sm:p-10 shadow-xs transition-all hover:border-[#F97316] space-y-8">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#E5E0D5] pb-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-[#F97316] font-heading">{pillar.number}</span>
                  <div>
                    <h3 className="text-2xl font-black text-[#111111] font-heading">{pillar.title}</h3>
                    <p className="text-sm text-[#4A4A45] mt-0.5">{pillar.subtitle}</p>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-[#FFF0E6] flex items-center justify-center shrink-0">
                  {pillar.icon}
                </div>
              </div>

              {/* Service List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pillar.services.map((s) => (
                  <Link 
                    key={s.name}
                    href={s.href}
                    className="p-4 rounded-2xl bg-[#FCFAF4] border border-[#E5E0D5] hover:border-[#F97316] hover:bg-[#FFF0E6] transition-all flex items-center justify-between group"
                  >
                    <span className="text-sm font-bold text-[#111111] group-hover:text-[#F97316] transition-colors">{s.name}</span>
                    <ArrowRight className="w-4 h-4 text-[#787870] group-hover:text-[#F97316] group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
