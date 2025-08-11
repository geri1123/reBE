/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `category` table. All the data in the column will be lost.
  - You are about to alter the column `languageCode` on the `notificationtranslation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(10))`.

*/
-- DropForeignKey
ALTER TABLE `agencyagent` DROP FOREIGN KEY `AgencyAgent_added_by_fkey`;

-- DropForeignKey
ALTER TABLE `agencyagent` DROP FOREIGN KEY `AgencyAgent_agency_id_fkey`;

-- DropForeignKey
ALTER TABLE `agencyagent` DROP FOREIGN KEY `AgencyAgent_agent_id_fkey`;

-- DropForeignKey
ALTER TABLE `registrationrequest` DROP FOREIGN KEY `RegistrationRequest_reviewed_by_fkey`;

-- DropForeignKey
ALTER TABLE `registrationrequest` DROP FOREIGN KEY `RegistrationRequest_user_id_fkey`;

-- AlterTable
ALTER TABLE `agencyagent` MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `category` DROP COLUMN `updatedAt`,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `notificationtranslation` MODIFY `languageCode` ENUM('en', 'al') NOT NULL;

-- AlterTable
ALTER TABLE `registrationrequest` MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `listing_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `listing_type_translation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `listingTypeId` INTEGER NOT NULL,
    `language` ENUM('en', 'al') NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Listing_Type_Translation_listingTypeId_language_key`(`listingTypeId`, `language`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `agencyagent` ADD CONSTRAINT `agencyagent_added_by_fkey` FOREIGN KEY (`added_by`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agencyagent` ADD CONSTRAINT `agencyagent_agent_id_fkey` FOREIGN KEY (`agent_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agencyagent` ADD CONSTRAINT `agencyagent_agency_id_fkey` FOREIGN KEY (`agency_id`) REFERENCES `agency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listing_type_translation` ADD CONSTRAINT `Listing_Type_Translation_listingTypeId_fkey` FOREIGN KEY (`listingTypeId`) REFERENCES `listing_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `registrationrequest` ADD CONSTRAINT `registrationrequest_reviewed_by_fkey` FOREIGN KEY (`reviewed_by`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `registrationrequest` ADD CONSTRAINT `registrationrequest_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
