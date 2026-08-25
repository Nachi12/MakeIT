import { db } from '../database/db';

export class ServicesService {
  static async getAllCategories() {
    return await db.serviceCategory.findMany({
      orderBy: { name: 'asc' }
    });
  }

  static async getAllServices(filter?: { categoryId?: string; featured?: boolean }) {
    const where: any = {};
    if (filter?.categoryId) where.categoryId = filter.categoryId;
    if (filter?.featured !== undefined) where.featured = filter.featured;

    const items = await db.service.findMany({
      where,
      orderBy: { title: 'asc' }
    });

    return items.map(srv => ({
      ...srv,
      skills: JSON.parse(srv.skills || '[]'),
      features: JSON.parse(srv.features || '[]'),
      deliverables: JSON.parse(srv.deliverables || '[]'),
      processSteps: JSON.parse(srv.processSteps || '[]'),
      packages: JSON.parse(srv.packages || '[]')
    }));
  }

  static async getServiceBySlug(slug: string) {
    const srv = await db.service.findUnique({ where: { slug } });
    if (!srv) return null;

    return {
      ...srv,
      skills: JSON.parse(srv.skills || '[]'),
      features: JSON.parse(srv.features || '[]'),
      deliverables: JSON.parse(srv.deliverables || '[]'),
      processSteps: JSON.parse(srv.processSteps || '[]'),
      packages: JSON.parse(srv.packages || '[]')
    };
  }

  static async createService(data: any) {
    const id = data.id || `srv-${Date.now()}`;
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const created = await db.service.create({
      data: {
        id,
        slug,
        categoryId: data.categoryId,
        categoryName: data.categoryName || 'Specialized Services',
        title: data.title,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription || data.shortDescription,
        iconName: data.iconName || 'Sparkles',
        startingPriceINR: Number(data.startingPriceINR || 25000),
        startingPriceUSD: Number(data.startingPriceUSD || Math.round((data.startingPriceINR || 25000) / 75)),
        typicalDelivery: data.typicalDelivery || '2 Weeks',
        expertCount: Number(data.expertCount || 3),
        skills: JSON.stringify(data.skills || []),
        features: JSON.stringify(data.features || []),
        deliverables: JSON.stringify(data.deliverables || []),
        processSteps: JSON.stringify(data.processSteps || []),
        packages: JSON.stringify(data.packages || []),
        featured: Boolean(data.featured),
        seoTitle: data.seoTitle || data.title,
        seoDescription: data.seoDescription || data.shortDescription
      }
    });

    return {
      ...created,
      skills: JSON.parse(created.skills),
      features: JSON.parse(created.features),
      deliverables: JSON.parse(created.deliverables),
      processSteps: JSON.parse(created.processSteps),
      packages: JSON.parse(created.packages)
    };
  }

  static async updateService(id: string, data: any) {
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.shortDescription) updateData.shortDescription = data.shortDescription;
    if (data.fullDescription) updateData.fullDescription = data.fullDescription;
    if (data.startingPriceINR !== undefined) {
      updateData.startingPriceINR = Number(data.startingPriceINR);
      updateData.startingPriceUSD = Math.round(Number(data.startingPriceINR) / 75);
    }
    if (data.categoryId) updateData.categoryId = data.categoryId;
    if (data.categoryName) updateData.categoryName = data.categoryName;
    if (data.typicalDelivery) updateData.typicalDelivery = data.typicalDelivery;
    if (data.skills) updateData.skills = JSON.stringify(data.skills);
    if (data.features) updateData.features = JSON.stringify(data.features);
    if (data.deliverables) updateData.deliverables = JSON.stringify(data.deliverables);
    if (data.featured !== undefined) updateData.featured = Boolean(data.featured);
    if (data.seoTitle) updateData.seoTitle = data.seoTitle;
    if (data.seoDescription) updateData.seoDescription = data.seoDescription;

    const updated = await db.service.update({
      where: { id },
      data: updateData
    });

    return {
      ...updated,
      skills: JSON.parse(updated.skills),
      features: JSON.parse(updated.features),
      deliverables: JSON.parse(updated.deliverables),
      processSteps: JSON.parse(updated.processSteps),
      packages: JSON.parse(updated.packages)
    };
  }
}
