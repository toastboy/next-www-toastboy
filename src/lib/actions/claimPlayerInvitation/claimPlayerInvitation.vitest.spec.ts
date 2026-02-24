import { describe, expect, it, vi } from 'vitest';

import { claimPlayerInvitationCore, finalizePlayerInvitationClaimCore } from '@/lib/actions/claimPlayerInvitation';
import { AuthError } from '@/lib/errors';

describe('claimPlayerInvitationCore', () => {
    it('returns invitation data for a valid token', async () => {
        const deps = {
            authService: {
                getSessionUser: vi.fn(),
                updateCurrentUser: vi.fn(),
            },
            emailVerificationService: {
                getByToken: vi.fn().mockResolvedValue({
                    id: 22,
                    playerId: 7,
                    email: 'player@example.com',
                    expiresAt: new Date('2030-01-01T00:00:00.000Z'),
                    usedAt: null,
                }),
                markUsed: vi.fn(),
            },
            playerService: {
                getById: vi.fn().mockResolvedValue({
                    id: 7,
                    name: 'Alex Player',
                }),
                update: vi.fn(),
            },
            playerExtraEmailService: {
                getAll: vi.fn(),
                getByEmail: vi.fn().mockResolvedValue(null),
            },
            sendEmailVerificationCore: vi.fn(),
        };

        const result = await claimPlayerInvitationCore('invite-token', deps);

        expect(deps.emailVerificationService.getByToken).toHaveBeenCalledWith('invite-token');
        expect(deps.playerService.getById).toHaveBeenCalledWith(7);
        expect(result).toEqual({
            name: 'Alex Player',
            email: 'player@example.com',
            token: 'invite-token',
        });
    });
});

describe('finalizePlayerInvitationClaimCore', () => {
    it('links the auth user to the invited player and sends verification for unverified extras', async () => {
        const deps = {
            authService: {
                getSessionUser: vi.fn().mockResolvedValue({
                    id: 'auth-user-id',
                    email: 'PLAYER@example.com',
                    playerId: null,
                }),
                updateCurrentUser: vi.fn().mockResolvedValue(undefined),
            },
            emailVerificationService: {
                getByToken: vi.fn().mockResolvedValue({
                    id: 22,
                    playerId: 7,
                    email: 'player@example.com',
                    expiresAt: new Date('2030-01-01T00:00:00.000Z'),
                    usedAt: null,
                }),
                markUsed: vi.fn().mockResolvedValue(undefined),
            },
            playerService: {
                getById: vi.fn().mockResolvedValue({
                    id: 7,
                    name: 'Alex Player',
                }),
                update: vi.fn().mockResolvedValue(undefined),
            },
            playerExtraEmailService: {
                getByEmail: vi.fn().mockResolvedValue(null),
                getAll: vi.fn().mockResolvedValue([
                    { email: 'first@example.com', verifiedAt: null },
                    { email: 'second@example.com', verifiedAt: new Date('2029-01-01T00:00:00.000Z') },
                ]),
            },
            sendEmailVerificationCore: vi.fn().mockResolvedValue(undefined),
        };

        await finalizePlayerInvitationClaimCore('invite-token', deps);

        expect(deps.authService.updateCurrentUser).toHaveBeenCalledWith({ playerId: 7 });
        expect(deps.playerService.update).toHaveBeenCalledWith({
            id: 7,
            accountEmail: 'player@example.com',
        });
        expect(deps.emailVerificationService.markUsed).toHaveBeenCalledWith('invite-token');
        expect(deps.sendEmailVerificationCore).toHaveBeenCalledTimes(1);
        expect(deps.sendEmailVerificationCore).toHaveBeenCalledWith(
            'first@example.com',
            expect.objectContaining({
                id: 7,
                name: 'Alex Player',
            }),
        );
    });

    it('throws AuthError when no session user is available', async () => {
        const deps = {
            authService: {
                getSessionUser: vi.fn().mockResolvedValue(null),
                updateCurrentUser: vi.fn(),
            },
            emailVerificationService: {
                getByToken: vi.fn().mockResolvedValue({
                    id: 22,
                    playerId: 7,
                    email: 'player@example.com',
                    expiresAt: new Date('2030-01-01T00:00:00.000Z'),
                    usedAt: null,
                }),
                markUsed: vi.fn(),
            },
            playerService: {
                getById: vi.fn(),
                update: vi.fn(),
            },
            playerExtraEmailService: {
                getByEmail: vi.fn().mockResolvedValue(null),
                getAll: vi.fn(),
            },
            sendEmailVerificationCore: vi.fn(),
        };

        await expect(finalizePlayerInvitationClaimCore('invite-token', deps))
            .rejects.toBeInstanceOf(AuthError);
        expect(deps.authService.updateCurrentUser).not.toHaveBeenCalled();
        expect(deps.emailVerificationService.markUsed).not.toHaveBeenCalled();
    });
});
