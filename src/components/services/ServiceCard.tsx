'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Code2, 
  FileCode2, 
  Layout, 
  BarChart3, 
  Calculator, 
  Activity, 
  Wrench, 
  GraduationCap, 
  ArrowRight,
  Sparkles 
} from 'lucide-react';
import { Service } from '@/types';
import { Button } from '../ui/Button';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2': return <Code2 className="w-5 h-5 text-[#2563EB]" />;
      case 'FileCode2': return <FileCode2 className="w-5 h-5 text-[#2563EB]" />;
      case 'Layout': return <Layout className="w-5 h-5 text-[#2563EB]" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5 text-[#2563EB]" />;
      case 'Calculator': return <Calculator className="w-5 h-5 text-[#2563EB]" />;
      case 'Activity': return <Activity className="w-5 h-5 text-[#2563EB]" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-[#2563EB]" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-[#2563EB]" />;
      default: return <Sparkles className="w-5 h-5 text-[#2563EB]" />;
    }
  };

  return (
    <div className="mnc-card-interactive p-6 flex flex-col justify-between h-full font-sans">
      
      <div>
        {/* Top Icon & Category */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
            {renderIcon(service.iconName)}
          </div>
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
            {service.categoryName}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-[#0B1F3A] mb-2 leading-snug">
          {service.title}
        </h3>
        <p className="text-sm text-[#475569] leading-relaxed line-clamp-2 mb-4 font-normal">
          {service.shortDescription}
        </p>

        {/* Clean Skills Text Summary */}
        <div className="text-xs font-medium text-[#64748B] mb-5">
          {service.skills.slice(0, 3).join(' · ')}
        </div>
      </div>

      {/* Footer Pricing & Actions */}
      <div className="pt-4 border-t border-[#E2E8F0] space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#64748B] font-medium">Starting from</span>
          <span className="text-base font-extrabold text-[#0B1F3A]">
            ₹{service.startingPriceINR.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link href={`/services/${service.slug}`} className="w-full">
            <Button variant="outline" size="sm" className="w-full">
              View Service
            </Button>
          </Link>
          <Link href={`/request-service?serviceId=${service.id}`} className="w-full">
            <Button 
              variant="primary" 
              size="sm" 
              className="w-full"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Request Service
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
};

