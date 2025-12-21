/*
  Warnings:

  - A unique constraint covering the columns `[gameDayId,playerId]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Invitation_gameDayId_playerId_key` ON `Invitation`(`gameDayId`, `playerId`);
