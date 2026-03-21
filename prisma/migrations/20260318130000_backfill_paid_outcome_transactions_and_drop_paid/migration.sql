-- Remove previous backfilled payment rows so this migration can be rerun safely.
DELETE FROM `Transaction`
WHERE
    `type` = 'PlayerPayment'
    AND `note` LIKE 'Backfilled paid%';

-- Backfill one payment transaction per outcome with paid=true.
-- Amount is the game-day cost (pence) as a negative signed payment.
INSERT INTO `Transaction` (
    `createdAt`,
    `type`,
    `amountPence`,
    `note`,
    `playerId`,
    `gameDayId`
)
SELECT
    NOW(3),
    'PlayerPayment',
    -`GameDay`.`cost`,
    'Backfilled paid outcome',
    `Outcome`.`playerId`,
    `Outcome`.`gameDayId`
FROM `Outcome`
INNER JOIN `GameDay` ON `GameDay`.`id` = `Outcome`.`gameDayId`
LEFT JOIN `Transaction` AS `ExistingPayment` ON
    `ExistingPayment`.`type` = 'PlayerPayment'
    AND `ExistingPayment`.`playerId` = `Outcome`.`playerId`
    AND `ExistingPayment`.`gameDayId` = `Outcome`.`gameDayId`
WHERE
    `Outcome`.`paid` = TRUE
    AND `ExistingPayment`.`id` IS NULL;

-- Drop the paid column from Outcome now that all paid outcomes are recorded.
ALTER TABLE `Outcome` DROP COLUMN `paid`;
