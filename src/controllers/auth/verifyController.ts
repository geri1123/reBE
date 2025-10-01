import { Request, Response, NextFunction } from 'express';
import { UserRepositoryPrisma } from '../../repositories/user/UserRepositoryPrisma.js';
import { AgencyRepository } from '../../repositories/agency/AgencyRepository.js';
import { EmailVerificationService } from '../../services/AuthServices/verifyEmailService.js';
import  {prisma} from '../../config/prisma.js';
import { NotificationRepository } from '../../repositories/notification/notificationRepository.js';
import { RegistrationRequestRepository } from '../../repositories/registrationRequest/RegistrationRequest.js';
import { NotificationService } from '../../services/Notifications/Notifications.js';
import { SupportedLang , t } from '../../locales/index.js';
const userRepo = new UserRepositoryPrisma(prisma);
const agencyRepo = new AgencyRepository(prisma);
const notificationRepo = new NotificationRepository(prisma);
const registrationRequestRepo = new RegistrationRequestRepository(prisma);
const notificationService = new NotificationService(notificationRepo);
const emailVerificationService = new EmailVerificationService(userRepo, agencyRepo ,registrationRequestRepo, notificationService);


export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
  const language: SupportedLang = res.locals.lang;
  try {
    const token = req.query.token as string;
    await emailVerificationService.verify(token , language);

    res.status(200).json({
      success: true,
     message: t("emailVerified" , language),
    });
  } catch (error) {
    next(error);
  }
}
export async function resendVerificationEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const language: SupportedLang = res.locals.lang;
  try {
    const { identifier } = req.body; 

    await emailVerificationService.resend(identifier, language);

    res.status(200).json({
      success: true,
      message: t("verificationEmailResent", language),
    });
  } catch (error) {
    next(error);
  }
}

