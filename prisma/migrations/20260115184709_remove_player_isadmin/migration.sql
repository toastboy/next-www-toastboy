/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `Player` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ContactEnquiry` DROP FOREIGN KEY `ContactEnquiry_tokenHash_fkey`;

-- AlterTable
ALTER TABLE `Player` DROP COLUMN `isAdmin`;
