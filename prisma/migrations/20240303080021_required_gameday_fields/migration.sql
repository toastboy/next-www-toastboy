/*
  Warnings:

  - Made the column `date` on table `GameDay` required. This step will fail if there are existing NULL values in that column.
  - Made the column `game` on table `GameDay` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `GameDay` MODIFY `date` DATE NOT NULL,
    MODIFY `game` BOOLEAN NOT NULL DEFAULT true;
