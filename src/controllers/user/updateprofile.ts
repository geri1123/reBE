import type { Request, Response, NextFunction } from 'express';
import { UserRepositoryPrisma } from '../../repositories/user/UserRepositoryPrisma.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { UnauthorizedError } from '../../errors/BaseError.js';
import { getFullImageUrl } from '../../utils/imageUrl.js';
import { ProfileImageService } from '../../services/userService/profileImgService.js';
import { prisma } from '../../config/prisma.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userRepo = new UserRepositoryPrisma(prisma);
const profileImageService = new ProfileImageService(userRepo);

export async function updateProfileImage(
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  if (!req.userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  try {
    // Base directory 
    const baseDir = path.resolve(__dirname, '..', '..', '..');
    
    const newImagePath = await profileImageService.updateProfileImage(
      req.userId, 
      req.file, 
      baseDir
    );
    
    const fullUrl = getFullImageUrl(newImagePath, req);

    res.json({ 
      success: true, 
      profilePicture: fullUrl,
      message: 'Profile image updated successfully'
    });
  } catch (error) {
    next(error);
  }
}
