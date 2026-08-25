'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Button } from '../ui/Button';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111827] text-[#9CA3AF] font-sans border-t border-[#1F2937]">
      {/* Main Footer Links */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Col 1: Brand & Lockup */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#111827] font-extrabold text-lg">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">MakeIT</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#FFF0E6] text-[#F97316]">
                  EXPERT NETWORK
                </span>
              </div>
            </div>
          </Link>

          <p className="text-xs text-[#9CA3AF] leading-relaxed font-normal">
            MakeIT connects businesses, founders, and teams with senior software engineers, product designers, and technical architects to build reliable digital products.
          </p>

          <div className="flex items-center gap-2 text-[11px] text-[#6B7280] pt-1">
            <Globe className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Bangalore, KA, India • Global Remote Delivery</span>
          </div>
        </div>

        {/* Col 2: IT Services */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
            Services
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/services/full-stack-development" className="hover:text-[#F97316] transition-colors">Full Stack Engineering</Link></li>
            <li><Link href="/services/saas-mvp-development" className="hover:text-[#F97316] transition-colors">SaaS & MVP Engineering</Link></li>
            <li><Link href="/services/ui-ux-design" className="hover:text-[#F97316] transition-colors">UI/UX Product Design</Link></li>
            <li><Link href="/services/php-laravel-development" className="hover:text-[#F97316] transition-colors">PHP & Laravel Apps</Link></li>
            <li><Link href="/services/frontend-development" className="hover:text-[#F97316] transition-colors">React & Next.js Frontend</Link></li>
            <li><Link href="/services/backend-development" className="hover:text-[#F97316] transition-colors">Node.js Backend Systems</Link></li>
            <li><Link href="/services/api-development" className="hover:text-[#F97316] transition-colors">API & Integrations</Link></li>
            <li><Link href="/services/technical-consulting" className="hover:text-[#F97316] transition-colors">Technical Consulting</Link></li>
          </ul>
        </div>

        {/* Col 3: Business Solutions */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
            Solutions
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/solutions" className="hover:text-[#F97316] transition-colors">Build a Website</Link></li>
            <li><Link href="/solutions" className="hover:text-[#F97316] transition-colors">Build an MVP</Link></li>
            <li><Link href="/solutions" className="hover:text-[#F97316] transition-colors">Launch a SaaS Product</Link></li>
            <li><Link href="/solutions" className="hover:text-[#F97316] transition-colors">Redesign Your Product</Link></li>
            <li><Link href="/solutions" className="hover:text-[#F97316] transition-colors">Custom Web Application</Link></li>
            <li><Link href="/solutions" className="hover:text-[#F97316] transition-colors">Modernize Software</Link></li>
          </ul>
        </div>

        {/* Col 4: Company */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
            Company
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/experts" className="hover:text-[#F97316] transition-colors">Technology Experts</Link></li>
            <li><Link href="/how-it-works" className="hover:text-[#F97316] transition-colors">How It Works</Link></li>
            <li><Link href="/case-studies" className="hover:text-[#F97316] transition-colors">Case Studies</Link></li>
            <li><Link href="/pricing" className="hover:text-[#F97316] transition-colors">Commercial Terms</Link></li>
            <li><Link href="/about" className="hover:text-[#F97316] transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-[#F97316] transition-colors">Contact Sales</Link></li>
          </ul>
        </div>

        {/* Col 5: Contact Info */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
            Contact Us
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#F97316] shrink-0 mt-0.5" />
              <span>Indiranagar, Bangalore, KA, India</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
              <span>projects@makeit.network</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
              <span>+91 80 4920 1800</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-[#1F2937] bg-[#0B0F19] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <p>© {new Date().getFullYear()} MakeIT Expert Network. All rights reserved.</p>
          
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};
