import { Router } from 'express';
import { notificationsController } from '../controllers/notifications.controller';
import { authenticate } from '../middleware/auth';
import { defaultLimiter } from '../middleware/rateLimit';

const router = Router();

router.get('/', authenticate, defaultLimiter, notificationsController.list);

export default router;
