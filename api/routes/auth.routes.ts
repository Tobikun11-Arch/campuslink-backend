import {Router} from 'express';
import multer from 'multer';
import {authController} from '../controllers/auth.controller';
import {validate} from '../middleware/validation';
import {registerDto, verifyDto, loginDto} from '../dtos/auth.dto';
import {authLimiter} from '../middleware/rateLimit';

const router = Router();
const upload = multer({storage: multer.memoryStorage()});

router.post(
  '/register',
  authLimiter,
  upload.single('roleProof'),
  validate(registerDto),
  authController.register
);
router.post('/verify', authLimiter, validate(verifyDto), authController.verify);
router.post('/login', authLimiter, validate(loginDto), authController.login);

export default router;
