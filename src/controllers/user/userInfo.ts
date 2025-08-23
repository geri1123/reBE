import { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { UserInfoService } from "../../services/userService/userInfoService";
import { UserRepositoryPrisma } from "../../repositories/user/UserRepositoryPrisma";
import { UnauthorizedError } from "../../errors/BaseError";
import { AgentsRepository } from "../../repositories/agents/AgentRepository";

const userRepo = new UserRepositoryPrisma(prisma);
const agentrepo=new AgentsRepository(prisma);
const userInfoService = new UserInfoService(userRepo , agentrepo);

export async function userInfo(req: Request, res: Response, next: NextFunction) {
  const userId = req.userId; // comes from verifyToken middleware

  if (!userId) {
    return next(new UnauthorizedError("User not authenticated"));
  }

  try {
    const user = await userInfoService.getUserinfo(userId);
    
    if (!user) {
      return next(new UnauthorizedError("User not found"));
    }

    let responseData:any={user}
    if(user.role==="agent"){
    const agentInfo=await userInfoService.getagentInfo(userId);
      responseData.agentInfo = agentInfo;
    }

    res.json(responseData);
  } catch (err) {
    next(err);
  }
}
