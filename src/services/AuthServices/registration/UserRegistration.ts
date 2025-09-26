import { VerificationEmail } from '../../emailServices/verificationEmailservice.js';
import { generateToken } from '../../../utils/hash.js';
import type { UserRegistration as UserRegistrationType } from '../../../types/auth.js';
import type { IUserRepository } from '../../../repositories/user/IUserRepository.js';
import { SupportedLang } from '../../../locales/index.js';

export class UserRegistration {
  private userRepo: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  async register(body: UserRegistrationType, language: string): Promise<number> {
    const {
      username, email, password,
      first_name, last_name,
    } = body;

    // Generate token and add debugging
    const verification_token = generateToken();
    const verification_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    // Add debugging logs
    console.log('UserRegistration.register - Generated token info:', {
      email,
      username,
      token: verification_token ? `${verification_token.substring(0, 10)}...` : 'UNDEFINED/EMPTY',
      tokenLength: verification_token?.length,
      expires: verification_token_expires
    });

    // Validate token before proceeding
    if (!verification_token || verification_token.trim() === '') {
      console.error('ERROR: Generated verification token is empty or undefined');
      throw new Error('Failed to generate verification token');
    }

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

    // Log user creation result
    console.log('User created with ID:', userId);

    // Use the generated token directly and add more debugging
    console.log('About to send verification email with:', {
      email,
      name: username,
      token: verification_token ? `${verification_token.substring(0, 10)}...` : 'UNDEFINED/EMPTY',
      language,
      tokenIsValid: Boolean(verification_token && verification_token.trim())
    });

    const verificationEmail = new VerificationEmail(email, username, verification_token, language);
    const emailSent = await verificationEmail.send();
    
    if (!emailSent) {
      console.error('Failed to send verification email for user:', email);
      throw new Error('Failed to send verification email');
    }

    console.log('Verification email sent successfully for user:', email);
    return userId;
  }
}
