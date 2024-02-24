/*
  Warnings:

  - You are about to drop the column `player` on the `arse` table. All the data in the column will be lost.
  - You are about to drop the column `rater` on the `arse` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[playerId,raterId]` on the table `arse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `playerId` to the `arse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `raterId` to the `arse` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
-- Added this line:
ALTER TABLE `arse` DROP FOREIGN KEY IF EXISTS `arse_ibfk_1`;
DROP INDEX `player` ON `arse`;

-- AlterTable
-- https://chat.openai.com/share/ffdb19fb-2690-4786-82dd-cffb4dd8be56
-- Auto-generated:
-- ALTER TABLE `arse` DROP COLUMN `player`,
--     DROP COLUMN `rater`,
--     ADD COLUMN `playerId` INTEGER NOT NULL,
--     ADD COLUMN `raterId` INTEGER NOT NULL;
-- Manual change instead:
ALTER TABLE `arse`
    RENAME COLUMN `player` TO `playerId`,
    RENAME COLUMN `rater` TO `raterId`;

-- CreateIndex
CREATE INDEX `arse_playerId_idx` ON `arse`(`playerId`);

-- CreateIndex
CREATE INDEX `arse_raterId_idx` ON `arse`(`raterId`);

-- CreateIndex
CREATE UNIQUE INDEX `arse_playerId_raterId_key` ON `arse`(`playerId`, `raterId`);
