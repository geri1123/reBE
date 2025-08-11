import { UserRegistration } from './registration/UserRegistration.js';
import { AgencyOwnerRegistration } from './registration/AgencyOwnerRegistration.js';
import { AgentRegistration } from './registration/AgentRegistration.js';
import { RegistrationData } from '../../types/auth.js';
import { UnauthorizedError } from '../../errors/BaseError.js';
import jwt from 'jsonwebtoken';
import { comparePassword } from '../../utils/hash.js';
import { config } from '../../config/config.js';
import type { IUserRepository } from '../../repositories/user/IUserRepository.js';
import { IAgencyRepository } from '../../repositories/agency/IAgencyRepository.js';
import type { IRegistrationRequestRepository } from '../../repositories/registrationRequest/IRegistrationRequestRepository.js';
// import { NotificationService } from '../Notifications/Notifications.js';
export class AuthService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly agencyRepo: IAgencyRepository,
    private readonly requestRepo: IRegistrationRequestRepository,
      // private readonly notificationService: NotificationService 
  ) {}

  async registerUserByRole(body: RegistrationData): Promise<number> {
    const role = body.role;

    switch (role) {
      case 'user':
        return new UserRegistration(this.userRepo).register(body);
      case 'agency_owner':
        return new AgencyOwnerRegistration(this.userRepo, this.agencyRepo).register(body);
      case 'agent':
        return new AgentRegistration(this.userRepo,this.agencyRepo  ,this.requestRepo ).register(body);
      default:
        throw new Error('Invalid role.');
    }
  }

  async login(identifier: string, password: string) {
    const user = await this.userRepo.findByIdentifier(identifier);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    if (user.status !== 'active') {
      throw new UnauthorizedError('Account not active. Verify email or contact support.');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new UnauthorizedError('Invalid password.');

    await this.userRepo.updateFieldsById(user.id, { last_login: new Date() });

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      config.secret.jwtSecret as string,
      { expiresIn: '1d' }
    );

    return { user, token };
  }
}
