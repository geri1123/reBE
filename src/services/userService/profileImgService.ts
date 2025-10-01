import type { IUserRepository } from '../../repositories/user/IUserRepository.js';
import { NotFoundError } from '../../errors/BaseError.js';

import { SupportedLang,t } from '../../locales/index.js';
import { uploadFileToFirebase } from '../../utils/firebaseUpload/firebaseUploader.js';
import { bucket } from '../../config/firebase.js';

export class ProfileImageService {
  constructor(private userRepo: IUserRepository) {}

  async updateProfileImage(
    userId: number,
    file: Express.Multer.File,
    language: SupportedLang
  ): Promise<string> {
    // 1️⃣ Get user
    const user = await this.userRepo.findByIdForProfileImage(userId);
    if (!user) throw new NotFoundError(t('userNotFound', language));

    const oldImagePath = user.profile_img;

    //  Delete old image from Firebase if it exists
    if (oldImagePath) {
      try {
        await bucket.file(oldImagePath).delete();
      } catch (err: any) {
        console.warn('Failed to delete old profile image:', err.message);
      }
    }

    // Upload new image using the utility
    const newImagePath = await uploadFileToFirebase(file, 'profile_images');

  
    await this.userRepo.updateFieldsById(userId, { profile_img: newImagePath });

    return newImagePath; 
  }
}

// // ProfileImageService.ts
// import path from 'path';
// import fs from 'fs/promises';
// import type { IUserRepository } from '../../repositories/user/IUserRepository.js';
// import { FileSystemError, NotFoundError } from '../../errors/BaseError.js';
// import { BaseUserService } from './BaseUserService.js';
// import { SupportedLang } from '../../locales/index.js';
// import { t } from '../../utils/i18n.js';
// export class ProfileImageService extends BaseUserService {
//   constructor(userRepo: IUserRepository) {
//     super(userRepo);
//   }

//   async updateProfileImage(
//     userId: number,
//     file: Express.Multer.File,
//     baseDir: string,
//      language: SupportedLang
//   ): Promise<string> {
    
//     const user = await this.userRepo.findByIdForProfileImage(userId);
//     if (!user) throw new NotFoundError(t('userNotFound', language));

//     // Remove old image if it exists
//     if (user.profile_img && user.profile_img.trim() !== '') {
//       const oldImagePath = path.resolve(baseDir, user.profile_img);
//       try {
//         await fs.unlink(oldImagePath);
//         console.log(`Old profile image deleted: ${oldImagePath}`);
//       } catch (err: any) {
//         if (err.code !== 'ENOENT') {
//           console.error(`Failed to delete old profile image: ${err.message}`);
         
//         }
//       }
//     }

//     // The file path should match the multer configuration for profile_images
//     const newImagePath = `uploads/images/profile_images/${file.filename}`;
//     await this.userRepo.updateFieldsById(userId, { profile_img: newImagePath });

//     return newImagePath;
//   }
// }
