import { registrationrequest_status } from '@prisma/client';
import { NewRegistrationRequest } from '../../types/database.js';
import { AgentRequestQueryResult } from '../../types/AgentsRequest.js';

export interface IRegistrationRequestRepository {
  create(data: Omit<NewRegistrationRequest, 'id' | 'created_at' | 'updated_at' | 'user' | 'agency' | 'reviewer'> & {
    user_id: number;
    agency_id?: number;
  }): Promise<number>;

  idCardExists(idCard: string): Promise<boolean>;

  findAgentRequestsByAgencyId(
    agencyId: number,
    limit: number,
    offset: number
  ): Promise<{ data: AgentRequestQueryResult[]; total: number }>;

  countAgentRequestsByAgencyId(agencyId: number): Promise<number>;

  updateStatus(
    id: number,
    status: registrationrequest_status,
    reviewedBy?: number,
    reviewNotes?: string
  ): Promise<any>;

  findPendingRequests(limit?: number): Promise<any[]>;

  findByUserId(userId: number): Promise<any[]>;

  findById(id: number): Promise<any | null>;
}
