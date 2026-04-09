-- Migration: Set introducedBy = NULL where it is currently 0 There is no player
-- with id 0, so these values are effectively invalid foreign keys. Normalising
-- them to NULL makes the family tree query correct. After this, we will update
-- the NULL values to point to the correct introducer: Rob for the OG players
-- and then Jon for everybody else.

UPDATE `Player` SET `introducedBy` = NULL WHERE `introducedBy` = 0;
UPDATE `Player` SET `introducedBy` = 27 WHERE `introducedBy` IS NULL AND `id` <= 29 AND `id` != 27;
UPDATE `Player` SET `introducedBy` = 12 WHERE `introducedBy` IS NULL AND `id` != 27;
