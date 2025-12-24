DROP TABLE IF EXISTS `PlayerEmail`;

-- CreateTable
CREATE TABLE `PlayerEmail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `playerId` INTEGER NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `verifiedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `PlayerEmail_email_key`(`email`),
    INDEX `PlayerEmail_playerId_idx`(`playerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `PlayerInvitation`;

-- CreateTable
CREATE TABLE `PlayerInvitation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `playerId` INTEGER NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `tokenHash` CHAR(64) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `usedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `PlayerInvitation_tokenHash_key`(`tokenHash`),
    INDEX `PlayerInvitation_playerId_idx`(`playerId`),
    INDEX `PlayerInvitation_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `GameInvitation`;

-- Rename legacy game invitation table to match new model name
RENAME TABLE `Invitation` TO `GameInvitation`;