import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth';
import { uploadLimiter } from '../middleware/rateLimit';
import { lostFoundController } from '../controllers/lostfound.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', authenticate, uploadLimiter, lostFoundController.list);
router.post('/', authenticate, uploadLimiter, upload.single('photo'), lostFoundController.create);
router.get('/:id', authenticate, uploadLimiter, lostFoundController.getById);
router.patch('/:id/retrieve', authenticate, uploadLimiter, lostFoundController.markRetrieved);

export default router;
