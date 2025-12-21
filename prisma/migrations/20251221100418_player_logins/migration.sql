/*
  Warnings:

  - You are about to drop the column `login` on the `Player` table. All the data in the column will be lost unless copied.

*/
-- CreateTable
CREATE TABLE `PlayerLogin` (
    `playerId` INTEGER NOT NULL,
    `login` VARCHAR(16) NOT NULL,

    UNIQUE INDEX `PlayerLogin_login_key`(`login`),
    UNIQUE INDEX `PlayerLogin_playerId_login_key`(`playerId`, `login`),
    INDEX `PlayerLogin_playerId_idx`(`playerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Migrate existing logins
INSERT INTO `PlayerLogin` (`playerId`, `login`)
SELECT `id`, `login`
FROM `Player`
WHERE `login` IS NOT NULL;

-- AlterTable
ALTER TABLE `Player` DROP COLUMN `login`;
