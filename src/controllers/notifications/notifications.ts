import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../../errors/BaseError";
import { parseLanguageCode } from "../../utils/language";
import { NotificationRepository } from "../../repositories/notification/notificationRepository";
import { GetNotificationService } from "../../services/Notifications/getNotifications";
import { prisma } from "../../config/prisma";

const notificationRepo = new NotificationRepository(prisma);
const getNotificationService = new GetNotificationService(notificationRepo);

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  const userId = req.userId;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;

  // This returns LanguageCode enum value, not string
  const languageCode = parseLanguageCode(req.params.lang);

  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  try {
    const { notifications, unreadCount } = await getNotificationService.getNotifications(
      userId,
      limit,
      offset,
      languageCode
    );
    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationAsRead(req: Request, res: Response, next: NextFunction) {
  const userId = req.userId;
  const notificationId = parseInt(req.params.id);

  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  try {
    await getNotificationService.markAsRead(notificationId);
    res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    next(error);
  }
}