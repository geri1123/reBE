// types/auth.ts
export interface BaseRegistration {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface UserRegistration extends BaseRegistration {
  role: 'user';
  terms_accepted: true;
  repeatPassword: string;
}

export interface AgencyOwnerRegistration extends BaseRegistration {
  role: 'agency_owner';
  terms_accepted: true;
  repeatPassword: string;
  agency_name: string;
  license_number: string;
  address: string;
}

export interface AgentRegistration extends BaseRegistration {
  role: 'agent';
  terms_accepted: true;
  repeatPassword: string;
  public_code: string;
  id_card_number: string;
  requested_role: 'agent' | 'senior_agent' | 'team_lead';
}

// Union type for the registration data that comes from Zod validation
export type RegistrationData = UserRegistration | AgencyOwnerRegistration | AgentRegistration;

// Type for the raw input data (before validation)
export interface RegistrationInput {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
  first_name: string;
  last_name: string;
  terms_accepted: boolean;
  role: 'user' | 'agency_owner' | 'agent';
  
  // Optional fields for different roles
  agency_name?: string;
  license_number?: string;
  address?: string;
  public_code?: string;
  id_card_number?: string;
  requested_role?: 'agent' | 'senior_agent' | 'team_lead';
}