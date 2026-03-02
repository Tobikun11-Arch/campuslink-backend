import { Router } from 'express';
import multer from 'multer';
import { marketplaceController } from '../controllers/marketplace.controller';
import { authenticate } from '../middleware/auth';
import { uploadLimiter } from '../middleware/rateLimit';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', authenticate, uploadLimiter, marketplaceController.list);
router.post('/', authenticate, uploadLimiter, upload.array('images', 5), marketplaceController.create);
router.post('/:id/report', authenticate, uploadLimiter, marketplaceController.report);

export default router;
