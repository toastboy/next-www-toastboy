/*
  Warnings:

  - The primary key for the `PickerTeams` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `firstName` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Picker` ADD COLUMN `age` INTEGER NULL,
    ADD COLUMN `average` DOUBLE NULL,
    ADD COLUMN `goalie` TINYINT NULL,
    ADD COLUMN `played` INTEGER NULL;

-- AlterTable
ALTER TABLE `PickerTeams` DROP PRIMARY KEY,
    ADD COLUMN `team` ENUM('A', 'B') NULL;

-- AlterTable
ALTER TABLE `Player` DROP COLUMN `firstName`,
    DROP COLUMN `lastName`;
