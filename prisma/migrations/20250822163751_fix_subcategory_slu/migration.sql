-- AlterTable
ALTER TABLE `attribute_translation` MODIFY `language` ENUM('en', 'al', 'it') NOT NULL;

-- AlterTable
ALTER TABLE `attribute_value_translations` MODIFY `language` ENUM('en', 'al', 'it') NOT NULL;

-- AlterTable
ALTER TABLE `categorytranslation` MODIFY `language` ENUM('en', 'al', 'it') NOT NULL;

-- AlterTable
ALTER TABLE `listing_type_translation` MODIFY `language` ENUM('en', 'al', 'it') NOT NULL;

-- AlterTable
ALTER TABLE `notificationtranslation` MODIFY `languageCode` ENUM('en', 'al', 'it') NOT NULL;

-- AlterTable
ALTER TABLE `subcategorytranslation` MODIFY `language` ENUM('en', 'al', 'it') NOT NULL;
