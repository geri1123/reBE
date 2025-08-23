// types/userinfo.ts
export type BaseUserInfo = {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  about_me: string | null;
  profile_img: string | null;
  phone: string | null;
  website: string | null;
  role: 'user' | 'agent' | 'agency_owner';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  email_verified?: boolean;
  last_login?: Date | null;
  last_active?: Date | null;
  created_at?: Date;
  updated_at?: Date | null;
};

export type AgentInfo = {
  id: number;
  agent_id: number;
  agency_id: number;
  role_in_agency: 'agent'|'senior_agent'| 'team_lead';
  id_card_number:string;
  status: 'active'| 'inactive'| 'terminated';
  commission_rate?: number;
  start_date?: Date;
  end_date?: Date;
  created_at:Date;
  agency: {
    id: number;
    agency_name: string;
    logo?: string | null;
    license_number: string;
    phone?: string | null;
    website?: string | null;
    status: string;
    public_code?: string | null;
    agency_email?: string | null;
    address?: string | null;
    owner_user_id: number;
  };
  addedByUser?: {
    id: number;
    username: string;
    email: string;
  } | null;
};

export type UserWithRoleInfo = BaseUserInfo & {
  agentInfo?: AgentInfo[];
  agencyInfo?: {
    id: number;
    agency_name: string;
    public_code?: string | null;
    logo?: string | null;
    license_number: string;
    agency_email?: string | null;
    phone?: string | null;
    address?: string | null;
    website?: string | null;
    status: 'active'| 'inactive'| 'suspended';
  } | null;
};
