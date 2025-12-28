'use server';

import { hashPlayerInvitationToken } from '@/lib/playerInvitation';
import authService from '@/services/Auth';
import playerService from '@/services/Player';
import playerEmailService from '@/services/PlayerEmail';
import playerInvitationService from '@/services/PlayerInvitation';

/**
 * Claims a player invitation using a plaintext token.
 *
 * Validates the token, resolves the invitation from its hashed token, checks
 * usage and expiration, enforces email ownership rules, then resolves the
 * player record for the invitation.
 *
 * @param token - The raw invitation token provided to the player.
 * @returns A promise that resolves with the invitation claim result:
 *          { player, email }.
 *
 * @throws Error If:
 * - Missing invitation token.
 * - Invitation not found or expired (no invitation matching the token hash).
 * - Invitation has already been used.
 * - Invitation has expired.
 * - Email address already belongs to another player.
 *
 * @remarks
 * - The token is hashed via `hashPlayerInvitationToken` before lookup.
 * - The invitation is retrieved with `playerInvitationService.getPlayerInvitationByTokenHash`.
 * - Email uniqueness is checked via `playerEmailService.getPlayerEmailByEmail`; if an
 *   existing email belongs to a different player, the claim is rejected.
 * - To mark the invitation as used and upsert a verified player email, call
 *   `finalizePlayerInvitationClaim` after the login account is created.
 */
async function getValidInvitation(token: string) {
    if (!token) {
        throw new Error('Missing invitation token.');
    }

    const tokenHash = hashPlayerInvitationToken(token);
    const invitation = await playerInvitationService.getByTokenHash(tokenHash);

    if (!invitation) {
        throw new Error('Invitation not found or expired.');
    }

    const now = new Date();
    if (invitation.usedAt) {
        throw new Error('Invitation has already been used.');
    }
    if (invitation.expiresAt <= now) {
        throw new Error('Invitation has expired.');
    }

    const existingEmail = await playerEmailService.getByEmail(invitation.email);
    if (existingEmail && existingEmail.playerId !== invitation.playerId) {
        throw new Error('Email address already belongs to another player.');
    }

    return { invitation, now };
}

export async function claimPlayerInvitation(token: string) {
    const { invitation } = await getValidInvitation(token);
    const player = await playerService.getById(invitation.playerId);

    if (!player) {
        throw new Error('Player not found.');
    }

    return {
        player: player,
        email: invitation.email,
    };
}

export async function finalizePlayerInvitationClaim(token: string) {
    const { invitation, now } = await getValidInvitation(token);
    const loginAccount = await authService.getUserByEmail(invitation.email);

    if (!loginAccount) {
        throw new Error('Login account not found for invitation.');
    }

    await playerEmailService.upsertVerified(invitation.playerId, invitation.email, now);
    await playerInvitationService.markUsed(invitation.id, now);
}
