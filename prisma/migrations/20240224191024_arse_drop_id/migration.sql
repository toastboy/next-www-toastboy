/*
  Warnings:

  - The primary key for the `arse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `arse` table. All the data in the column will be lost.
  - Made the column `playerId` on table `arse` required. This step will fail if there are existing NULL values in that column.
  - Made the column `raterId` on table `arse` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `arse` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    MODIFY `playerId` INTEGER NOT NULL,
    MODIFY `raterId` INTEGER NOT NULL;
