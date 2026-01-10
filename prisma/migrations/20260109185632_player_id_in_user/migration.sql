-- AlterTable
ALTER TABLE `user` ADD COLUMN `playerId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `verification_identifier_idx` ON `verification`(`identifier`(191));
