// src/repositories/user/IUserRepository.ts

import type { NewUser, PartialUserForLogin, PartialUserByToken, UpdatableUserFields } from '../../types/database.js';
// import type { UserStatus } from '../../types/auth.js';
import { user_status } from '@prisma/client';
import type { BaseUserInfo } from '../../types/userinfo.js';
export interface IUserRepository {
  // --- Inserts
  create(
    userData: Omit<NewUser, 'id' | 'created_at' | 'updated_at' | 'email_verified'> & { password: string }
  ): Promise<number>;

  // --- Queries
    findByIdWithPassword(userId: number): Promise<{ id: number; password: string } | null>;
 findById(userId: number): Promise<BaseUserInfo | null>;
  findByIdentifier(identifier: string): Promise<PartialUserForLogin | null>;
  findByVerificationToken(token: string): Promise<PartialUserByToken | null>;
  findByIdForProfileImage(userId: number): Promise<{ id: number; profile_img: string | null } | null>;
  getUsernameById(userId: number): Promise<string | null>;
  getUserPasswordById(userId: number): Promise<string | null>;
  emailExists(email: string): Promise<boolean>;
  usernameExists(username: string): Promise<boolean>;
  findByEmail(email: string): Promise<{
    id: number;
    email: string;
    first_name: string | null;
    email_verified: boolean;
    status: user_status;
   
  } | null>;

  // --- Updates
  updateFieldsById(userId: number, fields: Partial<UpdatableUserFields>): Promise<void>;
  verifyEmail(userId: number, emailVerified: boolean, statusToUpdate: user_status): Promise<void>;
  regenerateVerificationToken(userId: number, token: string, expires: Date): Promise<void>;
}
