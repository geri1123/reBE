// import { prisma } from "../../config/prisma.js";
import type { NewAgencyAgent } from "../../types/AgencyAgents.js";
import { PrismaClient } from "@prisma/client";
import { IAgentsRepository } from "./IAgentsRepository.js";
import { AgentInfo } from "../../types/userinfo.js";
export class AgentsRepository implements IAgentsRepository {
  constructor(private prisma: PrismaClient) {}
  async findAgentByUserId(userId: number): Promise<AgentInfo | null> {
  const agent = await this.prisma.agencyagent.findFirst({
    where: { agent_id: userId },
    select: {
      id: true,
      agent_id: true,
      agency_id: true,
      role_in_agency: true,
      id_card_number: true,
      status: true,
      commission_rate: true,
      start_date: true,
      end_date: true,
      created_at: true,
      updated_at: true, // Add this if it exists in your DB
      agency: {
        select: {
          id: true,
          agency_name: true,
          logo: true,
          phone: true,
          website: true,
          status: true,
          public_code: true,
          agency_email: true,
          address: true,
          license_number: true, // Add this - required in AgencyInfo
          owner_user_id: true,  // Add this - required in AgencyInfo
          created_at: true,     // Add this - required in AgencyInfo
          updated_at: true,     // Add this - required in AgencyInfo
        },
      },
      addedByUser: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  if (!agent) return null;

  return {
    ...agent,
    commission_rate: agent.commission_rate !== null ? Number(agent.commission_rate) : undefined,
  } as AgentInfo;
}
  // async findAgentByUserId(userId: number): Promise<AgentInfo | null> {
  //   const agent = await this.prisma.agencyagent.findFirst({
  //     where: { agent_id: userId },
  //     select: {
  //       id: true,
  //       agent_id: true,
  //       agency_id: true,
  //       role_in_agency: true,
  //       id_card_number: true,
  //       status: true,
  //       commission_rate: true,
  //       start_date: true,
  //       end_date: true,
  //       created_at: true,
  //       agency: {
  //         select: {
  //           id: true,
  //           agency_name: true,
  //           logo: true,
           
  //           phone: true,
  //           website: true,
  //           status: true,
  //           public_code: true,
  //           agency_email: true,
  //           address: true,
           
  //         },
  //       },
  //       addedByUser: {
  //         select: {
  //           id: true,
  //           username: true,
  //           email: true,
  //         },
  //       },
  //     },
  //   });

  //   if (!agent) return null;

  //   return {
  //     ...agent,
  //     commission_rate: agent.commission_rate !== null ? Number(agent.commission_rate) : undefined,
  //   } as AgentInfo;
  // }


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
