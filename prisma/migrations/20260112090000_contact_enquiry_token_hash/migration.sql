-- Add tokenHash to ContactEnquiry and align with EmailVerification tokenHash.
ALTER TABLE `ContactEnquiry` ADD COLUMN `tokenHash` CHAR(64) NULL;

UPDATE `ContactEnquiry` ce
JOIN `EmailVerification` ev ON ev.id = ce.`verificationId`
SET ce.`tokenHash` = ev.`tokenHash`
WHERE ce.`tokenHash` IS NULL;

ALTER TABLE `ContactEnquiry` MODIFY `tokenHash` CHAR(64) NOT NULL;
CREATE UNIQUE INDEX `ContactEnquiry_tokenHash_key` ON `ContactEnquiry`(`tokenHash`);

ALTER TABLE `ContactEnquiry`
    ADD CONSTRAINT `ContactEnquiry_tokenHash_fkey`
    FOREIGN KEY (`tokenHash`) REFERENCES `EmailVerification`(`tokenHash`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `ContactEnquiry` DROP INDEX `ContactEnquiry_verificationId_key`;
ALTER TABLE `ContactEnquiry` DROP COLUMN `verificationId`;
