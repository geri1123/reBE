import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../../errors/BaseError.js";
// import { parseLanguageCode } from "../../utils/language.js";
import { NotificationRepository } from "../../repositories/notification/notificationRepository.js";

import { GetNotificationService } from "../../services/Notifications/getNotifications.js";
import { prisma } from "../../config/prisma.js";
import {t} from '../../utils/i18n.js';
import { SupportedLang } from "../../locales/index.js";
const notificationRepo = new NotificationRepository(prisma);
const getNotificationService = new GetNotificationService(notificationRepo);

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  const userId = req.userId;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;

  
 
  // const languageCode = res.locals.lang; 

  const language: SupportedLang = res.locals.lang;
 

  if (!userId) {
     throw new UnauthorizedError(t("userNotAuthenticated" , language));
  }

  try {
    const { notifications, unreadCount } = await getNotificationService.getNotifications(
      userId,
      limit,
      offset,
      language
    );
    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationAsRead(req: Request, res: Response, next: NextFunction) {
  const userId = req.userId;
  const notificationId = parseInt(req.params.id);
 const language: SupportedLang = res.locals.lang;
  if (!userId) {
   throw new UnauthorizedError(t("userNotAuthenticated" , language));
  }

  try {
    await getNotificationService.markAsRead(notificationId);
       res.status(200).json({ success: true, message: t("notificationMarkedRead" , language) });
  } catch (error) {
    next(error);
  }
}