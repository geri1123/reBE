-- AlterTable
ALTER TABLE `product` MODIFY `status` ENUM('active', 'inactive', 'draft', 'sold', 'pending') NOT NULL DEFAULT 'active';
