'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  CheckCircle2, 
  Clock, 
  Users, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  Calendar,
  ShieldCheck,
  Target,
  Code2
} from 'lucide-react';
import { useAppState } from '@/lib/services/store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ExpertCard } from '@/components/experts/ExpertCard';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { services, experts } = useAppState();

  const service = services.find((s) => s.slug === slug || s.id === slug);

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4 font-sans">
        <h1 className="text-3xl font-bold text-[#0B1F3A]">Service Not Found</h1>
        <p className="text-[#64748B]">The requested service page does not exist or has been relocated.</p>
        <Link href="/services">
          <Button variant="primary" size="md">Back to Services</Button>
        </Link>
      </div>
    );
  }

  const assignedExperts = experts.filter((e) => e.servicesOffered.includes(service.id) || e.categoryId === service.categoryId);

  const deliveryPhases = [
    { title: '01 Discovery & Scope', desc: 'Define business goals, user personas, and technical requirements.' },
    { title: '02 Architecture & Plan', desc: 'Select tech stack, database schemas, and milestone deliverables.' },
    { title: '03 Design & Prototype', desc: 'Figma wireframes, component design systems, and interactive UI.' },
    { title: '04 Production Engineering', desc: 'Clean, modular frontend and backend code with automated tests.' },
    { title: '05 Quality Assurance', desc: 'Performance testing, security audit, and cross-device validation.' },
    { title: '06 Production Launch', desc: 'Cloud deployment, CI/CD pipeline, and DNS cutover.' },
    { title: '07 Post-Launch Support', desc: '30-day warranty, bug fixes, and SLA maintenance.' }
  ];

  return (
    <div className="space-y-16 pb-20 font-sans">
      
      {/* 1. Hero Header */}
      <section className="bg-white border-b border-[#E2E8F0] pt-12 pb-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center gap-2">
            <Link href="/services" className="text-xs text-[#64748B] hover:text-[#2563EB] font-medium">IT Services</Link>
            <span className="text-[#94A3B8] text-xs">/</span>
            <span className="text-xs text-[#2563EB] font-bold">{service.categoryName}</span>
          </div>

          <div className="max-w-4xl space-y-3">
            <Badge variant="blue" size="md">{service.categoryName}</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B1F3A] tracking-tight leading-tight">
              {service.title}
            </h1>
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed font-normal">
              {service.fullDescription}
            </p>
          </div>

          {/* Quick Specs Bar */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#E2E8F0] text-sm text-[#475569]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#2563EB]" />
              <span>Typical Delivery: <strong className="text-[#0B1F3A]">{service.typicalDelivery}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2563EB]" />
              <span>Network Specialists: <strong className="text-[#0B1F3A]">{service.expertCount} Verified Engineers</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#64748B]">Starting Benchmark:</span>
              <strong className="text-[#0B1F3A] text-base">₹{service.startingPriceINR.toLocaleString('en-IN')} (${service.startingPriceUSD})</strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link href={`/request-service?serviceId=${service.id}`}>
              <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                Discuss Your Requirement
              </Button>
            </Link>
            <Link href="/book-consultation">
              <Button variant="outline" size="lg" icon={<Calendar className="w-4 h-4 text-[#2563EB]" />}>
                Book Technical Consultation
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* Main Narrative Content Grid */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Story (Challenge, Approach, Capabilities, Tech, Process, Packages) */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* 2 & 3. Business Problem & Our Approach */}
          <div className="mnc-card p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#DC2626]">
                  <Target className="w-4 h-4" /> The Business Challenge
                </div>
                <h3 className="text-base font-bold text-[#0B1F3A]">Fragmented Code & Unpredictable Delivery</h3>
                <p className="text-xs text-[#475569] leading-relaxed font-normal">
                  Building software without structured engineering practices leads to bloated codebases, security vulnerabilities, and missed product deadlines.
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                  <CheckCircle2 className="w-4 h-4" /> Our Engineering Approach
                </div>
                <h3 className="text-base font-bold text-[#0B1F3A]">Structured Milestone Engineering</h3>
                <p className="text-xs text-[#334155] leading-relaxed font-normal">
                  We assign qualified software specialists who follow standardized architecture patterns, rigorous code reviews, and milestone protection.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Capabilities & Deliverables */}
          <div className="mnc-card p-8 space-y-6">
            <h2 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#2563EB]" />
              Deliverables & Included Scope
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.features.map((feat, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#0F172A] font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Technology Stack */}
          {service.skills && service.skills.length > 0 && (
            <div className="mnc-card p-8 space-y-6">
              <h2 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2">
                <Code2 className="w-6 h-6 text-[#2563EB]" />
                Technologies & Tools Applied
              </h2>
              <div className="flex flex-wrap gap-2">
                {service.skills.map((sk) => (
                  <span key={sk} className="px-3.5 py-1.5 rounded-lg bg-[#EFF6FF] text-xs font-bold text-[#2563EB] border border-[#BFDBFE]">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 6. Execution Process */}
          <div className="mnc-card p-8 space-y-6">
            <h2 className="text-2xl font-bold text-[#0B1F3A]">7-Phase Execution Lifecycle</h2>
            <div className="space-y-3">
              {deliveryPhases.map((phase, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1F3A]">{phase.title}</h4>
                    <p className="text-xs text-[#475569] mt-0.5 font-normal">{phase.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transparent Engagement Packages */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#0B1F3A]">Transparent Engagement Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.packages.map((pkg, idx) => (
                <div key={idx} className={`mnc-card p-6 flex flex-col justify-between ${pkg.isPopular ? 'border-[#2563EB] bg-white shadow-md' : ''}`}>
                  <div>
                    {pkg.isPopular && <Badge variant="blue" size="sm" className="mb-2">RECOMMENDED</Badge>}
                    <h3 className="text-xl font-bold text-[#0B1F3A]">{pkg.name}</h3>
                    <div className="text-2xl font-black text-[#0B1F3A] mt-2">
                      ₹{pkg.priceINR.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-[#64748B]">(${pkg.priceUSD})</span>
                    </div>
                    <p className="text-xs text-[#2563EB] font-semibold mt-1">Delivery: {pkg.deliveryTime}</p>

                    <ul className="mt-4 space-y-2 text-xs text-[#334155]">
                      {(pkg.features || []).map((f: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <Link href={`/request-service?serviceId=${service.id}&package=${encodeURIComponent(pkg.name)}`}>
                      <Button variant={pkg.isPopular ? 'primary' : 'outline'} size="md" className="w-full">
                        Select Package
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Matched Experts & Custom Scope CTA */}
        <div className="space-y-8">
          
          <div className="mnc-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#0B1F3A] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
              Specialists Available for This Service
            </h3>

            <div className="space-y-4">
              {assignedExperts.slice(0, 3).map((exp) => (
                <ExpertCard key={exp.id} expert={exp} />
              ))}
            </div>
          </div>

          <div className="mnc-card p-8 bg-white border-[#2563EB] text-center space-y-4 shadow-sm">
            <h3 className="text-xl font-bold text-[#0B1F3A]">Need a Custom Scope?</h3>
            <p className="text-xs text-[#475569] font-normal">
              Submit your specific project requirements to receive a custom milestone proposal.
            </p>
            <Link href={`/request-service?serviceId=${service.id}`}>
              <Button variant="primary" size="lg" className="w-full">
                Discuss Your Requirement
              </Button>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
