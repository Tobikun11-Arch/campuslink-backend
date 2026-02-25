import { Router } from 'express';
import { sectionsController } from '../controllers/sections.controller';
import { authenticate } from '../middleware/auth';
import { defaultLimiter } from '../middleware/rateLimit';
import { validate } from '../middleware/validation';
import { joinSectionDto } from '../dtos/section.dto';

const router = Router();

router.post('/:id/invite', authenticate, defaultLimiter, sectionsController.createInvite);
router.post('/:id/join', authenticate, defaultLimiter, validate(joinSectionDto), sectionsController.join);

export default router;
