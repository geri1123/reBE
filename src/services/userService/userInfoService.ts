// backend/src/services/userService/UserInfoService.ts
import { IUserRepository } from "../../repositories/user/IUserRepository.js";
import { IAgentsRepository } from "../../repositories/agents/IAgentsRepository.js";
import { IAgencyRepository } from "../../repositories/agency/IAgencyRepository.js";
import { BaseUserService } from "./BaseUserService.js";
import { UserWithRoleInfo, AgentInfo, AgencyInfo } from "../../types/userinfo.js";

export class UserInfoService extends BaseUserService {
  constructor(
    userRepo: IUserRepository,
    private agentRepo: IAgentsRepository,
    private agencyRepo: IAgencyRepository
  ) {
    super(userRepo);
  }

  async getUserInfo(userId: number): Promise<UserWithRoleInfo | null> {
    const user = await this.userRepo.findById(userId);
    if (!user) return null;

    const result: UserWithRoleInfo = { ...user };

    // Agent role
    if (user.role === "agent") {
      const agentData: AgentInfo | null = await this.agentRepo.findAgentByUserId(userId);
      if (agentData) result.agentInfo = [agentData]; 
    }

    // Agency owner role
    if (user.role === "agency_owner") {
      const agencyData: AgencyInfo | null = await this.agencyRepo.findAgencyByUserId(userId);
      if (agencyData) result.agencyInfo = agencyData;
    }

    return result;
  }
}

