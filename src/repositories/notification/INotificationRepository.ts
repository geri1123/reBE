import { LanguageCode, NotificationStatus } from "@prisma/client";

export interface NotificationTranslationInput {
  languageCode: LanguageCode;  
  message: string;
}

export interface NotificationData {
  userId: number;
  type: string;
  translations: NotificationTranslationInput[];
}

export interface INotificationRepository {
  createNotification(data: NotificationData): Promise<any>;
  countUnread(userId: number): Promise<number>;
  getNotifications(params: {
    userId: number;
    limit?: number;
    offset?: number;
    languageCode?: LanguageCode; 
  }): Promise<any[]>;
  changeNotificationStatus(notificationId: number, status: NotificationStatus): Promise<any>;
}
