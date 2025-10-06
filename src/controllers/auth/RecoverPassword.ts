import { Request, Response, NextFunction } from "express";

import { SupportedLang ,t } from "../../locales/index.js";
import { handleZodError } from "../../validators/zodErrorFormated.js";
import { emailValidation } from "../../validators/users/emailValidation.js";
import { RecoveryPasswordService } from "../../services/recoveryPassService/recoveryPassword.js";
import { prisma } from "../../config/prisma.js";
import { UserRepositoryPrisma } from "../../repositories/user/UserRepositoryPrisma.js";
import { PasswordResetTokenRepositoryPrisma } from "../../repositories/passwordResetToken/PasswordResetTokenRepository.js";

export async function RecoverPassword(req: Request, res: Response, next: NextFunction) {
  const language: SupportedLang = res.locals.lang;

  const userRepo = new UserRepositoryPrisma(prisma);
  const tokenRepo = new PasswordResetTokenRepositoryPrisma(prisma);
  const recoveryService = new RecoveryPasswordService(userRepo, tokenRepo);

  try {
    const validatedBody = await emailValidation(language).parseAsync(req.body);
    const { email } = validatedBody;

    await recoveryService.recoverPassword(email, language);

    return res.status(200).json({ message: t("passwordResetLinkSent", language) });
  } catch (error) {
    handleZodError(error, next, res.locals.lang);
    // next(error); 
  }
}