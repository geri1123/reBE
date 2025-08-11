import type {
  Prisma,
  user,
  agency,
  registrationrequest,
  usernamehistory
} from '@prisma/client';

// Model types (from Prisma client)
export type UserModel = user;
export type NewUser = Prisma.userCreateInput;
export type UpdatableUserFields = Partial<Pick<
  user,
  | 'first_name'
  | 'last_name'
  | 'username'
  | 'email'
  | 'phone'
  | 'about_me'
  | 'password'
  | 'profile_img'
  | 'last_login'
  | 'last_active'
  |'role'
  | 'status'
>>;

export type AgencyModel = agency;
export type NewAgency = Prisma.agencyCreateInput;
export type NewAgencyUnchecked = Prisma.agencyUncheckedCreateInput;


export type RegistrationRequestModel = registrationrequest;
export type NewRegistrationRequest = Prisma.registrationrequestCreateInput;

export type UsernameHistoryRecord = usernamehistory;
export type NewUsernameHistoryRecord = Prisma.usernamehistoryCreateInput;

// Partial views
export type PartialUserForLogin = Pick<user, 'id' | 'username' | 'email' | 'password' | 'status' | 'role'>;
export type PartialUserByToken = Pick<user, 'id' | 'role' | 'email' | 'first_name'| 'username'>;

// No need for tinyint <-> boolean conversions in Prisma,
// because Prisma treats booleans as native booleans in TypeScript.

// But if you want to add helpers for legacy raw queries, example:

export const convertNumberToBoolean = (value: number): boolean => value === 1;
export const convertBooleanToNumber = (value: boolean): number => value ? 1 : 0;

// import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
// import { agencies } from '../db/schema/agencies';
// import { registration_requests } from '../db/schema/registration_requests';
// import { users } from '../db/schema/users.js';
// import { username_history } from '../db/schema/username_history.js';

// // Generated types from schema
// export type User = InferSelectModel<typeof users>;
// export type NewUser = InferInsertModel<typeof users>;
// export type UpdatableUserFields = Partial<Pick<
//   NewUser,
//   'first_name' | 'last_name' | 'username' | 'email' | 'phone' | 'about_me' | 'password'| 'profile_img'| 'last_login' | 'last_active'
// >>;


// export type Agency = InferSelectModel<typeof agencies>;
// export type NewAgency = InferInsertModel<typeof agencies>;

// export type RegistrationRequest = InferSelectModel<typeof registration_requests>;
// export type NewRegistrationRequest = InferInsertModel<typeof registration_requests>;

// export type UsernameHistoryRecord = InferSelectModel<typeof username_history>;
// export type NewUsernameHistoryRecord = InferInsertModel<typeof username_history>;

// // Partial views
// export type PartialUserForLogin = Pick<User, 'id' | 'username' | 'email' | 'password' | 'status'| 'role' >;
// export type PartialUserByToken = Pick<User, 'id' | 'role' | 'email' | 'first_name' >;

// // (convert tinyint to boolean)
// export interface UserWithBooleans extends Omit<User, 'email_verified'> {
//   email_verified: boolean;
// }

// // Helper functions for type conversion
// export const convertTinyintToBoolean = (value: number): boolean => value === 1;
// export const convertBooleanToTinyint = (value: boolean): number => value ? 1 : 0;
