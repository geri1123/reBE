import { Request, Response, NextFunction } from "express";
import { PasswordService } from "../../services/userService/passwordService.js";
import { ValidationError, UnauthorizedError } from "../../errors/BaseError.js";
import { changePasswordSchema } from "../../validators/users/updatePasswordSchema.js";
import { handleZodError } from "../../validators/zodErrorFormated";
import { prisma } from "../../config/prisma.js";
import { UserRepositoryPrisma } from "../../repositories/user/UserRepositoryPrisma.js";
const userRepo = new UserRepositoryPrisma(prisma);
const passwordService = new PasswordService(userRepo);

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.userId;
  if (!userId) {
  throw new UnauthorizedError("User not authenticated");
  }

  try {
    const { currentPassword, newPassword, confirmPassword } = changePasswordSchema.parse(req.body);

    await passwordService.changePassword(userId, currentPassword, newPassword);

    res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
  

     return handleZodError(err, next);
    
  }
}
