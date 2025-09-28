// AgentRequestController.ts
import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../../errors/BaseError.js";
import { AgentsRequestsService } from "../../services/AgencyService/AgentsRequestsService.js";
import { RespondRequestBody } from "../../types/AgentsRequest.js";
import { AgentsRepository } from "../../repositories/agents/AgentRepository.js";
import { RegistrationRequestRepository } from "../../repositories/registrationRequest/RegistrationRequest.js";
import { respondToRequestSchema } from "../../validators/agentsRequests/respondeToRequest.js";
import { handleZodError } from "../../validators/zodErrorFormated.js";
import { UserRepositoryPrisma } from "../../repositories/user/UserRepositoryPrisma.js";
import { prisma } from "../../config/prisma.js";
import { SupportedLang } from "../../locales/index.js";
import { t } from "../../utils/i18n.js";
import { TranslatedError } from "../../errors/TranslatedError.js";
const registrationRequestRepo = new RegistrationRequestRepository(prisma);
const agentRepo = new AgentsRepository(prisma);
const userRepo = new UserRepositoryPrisma(prisma);

const agentsRequestsService = new AgentsRequestsService(registrationRequestRepo, agentRepo , userRepo);

export class AgentRequestController {
  static async getRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const language:SupportedLang=res.locals.lang;
      const userId = req.userId;
      const agencyId = req.agencyId;

      if (!userId) throw new TranslatedError('userNotFound' , language);
      if (!agencyId) throw new ForbiddenError(t('agencyNotFound' , language));

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const requests = await agentsRequestsService.fetchRequests(agencyId, limit, page , language);

      res.json({
        data: requests,
        pagination: { page, limit },
      });
    } catch (err) {
      next(err);
    }
  }

  static async respondToRequest(
    req: Request<{}, {}, RespondRequestBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const language:SupportedLang=res.locals.lang;
    try {
      const reviewerId = req.userId;
      if (!reviewerId) throw new UnauthorizedError(t("userNotAuthenticated"  , language));

       const parsed = respondToRequestSchema(language).parse(req.body);

    const { requestId, status, reviewNotes, commissionRate } = parsed;
      
      await agentsRequestsService.respondToRequest(
        requestId, 
        status, 
        reviewerId, 
        language,
        reviewNotes, 
        commissionRate, 
        
      );

      res.json({ message:t(`${status}`, language)  });
    } catch (err) {
      handleZodError(err, next, res.locals.lang);
    }
  }
}
