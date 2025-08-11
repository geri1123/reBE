// import { prisma } from '../../config/prisma.js';
import { hashPassword } from '../../utils/hash.js';
import type { NewUser, UpdatableUserFields, PartialUserForLogin, PartialUserByToken } from '../../types/database.js';
import type { UserStatus } from '../../types/auth.js';
import type { IUserRepository } from './IUserRepository.js';
import { PrismaClient } from '@prisma/client';
export class UserRepositoryPrisma implements IUserRepository{
  
  constructor(private prisma: PrismaClient) {}
  // CREATE
 async create(
    userData: Omit<NewUser, 'id' | 'created_at' | 'updated_at' | 'email_verified'> & { password: string }
  ): Promise<number> {
    const hashedPassword = await hashPassword(userData.password);

    const result = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        email_verified: false,
      },
    });

    return result.id;
  }

  // READ
   async findById(userId: number) {
    const result = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    return result || null;
  }

   async findByIdentifier(identifier: string): Promise<PartialUserForLogin | null> {
    const result = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        status: true,
        role: true,
      },
    });

    return result || null;
  }

   async findByVerificationToken(token: string): Promise<PartialUserByToken | null> {
    const result = await this.prisma.user.findFirst({
      where: {
        verification_token: token,
        verification_token_expires: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        role: true,
        email: true,
        username: true,

        first_name: true,
        last_name: true,
        
      },
    });

    return result || null;
  }

   async findByIdForProfileImage(userId: number): Promise<{ id: number; profile_img: string | null } | null> {
    const result = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        profile_img: true,
      },
    });

    return result || null;
  }

   async getUsernameById(userId: number): Promise<string | null> {
    const result = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { username: true },
    });

    return result ? result.username : null;
  }

   async getUserPasswordById(userId: number): Promise<string | null> {
    const result = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    return result ? result.password : null;
  }

   async emailExists(email: string): Promise<boolean> {
    const result = await this.prisma.user.findFirst({
      where: { email },
      select: { id: true },
    });

    return result !== null;
  }

   async usernameExists(username: string): Promise<boolean> {
    const result = await this.prisma.user.findFirst({
      where: { username },
      select: { username: true },
    });

    return result !== null;
  }

   async findByEmail(email: string): Promise<{
    id: number;
    email: string;
    first_name: string | null;
    email_verified: boolean;
  } | null> {
    const result = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        first_name: true,
        email_verified: true,
      },
    });

    return result || null;
  }

  // UPDATE
   async updateFieldsById(
    userId: number,
    fields: Partial<UpdatableUserFields>
  ): Promise<void> {
    const filtered = Object.fromEntries(
      Object.entries(fields).filter(([_, val]) => val !== undefined)
    ) as Partial<UpdatableUserFields>;

    if (Object.keys(filtered).length === 0) return;

    (filtered as any).updated_at = new Date();

    await this.prisma.user.update({
      where: { id: userId },
      data: filtered,
    });
  }

   async verifyEmail(userId: number, emailVerified: boolean, statusToUpdate: UserStatus): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email_verified: emailVerified,
        status: statusToUpdate,
        verification_token: null,
        verification_token_expires: null,
        updated_at: new Date(),
      },
    });
  }

   async regenerateVerificationToken(userId: number, token: string, expires: Date): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        verification_token: token,
        verification_token_expires: expires,
        updated_at: new Date(),
      },
    });
  }
}
