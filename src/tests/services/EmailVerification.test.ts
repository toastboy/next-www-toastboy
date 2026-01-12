import prisma from 'prisma/prisma';
import { EmailVerificationType } from 'prisma/zod/schemas/models/EmailVerification.schema';

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

            (prisma.emailVerification.create as jest.Mock).mockResolvedValueOnce(newVerification);

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
            expect(prisma.emailVerification.create).not.toHaveBeenCalled();
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

            (prisma.emailVerification.findUnique as jest.Mock).mockResolvedValueOnce(verification);

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

            (prisma.emailVerification.update as jest.Mock).mockResolvedValueOnce(verification);

            const result = await emailVerificationService.markUsed(token);

            expect(prisma.emailVerification.update).toHaveBeenCalledWith({
                where: { tokenHash },
                data: { usedAt: expect.any(Date) },
            });
            expect(result).toEqual(verification);
        });
    });
});
