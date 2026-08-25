import { db } from '../database/db';
import { UserRole } from '@/types';

export interface CreateAuditLogInput {
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  details?: string;
  ipAddress?: string;
}

export class AuditService {
  static async log(input: CreateAuditLogInput) {
    try {
      return await db.auditLog.create({
        data: {
          userId: input.userId,
          userName: input.userName,
          userRole: input.userRole,
          action: input.action,
          entity: input.entity,
          entityId: input.entityId,
          details: input.details,
          ipAddress: input.ipAddress
        }
      });
    } catch (e) {
      console.error('Failed to log audit event:', e);
    }
  }

  static async getLogs(limit = 100) {
    return await db.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }
}
