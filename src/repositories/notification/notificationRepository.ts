// repositories/notification/NotificationRepository.ts

import { PrismaClient, NotificationStatus , LanguageCode } from "@prisma/client";
import {
  INotificationRepository,
  NotificationData,
} from "./INotificationRepository.js";

export class NotificationRepository implements INotificationRepository {
  constructor(private prisma: PrismaClient) {}

  async createNotification({ userId, type, translations }: NotificationData) {
    return this.prisma.notification.create({
      data: {
        userId,
        type,
        status: NotificationStatus.unread,
        notificationtranslation: {
          create: translations.map((t) => ({
            languageCode: t.languageCode,
            message: t.message,
          })),
        },
      },
      include: {
        notificationtranslation: true,
      },
    });
  }

  async countUnread(userId: number): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        status: NotificationStatus.unread,
      },
    });
  }
async getNotifications(params: {
  userId: number;
  limit?: number;
  offset?: number;
  languageCode?: LanguageCode;
}): Promise<Array<{ id: number; translations: Array<{ languageCode: LanguageCode; message: string }> }>> {
  const notifications = await this.prisma.notification.findMany({
    where: { userId: params.userId },
    take: params.limit,
    skip: params.offset,
    orderBy: { createdAt: "desc" },
    include: {
      notificationtranslation: {
        where: { languageCode: params.languageCode },
        select: { languageCode: true, message: true },
      },
    },
  });

  
  return notifications.map((n) => ({
    id: n.id,
    
    translations: n.notificationtranslation ?? [],
    
  }));
}
async changeNotificationStatus(notificationId: number, status: NotificationStatus) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { status },
    });
  }
}
