import type { Request, Response, NextFunction } from 'express';
import { UserRepositoryPrisma } from '../../repositories/user/UserRepositoryPrisma.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { UnauthorizedError } from '../../errors/BaseError.js';
import { getFullImageUrl } from '../../utils/imageUrl.js';
import { ProfileImageService } from '../../services/userService/profileImgService.js';
import { prisma } from '../../config/prisma.js';
import { SupportedLang } from "../../locales/index.js";
import { t } from '../../utils/i18n.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userRepo = new UserRepositoryPrisma(prisma);
const profileImageService = new ProfileImageService(userRepo);

export async function updateProfileImage(
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> {
 const language: SupportedLang = res.locals.lang;
  if (!req.file) {
    res.status(400).json({ error:t('nofileUpload' , language) });
    return;
  }

  if (!req.userId) {
    throw new UnauthorizedError(t('userNotAuthenticated' , language));
  }

  try {
    // Base directory 
    const baseDir = path.resolve(__dirname, '..', '..', '..');
    
    const newImagePath = await profileImageService.updateProfileImage(
      req.userId, 
      req.file, 
      baseDir,
      language
     
    );
    
    const fullUrl = getFullImageUrl(newImagePath, req);

    res.json({ 
      success: true, 
      profilePicture: fullUrl,
      // message: 'Profile image updated successfully'
      message:(t("successfullyUpload" , language))
    });
  } catch (error) {
    next(error);
  }
}
