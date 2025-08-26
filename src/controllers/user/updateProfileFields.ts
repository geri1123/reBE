import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../errors/BaseError.js';
import { handleZodError } from '../../validators/zodErrorFormated.js';
import { UserRepositoryPrisma } from '../../repositories/user/UserRepositoryPrisma.js';
import { ProfileInfoService } from '../../services/userService/profileInfoService.js';
import { updateProfileSchema } from '../../validators/users/updateProfileSchema.js';
import { prisma } from '../../config/prisma.js';
import { SupportedLang } from "../../locales/index.js";
const userRepo = new UserRepositoryPrisma(prisma);
const profileInfoService = new ProfileInfoService(userRepo);
import { t } from '../../utils/i18n.js';
export async function updateProfileFields(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.userId;
  const language:SupportedLang=res.locals.lang;
  if (!userId) return next(new UnauthorizedError(t("userNotAuthenticated" , language)));

  try {
    const data = updateProfileSchema(language).parse(req.body);

    const messages: string[] = [];

    if (data.firstName !== undefined) {
      await profileInfoService.updateFirstNlastN(userId,data.firstName);
     
      messages.push(t("firstNameUpdated" , language));
    }
     if (data.lastName !== undefined) {
        await profileInfoService.updateLName(userId, data.lastName);
        messages.push(t('lastNameUpdated') , language);
      }

    if (data.aboutMe !== undefined) {
      await profileInfoService.updateAboutMe(userId, data.aboutMe);
      messages.push(t("aboutMeUpdated"  ,language));
    }

    if (data.phone !== undefined) {
      await profileInfoService.updateUserPhone(userId, data.phone);
      messages.push(t('phoneUpdated' , language));
    }

    res.json({ success: true, message: messages.join(', ') });
  } catch (err) {
    return handleZodError(err, next);
  }
}
