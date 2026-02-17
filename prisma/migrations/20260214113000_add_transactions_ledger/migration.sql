-- CreateTable
DROP TABLE IF EXISTS `Transaction`;

CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `effectiveAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('PlayerGameCharge', 'PlayerPayment', 'HallHire', 'Adjustment', 'Refund') NOT NULL,
    `amountPence` INTEGER NOT NULL,
    `note` VARCHAR(255) NULL,
    `playerId` INTEGER NULL,
    `gameDayId` INTEGER NULL,
    `outcomeId` INTEGER NULL,

    UNIQUE INDEX `Transaction_outcomeId_key`(`outcomeId`),
    INDEX `Transaction_playerId_createdAt_idx`(`playerId`, `createdAt`),
    INDEX `Transaction_gameDayId_createdAt_idx`(`gameDayId`, `createdAt`),
    INDEX `Transaction_type_createdAt_idx`(`type`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
DROP TABLE IF EXISTS `TransactionAllocation`;

CREATE TABLE `TransactionAllocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fromTransactionId` INTEGER NOT NULL,
    `toTransactionId` INTEGER NOT NULL,
    `amountPence` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TransactionAllocation_fromTransactionId_toTransactionId_key`(`fromTransactionId`, `toTransactionId`),
    INDEX `TransactionAllocation_fromTransactionId_idx`(`fromTransactionId`),
    INDEX `TransactionAllocation_toTransactionId_idx`(`toTransactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Backfill one charge transaction per billable outcome.
INSERT INTO `Transaction` (
    `createdAt`,
    `effectiveAt`,
    `type`,
    `amountPence`,
    `note`,
    `playerId`,
    `gameDayId`,
    `outcomeId`
)
SELECT
    NOW(3),
    `GameDay`.`date`,
    'PlayerGameCharge',
    `GameDay`.`cost`,
    'Backfilled game charge',
    `Outcome`.`playerId`,
    `Outcome`.`gameDayId`,
    `Outcome`.`id`
FROM `Outcome`
INNER JOIN `GameDay` ON `GameDay`.`id` = `Outcome`.`gameDayId`
WHERE
    `Outcome`.`team` IS NOT NULL
    AND `Outcome`.`points` IS NOT NULL;
