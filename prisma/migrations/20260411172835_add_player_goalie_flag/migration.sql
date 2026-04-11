-- AlterTable
ALTER TABLE `Player` ADD COLUMN `goalie` BOOLEAN NULL;

-- Backfill the `goalie` flag for players identified as dedicated goalies.
-- This hard-coded ID list is a snapshot taken when this migration was created,
-- based on a one-off historical analysis of existing player records rather than
-- application logic that runs at migration time.
-- "Goalie rate" here means the proportion of each player's historical records
-- that were classified as goalie appearances; players at or above the 94%
-- threshold were included in this backfill list.
UPDATE `Player` SET `goalie` = TRUE WHERE `id` IN (5, 6, 10, 17, 38, 44, 94, 180, 196, 229);
