-- Clear previously backfilled calculated money rows so this script can be rerun safely.
DELETE FROM `Transaction`
WHERE
    `type` = 'PlayerGameCharge'
    AND `outcomeId` IS NOT NULL;

DELETE FROM `Transaction`
WHERE
    `type` = 'PlayerPayment'
    AND `note` = 'Backfilled paid outcome';

-- Player 12 pays for hall hire up front and should not carry game charges/payments.
DELETE FROM `Transaction`
WHERE
    `playerId` = 12
    AND `type` IN ('PlayerGameCharge', 'PlayerPayment');

-- Backfill one charge transaction per outcome with an assigned team.
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
LEFT JOIN `Transaction` AS `ExistingCharge` ON
    `ExistingCharge`.`outcomeId` = `Outcome`.`id`
WHERE
    `Outcome`.`gameDayId` > 149
    AND `Outcome`.`team` IS NOT NULL
    AND `Outcome`.`playerId` <> 12
    AND `ExistingCharge`.`id` IS NULL;

-- Backfill one payment transaction per paid, billable outcome.
-- Amount is the game-day cost (pence) as a negative signed payment.
INSERT INTO `Transaction` (
    `createdAt`,
    `effectiveAt`,
    `type`,
    `amountPence`,
    `note`,
    `playerId`,
    `gameDayId`
)
SELECT
    NOW(3),
    `GameDay`.`date`,
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
    `Outcome`.`gameDayId` > 149
    AND `Outcome`.`paid` = TRUE
    AND `Outcome`.`team` IS NOT NULL
    AND `Outcome`.`playerId` <> 12
    AND `Outcome`.`points` IS NOT NULL
    AND `ExistingPayment`.`id` IS NULL;
