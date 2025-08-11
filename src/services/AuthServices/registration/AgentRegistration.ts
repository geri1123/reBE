import { BaseRegistration } from '../../../types/auth.js';

import { VerificationEmail } from '../../emailServices/verificationEmailservice.js';
import { generateToken } from '../../../utils/hash.js';
import type { AgentRegistration as AgentRegistrationType } from '../../../types/auth.js';
import type { IUserRepository } from '../../../repositories/user/IUserRepository.js';
import { IRegistrationRequestRepository } from '../../../repositories/registrationRequest/IRegistrationRequestRepository.js';
import { IAgencyRepository } from '../../../repositories/agency/IAgencyRepository.js';

export class AgentRegistration {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly agencyRepo: IAgencyRepository,
    private readonly requestRepo: IRegistrationRequestRepository,
    
  ) {}

  async register(body: AgentRegistrationType): Promise<number> {
    const {
      username, email, password,
      first_name, last_name,
      public_code, id_card_number, requested_role
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

    const agency = await this.agencyRepo.findByPublicCode(public_code);
    if (!agency) throw new Error('Invalid agency code.');

    const userId = await this.userRepo.create({
      ...baseData,
      role: 'agent',
      status: 'inactive',
      verification_token,
      verification_token_expires,
    });

    await this.requestRepo.create({
      user_id: userId,
      id_card_number,
      status: 'pending',
      agency_name: agency.agency_name,
      agency_id: agency.id,
      requested_role,
      request_type: 'agent_license_verification',
    });
 
    const verificationEmail = new VerificationEmail(email, `${first_name} ${last_name}`, verification_token);
    const emailSent = await verificationEmail.send();
    if (!emailSent) {
      throw new Error('Failed to send verification email');
    }

    return userId;
  }
}
