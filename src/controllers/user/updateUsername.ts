import { NextFunction, Request, Response } from "express";
import { UsernameService } from "../../services/userService/UserNameHistory.js";
import { TooManyRequestsError, UnauthorizedError } from "../../errors/BaseError.js";
import { changeUsernameSchema } from "../../validators/users/updateUsernameSchema.js";

import { handleZodError } from "../../validators/zodErrorFormated.js";
import { ChangeUsernameBody } from "../../validators/users/updateUsernameSchema.js";
import { UsernameHistoryRepository } from "../../repositories/usernameHistory/UsernameHistoryRepository.js";
import { UserRepositoryPrisma } from "../../repositories/user/UserRepositoryPrisma.js";
import {prisma} from "../../config/prisma.js";
import { SupportedLang ,t } from "../../locales/index.js";

const userRepo = new UserRepositoryPrisma(prisma);
const usernameHistoryRepo = new UsernameHistoryRepository(prisma);
const usernameService = new UsernameService(userRepo, usernameHistoryRepo);
export async function changeUsername(
  req: Request<{}, {}, ChangeUsernameBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.userId;
   const language:SupportedLang=res.locals.lang;
  if (!userId) {
    return next(new UnauthorizedError(t("userNotAuthenticated" , language)));
  }

  try {
    const { username } = changeUsernameSchema(language).parse(req.body);

    
    const canUpdate = await usernameService.canUpdateUsername(userId);
    if (!canUpdate) {
  throw new TooManyRequestsError(t('TooManyUsernameRequestsError' , language));
}
    await usernameService.changeUsername(userId, username , language);
    res.json({ success: true, message: (t("successfullyUpdatedUsername" , language)) });
  } catch (err) {
    
      return handleZodError(err, next, language);
   
  }
}
