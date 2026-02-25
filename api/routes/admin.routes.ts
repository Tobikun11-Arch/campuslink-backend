import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate, requireRole } from '../middleware/auth';
import { defaultLimiter } from '../middleware/rateLimit';

const router = Router();

router.get('/pending-roles', authenticate, requireRole(['ADMIN']), defaultLimiter, adminController.pendingRoles);
router.post('/roles/:userId/approve', authenticate, requireRole(['ADMIN']), defaultLimiter, adminController.approveRole);
router.post('/roles/:userId/reject', authenticate, requireRole(['ADMIN']), defaultLimiter, adminController.rejectRole);
router.get('/reports', authenticate, requireRole(['ADMIN']), defaultLimiter, adminController.listReports);
router.post('/reports/:reportId/resolve', authenticate, requireRole(['ADMIN']), defaultLimiter, adminController.resolveReport);

export default router;
