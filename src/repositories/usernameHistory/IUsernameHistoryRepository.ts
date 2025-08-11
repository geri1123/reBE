import type { UsernameHistoryRecord } from '../../types/database.js';

export interface IUsernameHistoryRepository {
  getLastUsernameChange(userId: number): Promise<UsernameHistoryRecord | null>;
  saveUsernameChange(
    userId: number,
    oldUsername: string,
    newUsername: string,
    nextUpdateDate: Date
  ): Promise<void>;
}