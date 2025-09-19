import { ValidationError, NotFoundError } from "../../errors/BaseError.js";
import { SupportedLang } from "../../locales/index.js";
import type { IUserRepository } from "../../repositories/user/IUserRepository.js";
import type { IUsernameHistoryRepository } from "../../repositories/usernameHistory/IUsernameHistoryRepository.js";
import { BaseUserService } from "./BaseUserService.js";
import { t } from "../../utils/i18n.js";
export class UsernameService extends BaseUserService {
  
    constructor(userRepo: IUserRepository, private usernameHistoryRepo: IUsernameHistoryRepository) {
      super(userRepo);
    }
 

  async canUpdateUsername(userId: number): Promise<boolean> {
    const lastChange = await this.usernameHistoryRepo.getLastUsernameChange(userId);
    if (!lastChange) return true;
    return new Date() >= new Date(lastChange.next_username_update);
  }

  async changeUsername(userId: number, newUsername: string ,language:SupportedLang): Promise<void> {
    const usernameTaken = await this.userRepo.usernameExists(newUsername);
    if (usernameTaken) {
   throw new ValidationError({ message: t("usernameExists", language) } ,language);
}

    const currentUsername = await this.userRepo.getUsernameById(userId);
    if (!currentUsername) {
       throw new NotFoundError(t("userNotFound", language));
    }

    const nextUpdate = new Date();
    nextUpdate.setDate(nextUpdate.getDate() + 10);

    await this.userRepo.updateFieldsById(userId, { username: newUsername });

    await this.usernameHistoryRepo.saveUsernameChange(
      userId,
      currentUsername,
      newUsername,
      nextUpdate
    );
  }
}
