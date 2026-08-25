import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/backend/database/db';
import { requireAuth } from '@/backend/middleware/auth';

export async function GET(req: NextRequest) {
  const authErr = requireAuth(req, ['ADMIN', 'SUPER_ADMIN']);
  if (authErr) return authErr;

  try {
    const totalRequirements = await db.requirement.count();
    const totalLeads = await db.lead.count();
    const qualifiedLeads = await db.lead.count({
      where: { status: { in: ['QUALIFIED', 'TECHNICAL_REVIEW', 'EXPERT_MATCHED', 'PROPOSAL_SENT', 'WON'] } }
    });
    const activeProjects = await db.project.count({
      where: { status: { in: ['Planning', 'In Progress', 'Review', 'Revision'] } }
    });
    const completedProjects = await db.project.count({
      where: { status: 'Completed' }
    });
    const totalExperts = await db.expert.count();
    const totalServices = await db.service.count();
    const pendingProposals = await db.proposal.count({ where: { status: 'SENT' } });
    const upcomingAppointments = await db.appointment.count({ where: { status: 'SCHEDULED' } });

    // Actual revenue sum from database
    const projects = await db.project.findMany({ select: { budgetINR: true } });
    const totalRevenueINR = projects.reduce((sum, p) => sum + (p.budgetINR || 0), 0);

    const recentRequirements = await db.requirement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const recentAuditLogs = await db.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8
    });

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalRequirements,
          totalLeads,
          qualifiedLeads,
          activeProjects,
          completedProjects,
          totalExperts,
          totalServices,
          pendingProposals,
          upcomingAppointments,
          totalRevenueINR
        },
        recentRequirements,
        recentAuditLogs
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
