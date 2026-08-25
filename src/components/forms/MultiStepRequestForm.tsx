'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Globe, 
  Code2, 
  Layers, 
  Rocket, 
  ShoppingCart, 
  Layout, 
  RefreshCw, 
  Cpu, 
  Check,
  UserCheck,
  FileCheck,
  PhoneCall,
  Clock
} from 'lucide-react';
import { useAppState } from '@/lib/services/store';
import { Requirement, ITProjectType } from '@/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import confetti from 'canvas-confetti';

export const MultiStepRequestForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedType = searchParams.get('type') as ITProjectType | null;
  const preselectedServiceId = searchParams.get('serviceId');
  const preselectedExpertId = searchParams.get('expertId');

  const { services, experts, submitRequirement } = useAppState();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    leadId: string;
    topMatches: ReturnType<typeof submitRequirement>['rankedExperts'];
  } | null>(null);

  // Form State
  const [projectType, setProjectType] = useState<ITProjectType>(preselectedType || 'Web Application');
  const [rawInput, setRawInput] = useState('');
  const [details, setDetails] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(preselectedServiceId || '');
  const [budgetRange, setBudgetRange] = useState<Requirement['budgetRange']>('Not sure');
  const [timeline, setTimeline] = useState<Requirement['timeline']>('2–4 weeks');
  const [preferredContact, setPreferredContact] = useState<Requirement['preferredContact']>('Email');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    if (preselectedServiceId) {
      const s = services.find(srv => srv.id === preselectedServiceId);
      if (s) {
        setSelectedServiceId(s.id);
        setRawInput(`Requirement for ${s.title}`);
      }
    }
    if (preselectedExpertId) {
      const exp = experts.find(e => e.id === preselectedExpertId);
      if (exp) {
        setRawInput(`Direct request for tech specialist ${exp.name} (${exp.title})`);
      }
    }
  }, [preselectedServiceId, preselectedExpertId, services, experts]);

  const projectTypes: { type: ITProjectType; label: string; desc: string; icon: React.ReactNode }[] = [
    { type: 'Website', label: 'Business Website', desc: 'Modern responsive company site', icon: <Globe className="w-5 h-5 text-[#2563EB]" /> },
    { type: 'Web Application', label: 'Custom Web Application', desc: 'Tailored software for operations', icon: <Code2 className="w-5 h-5 text-[#2563EB]" /> },
    { type: 'SaaS', label: 'SaaS Platform', desc: 'Multi-tenant software with subscriptions', icon: <Layers className="w-5 h-5 text-[#2563EB]" /> },
    { type: 'MVP', label: 'Startup MVP', desc: 'Rapid functional product prototype', icon: <Rocket className="w-5 h-5 text-[#2563EB]" /> },
    { type: 'E-Commerce', label: 'E-Commerce Storefront', desc: 'Online catalog & payment checkout', icon: <ShoppingCart className="w-5 h-5 text-[#2563EB]" /> },
    { type: 'UI/UX Design', label: 'UI/UX & Product Design', desc: 'Figma wireframes & design system', icon: <Layout className="w-5 h-5 text-[#2563EB]" /> },
    { type: 'Existing Application', label: 'Website Redesign / Refactor', desc: 'Modernize slow or outdated code', icon: <RefreshCw className="w-5 h-5 text-[#2563EB]" /> },
    { type: 'API Integration', label: 'API & Backend Integration', desc: 'Connect payment gateways & webhooks', icon: <Cpu className="w-5 h-5 text-[#2563EB]" /> },
    { type: 'Other Technology Requirement', label: 'Other Technology Need', desc: 'Consulting, code audit, or custom tech', icon: <Code2 className="w-5 h-5 text-[#2563EB]" /> }
  ];

  const budgetOptions: Requirement['budgetRange'][] = [
    'Under ₹25,000',
    '₹25,000–₹50,000',
    '₹50,000–₹1 lakh',
    '₹1 lakh–₹3 lakh',
    '₹3 lakh+',
    'Not sure'
  ];

  const timelineOptions: Requirement['timeline'][] = [
    'ASAP',
    '2–4 weeks',
    '1–2 months',
    '2–3 months',
    'Flexible'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const result = submitRequirement({
        rawInput: rawInput || details || `Project: ${projectType}`,
        projectType,
        detectedServiceId: selectedServiceId || undefined,
        budgetRange,
        timeline,
        preferredContact,
        customerName: customerName || 'Valued Client',
        customerEmail: customerEmail || 'client@example.com',
        customerPhone,
        companyName,
        details: details || rawInput
      });

      setIsSubmitting(false);
      setSubmittedData({
        leadId: result.lead.id,
        topMatches: result.rankedExperts
      });
      setStep(7); // Confirmation screen

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }, 600);
  };

  const nextSteps = [
    { num: "1", title: "Technical Review", desc: "Our engineering leads review your requirement details." },
    { num: "2", title: "Capabilities Assessment", desc: "We identify required stack, database, and design needs." },
    { num: "3", title: "Scope Alignment", desc: "We contact you via email or phone to clarify requirements." },
    { num: "4", title: "Specialist Recommendation", desc: "We connect you with matched engineers or a delivery team." },
    { num: "5", title: "Milestone Proposal", desc: "We prepare clear project milestones and timeline scope." }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      
      {/* Progress Header */}
      {step < 7 && (
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-[#64748B] uppercase tracking-wider">
            <span>Step {step} of 6</span>
            <span>{Math.round((step / 6) * 100)}% Completed</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
            <div 
              className="h-full bg-[#2563EB] transition-all duration-300 rounded-full"
              style={{ width: `${(step / 6) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* STEP 1: What do you want to build? */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Step 1: Project Objective
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
                What are you trying to achieve?
              </h2>
              <p className="text-xs sm:text-sm text-[#475569]">
                Select the option that best matches your target software solution.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projectTypes.map((item) => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setProjectType(item.type)}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                    projectType === item.type
                      ? 'border-[#2563EB] bg-[#EFF6FF] shadow-xs'
                      : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-white border border-[#E2E8F0] shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0B1F3A]">{item.label}</div>
                    <div className="text-xs text-[#64748B] font-normal">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(2)}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Continue to Requirement Description
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Describe Requirement */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Step 2: Project Details
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
                Describe your requirement
              </h2>
              <p className="text-xs sm:text-sm text-[#475569]">
                Tell us about your product goals, key features, target users, or existing challenges.
              </p>
            </div>

            <div className="space-y-3">
              <textarea
                rows={5}
                value={details}
                onChange={(e) => {
                  setDetails(e.target.value);
                  setRawInput(e.target.value);
                }}
                placeholder="Example: I need a SaaS application for managing customer invoices with Stripe subscriptions, admin portal, and automated email alerts..."
                className="w-full p-4 rounded-xl mnc-input text-sm text-[#0F172A] leading-relaxed resize-y"
              />
            </div>

            <div className="pt-4 flex items-center justify-between gap-4">
              <Button variant="outline" size="md" onClick={() => setStep(1)} icon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(3)}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Continue to Services
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Service Selection (Optional) */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Step 3: Service Selection
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
                What services do you think you need?
              </h2>
              <p className="text-xs sm:text-sm text-[#475569]">
                Optional: Select a specific service category if you already know your technical requirement.
              </p>
            </div>

            {/* Reassurance Banner */}
            <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#2563EB] font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2563EB]" />
              <span>Not sure? That&apos;s okay. Our technical team will recommend the right service and team structure.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedServiceId('')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedServiceId === ''
                    ? 'border-[#2563EB] bg-[#EFF6FF] shadow-xs'
                    : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="text-xs font-bold text-[#0B1F3A]">Let Team Recommend Service</div>
                <div className="text-[11px] text-[#64748B]">We will assess the right engineering approach</div>
              </button>

              {services.map((srv) => (
                <button
                  type="button"
                  key={srv.id}
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedServiceId === srv.id
                      ? 'border-[#2563EB] bg-[#EFF6FF] shadow-xs'
                      : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="text-xs font-bold text-[#0B1F3A]">{srv.title}</div>
                  <div className="text-[11px] text-[#64748B] line-clamp-1">{srv.shortDescription}</div>
                </button>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between gap-4">
              <Button variant="outline" size="md" onClick={() => setStep(2)} icon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(4)}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Continue to Budget
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Budget Range */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Step 4: Investment Tier
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
                Estimated Budget
              </h2>
              <p className="text-xs sm:text-sm text-[#475569]">
                Select your expected budget tier to align milestone scope appropriately.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {budgetOptions.map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => setBudgetRange(b)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    budgetRange === b
                      ? 'border-[#2563EB] bg-[#EFF6FF] shadow-xs'
                      : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="text-sm font-bold text-[#0B1F3A]">{b}</div>
                </button>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between gap-4">
              <Button variant="outline" size="md" onClick={() => setStep(3)} icon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(5)}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Continue to Timeline
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: Timeline */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Step 5: Delivery Schedule
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
                Target Timeline
              </h2>
              <p className="text-xs sm:text-sm text-[#475569]">
                When do you need the initial release or completed milestone?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {timelineOptions.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTimeline(t)}
                  className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                    timeline === t
                      ? 'border-[#2563EB] bg-[#EFF6FF] shadow-xs'
                      : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="text-sm font-bold text-[#0B1F3A]">{t}</div>
                </button>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between gap-4">
              <Button variant="outline" size="md" onClick={() => setStep(4)} icon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(6)}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Continue to Contact Info
              </Button>
            </div>
          </div>
        )}

        {/* STEP 6: Contact Info & Submit */}
        {step === 6 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Step 6: Contact Information
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
                Where should we send candidate matches?
              </h2>
              <p className="text-xs sm:text-sm text-[#475569]">
                Enter your details so our engineering team can connect you with matched specialists.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1F3A]">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Aman Agarwal"
                  className="w-full p-3 rounded-lg mnc-input text-sm text-[#0F172A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1F3A]">Work Email *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full p-3 rounded-lg mnc-input text-sm text-[#0F172A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1F3A]">Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-3 rounded-lg mnc-input text-sm text-[#0F172A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1F3A]">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. InvoiceFlow Technologies"
                  className="w-full p-3 rounded-lg mnc-input text-sm text-[#0F172A]"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between gap-4">
              <Button type="button" variant="outline" size="md" onClick={() => setStep(5)} icon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                icon={<Check className="w-4 h-4" />}
                iconPosition="right"
              >
                Submit Project Requirement
              </Button>
            </div>
          </form>
        )}

        {/* STEP 7: Enterprise Post-Submission Trust & Next Steps */}
        {step === 7 && submittedData && (
          <div className="space-y-8 text-left animate-in zoom-in-95 duration-300">
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h2 className="text-3xl font-extrabold text-[#0B1F3A]">
                Thanks — we&apos;ve received your project requirement.
              </h2>
              <p className="text-sm text-[#475569] max-w-lg mx-auto leading-relaxed">
                Our technical team is reviewing your project details to align candidate specialists and milestone delivery options.
              </p>
            </div>

            {/* 5 Clear Onboarding Next Steps */}
            <div className="mnc-card p-6 bg-[#F8FAFC] space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2563EB]" /> What Happens Next?
              </h3>

              <div className="space-y-3">
                {nextSteps.map((s) => (
                  <div key={s.num} className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      0{s.num}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0B1F3A]">{s.title}</div>
                      <div className="text-[11px] text-[#64748B] font-normal">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Matched Candidate Specialist Recommendations */}
            <div className="space-y-4 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Initial Candidate Specialist Recommendations:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {submittedData.topMatches.slice(0, 2).map((match, idx) => (
                  <div key={match.expert.id} className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={match.expert.avatar} alt={match.expert.name} className="w-12 h-12 rounded-xl object-cover border border-[#E2E8F0]" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[#0B1F3A]">{match.expert.name}</h4>
                          {idx === 0 && <Badge variant="blue" size="sm">TOP MATCH</Badge>}
                        </div>
                        <p className="text-[11px] text-[#2563EB] font-semibold">{match.expert.title}</p>
                        <p className="text-[10px] text-[#64748B]">{match.expert.yearsOfExperience} yrs exp • {match.expert.location}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-extrabold text-[#2563EB]">{match.matchScore}%</div>
                      <span className="text-[9px] text-[#64748B] font-semibold">MATCH SCORE</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 border-t border-[#E2E8F0]">
              <Button variant="primary" size="md" onClick={() => router.push('/portal/customer')}>
                Continue to Client Portal
              </Button>
              <Button variant="outline" size="md" onClick={() => router.push('/services')}>
                Explore IT Services
              </Button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
