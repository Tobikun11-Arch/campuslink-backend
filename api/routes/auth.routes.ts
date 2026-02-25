import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation';
import { registerDto, verifyDto, loginDto } from '../dtos/auth.dto';
import { authLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/register', authLimiter, validate(registerDto), authController.register);
router.post('/verify', authLimiter, validate(verifyDto), authController.verify);
router.post('/login', authLimiter, validate(loginDto), authController.login);

export default router;
