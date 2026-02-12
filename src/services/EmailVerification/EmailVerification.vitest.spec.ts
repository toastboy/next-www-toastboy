import prisma from 'prisma/prisma';
import { EmailVerificationType } from 'prisma/zod/schemas/models/EmailVerification.schema';
import type { Mock } from 'vitest';

import { hashVerificationToken } from '@/lib/verificationToken';
import emailVerificationService from '@/services/EmailVerification';


describe('EmailVerificationService', () => {
    const token = 'deadbeef'.repeat(8);
    const tokenHash = hashVerificationToken(token);

    describe('create', () => {
        it('should create an email verification record', async () => {
            const rawInput = {
                playerId: 2,
                email: 'player@example.com',
                token,
                expiresAt: new Date(),
                usedAt: null,
            };
            const newVerification: EmailVerificationType = {
                id: 1,
                playerId: rawInput.playerId,
                email: rawInput.email,
                tokenHash,
                expiresAt: rawInput.expiresAt,
                usedAt: rawInput.usedAt,
                createdAt: new Date(),
            };

            (prisma.emailVerification.create as Mock).mockResolvedValueOnce(newVerification);

            const result = await emailVerificationService.create(rawInput);

            expect(prisma.emailVerification.create).toHaveBeenCalledWith({
                data: {
                    playerId: rawInput.playerId,
                    email: rawInput.email,
                    tokenHash,
                    expiresAt: rawInput.expiresAt,
                    usedAt: rawInput.usedAt,
                },
            });
            expect(result).toEqual(newVerification);
        });

        it('should reject when tokenHash is provided', async () => {
            const invalidInput = {
                playerId: 2,
                email: 'player@example.com',
                token,
                tokenHash,
                expiresAt: new Date(),
                usedAt: null,
            };

            await expect(emailVerificationService.create(invalidInput)).rejects.toThrow();
        });
    });

    describe('getByToken', () => {
        it('should retrieve an email verification by token', async () => {
            const verification: EmailVerificationType = {
                id: 1,
                playerId: 2,
                email: 'player@example.com',
                tokenHash,
                expiresAt: new Date(),
                usedAt: null,
                createdAt: new Date(),
            };

            (prisma.emailVerification.findUnique as Mock).mockResolvedValueOnce(verification);

            const result = await emailVerificationService.getByToken(token);

            expect(prisma.emailVerification.findUnique).toHaveBeenCalledWith({
                where: { tokenHash },
            });
            expect(result).toEqual(verification);
        });
    });

    describe('markUsed', () => {
        it('should mark an email verification as used', async () => {
            const verification: EmailVerificationType = {
                id: 9,
                playerId: 2,
                email: 'player@example.com',
                tokenHash,
                expiresAt: new Date(),
                usedAt: new Date(),
                createdAt: new Date(),
            };

            (prisma.emailVerification.update as Mock).mockResolvedValueOnce(verification);

            const result = await emailVerificationService.markUsed(token);

            expect(prisma.emailVerification.update).toHaveBeenCalledTimes(1);
            const [call] = (prisma.emailVerification.update as Mock).mock.calls;
            const callArg = call[0] as { where: { tokenHash: string }; data: { usedAt: Date } };
            expect(callArg).toMatchObject({
                where: { tokenHash },
                data: {},
            });
            expect(callArg.data.usedAt).toBeInstanceOf(Date);
            expect(result).toEqual(verification);
        });
    });

    describe('deleteAll', () => {
        it('should delete all email verifications when no playerId is provided', async () => {
            (prisma.emailVerification.deleteMany as Mock).mockResolvedValueOnce({ count: 3 });

            const result = await emailVerificationService.deleteAll();

            expect(result).toEqual({ count: 3 });
            expect(prisma.emailVerification.deleteMany).toHaveBeenCalledWith({
                where: undefined,
            });
        });

        it('should delete email verifications for a specific player', async () => {
            (prisma.emailVerification.deleteMany as Mock).mockResolvedValueOnce({ count: 1 });

            const result = await emailVerificationService.deleteAll(7);

            expect(result).toEqual({ count: 1 });
            expect(prisma.emailVerification.deleteMany).toHaveBeenCalledWith({
                where: {
                    playerId: 7,
                },
            });
        });
    });
});
