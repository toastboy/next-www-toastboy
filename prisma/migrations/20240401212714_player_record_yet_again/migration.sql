/*
 Warnings:
 
 - You are about to drop the `standings` table. If the table is not empty, all the data it contains will be lost.
 
 */
-- DropTable
DROP TABLE IF EXISTS `standings`;

-- Add Outcome.responseInterval as a nullable integer
ALTER TABLE
    `Outcome`
ADD
    COLUMN `responseInterval` INT NULL;

-- Convert Outcome.responseTime to Outcome.responseInterval
UPDATE
    Outcome
    JOIN GameDay ON Outcome.gameDayId = GameDay.id
SET
    Outcome.responseInterval = CASE
        WHEN TIMESTAMPDIFF(SECOND, GameDay.mailSent, Outcome.responseTime) > 0 THEN TIMESTAMPDIFF(SECOND, GameDay.mailSent, Outcome.responseTime)
        ELSE NULL
    END;