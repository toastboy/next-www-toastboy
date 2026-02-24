import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ConflictError, ValidationError } from '@/lib/errors';

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

import { sendEmailVerificationCore, verifyEmailCore } from '@/lib/actions/verifyEmail';

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
            { id: 7, name: 'Alex' } as never,
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
            { id: 7, name: 'Alex' } as never,
            deps,
        )).rejects.toBeInstanceOf(ValidationError);
        expect(deps.emailVerificationService.create).not.toHaveBeenCalled();
        expect(deps.sendEmailCore).not.toHaveBeenCalled();
    });
});
