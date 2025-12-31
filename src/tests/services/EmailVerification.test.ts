import prisma from 'prisma/prisma';
import { EmailVerificationType } from 'prisma/zod/schemas/models/EmailVerification.schema';

import emailVerificationService from '@/services/EmailVerification';

describe('EmailVerificationService', () => {
    describe('create', () => {
        it('should create an email verification record', async () => {
            const newVerification: EmailVerificationType = {
                id: 1,
                playerId: 2,
                email: 'player@example.com',
                tokenHash: 'a'.repeat(64),
                purpose: 'player_invite',
                expiresAt: new Date(),
                usedAt: null,
                createdAt: new Date(),
            };

            (prisma.emailVerification.create as jest.Mock).mockResolvedValueOnce(newVerification);

            const result = await emailVerificationService.create(newVerification);

            expect(prisma.emailVerification.create).toHaveBeenCalledWith({
                data: newVerification,
            });
            expect(result).toEqual(newVerification);
        });
    });

    describe('getByTokenHash', () => {
        it('should retrieve an email verification by token hash', async () => {
            const verification: EmailVerificationType = {
                id: 1,
                playerId: 2,
                email: 'player@example.com',
                tokenHash: 'b'.repeat(64),
                purpose: 'player_email',
                expiresAt: new Date(),
                usedAt: null,
                createdAt: new Date(),
            };

            (prisma.emailVerification.findUnique as jest.Mock).mockResolvedValueOnce(verification);

            const result = await emailVerificationService.getByTokenHash('b'.repeat(64));

            expect(prisma.emailVerification.findUnique).toHaveBeenCalledWith({
                where: { tokenHash: 'b'.repeat(64) },
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
                tokenHash: 'c'.repeat(64),
                purpose: 'player_email',
                expiresAt: new Date(),
                usedAt: new Date(),
                createdAt: new Date(),
            };

            (prisma.emailVerification.update as jest.Mock).mockResolvedValueOnce(verification);

            const result = await emailVerificationService.markUsed(9);

            expect(prisma.emailVerification.update).toHaveBeenCalledWith({
                where: { id: 9 },
                data: { usedAt: expect.any(Date) },
            });
            expect(result).toEqual(verification);
        });
    });
});
