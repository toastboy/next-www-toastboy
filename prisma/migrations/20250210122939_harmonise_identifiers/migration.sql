/*
  Warnings:

  - You are about to drop the column `ball_skill` on the `Arse` table. All the data in the column will be lost.
  - You are about to drop the column `in_goal` on the `Arse` table. All the data in the column will be lost.
  - You are about to drop the column `club_name` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the column `soccerway_id` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the column `countryISOcode` on the `CountrySupporter` table. All the data in the column will be lost.
  - You are about to drop the column `diff_age` on the `Diffs` table. All the data in the column will be lost.
  - You are about to drop the column `diff_average` on the `Diffs` table. All the data in the column will be lost.
  - You are about to drop the column `diff_goalies` on the `Diffs` table. All the data in the column will be lost.
  - You are about to drop the column `diff_played` on the `Diffs` table. All the data in the column will be lost.
  - You are about to drop the column `diff_unknown_age` on the `Diffs` table. All the data in the column will be lost.
  - You are about to drop the column `game_day` on the `GameChat` table. All the data in the column will be lost.
  - You are about to drop the column `picker_games_history` on the `GameDay` table. All the data in the column will be lost.
  - You are about to drop the column `game_day` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `player` on the `Invitation` table. All the data in the column will be lost.
  - The primary key for the `Picker` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `player` on the `Picker` table. All the data in the column will be lost.
  - You are about to drop the column `player_name` on the `Picker` table. All the data in the column will be lost.
  - You are about to drop the column `player` on the `PickerTeams` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `introduced_by` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `is_admin` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `D` on the `PlayerRecord` table. All the data in the column will be lost.
  - You are about to drop the column `L` on the `PlayerRecord` table. All the data in the column will be lost.
  - You are about to drop the column `P` on the `PlayerRecord` table. All the data in the column will be lost.
  - You are about to drop the column `W` on the `PlayerRecord` table. All the data in the column will be lost.
  - You are about to drop the column `rank_averages` on the `PlayerRecord` table. All the data in the column will be lost.
  - You are about to drop the column `rank_averages_unqualified` on the `PlayerRecord` table. All the data in the column will be lost.
  - You are about to drop the column `rank_points` on the `PlayerRecord` table. All the data in the column will be lost.
  - You are about to drop the column `rank_pub` on the `PlayerRecord` table. All the data in the column will be lost.
  - You are about to drop the column `rank_speedy` on the `PlayerRecord` table. All the data in the column will be lost.
  - You are about to drop the column `rank_speedy_unqualified` on the `PlayerRecord` table. All the data in the column will be lost.
  - You are about to drop the column `rank_stalwart` on the `PlayerRecord` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[playerId,countryISOCode]` on the table `CountrySupporter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[playerId]` on the table `PickerTeams` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `Arse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clubName` to the `Club` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryISOCode` to the `CountrySupporter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameDay` to the `GameChat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameDayId` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerId` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Outcome` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerId` to the `Picker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerId` to the `PickerTeams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `PlayerRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `isoCode` ON `Country`;

-- DropIndex
DROP INDEX `CountrySupporter_countryISOcode_idx` ON `CountrySupporter`;

-- DropIndex
DROP INDEX `CountrySupporter_playerId_countryISOcode_key` ON `CountrySupporter`;

-- DropIndex
ALTER TABLE `Invitation` DROP FOREIGN KEY IF EXISTS `invitation_ibfk_1`;
DROP INDEX `invitation_ibfk_1` ON `Invitation`;

-- DropIndex
ALTER TABLE `Invitation` DROP FOREIGN KEY IF EXISTS `invitation_ibfk_2`;
DROP INDEX `invitation_ibfk_2` ON `Invitation`;

-- DropIndex
ALTER TABLE `PickerTeams` DROP FOREIGN KEY IF EXISTS `PickerTeams_ibfk_1`;
DROP INDEX `player` ON `PickerTeams`;

-- AlterTable
ALTER TABLE `Arse` CHANGE COLUMN `ball_skill` `ballSkill` INTEGER NULL,
    CHANGE COLUMN `in_goal` `inGoal` INTEGER NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Club` CHANGE COLUMN `club_name` `clubName` VARCHAR(255) NOT NULL,
    CHANGE COLUMN `soccerway_id` `soccerwayId` INTEGER NULL,
    ADD PRIMARY KEY (`id`);

-- DropIndex
DROP INDEX `id` ON `Club`;

-- AlterTable
ALTER TABLE `ClubSupporter` ALTER COLUMN `playerId` DROP DEFAULT,
    ALTER COLUMN `clubId` DROP DEFAULT;

-- AlterTable
ALTER TABLE `CountrySupporter` CHANGE COLUMN `countryISOcode` `countryISOCode` VARCHAR(6) NOT NULL;

-- AlterTable
ALTER TABLE `Diffs` DROP COLUMN `diff_age`,
    DROP COLUMN `diff_average`,
    DROP COLUMN `diff_goalies`,
    DROP COLUMN `diff_played`,
    DROP COLUMN `diff_unknown_age`,
    ADD COLUMN `diffAge` DOUBLE NULL,
    ADD COLUMN `diffAverage` DOUBLE NULL,
    ADD COLUMN `diffGoalies` TINYINT NULL,
    ADD COLUMN `diffPlayed` INTEGER NULL,
    ADD COLUMN `diffUnknownAge` INTEGER NULL;

-- AlterTable
ALTER TABLE `GameChat` CHANGE COLUMN `game_day` `gameDay` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `GameDay` CHANGE COLUMN `picker_games_history` `pickerGamesHistory` INTEGER NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT;

-- AlterTable
ALTER TABLE `Invitation` CHANGE COLUMN `game_day` `gameDayId` INTEGER NOT NULL,
    CHANGE COLUMN `player` `playerId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Outcome` ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
-- ALTER TABLE `Picker` DROP PRIMARY KEY,
--     DROP COLUMN `player`,
--     DROP COLUMN `player_name`,
--     ADD COLUMN `playerId` INTEGER NOT NULL,
--     ADD COLUMN `playerName` VARCHAR(255) NULL,
--     ADD PRIMARY KEY (`playerId`);
DROP TABLE IF EXISTS `Picker`;
CREATE TABLE `Picker` (
    `playerId` INTEGER NOT NULL PRIMARY KEY,
    `playerName` VARCHAR(255) NULL
);

-- AlterTable
-- ALTER TABLE `PickerTeams` DROP COLUMN `player`,
--     ADD COLUMN `playerId` INTEGER NOT NULL;
DROP TABLE IF EXISTS `PickerTeams`;
CREATE TABLE `PickerTeams` (
    `playerId` INTEGER NOT NULL PRIMARY KEY
);

-- AlterTable
ALTER TABLE `Player` CHANGE COLUMN `first_name` `firstName` VARCHAR(191) NULL,
    CHANGE COLUMN `introduced_by` `introducedBy` INTEGER NULL,
    CHANGE COLUMN `is_admin` `isAdmin` BOOLEAN NULL,
    CHANGE COLUMN `last_name` `lastName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `PlayerRecord` CHANGE COLUMN `D` `drawn` INTEGER NULL,
    CHANGE COLUMN `L` `lost` INTEGER NULL,
    CHANGE COLUMN `P` `played` INTEGER NULL,
    CHANGE COLUMN `W` `won` INTEGER NULL,
    CHANGE COLUMN `rank_averages` `rankAverages` INTEGER NULL,
    CHANGE COLUMN `rank_averages_unqualified` `rankAveragesUnqualified` INTEGER NULL,
    CHANGE COLUMN `rank_points` `rankPoints` INTEGER NULL,
    CHANGE COLUMN `rank_pub` `rankPub` INTEGER NULL,
    CHANGE COLUMN `rank_speedy` `rankSpeedy` INTEGER NULL,
    CHANGE COLUMN `rank_speedy_unqualified` `rankSpeedyUnqualified` INTEGER NULL,
    CHANGE COLUMN `rank_stalwart` `rankStalwart` INTEGER NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE INDEX `CountrySupporter_countryISOCode_idx` ON `CountrySupporter`(`countryISOCode`);

-- CreateIndex
CREATE UNIQUE INDEX `CountrySupporter_playerId_countryISOCode_key` ON `CountrySupporter`(`playerId`, `countryISOCode`);

-- CreateIndex
CREATE INDEX `Invitation_playerId_idx` ON `Invitation`(`playerId`);

-- CreateIndex
CREATE INDEX `Invitation_gameDayId_idx` ON `Invitation`(`gameDayId`);

-- CreateIndex
CREATE UNIQUE INDEX `PickerTeams_playerId_key` ON `PickerTeams`(`playerId`);

-- RedefineIndex
CREATE UNIQUE INDEX `Country_name_key` ON `Country`(`name`);
DROP INDEX `name` ON `Country`;

-- RedefineIndex
CREATE INDEX `GameChat_player_idx` ON `GameChat`(`player`);
DROP INDEX `player` ON `GameChat`;

-- RedefineIndex
CREATE UNIQUE INDEX `Player_login_key` ON `Player`(`login`);
DROP INDEX `login` ON `Player`;
