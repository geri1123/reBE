// controllers/auth/resetPassword.ts
import { Request, Response, NextFunction } from "express";
import { t } from "../../utils/i18n.js";
import { SupportedLang } from "../../locales/index.js";
import { handleZodError } from "../../validators/zodErrorFormated.js";
import { resetPasswordValidation } from "../../validators/users/resetPasswordValidation.js"; 
import { RecoveryPasswordService } from "../../services/recoveryPassService/recoveryPassword.js";
import { prisma } from "../../config/prisma.js";
import { UserRepositoryPrisma } from "../../repositories/user/UserRepositoryPrisma.js";
import { PasswordResetTokenRepositoryPrisma } from "../../repositories/passwordResetToken/PasswordResetTokenRepository.js";
  const userRepo = new UserRepositoryPrisma(prisma);
  const tokenRepo = new PasswordResetTokenRepositoryPrisma(prisma);
  const resetService = new RecoveryPasswordService(userRepo, tokenRepo);
export async function ResetPassword(req: Request, res: Response, next: NextFunction) {
  const language: SupportedLang = res.locals.lang;



  try {
   const validatedBody = await resetPasswordValidation(language).parseAsync(req.body);
    const { token, newPassword , repeatPassword } = validatedBody;

    await resetService.resetPassword(token, newPassword );

    return res.status(200).json({ message: t("passwordResetSuccess", language) });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVALID_TOKEN") {
        return res.status(400).json({ message: t("invalidToken", language) });
      }
      if (error.message === "TOKEN_EXPIRED") {
        return res.status(410).json({ message: t("tokenExpired", language) });
      }
      if (error.message === "USER_NOT_FOUND") {
        return res.status(404).json({ message: t("userNotFound", language) });
      }
    }
    handleZodError(error, next);
  }
}
