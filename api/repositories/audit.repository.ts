import { AuditLogModel } from '../models/AuditLog.model';

export const auditRepository = {
  create: (data: { actorId: string; action: string; targetId?: string; details?: Record<string, unknown> }) =>
    AuditLogModel.create({
      actorId: data.actorId,
      action: data.action,
      targetId: data.targetId,
      details: data.details
    })
};
