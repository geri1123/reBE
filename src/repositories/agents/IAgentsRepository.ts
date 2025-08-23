import type { NewAgencyAgent } from "../../types/AgencyAgents.js";
import type { AgentInfo } from "../../types/AgencyAgents.js";
export interface IAgentsRepository {
  create(agentData: NewAgencyAgent): Promise<any>;  
  findAgentByUserId(userId: number): Promise<AgentInfo[] | null>;
}
