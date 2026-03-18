-- AlterTable
ALTER TABLE `GameDay` ADD COLUMN `hallCost` INTEGER UNSIGNED NOT NULL DEFAULT 0;

-- Backfill hall costs in pence based on the booking year (1 Aug – 31 Jul).
-- Each year value in the table below is the start of the booking period, so
-- e.g. year 2010 covers games from 2010-08-01 up to (but not including) 2011-08-01.
UPDATE `GameDay`
SET `hallCost` = CASE
    WHEN `date` < '2003-08-01' THEN 2525
    WHEN `date` < '2004-08-01' THEN 2600
    WHEN `date` < '2005-08-01' THEN 2700
    WHEN `date` < '2006-08-01' THEN 2780
    WHEN `date` < '2007-08-01' THEN 2920
    WHEN `date` < '2008-08-01' THEN 3070
    WHEN `date` < '2009-08-01' THEN 3225
    WHEN `date` < '2010-08-01' THEN 3325
    WHEN `date` < '2011-08-01' THEN 3390
    WHEN `date` < '2012-08-01' THEN 3390
    WHEN `date` < '2013-08-01' THEN 3455
    WHEN `date` < '2014-08-01' THEN 3455
    WHEN `date` < '2015-08-01' THEN 3525
    WHEN `date` < '2016-08-01' THEN 3595
    WHEN `date` < '2017-08-01' THEN 3665
    WHEN `date` < '2018-08-01' THEN 3740
    WHEN `date` < '2019-08-01' THEN 3815
    WHEN `date` < '2020-08-01' THEN 3890
    WHEN `date` < '2021-08-01' THEN 3970
    WHEN `date` < '2022-08-01' THEN 3970
    WHEN `date` < '2023-08-01' THEN 4090
    WHEN `date` < '2024-08-01' THEN 4295
    WHEN `date` < '2025-08-01' THEN 4500
    WHEN `date` < '2026-08-01' THEN 4700
    ELSE 4700
END;

-- Remove the temporary default now that the backfill is done.
ALTER TABLE `GameDay` ALTER COLUMN `hallCost` DROP DEFAULT;
