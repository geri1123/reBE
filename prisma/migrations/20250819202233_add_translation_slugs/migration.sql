/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `attribute_translation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `subcategorytranslation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `attribute_translation` ADD COLUMN `slug` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `attribute_value_translations` ADD COLUMN `slug` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `categorytranslation` ADD COLUMN `slug` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `listing_type_translation` ADD COLUMN `slug` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `subcategorytranslation` ADD COLUMN `slug` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `AttributeTranslation_slug_key` ON `attribute_translation`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `SubcategoryTranslation_slug_key` ON `subcategorytranslation`(`slug`);
