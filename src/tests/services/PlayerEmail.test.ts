import prisma from 'prisma/prisma';
import { PlayerEmailType } from 'prisma/zod/schemas/models/PlayerEmail.schema';

import playerEmailService from '@/services/PlayerEmail';

describe('PlayerEmailService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getByEmail', () => {
        it('should return player id for exact email match', async () => {
            (prisma.playerEmail.findFirst as jest.Mock).mockResolvedValueOnce({
                playerId: 42,
                email: 'player@example.com',
                verifiedAt: new Date(),
            });

            const result = await playerEmailService.getByEmail('player@example.com', true);
            expect(result?.playerId).toBe(42);
            expect(prisma.playerEmail.findFirst).toHaveBeenCalledWith({
                where: {
                    email: 'player@example.com',
                    verifiedAt: {
                        not: null,
                    },
                },
            });
        });

        it('should return player id for exact email match with no verification', async () => {
            (prisma.playerEmail.findFirst as jest.Mock).mockResolvedValueOnce({
                playerId: 42,
                email: 'player@example.com',
                verifiedAt: null,
            });

            const result = await playerEmailService.getByEmail('player@example.com', false);
            expect(result?.playerId).toBe(42);
            expect(prisma.playerEmail.findFirst).toHaveBeenCalledWith({
                where: {
                    email: 'player@example.com',
                },
            });
        });

        it('should return null when no player found with email', async () => {
            (prisma.playerEmail.findFirst as jest.Mock).mockResolvedValueOnce(null);

            const result = await playerEmailService.getByEmail('unknown@example.com', true);
            expect(result).toBeNull();
        });
    });

    describe('createPlayerEmail', () => {
        it('should create a player email record', async () => {
            const newEmail: PlayerEmailType = {
                id: 1,
                playerId: 7,
                email: 'player@example.com',
                verifiedAt: null,
                createdAt: new Date(),
            };

            (prisma.playerEmail.create as jest.Mock).mockResolvedValueOnce(newEmail);

            const result = await playerEmailService.create({
                playerId: 7,
                email: 'player@example.com',
            });

            expect(result).toEqual(newEmail);
            expect(prisma.playerEmail.create).toHaveBeenCalledWith({
                data: {
                    playerId: 7,
                    email: 'player@example.com',
                },
            });
        });
    });

    describe('upsertVerifiedPlayerEmail', () => {
        it('should upsert a verified player email record', async () => {
            const emailRecord: PlayerEmailType = {
                id: 1,
                playerId: 7,
                email: 'player@example.com',
                createdAt: new Date(),
            };

            (prisma.playerEmail.upsert as jest.Mock).mockResolvedValueOnce(emailRecord);

            const result = await playerEmailService.upsert(7, 'player@example.com', true);

            expect(result).toEqual(emailRecord);
            expect(prisma.playerEmail.upsert).toHaveBeenCalledWith({
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
            (prisma.playerEmail.findMany as jest.Mock).mockResolvedValueOnce([
                { playerId: 1, email: 'first@example.com' },
                { playerId: 2, email: 'second@example.com' },
            ]);

            const result = await playerEmailService.getAll();

            expect(result).toEqual([
                { playerId: 1, email: 'first@example.com' },
                { playerId: 2, email: 'second@example.com' },
            ]);
        });
    });
});
