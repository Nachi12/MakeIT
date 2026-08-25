'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { MegaMenu } from './MegaMenu';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Services', href: '/services', isMega: true },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Experts', href: '/experts' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Resources', href: '/resources' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header 
      className="sticky top-0 z-50 w-full bg-[#F7F3E8] border-b border-[#E5E0D5] font-sans relative"
      onMouseLeave={() => setServicesMenuOpen(false)}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] sm:h-[76px] flex items-center justify-between relative">
        
        {/* Brand Logo & Editorial Typography */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#111111] flex items-center justify-center text-white font-extrabold text-base sm:text-lg shadow-xs">
            M
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#111111]">MakeIT</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#FFF0E6] text-[#F97316] border border-[#FFD8C2]">
                EXPERT NETWORK
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-[#4A4A45] font-medium tracking-wide hidden sm:block">
              IT Services & Software Engineering
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 h-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(`${link.href}/`));
            
            if (link.isMega) {
              return (
                <div 
                  key={link.name} 
                  className="flex items-center h-full"
                  onMouseEnter={() => setServicesMenuOpen(true)}
                >
                  <button
                    onClick={() => setServicesMenuOpen(!servicesMenuOpen)}
                    className={`flex items-center gap-1 text-sm font-bold transition-colors cursor-pointer py-6 ${
                      isActive || servicesMenuOpen ? 'text-[#F97316]' : 'text-[#4A4A45] hover:text-[#111111]'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${servicesMenuOpen ? 'rotate-180 text-[#F97316]' : ''}`} />
                  </button>
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-bold transition-colors ${
                  isActive ? 'text-[#F97316]' : 'text-[#4A4A45] hover:text-[#111111]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="hidden lg:flex items-center gap-5">
          <Link href="/contact" className="text-sm font-bold text-[#4A4A45] hover:text-[#111111] transition-colors">
            Contact
          </Link>

          <Link href="/start-project">
            <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              Start a Project
            </Button>
          </Link>
        </div>

        {/* Mobile Action Controls */}
        <div className="flex lg:hidden items-center gap-2 sm:gap-3">
          <Link href="/start-project">
            <Button variant="primary" size="sm" className="px-3 py-1.5 text-xs font-bold">
              Start Project
            </Button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#111111] hover:text-[#F97316] rounded-xl bg-white border border-[#E5E0D5]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

      </div>

      {/* MegaMenu Dropdown */}
      {servicesMenuOpen && (
        <MegaMenu onClose={() => setServicesMenuOpen(false)} />
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E0D5] bg-[#F7F3E8] p-6 space-y-3">
          <div className="grid gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-[#111111] hover:bg-white hover:text-[#F97316]"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-[#111111] hover:bg-white hover:text-[#F97316]"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
