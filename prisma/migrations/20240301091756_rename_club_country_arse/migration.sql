/*
 Warnings:
 
 - The primary key for the `ClubSupporter` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to drop the column `id` on the `ClubSupporter` table. All the data in the column will be lost.
 - The primary key for the `CountrySupporter` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to drop the column `id` on the `CountrySupporter` table. All the data in the column will be lost.
 - You are about to drop the `arse` table. If the table is not empty, all the data it contains will be lost.
 - You are about to drop the `club` table. If the table is not empty, all the data it contains will be lost.
 - You are about to drop the `country` table. If the table is not empty, all the data it contains will be lost.
 - A unique constraint covering the columns `[playerId,countryISOcode]` on the table `CountrySupporter` will be added. If there are existing duplicate values, this will fail.
 
 */
-- -- AlterTable
-- ALTER TABLE `ClubSupporter` DROP PRIMARY KEY,
--     DROP COLUMN `id`;
-- -- AlterTable
-- ALTER TABLE `CountrySupporter` DROP PRIMARY KEY,
--     DROP COLUMN `id`;
-- -- DropTable
-- DROP TABLE `arse`;
-- -- DropTable
-- DROP TABLE `club`;
-- -- DropTable
-- DROP TABLE `country`;
-- -- CreateTable
-- CREATE TABLE `Arse` (
--     `stamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
--     `in_goal` INTEGER NULL,
--     `running` INTEGER NULL,
--     `shooting` INTEGER NULL,
--     `passing` INTEGER NULL,
--     `ball_skill` INTEGER NULL,
--     `attacking` INTEGER NULL,
--     `defending` INTEGER NULL,
--     `playerId` INTEGER NOT NULL,
--     `raterId` INTEGER NOT NULL,
--     INDEX `Arse_playerId_idx`(`playerId`),
--     INDEX `Arse_raterId_idx`(`raterId`),
--     UNIQUE INDEX `Arse_playerId_raterId_key`(`playerId`, `raterId`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- -- CreateTable
-- CREATE TABLE `Club` (
--     `id` INTEGER NOT NULL AUTO_INCREMENT,
--     `soccerway_id` INTEGER NULL,
--     `club_name` VARCHAR(255) NULL,
--     `uri` VARCHAR(255) NULL,
--     `country` VARCHAR(255) NULL,
--     UNIQUE INDEX `id`(`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- -- CreateTable
-- CREATE TABLE `Country` (
--     `isoCode` VARCHAR(6) NOT NULL,
--     `name` VARCHAR(255) NOT NULL,
--     UNIQUE INDEX `isoCode`(`isoCode`),
--     UNIQUE INDEX `name`(`name`),
--     PRIMARY KEY (`isoCode`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- -- CreateIndex
-- CREATE UNIQUE INDEX `CountrySupporter_playerId_countryISOcode_key` ON `CountrySupporter`(`playerId`, `countryISOcode`);
-- -- RedefineIndex
-- CREATE INDEX `ClubSupporter_clubId_idx` ON `ClubSupporter`(`clubId`);
-- DROP INDEX `club_supporter_clubId_idx` ON `ClubSupporter`;
-- -- RedefineIndex
-- CREATE UNIQUE INDEX `ClubSupporter_playerId_clubId_key` ON `ClubSupporter`(`playerId`, `clubId`);
-- DROP INDEX `club_supporter_playerId_clubId_key` ON `ClubSupporter`;
-- -- RedefineIndex
-- CREATE INDEX `ClubSupporter_playerId_idx` ON `ClubSupporter`(`playerId`);
-- DROP INDEX `club_supporter_playerId_idx` ON `ClubSupporter`;
-- -- RedefineIndex
-- CREATE INDEX `CountrySupporter_countryISOcode_idx` ON `CountrySupporter`(`countryISOcode`);
-- DROP INDEX `iso_code` ON `CountrySupporter`;
-- -- RedefineIndex
-- CREATE INDEX `CountrySupporter_playerId_idx` ON `CountrySupporter`(`playerId`);
-- DROP INDEX `player` ON `CountrySupporter`;
DROP TABLE IF EXISTS Arse;

RENAME TABLE arse TO Arse;

DROP TABLE IF EXISTS Club;

RENAME TABLE club TO Club;

DROP TABLE IF EXISTS Country;

RENAME TABLE country TO Country;