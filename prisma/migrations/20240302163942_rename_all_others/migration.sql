/*
 Warnings:
 
 - The primary key for the `ClubSupporter` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to drop the column `id` on the `ClubSupporter` table. All the data in the column will be lost.
 - The primary key for the `CountrySupporter` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to drop the column `id` on the `CountrySupporter` table. All the data in the column will be lost.
 - You are about to drop the column `mugshot` on the `Player` table. All the data in the column will be lost.
 - You are about to drop the `diffs` table. If the table is not empty, all the data it contains will be lost.
 - You are about to drop the `game_chat` table. If the table is not empty, all the data it contains will be lost.
 - You are about to drop the `game_day` table. If the table is not empty, all the data it contains will be lost.
 - You are about to drop the `invitation` table. If the table is not empty, all the data it contains will be lost.
 - You are about to drop the `outcome` table. If the table is not empty, all the data it contains will be lost.
 - You are about to drop the `picker` table. If the table is not empty, all the data it contains will be lost.
 - You are about to drop the `picker_teams` table. If the table is not empty, all the data it contains will be lost.
 - You are about to drop the `standings` table. If the table is not empty, all the data it contains will be lost.
 - A unique constraint covering the columns `[playerId,countryISOcode]` on the table `CountrySupporter` will be added. If there are existing duplicate values, this will fail.
 
 */
-- -- AlterTable
-- ALTER TABLE `ClubSupporter` DROP PRIMARY KEY,
--     DROP COLUMN `id`;
-- -- AlterTable
-- ALTER TABLE `CountrySupporter` DROP PRIMARY KEY,
--     DROP COLUMN `id`;
-- -- AlterTable
-- ALTER TABLE `Player` DROP COLUMN `mugshot`;
-- -- DropTable
-- DROP TABLE `diffs`;
-- -- DropTable
-- DROP TABLE `game_chat`;
-- -- DropTable
-- DROP TABLE `game_day`;
-- -- DropTable
-- DROP TABLE `invitation`;
-- -- DropTable
-- DROP TABLE `outcome`;
-- -- DropTable
-- DROP TABLE `picker`;
-- -- DropTable
-- DROP TABLE `picker_teams`;
-- -- DropTable
-- DROP TABLE `standings`;
-- -- CreateTable
-- CREATE TABLE `Diffs` (
--     `id` INTEGER NOT NULL AUTO_INCREMENT,
--     `a` TEXT NULL,
--     `b` TEXT NULL,
--     `diff_age` DOUBLE NULL,
--     `diff_unknown_age` INTEGER NULL,
--     `diff_goalies` TINYINT NULL,
--     `diff_average` DECIMAL(10, 3) NULL,
--     `diff_played` INTEGER NULL,
--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- -- CreateTable
-- CREATE TABLE `GameChat` (
--     `id` INTEGER NOT NULL AUTO_INCREMENT,
--     `game_day` INTEGER NOT NULL,
--     `stamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
--     `player` INTEGER NOT NULL,
--     `body` MEDIUMTEXT NULL,
--     INDEX `player`(`player`),
--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- -- CreateTable
-- CREATE TABLE `GameDay` (
--     `game_number` INTEGER NOT NULL,
--     `game_date` DATE NULL,
--     `game` BOOLEAN NULL DEFAULT true,
--     `mail_sent` DATETIME(0) NULL,
--     `comment` VARCHAR(255) NULL,
--     `bibs` ENUM('A', 'B') NULL,
--     `picker_games_history` INTEGER NULL,
--     PRIMARY KEY (`game_number`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- -- CreateTable
-- CREATE TABLE `Invitation` (
--     `uuid` CHAR(38) NOT NULL,
--     `player` INTEGER NOT NULL DEFAULT 0,
--     `game_day` INTEGER NOT NULL DEFAULT 0,
--     INDEX `invitation_ibfk_1`(`player`),
--     INDEX `invitation_ibfk_2`(`game_day`),
--     PRIMARY KEY (`uuid`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- -- CreateTable
-- CREATE TABLE `Outcome` (
--     `game_day` INTEGER NOT NULL,
--     `player` INTEGER NOT NULL,
--     `response` VARCHAR(20) NULL,
--     `responsetime` DATETIME(0) NULL,
--     `points` INTEGER NULL,
--     `team` ENUM('A', 'B') NULL,
--     `comment` VARCHAR(127) NULL,
--     `pub` TINYINT NULL,
--     `paid` BOOLEAN NULL,
--     `goalie` TINYINT NULL,
--     INDEX `game_day`(`game_day`),
--     INDEX `idx_outcome`(`player`, `game_day`),
--     UNIQUE INDEX `unique_outcome`(`player`, `game_day`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- -- CreateTable
-- CREATE TABLE `Picker` (
--     `player` INTEGER NOT NULL,
--     `player_name` VARCHAR(255) NULL,
--     `age` INTEGER NULL,
--     `average` DECIMAL(10, 3) NULL,
--     `goalie` TINYINT NULL,
--     `played` INTEGER NULL,
--     PRIMARY KEY (`player`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- -- CreateTable
-- CREATE TABLE `PickerTeams` (
--     `player` INTEGER NOT NULL,
--     `team` ENUM('A', 'B') NULL,
--     UNIQUE INDEX `player`(`player`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- -- CreateTable
-- CREATE TABLE `Standings` (
--     `player` INTEGER NOT NULL DEFAULT 0,
--     `table_year` INTEGER NOT NULL,
--     `game_day` INTEGER NOT NULL DEFAULT 0,
--     `responses` INTEGER NULL DEFAULT 0,
--     `P` INTEGER NULL DEFAULT 0,
--     `W` INTEGER NULL DEFAULT 0,
--     `D` INTEGER NULL DEFAULT 0,
--     `L` INTEGER NULL DEFAULT 0,
--     `points` INTEGER NULL DEFAULT 0,
--     `averages` DECIMAL(10, 3) NULL DEFAULT 0.000,
--     `stalwart` INTEGER NULL DEFAULT 0,
--     `pub` INTEGER NULL DEFAULT 0,
--     `rank_points` INTEGER NULL,
--     `rank_averages` INTEGER NULL,
--     `rank_stalwart` INTEGER NULL,
--     `rank_speedy` INTEGER NULL,
--     `rank_pub` INTEGER NULL,
--     `speedy` INTEGER NULL,
--     INDEX `standings_ibfk_2`(`game_day`),
--     PRIMARY KEY (`player`, `table_year`, `game_day`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- -- CreateIndex
-- CREATE UNIQUE INDEX `CountrySupporter_playerId_countryISOcode_key` ON `CountrySupporter`(`playerId`, `countryISOcode`);
-- -- RedefineIndex
-- CREATE INDEX `Arse_playerId_idx` ON `Arse`(`playerId`);
-- DROP INDEX `arse_playerId_idx` ON `Arse`;
-- -- RedefineIndex
-- CREATE UNIQUE INDEX `Arse_playerId_raterId_key` ON `Arse`(`playerId`, `raterId`);
-- DROP INDEX `arse_playerId_raterId_key` ON `Arse`;
-- -- RedefineIndex
-- CREATE INDEX `Arse_raterId_idx` ON `Arse`(`raterId`);
-- DROP INDEX `arse_raterId_idx` ON `Arse`;
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
DROP TABLE IF EXISTS Diffs;

RENAME TABLE diffs TO Diffs;

DROP TABLE IF EXISTS GameChat;

RENAME TABLE game_chat TO GameChat;

DROP TABLE IF EXISTS GameDay;

RENAME TABLE game_day TO GameDay;

DROP TABLE IF EXISTS Invitation;

RENAME TABLE invitation TO Invitation;

DROP TABLE IF EXISTS Outcome;

RENAME TABLE outcome TO Outcome;

DROP TABLE IF EXISTS Picker;

RENAME TABLE picker TO Picker;

DROP TABLE IF EXISTS PickerTeams;

RENAME TABLE picker_teams TO PickerTeams;

DROP TABLE IF EXISTS Standings;

RENAME TABLE standings TO Standings;