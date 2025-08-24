export type NewAgencyAgent = {
  userId: number;
  agency_id: number;
  added_by: number;
  id_card_number: string | null;
  role_in_agency: "agent" | "senior_agent" | "team_lead";
  status: 'active' | 'inactive'|'terminated';
  commission_rate?: number;
  start_date?: Date;
  end_date?: Date | null;
};

export type AgentInfo = {
  id: number;
  agent_id: number;
  agency_id: number;
  role_in_agency: string;
  status: string;
  commission_rate?: number;
  start_date?: Date;
  end_date?: Date;
  agency: {
    id: number;
    agency_name: string;
    logo?: string | null;
    
    phone?: string | null;
    website?: string | null;
    status: string;
    public_code?: string | null;
    agency_email?: string | null;
    address?: string | null;
   
  };
  addedByUser?: {
    id: number;
    username: string;
    email: string;
  } | null;
};