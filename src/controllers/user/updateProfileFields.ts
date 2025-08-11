import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../errors/BaseError.js';
import { handleZodError } from '../../validators/zodErrorFormated.js';
import { UserRepositoryPrisma } from '../../repositories/user/UserRepositoryPrisma.js';
import { ProfileInfoService } from '../../services/userService/profileInfoService.js';
import { updateProfileSchema } from '../../validators/users/updateProfileSchema.js';
import { prisma } from '../../config/prisma.js';
const userRepo = new UserRepositoryPrisma(prisma);
const profileInfoService = new ProfileInfoService(userRepo);
export async function updateProfileFields(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.userId;
  if (!userId) return next(new UnauthorizedError('User not authenticated'));

  try {
    const data = updateProfileSchema.parse(req.body);

    const messages: string[] = [];

    if (data.firstName !== undefined) {
      await profileInfoService.updateFirstNlastN(userId,data.firstName);
     
      messages.push('First Name updated successfully');
    }
     if (data.lastName !== undefined) {
        await profileInfoService.updateLName(userId, data.lastName);
        messages.push('Last name updated successfully');
      }

    if (data.aboutMe !== undefined) {
      await profileInfoService.updateAboutMe(userId, data.aboutMe);
      messages.push('About me updated successfully');
    }

    if (data.phone !== undefined) {
      await profileInfoService.updateUserPhone(userId, data.phone);
      messages.push('Phone updated successfully');
    }

    res.json({ success: true, message: messages.join(', ') });
  } catch (err) {
    return handleZodError(err, next);
  }
}
