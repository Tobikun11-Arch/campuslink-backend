import { Router } from 'express';
import { profileController } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth';
import { defaultLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/:id/follow', authenticate, defaultLimiter, profileController.follow);
router.delete('/:id/unfollow', authenticate, defaultLimiter, profileController.unfollow);

export default router;
