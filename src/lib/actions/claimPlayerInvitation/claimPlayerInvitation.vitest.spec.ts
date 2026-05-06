import { describe, expect, it, vi } from 'vitest';

import { claimPlayerInvitationCore, finalizePlayerInvitationClaimCore } from '@/lib/actions/claimPlayerInvitation';
import { AuthError, ConflictError, NotFoundError, ValidationError } from '@/lib/errors';

const futureDate = new Date('2030-01-01T00:00:00.000Z');
const pastDate = new Date('2020-01-01T00:00:00.000Z');

const baseInvitation = {
    id: 22,
    playerId: 7,
    email: 'player@example.com',
    expiresAt: futureDate,
    usedAt: null,
};

const basePlayer = { id: 7, name: 'Alex Player' };

function makeDeps() {
    return {
        authService: {
            getSessionUser: vi.fn(),
            updateCurrentUser: vi.fn().mockResolvedValue(undefined),
        },
        emailVerificationService: {
            getByToken: vi.fn().mockResolvedValue({ ...baseInvitation }),
            markUsed: vi.fn().mockResolvedValue(undefined),
        },
        playerService: {
            getById: vi.fn().mockResolvedValue({ ...basePlayer }),
            update: vi.fn().mockResolvedValue(undefined),
        },
        playerExtraEmailService: {
            getAll: vi.fn().mockResolvedValue([]),
            getByEmail: vi.fn().mockResolvedValue(null),
        },
        sendEmailVerification: vi.fn().mockResolvedValue(undefined),
    };
}

describe('claimPlayerInvitationCore', () => {
    it('returns invitation data for a valid token', async () => {
        const deps = makeDeps();

        const result = await claimPlayerInvitationCore('invite-token', deps);

        expect(deps.emailVerificationService.getByToken).toHaveBeenCalledWith('invite-token');
        expect(deps.playerService.getById).toHaveBeenCalledWith(7);
        expect(result).toEqual({
            name: 'Alex Player',
            email: 'player@example.com',
            token: 'invite-token',
        });
    });

    it('throws ValidationError for an empty token', async () => {
        const deps = makeDeps();

        await expect(claimPlayerInvitationCore('', deps)).rejects.toBeInstanceOf(ValidationError);
        expect(deps.emailVerificationService.getByToken).not.toHaveBeenCalled();
    });

    it('throws NotFoundError when token is not found', async () => {
        const deps = makeDeps();
        deps.emailVerificationService.getByToken.mockResolvedValue(null);

        await expect(claimPlayerInvitationCore('bad-token', deps)).rejects.toBeInstanceOf(NotFoundError);
    });

    it('throws ConflictError when invitation has already been used', async () => {
        const deps = makeDeps();
        deps.emailVerificationService.getByToken.mockResolvedValue({
            ...baseInvitation,
            usedAt: new Date('2025-01-01T00:00:00.000Z'),
        });

        await expect(claimPlayerInvitationCore('invite-token', deps)).rejects.toBeInstanceOf(ConflictError);
    });

    it('throws ConflictError when invitation has expired', async () => {
        const deps = makeDeps();
        deps.emailVerificationService.getByToken.mockResolvedValue({
            ...baseInvitation,
            expiresAt: pastDate,
        });

        await expect(claimPlayerInvitationCore('invite-token', deps)).rejects.toBeInstanceOf(ConflictError);
    });

    it('throws ValidationError when invitation has no playerId', async () => {
        const deps = makeDeps();
        deps.emailVerificationService.getByToken.mockResolvedValue({
            ...baseInvitation,
            playerId: null,
        });

        await expect(claimPlayerInvitationCore('invite-token', deps)).rejects.toBeInstanceOf(ValidationError);
    });

    it('throws ConflictError when email already belongs to a different player', async () => {
        const deps = makeDeps();
        deps.playerExtraEmailService.getByEmail.mockResolvedValue({ playerId: 999 });

        await expect(claimPlayerInvitationCore('invite-token', deps)).rejects.toBeInstanceOf(ConflictError);
    });

    it('allows claim when extra email already belongs to the same player', async () => {
        const deps = makeDeps();
        deps.playerExtraEmailService.getByEmail.mockResolvedValue({ playerId: 7 });

        const result = await claimPlayerInvitationCore('invite-token', deps);

        expect(result).toEqual({
            name: 'Alex Player',
            email: 'player@example.com',
            token: 'invite-token',
        });
    });

    it('throws NotFoundError when player is not found', async () => {
        const deps = makeDeps();
        deps.playerService.getById.mockResolvedValue(null);

        await expect(claimPlayerInvitationCore('invite-token', deps)).rejects.toBeInstanceOf(NotFoundError);
    });
});

describe('finalizePlayerInvitationClaimCore', () => {
    it('links the auth user to the invited player and sends verification for unverified extras', async () => {
        const deps = makeDeps();
        deps.authService.getSessionUser.mockResolvedValue({
            id: 'auth-user-id',
            email: 'PLAYER@example.com',
            playerId: null,
        });
        deps.playerExtraEmailService.getAll.mockResolvedValue([
            { email: 'first@example.com', verifiedAt: null },
            { email: 'second@example.com', verifiedAt: new Date('2029-01-01T00:00:00.000Z') },
        ]);

        await finalizePlayerInvitationClaimCore('invite-token', deps);

        expect(deps.authService.updateCurrentUser).toHaveBeenCalledWith({ playerId: 7 });
        expect(deps.playerService.update).toHaveBeenCalledWith({
            id: 7,
            accountEmail: 'player@example.com',
        });
        expect(deps.emailVerificationService.markUsed).toHaveBeenCalledWith('invite-token');
        expect(deps.sendEmailVerification).toHaveBeenCalledTimes(1);
        expect(deps.sendEmailVerification).toHaveBeenCalledWith(
            'first@example.com',
            expect.objectContaining({ id: 7, name: 'Alex Player' }),
        );
    });

    it('throws AuthError when no session user is available', async () => {
        const deps = makeDeps();
        deps.authService.getSessionUser.mockResolvedValue(null);

        await expect(finalizePlayerInvitationClaimCore('invite-token', deps)).rejects.toBeInstanceOf(AuthError);
        expect(deps.authService.updateCurrentUser).not.toHaveBeenCalled();
        expect(deps.emailVerificationService.markUsed).not.toHaveBeenCalled();
    });

    it('throws AuthError when session user has no email', async () => {
        const deps = makeDeps();
        deps.authService.getSessionUser.mockResolvedValue({ id: 'auth-user-id', email: null, playerId: null });

        await expect(finalizePlayerInvitationClaimCore('invite-token', deps)).rejects.toBeInstanceOf(AuthError);
        expect(deps.authService.updateCurrentUser).not.toHaveBeenCalled();
    });

    it('throws AuthError when session user email does not match invitation email', async () => {
        const deps = makeDeps();
        deps.authService.getSessionUser.mockResolvedValue({
            id: 'auth-user-id',
            email: 'other@example.com',
            playerId: null,
        });

        await expect(finalizePlayerInvitationClaimCore('invite-token', deps)).rejects.toBeInstanceOf(AuthError);
        expect(deps.authService.updateCurrentUser).not.toHaveBeenCalled();
    });

    it('throws ConflictError when session user is already linked to a different player', async () => {
        const deps = makeDeps();
        deps.authService.getSessionUser.mockResolvedValue({
            id: 'auth-user-id',
            email: 'player@example.com',
            playerId: 999,
        });

        await expect(finalizePlayerInvitationClaimCore('invite-token', deps)).rejects.toBeInstanceOf(ConflictError);
        expect(deps.authService.updateCurrentUser).not.toHaveBeenCalled();
    });

    it('succeeds when session user is already linked to the same player', async () => {
        const deps = makeDeps();
        deps.authService.getSessionUser.mockResolvedValue({
            id: 'auth-user-id',
            email: 'player@example.com',
            playerId: 7,
        });

        await finalizePlayerInvitationClaimCore('invite-token', deps);

        expect(deps.authService.updateCurrentUser).toHaveBeenCalledWith({ playerId: 7 });
        expect(deps.emailVerificationService.markUsed).toHaveBeenCalledWith('invite-token');
    });

    it('does not send verification emails when there are no extra emails', async () => {
        const deps = makeDeps();
        deps.authService.getSessionUser.mockResolvedValue({
            id: 'auth-user-id',
            email: 'player@example.com',
            playerId: null,
        });

        await finalizePlayerInvitationClaimCore('invite-token', deps);

        expect(deps.sendEmailVerification).not.toHaveBeenCalled();
    });

    it('does not send verification emails when all extra emails are already verified', async () => {
        const deps = makeDeps();
        deps.authService.getSessionUser.mockResolvedValue({
            id: 'auth-user-id',
            email: 'player@example.com',
            playerId: null,
        });
        deps.playerExtraEmailService.getAll.mockResolvedValue([
            { email: 'first@example.com', verifiedAt: new Date('2029-01-01T00:00:00.000Z') },
            { email: 'second@example.com', verifiedAt: new Date('2029-06-01T00:00:00.000Z') },
        ]);

        await finalizePlayerInvitationClaimCore('invite-token', deps);

        expect(deps.sendEmailVerification).not.toHaveBeenCalled();
    });

    it('sends verification with undefined player when player lookup returns null', async () => {
        const deps = makeDeps();
        deps.authService.getSessionUser.mockResolvedValue({
            id: 'auth-user-id',
            email: 'player@example.com',
            playerId: null,
        });
        deps.playerExtraEmailService.getAll.mockResolvedValue([
            { email: 'extra@example.com', verifiedAt: null },
        ]);
        deps.playerService.getById.mockResolvedValue(null);

        await finalizePlayerInvitationClaimCore('invite-token', deps);

        expect(deps.sendEmailVerification).toHaveBeenCalledWith('extra@example.com', undefined);
    });
});
