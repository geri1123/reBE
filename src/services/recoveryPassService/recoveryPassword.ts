import { IUserRepository } from "../../repositories/user/IUserRepository.js";
import { IPasswordResetToken } from "../../repositories/passwordResetToken/IPasswordResetTokenRepository.js";
import { PasswordRecoveryEmail } from "../emailServices/verificationEmailservice.js";
import { generateToken } from "../../utils/hash.js";
import { hashPassword } from "../../utils/hash.js";
export class RecoveryPasswordService {
  private userRepo: IUserRepository;
  private tokenRepo: IPasswordResetToken;

  constructor(userRepo: IUserRepository, tokenRepo: IPasswordResetToken) {
    this.userRepo = userRepo;
    this.tokenRepo = tokenRepo;
  }
    async resetPassword(token: string, newPassword: string ): Promise<void> {
    const tokenRecord = await this.tokenRepo.findByToken(token);
    if (!tokenRecord) throw new Error("INVALID_TOKEN");

    if (tokenRecord.expiresAt < new Date()) {
      throw new Error("TOKEN_EXPIRED");
    }

    const user = await this.userRepo.findById(tokenRecord.userId);
    if (!user) throw new Error("USER_NOT_FOUND");

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
   await this.userRepo.updateFieldsById(user.id, { password: hashedPassword });

    // Delete used token
    await this.tokenRepo.delete(token);
  }
  async recoverPassword(email: string, lang: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("USER_NOT_FOUND");
    if (user.status !== "active") throw new Error("ACCOUNT_NOT_ACTIVE");

  
    await this.tokenRepo.deleteByUserId(user.id);

    // Generate new token
    const token =generateToken()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await this.tokenRepo.create(user.id, token, expiresAt);

    // Send email
    const emailSender = new PasswordRecoveryEmail(user.email, user.first_name ?? "User", token);
    await emailSender.send();
  }

  
}
