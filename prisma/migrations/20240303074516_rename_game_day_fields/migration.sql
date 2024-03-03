/*
 Warnings:
 
 - The primary key for the `ClubSupporter` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to drop the column `id` on the `ClubSupporter` table. All the data in the column will be lost.
 - The primary key for the `CountrySupporter` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to drop the column `id` on the `CountrySupporter` table. All the data in the column will be lost.
 - The primary key for the `GameDay` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to drop the column `game_date` on the `GameDay` table. All the data in the column will be lost.
 - You are about to drop the column `game_number` on the `GameDay` table. All the data in the column will be lost.
 - You are about to drop the column `mail_sent` on the `GameDay` table. All the data in the column will be lost.
 - You are about to drop the column `mugshot` on the `Player` table. All the data in the column will be lost.
 - A unique constraint covering the columns `[playerId,countryISOcode]` on the table `CountrySupporter` will be added. If there are existing duplicate values, this will fail.
 - Added the required column `date` to the `GameDay` table without a default value. This is not possible if the table is not empty.
 - Added the required column `id` to the `GameDay` table without a default value. This is not possible if the table is not empty.
 - Made the column `game` on table `GameDay` required. This step will fail if there are existing NULL values in that column.
 
 */
-- AlterTable
ALTER TABLE
    `ClubSupporter` DROP PRIMARY KEY,
    DROP COLUMN `id`;

-- AlterTable
ALTER TABLE
    `CountrySupporter` DROP PRIMARY KEY,
    DROP COLUMN `id`;

-- AlterTable
-- ALTER TABLE `GameDay` DROP PRIMARY KEY,
--     DROP COLUMN `game_date`,
--     DROP COLUMN `game_number`,
--     DROP COLUMN `mail_sent`,
--     ADD COLUMN `date` DATE NOT NULL,
--     ADD COLUMN `id` INTEGER NOT NULL,
--     ADD COLUMN `mailSent` DATETIME(0) NULL,
--     MODIFY `game` BOOLEAN NOT NULL DEFAULT true,
--     ADD PRIMARY KEY (`id`);
ALTER TABLE
    `GameDay` RENAME COLUMN `game_number` TO `id`,
    RENAME COLUMN `game_date` TO `date`,
    RENAME COLUMN `mail_sent` TO `mailSent`;

-- AlterTable
ALTER TABLE
    `Player` DROP COLUMN `mugshot`;

-- CreateIndex
CREATE UNIQUE INDEX `CountrySupporter_playerId_countryISOcode_key` ON `CountrySupporter`(`playerId`, `countryISOcode`);

-- RedefineIndex
DROP INDEX `arse_playerId_idx` ON `Arse`;

CREATE INDEX `Arse_playerId_idx` ON `Arse`(`playerId`);

-- RedefineIndex
DROP INDEX `arse_playerId_raterId_key` ON `Arse`;

CREATE UNIQUE INDEX `Arse_playerId_raterId_key` ON `Arse`(`playerId`, `raterId`);

-- RedefineIndex
DROP INDEX `arse_raterId_idx` ON `Arse`;

CREATE INDEX `Arse_raterId_idx` ON `Arse`(`raterId`);

-- RedefineIndex
DROP INDEX `club_supporter_clubId_idx` ON `ClubSupporter`;

CREATE INDEX `ClubSupporter_clubId_idx` ON `ClubSupporter`(`clubId`);

-- RedefineIndex
DROP INDEX `club_supporter_playerId_clubId_key` ON `ClubSupporter`;

CREATE UNIQUE INDEX `ClubSupporter_playerId_clubId_key` ON `ClubSupporter`(`playerId`, `clubId`);

-- RedefineIndex
DROP INDEX `club_supporter_playerId_idx` ON `ClubSupporter`;

CREATE INDEX `ClubSupporter_playerId_idx` ON `ClubSupporter`(`playerId`);

-- RedefineIndex
DROP INDEX `iso_code` ON `CountrySupporter`;

CREATE INDEX `CountrySupporter_countryISOcode_idx` ON `CountrySupporter`(`countryISOcode`);

-- RedefineIndex
DROP INDEX `player` ON `CountrySupporter`;

CREATE INDEX `CountrySupporter_playerId_idx` ON `CountrySupporter`(`playerId`);