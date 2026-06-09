'use server';

import prisma from '@/lib/prisma';

export async function logAudit(params: {
  action: string;
  entity: string;
  entityId?: string;
  detail?: string;
  userId?: string;
  ip?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        action: params.action,
        entity: params.entity,
        entityId: params.entityId || null,
        detail: params.detail || null,
        userId: params.userId || null,
        ip: params.ip || null,
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error logging audit:', error);
    return { success: false };
  }
}

export async function getAuditLogs(params?: {
  entity?: string;
  entityId?: string;
  userId?: string;
  page?: number;
  pageSize?: number;
}) {
  try {
    const { entity, entityId, userId, page = 1, pageSize = 50 } = params || {};
    const where: any = {};
    if (entity) where.entity = entity;
    if (entityId) where.entityId = entityId;
    if (userId) where.userId = userId;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { user: { select: { name: true } } },
      }),
      prisma.auditLog.count({ where }),
    ]);
    return { success: true, logs, total, page, pageSize };
  } catch (error) {
    console.error('Error getting audit logs:', error);
    return { success: false, error: 'Failed to get audit logs' };
  }
}
