/*
 Warnings:
 
 - Added the required column `year` to the `GameDay` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE
  `GameDay`
ADD
  COLUMN `year` INTEGER NOT NULL;

UPDATE
  `GameDay`
SET
  `year` = EXTRACT(
    YEAR
    FROM
      `date`
  );