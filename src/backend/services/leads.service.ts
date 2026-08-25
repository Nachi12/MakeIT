import { db } from '../database/db';

export class LeadsService {
  static async getAllLeads(filter?: { status?: string }) {
    const where: any = {};
    if (filter?.status) where.status = filter.status;

    const items = await db.lead.findMany({
      where,
      include: { requirement: true },
      orderBy: { createdAt: 'desc' }
    });

    return items.map(l => ({
      ...l,
      matchedExpertIds: JSON.parse(l.matchedExpertIds || '[]'),
      notes: JSON.parse(l.notes || '[]'),
      requirement: {
        ...l.requirement,
        detectedSkills: JSON.parse(l.requirement.detectedSkills || '[]')
      }
    }));
  }

  static async getLeadById(id: string) {
    const l = await db.lead.findUnique({
      where: { id },
      include: { requirement: true }
    });
    if (!l) return null;

    return {
      ...l,
      matchedExpertIds: JSON.parse(l.matchedExpertIds || '[]'),
      notes: JSON.parse(l.notes || '[]'),
      requirement: {
        ...l.requirement,
        detectedSkills: JSON.parse(l.requirement.detectedSkills || '[]')
      }
    };
  }

  static async updateLeadStatus(id: string, status: string, assignedExpertId?: string, note?: string) {
    const current = await db.lead.findUnique({ where: { id } });
    if (!current) throw new Error('Lead not found');

    const existingNotes = JSON.parse(current.notes || '[]');
    if (note) {
      existingNotes.push(note);
    }

    const updated = await db.lead.update({
      where: { id },
      data: {
        status,
        assignedExpertId: assignedExpertId || current.assignedExpertId,
        notes: JSON.stringify(existingNotes)
      },
      include: { requirement: true }
    });

    return {
      ...updated,
      matchedExpertIds: JSON.parse(updated.matchedExpertIds || '[]'),
      notes: JSON.parse(updated.notes || '[]'),
      requirement: {
        ...updated.requirement,
        detectedSkills: JSON.parse(updated.requirement.detectedSkills || '[]')
      }
    };
  }
}
