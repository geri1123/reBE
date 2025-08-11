// src/repositories/user/IUserRepository.ts

import type { NewUser, PartialUserForLogin, PartialUserByToken, UpdatableUserFields } from '../../types/database.js';
import type { UserStatus } from '../../types/auth.js';

export interface IUserRepository {
  // --- Inserts
  create(
    userData: Omit<NewUser, 'id' | 'created_at' | 'updated_at' | 'email_verified'> & { password: string }
  ): Promise<number>;

  // --- Queries
  findById(userId: number): Promise<{ id: number; email: string | null; username: string | null } | null>;
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
  } | null>;

  // --- Updates
  updateFieldsById(userId: number, fields: Partial<UpdatableUserFields>): Promise<void>;
  verifyEmail(userId: number, emailVerified: boolean, statusToUpdate: UserStatus): Promise<void>;
  regenerateVerificationToken(userId: number, token: string, expires: Date): Promise<void>;
}
