// backend/src/controllers/userController.ts
import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma";
import { UserInfoService } from "../../services/userService/userInfoService";
import { UserRepositoryPrisma } from "../../repositories/user/UserRepositoryPrisma";
import { AgentsRepository } from "../../repositories/agents/AgentRepository";
import { AgencyRepository } from "../../repositories/agency/AgencyRepository";
import { UnauthorizedError } from "../../errors/BaseError";
import { t } from "../../utils/i18n.js";
import { SupportedLang } from "../../locales/translations";
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


// import { NextFunction, Request, Response } from "express";
// import { prisma } from "../../config/prisma";
// import { UserInfoService } from "../../services/userService/userInfoService";
// import { UserRepositoryPrisma } from "../../repositories/user/UserRepositoryPrisma";
// import { UnauthorizedError } from "../../errors/BaseError";
// import { AgentsRepository } from "../../repositories/agents/AgentRepository";
// import { AgencyRepository } from "../../repositories/agency/AgencyRepository";
// const userRepo = new UserRepositoryPrisma(prisma);
// const agentrepo=new AgentsRepository(prisma);
// const agencyrepo=new AgencyRepository(prisma)
// const userInfoService = new UserInfoService(userRepo , agentrepo, agencyrepo);

// export async function userInfo(req: Request, res: Response, next: NextFunction) {
//   const userId = req.userId; // comes from verifyToken middleware

//   if (!userId) {
//     return next(new UnauthorizedError("User not authenticated"));
//   }

//   try {
//     const user = await userInfoService.getUserinfo(userId);
    
//     if (!user) {
//       return next(new UnauthorizedError("User not found"));
//     }

//     let responseData:any={user}
//     if(user.role==="agent"){
//     const agentInfo=await userInfoService.getagentInfo(userId);
//       responseData.agentInfo = agentInfo;
//     }
//      if (user.role==="agency_owner"){
//       const agencyOwner=await userInfoService.getagencyInfo(userId)
//       responseData.agencyOwner=agencyOwner;
//      }
//     res.json(responseData);
//   } catch (err) {
//     next(err);
//   }
// }
