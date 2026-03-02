import {Router} from 'express';
import {notificationsController} from '../controllers/notifications.controller';
import {authenticate, requireRole} from '../middleware/auth';
import {defaultLimiter} from '../middleware/rateLimit';

const router = Router();

router.get('/', authenticate, defaultLimiter, notificationsController.list);
router.post(
  '/',
  authenticate,
  requireRole(['OFFICER', 'PRESIDENT', 'ADMIN']),
  defaultLimiter,
  notificationsController.create
);
router.patch(
  '/:id/read',
  authenticate,
  defaultLimiter,
  notificationsController.markAsRead
);

export default router;
