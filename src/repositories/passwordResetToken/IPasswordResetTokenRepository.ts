import { PasswordResetToken } from "@prisma/client";

export interface IPasswordResetToken{
  create(userId: number, token: string, expiresAt: Date): Promise<PasswordResetToken>;
  findByToken(token: string): Promise<PasswordResetToken | null>;
  deleteByUserId(userId: number): Promise<void>;
  delete(token: string): Promise<void>;
}