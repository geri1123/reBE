-- AlterTable
ALTER TABLE `product` ADD COLUMN `status` ENUM('active', 'inactive', 'draft', 'sold', 'pending') NOT NULL DEFAULT 'draft';
