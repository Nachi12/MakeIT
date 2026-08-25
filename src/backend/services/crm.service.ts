import { db } from '../database/db';
import { crmEventBus } from '../events/event-bus';

export class CrmService {
  // CRM Dashboard Metrics: "Who should I contact right now?"
  static async getDashboardMetrics(userId?: string) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    // Follow-ups today
    const followUpsToday = await db.followUp.findMany({
      where: {
        scheduledAt: { gte: startOfToday, lte: endOfToday },
        status: 'PENDING'
      },
      include: {
        lead: { include: { requirement: true } },
        contact: true
      },
      orderBy: { scheduledAt: 'asc' }
    });

    // Overdue follow-ups
    const overdueFollowUps = await db.followUp.findMany({
      where: {
        scheduledAt: { lt: startOfToday },
        status: 'PENDING'
      },
      include: {
        lead: { include: { requirement: true } },
        contact: true
      },
      orderBy: { scheduledAt: 'asc' }
    });

    // Uncontacted leads
    const uncontactedLeads = await db.lead.findMany({
      where: {
        status: { in: ['NEW', 'UNCONTACTED'] }
      },
      include: { requirement: true, contact: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // High / Urgent Priority leads
    const highPriorityLeads = await db.lead.findMany({
      where: {
        priority: { in: ['HIGH', 'URGENT'] },
        status: { notIn: ['WON', 'LOST', 'DO_NOT_CONTACT'] }
      },
      include: { requirement: true, contact: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Recent calls
    const recentCalls = await db.call.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { contact: true, lead: { include: { requirement: true } } }
    });

    // Pipeline distribution counts
    const pipelineCounts = await db.lead.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    return {
      metrics: {
        followUpsTodayCount: followUpsToday.length,
        overdueFollowUpsCount: overdueFollowUps.length,
        uncontactedLeadsCount: uncontactedLeads.length,
        highPriorityCount: highPriorityLeads.length,
        totalActiveLeads: await db.lead.count({ where: { status: { notIn: ['WON', 'LOST'] } } })
      },
      followUpsToday,
      overdueFollowUps,
      uncontactedLeads,
      highPriorityLeads,
      recentCalls,
      pipelineCounts
    };
  }

  // Duplicate Check API
  static async checkForDuplicate(phone: string, email?: string) {
    let existingContact = null;
    if (phone) {
      existingContact = await db.contact.findUnique({ where: { phone } });
    }
    if (!existingContact && email) {
      existingContact = await db.contact.findFirst({ where: { email } });
    }

    return existingContact;
  }

  // Quick Add Client + Lead
  static async quickAddClient(data: { name: string; phone: string; email?: string; companyName?: string; source?: string; requirementText?: string; ownerId?: string; ownerName?: string }) {
    // 1. Check duplicate
    const existing = await this.checkForDuplicate(data.phone, data.email);
    if (existing) {
      return { isDuplicate: true, contact: existing };
    }

    // 2. Create Company if provided
    let company = null;
    if (data.companyName) {
      company = await db.company.findFirst({ where: { name: data.companyName } });
      if (!company) {
        company = await db.company.create({
          data: {
            name: data.companyName,
            email: data.email,
            phone: data.phone,
            source: data.source || 'Manual'
          }
        });
      }
    }

    // 3. Create Contact
    const contact = await db.contact.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        companyId: company?.id || null,
        companyName: data.companyName || null,
        source: data.source || 'Manual Entry',
        ownerId: data.ownerId || 'usr-admin-1',
        ownerName: data.ownerName || 'Platform Operations Admin',
        status: 'ACTIVE'
      }
    });

    // 4. Create Requirement & Lead
    const reqId = `req-crm-${Date.now()}`;
    const requirement = await db.requirement.create({
      data: {
        id: reqId,
        rawInput: data.requirementText || `Inquiry from ${data.name}`,
        projectType: 'General IT Inquiry',
        detectedSkills: JSON.stringify(['General Inquiry']),
        budgetRange: 'Flexible',
        timeline: 'ASAP',
        preferredContact: 'Phone',
        customerName: data.name,
        customerEmail: data.email || 'client@example.com',
        customerPhone: data.phone,
        companyName: data.companyName || '',
        details: data.requirementText || `Inquiry from ${data.name}`
      }
    });

    const leadId = `lead-crm-${Date.now()}`;
    const lead = await db.lead.create({
      data: {
        id: leadId,
        requirementId: requirement.id,
        contactId: contact.id,
        companyId: company?.id || null,
        status: 'NEW',
        priority: 'HIGH',
        source: data.source || 'Manual Entry',
        ownerId: data.ownerId || 'usr-admin-1',
        ownerName: data.ownerName || 'Platform Operations Admin',
        matchedExpertIds: JSON.stringify([]),
        estimatedValueINR: 50000,
        notes: JSON.stringify([`Created manually by ${data.ownerName || 'Sales Admin'}`])
      },
      include: { requirement: true, contact: true }
    });

    // 5. Broadcast real-time CRM event
    crmEventBus.broadcast('lead.created', lead);
    crmEventBus.broadcast('contact.created', contact);

    return { isDuplicate: false, contact, lead };
  }

  // Contacts Catalog
  static async getAllContacts() {
    return await db.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  // Companies Catalog
  static async getAllCompanies() {
    return await db.company.findMany({
      orderBy: { name: 'asc' }
    });
  }
}
