/*
 Warnings:
 
 - You are about to alter the column `date` on the `GameDay` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
 - You are about to drop the column `goalie` on the `Player` table. All the data in the column will be lost.
 - You are about to alter the column `email` on the `Player` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
 
 */
-- AlterTable
ALTER TABLE
  `GameDay`
MODIFY
  `date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE
  `Player` DROP COLUMN `goalie`,
ADD
  COLUMN `name` VARCHAR(191) NULL,
MODIFY
  `first_name` VARCHAR(191) NULL,
MODIFY
  `last_name` VARCHAR(191) NULL,
MODIFY
  `email` VARCHAR(191) NULL,
MODIFY
  `joined` DATETIME(3) NULL,
MODIFY
  `finished` DATETIME(3) NULL,
MODIFY
  `born` DATETIME(3) NULL,
MODIFY
  `comment` VARCHAR(191) NULL;

-- Populate player name from first_name, last_name and anonymous flag
UPDATE
  `Player`
SET
  `name` = (
    SELECT
      IF(
        anonymous,
        CONCAT("Player ", id),
        CONCAT(first_name, " ", last_name)
      )
  );