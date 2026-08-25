import { db } from '../database/db';
import { crmEventBus } from '../events/event-bus';

export class FollowUpsService {
  static async scheduleFollowUp(data: { leadId: string; contactId?: string; assignedTo: string; assignedToName: string; scheduledAt: string; reason: string; priority?: string }) {
    const followUp = await db.followUp.create({
      data: {
        leadId: data.leadId,
        contactId: data.contactId || null,
        assignedTo: data.assignedTo,
        assignedToName: data.assignedToName,
        scheduledAt: new Date(data.scheduledAt),
        reason: data.reason,
        priority: data.priority || 'MEDIUM',
        status: 'PENDING'
      }
    });

    // Update nextFollowUpAt on Lead
    await db.lead.update({
      where: { id: data.leadId },
      data: { nextFollowUpAt: new Date(data.scheduledAt) }
    });

    // Log Activity
    await db.activity.create({
      data: {
        leadId: data.leadId,
        contactId: data.contactId || null,
        actorId: data.assignedTo,
        actorName: data.assignedToName,
        actorRole: 'SALES',
        type: 'Follow-up',
        title: `Follow-up scheduled for ${new Date(data.scheduledAt).toLocaleString()}`,
        description: `Reason: ${data.reason}`
      }
    });

    crmEventBus.broadcast('followup.created', followUp);

    return followUp;
  }

  static async completeFollowUp(id: string) {
    const updated = await db.followUp.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });

    crmEventBus.broadcast('followup.completed', updated);
    return updated;
  }

  static async getPendingFollowUps(userId?: string) {
    return await db.followUp.findMany({
      where: { status: 'PENDING' },
      include: {
        lead: { include: { requirement: true } },
        contact: true
      },
      orderBy: { scheduledAt: 'asc' }
    });
  }
}
