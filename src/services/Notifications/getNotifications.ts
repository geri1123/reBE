import { INotificationRepository } from "../../repositories/notification/INotificationRepository";
import { LanguageCode } from "@prisma/client";

export class GetNotificationService {
  constructor(private notificationRepo: INotificationRepository) {}

  async getNotifications(
    userId: number,
    limit = 10,
    offset = 0,
    languageCode: LanguageCode = LanguageCode.en
  ) {
    const [notifications, unreadCount] = await Promise.all([
      this.notificationRepo.getNotifications({
        userId,
        limit,
        offset,
        languageCode,
      }),
      this.notificationRepo.countUnread(userId),
    ]);

    if (languageCode !== LanguageCode.en) {
      // Defensive check for missing or empty translations
      const missingTranslationIds = notifications
        .filter((n) => !(n.translations?.length))
        .map((n) => n.id);

      if (missingTranslationIds.length > 0) {
        const fallbackNotifications = await this.notificationRepo.getNotifications({
          userId,
          limit,
          offset,
          languageCode: LanguageCode.en,
        });

        const fallbackMap = new Map(fallbackNotifications.map(n => [n.id, n.translations ?? []]));

        for (const notification of notifications) {
          if (!(notification.translations?.length) && fallbackMap.has(notification.id)) {
            notification.translations = fallbackMap.get(notification.id)!;
          }
        }
      }
    }

    return { notifications, unreadCount };
  }

  async markAsRead(notificationId: number): Promise<void> {
    await this.notificationRepo.changeNotificationStatus(notificationId, "read");
  }
}


// import { INotificationRepository } from "../../repositories/notification/INotificationRepository";
// import { LanguageCode } from "@prisma/client";

// export class GetNotificationService {
//   constructor(private notificationRepo: INotificationRepository) {}

//   async getNotifications(
//     userId: number,
//     limit = 10,
//     offset = 0,
//     languageCode: LanguageCode = LanguageCode.en
//   ) {
//     const [notifications, unreadCount] = await Promise.all([
//       this.notificationRepo.getNotifications({
//         userId,
//         limit,
//         offset,
//         languageCode,
//       }),
//       this.notificationRepo.countUnread(userId),
//     ]);

//     if (languageCode !== LanguageCode.en) {
//       const missingTranslationIds = notifications
//         .filter((n) => n.translations.length === 0)
//         .map((n) => n.id);

//       if (missingTranslationIds.length > 0) {
//         const fallbackNotifications = await this.notificationRepo.getNotifications({
//           userId,
//           limit,
//           offset,
//           languageCode: LanguageCode.en,
//         });

//         const fallbackMap = new Map(fallbackNotifications.map(n => [n.id, n.translations]));

//         for (const notification of notifications) {
//           if (notification.translations.length === 0 && fallbackMap.has(notification.id)) {
//             notification.translations = fallbackMap.get(notification.id)!;
//           }
//         }
//       }
//     }

//     return { notifications, unreadCount };
//   }

//   async markAsRead(notificationId: number): Promise<void> {
//     await this.notificationRepo.changeNotificationStatus(notificationId, "read");
//   }
// }
