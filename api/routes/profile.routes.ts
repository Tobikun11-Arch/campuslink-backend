import { Router } from 'express';
import { profileController } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth';
import { defaultLimiter } from '../middleware/rateLimit';

const router = Router();

router.get('/me', authenticate, defaultLimiter, profileController.getMe);
router.patch('/me', authenticate, defaultLimiter, profileController.updateMe);
router.get('/:id/followers', authenticate, defaultLimiter, profileController.listFollowers);
router.get('/:id/following', authenticate, defaultLimiter, profileController.listFollowing);
router.post('/:id/follow', authenticate, defaultLimiter, profileController.follow);
router.delete('/:id/unfollow', authenticate, defaultLimiter, profileController.unfollow);

export default router;
