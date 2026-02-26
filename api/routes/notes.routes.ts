import { Router } from 'express';
import multer from 'multer';
import { notesController } from '../controllers/notes.controller';
import { authenticate, requireRole } from '../middleware/auth';
import { uploadLimiter } from '../middleware/rateLimit';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', authenticate, uploadLimiter, notesController.list);
router.post('/', authenticate, uploadLimiter, upload.single('file'), notesController.create);
router.patch('/:id/approve', authenticate, requireRole(['OFFICER', 'PRESIDENT', 'ADMIN']), uploadLimiter, notesController.approve);
router.patch('/:id/reject', authenticate, requireRole(['OFFICER', 'PRESIDENT', 'ADMIN']), uploadLimiter, notesController.reject);

export default router;
