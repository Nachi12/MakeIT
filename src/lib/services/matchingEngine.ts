import { Expert, MatchScore, ServiceCategoryId, Service } from '@/types';
import { INITIAL_EXPERTS, INITIAL_SERVICES, INITIAL_CATEGORIES } from '../data/mockData';

export interface MatchingWeights {
  skillMatch: number;      // default 40
  serviceMatch: number;    // default 20
  experienceScore: number; // default 15
  availabilityScore: number; // default 10
  budgetScore: number;     // default 10
  locationScore: number;   // default 5
}

export const DEFAULT_WEIGHTS: MatchingWeights = {
  skillMatch: 40,
  serviceMatch: 20,
  experienceScore: 15,
  availabilityScore: 10,
  budgetScore: 10,
  locationScore: 5
};

export interface ParsedRequirement {
  rawInput: string;
  detectedCategoryId?: ServiceCategoryId;
  detectedServiceId?: string;
  detectedServiceName?: string;
  detectedSkills: string[];
  suggestedActionText: string;
}

/**
 * Intelligent IT Keyword & Intent Extractor
 */
export function parseRequirementText(input: string): ParsedRequirement {
  const text = input.toLowerCase().trim();
  const detectedSkills = new Set<string>();
  let detectedCategoryId: ServiceCategoryId | undefined;
  let detectedServiceId: string | undefined;
  let detectedServiceName: string | undefined;

  // Keyword dictionary mapping
  const skillKeywords: Record<string, string> = {
    'react': 'React',
    'next.js': 'Next.js',
    'nextjs': 'Next.js',
    'node': 'Node.js',
    'nodejs': 'Node.js',
    'express': 'Express.js',
    'typescript': 'TypeScript',
    'ts': 'TypeScript',
    'mongodb': 'MongoDB',
    'mongo': 'MongoDB',
    'postgres': 'PostgreSQL',
    'postgresql': 'PostgreSQL',
    'php': 'PHP',
    'laravel': 'Laravel',
    'mysql': 'MySQL',
    'figma': 'Figma',
    'ux': 'UX Research',
    'ui': 'UI/UX Design',
    'wireframe': 'Wireframing',
    'prototype': 'Prototyping',
    'design system': 'Design Systems',
    'stripe': 'Stripe',
    'api': 'REST APIs',
    'rest': 'REST APIs',
    'auth': 'JWT Auth',
    'saas': 'SaaS Architecture',
    'mvp': 'SaaS & MVP',
    'ecommerce': 'E-Commerce',
    'e-commerce': 'E-Commerce',
    'store': 'E-Commerce',
    'redesign': 'Website Redesign',
    'audit': 'Code Audit'
  };

  Object.entries(skillKeywords).forEach(([kw, canonicalSkill]) => {
    if (text.includes(kw)) {
      detectedSkills.add(canonicalSkill);
    }
  });

  // Intent & Service Detection
  if (text.includes('saas') || text.includes('mvp') || text.includes('product idea') || text.includes('startup app')) {
    detectedCategoryId = 'saas-mvp-development';
    detectedServiceId = 'saas-mvp-development';
  } else if (text.includes('ui') || text.includes('ux') || text.includes('figma') || text.includes('design') || text.includes('wireframe') || text.includes('prototype')) {
    detectedCategoryId = 'ui-ux-design';
    detectedServiceId = 'ui-ux-design';
  } else if (text.includes('php') || text.includes('laravel') || text.includes('legacy php')) {
    detectedCategoryId = 'php-laravel-development';
    detectedServiceId = 'php-laravel-development';
  } else if (text.includes('redesign') || text.includes('outdated website') || text.includes('modernize site')) {
    detectedCategoryId = 'website-redesign';
    detectedServiceId = 'website-redesign';
  } else if (text.includes('api') || text.includes('integration') || text.includes('stripe') || text.includes('webhook')) {
    detectedCategoryId = 'api-development';
    detectedServiceId = 'api-development';
  } else if (text.includes('consult') || text.includes('architecture') || text.includes('code audit') || text.includes('tech stack')) {
    detectedCategoryId = 'technical-consulting';
    detectedServiceId = 'technical-consulting';
  } else if (text.includes('frontend') || text.includes('react') || text.includes('next.js') || text.includes('tailwind')) {
    detectedCategoryId = 'frontend-development';
    detectedServiceId = 'frontend-development';
  } else if (text.includes('backend') || text.includes('node') || text.includes('express') || text.includes('database')) {
    detectedCategoryId = 'backend-development';
    detectedServiceId = 'backend-development';
  } else if (text.includes('full stack') || text.includes('web app') || text.includes('application') || text.includes('portal') || text.includes('ecommerce') || text.includes('store')) {
    detectedCategoryId = 'full-stack-development';
    detectedServiceId = 'full-stack-development';
  } else if (text.includes('website') || text.includes('landing page') || text.includes('corporate site')) {
    detectedCategoryId = 'web-development';
    detectedServiceId = 'website-development';
  } else {
    // Default to Full Stack if general
    detectedCategoryId = 'full-stack-development';
    detectedServiceId = 'full-stack-development';
  }

  if (detectedServiceId) {
    const s = INITIAL_SERVICES.find(srv => srv.id === detectedServiceId);
    if (s) {
      detectedServiceName = s.title;
    }
  }

  // Construct readable action hint
  let suggestedActionText = 'Find Technology Experts';
  if (detectedServiceName) {
    suggestedActionText = `Talk to a ${detectedServiceName} Specialist`;
  } else if (detectedCategoryId) {
    const cat = INITIAL_CATEGORIES.find(c => c.id === detectedCategoryId);
    if (cat) suggestedActionText = `Explore ${cat.name} Specialists`;
  }

  return {
    rawInput: input,
    detectedCategoryId,
    detectedServiceId,
    detectedServiceName,
    detectedSkills: Array.from(detectedSkills),
    suggestedActionText
  };
}

/**
 * Smart Weighted Matching Engine
 */
export function rankExpertsForRequirement(
  parsed: ParsedRequirement,
  allExperts: Expert[] = INITIAL_EXPERTS,
  weights: MatchingWeights = DEFAULT_WEIGHTS,
  userBudgetRange?: string
): MatchScore[] {
  const targetCategory = parsed.detectedCategoryId;
  const targetService = parsed.detectedServiceId;
  const targetSkills = parsed.detectedSkills;

  const totalMaxWeight = weights.skillMatch + weights.serviceMatch + weights.experienceScore + weights.availabilityScore + weights.budgetScore + weights.locationScore;

  const results: MatchScore[] = allExperts.map(expert => {
    let skillScore = 0;
    let serviceScore = 0;
    let expScore = 0;
    let availScore = 0;
    let budgetScore = 0;
    let locScore = 0;

    // 1. Skill Match (max 40)
    const matchedSkills = expert.skills.filter(s => 
      targetSkills.some(ts => ts.toLowerCase() === s.toLowerCase() || s.toLowerCase().includes(ts.toLowerCase()))
    );

    if (targetSkills.length > 0) {
      const matchRatio = matchedSkills.length / Math.max(1, targetSkills.length);
      skillScore = Math.min(weights.skillMatch, Math.round(matchRatio * weights.skillMatch));
    } else {
      // If no explicit skills in query, base on overlap with expert's primary skills within category
      if (expert.categoryId === targetCategory) {
        skillScore = Math.round(weights.skillMatch * 0.75);
      } else {
        skillScore = Math.round(weights.skillMatch * 0.3);
      }
    }

    // 2. Category & Service Match (max 20)
    if (targetService && expert.servicesOffered.includes(targetService)) {
      serviceScore = weights.serviceMatch;
    } else if (targetCategory && expert.categoryId === targetCategory) {
      serviceScore = Math.round(weights.serviceMatch * 0.8);
    } else {
      serviceScore = 0;
    }

    // 3. Experience Score (max 15)
    // Scale linearly from 1 to 12 years
    expScore = Math.min(weights.experienceScore, Math.round((expert.yearsOfExperience / 10) * weights.experienceScore));

    // 4. Availability Score (max 10)
    if (expert.availability === 'Available Now') {
      availScore = weights.availabilityScore;
    } else if (expert.availability === 'Next Week') {
      availScore = Math.round(weights.availabilityScore * 0.7);
    } else {
      availScore = Math.round(weights.availabilityScore * 0.4);
    }

    // 5. Budget Match (max 10)
    budgetScore = Math.round(weights.budgetScore * 0.85);

    // 6. Location/Language (max 5)
    if (expert.location.includes('Bangalore') || expert.location.includes('India')) {
      locScore = weights.locationScore;
    } else {
      locScore = Math.round(weights.locationScore * 0.8);
    }

    const totalRaw = skillScore + serviceScore + expScore + availScore + budgetScore + locScore;
    const finalPercentage = Math.min(99, Math.max(45, Math.round((totalRaw / totalMaxWeight) * 100)));

    // Generate human-friendly match reason
    let matchReason = `Strong ${expert.categoryName} match with ${expert.yearsOfExperience}+ yrs experience.`;
    if (matchedSkills.length > 0) {
      matchReason = `Direct skill match for ${matchedSkills.slice(0, 3).join(', ')}. Rated ${expert.rating}/5.`;
    } else if (serviceScore === weights.serviceMatch) {
      matchReason = `Specializes directly in ${parsed.detectedServiceName || 'this service'}.`;
    }

    return {
      expert,
      matchScore: finalPercentage,
      breakdown: {
        skillMatch: skillScore,
        serviceMatch: serviceScore,
        experienceScore: expScore,
        availabilityScore: availScore,
        budgetScore: budgetScore,
        locationScore: locScore
      },
      matchedSkills,
      matchReason
    };
  });

  // Sort by highest match score descending
  return results.sort((a, b) => b.matchScore - a.matchScore);
}
