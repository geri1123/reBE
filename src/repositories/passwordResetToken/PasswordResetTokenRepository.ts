import { PrismaClient, PasswordResetToken } from "@prisma/client";
import { IPasswordResetToken } from "./IPasswordResetTokenRepository.js";

export class PasswordResetTokenRepositoryPrisma implements IPasswordResetToken {
  constructor(private prisma: PrismaClient) {}

  async create(userId: number, token: string, expiresAt: Date): Promise<PasswordResetToken> {
    return this.prisma.passwordResetToken.create({
      data: { userId, token, expiresAt },
    });
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    return this.prisma.passwordResetToken.findUnique({ where: { token } });
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.prisma.passwordResetToken.deleteMany({ where: { userId } });
  }

  async delete(token: string): Promise<void> {
    await this.prisma.passwordResetToken.delete({ where: { token } });
  }
}
