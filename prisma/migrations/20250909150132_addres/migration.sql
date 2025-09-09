-- AlterTable
ALTER TABLE `listing_type_translation` MODIFY `name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `streetAddress` VARCHAR(191) NULL;
