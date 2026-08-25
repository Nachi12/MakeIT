import { db } from '../database/db';

export class ExpertsService {
  static async getAllExperts(filter?: { categoryId?: string; skill?: string; featured?: boolean }) {
    const where: any = {};
    if (filter?.categoryId) where.categoryId = filter.categoryId;
    if (filter?.featured !== undefined) where.featured = filter.featured;

    const items = await db.expert.findMany({
      where,
      orderBy: { rating: 'desc' }
    });

    return items.map(exp => ({
      ...exp,
      skills: JSON.parse(exp.skills || '[]'),
      servicesOffered: JSON.parse(exp.servicesOffered || '[]'),
      languages: JSON.parse(exp.languages || '[]'),
      certifications: JSON.parse(exp.certifications || '[]'),
      portfolio: JSON.parse(exp.portfolio || '[]')
    }));
  }

  static async getExpertById(id: string) {
    const exp = await db.expert.findUnique({ where: { id } });
    if (!exp) return null;

    return {
      ...exp,
      skills: JSON.parse(exp.skills || '[]'),
      servicesOffered: JSON.parse(exp.servicesOffered || '[]'),
      languages: JSON.parse(exp.languages || '[]'),
      certifications: JSON.parse(exp.certifications || '[]'),
      portfolio: JSON.parse(exp.portfolio || '[]')
    };
  }

  static async getExpertBySlug(slug: string) {
    const exp = await db.expert.findUnique({ where: { slug } });
    if (!exp) return null;

    return {
      ...exp,
      skills: JSON.parse(exp.skills || '[]'),
      servicesOffered: JSON.parse(exp.servicesOffered || '[]'),
      languages: JSON.parse(exp.languages || '[]'),
      certifications: JSON.parse(exp.certifications || '[]'),
      portfolio: JSON.parse(exp.portfolio || '[]')
    };
  }

  static async createExpert(data: any) {
    const id = data.id || `exp-${Date.now()}`;
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const created = await db.expert.create({
      data: {
        id,
        slug,
        name: data.name,
        title: data.title || 'Senior Specialist',
        avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        categoryId: data.categoryId || 'full-stack-development',
        categoryName: data.categoryName || 'Software Engineering',
        primaryExpertise: data.primaryExpertise || 'Full Stack Engineering',
        yearsOfExperience: Number(data.yearsOfExperience || 5),
        skills: JSON.stringify(data.skills || ['Full Stack', 'Node.js', 'React']),
        servicesOffered: JSON.stringify(data.servicesOffered || []),
        hourlyRateINR: Number(data.hourlyRateINR || 3000),
        hourlyRateUSD: Number(data.hourlyRateUSD || 40),
        rating: Number(data.rating || 5.0),
        reviewCount: Number(data.reviewCount || 1),
        completedProjects: Number(data.completedProjects || 0),
        location: data.location || 'Bangalore, India',
        languages: JSON.stringify(data.languages || ['English']),
        shortIntro: data.shortIntro || `${data.name} is a verified tech expert.`,
        fullBio: data.fullBio || `${data.name} brings ${data.yearsOfExperience || 5} years of technology execution experience.`,
        availability: data.availability || 'Available Now',
        certifications: JSON.stringify(data.certifications || []),
        portfolio: JSON.stringify(data.portfolio || []),
        verified: data.verified !== undefined ? Boolean(data.verified) : true,
        featured: Boolean(data.featured)
      }
    });

    return {
      ...created,
      skills: JSON.parse(created.skills),
      servicesOffered: JSON.parse(created.servicesOffered),
      languages: JSON.parse(created.languages),
      certifications: JSON.parse(created.certifications || '[]'),
      portfolio: JSON.parse(created.portfolio || '[]')
    };
  }

  static async updateExpert(id: string, data: any) {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.title) updateData.title = data.title;
    if (data.availability) updateData.availability = data.availability;
    if (data.yearsOfExperience !== undefined) updateData.yearsOfExperience = Number(data.yearsOfExperience);
    if (data.hourlyRateINR !== undefined) {
      updateData.hourlyRateINR = Number(data.hourlyRateINR);
      updateData.hourlyRateUSD = Math.round(Number(data.hourlyRateINR) / 75);
    }
    if (data.skills) updateData.skills = JSON.stringify(data.skills);
    if (data.servicesOffered) updateData.servicesOffered = JSON.stringify(data.servicesOffered);
    if (data.verified !== undefined) updateData.verified = Boolean(data.verified);
    if (data.featured !== undefined) updateData.featured = Boolean(data.featured);

    const updated = await db.expert.update({
      where: { id },
      data: updateData
    });

    return {
      ...updated,
      skills: JSON.parse(updated.skills),
      servicesOffered: JSON.parse(updated.servicesOffered),
      languages: JSON.parse(updated.languages),
      certifications: JSON.parse(updated.certifications || '[]'),
      portfolio: JSON.parse(updated.portfolio || '[]')
    };
  }
}
