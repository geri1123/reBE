import { VerificationEmail } from '../../emailServices/verificationEmailservice.js';
import { generateToken } from '../../../utils/hash.js';
import type { UserRegistration as UserRegistrationType } from '../../../types/auth.js';
import type { IUserRepository } from '../../../repositories/user/IUserRepository.js';

export class UserRegistration {
  private userRepo: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  async register(body: UserRegistrationType): Promise<number> {
    const {
      username, email, password,
      first_name, last_name,
    } = body;

    const verification_token = generateToken();
    const verification_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const userId = await this.userRepo.create({
      username,
      email,
      password,
      first_name,
      last_name,
      role: 'user',
      status: 'inactive',
      verification_token,
      verification_token_expires,
    });

    const verificationEmail = new VerificationEmail(email, `${first_name} ${last_name}`, verification_token);
    const emailSent = await verificationEmail.send();
    if (!emailSent) {
      throw new Error('Failed to send verification email');
    }

    return userId;
  }
}
