import { db } from '../database/db';
import { crmEventBus } from '../events/event-bus';

export class ActivitiesService {
  static async logActivity(data: { leadId?: string; contactId?: string; actorId: string; actorName: string; actorRole: string; type: string; title: string; description: string; metadata?: any }) {
    const activity = await db.activity.create({
      data: {
        leadId: data.leadId || null,
        contactId: data.contactId || null,
        actorId: data.actorId,
        actorName: data.actorName,
        actorRole: data.actorRole,
        type: data.type,
        title: data.title,
        description: data.description,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null
      }
    });

    crmEventBus.broadcast('note.created', activity);

    return activity;
  }

  static async getLeadActivities(leadId: string) {
    return await db.activity.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
