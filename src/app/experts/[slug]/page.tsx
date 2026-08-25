'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ShieldCheck, 
  MapPin, 
  Globe2, 
  Briefcase, 
  Calendar, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';
import { useAppState } from '@/lib/services/store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/ui/RatingStars';
import { Modal } from '@/components/ui/Modal';
import { ConsultationBookingModal } from '@/components/forms/ConsultationBookingModal';

export default function ExpertProfilePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { experts, services } = useAppState();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const expert = experts.find((e) => e.slug === slug || e.id === slug);

  if (!expert) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4 font-sans">
        <h1 className="text-3xl font-bold text-[#0B1F3A]">Expert Profile Not Found</h1>
        <p className="text-[#64748B]">The requested expert profile does not exist or has been updated.</p>
        <Link href="/experts">
          <Button variant="primary" size="md">Back to Experts Network</Button>
        </Link>
      </div>
    );
  }

  const offeredServices = services.filter((s) => expert.servicesOffered.includes(s.id) || s.categoryId === expert.categoryId);

  return (
    <div className="space-y-12 pb-20 font-sans">
      
      {/* Profile Hero Header */}
      <section className="bg-white border-b border-[#E2E8F0] pt-12 pb-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <img 
                  src={expert.avatar} 
                  alt={expert.name} 
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border border-[#E2E8F0] shadow-sm" 
                />
                {expert.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-[#2563EB] text-white p-2 rounded-full shadow-sm" title="Verified Technology Practitioner">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Title & Info */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A]">{expert.name}</h1>
                  <Badge variant="blue" size="sm">VERIFIED TECH SPECIALIST</Badge>
                </div>

                <p className="text-base sm:text-lg text-[#2563EB] font-semibold">{expert.title}</p>
                <p className="text-sm text-[#475569] font-medium">{expert.primaryExpertise}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] pt-1">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#64748B]" /> {expert.location}</span>
                  <span className="flex items-center gap-1.5"><Globe2 className="w-4 h-4 text-[#64748B]" /> Languages: {expert.languages.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* CTAs Box */}
            <div className="bg-[#F8FAFC] p-6 rounded-xl border border-[#E2E8F0] space-y-3 w-full md:w-80 shrink-0">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E2E8F0]">
                <span className="text-[#64748B] font-semibold uppercase">Hourly Rate</span>
                <span className="text-base font-extrabold text-[#0B1F3A]">₹{expert.hourlyRateINR.toLocaleString('en-IN')}/hr <span className="text-xs font-normal text-[#64748B]">(${expert.hourlyRateUSD})</span></span>
              </div>

              <Link href={`/request-service?expertId=${expert.id}`} className="block w-full">
                <Button variant="primary" size="md" className="w-full" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                  Start Project With Expert
                </Button>
              </Link>

              <Button 
                variant="outline" 
                size="md" 
                className="w-full"
                onClick={() => setBookingModalOpen(true)}
                icon={<Calendar className="w-4 h-4 text-[#2563EB]" />}
              >
                Book Tech Strategy Call
              </Button>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 pt-6 border-t border-[#E2E8F0] grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] text-center">
              <div className="text-xs text-[#64748B] font-medium">Rating & Reviews</div>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <RatingStars rating={expert.rating} size="sm" />
                <span className="text-sm font-bold text-[#0B1F3A]">{expert.rating} ({expert.reviewCount})</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] text-center">
              <div className="text-xs text-[#64748B] font-medium">Completed Projects</div>
              <div className="text-xl font-extrabold text-[#0B1F3A] mt-0.5">{expert.completedProjects}+ Successful</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] text-center">
              <div className="text-xs text-[#64748B] font-medium">Experience</div>
              <div className="text-xl font-extrabold text-[#0B1F3A] mt-0.5">{expert.yearsOfExperience} Years</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] text-center">
              <div className="text-xs text-[#64748B] font-medium">Current Availability</div>
              <div className="text-sm font-bold text-[#2563EB] mt-1 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
                {expert.availability}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Details Grid */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Bio, Skills, Work History, Certifications */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Full Bio */}
          <div className="mnc-card p-8 space-y-4">
            <h2 className="text-2xl font-bold text-[#0B1F3A]">About {expert.name}</h2>
            <p className="text-sm text-[#475569] leading-relaxed font-normal">{expert.fullBio}</p>
          </div>

          {/* Skills Badges */}
          <div className="mnc-card p-8 space-y-4">
            <h2 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2563EB]" />
              Verified Skills & Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {expert.skills.map((skill) => (
                <span key={skill} className="px-3.5 py-1.5 rounded-lg bg-[#EFF6FF] text-xs font-semibold text-[#2563EB] border border-[#BFDBFE]">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          {expert.certifications && expert.certifications.length > 0 && (
            <div className="mnc-card p-8 space-y-4">
              <h2 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#2563EB]" />
                Verified Engineering Certifications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {expert.certifications.map((cert, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <h4 className="text-sm font-bold text-[#0B1F3A]">{cert.title}</h4>
                    <p className="text-xs text-[#475569]">{cert.issuer} • {cert.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Services Offered & Booking Widget */}
        <div className="space-y-8">
          
          {/* Services Offered */}
          <div className="mnc-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#0B1F3A]">Services Handled by {expert.name}</h3>
            <div className="space-y-3">
              {offeredServices.map((srv) => (
                <div key={srv.id} className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
                  <h4 className="text-sm font-bold text-[#0B1F3A]">{srv.title}</h4>
                  <p className="text-xs text-[#475569] line-clamp-2">{srv.shortDescription}</p>
                  <div className="pt-1 text-xs">
                    <Link href={`/services/${srv.slug}`} className="text-[#2563EB] font-semibold hover:underline">
                      View Service Scope →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Strategy Booking Box */}
          <div className="mnc-card p-6 text-center space-y-4 border-[#2563EB]">
            <h3 className="text-lg font-bold text-[#0B1F3A]">Schedule a Direct Consultation</h3>
            <p className="text-xs text-[#475569]">
              Book a 1-on-1 strategy call with {expert.name} to discuss project architecture and technical scope.
            </p>
            <Button 
              variant="primary" 
              size="md" 
              className="w-full"
              onClick={() => setBookingModalOpen(true)}
            >
              Book Strategy Session
            </Button>
          </div>

        </div>

      </div>

      {/* Consultation Modal */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title={`Book Strategy Session with ${expert.name}`}
        subtitle={`${expert.title} • ${expert.location}`}
        maxWidth="lg"
      >
        <ConsultationBookingModal expert={expert} onSuccess={() => setBookingModalOpen(false)} />
      </Modal>

    </div>
  );
}
