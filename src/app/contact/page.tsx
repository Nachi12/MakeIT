'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useAppState } from '@/lib/services/store';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Motion';

export default function ContactPage() {
  const { submitRequirement } = useAppState();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('Not sure');
  const [preferredContact, setPreferredContact] = useState<'WhatsApp' | 'Phone' | 'Email' | 'Video Call'>('Email');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRequirement({
      rawInput: message,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      budgetRange: budget as any,
      preferredContact,
      details: message
    });
    setSubmitted(true);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 font-sans">
      
      <Reveal direction="up" distance={20}>
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
            Direct Inquiry & Advisory
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#111111] tracking-tight font-heading">
            Get in Touch with MakeIT
          </h1>
          <p className="text-[#4A4A45] text-base font-normal">
            Have a custom software project, agency partnership query, or engineering requirement? Our technology team responds within 2 hours.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Contact Info */}
        <Reveal direction="up" distance={16} delay={0.1}>
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E0D5] rounded-3xl p-6 space-y-4 shadow-xs">
              <h3 className="text-lg font-black text-[#111111] font-heading">Technology Concierge Office</h3>
              <div className="space-y-3 text-xs text-[#4A4A45]">
                <p className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                  <span>100 Feet Road, Indiranagar, Bangalore, Karnataka 560038, India</span>
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#F97316] shrink-0" />
                  <span>tech@makeit.network</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#F97316] shrink-0" />
                  <span>+91 80 4920 1800</span>
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Form */}
        <div className="lg:col-span-2">
          <Reveal direction="up" distance={16} delay={0.15}>
            {submitted ? (
              <div className="bg-white border border-[#E5E0D5] rounded-3xl p-10 text-center space-y-4 shadow-xs">
                <CheckCircle2 className="w-12 h-12 text-[#F97316] mx-auto" />
                <h3 className="text-2xl font-black text-[#111111] font-heading">Inquiry Received!</h3>
                <p className="text-xs text-[#4A4A45]">We have registered your project inquiry into our technical review pipeline.</p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>Send Another Message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-[#E5E0D5] rounded-3xl p-8 space-y-6 shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#111111]">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aman Agarwal"
                      className="w-full p-3 rounded-xl border border-[#E5E0D5] text-sm text-[#111111] focus:outline-none focus:border-[#F97316]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#111111]">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full p-3 rounded-xl border border-[#E5E0D5] text-sm text-[#111111] focus:outline-none focus:border-[#F97316]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#111111]">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-3 rounded-xl border border-[#E5E0D5] text-sm text-[#111111] focus:outline-none focus:border-[#F97316]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#111111]">Your Requirement Details *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe what you are looking to build..."
                    className="w-full p-3 rounded-xl border border-[#E5E0D5] text-sm text-[#111111] focus:outline-none focus:border-[#F97316]"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full" icon={<Send className="w-4 h-4" />}>
                  Submit Project Inquiry
                </Button>
              </form>
            )}
          </Reveal>
        </div>

      </div>

    </div>
  );
}
