/*
 Warnings:
 
 - You are about to alter the column `date` on the `GameDay` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
 
 */
-- AlterTable
ALTER TABLE
  `GameDay`
MODIFY
  `date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE
  `PlayerRecord`
ADD
  COLUMN `rank_averages_unqualified` INTEGER NULL,
ADD
  COLUMN `rank_speedy_unqualified` INTEGER NULL;