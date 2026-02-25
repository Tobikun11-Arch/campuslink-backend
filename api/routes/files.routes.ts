import { Router } from 'express';
import multer from 'multer';
import { fileController } from '../controllers/file.controller';
import { authenticate } from '../middleware/auth';
import { uploadLimiter } from '../middleware/rateLimit';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', authenticate, uploadLimiter, upload.single('file'), fileController.upload);

export default router;
