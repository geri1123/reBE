// import { prisma } from "../../config/prisma.js";
import type { NewAgencyAgent } from "../../types/AgencyAgents.js";
import { PrismaClient } from "@prisma/client";
import { IAgentsRepository } from "./IAgentsRepository.js";
export class AgentsRepository implements IAgentsRepository {
  constructor(private prisma: PrismaClient) {}
  
  
  async create(agentData: NewAgencyAgent) {
    
    return await this.prisma.agencyagent.create({
      data: {
        agent_id: agentData.userId,
        agency_id: agentData.agency_id,
        added_by: agentData.added_by,
        id_card_number: agentData.id_card_number,
        role_in_agency: agentData.role_in_agency,
        status: agentData.status,
        commission_rate: agentData.commission_rate,
        start_date: agentData.start_date,
        end_date: agentData.end_date,
      },
    });
  }
}
