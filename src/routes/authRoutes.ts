import { Router } from 'express';
import { register } from '../controllers/auth/AuthController.js';
import { loginUser } from '../controllers/auth/AuthController.js';
import { resendVerificationEmail } from '../controllers/auth/verifyController.js';
import { loginRateLimiter } from '../middlewares/ratelimit.js';
import  {verifyEmail}  from '../controllers/auth/verifyController.js';
import { RecoverPassword } from '../controllers/auth/RecoverPassword.js';
const router = Router();

router.post('/register', register); 
router.post('/login', loginRateLimiter, loginUser  )
router.get('/verify-email', verifyEmail); 
router.post('/resend-verification', resendVerificationEmail);
router.post('/recover-password', RecoverPassword);
export default router;