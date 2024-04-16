-- AlterTable
ALTER TABLE
    `GameDay`
MODIFY
    `date` DATETIME NOT NULL;

UPDATE
    `GameDay`
SET
    date = CONVERT_TZ(
        ADDDATE(
            date,
            INTERVAL 18 HOUR
        ),
        'Europe/London',
        'UTC'
    );