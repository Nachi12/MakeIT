import { db } from '../database/db';
import { TelephonyService } from '../telephony/telephony.service';
import { CallState } from '../telephony/telephony.interface';
import { crmEventBus } from '../events/event-bus';

export class CallsService {
  static async initiateCall(params: { leadId?: string; contactId?: string; agentId: string; agentName: string; toNumber: string }) {
    // 1. Initiate via active TelephonyProvider
    const providerResult = await TelephonyService.initiateCall({
      leadId: params.leadId,
      contactId: params.contactId,
      agentId: params.agentId,
      agentName: params.agentName,
      toNumber: params.toNumber
    });

    if (!providerResult.success) {
      throw new Error(providerResult.message || 'Call initiation failed');
    }

    // 2. Create Call record in DB
    const provider = TelephonyService.getActiveProvider().name;
    const callRecord = await db.call.create({
      data: {
        leadId: params.leadId || null,
        contactId: params.contactId || null,
        agentId: params.agentId,
        agentName: params.agentName,
        provider,
        providerCallId: providerResult.providerCallId,
        direction: 'OUTBOUND',
        status: providerResult.status,
        startedAt: new Date()
      }
    });

    // 3. Broadcast call.started event
    crmEventBus.broadcast('call.started', callRecord);

    return callRecord;
  }

  static async updateCallState(id: string, status: CallState, durationSeconds?: number, outcome?: string, notes?: string) {
    const current = await db.call.findUnique({ where: { id } });
    if (!current) throw new Error('Call record not found');

    const updateData: any = {
      status,
      ...(status === 'ANSWERED' && !current.answeredAt ? { answeredAt: new Date() } : {}),
      ...(status === 'ENDED' || status === 'FAILED' || status === 'MISSED' ? { endedAt: new Date() } : {}),
      ...(durationSeconds !== undefined ? { durationSeconds } : {}),
      ...(outcome ? { outcome } : {}),
      ...(notes ? { notes } : {})
    };

    const updated = await db.call.update({
      where: { id },
      data: updateData
    });

    // Update lastContactedAt on contact/lead
    if (updated.contactId) {
      await db.contact.update({
        where: { id: updated.contactId },
        data: { lastContactedAt: new Date() }
      });
    }

    if (updated.leadId) {
      await db.lead.update({
        where: { id: updated.leadId },
        data: {
          lastContactedAt: new Date(),
          ...(status === 'ANSWERED' ? { status: 'CONTACTED' } : {})
        }
      });
    }

    // Log Activity
    if (status === 'ENDED' || status === 'ANSWERED') {
      await db.activity.create({
        data: {
          leadId: updated.leadId,
          contactId: updated.contactId,
          actorId: updated.agentId,
          actorName: updated.agentName,
          actorRole: 'SALES',
          type: 'Call',
          title: `Outbound Call (${status}) — ${durationSeconds || 0}s`,
          description: outcome ? `Outcome: ${outcome}. ${notes || ''}` : 'Outbound call executed.'
        }
      });
    }

    // Broadcast SSE real-time event
    const eventType = status === 'ANSWERED' ? 'call.answered' : status === 'ENDED' ? 'call.ended' : 'call.ringing';
    crmEventBus.broadcast(eventType as any, updated);

    return updated;
  }

  static async getCallHistory(filter?: { leadId?: string; contactId?: string }) {
    const where: any = {};
    if (filter?.leadId) where.leadId = filter.leadId;
    if (filter?.contactId) where.contactId = filter.contactId;

    return await db.call.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }
}
