-- AlterTable
ALTER TABLE `productimage` MODIFY `imageUrl` TEXT NULL;

-- CreateTable
CREATE TABLE `ProductAttributeValue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `attributeId` INTEGER NOT NULL,
    `value` TEXT NOT NULL,

    UNIQUE INDEX `ProductAttributeValue_productId_attributeId_key`(`productId`, `attributeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductAttributeValue` ADD CONSTRAINT `ProductAttributeValue_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductAttributeValue` ADD CONSTRAINT `ProductAttributeValue_attributeId_fkey` FOREIGN KEY (`attributeId`) REFERENCES `attributes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
