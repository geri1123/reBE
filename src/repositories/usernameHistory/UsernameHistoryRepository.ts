// import { prisma } from '../../config/prisma.js';
import type { UsernameHistoryRecord } from '../../types/database.js';
import { IUsernameHistoryRepository } from './IUsernameHistoryRepository.js';
import { PrismaClient } from '@prisma/client';
export class UsernameHistoryRepository implements IUsernameHistoryRepository {
  constructor(private prisma: PrismaClient) {}
  async getLastUsernameChange(userId: number): Promise<UsernameHistoryRecord | null> {
    const record = await this.prisma.usernamehistory.findFirst({
      where: { user_id: userId },
      orderBy: { next_username_update: 'desc' },
    });
    return record;
  }

  async saveUsernameChange(
    userId: number,
    oldUsername: string,
    newUsername: string,
    nextUpdateDate: Date
  ): Promise<void> {
    await this.prisma.usernamehistory.create({
      data: {
        user_id: userId,
        old_username: oldUsername,
        new_username: newUsername,
        next_username_update: nextUpdateDate,
      },
    });
  }
}

