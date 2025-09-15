// import rateLimit from 'express-rate-limit';
// import { t } from '../utils/i18n';

// export const loginRateLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, 
//   max: 5, 
//   message: {
//     message: 'Too many login attempts from this IP, please try again after 15 minutes.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });
import { Request , Response } from 'express';
import rateLimit from 'express-rate-limit';
import { t } from '../utils/i18n.js';
import { SupportedLang } from '../locales/index.js';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, 
  message: (req:Request, res:Response) => {
    const language: SupportedLang = res.locals.lang;
    return { message: t('tooManyLoginAttempts', language) };
  },
  standardHeaders: true,
  legacyHeaders: false,
});