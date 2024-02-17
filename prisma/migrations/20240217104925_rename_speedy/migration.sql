/*
  Warnings:

  - You are about to drop the column `speedy_seconds` on the `standings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `standings` DROP COLUMN `speedy_seconds`,
    ADD COLUMN `speedy` INTEGER NULL;
