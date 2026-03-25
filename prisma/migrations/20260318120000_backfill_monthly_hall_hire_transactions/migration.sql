-- Remove previous hall-hire rows created by this migration so resets/reruns are deterministic.
DELETE FROM `Transaction`
WHERE
    `type` = 'HallHire'
    AND `note` = 'Backfilled hall hire';

-- Backfill one hall-hire transaction per qualifying game day.
-- A game day is billable for hall hire when it was played (`game` = TRUE)
-- or when an invite mail was sent (`mailSent` IS NOT NULL), which covers
-- cancelled sessions that still incur venue cost. Only backfill from game day 150 onwards,
-- as earlier game days do not have reliable historical cost data.
INSERT INTO `Transaction` (
    `createdAt`,
    `type`,
    `amountPence`,
    `note`,
    `gameDayId`
)
SELECT
    NOW(3) AS `createdAt`,
    'HallHire' AS `type`,
    `GameDay`.`hallCost` AS `amountPence`,
    'Backfilled hall hire' AS `note`,
    `GameDay`.`id` AS `gameDayId`
FROM `GameDay`
LEFT JOIN `Transaction` AS `ExistingHallHire` ON
    `ExistingHallHire`.`type` = 'HallHire'
    AND `ExistingHallHire`.`gameDayId` = `GameDay`.`id`
WHERE
    `GameDay`.`id` >= 150
    AND DATE_FORMAT(`GameDay`.`date`, '%Y-%m') <= DATE_FORMAT(NOW(), '%Y-%m')
    AND `GameDay`.`hallCost` > 0
    AND (
        `GameDay`.`game` = TRUE
        OR `GameDay`.`mailSent` IS NOT NULL
    )
    AND `ExistingHallHire`.`id` IS NULL;
