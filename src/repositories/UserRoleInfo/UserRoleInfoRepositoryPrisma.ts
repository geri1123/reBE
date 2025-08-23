// // src/repositories/user/UserRoleInfoRepositoryPrisma.ts
// import { PrismaClient } from '@prisma/client';
// import type { UserWithRoleInfo, AgentInfo } from '../../types/userinfo.js';

// export class UserRoleInfoRepositoryPrisma {
//   constructor(private prisma: PrismaClient) {}

//   async findByIdWithRoleInfo(userId: number): Promise<UserWithRoleInfo | null> {
//     const user = await this.prisma.user.findUnique({
//       where: { id: userId },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         first_name: true,
//         last_name: true,
//         about_me: true,
//         profile_img: true,
//         phone: true,
//         website: true,
//         role: true,
//         status: true,
//         email_verified: true,
//         last_login: true,
//         last_active: true,
//         created_at: true,
//         updated_at: true,
//         // Include agency info if user is agency_owner
//         agency: userId ? { // only if user.role === 'agency_owner', handled in mapping
//           select: {
//             id: true,
//             agency_name: true,
//             public_code: true,
//             logo: true,
//             license_number: true,
//             agency_email: true,
//             phone: true,
//             address: true,
//             website: true,
//             status: true,
//           }
//         } : false,
//         // Include agent info if user is agent
//         agencyagent: userId ? { // only if user.role === 'agent'
//           select: {
//             id: true,
//             agent_id: true,
//             agency_id: true,
//             role_in_agency: true,
//             status: true,
//             commission_rate: true,
//             start_date: true,
//             end_date: true,
//             agency: {
//               select: {
//                 id: true,
//                 agency_name: true,
//                 logo: true,
//                 license_number: true,
//                 phone: true,
//                 website: true,
//                 status: true,
//                 public_code: true,
//                 agency_email: true,
//                 address: true,
//                 owner_user_id: true,
//               },
//             },
//             addedByUser: {
//               select: {
//                 id: true,
//                 username: true,
//                 email: true,
//               },
//             },
//           }
//         } : false,
//       },
//     });

//     if (!user) return null;

//     const result: UserWithRoleInfo = {
//       id: user.id,
//       username: user.username,
//       email: user.email,
//       first_name: user.first_name,
//       last_name: user.last_name,
//       about_me: user.about_me,
//       profile_img: user.profile_img,
//       phone: user.phone,
//       website: user.website,
//       role: user.role,
//       status: user.status as any,
//       email_verified: user.email_verified,
//       last_login: user.last_login,
//       last_active: user.last_active,
//       created_at: user.created_at,
//       updated_at: user.updated_at,
//       // map agency info if role is agency_owner
//       agencyInfo: user.role === 'agency_owner' ? (user.agency ?? null) : null,
//       // map agent info if role is agent
//       agentInfo: user.role === 'agent' ? (user.agencyagent as AgentInfo[] ?? []) : undefined,
//     };

//     return result;
//   }
// }
