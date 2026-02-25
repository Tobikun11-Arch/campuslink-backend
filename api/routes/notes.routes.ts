import { Router } from 'express';
import multer from 'multer';
import { notesController } from '../controllers/notes.controller';
import { authenticate } from '../middleware/auth';
import { uploadLimiter } from '../middleware/rateLimit';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', authenticate, uploadLimiter, notesController.list);
router.post('/', authenticate, uploadLimiter, upload.single('file'), notesController.create);

export default router;
