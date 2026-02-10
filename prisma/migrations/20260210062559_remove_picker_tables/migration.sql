/*
  Warnings:

  - The primary key for the `GameInvitation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `uuid` on the `GameInvitation` table. The data in that column could be lost. The data in that column will be cast from `Char(38)` to `Char(36)`.
  - You are about to drop the `Diffs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Picker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PickerTeams` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `GameInvitation` DROP PRIMARY KEY,
    MODIFY `uuid` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`uuid`);

-- DropTable
DROP TABLE `Diffs`;

-- DropTable
DROP TABLE `Picker`;

-- DropTable
DROP TABLE `PickerTeams`;
