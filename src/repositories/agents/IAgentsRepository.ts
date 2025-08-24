import type { NewAgencyAgent } from "../../types/AgencyAgents.js";
import { AgentInfo } from "../../types/userinfo.js";
export interface IAgentsRepository {
  create(agentData: NewAgencyAgent): Promise<any>;  
  findAgentByUserId(userId: number): Promise<AgentInfo | null>;
}
