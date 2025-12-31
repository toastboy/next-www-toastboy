DROP TABLE IF EXISTS `PlayerInvitation`;

DROP TABLE IF EXISTS `EmailVerification`;

-- CreateTable
CREATE TABLE `EmailVerification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `playerId` INTEGER NULL,
    `email` VARCHAR(255) NOT NULL,
    `tokenHash` CHAR(64) NOT NULL,
    `purpose` ENUM('player_invite', 'player_email', 'contact_form') NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `usedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `EmailVerification_tokenHash_key`(`tokenHash`),
    INDEX `EmailVerification_playerId_idx`(`playerId`),
    INDEX `EmailVerification_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `PlayerEmail_email_idx` ON `PlayerEmail`(`email`);