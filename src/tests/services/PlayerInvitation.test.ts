import prisma from 'prisma/prisma';
import { PlayerInvitationType } from 'prisma/zod/schemas/models/PlayerInvitation.schema';

import playerInvitationService from '@/services/PlayerInvitation';

describe('PlayerInvitationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createPlayerInvitation', () => {
        it('should create a player invitation record', async () => {
            const expiresAt = new Date('2030-01-01');
            const newInvitation: PlayerInvitationType = {
                id: 1,
                playerId: 7,
                email: 'player@example.com',
                tokenHash: 'a'.repeat(64),
                expiresAt,
                usedAt: null,
                createdAt: new Date(),
            };

            (prisma.playerInvitation.create as jest.Mock).mockResolvedValueOnce(newInvitation);

            const result = await playerInvitationService.create({
                playerId: 7,
                email: 'player@example.com',
                tokenHash: 'a'.repeat(64),
                expiresAt,
            });

            expect(result).toEqual(newInvitation);
            expect(prisma.playerInvitation.create).toHaveBeenCalledWith({
                data: {
                    playerId: 7,
                    email: 'player@example.com',
                    tokenHash: 'a'.repeat(64),
                    expiresAt,
                },
            });
        });
    });

    describe('getPlayerInvitationByTokenHash', () => {
        it('should retrieve a player invitation by token hash', async () => {
            const invitation: PlayerInvitationType = {
                id: 9,
                playerId: 3,
                email: 'invite@example.com',
                tokenHash: 'b'.repeat(64),
                expiresAt: new Date('2030-01-01'),
                usedAt: null,
                createdAt: new Date(),
            };

            (prisma.playerInvitation.findUnique as jest.Mock).mockResolvedValueOnce(invitation);

            const result = await playerInvitationService.getByTokenHash('b'.repeat(64));

            expect(result).toEqual(invitation);
            expect(prisma.playerInvitation.findUnique).toHaveBeenCalledWith({
                where: { tokenHash: 'b'.repeat(64) },
            });
        });
    });

    describe('markPlayerInvitationUsed', () => {
        it('should mark a player invitation as used', async () => {
            const usedAt = new Date('2030-01-02');
            const invitation: PlayerInvitationType = {
                id: 9,
                playerId: 3,
                email: 'invite@example.com',
                tokenHash: 'b'.repeat(64),
                expiresAt: new Date('2030-01-01'),
                usedAt,
                createdAt: new Date(),
            };

            (prisma.playerInvitation.update as jest.Mock).mockResolvedValueOnce(invitation);

            const result = await playerInvitationService.markUsed(9, usedAt);

            expect(result).toEqual(invitation);
            expect(prisma.playerInvitation.update).toHaveBeenCalledWith({
                where: { id: 9 },
                data: { usedAt },
            });
        });
    });
});
