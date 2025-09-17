import { AgentRequestQueryResult, RequestStatus } from "../../types/AgentsRequest.js";
import { NotFoundError, ValidationError } from "../../errors/BaseError.js";
import { IRegistrationRequestRepository } from "../../repositories/registrationRequest/IRegistrationRequestRepository.js";
import { IAgentsRepository } from "../../repositories/agents/IAgentsRepository.js";
import { AgentWellcomeEmail } from "../emailServices/verificationEmailservice.js";
import { RejectionEmail } from "../emailServices/verificationEmailservice.js";
import { IUserRepository } from "../../repositories/user/IUserRepository.js";
import { SupportedLang } from "../../locales/index.js";
import { t } from "../../utils/i18n.js";
import { LanguageCode } from "@prisma/client";
export class AgentsRequestsService {
  constructor(
    private readonly registrationRequestRepo: IRegistrationRequestRepository,
    private readonly agentRepo: IAgentsRepository,
    private readonly userRepo: IUserRepository
  ) {}

  private async getRequestsByAgencyId(
    agencyId: number,
    limit: number,
    offset: number
  ): Promise<{ data: AgentRequestQueryResult[]; total: number }> {
    return await this.registrationRequestRepo.findAgentRequestsByAgencyId(agencyId, limit, offset);
  }

  public async fetchRequests(
    agencyId: number,
    limit: number,
    page: number , 
    language:SupportedLang
  ): Promise<{
    data: Array<Omit<AgentRequestQueryResult, 'emailVerified'> & { emailVerified: boolean }>;
    total: number;
  }> {
    // Validate input parameters
    if (agencyId <= 0) {
      throw new ValidationError({ agencyId:t("invalidAgencyId" , language)} , language);
    }
    if (limit <= 0 || limit > 100) {
      throw new ValidationError({ limit:t("invalidLimit" , language) } , language);
    }
    if (page <= 0) {
      throw new ValidationError({ page:t("invalidPage" , language) } , language);
    }

    const offset = (page - 1) * limit;
    const { data, total } = await this.getRequestsByAgencyId(agencyId, limit, offset);

    return {
      data: data.map((row) => ({
        ...row,
        emailVerified: Boolean(row.emailVerified),
      })),
      total,
    };
  }

  public async respondToRequest(
    requestId: number,
    status: RequestStatus,
    reviewerId: number,
     language: SupportedLang,
    reviewNotes?: string,
    commissionRate: number = 0,
    // language:SupportedLang
  ): Promise<void> {
    // Validate input parameters
    // if (requestId <= 0) {
    //   throw new ValidationError({ requestId: "Invalid request ID" });
    // }
    // if (reviewerId <= 0) {
    //   throw new ValidationError({ reviewerId: "Invalid reviewer ID" });
    // }
    // if (status === "approved" && (commissionRate < 0 || commissionRate > 100)) {
    //   throw new ValidationError({ commissionRate: "Commission rate must be between 0 and 100" });
    // }
  if (requestId <= 0) {
    throw new ValidationError({ requestId: t("invalidRequestId" ,language) } , language);
  }
  if (reviewerId <= 0) {
    throw new ValidationError({ reviewerId: t("invalidReviewerId",language) } , language);
  }
  if (status === "approved" && (commissionRate < 0 || commissionRate > 100)) {
    throw new ValidationError({ commissionRate: t( "commissionRateInvalid" , language) } , language);
  }
    // Check if request exists before updating
    // const existingRequest = await this.registrationRequestRepo.findById(requestId);
    // if (!existingRequest) {
    //   throw new NotFoundError(`Request with ID ${requestId} not found`);
    // }
const existingRequest = await this.registrationRequestRepo.findById(requestId);
  if (!existingRequest) {
    throw new NotFoundError(t( "requestNotFound",language));
  }

    // Check if request is already processed
     if (existingRequest.status !== "pending") {
    throw new ValidationError({
      status: t( "requestAlreadyProcessed",language).replace("{status}", existingRequest.status),
    } , language);
  }
    // Update request status
    const updatedRequest = await this.registrationRequestRepo.updateStatus(
      requestId,
      status,
      reviewerId,
      reviewNotes
    );

   
  if (!updatedRequest) {
    throw new NotFoundError(t( "failedToUpdateRequest",language));
  }

  const fullRequest = await this.registrationRequestRepo.findById(requestId);
  // if (!fullRequest?.user) {
  //   throw new ValidationError({ general: "User info missing from request" });
  // }
  if (!fullRequest?.user) {
    throw new ValidationError({ general: t( "userInfoMissing",language) } , language);
  }

    // Handle approved requests
    if (status === "approved") {
     

      if (!fullRequest.id_card_number) {
      throw new ValidationError({ id_card_number: t( "idCardRequiredForAgent",language) } , language);
    }

      // Validate required fields
      // if (!fullRequest.id_card_number) {
      //   throw new ValidationError({ 
      //     id_card_number: "ID card number is required for agent creation" 
      //   });
      // }

      try {
        await this.agentRepo.create({
          userId: fullRequest.user.id,
          agency_id: fullRequest.agency.id,
          added_by: reviewerId,
          id_card_number: fullRequest.id_card_number,
          role_in_agency: fullRequest.requested_role || "agent",
          status: "active",
          commission_rate: commissionRate,
          start_date: new Date(),
          end_date: null,
        });
   await this.userRepo.updateFieldsById(fullRequest.user.id, {
      role: "agent",
      status: "active",
    });
       const welcomeEmail = new AgentWellcomeEmail(fullRequest.user.email, fullRequest.user.first_name || "Agent");
await welcomeEmail.send();
      } catch (error) {
        console.error(`Failed to create agent for request ${requestId}:`, error);
        
        // Rollback the request status update if agent creation fails
        await this.registrationRequestRepo.updateStatus(
          requestId,
          'pending',
          reviewerId,
          'Agent creation failed - request reverted to pending'
        );
        
      throw new ValidationError({ general: t( "agentCreationFailed",language) } , language);
      }
    } else if (status === "rejected") {
      console.log(`Request ${requestId} has been rejected by reviewer ${reviewerId}`);
      const rejectionEmail = new RejectionEmail(fullRequest.user.email, fullRequest.user.first_name || "User");
      await rejectionEmail.send();
     
    }
  }
}
