'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function PricingPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 font-sans">
      
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
          Transparent Engagement Models
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1F3A] tracking-tight">
          Clear, Milestone-Based Commercial Terms
        </h1>
        <p className="text-[#475569] text-base font-normal">
          No hidden commission markups or bidding surcharges. Clear pricing aligned with project milestones.
        </p>
      </div>

      {/* Pricing Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1: Consultation Calls */}
        <div className="mnc-card p-8 flex flex-col justify-between space-y-6">
          <div>
            <Badge variant="blue" size="sm" className="mb-3">STRATEGY & ADVISORY</Badge>
            <h3 className="text-2xl font-bold text-[#0B1F3A]">1-on-1 Consultation</h3>
            <div className="text-3xl font-black text-[#0B1F3A] mt-3">
              ₹1,500 – ₹4,000 <span className="text-xs font-normal text-[#64748B]">/ session</span>
            </div>
            <p className="text-xs text-[#64748B] mt-2 font-normal">15 min, 30 min, or 60 min dedicated strategy sessions with verified specialists.</p>

            <ul className="mt-6 space-y-3 text-xs text-[#334155]">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" /> Direct video call with specialist</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" /> Structured post-call summary notes</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" /> Session recording & action plan</li>
            </ul>
          </div>

          <Link href="/book-consultation">
            <Button variant="outline" size="md" className="w-full">
              Book Strategy Session
            </Button>
          </Link>
        </div>

        {/* Card 2: Fixed Milestone Projects */}
        <div className="mnc-card p-8 border-[#2563EB] bg-white shadow-md flex flex-col justify-between space-y-6 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge variant="blue" size="sm">RECOMMENDED</Badge>
          </div>

          <div>
            <Badge variant="blue" size="sm" className="mb-3">FIXED SCOPE PROJECTS</Badge>
            <h3 className="text-2xl font-bold text-[#0B1F3A]">Milestone Delivery</h3>
            <div className="text-3xl font-black text-[#0B1F3A] mt-3">
              Custom Quote <span className="text-xs font-normal text-[#64748B]">(e.g. ₹25k – ₹1.5L)</span>
            </div>
            <p className="text-xs text-[#64748B] mt-2 font-normal">Milestone schedule with funds released strictly upon stage approval.</p>

            <ul className="mt-6 space-y-3 text-xs text-[#334155]">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" /> Defined deliverables & acceptance criteria</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" /> Milestone payout protection</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" /> Dedicated project dashboard & chat</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" /> 30-day post-launch warranty support</li>
            </ul>
          </div>

          <Link href="/request-service">
            <Button variant="primary" size="lg" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
              Submit Requirement for Quote
            </Button>
          </Link>
        </div>

        {/* Card 3: Enterprise Retainers */}
        <div className="mnc-card p-8 flex flex-col justify-between space-y-6">
          <div>
            <Badge variant="navy" size="sm" className="mb-3">ENTERPRISE RETAINER</Badge>
            <h3 className="text-2xl font-bold text-[#0B1F3A]">Dedicated SLA & Monthly</h3>
            <div className="text-3xl font-black text-[#0B1F3A] mt-3">
              Custom SLA <span className="text-xs font-normal text-[#64748B]">/ monthly</span>
            </div>
            <p className="text-xs text-[#64748B] mt-2 font-normal">Ongoing specialized technical advisory, codebase audits, or monthly engineering retainers.</p>

            <ul className="mt-6 space-y-3 text-xs text-[#334155]">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" /> Dedicated practitioner allocation</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" /> Guaranteed response SLA & priority</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" /> Consolidated monthly corporate billing</li>
            </ul>
          </div>

          <Link href="/contact">
            <Button variant="outline" size="md" className="w-full">
              Contact Sales
            </Button>
          </Link>
        </div>

      </div>

    </div>
  );
}

