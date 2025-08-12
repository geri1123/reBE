-- AlterTable
ALTER TABLE `agencyagent` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `category` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `listing_type` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `registrationrequest` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `updated_at` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `attributes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subcategoryId` INTEGER NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `inputType` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attribute_translation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `attribute_id` INTEGER NOT NULL,
    `language` ENUM('en', 'al') NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attribute_values` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `attribute_id` INTEGER NOT NULL,
    `value_code` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attribute_value_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `attribute_value_id` INTEGER NOT NULL,
    `language` ENUM('en', 'al') NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `attributes` ADD CONSTRAINT `attributes_subcategoryId_fkey` FOREIGN KEY (`subcategoryId`) REFERENCES `subcategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attribute_translation` ADD CONSTRAINT `attribute_translation_attribute_id_fkey` FOREIGN KEY (`attribute_id`) REFERENCES `attributes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attribute_values` ADD CONSTRAINT `attribute_values_attribute_id_fkey` FOREIGN KEY (`attribute_id`) REFERENCES `attributes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attribute_value_translations` ADD CONSTRAINT `attribute_value_translations_attribute_value_id_fkey` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
