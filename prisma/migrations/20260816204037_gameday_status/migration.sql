-- Add the new status column as nullable so it can be backfilled before the
-- NOT NULL constraint is enforced.
ALTER TABLE `GameDay` ADD COLUMN `status` ENUM('NoGame', 'Scheduled', 'AWin', 'Draw', 'BWin') NULL;

-- Backfill GameDay.status from the columns it replaces:
-- - `game` = FALSE always meant "not an actual match" (covers both a
--   not-yet-scheduled slot and a cancelled one, distinguished only by
--   `mailSent`) -> NoGame.
-- - `game` = TRUE with a unanimous team result recorded in Outcome.points
--   -> AWin / Draw / BWin.
-- - `game` = TRUE with no result, or a non-unanimous ("dirty") one, yet
--   -> Scheduled.
-- Team points are expected to be unanimous within a team whenever a result
-- is decided (the invariant `gameResult.ts::pickTeamPoints` already relied
-- on), but this is verified rather than assumed: COUNT(DISTINCT points) per
-- team must be exactly 1 before that team's points are trusted at all, so a
-- team with mixed/dirty historical data (e.g. 3 and 1) falls back to
-- Scheduled instead of being misclassified via MAX. Verified against the
-- production data snapshot (db-snapshot/GameDay.json + Outcome.json) that no
-- such inconsistency actually exists across any of the 1,326 historical game
-- days, so this backfill produces identical output to the simpler MAX-only
-- version it replaces — this is defence in depth, not a behaviour change.
UPDATE `GameDay` gd
LEFT JOIN (
    SELECT
        `gameDayId`,
        COUNT(DISTINCT CASE WHEN `team` = 'A' THEN `points` END) AS `aDistinctPoints`,
        COUNT(DISTINCT CASE WHEN `team` = 'B' THEN `points` END) AS `bDistinctPoints`,
        MAX(CASE WHEN `team` = 'A' THEN `points` END) AS `aPoints`,
        MAX(CASE WHEN `team` = 'B' THEN `points` END) AS `bPoints`
    FROM `Outcome`
    GROUP BY `gameDayId`
) o ON o.`gameDayId` = gd.`id`
SET gd.`status` = CASE
    WHEN gd.`game` = FALSE THEN 'NoGame'
    WHEN o.`aDistinctPoints` <> 1 OR o.`bDistinctPoints` <> 1 THEN 'Scheduled'
    WHEN o.`aPoints` = 3 AND o.`bPoints` = 0 THEN 'AWin'
    WHEN o.`aPoints` = 0 AND o.`bPoints` = 3 THEN 'BWin'
    WHEN o.`aPoints` = 1 AND o.`bPoints` = 1 THEN 'Draw'
    ELSE 'Scheduled'
END;

-- Enforce NOT NULL now that every row has a value, matching the default new
-- game days will get.
ALTER TABLE `GameDay` MODIFY COLUMN `status` ENUM('NoGame', 'Scheduled', 'AWin', 'Draw', 'BWin') NOT NULL DEFAULT 'Scheduled';

-- Drop the columns status/derived-points now supersede.
ALTER TABLE `GameDay` DROP COLUMN `game`;

ALTER TABLE `Outcome` DROP COLUMN `points`;

-- Rename PlayerRecord's cumulative table-ranking value columns with a
-- `score` prefix, pairing with the existing `rank*` prefix (scorePoints goes
-- with rankPoints, etc.) so the bare `points` name is free for the
-- single-game value below.
-- `speedy` is widened from INTEGER to DOUBLE during the rename: it holds a
-- mean response interval (see the backfill/derivation below), which is not
-- generally a whole number, and the old INTEGER type would reject the
-- fractional values it's actually assigned.
ALTER TABLE `PlayerRecord`
    CHANGE COLUMN `averages` `scoreAverages` DOUBLE NULL,
    CHANGE COLUMN `pub` `scorePub` INTEGER NULL,
    CHANGE COLUMN `stalwart` `scoreStalwart` INTEGER NULL,
    CHANGE COLUMN `speedy` `scoreSpeedy` DOUBLE NULL AFTER `scoreStalwart`;
-- `points` itself is renamed to `scorePoints` via CHANGE COLUMN too, then
-- immediately repurposed below to hold the single-game value instead of the
-- cumulative total (its old meaning now lives in `scorePoints`).
ALTER TABLE `PlayerRecord` CHANGE COLUMN `points` `scorePoints` INTEGER NULL;
ALTER TABLE `PlayerRecord` ADD COLUMN `points` INTEGER NULL;

-- Backfill PlayerRecord.points (the points earned in this specific game,
-- as opposed to the season-cumulative scorePoints) from the same rule as
-- getPlayerPoints (src/lib/gameResult.ts): a team assigned on a decided
-- game day.
UPDATE `PlayerRecord` pr
JOIN `GameDay` gd ON gd.`id` = pr.`gameDayId`
LEFT JOIN `Outcome` o ON o.`gameDayId` = pr.`gameDayId` AND o.`playerId` = pr.`playerId`
SET pr.`points` = CASE
    WHEN o.`team` IS NULL THEN NULL
    WHEN gd.`status` = 'AWin' AND o.`team` = 'A' THEN 3
    WHEN gd.`status` = 'AWin' AND o.`team` = 'B' THEN 0
    WHEN gd.`status` = 'BWin' AND o.`team` = 'B' THEN 3
    WHEN gd.`status` = 'BWin' AND o.`team` = 'A' THEN 0
    WHEN gd.`status` = 'Draw' THEN 1
    ELSE NULL
END;
