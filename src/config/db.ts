
// export const db = drizzle(pool);
// export default pool;

// import mysql from 'mysql2/promise';
// import { config } from './config.js';
// import { drizzle } from 'drizzle-orm/mysql2';


// const pool = mysql.createPool({
//   host: config.db.host,
//   port: config.db.port,
//   user: config.db.user,
//   password: config.db.password,
//   database: config.db.name,
//   waitForConnections: true,
//   connectionLimit: 10,
//   maxIdle: 10,
//   idleTimeout: 60000,
//   queueLimit: 0,
//   enableKeepAlive: true,
//   keepAliveInitialDelay: 0,
// });

// // Test connection (optional)
// (async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log('✅ Connected to MySQL database');
//     connection.release();
//   } catch (error) {
//     console.error('❌ MySQL connection error:', error);
//     process.exit(1);
//   }
// })();

// // Create Drizzle ORM client from pool
// export const db = drizzle(pool);


// export default pool;


// generator client {
//   provider = "prisma-client-js"
// }

// datasource db {
//   provider = "mysql"
//   url      = env("DATABASE_URL")
// }

// model agency {
//   id                  Int                   @id @default(autoincrement())
//   agency_name         String
//   public_code         String?               @unique(map: "Agency_public_code_key")
//   logo                String?
//   license_number      String                @unique(map: "Agency_license_number_key")
//   agency_email        String?
//   phone               String?
//   address             String?               @db.Text
//   website             String?
//   status              agency_status         @default(active)
//   owner_user_id       Int                   @unique(map: "Agency_owner_user_id_key")
  
  
//   owner               user                  @relation(fields: [owner_user_id], references: [id], map: "Agency_owner_user_id_fkey")
//   agents              agencyagent[]
//   requests            registrationrequest[]
// }

// model agencyagent {
//   id                Int                        @id @default(autoincrement())
//   agency_id         Int
//   agent_id          Int
//   added_by          Int?
//   id_card_number    String?
//   role_in_agency    agencyagent_role_in_agency @default(agent)
//   commission_rate   Decimal?                   @db.Decimal(5, 2)
//   start_date        DateTime?
//   end_date          DateTime?
//   status            agencyagent_status         @default(active)
//   created_at        DateTime                   @default(now())
//   updated_at        DateTime                   @updatedAt
  
  
//   addedBy           user?                      @relation("AgentAddedBy", fields: [added_by], references: [id], map: "AgencyAgent_added_by_fkey")
//   agency            agency                     @relation(fields: [agency_id], references: [id], map: "AgencyAgent_agency_id_fkey")
//   agent             user                       @relation("AgencyAgent", fields: [agent_id], references: [id], map: "AgencyAgent_agent_id_fkey")

//   @@unique([agency_id, agent_id], map: "AgencyAgent_agency_id_agent_id_key")
//   @@index([added_by], map: "AgencyAgent_added_by_fkey")
//   @@index([agent_id], map: "AgencyAgent_agent_id_fkey")
// }

// model registrationrequest {
//   id                   Int                                 @id @default(autoincrement())
//   user_id              Int
//   request_type         registrationrequest_request_type
//   id_card_number       String?
//   agency_name          String?
//   agency_id            Int?
//   supporting_documents String?                             @db.Text
//   status               registrationrequest_status          @default(pending)
//   reviewed_by          Int?
//   review_notes         String?                             @db.Text
//   reviewed_at          DateTime?
//   requested_role       registrationrequest_requested_role?
//   license_number       String?
//   created_at           DateTime                            @default(now())
//   updated_at           DateTime                            @updatedAt
  
 
//   agency               agency?                             @relation(fields: [agency_id], references: [id], map: "RegistrationRequest_agency_id_fkey")
//   reviewer             user?                               @relation("RequestReviewer", fields: [reviewed_by], references: [id], map: "RegistrationRequest_reviewed_by_fkey")
//   user                 user                                @relation("RequestSubmitter", fields: [user_id], references: [id], map: "RegistrationRequest_user_id_fkey")

//   @@unique([user_id, request_type, status], map: "RegistrationRequest_user_id_request_type_status_key")
//   @@index([agency_id], map: "RegistrationRequest_agency_id_idx")
//   @@index([request_type], map: "RegistrationRequest_request_type_idx")
//   @@index([reviewed_by], map: "RegistrationRequest_reviewed_by_idx")
//   @@index([status], map: "RegistrationRequest_status_idx")
//   @@index([user_id], map: "RegistrationRequest_user_id_idx")
// }

// model user {
//   id                         Int                   @id @default(autoincrement())
//   username                   String                @unique(map: "User_username_key")
//   email                      String                @unique(map: "User_email_key")
//   password                   String
//   first_name                 String?
//   last_name                  String?
//   about_me                   String?               @db.Text
//   profile_img                String?
//   phone                      String?
//   website                    String?
//   role                       user_role
//   status                     user_status           @default(active)
//   email_verified             Boolean               @default(false)
//   last_login                 DateTime?
//   last_active                DateTime?
//   created_at                 DateTime              @default(now())
//   updated_at                 DateTime              @updatedAt
//   verification_token         String?
//   verification_token_expires DateTime?
  

//   ownedAgency                agency?
//   addedAgents                agencyagent[]         @relation("AgentAddedBy")
//   agencyMemberships          agencyagent[]         @relation("AgencyAgent")
//   notifications              notification[]
//   reviewedRequests           registrationrequest[] @relation("RequestReviewer")
//   submittedRequests          registrationrequest[] @relation("RequestSubmitter")
//   usernameHistory            usernamehistory[]
// }

// model usernamehistory {
//   id                   Int      @id @default(autoincrement())
//   user_id              Int
//   old_username         String
//   new_username         String
//   next_username_update DateTime @default(now())
//   user                 user     @relation(fields: [user_id], references: [id], map: "UsernameHistory_user_id_fkey")

//   @@index([user_id], map: "UsernameHistory_user_id_idx")
// }

// model notification {
//   id                      Int                       @id @default(autoincrement())
//   userId                  Int
//   type                    String
//   status                  notification_status       @default(unread)
//   createdAt               DateTime                  @default(now())
//   user                    user                      @relation(fields: [userId], references: [id], onDelete: Cascade, map: "Notification_userId_fkey")
//   translations            notificationtranslation[]

//   @@index([userId], map: "Notification_userId_fkey")
// }

// model notificationtranslation {
//   id             Int          @id @default(autoincrement())
//   notificationId Int
//   languageCode   String
//   message        String
//   notification   notification @relation(fields: [notificationId], references: [id], onDelete: Cascade, map: "NotificationTranslation_notificationId_fkey")

//   @@index([notificationId], map: "NotificationTranslation_notificationId_fkey")
// }

// enum registrationrequest_request_type {
//   agent_license_verification
//   agency_registration
//   role_change_request
// }

// enum agencyagent_role_in_agency {
//   agent
//   senior_agent
//   team_lead
// }

// enum registrationrequest_status {
//   pending
//   approved
//   rejected
//   under_review
// }

// enum agency_status {
//   active
//   inactive
//   suspended
// }

// enum agencyagent_status {
//   active
//   inactive
//   terminated
// }

// enum user_role {
//   user
//   agency_owner
//   agent
// }

// enum registrationrequest_requested_role {
//   agent
//   senior_agent
//   team_lead
// }

// enum user_status {
//   active
//   inactive
//   pending
//   suspended
// }

// enum notification_status {
//   unread
//   read
// }