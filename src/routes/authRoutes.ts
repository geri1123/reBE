import { Router } from 'express';
import { register } from '../controllers/auth/AuthController.js';
import { loginUser } from '../controllers/auth/AuthController.js';
import { resendVerificationEmail } from '../controllers/auth/verifyController.js';
import { loginRateLimiter } from '../middlewares/ratelimit.js';
import  {verifyEmail}  from '../controllers/auth/verifyController.js';

const router = Router();

router.post('/register', register); 
router.post('/login', loginRateLimiter, loginUser  )
router.get('/verify-email', verifyEmail); 
router.post('/resend-verification', resendVerificationEmail);
export default router;