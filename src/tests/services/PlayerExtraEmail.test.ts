import prisma from 'prisma/prisma';
import { PlayerExtraEmailType } from 'prisma/zod/schemas/models/PlayerExtraEmail.schema';

import playerExtraEmailService from '@/services/PlayerExtraEmail';

describe('PlayerExtraEmailService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getByEmail', () => {
        it('should return player id for exact email match', async () => {
            (prisma.playerExtraEmail.findFirst as jest.Mock).mockResolvedValueOnce({
                playerId: 42,
                email: 'player@example.com',
                verifiedAt: new Date(),
            });

            const result = await playerExtraEmailService.getByEmail('player@example.com', true);
            expect(result?.playerId).toBe(42);
            expect(prisma.playerExtraEmail.findFirst).toHaveBeenCalledWith({
                where: {
                    email: 'player@example.com',
                    verifiedAt: {
                        not: null,
                    },
                },
            });
        });

        it('should return player id for exact email match with no verification', async () => {
            (prisma.playerExtraEmail.findFirst as jest.Mock).mockResolvedValueOnce({
                playerId: 42,
                email: 'player@example.com',
                verifiedAt: null,
            });

            const result = await playerExtraEmailService.getByEmail('player@example.com', false);
            expect(result?.playerId).toBe(42);
            expect(prisma.playerExtraEmail.findFirst).toHaveBeenCalledWith({
                where: {
                    email: 'player@example.com',
                },
            });
        });

        it('should return null when no player found with email', async () => {
            (prisma.playerExtraEmail.findFirst as jest.Mock).mockResolvedValueOnce(null);

            const result = await playerExtraEmailService.getByEmail('unknown@example.com', true);
            expect(result).toBeNull();
        });
    });

    describe('createPlayerExtraEmail', () => {
        it('should create a player email record', async () => {
            const newEmail: PlayerExtraEmailType = {
                id: 1,
                playerId: 7,
                email: 'player@example.com',
                verifiedAt: null,
                createdAt: new Date(),
            };

            (prisma.playerExtraEmail.create as jest.Mock).mockResolvedValueOnce(newEmail);

            const result = await playerExtraEmailService.create({
                playerId: 7,
                email: 'player@example.com',
            });

            expect(result).toEqual(newEmail);
            expect(prisma.playerExtraEmail.create).toHaveBeenCalledWith({
                data: {
                    playerId: 7,
                    email: 'player@example.com',
                },
            });
        });
    });

    describe('upsertVerifiedPlayerExtraEmail', () => {
        it('should upsert a verified player email record', async () => {
            const emailRecord: PlayerExtraEmailType = {
                id: 1,
                playerId: 7,
                email: 'player@example.com',
                createdAt: new Date(),
            };

            (prisma.playerExtraEmail.upsert as jest.Mock).mockResolvedValueOnce(emailRecord);

            const result = await playerExtraEmailService.upsert(7, 'player@example.com', true);

            expect(result).toEqual(emailRecord);
            expect(prisma.playerExtraEmail.upsert).toHaveBeenCalledWith({
                where: { email: 'player@example.com' },
                create: {
                    playerId: 7,
                    email: 'player@example.com',
                    verifiedAt: expect.any(Date),
                },
                update: {
                    playerId: 7,
                    verifiedAt: expect.any(Date),
                },
            });
        });
    });

    describe('getAllEmails', () => {
        it('should return player ids with raw email strings', async () => {
            (prisma.playerExtraEmail.findMany as jest.Mock).mockResolvedValueOnce([
                { playerId: 1, email: 'first@example.com' },
                { playerId: 2, email: 'second@example.com' },
            ]);

            const result = await playerExtraEmailService.getAll();

            expect(result).toEqual([
                { playerId: 1, email: 'first@example.com' },
                { playerId: 2, email: 'second@example.com' },
            ]);
        });
    });
});
