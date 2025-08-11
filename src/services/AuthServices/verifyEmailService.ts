// src/services/auth/EmailVerificationService.ts
import { IUserRepository } from '../../repositories/user/IUserRepository.js';
import { IAgencyRepository } from '../../repositories/agency/IAgencyRepository.js';
import { IRegistrationRequestRepository } from '../../repositories/registrationRequest/IRegistrationRequestRepository.js';
import { ValidationError, NotFoundError } from '../../errors/BaseError.js';
import { generateToken } from '../../utils/hash.js';
import {
  VerificationEmail,
  WelcomeEmail,
  PendingApprovalEmail,
} from '../emailServices/verificationEmailservice.js';

import { getSocketInstance } from '../../socket/socket.js';
import { NotificationService } from '../Notifications/Notifications.js';

export class EmailVerificationService {
  constructor(
    private userRepo: IUserRepository,
    private agencyRepo: IAgencyRepository,
    private registrationRequestRepo: IRegistrationRequestRepository,
    private notificationService: NotificationService,
  ) {}

  async verify(token: string): Promise<void> {
    if (!token) {
      throw new ValidationError({ token: 'Verification token is required.' });
    }

    const user = await this.userRepo.findByVerificationToken(token);
    if (!user) {
      throw new NotFoundError('Invalid or expired verification token.');
    }

    const emailVerified = true;
    const statusToUpdate = user.role === 'agent' ? 'pending' : 'active';

    await this.userRepo.verifyEmail(user.id, emailVerified, statusToUpdate);

    if (user.role === 'agency_owner') {
      const agency = await this.agencyRepo.findByOwnerUserId(user.id);
      if (agency) {
        await this.agencyRepo.activateAgency(agency.id);
      }
    }

    const safeFirstName = user.first_name ?? 'User';

    if (user.role === 'agent') {
      const pendingEmail = new PendingApprovalEmail(user.email, safeFirstName);
      await pendingEmail.send();

      try {
        
        const registrationRequests = await this.registrationRequestRepo.findByUserId(user.id);
        
      
        const latestRequest = registrationRequests.find(req => req.status === 'pending');
        
        if (latestRequest && latestRequest.agency_id) {
        
          const agencyWithOwner = await this.agencyRepo.findWithOwnerById(latestRequest.agency_id);
// const agentFullName = user.username || user.email;
const agentIdentifier = user.username ?? user.email;

          if (agencyWithOwner) {
            const io = getSocketInstance();
           

            // Send notification to the agency owner
            await this.notificationService.sendNotification({
              userId: agencyWithOwner.owner_user_id,
              type: 'agent_registration_request',
              io,
              translations: [
                {
                  languageCode: 'al',
                  message: `${agentIdentifier} ka konfirmuar email-in dhe kërkon të bashkohet me agjencinë tuaj "${agencyWithOwner.agency_name}"`
                },
                {
                  languageCode: 'en',
                  message: `${agentIdentifier} has verified their email and requests to join your agency "${agencyWithOwner.agency_name}"`
                }
              ],
              extraData: {
                agentId: user.id,
                agentName: agentIdentifier,
                agentEmail: user.email,
                agencyId: agencyWithOwner.id,
                agencyName: agencyWithOwner.agency_name,
                requestId: latestRequest.id,
                timestamp: new Date().toISOString(),
                actionRequired: true
              }
            });

            console.log(`✅ Notification sent to agency owner (ID: ${agencyWithOwner.owner_user_id}) for agent "${agentIdentifier}" registration request`);
          } else {
            console.error(`❌ Agency not found with ID: ${latestRequest.agency_id}`);
          }
        } else {
          console.log(`ℹ️ No pending registration request found for agent ${user.id}`);
        }
      } catch (notificationError) {
        console.error('❌ Failed to send notification to agency owner:', notificationError);
        
      }
    } else {
      const welcomeEmail = new WelcomeEmail(user.email, safeFirstName);
      await welcomeEmail.send();
    }
  }

  async resend(email: string): Promise<void> {
    if (!email) {
      throw new ValidationError({ email: 'Email is required.' });
    }

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found.');
    }

    if (user.email_verified) {
      throw new ValidationError({ email: 'Email is already verified.' });
    }

    // Generate new verification token
    const token = generateToken();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // 24 hours expiry

    await this.userRepo.regenerateVerificationToken(user.id, token, expires);

    // Send verification email
    const verificationEmail = new VerificationEmail(user.email, user.first_name || 'User', token);
    await verificationEmail.send();
  }
}
