/*
 Warnings:

 - You are about to change the data type of `born` on the `Player` table. Existing values will be converted to the birth year.

*/
-- Add a temporary year column to preserve existing data
ALTER TABLE `Player` ADD COLUMN `bornYear` INT NULL;

UPDATE `Player` SET `bornYear` = YEAR(`born`);

-- Replace the original born column with the year-only column
ALTER TABLE `Player` DROP COLUMN `born`;
ALTER TABLE `Player` CHANGE COLUMN `bornYear` `born` INT NULL;
