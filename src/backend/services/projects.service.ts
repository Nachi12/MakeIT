import { db } from '../database/db';

export class ProjectsService {
  static async getAllProjects(filter?: { status?: string }) {
    const where: any = {};
    if (filter?.status) where.status = filter.status;

    return await db.project.findMany({
      where,
      include: {
        milestones: true,
        members: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getProjectById(id: string) {
    return await db.project.findUnique({
      where: { id },
      include: {
        milestones: true,
        members: true
      }
    });
  }

  static async createProject(data: any) {
    const id = data.id || `proj-${Date.now()}`;
    const project = await db.project.create({
      data: {
        id,
        title: data.title,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        expertId: data.expertId || 'exp-1',
        expertName: data.expertName || 'Assigned Expert',
        expertAvatar: data.expertAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        serviceId: data.serviceId || 'full-stack-development',
        serviceTitle: data.serviceTitle || 'Software Development',
        startDate: data.startDate || new Date().toISOString().split('T')[0],
        deadline: data.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        budgetINR: Number(data.budgetINR || 75000),
        status: data.status || 'Planning',
        notes: data.notes || 'Project initialized.'
      }
    });

    // Add primary member
    await db.projectMember.create({
      data: {
        projectId: id,
        role: 'Lead Architect',
        expertId: project.expertId,
        expertName: project.expertName,
        expertTitle: 'Lead Technology Specialist',
        expertAvatar: project.expertAvatar
      }
    });

    return await this.getProjectById(id);
  }

  static async updateProjectStatus(id: string, status: string, notes?: string) {
    return await db.project.update({
      where: { id },
      data: {
        status,
        ...(notes ? { notes } : {})
      },
      include: {
        milestones: true,
        members: true
      }
    });
  }

  static async addProjectMember(projectId: string, memberData: { role: string; expertId: string; expertName: string; expertTitle: string; expertAvatar: string }) {
    return await db.projectMember.create({
      data: {
        projectId,
        role: memberData.role,
        expertId: memberData.expertId,
        expertName: memberData.expertName,
        expertTitle: memberData.expertTitle,
        expertAvatar: memberData.expertAvatar
      }
    });
  }

  static async addMilestone(projectId: string, milestone: { title: string; description: string; dueDate: string; amountINR: number }) {
    return await db.projectMilestone.create({
      data: {
        projectId,
        title: milestone.title,
        description: milestone.description,
        dueDate: milestone.dueDate,
        amountINR: Number(milestone.amountINR),
        status: 'Pending'
      }
    });
  }
}
