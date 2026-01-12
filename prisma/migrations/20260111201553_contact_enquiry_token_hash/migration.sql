/*
  Warnings:

  - You are about to drop the column `purpose` on the `EmailVerification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ContactEnquiry` DROP FOREIGN KEY `ContactEnquiry_tokenHash_fkey`;

-- AlterTable
ALTER TABLE `EmailVerification` DROP COLUMN `purpose`;
