
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  about_me?: string;
  profile_img?: string;
  phone?: string;
  website?: string;
  role: 'user' | 'agency_owner' | 'agent';
  status: UserStatus;
  email_verified: boolean;
  last_login?: Date;
  last_active?: Date;
  created_at: Date;
  updated_at: Date;
  verification_token?: string;
  verification_token_expires?: Date;
}

export interface Agency {
  id: number;
  agency_name: string;
  public_code?: string;
  logo?: string;
  license_number: string;
  agency_email?: string;
  phone?: string;
  address?: string;
  website?: string;
  status: 'active' | 'inactive' | 'suspended';
  owner_user_id: number;
}

export interface RegistrationRequest {
  id: number;
  user_id: number;
  request_type: 'agent_license_verification';
  id_card_number?: string;
  agency_name?: string;
  supporting_documents?: any;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: number;
  review_notes?: string;
  created_at: Date;
  updated_at: Date;
  agency_id?: number;
}

// Base registration interface
export interface BaseRegistration {
  username: string;
  email: string;
  password: string;
  repeatPassword?: string;
  first_name: string;
  last_name: string;
  phone?: string;
  about_me?: string;
  website?: string;
  // terms_accepted: boolean;
}

// User registration (simple user)
export interface UserRegistration extends BaseRegistration {
  role: 'user';
}

// Agency owner registration
export interface AgencyOwnerRegistration extends BaseRegistration {
  role: 'agency_owner';
  agency_name: string;
  license_number: string;
  agency_email?: string;
  address: string;
  agency_website?: string;
}
// Agent registration
export interface AgentRegistration extends BaseRegistration {
  role: 'agent';
  agency_name?:string;
  requested_role:'agent' | 'senior_agent' | 'team_lead';
  public_code: string;
  id_card_number: string;
}

export type RegistrationData = UserRegistration | AgencyOwnerRegistration | AgentRegistration;

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  message: string;
  emailSent: boolean;
  requiresApproval?: boolean;
}
export interface LoginRequest {
  identifier: string;
  password: string;
}