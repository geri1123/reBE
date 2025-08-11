-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `about_me` TEXT NULL,
    `profile_img` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `role` ENUM('user', 'agency_owner', 'agent') NOT NULL,
    `status` ENUM('active', 'inactive', 'pending', 'suspended') NOT NULL DEFAULT 'active',
    `email_verified` BOOLEAN NOT NULL DEFAULT false,
    `last_login` DATETIME(3) NULL,
    `last_active` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `verification_token` VARCHAR(191) NULL,
    `verification_token_expires` DATETIME(3) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agency` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `agency_name` VARCHAR(191) NOT NULL,
    `public_code` VARCHAR(191) NULL,
    `logo` VARCHAR(191) NULL,
    `license_number` VARCHAR(191) NOT NULL,
    `agency_email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `address` TEXT NULL,
    `website` VARCHAR(191) NULL,
    `status` ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
    `owner_user_id` INTEGER NOT NULL,

    UNIQUE INDEX `Agency_public_code_key`(`public_code`),
    UNIQUE INDEX `Agency_license_number_key`(`license_number`),
    UNIQUE INDEX `Agency_owner_user_id_key`(`owner_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AgencyAgent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `agency_id` INTEGER NOT NULL,
    `agent_id` INTEGER NOT NULL,
    `added_by` INTEGER NULL,
    `id_card_number` VARCHAR(191) NULL,
    `role_in_agency` ENUM('agent', 'senior_agent', 'team_lead') NOT NULL DEFAULT 'agent',
    `commission_rate` DECIMAL(5, 2) NULL,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `status` ENUM('active', 'inactive', 'terminated') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `AgencyAgent_added_by_fkey`(`added_by`),
    INDEX `AgencyAgent_agent_id_fkey`(`agent_id`),
    UNIQUE INDEX `AgencyAgent_agency_id_agent_id_key`(`agency_id`, `agent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RegistrationRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `request_type` ENUM('agent_license_verification', 'agency_registration', 'role_change_request') NOT NULL,
    `id_card_number` VARCHAR(191) NULL,
    `agency_name` VARCHAR(191) NULL,
    `agency_id` INTEGER NULL,
    `supporting_documents` TEXT NULL,
    `status` ENUM('pending', 'approved', 'rejected', 'under_review') NOT NULL DEFAULT 'pending',
    `reviewed_by` INTEGER NULL,
    `review_notes` TEXT NULL,
    `reviewed_at` DATETIME(3) NULL,
    `requested_role` ENUM('agent', 'agency_owner') NULL,
    `license_number` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `RegistrationRequest_user_id_idx`(`user_id`),
    INDEX `RegistrationRequest_reviewed_by_idx`(`reviewed_by`),
    INDEX `RegistrationRequest_agency_id_idx`(`agency_id`),
    INDEX `RegistrationRequest_status_idx`(`status`),
    INDEX `RegistrationRequest_request_type_idx`(`request_type`),
    UNIQUE INDEX `RegistrationRequest_user_id_request_type_status_key`(`user_id`, `request_type`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsernameHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `old_username` VARCHAR(191) NOT NULL,
    `new_username` VARCHAR(191) NOT NULL,
    `next_username_update` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UsernameHistory_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Agency` ADD CONSTRAINT `Agency_owner_user_id_fkey` FOREIGN KEY (`owner_user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgencyAgent` ADD CONSTRAINT `AgencyAgent_added_by_fkey` FOREIGN KEY (`added_by`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgencyAgent` ADD CONSTRAINT `AgencyAgent_agency_id_fkey` FOREIGN KEY (`agency_id`) REFERENCES `Agency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgencyAgent` ADD CONSTRAINT `AgencyAgent_agent_id_fkey` FOREIGN KEY (`agent_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistrationRequest` ADD CONSTRAINT `RegistrationRequest_agency_id_fkey` FOREIGN KEY (`agency_id`) REFERENCES `Agency`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistrationRequest` ADD CONSTRAINT `RegistrationRequest_reviewed_by_fkey` FOREIGN KEY (`reviewed_by`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistrationRequest` ADD CONSTRAINT `RegistrationRequest_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsernameHistory` ADD CONSTRAINT `UsernameHistory_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
