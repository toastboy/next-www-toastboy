/*
  Warnings:

  - The primary key for the `club_supporter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `club` on the `club_supporter` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `club_supporter` table. All the data in the column will be lost.
  - You are about to drop the column `player` on the `club_supporter` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[playerId,clubId]` on the table `club_supporter` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `club_ibfk_1` ON `club_supporter`;

-- DropIndex
DROP INDEX `club_ibfk_2` ON `club_supporter`;

-- AlterTable
-- ALTER TABLE `club_supporter` DROP PRIMARY KEY,
--     DROP COLUMN `club`,
--     DROP COLUMN `id`,
--     DROP COLUMN `player`,
--     ADD COLUMN `clubId` INTEGER NOT NULL DEFAULT 0,
--     ADD COLUMN `playerId` INTEGER NOT NULL DEFAULT 0;
ALTER TABLE `club_supporter`
    RENAME COLUMN `player` TO `playerId`,
    RENAME COLUMN `club` TO `clubId`;

-- CreateIndex
CREATE INDEX `club_supporter_playerId_idx` ON `club_supporter`(`playerId`);

-- CreateIndex
CREATE INDEX `club_supporter_clubId_idx` ON `club_supporter`(`clubId`);

-- CreateIndex
CREATE UNIQUE INDEX `club_supporter_playerId_clubId_key` ON `club_supporter`(`playerId`, `clubId`);
