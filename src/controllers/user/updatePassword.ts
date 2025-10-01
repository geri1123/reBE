import { Request, Response, NextFunction } from "express";
import { PasswordService } from "../../services/userService/passwordService.js";
import { ValidationError, UnauthorizedError } from "../../errors/BaseError.js";
import { changePasswordSchema } from "../../validators/users/updatePasswordSchema.js";
import { handleZodError } from "../../validators/zodErrorFormated.js";
import { prisma } from "../../config/prisma.js";
import { UserRepositoryPrisma } from "../../repositories/user/UserRepositoryPrisma.js";

import { SupportedLang ,t} from "../../locales/index.js";
const userRepo = new UserRepositoryPrisma(prisma);
const passwordService = new PasswordService(userRepo);

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
   const language: SupportedLang = res.locals.lang;
  
  const userId = req.userId;
  if (!userId) {
  throw new UnauthorizedError(t('userNotAuthenticated' , language));
  }

  try {
    const { currentPassword, newPassword, confirmPassword } = changePasswordSchema(language).parse(req.body);

    await passwordService.changePassword(userId, currentPassword, newPassword , language);

    // res.status(200).json({ message: "Password changed successfully." });
     res.status(200).json({ message: t("passwordChangeSuccess" , language) });
  } catch (err) {
  

     return handleZodError(err, next , language);
    
  }
}
