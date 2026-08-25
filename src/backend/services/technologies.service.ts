import { db } from '../database/db';

export class TechnologiesService {
  static async getAllTechnologies() {
    return await db.technology.findMany({
      orderBy: { name: 'asc' }
    });
  }

  static async createTechnology(data: { name: string; category: string; description?: string; iconName?: string; popular?: boolean }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return await db.technology.create({
      data: {
        name: data.name,
        slug,
        category: data.category || 'General',
        description: data.description || '',
        iconName: data.iconName || 'Code2',
        popular: Boolean(data.popular)
      }
    });
  }

  static async updateTechnology(id: string, data: any) {
    const updateData: any = {};
    if (data.name) {
      updateData.name = data.name;
      updateData.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    if (data.category) updateData.category = data.category;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.iconName) updateData.iconName = data.iconName;
    if (data.popular !== undefined) updateData.popular = Boolean(data.popular);

    return await db.technology.update({
      where: { id },
      data: updateData
    });
  }

  static async deleteTechnology(id: string) {
    return await db.technology.delete({ where: { id } });
  }
}
