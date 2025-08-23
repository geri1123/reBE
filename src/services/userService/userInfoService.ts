import { IAgentsRepository } from "../../repositories/agents/IAgentsRepository";
import { IUserRepository } from "../../repositories/user/IUserRepository";

import { BaseUserService } from "./BaseUserService";

export class UserInfoService extends BaseUserService{
    constructor(
        userRepo:IUserRepository , 
          private agentRepo: IAgentsRepository 
    )
        {
        super(userRepo)
    }
    async getUserinfo(userId:number){
         return  this.userRepo.findById(userId)
    }
   async getagentInfo(userId:number){
    return this.agentRepo.findAgentByUserId(userId);
   }
}