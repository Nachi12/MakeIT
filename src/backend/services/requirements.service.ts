import { db } from '../database/db';
import { parseRequirementText, rankExpertsForRequirement, DEFAULT_WEIGHTS } from '@/lib/services/matchingEngine';
import { ExpertsService } from './experts.service';

export class RequirementsService {
  static async submitRequirement(data: any) {
    const rawInput = data.rawInput || data.details || '';
    const parsed = parseRequirementText(rawInput);

    const reqId = data.id || `req-${Date.now()}`;
    const detectedSkills = data.detectedSkills?.length ? data.detectedSkills : parsed.detectedSkills;

    const requirement = await db.requirement.create({
      data: {
        id: reqId,
        rawInput,
        projectType: data.projectType || 'Web Application',
        detectedCategory: data.detectedCategory || parsed.detectedCategoryId,
        detectedServiceId: data.detectedServiceId || parsed.detectedServiceId,
        detectedSkills: JSON.stringify(detectedSkills),
        budgetRange: data.budgetRange || 'Not sure',
        timeline: data.timeline || '2–4 weeks',
        preferredContact: data.preferredContact || 'WhatsApp',
        customerName: data.customerName || 'Valued Client',
        customerEmail: data.customerEmail || 'client@example.com',
        customerPhone: data.customerPhone || '',
        companyName: data.companyName || '',
        details: data.details || rawInput
      }
    });

    // Auto-rank experts using backend matching algorithm
    const allExperts = await ExpertsService.getAllExperts();
    const rankedExperts = rankExpertsForRequirement(parsed, allExperts as any, DEFAULT_WEIGHTS, requirement.budgetRange);
    const topExpertIds = rankedExperts.slice(0, 3).map(m => m.expert.id);

    // Create associated Lead record in DB
    const leadId = `lead-${Date.now()}`;
    const lead = await db.lead.create({
      data: {
        id: leadId,
        requirementId: requirement.id,
        status: 'EXPERT_MATCHED',
        matchedExpertIds: JSON.stringify(topExpertIds),
        assignedExpertId: topExpertIds[0] || null,
        estimatedValueINR: 55000,
        notes: JSON.stringify([
          `Parsed requirement: ${requirement.projectType || 'IT Service'}. Top match: ${rankedExperts[0]?.expert.name || 'Candidate'} (${rankedExperts[0]?.matchScore || 95}% score)`
        ])
      }
    });

    return {
      requirement: {
        ...requirement,
        detectedSkills: JSON.parse(requirement.detectedSkills)
      },
      lead: {
        ...lead,
        matchedExpertIds: JSON.parse(lead.matchedExpertIds),
        notes: JSON.parse(lead.notes || '[]')
      },
      rankedExperts
    };
  }

  static async getRequirementById(id: string) {
    const req = await db.requirement.findUnique({
      where: { id },
      include: { leads: true }
    });
    if (!req) return null;

    return {
      ...req,
      detectedSkills: JSON.parse(req.detectedSkills || '[]')
    };
  }
}
