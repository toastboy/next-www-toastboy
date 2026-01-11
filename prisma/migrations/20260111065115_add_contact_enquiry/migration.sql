-- CreateTable
CREATE TABLE `ContactEnquiry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `message` MEDIUMTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `verifiedAt` DATETIME(3) NULL,
    `deliveredAt` DATETIME(3) NULL,
    `verificationId` INTEGER NOT NULL,

    UNIQUE INDEX `ContactEnquiry_verificationId_key`(`verificationId`),
    INDEX `ContactEnquiry_email_idx`(`email`),
    INDEX `ContactEnquiry_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
