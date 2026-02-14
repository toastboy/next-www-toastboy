/*
  Warnings:

  - Added the required column `cost` to the `GameDay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GameDay` ADD COLUMN `cost` INTEGER UNSIGNED NOT NULL;

-- Backfill game costs in pence using the same tiers as MoneyService.getGameCost().
UPDATE `GameDay`
SET `cost` = CASE
    WHEN `id` < 179 THEN 250
    WHEN `id` < 336 THEN 300
    WHEN `id` < 701 THEN 350
    WHEN `id` < 910 THEN 400
    WHEN `id` < 1088 THEN 450
    ELSE 500
END;
