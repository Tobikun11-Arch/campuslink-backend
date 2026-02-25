import { Router } from 'express';
import { eventsController } from '../controllers/events.controller';
import { authenticate } from '../middleware/auth';
import { defaultLimiter } from '../middleware/rateLimit';

const router = Router();

router.get('/', authenticate, defaultLimiter, eventsController.list);
router.post('/', authenticate, defaultLimiter, eventsController.create);

export default router;
