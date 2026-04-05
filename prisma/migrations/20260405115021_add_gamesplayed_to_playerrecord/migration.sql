/*
  Warnings:

  - Added the required column `gamesPlayed` to the `PlayerRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PlayerRecord` ADD COLUMN `gamesPlayed` INTEGER NOT NULL;
