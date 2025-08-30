// backend/src/controllers/userController.ts
import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.js";
import { UserInfoService } from "../../services/userService/userInfoService.js";
import { UserRepositoryPrisma } from "../../repositories/user/UserRepositoryPrisma.js";
import { AgentsRepository } from "../../repositories/agents/AgentRepository.js";
import { AgencyRepository } from "../../repositories/agency/AgencyRepository.js";
import { UnauthorizedError } from "../../errors/BaseError.js";
import { t } from "../../utils/i18n.js";
import { SupportedLang } from "../../locales/index.js";
const userRepo = new UserRepositoryPrisma(prisma);
const agentRepo = new AgentsRepository(prisma);
const agencyRepo = new AgencyRepository(prisma);
const userInfoService = new UserInfoService(userRepo, agentRepo, agencyRepo);

export async function userInfo(req: Request, res: Response, next: NextFunction) {
  const language:SupportedLang=res.locals.lang;
  const userId = req.userId;
  if (!userId) return next(new UnauthorizedError(t("userNotAuthenticated" , language)));

  try {
    const userWithRole = await userInfoService.getUserInfo(userId);
    if (!userWithRole) return next(new UnauthorizedError(t("userNotFound" , language)));

    res.json(userWithRole);
  } catch (err) {
    next(err);
  }
}
