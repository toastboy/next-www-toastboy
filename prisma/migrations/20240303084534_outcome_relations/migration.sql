/*
 Warnings:
 
 - You are about to drop the column `game_day` on the `Outcome` table. All the data in the column will be lost.
 - You are about to drop the column `player` on the `Outcome` table. All the data in the column will be lost.
 - A unique constraint covering the columns `[gameDayId,playerId]` on the table `Outcome` will be added. If there are existing duplicate values, this will fail.
 - Added the required column `gameDayId` to the `Outcome` table without a default value. This is not possible if the table is not empty.
 - Added the required column `playerId` to the `Outcome` table without a default value. This is not possible if the table is not empty.
 
 */
-- DropIndex
ALTER TABLE
  `Outcome` DROP FOREIGN KEY IF EXISTS `Outcome_ibfk_1`;

ALTER TABLE
  `Outcome` DROP FOREIGN KEY IF EXISTS `Outcome_ibfk_2`;

DROP INDEX `game_day` ON `Outcome`;

-- DropIndex
DROP INDEX `idx_outcome` ON `Outcome`;

-- DropIndex
DROP INDEX `unique_outcome` ON `Outcome`;

-- AlterTable
-- ALTER TABLE `Outcome` DROP COLUMN `game_day`,
--     DROP COLUMN `player`,
--     ADD COLUMN `gameDayId` INTEGER NOT NULL,
--     ADD COLUMN `playerId` INTEGER NOT NULL;
ALTER TABLE
  `Outcome` RENAME COLUMN `player` TO `playerId`,
  RENAME COLUMN `game_day` TO `gameDayId`;

-- CreateIndex
CREATE INDEX `Outcome_gameDayId_idx` ON `Outcome`(`gameDayId`);

-- CreateIndex
CREATE INDEX `Outcome_playerId_idx` ON `Outcome`(`playerId`);

-- CreateIndex
CREATE UNIQUE INDEX `Outcome_gameDayId_playerId_key` ON `Outcome`(`gameDayId`, `playerId`);