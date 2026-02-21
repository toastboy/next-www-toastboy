-- Remove redundant outcome link from transactions and enforce one charge row
-- per (type, player, game day) tuple.
ALTER TABLE `Transaction`
    DROP INDEX `Transaction_outcomeId_key`,
    ADD UNIQUE INDEX `Transaction_type_playerId_gameDayId_key`(`type`, `playerId`, `gameDayId`),
    DROP COLUMN `outcomeId`;
