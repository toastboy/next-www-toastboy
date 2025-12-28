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

    describe('getIdByEmail', () => {
        it('should return player id for exact email match', async () => {
            (prisma.playerEmail.findFirst as jest.Mock).mockResolvedValueOnce({
                playerId: 42,
                email: 'player@example.com',
                verifiedAt: new Date(),
            });

            const result = await playerEmailService.getIdByEmail('player@example.com');
            expect(result).toBe(42);
            expect(prisma.playerEmail.findFirst).toHaveBeenCalledWith({
                where: {
                    email: 'player@example.com',
                    verifiedAt: {
                        not: null,
                    },
                },
            });
        });

        it('should return null when no player found with email', async () => {
            (prisma.playerEmail.findFirst as jest.Mock).mockResolvedValueOnce(null);

            const result = await playerEmailService.getIdByEmail('unknown@example.com');
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

            const result = await playerEmailService.createPlayerEmail({
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
            const verifiedAt = new Date('2030-01-02');
            const emailRecord: PlayerEmailType = {
                id: 1,
                playerId: 7,
                email: 'player@example.com',
                verifiedAt,
                createdAt: new Date(),
            };

            (prisma.playerEmail.upsert as jest.Mock).mockResolvedValueOnce(emailRecord);

            const result = await playerEmailService.upsertVerifiedPlayerEmail(7, 'player@example.com', verifiedAt);

            expect(result).toEqual(emailRecord);
            expect(prisma.playerEmail.upsert).toHaveBeenCalledWith({
                where: { email: 'player@example.com' },
                create: {
                    playerId: 7,
                    email: 'player@example.com',
                    verifiedAt,
                },
                update: {
                    playerId: 7,
                    verifiedAt,
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

            const result = await playerEmailService.getAllEmails();

            expect(result).toEqual([
                { playerId: 1, email: 'first@example.com' },
                { playerId: 2, email: 'second@example.com' },
            ]);
        });
    });
});
