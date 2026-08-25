import { db } from '../database/db';

export class ProposalsService {
  static async getAllProposals(filter?: { status?: string }) {
    const where: any = {};
    if (filter?.status) where.status = filter.status;

    const items = await db.proposal.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return items.map(p => ({
      ...p,
      services: JSON.parse(p.services || '[]')
    }));
  }

  static async getProposalById(id: string) {
    const p = await db.proposal.findUnique({ where: { id } });
    if (!p) return null;

    return {
      ...p,
      services: JSON.parse(p.services || '[]')
    };
  }

  static async createProposal(data: any) {
    const id = data.id || `prop-${Date.now()}`;
    const proposal = await db.proposal.create({
      data: {
        id,
        leadId: data.leadId || null,
        projectId: data.projectId || null,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        title: data.title,
        services: JSON.stringify(data.services || []),
        scope: data.scope,
        timeline: data.timeline || '4 Weeks',
        priceINR: Number(data.priceINR || 50000),
        terms: data.terms || 'Standard 30% advance, 70% milestone payment terms.',
        status: data.status || 'DRAFT',
        validUntil: data.validUntil || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    });

    return {
      ...proposal,
      services: JSON.parse(proposal.services)
    };
  }

  static async updateProposalStatus(id: string, status: string) {
    const updated = await db.proposal.update({
      where: { id },
      data: { status }
    });

    return {
      ...updated,
      services: JSON.parse(updated.services)
    };
  }
}
