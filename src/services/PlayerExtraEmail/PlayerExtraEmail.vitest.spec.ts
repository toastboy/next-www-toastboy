import { Prisma } from 'prisma/generated/client';
import prisma from 'prisma/prisma';
import { PlayerExtraEmailType } from 'prisma/zod/schemas/models/PlayerExtraEmail.schema';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import playerExtraEmailService from '@/services/PlayerExtraEmail';

describe('PlayerExtraEmailService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('getByEmail', () => {
        it('should return player id for exact email match', async () => {
            (prisma.playerExtraEmail.findFirst as Mock).mockResolvedValueOnce({
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
            (prisma.playerExtraEmail.findFirst as Mock).mockResolvedValueOnce({
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
            (prisma.playerExtraEmail.findFirst as Mock).mockResolvedValueOnce(null);

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

            (prisma.playerExtraEmail.create as Mock).mockResolvedValueOnce(newEmail);

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

            (prisma.playerExtraEmail.upsert as Mock).mockResolvedValueOnce(emailRecord);

            const result = await playerExtraEmailService.upsert(7, 'player@example.com', true);

            expect(result).toEqual(emailRecord);
            expect(prisma.playerExtraEmail.upsert).toHaveBeenCalledTimes(1);
            const [call] = (prisma.playerExtraEmail.upsert as Mock).mock.calls;
            const upsertArgs = call[0] as Prisma.PlayerExtraEmailUpsertArgs;
            expect(upsertArgs).toMatchObject({
                where: { email: 'player@example.com' },
                create: {
                    playerId: 7,
                    email: 'player@example.com',
                },
                update: {
                    playerId: 7,
                },
            });
            expect((upsertArgs.create as { verifiedAt?: Date }).verifiedAt).toBeInstanceOf(Date);
            expect((upsertArgs.update as { verifiedAt?: Date }).verifiedAt).toBeInstanceOf(Date);
        });
    });

    describe('getAllEmails', () => {
        it('should return player ids with raw email strings', async () => {
            (prisma.playerExtraEmail.findMany as Mock).mockResolvedValueOnce([
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

    describe('delete', () => {
        it('should delete a player extra email by unique email', async () => {
            (prisma.playerExtraEmail.delete as Mock).mockResolvedValueOnce({
                id: 1,
                playerId: 7,
                email: 'player@example.com',
                verifiedAt: null,
                createdAt: new Date(),
            });

            await playerExtraEmailService.delete('player@example.com');

            expect(prisma.playerExtraEmail.delete).toHaveBeenCalledWith({
                where: {
                    email: 'player@example.com',
                },
            });
        });

        it('should silently return when email does not exist', async () => {
            const notFoundError = Object.assign(
                new Error('Record to delete does not exist.'),
                { code: 'P2025' },
            );
            Object.setPrototypeOf(
                notFoundError,
                Prisma.PrismaClientKnownRequestError.prototype,
            );
            (prisma.playerExtraEmail.delete as Mock).mockRejectedValueOnce(notFoundError);

            await playerExtraEmailService.delete('missing@example.com');

            expect(prisma.playerExtraEmail.delete).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteAll', () => {
        it('should delete all player extra emails', async () => {
            (prisma.playerExtraEmail.deleteMany as Mock).mockResolvedValueOnce({ count: 2 });

            await playerExtraEmailService.deleteAll();

            expect(prisma.playerExtraEmail.deleteMany).toHaveBeenCalledWith({
                where: undefined,
            });
        });
    });
});
