/*
 Warnings:
 
 - The primary key for the `country` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to drop the column `country_name` on the `country` table. All the data in the column will be lost.
 - You are about to drop the column `iso_code` on the `country` table. All the data in the column will be lost.
 - You are about to drop the `club_supporter` table. If the table is not empty, all the data it contains will be lost.
 - You are about to drop the `nationality` table. If the table is not empty, all the data it contains will be lost.
 - A unique constraint covering the columns `[isoCode]` on the table `country` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[name]` on the table `country` will be added. If there are existing duplicate values, this will fail.
 - Added the required column `isoCode` to the `country` table without a default value. This is not possible if the table is not empty.
 - Added the required column `name` to the `country` table without a default value. This is not possible if the table is not empty.
 
 */
-- DropIndex
ALTER TABLE
    `nationality` DROP FOREIGN KEY IF EXISTS `nationality_ibfk_1`;

DROP INDEX `country_name` ON `country`;

-- DropIndex
ALTER TABLE
    `nationality` DROP FOREIGN KEY IF EXISTS `nationality_ibfk_2`;

DROP INDEX `iso_code` ON `country`;

-- AlterTable
-- ALTER TABLE
--     `country` DROP PRIMARY KEY,
--     DROP COLUMN `country_name`,
--     DROP COLUMN `iso_code`,
-- ADD
--     COLUMN `isoCode` VARCHAR(6) NOT NULL,
-- ADD
--     COLUMN `name` VARCHAR(255) NOT NULL,
-- ADD
--     PRIMARY KEY (`isoCode`);
ALTER TABLE
    `country` RENAME COLUMN `country_name` TO `name`,
    RENAME COLUMN `iso_code` TO `isoCode`;

-- DropTable
-- DROP TABLE `club_supporter`;
-- DropTable
-- DROP TABLE `nationality`;
-- CreateTable
-- CREATE TABLE `ClubSupporter` (
--     `playerId` INTEGER NOT NULL DEFAULT 0,
--     `clubId` INTEGER NOT NULL DEFAULT 0,
--     INDEX `ClubSupporter_playerId_idx`(`playerId`),
--     INDEX `ClubSupporter_clubId_idx`(`clubId`),
--     UNIQUE INDEX `ClubSupporter_playerId_clubId_key`(`playerId`, `clubId`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
DROP TABLE IF EXISTS ClubSupporter;

RENAME TABLE club_supporter TO ClubSupporter;

-- CreateTable
-- CREATE TABLE `CountrySupporter` (
--     `playerId` INTEGER NOT NULL,
--     `countryISOcode` VARCHAR(6) NOT NULL,
--     INDEX `CountrySupporter_playerId_idx`(`playerId`),
--     INDEX `CountrySupporter_countryISOcode_idx`(`countryISOcode`),
--     UNIQUE INDEX `CountrySupporter_playerId_countryISOcode_key`(`playerId`, `countryISOcode`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
DROP TABLE IF EXISTS CountrySupporter;

RENAME TABLE nationality TO CountrySupporter;

ALTER TABLE
    `CountrySupporter` RENAME COLUMN `player` TO `playerId`,
    RENAME COLUMN `iso_code` TO `countryISOcode`;

-- CreateIndex
CREATE UNIQUE INDEX `isoCode` ON `country`(`isoCode`);

-- CreateIndex
CREATE UNIQUE INDEX `name` ON `country`(`name`);