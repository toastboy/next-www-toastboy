/*
 Warnings:

 - You are about to drop the column `responsetime` on the `Outcome` table. All the data in the column will be lost.
 - You are about to alter the column `response` on the `Outcome` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `Enum(EnumId(1))`.
 - You are about to drop the `Standings` table. If the table is not empty, all the data it contains will be lost.

 */
-- AlterTable
ALTER TABLE
  `Outcome` RENAME COLUMN `responsetime` TO `responseTime`;

ALTER TABLE
  `Outcome`
MODIFY
  `response` ENUM(
    'Yes',
    'No',
    'Dunno',
    'Excused',
    'Flaked',
    'Injured'
  ) NULL;

-- DropTable
DROP TABLE IF EXISTS `Standings`;

-- CreateTable
DROP TABLE IF EXISTS `PlayerRecord`;
CREATE TABLE `PlayerRecord` (
  `year` INTEGER NOT NULL,
  `responses` INTEGER NULL DEFAULT 0,
  `P` INTEGER NULL DEFAULT 0,
  `W` INTEGER NULL DEFAULT 0,
  `D` INTEGER NULL DEFAULT 0,
  `L` INTEGER NULL DEFAULT 0,
  `points` INTEGER NULL DEFAULT 0,
  `averages` DECIMAL(10, 3) NULL DEFAULT 0.000,
  `stalwart` INTEGER NULL DEFAULT 0,
  `pub` INTEGER NULL DEFAULT 0,
  `rank_points` INTEGER NULL,
  `rank_averages` INTEGER NULL,
  `rank_stalwart` INTEGER NULL,
  `rank_speedy` INTEGER NULL,
  `rank_pub` INTEGER NULL,
  `speedy` INTEGER NULL,
  `playerId` INTEGER NOT NULL,
  `gameDayId` INTEGER NOT NULL,
  INDEX `PlayerRecord_playerId_idx`(`playerId`),
  INDEX `PlayerRecord_year_idx`(`year`),
  INDEX `PlayerRecord_gameDayId_idx`(`gameDayId`),
  UNIQUE INDEX `PlayerRecord_playerId_year_gameDayId_key`(`playerId`, `year`, `gameDayId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;