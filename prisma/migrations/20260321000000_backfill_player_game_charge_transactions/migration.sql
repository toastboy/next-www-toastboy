-- Remove previous backfilled charge rows so this migration can be rerun safely.
DELETE FROM `Transaction`
WHERE
    `type` = 'PlayerGameCharge'
    AND `note` = 'Backfilled game charge';

-- Backfill one PlayerGameCharge transaction per outcome where the player
-- actually played (team IS NOT NULL), from game day 150 onwards.
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
    'PlayerGameCharge',
    `GameDay`.`cost`,
    'Backfilled game charge',
    `Outcome`.`playerId`,
    `Outcome`.`gameDayId`
FROM `Outcome`
INNER JOIN `GameDay` ON `GameDay`.`id` = `Outcome`.`gameDayId`
LEFT JOIN `Transaction` AS `ExistingCharge` ON
    `ExistingCharge`.`type` = 'PlayerGameCharge'
    AND `ExistingCharge`.`playerId` = `Outcome`.`playerId`
    AND `ExistingCharge`.`gameDayId` = `Outcome`.`gameDayId`
WHERE
    -- Only backfill from game day 150 onwards: earlier game days predate the charging system / have unreliable charge data.
    `Outcome`.`gameDayId` >= 150
    AND `Outcome`.`team` IS NOT NULL
    AND `ExistingCharge`.`id` IS NULL;
