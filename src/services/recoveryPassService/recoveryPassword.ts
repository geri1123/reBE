import { IUserRepository } from "../../repositories/user/IUserRepository.js";
import { IPasswordResetToken } from "../../repositories/passwordResetToken/IPasswordResetTokenRepository.js";
import { PasswordRecoveryEmail } from "../emailServices/verificationEmailservice.js";
import { comparePassword, generateToken } from "../../utils/hash.js";
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

    const user = await this.userRepo.findByIdWithPassword(tokenRecord.userId);
   
    if (!user) throw new Error("USER_NOT_FOUND");

   if (await comparePassword(newPassword, user.password)) {
    throw new Error("SAME_PASSWORD");
  }    
    const hashedPassword = await hashPassword(newPassword);

    
   await this.userRepo.updateFieldsById(user.id, { password: hashedPassword });

    
    await this.tokenRepo.delete(token);
  }
  async recoverPassword(email: string, lang: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("USER_NOT_FOUND");
    if (user.status !== "active") throw new Error("ACCOUNT_NOT_ACTIVE");

  
    await this.tokenRepo.deleteByUserId(user.id);

    // Generate new token
    const token =generateToken()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

    await this.tokenRepo.create(user.id, token, expiresAt);

    // Send email
    const emailSender = new PasswordRecoveryEmail(user.email, user.first_name ?? "User", token , lang ,expiresAt);
    await emailSender.send();
  }

  
}
