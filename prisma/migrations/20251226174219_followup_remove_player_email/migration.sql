-- RedefineIndex
CREATE INDEX `GameInvitation_gameDayId_idx` ON `GameInvitation`(`gameDayId`);
DROP INDEX `Invitation_gameDayId_idx` ON `GameInvitation`;

-- RedefineIndex
CREATE UNIQUE INDEX `GameInvitation_gameDayId_playerId_key` ON `GameInvitation`(`gameDayId`, `playerId`);
DROP INDEX `Invitation_gameDayId_playerId_key` ON `GameInvitation`;

-- RedefineIndex
CREATE INDEX `GameInvitation_playerId_idx` ON `GameInvitation`(`playerId`);
DROP INDEX `Invitation_playerId_idx` ON `GameInvitation`;
