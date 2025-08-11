// services/NotificationService.ts

import { Server as SocketIOServer } from 'socket.io';
import { INotificationRepository,
  NotificationTranslationInput } from '../../repositories/notification/INotificationRepository.js';

interface SendNotificationParams {
  userId: number;
  message?: string;
  type?: string;
  io?: SocketIOServer;
  extraData?: Record<string, any>;
  translations?: NotificationTranslationInput[];
}

export class NotificationService {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async sendNotification({
    userId,
    message = '',
    type = 'general',
    io,
    extraData = {},
    translations = [],
  }: SendNotificationParams): Promise<void> {
    try {
      console.log(`[NotificationService] Sending notification to user ${userId}`);

      // fallback translation
      if (translations.length === 0 && message) {
        translations.push({ languageCode: 'en', message });
      }

      const notification = await this.notificationRepo.createNotification({
        userId,
        type,
        translations,
      });

      console.log(`[NotificationService] Created notification ID: ${notification.id}`);

      if (io) {
        const room = `user_${userId}`;
        io.to(room).emit('newNotification', {
          notification,
          message: message || translations[0]?.message,
          type,
          ...extraData,
        });

        const unreadCount = await this.notificationRepo.countUnread(userId);
        io.to(room).emit('notificationCount', unreadCount);

        console.log(`[NotificationService] Unread count sent: ${unreadCount}`);
      }
    } catch (error) {
      console.error(`[NotificationService] Failed to send notification:`, error);
    }
  }
}
