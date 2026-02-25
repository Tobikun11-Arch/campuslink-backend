import { userRepository } from '../repositories/user.repository';
import { reportRepository } from '../repositories/report.repository';
import { auditRepository } from '../repositories/audit.repository';
import { ApiError } from '../utils/errors';

export const adminService = {
  async listPendingRoles() {
    return userRepository.listPendingRoles();
  },

  async approveRole(adminId: string, userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    }

    await userRepository.updateRoleStatus(userId, 'VERIFIED');
    await auditRepository.create({
      actorId: adminId,
      action: 'ROLE_APPROVED',
      targetId: userId
    });
  },

  async rejectRole(adminId: string, userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    }

    await userRepository.updateRoleStatus(userId, 'REJECTED');
    await auditRepository.create({
      actorId: adminId,
      action: 'ROLE_REJECTED',
      targetId: userId
    });
  },

  async listReports() {
    return reportRepository.listOpen();
  },

  async resolveReport(adminId: string, reportId: string) {
    await reportRepository.resolve(reportId);
    await auditRepository.create({
      actorId: adminId,
      action: 'REPORT_RESOLVED',
      targetId: reportId
    });
  }
};
