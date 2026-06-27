import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ConflictError, NotFoundError, ValidationError } from '@/lib/errors';

const { createVerificationTokenMock, getPublicBaseUrlMock } = vi.hoisted(() => ({
    createVerificationTokenMock: vi.fn(() => ({
        token: 'verify-token',
        expiresAt: new Date('2030-01-01T00:00:00.000Z'),
    })),
    getPublicBaseUrlMock: vi.fn(() => 'https://example.test'),
}));

vi.mock('@/lib/verificationToken', () => ({
    createVerificationToken: createVerificationTokenMock,
}));

vi.mock('@/lib/urls', () => ({
    getPublicBaseUrl: getPublicBaseUrlMock,
}));

import { sendEmailVerificationCore, verifyEmailCore } from '@/lib/core/verifyEmail';

describe('verifyEmailCore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('marks verification used and upserts player extra email', async () => {
        const deps = {
            emailVerificationService: {
                create: vi.fn(),
                getByToken: vi.fn().mockResolvedValue({
                    id: 15,
                    playerId: 7,
                    email: 'player@example.com',
                    expiresAt: new Date('2030-01-01T00:00:00.000Z'),
                    usedAt: null,
                }),
                markUsed: vi.fn().mockResolvedValue(undefined),
            },
            playerExtraEmailService: {
                getByEmail: vi.fn().mockResolvedValue(null),
                upsert: vi.fn().mockResolvedValue(undefined),
            },
            sendEmailCore: vi.fn(),
        };

        const result = await verifyEmailCore('verify-token', deps);

        expect(deps.playerExtraEmailService.upsert).toHaveBeenCalledWith(
            7,
            'player@example.com',
            true,
        );
        expect(deps.emailVerificationService.markUsed).toHaveBeenCalledWith('verify-token');
        expect(result).toEqual({
            email: 'player@example.com',
            playerId: '7',
            verificationId: '15',
        });
    });

    it('throws ValidationError when token is empty', async () => {
        const deps = {
            emailVerificationService: {
                create: vi.fn(),
                getByToken: vi.fn(),
                markUsed: vi.fn(),
            },
            playerExtraEmailService: { getByEmail: vi.fn(), upsert: vi.fn() },
            sendEmailCore: vi.fn(),
        };

        await expect(verifyEmailCore('', deps)).rejects.toBeInstanceOf(ValidationError);
        expect(deps.emailVerificationService.getByToken).not.toHaveBeenCalled();
    });

    it('throws NotFoundError when token is not found', async () => {
        const deps = {
            emailVerificationService: {
                create: vi.fn(),
                getByToken: vi.fn().mockResolvedValue(null),
                markUsed: vi.fn(),
            },
            playerExtraEmailService: { getByEmail: vi.fn(), upsert: vi.fn() },
            sendEmailCore: vi.fn(),
        };

        await expect(verifyEmailCore('unknown-token', deps)).rejects.toBeInstanceOf(NotFoundError);
    });

    it('throws ConflictError when verification has already been used', async () => {
        const deps = {
            emailVerificationService: {
                create: vi.fn(),
                getByToken: vi.fn().mockResolvedValue({
                    id: 1,
                    playerId: 7,
                    email: 'p@e.com',
                    usedAt: new Date('2020-01-01'),
                    expiresAt: new Date('2030-01-01'),
                }),
                markUsed: vi.fn(),
            },
            playerExtraEmailService: { getByEmail: vi.fn(), upsert: vi.fn() },
            sendEmailCore: vi.fn(),
        };

        await expect(verifyEmailCore('used-token', deps)).rejects.toBeInstanceOf(ConflictError);
    });

    it('throws ConflictError when verification has expired', async () => {
        const deps = {
            emailVerificationService: {
                create: vi.fn(),
                getByToken: vi.fn().mockResolvedValue({
                    id: 1,
                    playerId: 7,
                    email: 'p@e.com',
                    usedAt: null,
                    expiresAt: new Date('2000-01-01'),
                }),
                markUsed: vi.fn(),
            },
            playerExtraEmailService: { getByEmail: vi.fn(), upsert: vi.fn() },
            sendEmailCore: vi.fn(),
        };

        await expect(verifyEmailCore('expired-token', deps)).rejects.toBeInstanceOf(ConflictError);
    });

    it('throws ValidationError when verification has no playerId', async () => {
        const deps = {
            emailVerificationService: {
                create: vi.fn(),
                getByToken: vi.fn().mockResolvedValue({
                    id: 1,
                    playerId: null,
                    email: 'p@e.com',
                    usedAt: null,
                    expiresAt: new Date('2030-01-01'),
                }),
                markUsed: vi.fn(),
            },
            playerExtraEmailService: { getByEmail: vi.fn(), upsert: vi.fn() },
            sendEmailCore: vi.fn(),
        };

        await expect(verifyEmailCore('no-player-token', deps)).rejects.toBeInstanceOf(ValidationError);
    });

    it('succeeds when email already belongs to the same player', async () => {
        const deps = {
            emailVerificationService: {
                create: vi.fn(),
                getByToken: vi.fn().mockResolvedValue({
                    id: 15,
                    playerId: 7,
                    email: 'player@example.com',
                    usedAt: null,
                    expiresAt: new Date('2030-01-01'),
                }),
                markUsed: vi.fn().mockResolvedValue(undefined),
            },
            playerExtraEmailService: {
                getByEmail: vi.fn().mockResolvedValue({ playerId: 7 }),
                upsert: vi.fn().mockResolvedValue(undefined),
            },
            sendEmailCore: vi.fn(),
        };

        const result = await verifyEmailCore('verify-token', deps);

        expect(deps.playerExtraEmailService.upsert).toHaveBeenCalledWith(7, 'player@example.com', true);
        expect(result.email).toBe('player@example.com');
    });

    it('throws ConflictError when email belongs to another player', async () => {
        const deps = {
            emailVerificationService: {
                create: vi.fn(),
                getByToken: vi.fn().mockResolvedValue({
                    id: 15,
                    playerId: 7,
                    email: 'player@example.com',
                    expiresAt: new Date('2030-01-01T00:00:00.000Z'),
                    usedAt: null,
                }),
                markUsed: vi.fn(),
            },
            playerExtraEmailService: {
                getByEmail: vi.fn().mockResolvedValue({
                    playerId: 99,
                }),
                upsert: vi.fn(),
            },
            sendEmailCore: vi.fn(),
        };

        await expect(verifyEmailCore('verify-token', deps))
            .rejects.toBeInstanceOf(ConflictError);
        expect(deps.playerExtraEmailService.upsert).not.toHaveBeenCalled();
        expect(deps.emailVerificationService.markUsed).not.toHaveBeenCalled();
    });
});

describe('sendEmailVerificationCore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('creates verification and sends email', async () => {
        const deps = {
            emailVerificationService: {
                create: vi.fn().mockResolvedValue(undefined),
                getByToken: vi.fn(),
                markUsed: vi.fn(),
            },
            playerExtraEmailService: {
                getByEmail: vi.fn().mockResolvedValue({
                    playerId: 7,
                    verifiedAt: null,
                }),
                upsert: vi.fn(),
            },
            sendEmailCore: vi.fn().mockResolvedValue(undefined),
        };

        await sendEmailVerificationCore(
            'player@example.com',
            { id: 7, name: 'Alex' },
            deps,
        );

        expect(createVerificationTokenMock).toHaveBeenCalledTimes(1);
        expect(deps.emailVerificationService.create).toHaveBeenCalledWith({
            playerId: 7,
            email: 'player@example.com',
            token: 'verify-token',
            expiresAt: new Date('2030-01-01T00:00:00.000Z'),
        });
        const [verificationEmailPayload] = vi.mocked(deps.sendEmailCore).mock.calls[0] as [{
            to: string;
            subject: string;
            html: string;
        }];
        expect(verificationEmailPayload.to).toBe('player@example.com');
        expect(verificationEmailPayload.subject).toBe('Verify your email address');
        expect(verificationEmailPayload.html).toContain(
            'https://example.test/api/footy/auth/verify/extra-email/verify-token?redirect=%2Ffooty%2Fprofile',
        );
    });

    it('returns early when email is empty', async () => {
        const deps = {
            emailVerificationService: { create: vi.fn(), getByToken: vi.fn(), markUsed: vi.fn() },
            playerExtraEmailService: { getByEmail: vi.fn(), upsert: vi.fn() },
            sendEmailCore: vi.fn(),
        };

        await sendEmailVerificationCore('', undefined, deps);

        expect(deps.sendEmailCore).not.toHaveBeenCalled();
        expect(deps.emailVerificationService.create).not.toHaveBeenCalled();
    });

    it('returns early when email is whitespace only', async () => {
        const deps = {
            emailVerificationService: { create: vi.fn(), getByToken: vi.fn(), markUsed: vi.fn() },
            playerExtraEmailService: { getByEmail: vi.fn(), upsert: vi.fn() },
            sendEmailCore: vi.fn(),
        };

        await sendEmailVerificationCore('   ', undefined, deps);

        expect(deps.sendEmailCore).not.toHaveBeenCalled();
    });

    it('sends email without player name when no player is provided', async () => {
        const deps = {
            emailVerificationService: {
                create: vi.fn().mockResolvedValue(undefined),
                getByToken: vi.fn(),
                markUsed: vi.fn(),
            },
            playerExtraEmailService: { getByEmail: vi.fn(), upsert: vi.fn() },
            sendEmailCore: vi.fn().mockResolvedValue(undefined),
        };

        await sendEmailVerificationCore('user@example.com', undefined, deps);

        expect(deps.playerExtraEmailService.getByEmail).not.toHaveBeenCalled();
        const [emailPayload] = vi.mocked(deps.sendEmailCore).mock.calls[0] as [{ to: string; subject: string; html: string }];
        expect(emailPayload.html).toContain('<p>Hello,</p>');
    });

    it('throws ConflictError when email is already verified', async () => {
        const deps = {
            emailVerificationService: { create: vi.fn(), getByToken: vi.fn(), markUsed: vi.fn() },
            playerExtraEmailService: {
                getByEmail: vi.fn().mockResolvedValue({ playerId: 7, verifiedAt: new Date() }),
                upsert: vi.fn(),
            },
            sendEmailCore: vi.fn(),
        };

        await expect(
            sendEmailVerificationCore('player@example.com', { id: 7, name: 'Alex' }, deps),
        ).rejects.toBeInstanceOf(ConflictError);
        expect(deps.sendEmailCore).not.toHaveBeenCalled();
    });

    it('throws ValidationError when email does not belong to player', async () => {
        const deps = {
            emailVerificationService: {
                create: vi.fn(),
                getByToken: vi.fn(),
                markUsed: vi.fn(),
            },
            playerExtraEmailService: {
                getByEmail: vi.fn().mockResolvedValue({
                    playerId: 88,
                    verifiedAt: null,
                }),
                upsert: vi.fn(),
            },
            sendEmailCore: vi.fn(),
        };

        await expect(sendEmailVerificationCore(
            'player@example.com',
            { id: 7, name: 'Alex' },
            deps,
        )).rejects.toBeInstanceOf(ValidationError);
        expect(deps.emailVerificationService.create).not.toHaveBeenCalled();
        expect(deps.sendEmailCore).not.toHaveBeenCalled();
    });
});
