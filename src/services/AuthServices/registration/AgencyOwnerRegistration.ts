import { BaseRegistration } from '../../../types/auth.js';
import { VerificationEmail } from '../../emailServices/verificationEmailservice.js';
import { generateToken } from '../../../utils/hash.js';
import type { AgencyOwnerRegistration as AgencyOwnerRegistrationType } from '../../../types/auth.js';
import type { IUserRepository } from '../../../repositories/user/IUserRepository.js';
import { IAgencyRepository } from '../../../repositories/agency/IAgencyRepository.js';


export class AgencyOwnerRegistration {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly agencyRepo: IAgencyRepository
  ) {}

  async register(body: AgencyOwnerRegistrationType): Promise<number> {
    const {
      username, email, password,
      first_name, last_name,
      agency_name, license_number,
      address,
    } = body;

    const baseData: BaseRegistration = {
      username,
      email,
      password,
      first_name,
      last_name,
    };

    const verification_token = generateToken();
    const verification_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const userId = await this.userRepo.create({
      ...baseData,
      role: 'agency_owner',
      status: 'inactive',
      verification_token,
      verification_token_expires,
    });

    await this.agencyRepo.create({
      agency_name,
      license_number,
      address,
      owner_user_id: userId,
    });

    const verificationEmail = new VerificationEmail(email, `${first_name} ${last_name}`, verification_token);
    const emailSent = await verificationEmail.send();
    if (!emailSent) {
      throw new Error('Failed to send verification email');
    }

    return userId;
  }
}
