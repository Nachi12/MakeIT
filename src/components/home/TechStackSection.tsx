'use client';

import React from 'react';
import { Reveal, StaggerContainer, StaggerItem } from '../ui/Motion';

export const TechStackSection: React.FC = () => {

  const techCategories = [
    { domain: "FRONTEND", items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML5/CSS3'] },
    { domain: "BACKEND & APIS", items: ['Node.js', 'Express.js', 'PHP', 'Laravel', 'RESTful APIs'] },
    { domain: "DATABASE & CLOUD", items: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Docker'] },
    { domain: "DESIGN & UX", items: ['Figma', 'Design Systems', 'Wireframing', 'Prototyping'] }
  ];

  return (
    <section className="py-20 lg:py-24 bg-[#F7F3E8] border-b border-[#E5E0D5] font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <Reveal direction="up" distance={16}>
          <div className="space-y-3 text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] block">
              MODERN TECHNOLOGY STACK
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight font-heading">
              Built With Proven Technologies
            </h2>
            <p className="text-sm text-[#4A4A45]">
              Modern frameworks, languages, databases, and design platforms.
            </p>
          </div>
        </Reveal>

        {/* Organized Editorial Tech Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {techCategories.map((cat) => (
            <StaggerItem key={cat.domain}>
              <div 
                className="p-6 rounded-3xl bg-white border border-[#E5E0D5] space-y-3 hover:border-[#F97316] hover:-translate-y-1 transition-all duration-200 h-full"
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-[#787870] block">
                  {cat.domain}
                </span>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((tech) => (
                    <span 
                      key={tech}
                      className="px-3 py-1 rounded-full bg-[#F7F3E8] border border-[#E5E0D5] text-xs font-bold text-[#111111] hover:border-[#CBD5E1] transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
};
