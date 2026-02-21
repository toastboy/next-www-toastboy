-- Drop redundant effectiveAt column from ledger transactions.
ALTER TABLE `Transaction`
    DROP COLUMN `effectiveAt`;
